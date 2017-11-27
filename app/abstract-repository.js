const Abstract = require('./abstract');

class AbstractRepository extends Abstract {
    constructor() {

        super();

        this._moduleDefinition.type = 'repository';

        this._collection = null;
    }

    get collection() {
        return this._collection;
    }

    set collection(collection) {
        this._collection = collection;
    }

    find(obj, callback) {

        if(
            'object' === typeof this.collection &&
            null !== this._collection
        ) {

            this.logger.debug('find in ' + this.entityName, obj);

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

    get entityName() {
        return this.constructor.name.toLowerCase();
    }
}

module.exports = AbstractRepository;