const nodemailer = require('nodemailer');
const objectUtil = require('../../util/object');
const url = require('url');
const querystring = require('querystring');

class Mail {

    constructor(config) {
        this._config = {
            defaultFrom: 'default@mail',
            connectionTimeout: 2000
        };

        objectUtil.merge(this._config, config);

        this.transporter = null;

        if ('string' !== typeof this._config.url || 0 === this._config.url.length) {
            this.logger.error('missing url for mailer module');
            return;
        }

        let mailUrl = url.parse(this._config.url);

        mailUrl.search = querystring.stringify({
            connectionTimeout: this._config.connectionTimeout
        });

        this.transporter = nodemailer.createTransport(mailUrl.format(), {
            from: this._config.defaultFrom
        });
    }

    async send(options) {

        return this.transporter.sendMail(options).then(info => {
            return info;
        }).catch(err => {
            throw err;
        });

    }

    async render(path, opt, res) {

        return new Promise(resolve => {
            res.render(path, opt, (err, html) => {
                if (err) throw err;
                resolve(html);
            });
        });

    }

}

module.exports = Mail;
