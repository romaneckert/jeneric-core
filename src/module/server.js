const path = require('path');
const express = require('express')();
const helmet = require('helmet');
const http = require('http');
const https = require('https');
const compression = require('compression');
const Module = require('../../module');
const fs = require('../../util/fs');

class Server extends Module {

    constructor(config) {

        super();

        this.config = config;

        this._pathToKeyPem = path.join(process.cwd(), 'app/config/key.pem');
        this._pathToCertPem = path.join(process.cwd(), 'app/config/cert.pem');

        express.use(helmet());

        express.set(
            'views',
            [
                path.join(__dirname, '../view'),
                path.join(__dirname), path.join(process.cwd(), 'app/view')
            ]
        );

        express.set('view engine', 'pug');
        express.use(compression());
    }

    _addRoutes(routes) {
        for (let routeName in routes) {
            let route = routes[routeName];

            if ('string' === typeof route.path) {
                let controller = new route.class();
                express[route.method](route.path, controller.handle.bind(controller));
            } else if ('object' === typeof route) {
                this._addRoutes(route);
            }
        }
    }

    start() {

        let isHttps = true;

        // register routes
        this._addRoutes(this.config.routes);

        // register middlewares
        for (let middleware in this.middleware) {
            express.use(this.middleware[middleware].handle.bind(this.middleware[middleware]));
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
            this.logger.notice(`server started with port ${this.config.port}`);
        } else {
            // start http server
            server = http.createServer(express);
            server.listen(this.config.port);
            this.logger.notice(`server started on port ${this.config.port}`);
        }

    }
}

module.exports = Server;
