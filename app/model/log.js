const AbstractModel = require('../abstract-model');

class Log extends AbstractModel {

    constructor(code, date, message, meta, moduleType, moduleName, stack) {

        super();

        this._code = code;
        this._date = date;
        this._message = message;
        this._meta = meta;
        this._moduleType = moduleType;
        this._moduleName = moduleName;
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

    get moduleType() {
        return this._moduleType;
    }

    get moduleName() {
        return this._moduleName;
    }

    get stack() {
        return this._stack;
    }

}

module.exports = Log;