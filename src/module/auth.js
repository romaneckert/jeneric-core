const jwt = require('jsonwebtoken');

module.exports = class Auth {

    constructor() {
        // check if config.secret set
        if ('string' !== typeof jeneric.config.secret || 0 === jeneric.config.secret.length) throw new Error('missing config.secret or config.secret is empty');

        // check if config.tokenExpiresIn set
        if ('number' !== typeof jeneric.config.tokenExpiresIn || 0 === jeneric.config.tokenExpiresIn) throw new Error('missing config.tokenExpires or config.tokenExpires is 0');

        // define token cookie name
        this.tokenCookieName = '_t';
    }

    signIn(req, res, user) {

        // validate user
        if ('object' !== typeof user || null === user) return false;

        // validate user email
        if ('string' !== typeof user.email || 0 === user.email.length) return false;

        // validate user roles
        if ('object' !== typeof user.roles || 0 === user.roles.length) return false;

        // generate json web token
        let token = jwt.sign(
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

        // add json web token cookie
        res.cookie(this.tokenCookieName, token, {
            expires: new Date(Date.now() + jeneric.config.tokenExpiresIn * 1000),
            httpOnly: true,
            sameSite: 'Strict',
            secure: true
        });

        // add user to req and res
        req.user = res.user = res.locals.user = user;

        return true;

    }

    signOut(req, res) {

        // remove user from request and response
        req.user = res.user = res.locals.user = null;

        // clear token cookie
        res.clearCookie(this.tokenCookieName);
    }

    async verify(req, res) {

        // validate req
        if ('object' !== typeof req || null === req) return null;

        // validate cookies
        if ('object' !== typeof req.cookies || null === req.cookies) return null;

        // validate json web token cookie
        if ('string' !== typeof req.cookies[this.tokenCookieName] || 0 === req.cookies[this.tokenCookieName].lenth) return null;

        // verify token
        let data = jwt.verify(req.cookies._t, jeneric.config.secret);

        // validate user data
        if ('object' !== typeof data.user || null === data.user) return null;

        // validate user email
        if ('string' !== typeof data.user.email || 0 === data.user.email.length) return null;

        // validate user roles
        if ('object' !== typeof data.user.roles || 0 === data.user.roles.length) return null;

        // get user from db
        let user = null;

        try {
            user = await jeneric.model.user.findOne({ email: data.user.email });
        } catch (e) {
            user = null;
        }

        // sign in user to refresh the json web token
        this.signIn(req, res, user);

    }

}
