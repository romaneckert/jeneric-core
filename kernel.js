class Kernel {

    constructor() {
        /*
        if('undefined' !== typeof global) {
            if('undefined' !== typeof global.kernel) return global.kernel;
            global.kernel = this;
        }

        if('undefined' !== typeof window) {
            if('undefined' !== typeof window.kernel) return window.kernel;
            window.kernel = this;
        }*/

        this._config = {};
        this._services = {};

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

}

module.exports = new Kernel();