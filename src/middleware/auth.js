const jwt = require('jsonwebtoken');

class Auth {

    async handle(req, res, next) {

        try {

            if ('string' !== typeof jeneric.config.secret) throw new Error('missing config.secret');

            if ('string' !== typeof req.cookies._t || req.cookies._t.length === 0) return next();

            let decoded = jwt.verify(req.cookies._t, jeneric.config.secret);

            if ('object' === typeof decoded.user
                && null !== decoded.user
                && 'string' === typeof decoded.user.email
                && 'object' === typeof decoded.user.roles) {

                let user = await jeneric.model.user.findOne({ email: decoded.user.email });

                req.user = res.user = res.locals.user = user;
            }

        } catch (err) {
            jeneric.logger.error('error in auth module', err);
        }

        return next();
    }

}

module.exports = Auth;
