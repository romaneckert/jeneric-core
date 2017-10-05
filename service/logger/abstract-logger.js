const AbstractService = require('../../abstract-service');

class AbstractLogger extends AbstractService {
    constructor() {
        super();

        this._levels = [
            {
                code: 0,
                name: 'emergency'
            },
            {
                code: 1,
                name: 'alert'
            },
            {
                code: 2,
                name: 'critical'
            },
            {
                code: 3,
                name: 'error'
            },
            {
                code: 4,
                name: 'warning'
            },
            {
                code: 5,
                name: 'notice'
            },
            {
                code: 6,
                name: 'info'
            },
            {
                code: 7,
                name: 'debug'
            }
        ];
    }

    emergency(message, meta, stack) {
        this._log(message, meta, stack, 0);
    }

    alert(message, meta, stack) {
        this._log(message, meta, stack, 1);
    }

    critical(message, meta, stack) {
        this._log(message, meta, stack, 2);
    }

    error(message, meta, stack) {
        this._log(message, meta, stack, 3);
    }

    warning(message, meta, stack) {
        this._log(message, meta, stack, 4);
    }

    notice(message, meta, stack) {
        this._log(message, meta, stack, 5);
    }

    info(message, meta, stack) {
        this._log(message, meta, stack, 6);
    }

    debug(message, meta, stack) {
        this._log(message, meta, stack, 7);
    }

    /**
     * @param code
     * @returns {*}
     * @private
     */
    _getLevelByCode(code) {
        for(let level of this._levels) {
            if(level.code === code) return level;
        }
        return null;
    }

    /**
     * @param date
     * @returns {string}
     * @private
     */
    _dateStringFromDate(date) {
        return date.getFullYear()
            + '-'
            + ('0' + (date.getMonth() + 1)).slice(-2)
            + '-'
            + ('0' + date.getDate()).slice(-2)
            + ' '
            + date.toTimeString().slice(0,8);
    }

}

module.exports = AbstractLogger;