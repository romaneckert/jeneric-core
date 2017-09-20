const AbstractService = require('../../abstract-service');

class AbstractEntities extends AbstractService {

    constructor(config) {
        super();

        this._config = {
            entities: []
        };

        this._data = {};

        // merge custom config with default config
        Object.assign(this._config, config);

        for (let entityName in this._config.entities) {

            // init data object
            this._data[entityName] = {};

            // init repositories
            this[this._stringToMany(entityName)] = new this._config.entities[entityName].repositoryClass(entityName);
        }

    }

    persist(object) {

        let entityName = object.entityName;
        let id = object.id;

        // check if table name already used in data
        if('undefined' === typeof this._data[entityName]) throw new Error('entity name "' + entityName + '" is not allowed');

        // set id for object if not set
        if('number' !== typeof id) id = this._getNewId(entityName);

        let objectToPersist = {};

        for(let attribute in object) {

            if(-1 === ['_instanceId', '_entityName'].indexOf(attribute)) objectToPersist[attribute] = object[attribute];

            objectToPersist._id = id;
        }

        this._data[entityName][id] = objectToPersist;

    }

    _stringToMany(value) {
        if(value.indexOf('y') === value.length - 1) return value.slice(0, -1) + 'ies';
        return value + 's';
    }

    _getNewId(entityName) {

        let increment = 0;

        for(let id in this._data[entityName]) {
            if(parseInt(id) > increment) increment = parseInt(id);
        }

        return increment + 1;
    }

    get data() {
        return this._data;
    }

    getClassByEntityName(entityName) {

        if('undefined' === typeof this._config.entities[entityName].entityClass) throw new Error(entityName + ' class does not exist');
        return this._config.entities[entityName].entityClass;
    }

    _getDataFromJsonString(jsonString) {
        return JSON.parse(jsonString, (key, value) => {

            // convert date string to date object
            if (typeof value === 'string') {
                let a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);

                if (a) return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
            }
            return value;
        });
    }
}

module.exports = AbstractEntities;