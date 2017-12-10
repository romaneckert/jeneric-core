const ModuleDefinition = require('../common/module-definition');

class Kernel {

    constructor() {

        this._config = require('./config');
        this._services = {};
        this.entities = {};
        this.utils = {};
        this.handler = {};

        this._moduleDefinition = new ModuleDefinition();
        this._moduleDefinition.type = 'core';
        this._moduleDefinition.name = 'kernel';
    }

    init(config) {

        // get utils
        for(let util in this._config.utils) {
            this.utils[util] = this._config.utils[util].class
        }

        // merge application specific config with default config
        if('object' === typeof config) this.utils.object.merge(this._config, config);

        // load additional utils which are in custom config
        for(let util in this._config.utils) {
            if('undefined' === typeof this.utils[util]) {
                this.utils[util] = this._config.utils[util].class;
            }
        }

        // get handler
        for(let handler in this._config.handler) {
            this.handler[handler] = new this._config.handler[handler].class();
        }

        // handle uncaught exceptions
        process.on('uncaughtException', this.handleUncaughtException.bind(this));

        // make entities application wide available
        for(let entityName in this._config.entities) {
            this.entities[entityName] = this._config.entities[entityName].class;
        }

        // instantiate services
        for(let serviceName in this._config.services) {

            let service = this._config.services[serviceName];

            this._services[serviceName] = new service.class(service.config);

        }
    }

    handle(event) {
        if('object' !== typeof event) {
            this._services.logger.error('event is no object', event);
            return false;
        }

        if('string' !== typeof event.handler) {
            this._services.logger.error('event has no handler', event);
            return false;
        }

        if('object' !== typeof this.handler[event.handler]) {
            this._services.logger.error('event handler ' + event.handler + ' does not exists');
            return false;
        }

        this.handler[event.handler].handle(event);
    }

    handleUncaughtException(error) {
        this.handler.error.handle(error);
    }

    get services() {
        return this._services;
    }

    get ready() {

        for(let serviceName in this._services) {

            let service = this._services[serviceName];

            if (!service.ready) return false;

        }

        return true;
    }

    getModuleNameByClass(clazz) {
        let path = [];
        this._getConfigPathByAttribute(this._config, 'class', clazz, path);

        if(path.length > 1) {
            // removes first path segement like service or handler
            path.shift();
            return path.join('/');
        }

        return null;
    }

    _getConfigPathByAttribute(obj, searchAttr, searchValue, path) {

        for(let attribute in obj) {

            if(attribute === searchAttr && obj[attribute] === searchValue) {
                return true;
            }  else {
                if('object' === typeof obj[attribute]) {
                    if(this._getConfigPathByAttribute(obj[attribute], searchAttr, searchValue, path)) {
                        path.unshift(attribute);
                        return true;
                    }
                }
            }
        }

        return false;
    }

    get config() {
        return this._config;
    }

}

module.exports = new Kernel();