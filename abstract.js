/** all classes extends the abstract class.
 * @abstract
 */
class Abstract {

    constructor() {
        this._instanceId = '_' + Math.random().toString(36).substr(2, 9);
    }

    get instanceId() {
        return this._instanceId;
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
        return this.services.logger;
    }

    get data() {
        return this.services.data;
    }

    get server() {
        return this.services.server;
    }

    get models() {
        return this.kernel.models;
    }

    get repositories() {
        return this.services.data.repositories;
    }

    get fileSystem() {
        return this.utils.fileSystem;
    }

    get utils() {
        return this.kernel.utils;
    }
}

module.exports = Abstract;