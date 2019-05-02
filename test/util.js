const assert = require('assert');
const app = require('@jeneric/app');

describe('util', () => {

    describe('fs', () => {

        it('ensureDirExists', async () => {
            await app.util.fs.ensureDirExists('./var/test');
        });

        it('symlink', async () => {
            await app.util.fs.symlink('./test', './var/test-symlink');
        });

        it('isDirectory', async () => {
            assert.strictEqual(await app.util.fs.isDirectory('./var/test'), true);
            assert.strictEqual(await app.util.fs.isDirectory('./var/test-symlink'), true);
        });

        it('ensureFileExists', async () => {
            await app.util.fs.ensureFileExists('./var/test/test-file.txt');
        });

        it('isWritable', async () => {
            await app.util.fs.isWritable('./var/test/test-file.txt');
        });

        it('appendFile', async () => {
            await app.util.fs.appendFile('./var/test/test-file.txt', 'test');
        });

        it('readFile', async () => {
            let content = await app.util.fs.readFile('./var/test/test-file.txt', 'utf8');
            assert.strictEqual(content, 'test');
        });

        it('remove', async () => {
            assert.strictEqual(await app.util.fs.remove('./var/test-symlink'), true);
            assert.strictEqual(await app.util.fs.remove('./var/test'), true);
        });

        it('isDirectory after remove', async () => {
            assert.strictEqual(await app.util.fs.isDirectory('./var/test'), false);
            assert.strictEqual(await app.util.fs.isDirectory('./var/test-symlink'), false);
        });
    });

    describe('string', () => {

        it('camelize', () => {
            assert.strictEqual(app.util.string.camelize('file-name.js'), 'fileName');
            assert.strictEqual(app.util.string.camelize('file-name-2.js'), 'fileName2');
            assert.strictEqual(app.util.string.camelize('file_name.js'), 'fileName');
            assert.strictEqual(app.util.string.camelize('file name.js'), 'fileName');
            assert.strictEqual(app.util.string.camelize('class-name'), 'className');
            assert.strictEqual(app.util.string.camelize('class name'), 'className');
            assert.strictEqual(app.util.string.camelize('class_name'), 'className');
            assert.strictEqual(app.util.string.camelize('Class'), 'class');
        });

        it('cast', () => {

            assert.strictEqual(app.util.string.cast(123), '123');
            assert.strictEqual(app.util.string.cast(undefined), '');
            assert.strictEqual(app.util.string.cast(null), '');
            assert.strictEqual(app.util.string.cast(new Error('test')), String(new Error('test')));
            assert.strictEqual(app.util.string.cast(new TypeError('test')), String(new TypeError('test')));
            assert.strictEqual(app.util.string.cast(new ReferenceError('test')), String(new ReferenceError('test')));

            let testObject = {
                test: {
                    test: {
                        test: 123
                    }
                }
            };

            testObject.testObject = testObject;

            assert.strictEqual(
                app.util.string.cast(testObject),
                '{"test":{"test":{"test":123}}}'
            );
        });
    });
});






