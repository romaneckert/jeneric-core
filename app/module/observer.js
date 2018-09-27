const AbstractModule = require('../abstract-module');

class Observer extends AbstractModule {
    constructor() {
        super();
    }

    observe(caller, module, method) {
        this._core.module.logger.log('module ' + caller + ' calls ' + module + '.' + method + '()', undefined, this.classDefinition, undefined, 8);
    }

    get ready() {
        return true;
    }
}

module.exports = Observer;