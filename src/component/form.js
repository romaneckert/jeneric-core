const mongoose = require('mongoose');
const objectUtil = require('../../util/object');

class Form {
    constructor(schema, instance) {

        this.schema = schema;
        this.instance = instance;
        this.errors = {};
        this.submitted = false;
        this.valid = false;

        if (null === this.schema && null === this.instance) {
            throw new Error('schema and instance are null');
        }
    }

    handle(data) {

        this.errors = {};

        if (0 === Object.keys(data).length) {
            return this;
        }

        this.submitted = true;

        let instance = null;

        if (null !== this.schema) {
            let Model = mongoose.model('JenericForm', new mongoose.Schema(this.schema));
            instance = new Model(data);
        } else {
            instance = this.instance;
            objectUtil.merge(instance, data);
        }

        let errors = instance.validateSync();

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
