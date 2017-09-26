const AbstractLogger = require('./abstract-logger');
const Log = require('../../model/log');

class Logger extends AbstractLogger {
    constructor() {
        super();
    }

    _log(message, meta, type) {

        message = this.utils.string.cast(message);
        meta = this.utils.string.cast(meta);
        let err = new Error();
        let callStack = 'undefined' === typeof err.stack ? null : err.stack;

        let log = new Log(message, meta, type, new Date(), callStack);

        this.data.persist(log);

        let output = '[' + log.dateString + '] [' + log.type + ']'
            + ((null !== log.module) ? ' [' + log.module + ']' : '')
            + ' ' + log.message;

        if('error' === log.type || 'critical' === log.type) {
            if('undefined' !== typeof meta) {
                console.error(output, meta);
            } else {
                console.error(output);
            }
        } else {
            if('undefined' !== typeof meta) {
                console.log(output, meta);
            } else {
                console.log(output);
            }
        }
    }
}

module.exports = Logger;