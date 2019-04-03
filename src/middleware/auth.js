class Auth {

    constructor() {
        if ('string' !== typeof jeneric.config.secret || 0 === jeneric.config.secret.length) throw new Error('missing config.secret or config.secret is empty');
    }

    async handle(req, res, next) {

        await jeneric.module.auth.verify(req, res);

        return next();
    }

}

module.exports = Auth;
