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

        this.errors = {};

        if (0 === Object.keys(data).length) {
            return this;
        }

        this.submitted = true;

        let Model = mongoose.model('JenericForm', new mongoose.Schema(this.schema));
        let instanceToValidate = new Model(data);

        objectUtil.merge(instanceToValidate, data);

        let errors = {};

        if (null !== this.instance) {
            objectUtil.merge(this.instance, data);
            this.instance.validateSync();
        }

        objectUtil.merge(errors, instanceToValidate.validateSync());

        mongoose.deleteModel('JenericForm');

        if (undefined === errors) {
            this.valid = true;
        } else {
            for (let key in errors.errors) {
                this.errors[key] = errors.errors[key].message;
            }
        }

        return this;
    }

    addError(key, message) {

        this.errors[key] = message;

        return this;
    }
}

module.exports = Form;
