const AbstractObjectManager = require('./abstract-object-manager');

class ObjectManager extends AbstractObjectManager {
    constructor(config) {

        super(config);

        // default config
        /*
        this._config = {
            file : 'var/data/data.json'
        };

        Object.assign(this._config, config);*/

        //this._config.file = path.join(path.dirname(require.main.filename), this._config.file);
        //Util.ensureFileExists(this._config.path);

        // read data from json
        //let rawData = this._getDataFromJsonString(fs.readFileSync(this._config.file));



        // set entity class to each object
        /*
        for(let entityName in rawData) {

            let entityData = rawData[entityName];

            for(let id in entityData) {
                let entityClass = require(path.join(__dirname, '/../entity/' + entityName + '.js'));

                rawData[entityName][id].__proto__ = entityClass.prototype;

                this.persist(rawData[entityName][id]);
            }
        }*/
    }
}

module.exports = ObjectManager;