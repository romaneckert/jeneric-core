const Abstract = require('./abstract');

class AbstractApplication extends Abstract {
    constructor(config) {
        super('application');

        this._kernel.init(config);
    }
}

module.exports = AbstractApplication;