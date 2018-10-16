const mongoose = require('mongoose');
const cluster = require('cluster');
const os = require('os');

const objectUtil = require('./util/object');

class Core {

    constructor() {

        this.ready = false;
        this.consoleMode = false;

        this.module = {};
        this.model = {};

    }

    init(...config) {

        // create process for each CPU
        if (cluster.isMaster) {
            for (var i = 0; i < os.cpus().length; i++) cluster.fork();
            return;
        }

        this.config = require('./config');

        // set config env if not set
        if ('string' !== typeof this.config.env) {
            if ('string' === typeof process.env.NODE_ENV) {
                this.config.env = process.env.NODE_ENV;
            } else {
                this.config.env = 'production';
            }
        }

        // merge application specific config with default config
        if ('object' === typeof config && config.length > 0) {
            for (let c in config) {
                objectUtil.merge(this.config, config[c]);
            }
        }

        // instantiate error module at first
        this.module.error = this._instantiate(this.config.module.error, 'module', 'error');

        // handle uncaught exceptions
        process.on('uncaughtException', this.module.error.handleUncaughtException.bind(this.module.error));

        // add model classes to core
        for (let model in this.config.model) {

            let schema = mongoose.Schema(this.config.model[model].config.schema);
            this.model[model] = mongoose.model(model, schema)

        }

        // instantiate all classes except models
        for (let namespace in this.config) {

            if ('model' === namespace) {
                continue;
            }

            let instance = this._instantiate(this.config[namespace], namespace, namespace);

            if (null !== instance) {
                this[namespace] = instance;
            }
        }

        // log informations about start process of core
        if (cluster.worker && cluster.worker.id === 1) {
            this.module.logger.log('application run in env: "' + this.config.env + '"', '', 'core', 'core', undefined, 5);
        }

        // check ready state modules
        this._startCheckModules();

        // TODO: Work on console mode
        // detect console mode
        if ('string' === typeof process.argv[2]) {
            //this.consoleMode = true;
        }

        this.module.mongoose.start();

        if (this.consoleMode) {
            this._loadFixtures();
        } else {
            this.module.server.start();
        }

    }

    _startCheckModules() {

        let states = {};

        setInterval(() => {

            let ready = true;

            for (let name in this.module) {

                if (undefined === states[name]) {
                    states[name] = 0;
                }

                if (undefined === this.module[name].ready || true === this.module[name].ready) {
                    states[name] = 0;
                    return;
                }

                ready = false;
                states[name]++;
                process.stdout.write('wait for module "' + name + '" ' + states[name] + '\r');

            }

            this.ready = ready;

        }, 100);
    }

    async _loadFixtures() {
        if (0 !== process.argv[2].indexOf('fixture:')) {
            return;
        }

        for (let m in this.model) {
            await this.model[m].deleteMany();
        }

        let parts = process.argv[2].split(':');

        if ('object' === typeof this.fixture[parts[1]]) {
            let result = await this.fixture[parts[1]].load();
        }

        this.module.mongoose.disconnect();
    }

    _instantiate(namespace, type, name) {

        if ('object' !== typeof namespace) {
            return null;
        }

        if ('class' in namespace && 'function' === typeof namespace.class) {
            if ('config' in namespace && 'object' === typeof namespace.config) {
                return this._addContainer(new namespace.class(namespace.config), type, name);
            }
            return this._addContainer(new namespace.class(), type, name);
        } else {
            let obj = {};

            for (let key in namespace) {
                let instance = this._instantiate(namespace[key], type, key);

                if (null !== instance) {
                    obj[key] = instance
                }
            }

            return obj;
        }
    }

    _addContainer(instance, type, name) {

        instance._type = type;
        instance._name = name;

        instance.core = this;
        instance.model = this.model;
        instance.env = this.config.env;

        Object.defineProperty(instance, 'module', {
            get: function () {

                let observed = false;

                return new Proxy({}, {
                    get: function (target, moduleName) {

                        return new Proxy(this.core.module[moduleName], {
                            get: function (target, method) {

                                if ('function' === typeof target[method] && !observed) {
                                    this.core.module.observer.observe(name, moduleName, method);
                                    observed = true;
                                }
                                return target[method];
                            }.bind(instance)
                        })
                    }.bind(instance)
                });
            }
        });

        Object.defineProperty(instance, 'logger', {
            get: function () {
                // building layer between real logger service to set the module definition to logger
                return {
                    emergency: function (message, meta, stack) {
                        this.module.logger.log(message, meta, this._type, this._name, stack, 0);
                    }.bind(instance),

                    alert: function (message, meta, stack) {
                        this.module.logger.log(message, meta, this._type, this._name, stack, 1);
                    }.bind(instance),

                    critical: function (message, meta, stack) {
                        this.module.logger.log(message, meta, this._type, this._name, stack, 2);
                    }.bind(instance),

                    error: function (message, meta, stack) {
                        this.module.logger.log(message, meta, this._type, this._name, stack, 3);
                    }.bind(instance),

                    warning: function (message, meta, stack) {
                        this.module.logger.log(message, meta, this._type, this._name, stack, 4);
                    }.bind(instance),

                    notice: function (message, meta, stack) {
                        this.module.logger.log(message, meta, this._type, this._name, stack, 5);
                    }.bind(instance),

                    info: function (message, meta, stack) {
                        this.module.logger.log(message, meta, this._type, this._name, stack, 6);
                    }.bind(instance),

                    debug: function (message, meta, stack) {
                        this.module.logger.log(message, meta, this._type, this._name, stack, 7);
                    }.bind(instance),

                    history: instance.module.logger.history
                };
            }
        });

        return instance;
    }
}

module.exports = new Core();
