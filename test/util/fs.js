const assert = require('assert');
const app = require('@jeneric/app');
app.boot();

describe('util', () => {

    describe('fs', () => {

        it('create test directory', async () => {
            await app.util.fs.ensureDirExists('./var/test');
        });

        it('ensure test file exists', async () => {
            await app.util.fs.ensureFileExists('./var/test/test-file.txt');
        });

        it('create test file', async () => {
            await app.util.fs.appendFile('./var/test/test-file.txt', 'test');
        });

        it('read test file', async () => {
            let content = await app.util.fs.readFile('./var/test/test-file.txt', 'utf8');
            assert.strictEqual(content, 'test');
        });

        it('delete test directory', async () => {
            await app.util.fs.remove('./var/test');
        });
    });

});




