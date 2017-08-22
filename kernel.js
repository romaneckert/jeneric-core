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

        if ('object' !== typeof this._config.component) throw new Error('config have no component configuration');

        for(let component in this._config.component) {

            let componentConfig = this._config.component[component];

            if('object' === typeof componentConfig.service) {
                for(let service in componentConfig.service) {
                    let serviceClass = componentConfig.service[service].class;
                    this._services[service] = new serviceClass(componentConfig.service[service].config);
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

    isNode() {
        return 'undefined' === typeof window;
    }

}

module.exports = new Kernel();