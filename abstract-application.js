const Abstract = require('./abstract');

class AbstractApplication extends Abstract {
    constructor(config) {
        super();
        this.kernel.init(config);
    }
}

module.exports = AbstractApplication;