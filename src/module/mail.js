const nodemailer = require('nodemailer');
const objectUtil = require('../../util/object');

class Mail {

    constructor(config) {
        this._config = {
            defaultFrom: 'default@mail'
        };

        objectUtil.merge(this._config, config);

        this.transporter = null;
    }

    send(options, cb) {

        if (null === this.transporter) {

            if ('string' !== typeof this._config.url || 0 === this._config.url.length) {
                this.logger.error('missing url for mailer module');
                cb(err);
                return;
            }

            this.transporter = nodemailer.createTransport(this._config.url);

        }

        if (undefined === options.from) {
            options.from = this._config.defaultFrom;
        }

        return this.transporter.sendMail(options, cb)
    }

}

module.exports = Mail;
