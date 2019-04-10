const Core = require('./core');
const Test = require('./test');

module.exports = class Module {
    constructor() {
        this.core = new Core();
        this.test = new Test();
    }
}
