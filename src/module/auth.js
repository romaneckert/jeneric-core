const jwt = require('jsonwebtoken');
const app = require('@jeneric/app');
const crypto = require('crypto');

/**
 * @example
 * app.module.auth
 */
class Auth {

    constructor() {
        // load config
        this.config = app.config.auth;

        // validate config.secret
        if ('string' !== typeof this.config.secret || 10 > this.config.secret.length) {
            app.logger.warning('config.auth.secret not set or not valid - have to be string, minimum length 10 - generate temporary secret');
            this.config.secret = crypto.randomBytes(32).toString('hex');
        }

        // validate config.tokenExpiresIn
        if ('number' !== typeof this.config.tokenExpiresIn || 0 === this.config.tokenExpiresIn) {
            throw new Error('config.auth.tokenExpiresIn not valid');
        }

        // validate config.tokenCookieName
        if ('string' !== typeof this.config.tokenCookieName || 0 === this.config.tokenCookieName.length) {
            throw new Error('config.auth.tokenCookieName not valid');
        }
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
            this.config.secret,
            {
                expiresIn: this.config.tokenExpiresIn
            }
        );

        // add json web token cookie
        res.cookie(this.config.tokenCookieName, token, {
            expires: new Date(Date.now() + this.config.tokenExpiresIn * 1000),
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
        res.clearCookie(this.config.tokenCookieName);
    }

    /**
     * @description Verify the json web token in the cookie of the request.
     * @example
     * jeneric.module.auth.verify(req,res);
     * @param {Object} req - The Request object.
     * @param {Object} res - The Response object.
     * @returns {Object} The user which was verified.
     */
    async verify(req, res) {

        // validate req
        if ('object' !== typeof req || null === req) return null;

        // validate cookies
        if ('object' !== typeof req.cookies || null === req.cookies) return null;

        // validate json web token cookie
        if ('string' !== typeof req.cookies[this.config.tokenCookieName] || 0 === req.cookies[this.config.tokenCookieName].length) return null;

        // verify token
        let data = jwt.verify(req.cookies[this.config.tokenCookieName], this.config.secret);

        // validate user data
        if ('object' !== typeof data.user || null === data.user) return null;

        // validate user email
        if ('string' !== typeof data.user.email || 0 === data.user.email.length) return null;

        // validate user roles
        if ('object' !== typeof data.user.roles || 0 === data.user.roles.length) return null;

        // get user from db
        let user = null;

        try {
            user = await app.model.user.findOne({ email: data.user.email });
        } catch (e) {
            user = null;
        }

        // sign in user to refresh the json web token
        this.signIn(req, res, user);

        return user;

    }

}

module.exports = Auth;
