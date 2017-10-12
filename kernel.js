class Kernel {

    constructor() {

        if ('undefined' === typeof window) {
            this._config = require('./config/' + 'app');
        } else {
            this._config = require('./config/web');
        }

        this._services = {};
        this._models = {};
        this._repositories = {};
        this._utils = {};
        this._handler = {};

    }

    init(config) {

        // get handler
        for(let handler in this._config.handler) {
            this._handler[handler] = new this._config.handler[handler].class();
        }

        // get utils
        for(let util in this._config.utils) {
            this._utils[util] = this._config.utils[util].class
        }

        // merge application specific config with default config
        if('object' === typeof config) this._utils.object.merge(this._config, config);

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

    get repositories() {
        return this._repositories;
    }

}

module.exports = new Kernel();