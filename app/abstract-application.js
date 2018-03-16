const Abstract = require('./abstract');

class AbstractApplication extends Abstract {
    constructor(config) {
        super();

        this._moduleDefinition.type = 'core';
        this._moduleDefinition.name = 'application';

        this._kernel.init(config);
    }
}

module.exports = AbstractApplication;