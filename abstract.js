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

    /**
     * all registered components
     */
    get services() {
        return this.kernel.services;
    }

    get classes() {
        return this.kernel.classes;
    }

    get logger() {
        return this.services.logger;
    }

    get data() {
        return this.services.data;
    }

    get fileSystem() {
        return this.services.fileSystem;
    }
}

module.exports = Abstract;