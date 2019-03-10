const objectUtil = require('../util/object');

class Roles {

    constructor(config) {

        this.config = {
            redirectPath: '/'
        };

        objectUtil.merge(this.config, config);

        this._roles = {};

        for (let routeNs in this.config.routes) {

            let route = this.config.routes[routeNs];

            if ('string' === typeof route.path && 'object' === typeof route.roles) {
                this._roles[path] = route.roles;
            }

            if ('object' === typeof route) {
                return this._getRolesFromPath(route.path, route);
            }
        }

        console.log(this._roles);

    }

    handle(req, res, next) {

        if ('object' !== typeof req.route || 'string' !== typeof req.route.path) {
            throw new Error('can not get route path from request');
        }

        let routeRoles = this._roles[req.route.path];

        if ('object' !== typeof routeRoles) throw new Error('route has no roles');

        if (0 === roles.length) return next();

        if ('object' !== typeof req.user || 'object' !== typeof req.user.roles) {
            return res.redirect(this.config.redirectPath);
        }

        for (let role of req.user.roles) {
            if (this._roles.indexOf(role) > -1) {
                return next();
            }
        }

        return res.redirect(this.config.redirectPath);

    }

}

module.exports = Roles;
