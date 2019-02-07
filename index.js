const mongoose = require('mongoose');
const cluster = require('cluster');
const os = require('os');
const path = require('path');

const objectUtil = require('./util/object');
const fsUtil = require('./util/fs');

class Core {

    constructor() {

        this.ready = false;
        this.consoleMode = false;
        this.container = {
            model: {},
            component: {}
        };

    }

    init(...directories) {

        directories.unshift(__dirname);

        // create process for each CPU
        if (cluster.isMaster) {
            for (var i = 0; i < os.cpus().length; i++) cluster.fork();
            return;
        }

        // init default config
        this.config = require('./config');

        // add directories to config - useful for other modules
        this.config.directories = directories;

        // autoload all classes from src folders of given directories
        let classes = {};

        for (let directory of directories) {

            let pathToConfig = path.join(directory, 'config/index.js');

            if (fsUtil.isFileSync(pathToConfig)) {
                this.config = objectUtil.merge(
                    this.config,
                    require(pathToConfig)
                );
            }

            classes = objectUtil.merge(
                classes,
                this._autoload(path.join(directory, 'src'))
            );
        }

        // set config env
        if ('string' === typeof process.env.NODE_ENV) {
            this.config.env = process.env.NODE_ENV;
        } else {
            this.config.env = 'development';
        }

        // add component classes to container
        this.container.component = classes.component;

        let classesToInstantiate = {
            module: classes.module,
            middleware: classes.middleware,
            handler: classes.handler
        };

        this._instantiate(classesToInstantiate, this.config, null, this.container);

        // add config to container
        this.container.config = this.config;

        // handle uncaught exceptions
        process.on('uncaughtException', this.container.module.error.handleUncaughtException.bind(this.container.module.error));

        // add model classes to container
        for (let model in this.config.model) {

            let schema = mongoose.Schema(this.config.model[model].schema);
            this.container.model[model] = mongoose.model(model, schema)

        }

        // log informations about start process of core
        if (cluster.worker && cluster.worker.id === 1) {
            this.container.module.logger.log('application run in env: "' + this.config.env + '"', '', 'core', 'core', undefined, 5);
        }

        // check ready state modules
        this._startCheckModules();

        // TODO: Work on console mode
        // detect console mode
        if ('string' === typeof process.argv[2]) {
            //this.consoleMode = true;
        }

        this.container.module.mongoose.start();

        if (this.consoleMode) {
            this._loadFixtures();
        } else {
            this.container.module.server.start();
        }

        this.container.module.i18n.init();

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

    _instantiate(classes, config, type, instances) {

        if ('object' !== typeof instances) instances = {};

        let setType = false;

        if ('string' !== typeof type) setType = true;

        for (let namespace in classes) {

            if (setType) type = namespace;

            if ('object' === typeof classes[namespace] && 'object' === typeof config[namespace]) {
                instances[namespace] = this._instantiate(classes[namespace], config[namespace], type);
            } else if ('function' === typeof classes[namespace] && 'object' === typeof config[namespace]) {
                instances[namespace] = this._addContainer(new classes[namespace](config[namespace]), type, namespace);
            } else if ('object' === typeof classes[namespace]) {
                instances[namespace] = this._instantiate(classes[namespace], {}, type);
            } else if ('function' === typeof classes[namespace]) {
                instances[namespace] = this._addContainer(new classes[namespace](), type, namespace);
            }
        }

        return instances;
    }

    _autoload(directory) {
        let obj = {};

        if (fsUtil.isDirectorySync(directory)) {

            for (let dirName of fsUtil.readdirSync(directory)) {
                let result = this._autoload(path.join(directory, dirName));

                if ('function' === typeof result) {
                    let key = dirName.split('.')[0];
                    let parts = key.split('-');

                    for (let p in parts) {
                        if (0 == p) {
                            continue;
                        }
                        parts[p] = parts[p].charAt(0).toUpperCase() + parts[p].slice(1)
                    }

                    obj[parts.join('')] = result;
                } else if ('object' === typeof result && null !== result) {
                    obj[dirName] = result;
                }
            }

        } else if (fsUtil.isFileSync(directory)) {

            if ('.js' === path.extname(directory)) {
                return require(directory);
            }

            return null;
        }

        return obj;
    }

    _addContainer(instance, type, name) {

        instance._type = type;
        instance._name = name;

        instance.container = this.container;
        instance.model = this.container.model;
        instance.component = this.container.component;

        Object.defineProperty(instance, 'module', {
            get: function () {

                let observed = false;

                return new Proxy({}, {
                    get: function (target, moduleName) {

                        return new Proxy(this.container.module[moduleName], {
                            get: function (target, method) {

                                if ('function' === typeof target[method] && !observed) {
                                    this.container.module.observer.observe(name, moduleName, method);
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
