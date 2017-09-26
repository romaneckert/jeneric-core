const Abstract = require('./abstract');

class AbstractRepository extends Abstract {
    constructor(modelName) {
        super();

        this._modelName = modelName;
    }

    get modelClass() {
        return this.models[this._modelName];
    }

    get raw() {
        return this.data.raw[this._modelName];
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

        for(let id in this.raw) {
            let object = new this.modelClass();
            for (let attr in this.raw[id]) object[attr] = this.raw[id][attr];
            results.push(object);
        }

        return results;
    }

    _findByData(data) {

    }

    _getInstance(data) {
        let object = new this.modelClass();
        for (let attr in data) object[attr] = data[attr];
        return object;
    }

    _findById(id) {

        for(let objectId in this.raw) if(parseInt(objectId) === id) return this._getInstance(this.raw[id]);

        return null;
    }
}

module.exports = AbstractRepository;