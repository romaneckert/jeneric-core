class ClassDefinition {

    constructor(type, name) {
        this._type = ('string' === typeof type) ? type.toLowerCase() : 'undefined';
        this._name = ('string' === typeof name) ? name.toLowerCase() : 'undefined';
    }

    get type() {
        return this._type;
    }

    get name() {
        return this._name;
    }
}

module.exports = ClassDefinition;