const app = require('@jeneric/app');

class Auth {

    async handle(req, res, next) {

        await app.module.auth.verify(req, res);

        return next();
    }

}

module.exports = Auth;
