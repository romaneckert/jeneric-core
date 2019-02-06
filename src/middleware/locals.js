class Locals {

    handle(req, res, next) {

        //res.locals.user = {};

        let locale = null;

        // try to get locale from request query parameter
        if (-1 !== this.module.i18n.locales.indexOf(req.query._locale)) {
            locale = req.query._locale;
        }

        // try to get locale from browser if query parameter not set
        if (null === locale) {
            let browserLanguage = req.acceptsLanguages(...this.module.i18n.locales);

            if ('string' === typeof browserLanguage) locale = browserLanguage;
        }

        res.trans = res.locals.trans = function (message, ...args) {
            return this.module.i18n.translate(locale, message, ...args);
        }.bind(this);

        next();
    }

}

module.exports = Locals;
