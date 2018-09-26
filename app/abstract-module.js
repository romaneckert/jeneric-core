const Abstract = require('./abstract');

class AbstractModule extends Abstract {

    constructor() {
        super('service');
    }

    get ready() {
        return true;
    }

}

module.exports = AbstractModule;