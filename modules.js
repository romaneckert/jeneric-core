class Modules {

    constructor() {
        return new Proxy(this, this);
    }

    get (target, module) {

        if('undefined' === typeof this['_' + module]) {

            let isCoreModule = false;
            let moduleClass = null;

            // try to find module in global scope as jeneric module
            try {
                moduleClass = require('@jeneric/' + module);
                isCoreModule = true;
            } catch (e) {
                isCoreModule = false;
            }

            // try to find module in local scope
            if(!isCoreModule) {
                try {

                    console.log('./test/app/modules/custom');
                    console.log('./test/app/modules/' + module);

                    //moduleClass = require('./test/app/modules/custom');

                    let path = './test/app/modules/' + module;
                    //path = './test/app/modules/custom';

                    console.log(path);

                    moduleClass = require(path);
                } catch (e) {

                    console.log(e);

                    throw new Error(`can not find module ${module} in global and local scope - do you have installed @jeneric/${module} or created a module app/modules/${module}.js`);
                }
            }

            this['_' + module] = eval("new moduleClass()");
        }

        return this['_' + module];
    }
}

module.exports = Modules;