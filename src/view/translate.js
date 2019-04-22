const app = require('@jeneric/app');

module.exports = (message, data) => {
    return app.module.i18n.translate(this.req.locale, message, data);
};
