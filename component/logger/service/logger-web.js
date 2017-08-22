const AbstractLogger = require('./abstract-logger');
const Log = require('../entity/log');

class Logger extends AbstractLogger {
    constructor() {
        super();
    }

    _log(message, meta, type) {

        let log = new Log(message, meta, type);

        let output = '[' + log.dateString + '] [' + log.type + ']'
            + ((null !== log.module) ? ' [' + log.module + ']' : '')
            + ' ' + log.message;

        if('error' === log.type) {
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