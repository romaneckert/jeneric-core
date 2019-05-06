const assert = require('assert');
const app = require('@jeneric/app');

describe('module', () => {

    describe('server', () => {

        it('index', async () => {

            console.log(app.config);

            assert.strictEqual((await app.util.request('http://localhost:3000')).includes('200'), true);
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
