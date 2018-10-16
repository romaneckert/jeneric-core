class Observer {
    observe(caller, module, method) {
        this.core.module.logger.log('module ' + caller + ' calls ' + module + '.' + method + '()', undefined, 'module', 'observer', undefined, 8);
    }

    get ready() {
        return true;
    }
}

module.exports = Observer;
