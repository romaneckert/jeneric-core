const AbstractModel = require('../abstract-model');

class Log extends AbstractModel {

    constructor(message, meta, code, date, stack) {

        super('log');

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