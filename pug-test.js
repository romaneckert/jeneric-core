const pug = require('pug');

const mixinCode = `
mixin myMixin(variable)
    h1=variable

+myMixin(locals)
`;
const template = pug.compile(mixinCode);
console.log(template('deine-mudda'));
