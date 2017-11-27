const Abstract = require('./abstract');

class AbstractService extends Abstract {

    constructor() {

        super();

        this._moduleDefinition.type = 'service';
    }

    get ready() {
        return true;
    }

}

module.exports = AbstractService;