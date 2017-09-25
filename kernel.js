class Kernel {

    constructor() {

        if('undefined' === typeof window) {
            this._config = require('./config/' + 'app');
        } else {
            this._config = require('./config/web');
        }

        this._services = {};
        this._classes = {};

    }

    init(config) {

        // merge application specific config with default config
        if('object' === typeof config) Object.assign(this._config, config);

        // instantiate services
        for(let serviceName in this._config.service) {

            let service = this._config.service[serviceName];

            this._services[serviceName] = new service.class(service.config);

        }

        // make classes application wide available
        for(let type in this._config) {

            let classes = this._config[type];

            for(let className in classes) {
                if('function' === typeof classes[className].class) {
                    if('object' !== typeof this._classes[type]) this._classes[type] = {};
                    this._classes[type][className] = classes[className].class;
                }
            }
        }
    }

    get config() {
        return this._config;
    }

    get services() {
        return this._services;
    }

    get classes() {
        return this._classes;
    }

}

module.exports = new Kernel();