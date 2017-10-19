const Abstract = require('./abstract');
class AbstractRepository extends Abstract {
    constructor() {
        super();

        this._modelName = null;
        this._schema = null;
    }

    init(modelName, schema) {
        this._modelName = modelName;
        this._schema = schema;
    }

    get modelClass() {
        return this.models[this._modelName];
    }
}

module.exports = AbstractRepository;