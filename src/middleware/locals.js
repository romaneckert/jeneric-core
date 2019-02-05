class Locals {

    handle(req, res, next) {

        //res.locals.user = {};

        let locale = null;

        // try to get locale from request query parameter
        if (-1 !== this.module.i18n.locales.indexOf(req.query._locale)) {
            locale = req.query._locale;
        }

        let browserLocale = req.get('Accept-Language');

        if (null === locale && -1 !== this.module.i18n.locales.indexOf(browserLocale)) {
            locale = browserLocale;
        }

        // try to get locale from browser

        res.__ = res.locals.__ = function (message, ...args) {
            return this.module.i18n.translate(locale, message, ...args);
        }.bind(this);

        next();
    }

}

module.exports = Locals;
