const mongodb = require('mongodb').MongoClient;
const AbstractService = require('../abstract-service');

/**
 * @classDesc data service to communicate with mongodb
 * @exports app/service/data
 * @class
 */
class Data extends AbstractService {


    /**
     * @constructor
     * @param {object} config
     */
    constructor(config) {

        super();

        this._db = null;

        // default config
        this._config = {};

        this.utils.object.merge(this._config, config);

        for(let entityName in this._kernel.config.entities) {
            this[entityName] = new this._kernel.config.repositories[entityName].class();
        }

        //let url = 'mongodb://127.0.0.2/blub';
        let url = 'mongodb://' + this._config.db.host + '/' + this._config.db.database;

        mongodb.connect(
            url,
            {
                connectTimeoutMS : 5000
            },
            this._handleDBConnection.bind(this)
        );

    }

    get ready() {

        for(let entityName in this._kernel.config.entities) {
            if( 'object' !== typeof this[entityName].collection ||
                null === this[entityName].collection
            ) {
                return false;
            }
        }

        return true;
    }

    add(rawObj) {

        if( 'object' !== typeof rawObj ||
            'function' !== typeof rawObj.constructor ||
            'string' !== typeof rawObj.constructor.name
        ) {
            this.logger.error('can not add object', rawObj);
            return false;
        }

        let entityName = rawObj.constructor.name.toLowerCase();

        let obj = {};

        for (let attribute in rawObj) {

            // prevent insert _id with null
            if('_id' === attribute) continue;

            if (-1 === ['_entityName'].indexOf(attribute)) obj[attribute] = rawObj[attribute];
        }

        this[entityName].collection.insertOne(obj, function(err) {
            if(null !== err) throw err;
        });
    }

    _handleDBConnection(err, client) {
        if(null === err) {
            this._db = client.db(this._config.db.database);
            this.logger.info('Connection to database ' + this._config.db.database + ' established.');
            this._db.collections(this._handleGetCollectionNames.bind(this));
        } else {
            this.logger.error('Can not connect to database ' + this._config.db.database + '.');
        }
    }

    _handleGetCollectionNames(err, collections) {

        if(null !== err) {
            this.logger.error('can not get existing collection names');
            return false;
        }

        for(let entityName in this._kernel.config.entities) {

            let collectionExists = false;

            for(let collectionKey in collections) {
                let collection = collections[collectionKey];
                if(
                    'object' === typeof collection &&
                    'object' === typeof collection.s &&
                    'string' === typeof collection.s.name &&
                    collection.s.name === entityName
                ) {
                    collectionExists = true;
                    this[entityName].collection = this._db.collection(entityName);
                }
            }

            if(!collectionExists) {
                this._db.createCollection(
                    entityName,
                    {
                        'capped': false
                    },
                    this._handleCreateCollection.bind(this)
                );
            }
        }
    }

    _handleCreateCollection(err, result) {

        if(
            null === err &&
            'object' === typeof result &&
            'object' === typeof result.s &&
            'string' === typeof result.s.name
        ) {
            let entityName = result.s.name;

            this[entityName].collection = this._db.collection(entityName);

            this.logger.debug('Collection "' + entityName + '" created.');
        } else {
            this.logger.error('Can not create collection.');
        }
    }

}

module.exports = Data;