const mongoose = require('mongoose');

class Mongoose {
    constructor(config) {

        this.instance = mongoose;

        this.config = {
            connection: {
                useNewUrlParser: true,
                reconnectTries: Number.MAX_VALUE,
                reconnectInterval: 1000
            }
        };

        jeneric.util.object.merge(this.config, config);
    }

    init() {
        mongoose.connection.on('error', (err) => {
            jeneric.logger.error(err);
        });

        mongoose.connection.on('disconnected', (err) => {
            jeneric.logger.notice('disconnect from mongodb');
        });

        mongoose.connection.on('connected', (err, client) => {
            jeneric.logger.notice('connected to mongodb');
        });

        if ('string' !== typeof this.config.url || 0 === this.config.url.length) {
            jeneric.logger.error('missing uri for mongodb');
            return;
        }

        mongoose.connect(this.config.url, this.config.connection);
    }
}

module.exports = Mongoose;
