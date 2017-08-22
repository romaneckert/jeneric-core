const AbstractObjectManager = require('./abstract-object-manager');

class ObjectManager extends AbstractObjectManager {
    constructor(config) {
        super(config);
    }
}

module.exports = ObjectManager;