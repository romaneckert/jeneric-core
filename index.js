const mongoose = require('mongoose');
const cluster = require('cluster');
const os = require('os');

const ClassDefinition = require('./app/class-definition');

class Core {

    constructor() {

        this._classDefinition = new ClassDefinition('core', 'core');

        this.ready = false;
        this.consoleMode = false;

        this.util = {};
        this.module = {};
        this.model = {};

    }

    init(config) {

        if (cluster.isMaster) {
            // Count the machine's CPUs
            var cpuCount = os.cpus().length;

            // Create a worker for each CPU
            for (var i = 0; i < cpuCount; i++) {
                cluster.fork();
            }

            return;

        }

        this.config = require('./app/config');

        // instantiate object util at first, because it used to merge configs
        this.util.object = this._instantiate(this.config.util.object);

        // merge application specific config with default config
        if ('object' === typeof config) this.util.object.merge(this.config, config);

        // instantiate error module at first
        this.module.error = this._instantiate(this.config.module.error);

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

            let instance = this._instantiate(this.config[namespace]);

            if (null !== instance) {
                this[namespace] = instance;
            }
        }

        // check ready state modules
        this._startCheckModules();

        // detect console mode
        if ('string' === typeof process.argv[2]) {
            this.consoleMode = true;
        }

        if (this.consoleMode) {
            this._loadFixtures();
        } else {
            this.module.server.start();
        }

        // TODO: only in main cluster process
        this.module.logger.log('application run in env: ' + process.env.NODE_ENV);

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

    _instantiate(namespace) {

        if ('object' !== typeof namespace) {
            return null;
        }

        if ('class' in namespace && 'function' === typeof namespace.class) {
            if ('config' in namespace && 'object' === typeof namespace.config) {
                return new namespace.class(namespace.config);
            }
            return new namespace.class();
        } else {
            let obj = {};

            for (let key in namespace) {
                let instance = this._instantiate(namespace[key]);

                if (null !== instance) {
                    obj[key] = instance
                }
            }

            return obj;
        }
    }
}

module.exports = new Core();