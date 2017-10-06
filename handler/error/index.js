const AbstractHandler = require('../../abstract-handler');

class Error extends AbstractHandler {
    constructor() {
        super();

        process.on('uncaughtException', this.handle.bind(this));
    }

    handle(error) {

        try {
            this.logger.critical(error.message, null, this.utils.error.stack(error));
        } catch(logError) {
            throw error;
        }

        process.exit(1);
    }
}

module.exports = Error;