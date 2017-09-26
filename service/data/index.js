const AbstractData = require('./abstract-data');
const Sequelize = require('sequelize');

class Data extends AbstractData {
    constructor(config) {

        super();

        this._db = null;

        // default config
        this._config = {};

        this.utils.object.merge(this._config, config);

        this._db = new Sequelize(this._config.db.database, this._config.db.username, this._config.db.password, {
            host: this._config.db.host,
            dialect: 'postgres',
            pool: {
                max: 10,
                min: 0,
                idle: 10000
            },
            logging : function(message) {
                this.logger.debug(message)
            }.bind(this)
        });

        // test postgres connection
        this._db
            .authenticate()
            .then(() => {
                this.logger.info('Connection to database has been established successfully.');
            })
            .catch(error => {
                this.logger.critical('Unable to connect to the database', error);
                process.exit(1);
            });

        // create tables in database if not exists
        for (let modelName in this.models) {
            let object = new this.models[modelName]();

            console.log(object);

            var definition = this._db.define(modelName, )

            console.log(definition);

        }

    }


}

module.exports = Data;