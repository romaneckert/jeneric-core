const mongoose = require('mongoose');
const objectUtil = require('../../util/object');

class Form {
    constructor(instance) {
        this.instance = instance;
        this.errors = {};
        this.submitted = false;
        this.valid = true;
    }

    handle(data) {

        if (0 === Object.keys(data).length) {
            return this;
        }

        this.submitted = true;

        objectUtil.merge(this.instance, data);

        let errors = this.instance.validateSync();

        if (undefined === errors) {
            this.valid = true;
        } else {
            this.errors = errors.errors;
        }

        return this;
    }

    addError(error) {

        objectUtil.merge(this.errors, error);

        return this;
    }
}

module.exports = Form;
