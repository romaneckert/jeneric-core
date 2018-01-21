const AbstractHandler = require('../../../abstract-handler');

class DisconnectHandler extends AbstractHandler {
    constructor() {
        super();
    }

    handle(socket) {
        this.logger.debug('socket disconnect: ' + socket.id);
    }
}

module.exports = DisconnectHandler;