class Kernel {

    constructor() {

        if ('undefined' === typeof window) {
            this._config = require('./config/' + 'app');
        } else {
            this._config = require('./config/web');
        }

        this._services = {};
        this._models = {};
        this._utils = {};
        this._handler = {};
    }

    init(config) {

        // get utils
        for(let util in this._config.utils) {
            this._utils[util] = this._config.utils[util].class
        }

        // merge application specific config with default config
        if('object' === typeof config) this._utils.object.merge(this._config, config);

        // get handler
        for(let handler in this._config.handler) {
            this._handler[handler] = new this._config.handler[handler].class();
        }

        // make models application wide available
        for(let modelName in this._config.models) {
            this._models[modelName] = this._config.models[modelName].class;
        }

        // instantiate services
        for(let serviceName in this._config.services) {

            let service = this._config.services[serviceName];

            this._services[serviceName] = new service.class(service.config);

        }
    }

    handle(event) {
        if('object' !== typeof event) {
            this.services.logger.error('event is no object', event);
            return false;
        }

        if('string' !== typeof event.handler) {
            this.services.logger.error('event has no handler', event);
            return false;
        }

        if('object' !== typeof this.handler[event.handler]) {
            this.services.logger.error('event handler ' + event.handler + ' does not exists');
            return false;
        }

        this.handler[event.handler].handle(event);
    }

    get config() {
        return this._config;
    }

    get utils() {
        return this._utils;
    }

    get handler() {
        return this._handler;
    }

    get services() {
        return this._services;
    }

    get models() {
        return this._models;
    }

}

module.exports = new Kernel();