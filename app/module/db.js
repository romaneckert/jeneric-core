const mongoClient = require('mongodb').MongoClient;

class DB {
    constructor(config) {

        this.db = null;
        this.ready = false;

        let clientSettings = {
            autoReconnect: true,
            reconnectTries: 9999999999999999999999999,
            useNewUrlParser: true
        };

        mongoClient.connect(config.uri, clientSettings, (err, client) => {

            setInterval(() => {
                if (client.isConnected()) {
                    this.ready = true;
                } else {
                    this.ready = false;
                }
            }, 1000);

            let db = client.db;
            console.log('MongoDB connected');

            client.on('close', () => {
                console.log('MongoDB disconnected');
                this.ready = false;
            });

            this.db = db;
            this.ready = true;
        });

        return this.db;

    }
}

module.exports = DB;