const ModuleDefinition = require('./module-definition');

/** all classes extends the abstract class.
 * @abstract
 */
class Abstract {

    constructor() {
        this._moduleDefinition = new ModuleDefinition();
        this._moduleDefinition.name = this.kernel.getModuleNameByClass(this.constructor);
    }

    /**
     * the application kernel
     * @returns {Kernel}
     */
    get kernel() {
        return require('./kernel');
    }

    get services() {
        return this.kernel.services;
    }

    get logger() {

        // builing layer between real logger service to set the module definition to logger
        return {
            emergency : function(message, meta, stack) {
                this.services.logger.log(message, meta, this.moduleDefinition, stack, 0);
            }.bind(this),

            alert : function(message, meta, stack) {
                this.services.logger.log(message, meta, this.moduleDefinition, stack, 1);
            }.bind(this),

            critical : function(message, meta, stack) {
                this.services.logger.log(message, meta, this.moduleDefinition, stack, 2);
            }.bind(this),

            error : function(message, meta, stack) {
                this.services.logger.log(message, meta, this.moduleDefinition, stack, 3);
            }.bind(this),

            warning : function(message, meta, stack) {
                this.services.logger.log(message, meta, this.moduleDefinition, stack, 4);
            }.bind(this),

            notice : function(message, meta, stack) {
                this.services.logger.log(message, meta, this.moduleDefinition, stack, 5);
            }.bind(this),

            info : function(message, meta, stack) {
                this.services.logger.log(message, meta, this.moduleDefinition, stack, 6);
            }.bind(this),

            debug : function(message, meta, stack) {
                this.services.logger.log(message, meta, this.moduleDefinition, stack, 7);
            }.bind(this)
        };
    }

    get data() {
        return this.services.data;
    }

    get server() {
        return this.services.server;
    }

    get entities() {
        return this.kernel.entities;
    }

    get repositories() {
        return this.services.data.repositories;
    }

    get fs() {
        return this.utils.fs;
    }

    get utils() {
        return this.kernel.utils;
    }

    get moduleDefinition() {
        return this._moduleDefinition;
    }
}

module.exports = Abstract;