const AbstractService = require('../abstract-service');

class Observer extends AbstractService {
    constructor() {
        super();
    }

    observe(caller, service, method) {
        console.log(caller + ' calls ' + service + '.' + method + '()');
    }

    get ready() {
        return true;
    }
}

module.exports = Observer;