const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const io = require('socket.io');

const AbstractService = require('../abstract-service');

/** server module */
class Server extends AbstractService {

    constructor(config) {

        super();

        this._config = {
            directory : 'web',
            mimeTypes : {
                css:    'text/css',
                gif:    'image/gif',
                html:   'text/html',
                jpg:    'image/jpeg',
                js:     'application/x-javascript',
                mp3:    'audio/mpeg',
                pdf:    'application/pdf',
                png:    'image/png',
                svg:    'image/svg+xml'
            }
        };

        this.utils.object.merge(this._config, config);

        this._config.directory = path.join(path.dirname(require.main.filename), this._config.directory);
        this.fileSystem.ensureFolderExists(this._config.directory);

        this._server = http.createServer(this._handleRequest.bind(this));
        this._server.listen(3000);

        this._io = io(this._server);
        this._io.on('connection', this._handleSocketIoConnection.bind(this));
    }

    send(socketId, event) {

        if('string' !== typeof socketId) {
            this.logger.error('no socket id set', socketId);
            return false;
        }

        if('object' !== typeof event) {
            this.logger.error('event is no object', event);
            return false;
        }

        if('object' !== typeof this._io.sockets.connected[socketId]) {
            this.logger.error('socket with id ' + socketId + ' does not exists.');
            return false;
        }

        let socket = this._io.sockets.connected[socketId];

        socket.emit('event', event);
    }

    _handleSocketIoConnection(socket) {

        socket.on('event', function(event) {
            if('object' !== typeof event) {
                this.logger.debug('event is no object', event);
            }

            event.socketId = socket.id;
            this.kernel.handle(event);

        }.bind(this));

        socket.on('disconnect', this._handleSocketDisconnect.bind(this));
    }

    _handleSocketDisconnect() {
        this.logger.debug('socket disconnect');
    }

    _handleRequest(request, response) {

        this.logger.debug(request.method + ': ' + request.url);

        let parsedUrl = url.parse(request.url);
        let pathname = path.join(this._config.directory, parsedUrl.pathname);

        if(!fs.existsSync(pathname)) {
            this.logger.debug('Not found: ' + pathname);
            response.statusCode = 404;
            response.end('Not found.');
            return false;
        }

        if(fs.statSync(pathname).isDirectory()) pathname += '/index.html';

        if(!fs.existsSync(pathname)) {
            this.logger.debug('Not found: ' + pathname);
            response.statusCode = 404;
            response.end('Not found.');
            return false;
        }

        fs.readFile(pathname, (error, data) => {
            if (error) {
                this.logger.debug('Not found: ' + pathname);
                response.statusCode = 404;
                response.end('Not found.');
                return false;
            } else {
                let ext = path.extname(pathname).replace('.', '');

                if ('string' === typeof this._config.mimeTypes[ext]) {
                    response.setHeader('Content-type', this._config.mimeTypes[ext] || 'text/plain');
                    response.end(data);
                } else {
                    response.statusCode = 500;
                    response.end('Error getting the file. mime type not supported.');
                }
            }
        });

        return true;
    }
}

module.exports = Server;