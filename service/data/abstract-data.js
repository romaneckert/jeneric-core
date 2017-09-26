const AbstractService = require('../../abstract-service');

class AbstractData extends AbstractService {

    constructor() {
        super();

        this._raw = {};

        for (let modelName in this.models) this._raw[modelName] = [];

    }

    persist(object) {

        let modelName = object.modelName;

        // check if table name already used in data
        if ('undefined' === typeof this._raw[modelName]) throw new Error('model name "' + modelName + '" is not allowed');

        let objectToPersist = {};

        for (let attribute in object) {
            if (-1 === ['_instanceId', '_entityName'].indexOf(attribute)) objectToPersist[attribute] = object[attribute];
        }

        this._raw[modelName].push(objectToPersist);

    }

    get raw() {
        return this._raw;
    }
}

module.exports = AbstractData;