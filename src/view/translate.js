const app = require('@jeneric/app');

class Translate {

    constructor(locals) {
        this.locale = locals.locale;
    }

    async render(message, data) {
        return await app.module.i18n.translate(this.locale, message, data);
    }
}

module.exports = Translate;
