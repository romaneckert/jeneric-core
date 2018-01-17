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

        // try to make data to entities
        if('object' === typeof event.data) {
            for(let entityNameMultiple in event.data) {

                let entityName = this.utils.string.toSingle(entityNameMultiple);

                if('undefined' === typeof this.entities[entityName]) continue;

                for(let entryIndex in event.data[entityNameMultiple]) {
                    event.data[entityNameMultiple][entryIndex] = this.utils.object.merge(new this.entities[entityName](), event.data[entityNameMultiple][entryIndex]);
                }

            }
        }

        this.logger.debug('handle event socket/' + event.handler);

        this.handler['socket'][event.handler].handle(event);
    }
}

module.exports = Socket;