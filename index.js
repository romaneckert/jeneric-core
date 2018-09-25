const path = require('path');

class Core {

    constructor() {
        this.ready = false;
        this.consoleMode = false;
    }

    init(config) {

        this.config = require('./app/config');

        this.config.core = {
            path: {}
        };

        this.util = {};

        // get util
        for (let util in this.config.util) {
            this.util[util] = new this.config.util[util].class()
        }

        // merge application specific config with default config
        if ('object' === typeof config) this.util.object.merge(this.config, config);

        // instantiate all classes
        for (let namespace in this.config) {

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
