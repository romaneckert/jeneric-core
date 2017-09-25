const AbstractModel = require('../abstract-model');

class Log extends AbstractModel {

    constructor(message, meta, type) {

        super('log');

        switch (typeof message) {
            case 'string':
                message = String(message.split("\n"));
                break;
            case 'object':
                message = [JSON.stringify(message)];
                break;
            case 'undefined':
                message = null;
                break;
            default:
                message = [String(message)];
                break;
        }

        switch (typeof meta) {
            case 'string':
                meta = String(meta.split("\n"));
                break;
            case 'object':
                meta = JSON.stringify(meta);
                break;
            case 'undefined':
                meta = null;
                break;
            default:
                meta = String(meta);
                break;
        }

        this._message = message;
        this._meta = meta;
        this._type = type;

        this._date = new Date();

        let e = new Error();
        this._callStack = 'undefined' === typeof e.stack ? null : e.stack;
    }

    get date() {
        return this._date;
    }

    get dateString() {

        return this.date.getFullYear()
            + '-'
            + ('0' + (this.date.getMonth() + 1)).slice(-2)
            + '-'
            + ('0' + this.date.getDate()).slice(-2)
            + ' '
            + this.date.toTimeString().slice(0,8);
    }

    get message() {
        return this._message;
    }

    get type() {
        return this._type;
    }

    get callStack() {
        return this._callStack;
    }

    get meta() {
        return this._meta;
    }

    get module() {

        if(null === this._callStack) return null;

        let module = this.callStack.split(" at ")[4].split('(')[0].trim();

        return (0 === module.indexOf('new')) ? module.replace('new ', '') + '.constructor' : module;
    }
}

module.exports = Log;