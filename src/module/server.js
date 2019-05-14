const path = require('path');
const helmet = require('helmet');
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

        this.server = null;
        this.router = null;

    }

    async start() {

        this.router = express();

        this.router.enable('strict routing');
        this.router.use(helmet());
        this.router.use(compression());
        this.router.use(cookieParser());
        this.router.use(bodyParser.urlencoded({extended: false}));

        let publicPath = path.join(app.config.app.path, 'public');

        if (await app.util.fs.isDirectory(publicPath)) {
            this.router.use(express.static(publicPath, {maxAge: '30 days'}));
        }

        // add access middleware
        let middleware = {
            access: new (require('@jeneric/app/src/middleware/access'))(),
            error: new (require('@jeneric/app/src/middleware/error'))(),
            notFound: new (require('@jeneric/app/src/middleware/not-found'))()
        };

        this.router.use(middleware.access.handle);

        // add custom middleware and routes
        this.addRoutes(this.config.routes, []);

        // add error middleware
        this.router.use(middleware.error.handle);

        // add notFound middleware
        this.router.use(middleware.notFound.handle);

        this.router.engine('pug', app.module.renderer.render.bind(app.module.renderer));
        this.router.set('views', path.join(app.config.app.path, 'view/template'));
        this.router.set('view engine', 'pug');

        let server = null;

        // check certificates
        if (!await app.util.fs.isFile(this.pathToKeyPem) || !await app.util.fs.isFile(this.pathToCertPem)) {
            await app.logger.warning(`.key and .pem files missing`, [this.pathToKeyPem, this.pathToCertPem]);
            server = this.router;
        } else {
            // start https server
            server = https.createServer({
                key: await app.util.fs.readFile(this.pathToKeyPem),
                cert: await app.util.fs.readFile(this.pathToCertPem)
            }, this.router);
        }

        this.server = server.listen(this.config.port);

        await app.logger.notice(`server started with port ${this.config.port}`);
    }

    render(path, locals) {

        return new Promise((resolve, reject) => {

            if ('object' !== typeof locals || null === locals) {
                locals = {};
            }

            this.router.render(path, locals, (err, html) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(html);
                }
            });
        });
    }

    async stop() {
        this.server.close();
    }

    addRoutes(routes) {

        for (let routeName in routes) {

            let route = routes[routeName];
            let handler = null;

            // sanitize routeConfig
            if ('string' !== typeof route.path) route.path = '/' + routeName;
            if ('object' !== typeof route.methods) route.methods = ['get'];

            if ('object' !== typeof route.handler) {
                let pathToHandler = path.join(app.config.app.path, 'src/handler', routeName);
                handler = new (require(pathToHandler))();
            } else {
                handler = route.handler;
            }

            if ('function' !== typeof handler.handle) {
                throw new Error(`${routeName} has no valid handler`);
            }

            // register middlewares
            for (let m in this.config.middleware) {

                let middlewareName = this.config.middleware[m];
                let middleware = null;

                switch (middlewareName) {
                    case 'roles':
                        if ('object' === typeof route.roles) {
                            middleware = new (require(path.join(app.config.app.path, 'src/middleware', middlewareName)))();
                            for (let method of route.methods) {
                                this.router[method](route.path, middleware.handle.bind(middleware));
                            }
                        }
                        break;
                    case 'handler':
                        for (let method of route.methods) {
                            this.router[method](route.path, handler.handle.bind(handler));
                        }
                        break;
                    default:
                        middleware = new (require(path.join(app.config.app.path, 'src/middleware', middlewareName)))();
                        this.router.use(route.path, middleware.handle.bind(middleware));
                        break;
                }
            }

        }
    }
}

module.exports = Server;
