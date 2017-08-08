const Abstract = require('./abstract');

class Entity extends Abstract {
    constructor(entityName) {
        super();
        this._id = null;
        this._entityName = entityName;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    get entityName() {
        return this._entityName
    }
}

module.exports = Entity;


