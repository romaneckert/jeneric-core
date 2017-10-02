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
        this._schemas = {};

        for(let modelName in this.kernel.config.models) {

            let schema = this.kernel.config.models[modelName].schema;

            if ('object' !== typeof schema) {
                throw new Error('no schema defined for: ' + modelName);
            }

        }

        // http://mongoosejs.com/docs/advanced_schemas.html

        mongoose.connect(
            'mongodb://' + this._config.db.host + '/' + this._config.db.database,
            {
                useMongoClient : true
            }
        );

        console.log(this._schemas);

    }


}

module.exports = Data;