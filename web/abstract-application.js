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
            this._registerHandler();
            this.start();
        }

    }

    /**
     *
     * register handler of handler.window and handler.document
     *
     * @private
     */
    _registerHandler() {

        this.logger.debug('register handler', this.kernel.handler);

        for(let l1 in this.kernel.handler) {
            switch(l1) {
                case 'window':
                    for(let l2 in this.kernel.handler[l1]) {
                        $(window).on(l2, function(e) {
                            this.logger.debug('handle event ' + l1 + '/' + l2 );
                            this.kernel.handler[l1][l2].handle(e);
                        }.bind(this));
                    }
                    break;

                case 'document':
                    for(let l2 in this.kernel.handler[l1]) {
                        for(let l3 in this.kernel.handler[l1][l2]) {
                            for(let l4 in this.kernel.handler[l1][l2][l3]) {
                                $(document).on(l4, '.' + l2 + ' .' + l3, function(e) {
                                    this.logger.debug('handle event ' + l1 + '/' + l2 + '/' + l3 + '/' + l4);
                                    this.kernel.handler[l1][l2][l3][l4].handle(e);
                                }.bind(this));
                            }
                        }
                    }
                    break;
            }
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