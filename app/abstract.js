const ModuleDefinition = require('../common/module-definition');

/** all classes extends the abstract class.
 * @abstract
 * @exports app/abstract
 * @class
 */
class Abstract {

    /**
     * @constructor
     */
    constructor() {
        this._kernel = require('./kernel');

        this._moduleDefinition = new ModuleDefinition();
        this._moduleDefinition.name = this._kernel.getModuleNameByClass(this.constructor);
    }

    get services() {

        if(this.moduleDefinition.type === 'service') {

            let observed = false;

            return new Proxy({}, {
                get: function(target, serviceName) {
                    return new Proxy(this._kernel.services[serviceName], {
                        get : function(target, method) {
                            if('function' === typeof target[method] && observed === false) {
                                this._kernel.services.observer.observe(this.moduleDefinition.name, serviceName, method);
                                observed = true;
                            }
                            return target[method];
                        }.bind(this)
                    });
                }.bind(this)
            });
        } else {
            return this._kernel.services;
        }
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
            }.bind(this),

            history : this.services.logger.history
        };
    }

    get data() {
        return this.services.data;
    }

    get server() {
        return this.services.server;
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

    get handler() {
        return this._kernel.handler;
    }

}

module.exports = Abstract;