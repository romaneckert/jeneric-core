const path = require('path');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const https = require('https');
const compression = require('compression');
const fs = require('../util/fs');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

class Server {

    constructor(config) {

        this.config = config;

        this._pathToKeyPem = path.join(process.cwd(), 'config/key.pem');
        this._pathToCertPem = path.join(process.cwd(), 'config/cert.pem');

        this._app = express();

        this._app.use(helmet());
        this._app.set('view engine', 'pug');
        this._app.use(compression());
    }

    _addRoutes(routes, namespace) {

        for (let routeNs in routes) {

            let currentNamespace = namespace.slice();
            currentNamespace.push(routeNs);

            if ('string' === typeof routes[routeNs].path) {

                let handler = currentNamespace.reduce((o, i) => o[i], this.container.handler);

                if ('object' !== typeof handler || 'function' !== typeof handler.handle) {
                    this.logger.warning(`route ${routes[routeNs].path} has no handler. Please create a handler with method 'handle' in path: ${path.join('src/handler', currentNamespace.join('/'))}`);
                    continue;
                }

                if ('object' !== typeof routes[routeNs].methods) {
                    this.logger.warning(`route ${routes[routeNs].path} has no methods`);
                    continue;
                }

                for (let method of routes[routeNs].methods) {
                    this._app[method](routes[routeNs].path, handler.handle.bind(handler));
                }

            } else {
                this._addRoutes(routes[routeNs], currentNamespace);
            }

        }
    }

    start() {

        // register view paths
        let viewPaths = [];

        for (let directory of this.container.config.directories) {

            let viewPath = path.join(directory, 'view/pug');

            if (fs.isDirectorySync(viewPath)) {
                viewPaths.push(viewPath);
            }

            let publicPath = path.join(directory, 'public');

            if (fs.isDirectorySync(publicPath)) {
                this._app.use(express.static(publicPath, { maxAge: '30 days' }));
            }

        }

        this._app.set('views', viewPaths);
        this._app.use(cookieParser());
        this._app.use(bodyParser.urlencoded({ extended: false }));

        let isHttps = true;

        // register middlewares
        for (let m in this.config.middleware) {

            let middlewareName = this.config.middleware[m];

            if ('router' === middlewareName) {
                // register routes
                this._addRoutes(this.config.routes, []);
            } else {
                this._app.use(this.container.middleware[middlewareName].handle.bind(this.container.middleware[middlewareName]));
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
            }, this._app);

            server.listen(this.config.port);
        } else {
            // start http server
            server = http.createServer(this._app);
            server.listen(this.config.port);
        }

        this.logger.notice(`server started with port ${this.config.port}`);

    }
}

module.exports = Server;
