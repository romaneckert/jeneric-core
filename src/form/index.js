const mongoose = require('mongoose');

class Form {
    constructor(schema, instance) {

        if ('object' !== typeof schema) {
            throw new Error('schema have to be defined');
        }

        this.instance = ('object' === typeof instance) ? instance : null;
        this.schema = schema;
        this.errors = null;
        this.submitted = false;
        this.valid = false;
        this.data = null;
    }

    handle(data) {

        // test if data is empty
        if ('object' !== typeof data || 0 === Object.keys(data).length) return this;

        // set form to status submitted
        this.submitted = true;

        let instanceErrors = {};

        // remove values from data which are not in schema
        for (let key in data) {
            if (undefined === this.schema[key]) delete data[key];
        }

        this.data = data;

        // merge data to instance and generate errors
        if (null !== this.instance) {
            jeneric.util.object.merge(this.instance, data);
            instanceErrors = this._getErrors(this.instance);
        }

        // generate a random string for mongoose model name
        let randomModelName = 'jeneric-form-' + Math.random().toString(26).slice(2);

        // generate a temp instance for validation
        let instanceToValidate = new mongoose.model(randomModelName, new mongoose.Schema(this.schema))(data);
        let instanceToValidateErrors = this._getErrors(instanceToValidate);

        // delete random model from mongoose
        mongoose.deleteModel(randomModelName);

        // create errors
        this.errors = jeneric.util.object.merge(instanceErrors, instanceToValidateErrors);

        // set from to valid if errors empty
        if (0 === Object.keys(this.errors).length) {
            this.valid = true;
            this.errors = null;
        }

        return this;
    }

    _getErrors(instance) {
        let instanceErrors = instance.validateSync();

        if ('object' !== typeof instanceErrors || 'object' !== typeof instanceErrors.errors) {
            return {};
        }

        let errors = {};

        for (let key in instanceErrors.errors) {
            if ('string' !== typeof instanceErrors.errors[key].message) continue;

            if (undefined === errors[key]) errors[key] = [];
            errors[key].push({
                kind: instanceErrors.errors[key].kind,
                message: instanceErrors.errors[key].message
            });
        }

        return errors;
    }

    addError(key, message, kind) {

        if (null === this.errors) this.errors = {};

        if ('string' !== typeof kind || 0 === kind.length) {
            kind = 'undefined'
        }

        if (undefined === this.errors[key]) this.errors[key] = [];

        this.errors[key].push({
            kind: kind,
            message: message
        });

        return this;
    }
}

module.exports = Form;
