const Module = require('./src/module');

class Jeneric {

    constructor() {
        this.module = new Module();
    }

    boot() {
        console.log('..boot');
    }

}

module.exports = Jeneric;
