const Services = require('./services');

class Kernel {

    constructor() {

        this._config = null;
        this._services = new Services();
        this._initialized = false;
    }

    init(config) {

        this._config = config;

        if ('object' !== typeof this._config.services) throw new Error('config have no modules configuration');

        for(let key in this._config.services) {

            let configuration = this._config.services[key];

            if(!configuration.active) continue;

            this._services[key] = new configuration.module(configuration.options);

        }

        this._initialized = true;

        //this.services.logger.debug('all services are initialized');
    }

    get config() {
        return this._config;
    }

    get services() {

        if(!this._initialized) throw new Error('kernel not initialized, please call kernel.init');

        return this._services;
    }

}

module.exports = new Kernel();