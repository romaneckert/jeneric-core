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

            let schema = this.kernel.config.models[modelName].schema;

            if ('object' !== typeof schema) throw new Error('no schema defined for: ' + modelName);

            let repositoryClassInstance = new this.kernel.config.repositories[modelName].class();
            repositoryClassInstance.init(modelName, schema);

            this._repositories[modelName] = repositoryClassInstance;

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

    _handleDBConnection(err, db) {
        if(null === err) {
            this._db = db;
            this.logger.debug('Connection to database ' + this._config.db.database + ' established.');
        } else {
            this.logger.error('Can not connect to database ' + this._config.db.database + '.');
        }
    }

    get repositories() {
        return this._repositories;
    }


}

module.exports = Data;