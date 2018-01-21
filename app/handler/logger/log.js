const AbstractHandler = require('../../abstract-handler');

/**
 * @classDesc handler class to handle new log entries. can be overridden by application
 * @exports app/handler/logger/log
 * @class
 */
class LogHandler extends AbstractHandler {

    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * @param {common/entity/log} log the log entity
     */
    handle(log) {

    }
}

module.exports = LogHandler;