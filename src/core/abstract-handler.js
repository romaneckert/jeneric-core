const Abstract = require('./abstract');

class AbstractHandler extends Abstract {

    constructor() {
        super('handler');
    }

    handle() {
        throw new Error('handler must implement handler method.');
    }

}

module.exports = AbstractHandler;