const app = require('@jeneric/app');

class Translate {
    render(locale, key, data) {
        return app.module.i18n.translate(locale, key, data);
    }
}

module.exports = Translate;
