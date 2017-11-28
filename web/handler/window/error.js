const AbstractHandler = require('../../abstract-handler');

class Error extends AbstractHandler {
    constructor() {
        super();
    }

    handle(event) {
        if(
            'object' === typeof event &&
            'object' === typeof event.originalEvent &&
            'object' === typeof event.originalEvent.error
        ) {

            let error = event.originalEvent.error;
            let message = event.originalEvent.error.message;
            let stack = this.utils.error.stack(error);

            try {
                this.logger.critical(message, undefined, stack);
                event.preventDefault();
            } catch(error) {
                console.log(error);
            }
        }
    }
}

module.exports = Error;