const assert = require('assert');
const app = require('@jeneric/app');

describe('util', () => {

    describe('fs', () => {

        let testDirPath = null;
        let testFilePath = null;
        let testDirSymlinkPath = null;
        let testFileSymlinkPath = null;
        let testFileNotExists = null;

        it('defineConst', async () => {
            testDirPath = './var/test';
            testFilePath = app.util.fs.path.join(testDirPath, 'test-file.txt');
            testDirSymlinkPath = './var/test-symlink';
            testFileSymlinkPath = app.util.fs.path.join(testDirPath, 'test-file-symlink.txt');
            testFileNotExists = app.util.fs.path.join(testDirPath, 'test-file-not-exists.txt');
        });

        it('remove', async () => {
            await app.util.fs.remove(testDirSymlinkPath);
            await app.util.fs.remove(testDirPath);
        });

        it('ensureDirExists', async () => {
            await app.util.fs.ensureDirExists(testDirPath);
            await app.util.fs.ensureDirExists(testDirPath);
            await app.util.fs.ensureDirExists(testDirPath);
        });

        it('ensureFileExists', async () => {
            await app.util.fs.ensureFileExists(testFilePath);
            await app.util.fs.ensureFileExists(testFilePath);
            await app.util.fs.ensureFileExists(testFilePath);
        });

        it('symlink', async () => {
            await app.util.fs.symlink('./test', testDirSymlinkPath);
            await app.util.fs.symlink('./test-file.txt', testFileSymlinkPath);
        });

        it('isDirectory', async () => {
            assert.strictEqual(await app.util.fs.isDirectory(testDirPath), true);
            assert.strictEqual(await app.util.fs.isDirectory(testFilePath), false);
            assert.strictEqual(await app.util.fs.isDirectory(testDirSymlinkPath), false);
            assert.strictEqual(await app.util.fs.isDirectory(testFileSymlinkPath), false);
            assert.strictEqual(await app.util.fs.isDirectory(testFileNotExists), false);
        });

        it('isFile', async () => {
            assert.strictEqual(await app.util.fs.isFile(testDirPath), false);
            assert.strictEqual(await app.util.fs.isFile(testFilePath), true);
            assert.strictEqual(await app.util.fs.isFile(testDirSymlinkPath), false);
            assert.strictEqual(await app.util.fs.isFile(testFileSymlinkPath), false);
            assert.strictEqual(await app.util.fs.isFile(testFileNotExists), false);
        });

        it('isSymlink', async () => {
            assert.strictEqual(await app.util.fs.isSymbolicLink(testDirPath), false);
            assert.strictEqual(await app.util.fs.isSymbolicLink(testFilePath), false);
            assert.strictEqual(await app.util.fs.isSymbolicLink(testDirSymlinkPath), true);
            assert.strictEqual(await app.util.fs.isSymbolicLink(testFileSymlinkPath), true);
            assert.strictEqual(await app.util.fs.isSymbolicLink(testFileNotExists), false);
        });

        it('isWritable', async () => {
            assert.strictEqual(await app.util.fs.isWritable(testDirPath), true);
            assert.strictEqual(await app.util.fs.isWritable(testFilePath), true);
            assert.strictEqual(await app.util.fs.isWritable(testDirSymlinkPath), true);
            assert.strictEqual(await app.util.fs.isWritable(testFileSymlinkPath), true);
            assert.strictEqual(await app.util.fs.isWritable(testFileNotExists), false);
        });

        it('appendFile', async () => {
            await app.util.fs.appendFile('./var/test/test-file.txt', 'test');
        });

        it('readFile', async () => {
            let content = await app.util.fs.readFile('./var/test/test-file.txt', 'utf8');
            assert.strictEqual(content, 'test');
        });

        it('remove', async () => {
            await app.util.fs.remove('./var/test-symlink');
            await app.util.fs.remove('./var/test');
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

    describe('object', () => {

        it('merge', () => {
            let obj1 = {
                test: {
                    test: 2
                },
                test2: {
                    test: 4
                }
            };

            let obj2 = {
                test: {
                    test: 3
                }
            };

            app.util.object.merge(obj1, obj2);

            assert.strictEqual(JSON.stringify(obj1), '{"test":{"test":3},"test2":{"test":4}}');

        });

    });
});






