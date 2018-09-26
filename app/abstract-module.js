const Abstract = require('./abstract');

class AbstractModule extends Abstract {

    constructor() {
        super('module');
    }

    get ready() {
        return true;
    }

}

module.exports = AbstractModule;