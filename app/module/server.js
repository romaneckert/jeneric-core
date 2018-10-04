const path = require('path');
const express = require('express')();
const helmet = require('helmet');
const http = require('http');
const https = require('https');
const compression = require('compression');
const AbstractModule = require('../abstract-module');

class Server extends AbstractModule {

    constructor(config) {

        super();

        this.config = config;

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
                express[route.method](route.path, controller.action.bind(controller));
            } else if ('object' === typeof route) {
                this._addRoutes(route);
            }
        }
    }

    start() {

        this._addRoutes(this.config.routes);

        for (let middleware in this.middleware) {
            express.use(this.middleware[middleware].handle.bind(this.middleware[middleware]));
        }

        // TODO: optimize handling missing certificates

        let pathToKeyPem = path.join(process.cwd(), 'app/config/key.pem');
        let pathToCertPem = path.join(process.cwd(), 'app/config/cert.pem');

        let server = null;

        if (!this.fs.existsSync(pathToKeyPem) || !this.fs.existsSync(pathToCertPem)) {

            server = http.createServer(express);
            server.listen(this.config.port);
            this.logger.warning(`server started with http on port ${this.config.port}`);

        } else {

            server = https.createServer({
                key: core.fs.readFileSync(pathToKeyPem),
                cert: core.fs.readFileSync(pathToCertPem)
            }, express);

            server.listen(this.config.port);

            this.logger.notice(`server started with port ${this.config.port}`);

        }

    }
}

module.exports = Server;