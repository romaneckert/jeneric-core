class Translate {

    constructor(req) {
        this.req = req;
    }

    render(message, ...args) {
        return jeneric.module.i18n.translate(this.req.locale, message, ...args);
    }

}

module.exports = Translate;
