const objectUtil = require('../util/object');

class Roles {

    constructor(config) {

        this.config = {
            redirectPath: '/'
        };

        jeneric.util.object.merge(this.config, config);

        this._roles = {};
    }

    init() {
        this._initRoles(jeneric.module.server.routes);
    }

    _initRoles(routes) {

        for (let routeNs in routes) {

            let route = routes[routeNs];

            if ('string' === typeof route.path && 'object' === typeof route.roles) {
                this._roles[route.path] = route.roles;
            }

            if ('object' === typeof route) {
                this._initRoles(route);
            }
        }
    }

    handle(req, res, next) {

        // check route.path from request
        if ('object' !== typeof req.route || 'string' !== typeof req.route.path) {
            throw new Error('can not get route.path from request');
        }

        // get route roles
        let routeRoles = this._roles[req.route.path];

        // check if route has roles
        if ('object' !== typeof routeRoles) throw new Error('route has no roles');

        // check if user has authentificated
        if ('object' !== typeof req.user || 'object' !== typeof req.user.roles) return res.redirect(this.config.redirectPath);

        // check if one role in user roles match route roles
        for (let role of req.user.roles) {
            if (routeRoles.indexOf(role) > -1) return next();
        }

        // redirect to redirect path / maybe sign in route
        return res.redirect(this.config.redirectPath);

    }

}

module.exports = Roles;
