class Auth {

    async handle(req, res, next) {

        //await jeneric.module.auth.verify(req, res);

        return next();
    }

}

module.exports = Auth;
