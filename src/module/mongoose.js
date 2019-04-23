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

        if ('string' !== typeof this.config.url || 0 === this.config.url.length) {
            app.logger.warning('missing config.mongoose.url');
            return;
        }

        if ('object' !== typeof this.config.connection || null === this.config.connection) {
            app.logger.warning('missing config.mongoose.connection');
            return;
        }

        this.instance.connect(this.config.url, this.config.connection);
    }
}

module.exports = Mongoose;
