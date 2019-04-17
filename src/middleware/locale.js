const app = require('@jeneric/app');

class Locale {

    handle(req, res, next) {

        let locale = null;

        // try to get locale from request query parameter
        if (-1 !== app.module.i18n.locales.indexOf(req.query._locale)) {
            locale = req.query._locale;
        }

        // try to get locale from browser if query parameter not set
        if (null === locale) {
            let browserLanguage = req.acceptsLanguages(...app.module.i18n.locales);

            if ('string' === typeof browserLanguage) locale = browserLanguage;
        }

        req.locale = locale;

        return next();
    }

}

module.exports = Locale;
