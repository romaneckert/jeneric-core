class Auth {

    constructor() {
        if ('string' !== typeof jeneric.config.secret || 0 === jeneric.config.secret.length) throw new Error('missing config.secret or config.secret is empty');
    }

    async handle(req, res, next) {

        try {

            let user = null;

            // try to get user from token
            if ('string' === typeof req.cookies._t && 0 !== req.cookies._t.length) {
                user = await jeneric.module.auth.getUserFromToken(req.cookies._t);
            }

            // refresh token
            if (null !== user) {

                // generate token
                let token = jeneric.module.auth.generateToken(user);

                // add token to response
                jeneric.module.auth.addTokenToResponse(token, res);
            }

            req.user = res.user = res.locals.user = user;

        } catch (err) {
            jeneric.logger.error('error in auth module', err);
        }

        return next();
    }

}

module.exports = Auth;
