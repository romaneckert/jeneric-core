class AbstractModel {
    constructor(modelName) {
        this._id = null;
        this._modelName = modelName;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    get modelName() {
        return this._modelName;
    }
}

module.exports = AbstractModel;


