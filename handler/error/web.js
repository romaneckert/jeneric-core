const AbstractHandler = require('../../abstract-handler');

class Error extends AbstractHandler {
    constructor() {
        super();

        window.onerror = this.handle.bind(this);
    }

    handle(message) {

        try {
            this.logger.critical(message);
            return true;
        } catch(logError) {}

        return false;
    }
}

module.exports = Error;