const Abstract = require('./abstract');

class AbstractService extends Abstract {
    constructor() {
        super();

        this._config = {};
    }

    get config() {
        return this._config;
    }

}

module.exports = AbstractService;