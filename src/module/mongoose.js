const mongoose = require('mongoose');
const objectUtil = require('../util/object');

class Mongoose {
    constructor(config) {

        this.instance = mongoose;

        this._config = {
            connection: {
                useNewUrlParser: true,
                reconnectTries: Number.MAX_VALUE,
                reconnectInterval: 1000
            }
        };

        objectUtil.merge(this._config, config);
    }

    init() {
        mongoose.connection.on('error', (err) => {
            this.logger.error(err);
        });

        mongoose.connection.on('disconnected', (err) => {
            this.logger.notice('disconnect from mongodb');
        });

        mongoose.connection.on('connected', (err, client) => {
            this.logger.notice('connected to mongodb');
        });

        if ('string' !== typeof this._config.url || 0 === this._config.url.length) {
            this.logger.error('missing uri for mongodb');
            return;
        }

        mongoose.connect(this._config.url, this._config.connection);
    }
}

module.exports = Mongoose;
