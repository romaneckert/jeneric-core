const Environment = require('./environment');

class Kernel {

    constructor() {
        this._config = null;
        this._services = {};
        this._env = new Environment();
    }

    init(config) {

        this._config = config;

        if ('object' !== typeof this._config.services) throw new Error('config have no services configuration');

        for(let key in this._config.services) {

            let service = this._config.services[key];

            if(!service.active) continue;

            this._services[key] = new service.module(service.config);

        }

    }

    get config() {
        return this._config;
    }

    get services() {
        return this._services;
    }

    get env() {
        return this._env;
    }

}

module.exports = new Kernel();