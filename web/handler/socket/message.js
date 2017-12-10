const AbstractHandler = require('../../abstract-handler');

class MessageHandler extends AbstractHandler {
    constructor() {
        super();
    }

    handle(event) {

        if('string' !== typeof event.handler) {
            this.logger.error('event has no handler attribute', event);
            return false;
        }

        if('object' !== typeof this.handler['socket'] || 'object' !== typeof this.handler['socket'][event.handler]) {
            this.logger.error('handler does not exists: socket/' + event.handler, event);
            return false;
        }

        this.logger.debug('handle event socket/' + event.handler);

        this.handler['socket'][event.handler].handle(event);

    }
}

module.exports = MessageHandler;