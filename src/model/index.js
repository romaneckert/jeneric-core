const mongoose = require('mongoose');

class Model {
    constructor() {
        this._model = null;
        this._schema = null;
    }

    get model() {

        if (null === this._schema) throw new Error('schema not defined');

        if (null === this._model) {
            let schema = mongoose.Schema(this._schema);
            this._model = new mongoose.model(this.constructor.name, schema);
        }

        return this._model;
    }
}

module.exports = Model;
