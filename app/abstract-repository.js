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

    find(obj, options, callback) {

        if(
            'object' === typeof this.collection &&
            null !== this._collection
        ) {

            this.logger.debug('find in ' + this.entityName, {obj: obj, options: options});

            let cursor = this.collection.find(obj);

            if('object' === typeof options) {
                if('number' === typeof options.limit) {
                    cursor.limit(options.limit);
                }

                if('object' === typeof options.sort) {
                    cursor.sort(options.sort);
                }
            }

            cursor.toArray(function(err, results) {
                if(null !== err) throw err;

                let instances = [];

                for(let entry of results) {

                    let instance = new this.entities[this.entityName]();

                    entry = Object.assign(instance, entry);

                    instances.push(entry);
                }

                callback(results);

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