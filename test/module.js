const assert = require('assert');
const app = require('@jeneric/app');

describe('module', () => {

    describe('server', () => {

        it('index', async () => {
            assert.strictEqual((await app.util.request(app.config.app.url)).includes('200'), true);
        });

        it('404', async () => {

            try {
                await app.util.request('http://localhost:3000/jeneric-not-found-url-test');
            } catch (err) {
                assert.strictEqual(err.statusCode, 404);
            }

        });


    });

    describe('mail', () => {
        it('send', async () => {

            let content = await app.module.renderer.render('index');

            assert.strictEqual((await app.util.request(app.config.app.url)).includes('200'), true);
        });
    });

});
