#!/usr/bin/env node
const Jeneric = require('../index');

class Test extends Jeneric {
    constructor() {
        super();
    }
}

let test = new Test();
test.boot();


