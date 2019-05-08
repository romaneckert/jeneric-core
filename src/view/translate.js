const app = require('@jeneric/app');

class Translate {

    constructor(locals) {
        this.locale = locals.locale;
    }

    render(message, data) {
        return app.module.i18n.translate(this.locale, message, data);
    }
}

module.exports = Translate;
