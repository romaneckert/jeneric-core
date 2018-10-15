const mongoose = require('mongoose');
const Module = require('../../module');
const objectUtil = require('../../util/object');

class Mongoose extends Module {
    constructor(config) {

        super();

        this._db = {};

        this._config = {
            connection: {
                useNewUrlParser: true,
                reconnectTries: Number.MAX_VALUE,
                reconnectInterval: 1000
            }
        };

        objectUtil.merge(this._config, config);

        mongoose.connection.on('error', (err) => {
            this.logger.error(err);
        });

        mongoose.connection.on('disconnected', (err) => {
            this.logger.notice('disconnect from mongodb');
        });

        mongoose.connection.on('connected', (err, client) => {
            this.logger.notice('connected to mongodb');
        });

        mongoose.connect(config.uri, this._config.connection);

        return mongoose;

    }
}

module.exports = Mongoose;
