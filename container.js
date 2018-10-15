const ClassDefinition = require('./class-definition');

class Container {

    constructor(classType) {

        if ('string' !== typeof classType) throw new Error('class type is not a string');

        this._classDefinition = new ClassDefinition(classType, this.constructor.name);

        this._core = require('./index');
    }

    get module() {

        if (this._classDefinition.type !== 'module') {
            return this._core.module;
        }

        let observed = false;

        return new Proxy({}, {
            get: function (target, moduleName) {
                return new Proxy(this._core.module[moduleName], {
                    get: function (target, method) {
                        if ('function' === typeof target[method] && observed === false) {
                            this._core.module.observer.observe(this._classDefinition.name, moduleName, method);
                            observed = true;
                        }
                        return target[method];
                    }.bind(this)
                });
            }.bind(this)
        });

    }

    get logger() {

        // building layer between real logger service to set the module definition to logger
        return {
            emergency: function (message, meta, stack) {
                this.module.logger.log(message, meta, this._classDefinition, stack, 0);
            }.bind(this),

            alert: function (message, meta, stack) {
                this.module.logger.log(message, meta, this._classDefinition, stack, 1);
            }.bind(this),

            critical: function (message, meta, stack) {
                this.module.logger.log(message, meta, this._classDefinition, stack, 2);
            }.bind(this),

            error: function (message, meta, stack) {
                this.module.logger.log(message, meta, this._classDefinition, stack, 3);
            }.bind(this),

            warning: function (message, meta, stack) {
                this.module.logger.log(message, meta, this._classDefinition, stack, 4);
            }.bind(this),

            notice: function (message, meta, stack) {
                this.module.logger.log(message, meta, this._classDefinition, stack, 5);
            }.bind(this),

            info: function (message, meta, stack) {
                this.module.logger.log(message, meta, this._classDefinition, stack, 6);
            }.bind(this),

            debug: function (message, meta, stack) {
                this.module.logger.log(message, meta, this._classDefinition, stack, 7);
            }.bind(this),

            history: this.module.logger.history
        };
    }

    get middleware() {
        return this._core.middleware;
    }

    get model() {
        return this._core.model;
    }

    get classDefinition() {
        return this._classDefinition;
    }

    get env() {
        return this._core.config.env;
    }

}

module.exports = Container;
