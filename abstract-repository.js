const Abstract = require('./abstract');

class AbstractRepository extends Abstract {
    constructor() {
        super();

        this._modelName = null;
        this._collection = null;
    }

    init(modelName) {
        this._modelName = modelName;
    }

    get collection() {
        return this._collection;
    }

    set collection(collection) {
        this._collection = collection;
    }

    find(obj, callback) {

        if('object' === typeof this.collection && null !== this._collection) {
            this.collection.find(obj).toArray(function(err, results) {
                if(null === err) {
                    callback(results);
                } else {
                    throw err;
                }
            }.bind(this));
        } else {
            this.logger.error('data service is not ready');
        }
    }

    get modelClass() {
        return this.models[this._modelName];
    }
}

module.exports = AbstractRepository;