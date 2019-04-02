const jwt = require('jsonwebtoken');

module.exports = class Auth {

    constructor() {
        if ('string' !== typeof jeneric.config.secret || 0 === jeneric.config.secret.length) throw new Error('missing config.secret or config.secret is empty');
        if ('number' !== typeof jeneric.config.tokenExpiresIn || 0 === jeneric.config.tokenExpiresIn) throw new Error('missing config.tokenExpires or config.tokenExpires is 0');
    }

    generateToken(user) {

        // validate user data in token
        if ('object' !== typeof user || null === user
            || 'string' !== typeof user.email || 0 === user.email.length
            || 'object' !== typeof user.roles || 0 === user.roles.length) {

            return null;
        }

        return jwt.sign(
            {
                user: {
                    email: user.email,
                    roles: user.roles
                }
            },
            jeneric.config.secret,
            {
                expiresIn: jeneric.config.tokenExpiresIn
            }
        );

    }

    addTokenToResponse(token, res) {

        if ('string' !== typeof token || 0 === token.length) return;

        res.cookie('_t', token, {
            expires: new Date(Date.now() + jeneric.config.tokenExpiresIn * 1000),
            httpOnly: true,
            sameSite: 'Strict',
            secure: true
        });
    }

    async getUserFromToken(token) {
        try {
            let decoded = jwt.verify(token, jeneric.config.secret);

            // validate user data in token
            if ('object' !== typeof decoded.user || null === decoded.user
                || 'string' !== typeof decoded.user.email || 0 === decoded.user.email.length
                || 'object' !== typeof decoded.user.roles || 0 === decoded.user.roles.length) {

                return null;
            }

            let user = await jeneric.model.user.findOne({ email: decoded.user.email });

            return user;

        } catch (e) { }

        return null;

    }

}
