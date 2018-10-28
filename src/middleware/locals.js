class Locals {

    handle(req, res, next) {
        //res.locals.user = {};
        next();
    }

}

module.exports = Locals;
