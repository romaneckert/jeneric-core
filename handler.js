const Container = require('./container');

class Handler extends Container {

    constructor() {
        super('handler');
    }

    handle() {
        throw new Error('handler must implement handler method.');
    }

}

module.exports = Handler;
