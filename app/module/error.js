const AbstractModule = require('../abstract-module');

class Error extends AbstractModule {
    constructor() {
        super();
    }

    handleUncaughtException(error) {

        try {
            this.core.module.logger.log(error.message, null, this.classDefinition, this.util.error.stack(error), 0);
        } catch (err) {
            throw error;
        }

        process.exit(1);
    }
}

module.exports = Error;