const Abstract = require('./abstract');

class AbstractService extends Abstract {

    constructor() {
        super('service');
    }

    get ready() {
        return true;
    }

}

module.exports = AbstractService;