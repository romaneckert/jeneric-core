const ModuleDefinition = require('../common/module-definition');

/**
 * @exports app/kernel
 * @class
 */
class Kernel {

    constructor() {

        this._config = require('./config');
        this._services = {};
        this.entities = {};
        this.utils = {};
        this._handler = {};

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

        this._instantiateHandler(this._handler, this._config.handler);

        // handle uncaught exceptions
        process.on('uncaughtException', this._handler.error.handle.bind(this));

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

    /**
     *
     * instantiate handler of config.handler object recursive
     *
     * @param handler
     * @param handlerConfig
     * @private
     */
    _instantiateHandler(handler, handlerConfig) {

        for(let conf in handlerConfig) {

            if('function' === typeof handlerConfig[conf].class) {
                handler[conf] = new handlerConfig[conf].class();
            } else {
                handler[conf] = {};
                this._instantiateHandler(handler[conf], handlerConfig[conf]);
            }
        }

        return true;
    }

    /**
     * @returns {object} handler
     */
    get handler() {
        return this._handler;
    }

    /**
     * @returns {object} services
     */
    get services() {
        return this._services;
    }

    /**
     * @returns {boolean} ready
     */
    get ready() {

        for(let serviceName in this._services) {
            if (!this._services[serviceName].ready) return false;
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