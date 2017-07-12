const Modules = require('./modules');

class Kernel {

    constructor() {
        this._config = {};
        this._modules = new Modules();
    }

    get config() {
        return this._config;
    }

    get modules() {
        return this._modules;
    }

}

module.exports = Kernel;