const AbstractEntity = require('../../app/abstract-entity');

/**
 * @classDesc log entity
 * @exports common/entity/log
 * @class
 */
class Log extends AbstractEntity {

    /**
     * @constructor
     *
     * @param {String} message
     * @param meta
     * @param {Integer} code
     * @param {Date} date
     * @param stack
     */
    constructor(message, meta, code, date, stack) {

        super();

        this._message = message;
        this._meta = meta;
        this._code = code;
        this._date = date;
        this._stack = stack;

    }

    get message() {
        return this._message;
    }

    get meta() {
        return this._meta;
    }

    get code() {
        return this._code;
    }

    get date() {
        return this._date;
    }

    get stack() {
        return this._stack;
    }

}

module.exports = Log;