const AbstractService = require('../../abstract-service');

class AbstractLogger extends AbstractService {
    constructor() {
        super();
    }

    debug(message, meta) {
        this._log(message, meta, 'debug');
    }

    info(message, meta) {
        this._log(message, meta, 'info');
    }

    error(message, meta) {
        this._log(message, meta, 'error');
    }
}

module.exports = AbstractLogger;