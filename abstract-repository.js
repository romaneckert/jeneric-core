const Abstract = require('./abstract');

class AbstractRepository extends Abstract {
    constructor(entityName) {
        super();

        this._entityName = entityName;
    }

    get entityClass() {
        return this.data.getClassByEntityName(this._entityName);
    }

    get data() {
        return this.data.data[this._entityName];
    }

    find(data) {

        switch(typeof data) {
            case 'undefined':
                return this._findAll();
            case 'object':
                return this._findByData(data);
            case 'string':
                return this._findById(parseInt(data));
            case 'number':
                return this._findById(parseInt(data));
            default:
                throw new Error('data have wrong type');
        }

    }

    _findAll() {

        let results = [];

        for(let objectId in this.data) {
            let entity = new this.entityClass();
            for (let attr in this.data[objectId]) entity[attr] = this.data[objectId][attr];
            results.push(entity)
        }

        return results;
    }

    _findByData(data) {

    }

    _getInstance(data) {
        let entity = new this.entityClass();
        for (let attr in data) entity[attr] = data[attr];
        return entity;
    }

    _findById(id) {

        for(let objectId in this.data) if(parseInt(objectId) === id) return this._getInstance(this.data[id]);

        return null;
    }
}

module.exports = AbstractRepository;