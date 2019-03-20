const path = require('path');
const express = require('express');
const helmet = require('helmet');
const https = require('https');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

class Server {

    constructor(config) {

        this.config = config;

        this._pathToKeyPem = path.join(process.cwd(), 'config/key.pem');
        this._pathToCertPem = path.join(process.cwd(), 'config/cert.pem');

        this._app = express();

        this._app.enable('strict routing');
        this._app.use(helmet());
        this._app.set('view engine', 'pug');
        this._app.use(compression());

    }

    _addRoutes(routes) {

        for (let routeName in routes) {

            // find handler from routeName
            let route = routes[routeName];
            let parts = routeName.split('_');

            let handler = undefined;

            try {
                handler = parts.reduce((o, i) => o[i], jeneric.handler);
            } catch (err) { }

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
                    } catch (err) { }

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

    get routes() {
        return this.config.routes;
    }

    init() {

        // check certificates
        if (!jeneric.util.fs.existsSync(this._pathToKeyPem) || !jeneric.util.fs.existsSync(this._pathToCertPem)) {
            jeneric.logger.error(`can not start server: .key and .pem files missing`, [this._pathToKeyPem, this._pathToCertPem]);
            return;
        }

        // register view paths
        let viewPaths = [];

        for (let directory of jeneric.config.directories) {

            let viewPath = path.join(directory, 'view/pug');

            if (jeneric.util.fs.isDirectorySync(viewPath)) {
                viewPaths.push(viewPath);
            }

            let publicPath = path.join(directory, 'public');

            if (jeneric.util.fs.isDirectorySync(publicPath)) {
                this._app.use(express.static(publicPath, { maxAge: '30 days' }));
            }

        }

        this._app.set('views', viewPaths);
        this._app.use(cookieParser());
        this._app.use(bodyParser.urlencoded({ extended: false }));

        // add access middleware
        this._app.use(jeneric.middleware.access.handle.bind(jeneric.middleware.access));

        // add custom middleware and routes
        this._addRoutes(this.config.routes, []);

        // add error middleware
        this._app.use(jeneric.middleware.error.handle.bind(jeneric.middleware.error));

        // add notFound middleware
        this._app.use(jeneric.middleware.notFound.handle.bind(jeneric.middleware.notFound));

    }

    start() {

        // start https server
        let server = https.createServer({
            key: jeneric.util.fs.readFileSync(this._pathToKeyPem),
            cert: jeneric.util.fs.readFileSync(this._pathToCertPem)
        }, this._app);

        server.listen(this.config.port);
        jeneric.logger.notice(`server started with port ${this.config.port}`);
    }
}

module.exports = Server;
