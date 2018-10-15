const Module = require('../../module');

class Observer extends Module {
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