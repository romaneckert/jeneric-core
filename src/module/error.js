class Error {

    handleUncaughtException(error) {

        try {
            console.error(error.message);
            // TODO: optimize
            //logger.error(error.message, error, this.classDefinition, jeneric.util.error.stack(error), 0);
        } catch (err) {
            throw error;
        }

        process.exit(1);
    }

}

module.exports = Error;
