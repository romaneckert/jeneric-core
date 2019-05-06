const app = require('@jeneric/app');

class Mongoose {
    constructor() {
        this.instance = require('mongoose');
        this.config = app.config.mongoose;
    }

    async start() {

        if ('string' !== typeof this.config.url || 0 === this.config.url.length) {
            await app.logger.warning('missing config.mongoose.url');
            return;
        }

        if ('object' !== typeof this.config.connection || null === this.config.connection) {
            await app.logger.warning('missing config.mongoose.connection');
            return;
        }

        this.instance.connection.on('error', async (err) => await app.logger.error(err));
        this.instance.connection.on('disconnected', async () => await app.logger.notice('disconnect from mongodb'));
        this.instance.connection.on('connected', async () => await app.logger.notice('connected to mongodb'));

        this.instance.connect(this.config.url, this.config.connection);
    }

    async stop() {
        this.instance.connection.close();
    }
}

module.exports = Mongoose;
