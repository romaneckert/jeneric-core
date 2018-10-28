const path = require('path');
const express = require('express')();
const helmet = require('helmet');
const http = require('http');
const https = require('https');
const compression = require('compression');
const fs = require('../../util/fs');
const cookieParser = require('cookie-parser')

class Server {

    constructor(config) {

        this.config = config;

        this._pathToKeyPem = path.join(process.cwd(), 'app/config/key.pem');
        this._pathToCertPem = path.join(process.cwd(), 'app/config/cert.pem');

        express.use(helmet());

        express.set('view engine', 'pug');
        express.use(compression());
    }

    _addRoutes(routes) {
        for (let routeName in routes) {
            let route = routes[routeName];

            if ('string' === typeof route.path && 'string' === typeof route.handler) {
                let handler = this._getHandlerFromHandlerString(route.handler);
                express[route.method](route.path, handler.handle.bind(handler));
            } else if ('object' === typeof route) {
                this._addRoutes(route);
            }
        }
    }

    _getHandlerFromHandlerString(handlerString) {
        return handlerString.split('/').reduce((o, i) => o[i], this.container.handler);
    }

    start() {

        // register view paths
        let viewPaths = [];

        for (let directory of this.container.config.directories) {
            viewPaths.push(path.join(directory, 'view/pug'));
        }

        express.set('views', viewPaths);
        express.use(cookieParser());

        let isHttps = true;

        // register middlewares
        for (let m in this.config.middleware) {

            let middlewareName = this.config.middleware[m];

            if ('router' === middlewareName) {
                // register routes
                this._addRoutes(this.config.routes);
            } else {
                express.use(this.container.middleware[middlewareName].handle.bind(this.container.middleware[middlewareName]));
            }
        }

        // check certificates
        if (!fs.existsSync(this._pathToKeyPem) || !fs.existsSync(this._pathToCertPem)) {
            isHttps = false;
            this.logger.warning(`.key and .pem files missing`, [this._pathToKeyPem, this._pathToCertPem]);
        }

        let server = null;

        if (isHttps) {
            // start https server
            server = https.createServer({
                key: fs.readFileSync(this._pathToKeyPem),
                cert: fs.readFileSync(this._pathToCertPem)
            }, express);

            server.listen(this.config.port);
        } else {
            // start http server
            server = http.createServer(express);
            server.listen(this.config.port);
        }

        this.logger.notice(`server started with port ${this.config.port}`);

    }
}

module.exports = Server;
