const assert = require('assert');
const app = require('@jeneric/app');

describe('util', () => {

    describe('string', () => {

        it('camelize', () => {
            assert.strictEqual(app.util.string.camelize('file-name.js'), 'fileName');
            assert.strictEqual(app.util.string.camelize('file_name.js'), 'fileName');
            assert.strictEqual(app.util.string.camelize('file name.js'), 'fileName');
            assert.strictEqual(app.util.string.camelize('class-name'), 'className');
            assert.strictEqual(app.util.string.camelize('class name'), 'className');
            assert.strictEqual(app.util.string.camelize('class_name'), 'className');
        });
    });
});




