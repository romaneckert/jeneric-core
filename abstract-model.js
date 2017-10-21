class AbstractModel {
    constructor(modelName) {
        this._modelName = modelName;
    }

    get id() {
        return this._id;
    }

    get modelName() {
        return this._modelName;
    }
}

module.exports = AbstractModel;


