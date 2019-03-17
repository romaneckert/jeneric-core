const jwt = require('jsonwebtoken');

class Auth {

    handle(req, res, next) {

        try {

            if ('string' !== typeof jeneric.config.secret) throw new Error('missing config.secret');

            if ('string' !== typeof req.cookies._t || req.cookies._t.length === 0) return next();

            let decoded = jwt.verify(req.cookies._t, jeneric.config.secret);

            if ('object' === typeof decoded.data.user
                && null !== decoded.data.user
                && 'string' === typeof decoded.data.user.email
                && 'object' === typeof decoded.data.user.roles) {

                req.user = decoded.data.user;
            }

        } catch (err) {
            jeneric.logger.error('error in auth module', err);
        }

        return next();
    }

}

module.exports = Auth;
