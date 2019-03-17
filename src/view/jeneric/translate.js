class Translate {

    constructor(res) {
        this.res = res;
    }

    render(message, ...args) {
        return jeneric.module.i18n.translate(this.res.locale, message, ...args);
    }

}

module.exports = Translate;
