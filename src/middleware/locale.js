class Locale {

    handle(req, res, next) {

        let locale = null;

        // try to get locale from request query parameter
        if (-1 !== jeneric.module.i18n.locales.indexOf(req.query._locale)) {
            locale = req.query._locale;
        }

        // try to get locale from browser if query parameter not set
        if (null === locale) {
            let browserLanguage = req.acceptsLanguages(...jeneric.module.i18n.locales);

            if ('string' === typeof browserLanguage) locale = browserLanguage;
        }

        res.trans = res.locals.trans = function (message, ...args) {
            return jeneric.module.i18n.translate(locale, message, ...args);
        }

        return next();
    }

}

module.exports = Locale;
