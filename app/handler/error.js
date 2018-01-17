const AbstractHandler = require('../abstract-handler');

class ErrorHandler extends AbstractHandler {
    constructor() {
        super();
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

module.exports = ErrorHandler;