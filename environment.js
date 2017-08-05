const Abstract = require('./abstract');

/** the main application class have to extend the application class. */
class Environment extends Abstract {
    constructor() {
        super();
    }

    get node() {
        return (typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node !== 'undefined');
    }
}

module.exports = Environment;