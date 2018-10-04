const Abstract = require('./abstract');

class AbstractMiddleware extends Abstract {

    constructor() {
        super('middleware');
    }

}

module.exports = AbstractMiddleware;