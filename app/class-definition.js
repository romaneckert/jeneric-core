class ClassDefinition {

    constructor(type, name) {

        if ('string' !== typeof type) {
            type = 'undefined';
        }

        if ('string' !== typeof name) {
            name = 'undefined';
        }

        this._type = type.toLowerCase();
        this._name = name.toLowerCase();
    }

    get type() {
        return this._type;
    }

    get name() {
        return this._name;
    }
}

module.exports = ClassDefinition;