const Kernel = require('./kernel');

/** all classes extends the abstract class.
 * @abstract
 */
class Abstract {

    constructor() {
        this._kernel = null;
    }

    /**
     * the application kernel
     * @returns {Kernel}
     */
    get kernel() {
        return (null === this._kernel) ? this._kernel = new Kernel() : this._kernel;
    }

    /**
     * all registered components
     */
    get modules() {
        return this.kernel.modules;
    }

    get config() {
        return this.kernel.config;
    }

}

module.exports = Abstract;