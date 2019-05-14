const assert = require('assert');
const app = require('@jeneric/app');

describe('module', () => {

    describe('logger', () => {
        it('error', async () => {

            app.logger.error('test error');

        });
    });

    describe('mail', () => {

        it('send', async () => {

            await app.module.mail.send({
                to: 'test@jeneric',
                subject: 'Test Mail module',
                html: await app.module.server.render('mail')
            });

        });

        it('config', async () => {

            let defaultMailConfig = app.util.object.clone(app.module.mail.config);

            app.module.mail.config = app.util.object.clone(defaultMailConfig);
            app.module.mail.config.url = undefined;

            try {
                await app.module.mail.start()
            } catch (err) {
                assert.strictEqual(err.message, 'missing config.mail.url');
            }

            app.module.mail.config = app.util.object.clone(defaultMailConfig);
            app.module.mail.config.defaultFrom = undefined;

            try {
                await app.module.mail.start()
            } catch (err) {
                assert.strictEqual(err.message, 'missing config.mail.defaultFrom');
            }

        });
    });

    describe('server', () => {

        it('index', async () => {
            assert.strictEqual((await app.util.request(app.config.app.url)).includes('Jeneric'), true);
        });

        it('404', async () => {

            try {
                await app.util.request('http://localhost:3000/jeneric-not-found-url-test');
            } catch (err) {
                assert.strictEqual(err.statusCode, 404);
            }

        });
    });


});
