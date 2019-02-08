const mongoose = require('mongoose');
const objectUtil = require('../../util/object');

class Form {
    constructor(schema, instance) {

        if ('object' !== typeof schema) {
            throw new Error('schema have to be defined');
        }

        this.instance = ('object' === typeof instance) ? instance : null;
        this.schema = schema;
        this.errors = {};
        this.submitted = false;
        this.valid = false;
    }

    handle(data) {

        // set form to status submitted
        this.submitted = true;

        // set errors empty
        this.errors = {};

        // test if data is empty
        if ('object' !== typeof data || 0 === Object.keys(data).length) return this;

        let instanceErrors = {};

        // remove values from data which are not in schema
        for (let key in data) {
            if (undefined === this.schema[key]) delete data[key];
        }

        // merge data to instance and generate errors
        if (null !== this.instance) {
            objectUtil.merge(this.instance, data);
            instanceErrors = this._getErrors(this.instance);
        }

        // generate a random string for mongoose model name
        let randomModelName = 'jeneric-form-' + Math.random().toString(26).slice(2);
        let instanceToValidate = new mongoose.model(randomModelName, new mongoose.Schema(this.schema))(data);

        // merge data to instance of custom schema
        objectUtil.merge(instanceToValidate, data);
        let instanceToValidateErrors = this._getErrors(this.instance);

        // delete random model from mongoose
        mongoose.deleteModel(randomModelName);

        // merge errors of instance and custom instance
        for (let key in instanceToValidateErrors) {
            if (undefined === instanceErrors[key]) continue;
            this.errors[key] = [...new Set(concat(instanceErrors[key], instanceToValidateErrors[key]))];
        }

        // set from to valid if errors empty
        if (0 === Object.keys(this.errors).length) {
            this.valid = true;
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
            errors[key].push(instanceErrors.errors[key].message);
        }

        return errors;
    }

    addError(key, message) {

        this.errors[key] = message;

        return this;
    }
}

module.exports = Form;
