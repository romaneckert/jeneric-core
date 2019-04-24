const app = require('@jeneric/app');

class Translate {

    constructor(req) {
        this.req = req;
    }

    render(message, data) {
        return app.module.i18n.translate(this.req.locale, message, data);
    }
}

module.exports = Translate;
