const AbstractData = require('./abstract-data');
const mongoose = require('mongoose');

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

            this._repositories[modelName] = new this.kernel.config.repositories[modelName].class();
            this._repositories[modelName].init(modelName, schema);

        }

        // http://mongoosejs.com/docs/advanced_schemas.html
        this._db = mongoose.connect(
            'mongodb://' + this._config.db.host + '/' + this._config.db.database,
            {
                useMongoClient : true
            }
        );

        this._db.on('error', this._handleDBConnectionError.bind(this));
        this._db.once('open', this._handleDBConnectionSuccess.bind(this));

    }

    _handleDBConnectionError(error) {
        this.logger.debug('Can not connect to database ' + this._config.db.database + '.');
        throw error;
    }

    _handleDBConnectionSuccess() {
        this.logger.debug('Connection to database ' + this._config.db.database + ' established.');
    }


}

module.exports = Data;