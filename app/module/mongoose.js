const mongoose = require('mongoose');
const AbstractModule = require('../abstract-module');

class Mongoose extends AbstractModule {
    constructor(config) {

        super();

        this._db = {};
        this._ready = false;

        mongoose.connection.on('error', (err) => {
            this.logger.error(err);
        });

        mongoose.connection.on('disconnected', (err) => {
            this.logger.info('disconnect from mongodb');
            this._ready = false;
        });

        mongoose.connection.on('connected', (err, client) => {
            this.logger.info('connected to mongodb');
            this._ready = true;
        });

        let settings = {
            useNewUrlParser: true,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 1000
        };

        mongoose.connect(config.uri, settings);

        return mongoose;

    }
}

module.exports = Mongoose;