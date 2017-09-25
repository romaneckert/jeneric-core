const AbstractRepository = require('../abstract-repository');

class Log extends AbstractRepository {

    constructor() {
        super('log');
    }
}

module.exports = Log;