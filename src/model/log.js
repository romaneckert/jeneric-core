const Model = require('./index');

class Log extends Model {
    constructor() {

        super();

        this._schema = {
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
        };
    }

}

module.exports = Log;
