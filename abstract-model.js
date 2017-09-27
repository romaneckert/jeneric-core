class AbstractModel {
    constructor(modelName, schema) {
        this._id = null;
        this._modelName = modelName;
        this._schema = schema;
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


