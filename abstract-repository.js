const Abstract = require('./abstract');
const mongoose = require('mongoose');

class AbstractRepository extends Abstract {
    constructor() {
        super();

        this._modelName = null;
        this._schema = null;
        this._mongooseModel = null;
    }

    init(modelName, schema) {
        this._modelName = modelName;
        this._schema = schema;

        this._mongooseSchema = mongoose.Schema(this._schema);
        this._mongooseModel = mongoose.model(this._modelName, this._mongooseSchema);
    }

    get modelClass() {
        return this.models[this._modelName];
    }

    find() {
        this._mongooseModel.find().exec();
    }
}

module.exports = AbstractRepository;