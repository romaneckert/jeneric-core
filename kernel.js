class Kernel {

    constructor() {

        this._config = {};

        if(this.isNode()) {
            this._config = require('./config/' + 'app');
        } else {
            this._config = require('./config/web');
        }


        this._services = {};

    }

    init(config) {

        Object.assign(this._config, config);

        if ('object' !== typeof this._config.service) throw new Error('config have no service configuration');

        for(let service in this._config.service) {

            let serviceClass = this._config.service[service].class;
            this._services[service] = new serviceClass(this._config.service[service].config);

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