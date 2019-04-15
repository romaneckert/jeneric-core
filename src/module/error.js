const logger = require('@jeneric/app/src/module/logger');

class Error {

    handleUncaughtException(error) {

        try {
            logger.error(error.message);
            // TODO: optimize
            //logger.error(error.message, error, this.classDefinition, jeneric.util.error.stack(error), 0);
        } catch (err) {
            throw error;
        }

        process.exit(1);
    }

}

module.exports = new Error();
