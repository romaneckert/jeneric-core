const ModuleDefinition = require('./module-definition');

/** all classes extends the abstract class.
 * @abstract
 * @exports app/abstract
 * @class
 */
class Abstract {

    /**
     * @constructor
     */
    constructor(moduleType) {

        if ('string' !== typeof moduleType) throw new Error('module type is not a string');

        this._core = require('../index');

        this._moduleDefinition = new ModuleDefinition();
        this._moduleDefinition.type = moduleType;
        this._moduleDefinition.name = this.constructor.name;
    }

    get module() {

        if (this.moduleDefinition.type === 'module') {

            let observed = false;

            return new Proxy({}, {
                get: function (target, moduleName) {
                    return new Proxy(this._core.module[moduleName], {
                        get: function (target, method) {
                            if ('function' === typeof target[method] && observed === false) {
                                this._core.module.observer.observe(this.moduleDefinition.name, moduleName, method);
                                observed = true;
                            }
                            return target[method];
                        }.bind(this)
                    });
                }.bind(this)
            });
        } else {
            return this._core.module;
        }
    }

    get logger() {

        // building layer between real logger service to set the module definition to logger
        return {
            emergency: function (message, meta, stack) {
                this.module.logger.log(message, meta, this.moduleDefinition, stack, 0);
            }.bind(this),

            alert: function (message, meta, stack) {
                this.module.logger.log(message, meta, this.moduleDefinition, stack, 1);
            }.bind(this),

            critical: function (message, meta, stack) {
                this.module.logger.log(message, meta, this.moduleDefinition, stack, 2);
            }.bind(this),

            error: function (message, meta, stack) {
                this.module.logger.log(message, meta, this.moduleDefinition, stack, 3);
            }.bind(this),

            warning: function (message, meta, stack) {
                this.module.logger.log(message, meta, this.moduleDefinition, stack, 4);
            }.bind(this),

            notice: function (message, meta, stack) {
                this.module.logger.log(message, meta, this.moduleDefinition, stack, 5);
            }.bind(this),

            info: function (message, meta, stack) {
                this.module.logger.log(message, meta, this.moduleDefinition, stack, 6);
            }.bind(this),

            debug: function (message, meta, stack) {
                this.module.logger.log(message, meta, this.moduleDefinition, stack, 7);
            }.bind(this),

            history: this.module.logger.history
        };
    }

    get core() {
        return this._core;
    }

    get moduleDefinition() {
        return this._moduleDefinition;
    }

    get model() {
        return this._core.model;
    }

    get util() {
        return this._core.util;
    }

    get fs() {
        return this._core.util.fs;
    }

}

module.exports = Abstract;