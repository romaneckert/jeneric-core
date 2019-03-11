const jwt = require('jsonwebtoken');

class Auth {

    handle(req, res, next) {

        try {

            if ('string' !== typeof req.cookies._t || req.cookies._t.length === 0) return next();

            let decoded = jwt.verify(req.cookies._t, this.container.config.core.secret);

            if ('object' === typeof decoded.data.user
                && null !== decoded.data.user
                && 'string' === typeof decoded.data.user.email
                && 'object' === typeof decoded.data.user.roles) {

                req.user = decoded.data.user;
            }

        } catch (err) {
            this.logger.error('error in auth module', err);
        }

        return next();
    }

}

module.exports = Auth;
