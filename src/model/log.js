const mongoose = require('mongoose');

class Log {
    constructor() {

        let schema = new mongoose.Schema({
            code: {
                type: Number,
                required: true
            },
            date: {
                type: Date,
                required: true,
            },
            message: {
                type: String,
                required: true,
            },
            meta: {
                type: String
            },
            type: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            stack: {
                type: String,
                required: true
            }
        }, { versionKey: false });

        return new mongoose.model(this.constructor.name, schema);

    }

}

module.exports = Log;
