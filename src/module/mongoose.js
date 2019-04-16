const app = require('@jeneric/app');

class Mongoose {
    constructor() {
        this.instance = require('mongoose');
        this.config = app.config.mongoose;
    }

    init() {
        this.instance.connection.on('error', (err) => app.logger.error(err));
        this.instance.connection.on('disconnected', () => app.logger.notice('disconnect from mongodb'));
        this.instance.connection.on('connected', () => app.logger.notice('connected to mongodb'));
    }

    start() {

        if ('string' !== typeof this.config.url || 0 === this.config.url.length) {
            this.logger.warning('missing config.module.mongoose.url');
            return
        }

        if ('string' !== typeof this.config.connection || 0 === this.config.connection.length) {
            this.logger.warning('missing config.module.mongoose.connection');
            return
        }

        this.instance.connect(this.config.url, this.config.connection);
    }
}

module.exports = Mongoose;
