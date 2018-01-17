const AbstractHandler = require('../../../abstract-handler');

class ConnectionHandler extends AbstractHandler {
    constructor() {
        super();
    }

    handle(socket) {

        this.logger.debug('new socket connection');

        socket.on('event', function(event) {

            if('object' !== typeof event) {
                this.logger.error('event is no object', event);
                return false;
            }

            if('string' !== typeof event.handler) {
                this.logger.error('event has no handler', event);
                return false;
            }

            if('object' !== typeof this.handler[event.handler]) {
                this.logger.error('event handler ' + event.handler + ' does not exists');
                return false;
            }

            event.socketId = socket.id;

            this.handler[event.handler].handle(event);


        }.bind(this));

        socket.on('disconnect', function() {
            this.logger.debug('socket disconnect: ' + socket.id);
        }.bind(this));

    }
}

module.exports = ConnectionHandler;