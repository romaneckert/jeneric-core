const AbstractKernel = require('./abstract-kernel');

class Kernel extends AbstractKernel {

    constructor() {

        super();

    }

    _registerErrorHandling() {

        process.on('uncaughtException', function (error) {

            if('object' === typeof this.services && 'object' === typeof this.services.logger) {
                this.services.logger.critical(error.message, null, this.utils.error.stack(error));
            } else {
                throw error;
            }

            process.exit(1);

        }.bind(this));

    }
}

module.exports = new Kernel();