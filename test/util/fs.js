const fs = require('@jeneric/app/src/util/fs-promises');
const assert = require('assert');
const app = require('@jeneric/app');

describe('module', () => {
    app.start();
});

/*
describe('util', () => {

    describe('fs', () => {

        it('create test file', async () => {
            await app.util.fs.appendFile('./var/test/fs.txt', 'test');
        });

        it('read test file', async () => {
            let content = await fs.readFile('./var/test/fs.txt', 'utf8');

            console.log(content);

            //assert.strictEqual(content, 'test');
        });
    });

});*/




