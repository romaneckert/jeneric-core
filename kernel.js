class Kernel {

    constructor() {

        this._config = {};
        this._services = {};

    }

    init(config) {

        this._config = config;

        if ('object' !== typeof this._config.services) throw new Error('config have no services configuration');

        for(let key in this._config.services) {

            let service = this._config.services[key];

            if(false === service.active || 0 === service.active) continue;

            this._services[key] = new service.module(service.config);

        }

        if('undefined' === typeof this._services.logger) {
            this._services.logger = {
                debug : function(message, meta) {
                    console.log(message, meta)
                },
                info : function(message, meta) {
                    console.log(message, meta)
                },
                error : function(message, meta) {
                    console.error(message, meta)
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

}

module.exports = new Kernel();