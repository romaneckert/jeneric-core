const path = require('path');
const express = require('express')();
const https = require('https');
const http = require('http');
const compression = require('compression');
const AbstractModule = require('../abstract-module');

class Server extends AbstractModule {

    constructor(config) {

        super();

        this.config = config;

        express.set(
            'views',
            [
                path.join(__dirname, '../view'),
                path.join(__dirname), path.join(process.cwd(), 'app/view')
            ]
        );

        express.set('view engine', 'pug');

        express.use(compression());

        for (let routeName in this.config.routes) {

            let route = this.config.routes[routeName];

            express.get(route.path, route.controller);

        }
    }

    start() {

        // TODO: optimize handling missing certificates

        let pathToKeyPem = path.join(process.cwd(), 'app/config/key.pem');
        let pathToCertPem = path.join(process.cwd(), 'app/config/cert.pem');

        if (!this.util.fs.existsSync(pathToKeyPem) || !this.util.fs.existsSync(pathToCertPem)) {
            express.listen(3000, () => {
                this.logger.error(`server started without https on port ${this.config.port}`);
            });
        } else {
            const server = https.createServer({
                key: core.util.fs.readFileSync(pathToKeyPem),
                cert: core.util.fs.readFileSync(pathToCertPem)
            }, express);

            server.listen(this.config.port);

            this.logger.info(`server started with port ${this.config.port}`);

        }

    }
}

module.exports = Server;