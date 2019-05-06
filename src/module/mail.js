const nodemailer = require('nodemailer');
const url = require('url');
const querystring = require('querystring');
const app = require('@jeneric/app');

class Mail {

    constructor() {
        this.transporter = null;
        this.config = app.config.mail;
    }

    async start() {

        if ('string' !== typeof this.config.url || 0 === this.config.url.length) {
            throw new Error('missing config.mail.url');
        }

        let mailUrl = url.parse(this.config.url);

        mailUrl.search = querystring.stringify({
            connectionTimeout: this.config.connectionTimeout
        });

        this.transporter = nodemailer.createTransport(mailUrl.format(), {
            from: this.config.defaultFrom
        });
    }

    async send(options) {

        return this.transporter.sendMail(options).then(info => {
            return info;
        }).catch(err => {
            throw err;
        });

    }

    async render(path, options, res) {

        if ('object' !== typeof options) options = {};

        // set base url
        if ('string' !== typeof options.baseUrl || options.baseUrl.length === 0) options.baseUrl = this.config.baseUrl;

        return new Promise(resolve => {
            res.render(path, options, (err, html) => {
                if (err) throw err;
                resolve(html);
            });
        });

    }

}

module.exports = Mail;
