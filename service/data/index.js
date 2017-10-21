const AbstractData = require('./abstract-data');
const mongodb = require('mongodb').MongoClient;

class Data extends AbstractData {
    constructor(config) {

        super();

        this._db = null;

        // default config
        this._config = {};

        this.utils.object.merge(this._config, config);

        // get schemas
        this._repositories = {};

        //
        for(let modelName in this.kernel.config.models) {

            this._repositories[modelName] = new this.kernel.config.repositories[modelName].class();
            this._repositories[modelName].init(modelName);

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

    _createCollections() {

        for(let modelName in this._repositories) {
            this._db.createCollection(
                modelName,
                {
                    'capped': false
                },
                this._handleCreateCollection.bind(this)
            );
        }

    }

    _handleCreateCollection(err, result) {

        if(
            null === err &&
            'object' === typeof result &&
            'object' === typeof result.s &&
            'string' === typeof result.s.name
        ) {
            let modelName = result.s.name;

            this._repositories[modelName].collection = this._db.collection(modelName);

            this.logger.debug('Collection "' + modelName + '" created.');
        } else {
            this.logger.error('Can not create collection.');
        }
    }

    _handleDBConnection(err, db) {
        if(null === err) {
            this._db = db;
            this.logger.debug('Connection to database ' + this._config.db.database + ' established.');
            this._createCollections();
        } else {
            this.logger.error('Can not connect to database ' + this._config.db.database + '.');
        }
    }

    add(rawObj) {

        let modelName = rawObj.modelName;

        let obj = {};

        for (let attribute in rawObj) {
            if (-1 === ['_instanceId', '_modelName'].indexOf(attribute)) obj[attribute] = rawObj[attribute];
        }

        this._repositories[modelName].collection.insertOne(obj, function(err) {
            if(null !== err) throw err;
        });
    }

    get ready() {

        let ready = true;

        for(let modelName in this._repositories) {
            if('object' !== typeof this._repositories[modelName].collection || null === this._repositories[modelName].collection) {
                ready = false;
            }
        }

        return ready;
    }

    get repositories() {
        return this._repositories;
    }

}

module.exports = Data;