const Services = require('./services');
const Environment = require('./environment');

class Kernel {

    constructor() {

        this._config = null;
        this._services = new Services();
        this._env = new Environment();
        this._initialized = false;

        Object.assign(global, require('./globals'));
    }

    init(config) {

        this._config = config;

        if ('object' !== typeof this._config.services) throw new Error('config have no services configuration');

        for(let key in this._config.services) {

            let service = this._config.services[key];

            if(!service.active) continue;

            this._services[key] = new service.module(service.config);

        }

        this._initialized = true;

    }

    get config() {
        return this._config;
    }

    get services() {

        if(!this._initialized) throw new Error('kernel not initialized, please call kernel.init');

        return this._services;
    }

    get env() {
        return this._env;
    }

}

module.exports = new Kernel();