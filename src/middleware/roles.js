const objectUtil = require('../util/object');

class Roles {

    constructor(config) {

        this._config = {
            redirectPath: '/'
        };

        objectUtil.merge(this._config, config);

        this._paths = {};

    }

    handle(req, res, next) {

        if ('object' !== typeof req.route || 'string' !== typeof req.route.path) {
            throw new Error('can not get route path from request');
        }

        let roles = this._getRolesFromPath(req.route.path, this.container.config.module.server.routes);

        if (0 === roles.length) return next();

        if ('object' !== typeof req.user || 'object' !== typeof req.user.roles) {
            return res.redirect(this._config.redirectPath);
        }

        for (let role of req.user.roles) {
            if (this._roles.indexOf(role) > -1) {
                return next();
            }
        }

        return res.redirect(this._config.redirectPath);

    }

    _getRolesFromPath(path, routes) {

        if ('object' === typeof this._paths[path]) return this._paths[path];

        for (let routeNs in routes) {

            let route = routes[routeNs];

            if ('string' === typeof route.path && 'object' === typeof route.roles) {
                this._paths[path] = route.roles;
                return route.roles;
            }

            if ('object' === typeof route) {
                return this._getRolesFromPath(path, route);
            }
        }

        return [];

    }

}

module.exports = Roles;
