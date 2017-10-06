const AbstractLogger = require('./abstract-logger');
const Log = require('../../model/log');

class Logger extends AbstractLogger {
    constructor() {
        super();
    }

    _log(message, meta, stack, code) {

        let levelName = this._getLevelNameByCode(code);
        let date = new Date();

        message = this.utils.string.cast(message);
        meta = this.utils.string.cast(meta);

        let output = '[' + this._dateStringFromDate(date) + '] ';
        output += '[' + levelName + '] ';
        output += message;

        if(code < 3) {
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