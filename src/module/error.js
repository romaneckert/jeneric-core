class Error {

    handleUncaughtException(error) {

        try {
            jeneric.module.logger.log(error.message, error, this.classDefinition, jeneric.util.error.stack(error), 0);
        } catch (err) {
            throw error;
        }

        process.exit(1);
    }

}

module.exports = Error;
