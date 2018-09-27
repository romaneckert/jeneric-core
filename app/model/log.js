const AbstractModel = require('../abstract-model');

class Log extends AbstractModel {

    constructor(code, date, message, meta, classType, className, stack) {

        super();

        this._code = code;
        this._date = date;
        this._message = message;
        this._meta = meta;
        this._classType = classType;
        this._className = className;
        this._stack = stack;

    }

    get code() {
        return this._code;
    }

    get date() {
        return this._date;
    }

    get message() {
        return this._message;
    }

    get meta() {
        return this._meta;
    }

    get classType() {
        return this._classType;
    }

    get className() {
        return this._className;
    }

    get stack() {
        return this._stack;
    }

}

module.exports = Log;