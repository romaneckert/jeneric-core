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

        this.transporter = nodemailer.createTransport(url.parse(mailUrl), {
            from: this._config.defaultFrom
        });
    }

    async send(options) {

        try {
            await new Promise((resolve, reject) => {
                this.transporter.sendMail(options, (err) => {
                    if (err) reject(err);
                    resolve();
                });
            });

            return true;
        } catch (err) {
            return false;
        }
    }

    async render(path, opt, res) {

        try {
            return await new Promise(resolve => {
                res.render(path, opt, (err, html) => {
                    if (err) throw new Error(err);
                    return resolve(html);
                });
            });
        } catch (err) {
            this.logger.error(err);
        }
        return
    }

}

module.exports = Mail;
