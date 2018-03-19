const Abstract = require('./abstract');

class AbstractApplication extends Abstract {
    constructor(config) {
        super('core');

        this._kernel.init(config);
    }
}

module.exports = AbstractApplication;