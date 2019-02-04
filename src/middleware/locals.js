class Locals {

    handle(req, res, next) {
        //res.locals.user = {};

        res.locals.__ = function (message, args) {
            return this.module.i18n.translate(message, args);
        }.bind(this);

        next();
    }

}

module.exports = Locals;
