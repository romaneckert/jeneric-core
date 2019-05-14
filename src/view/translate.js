const app = require('@jeneric/app');

class Translate {

    constructor(locals) {
        this.locale = locals.locale;
    }

    render(key, data) {
        return app.module.i18n.translate(this.locale, key, data);
    }
}

module.exports = Translate;
