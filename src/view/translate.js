const app = require('@jeneric/app');

class Translate {

    constructor(options) {

        if ('object' !== typeof options || null === options || 'string' !== typeof options.locale) {
            throw new Error('missing locale option');
        }

        this.locale = options.locale;
    }

    render(message, data) {
        return app.module.i18n.translate(this.locale, message, data);
    }
}

module.exports = Translate;
