const errorUtil = require('../util/error');

class Error {

    handleUncaughtException(error) {

        try {
            this.container.module.logger.log(error.message, error, this.classDefinition, errorUtil.stack(error), 0);
        } catch (err) {
            throw error;
        }

        process.exit(1);
    }
}

module.exports = Error;
