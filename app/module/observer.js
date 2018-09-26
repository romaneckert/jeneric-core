const AbstractModule = require('../abstract-module');

class Observer extends AbstractModule {
    constructor() {
        super();
    }

    observe(caller, service, method) {
        this._kernel.services.logger.log('service ' + caller + ' calls ' + service + '.' + method + '()', undefined, this.moduleDefinition, undefined, 8);
    }

    get ready() {
        return true;
    }
}

module.exports = Observer;