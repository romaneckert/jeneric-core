const AbstractService = require('../abstract-service');

class Socket extends AbstractService {
    constructor() {
        super();

        this._socket = null;

        if('function' === typeof io) {
            this._socket = io(window.location.href);
            this._socket.on('event', this._handleEvent.bind(this));
        }
    }

    _handleEvent(event) {

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

module.exports = Socket;