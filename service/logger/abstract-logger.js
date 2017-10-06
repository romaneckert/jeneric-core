const AbstractService = require('../../abstract-service');

class AbstractLogger extends AbstractService {
    constructor() {
        super();

        this._config = {
            levels : {
                emergency : {
                    code : 0
                },
                alert : {
                    code : 1
                },
                critical : {
                    code : 2
                },
                error : {
                    code : 3,
                },
                warning : {
                    code : 4,
                },
                notice : {
                    code : 5
                },
                info : {
                    code : 6
                },
                debug : {
                    code : 7
                }
            }
        };

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
    _getLevelNameByCode(code) {
        for(let levelName in this._config.levels) {
            if(this._config.levels[levelName].code === code) return levelName;
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