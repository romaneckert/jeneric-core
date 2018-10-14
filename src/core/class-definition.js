class ClassDefinition {

    constructor(type, name) {
        this.type = ('string' === typeof type) ? type.toLowerCase() : 'undefined';
        this.name = ('string' === typeof name) ? name.toLowerCase() : 'undefined';
    }

}

module.exports = ClassDefinition;