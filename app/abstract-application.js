const Abstract = require('./abstract');

class AbstractApplication extends Abstract {
    constructor(config) {
        super();

        this._moduleDefinition.type = 'core';
        this._moduleDefinition.name = 'application';

        this.kernel.init(config);

        this._initialCheck = false;
        this._loopInterval = setInterval(this.checkLoop.bind(this), 8);
    }

    checkLoop() {

        if (false === this.systemCheck) {

            // check system, if initial check correct but system check not correct stop running update method
            if (true === this._initialCheck) {
                clearInterval(this._loopInterval);
                throw new Error('system check false but initial check true.');
            }

            return false;

        }

        if(!this._initialCheck) {
            this._initialCheck = true;
            this.start();
        }

    }

    start() {
        throw Error('implement start method');
    }

    get systemCheck() {
        return this.kernel.ready;
    }
}

module.exports = AbstractApplication;