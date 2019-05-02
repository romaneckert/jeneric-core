const assert = require('assert');
const app = require('@jeneric/app');

describe('util', () => {

    describe('fs', () => {

        it('ensureDirExists', async () => {
            await app.util.fs.ensureDirExists('./var/test');
        });

        it('ensureFileExists', async () => {
            await app.util.fs.ensureFileExists('./var/test/test-file.txt');
        });

        it('appendFile', async () => {
            await app.util.fs.appendFile('./var/test/test-file.txt', 'test');
        });

        it('readFile', async () => {
            let content = await app.util.fs.readFile('./var/test/test-file.txt', 'utf8');
            assert.strictEqual(content, 'test');
        });

        it('remove', async () => {
            await app.util.fs.remove('./var/test');
        });
    });
});




