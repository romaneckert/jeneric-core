const AbstractKernel = require('./abstract-kernel');

class Kernel extends AbstractKernel {

    constructor() {

        super();

    }

    _registerErrorHandling() {

        window.onerror = function(message, url, lineNumber, columnNumber, object) {

            if('object' === typeof this.services && 'object' === typeof this.services.logger) {
                this.services.logger.critical(message);
                return true;
            }

            return false;

        }.bind(this);

    }
}

module.exports = new Kernel();