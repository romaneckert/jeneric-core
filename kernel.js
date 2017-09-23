class Kernel {

    constructor() {

        if(this.isNode()) {
            this._config = require('./config/' + 'app');
        } else {
            this._config = require('./config/web');
        }

        this._services = {};

    }

    init(config) {

        Object.assign(this._config, config);

        for(let serviceName in this._config.service) {

            let service = this._config.service[serviceName];

            this._services[serviceName] = new service.class(service.config);

        }

    }

    get config() {
        return this._config;
    }

    get services() {
        return this._services;
    }

    isNode() {
        return 'undefined' === typeof window;
    }

}

module.exports = new Kernel();