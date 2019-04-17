const path = require('path');
const helmet = require('helmet');
const http = require('http');
const https = require('https');
const compression = require('compression');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = require('@jeneric/app');

class Server {

    constructor() {

        this.config = app.config.server;

        this.pathToKeyPem = path.join(app.config.app.path, 'config/key.pem');
        this.pathToCertPem = path.join(app.config.app.path, 'config/cert.pem');

        this.express = express();

        this.express.enable('strict routing');
        this.express.use(helmet());
        this.express.set('view engine', 'pug');
        this.express.use(compression());

        this.express.set('views', path.join(app.config.app.path, 'view'));
        this.express.use(cookieParser());
        this.express.use(bodyParser.urlencoded({ extended: false }));

        let publicPath = path.join(app.config.app.path, 'public');

        if (app.util.fs.isDirectorySync(publicPath)) {
            this.express.use(express.static(publicPath, { maxAge: '30 days' }));
        }

        // add access middleware
        let middleware = {
            access: new (require('@jeneric/app/src/middleware/access'))(),
            error: new (require('@jeneric/app/src/middleware/error'))(),
            notFound: new (require('@jeneric/app/src/middleware/not-found'))()
        };

        this.express.use(middleware.access.handle);

        // add custom middleware and routes
        this.addRoutes(this.config.routes, []);

        // add error middleware
        this.express.use(middleware.error.handle);

        // add notFound middleware
        this.express.use(middleware.notFound.handle);

    }

    get routes() {
        return this.config.routes;
    }

    addRoutes(routes) {

        for (let routeName in routes) {

            let routeConfig = routes[routeName];

            // sanitize routeConfig
            if('string' !== typeof routeConfig.path) routeConfig.path = '/' + routeName;
            if('object' !== typeof routeConfig.methods) routeConfig.methods = ['get'];
            if('object' !== typeof routeConfig.handler) {

                let pathToHandler = path.join(app.config.app.path, 'src/handler', routeName);

                let handler = require(pathToHandler);

                console.log(handler);
            }

            return;

            let handler = undefined;

            try {
                handler = parts.reduce((o, i) => o[i], jeneric.handler);
            } catch (err) {
                handler = undefined;
            }

            if (undefined === handler) {
                for (let k = 1; k <= parts.length; k++) {

                    let firstParts = parts.slice(0);
                    let lastParts = firstParts.splice(-k, k);

                    for (let l = 1; l < lastParts.length; l++) {
                        lastParts[l] = lastParts[l].charAt(0).toUpperCase() + lastParts[l].slice(1);
                    }

                    firstParts.push(lastParts.join(''));

                    try {
                        handler = firstParts.reduce((o, i) => o[i], jeneric.handler);
                    } catch (err) {
                        handler = undefined;
                    }

                    if ('object' === typeof handler) break;

                }
            }

            if (null === handler || 'object' !== typeof handler || 'function' !== typeof handler.handle) {
                jeneric.logger.warning(`route ${routeName} has no handler`);
                continue;
            }

            if ('object' !== typeof route.methods || null === route.methods) {
                jeneric.logger.warning(`route ${routeName} has no methods`);
                continue;
            }

            // register middlewares
            for (let m in this.config.middleware) {

                let middlewareName = this.config.middleware[m];

                switch (middlewareName) {
                    case 'roles':
                        if ('object' === typeof route.roles) {
                            for (let method of route.methods) {
                                this._app[method](route.path, jeneric.middleware[middlewareName].handle.bind(jeneric.middleware[middlewareName]));
                            }
                        }
                        break;
                    case 'handler':
                        for (let method of route.methods) {
                            this._app[method](route.path, handler.handle.bind(handler));
                        }
                        break;
                    default:
                        this._app.use(route.path, jeneric.middleware[middlewareName].handle.bind(jeneric.middleware[middlewareName]));
                        break;
                }
            }

        }
    }

    init() {

        let server = null;

        // check certificates
        if (!app.util.fs.isFileSync(this.pathToKeyPem) || !app.util.fs.isFileSync(this.pathToCertPem)) {
            app.logger.warning(`can not start server: .key and .pem files missing`, [this.pathToKeyPem, this.pathToCertPem]);

            server = this.express;

        } else {
            // start https server
            server = https.createServer({
                key: app.util.fs.readFileSync(this.pathToKeyPem),
                cert: app.util.fs.readFileSync(this.pathToCertPem)
            }, this.express);
        }

        server.listen(this.config.port);

        app.logger.notice(`server started with port ${this.config.port}`);
    }
}

module.exports = Server;
