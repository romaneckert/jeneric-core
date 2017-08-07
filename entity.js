const Abstract = require('./abstract');

class Entity extends Abstract {
    constructor() {
        super();
        this._id = null;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    get entityName() {
        return this.constructor.name.toLowerCase();
    }
}

module.exports = Entity;


