const AbstractEntity = require('../../app/abstract-entity');

class Log extends AbstractEntity {

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