const ModuleDefinition = require('../common/module-definition');

/** all classes extends the abstract class.
 * @abstract
 */
class Abstract {

    constructor() {
        this._kernel = require('./kernel');

        this._moduleDefinition = new ModuleDefinition();
        this._moduleDefinition.name = this._kernel.getModuleNameByClass(this.constructor);
    }

    get logger() {

        // builing layer between real logger service to set the module definition to logger
        return {
            emergency : function(message, meta, stack) {
                this._kernel.services.logger.log(message, meta, this.moduleDefinition, stack, 0);
            }.bind(this),

            alert : function(message, meta, stack) {
                this._kernel.services.logger.log(message, meta, this.moduleDefinition, stack, 1);
            }.bind(this),

            critical : function(message, meta, stack) {
                this._kernel.services.logger.log(message, meta, this.moduleDefinition, stack, 2);
            }.bind(this),

            error : function(message, meta, stack) {
                this._kernel.services.logger.log(message, meta, this.moduleDefinition, stack, 3);
            }.bind(this),

            warning : function(message, meta, stack) {
                this._kernel.services.logger.log(message, meta, this.moduleDefinition, stack, 4);
            }.bind(this),

            notice : function(message, meta, stack) {
                this._kernel.services.logger.log(message, meta, this.moduleDefinition, stack, 5);
            }.bind(this),

            info : function(message, meta, stack) {
                this._kernel.services.logger.log(message, meta, this.moduleDefinition, stack, 6);
            }.bind(this),

            debug : function(message, meta, stack) {
                this._kernel.services.logger.log(message, meta, this.moduleDefinition, stack, 7);
            }.bind(this)
        };
    }

    get data() {
        return this._kernel.services.data;
    }

    get server() {
        return this._kernel.services.server;
    }

    get entities() {
        return this._kernel.entities;
    }

    get repositories() {
        return this.services.data.repositories;
    }

    get fs() {
        return this.utils.fs;
    }

    get utils() {
        return this._kernel.utils;
    }

    get moduleDefinition() {
        return this._moduleDefinition;
    }
}

module.exports = Abstract;