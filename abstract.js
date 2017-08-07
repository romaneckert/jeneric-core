/** all classes extends the abstract class.
 * @abstract
 */
class Abstract {

    constructor() {

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
}

module.exports = Abstract;