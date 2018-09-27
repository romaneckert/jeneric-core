const path = require('path');
const express = require('express')();
const core = require('../../index');
const https = require('https');
const compression = require('compression');
const AbstractModule = require('../abstract-module');

class Server extends AbstractModule {

    constructor(config) {

        super();

        this.config = config;

        express.set('views', [path.join(process.cwd(), 'app/view')]);

        express.set('view engine', 'pug');

        express.use(compression());

        for (let routeName in this.config.routes) {

            let route = this.config.routes[routeName];

            express.get(route.path, route.controller);

        }
    }

    start() {
        const server = https.createServer({
            key: core.util.fs.readFileSync(path.join(process.cwd(), 'app/config/key.pem')),
            cert: core.util.fs.readFileSync(path.join(process.cwd(), 'app/config/cert.pem'))
        }, express);

        server.listen(this.config.port);

        this.logger.info(`server started with port ${this.config.port}`);

    }
}

module.exports = Server;