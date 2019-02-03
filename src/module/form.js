const mongoose = require('mongoose');
const objectUtil = require('../../util/object');

class Form {

    handle(instance, data) {

        let result = {
            instance: instance,
            errors: null,
            submitted: false,
            valid: false
        };

        if (0 === Object.keys(data).length) {
            return result;
        }

        result.submitted = true;

        objectUtil.merge(instance, data);

        let errors = result.instance.validateSync();

        if (undefined === errors) {
            result.valid = true;
        } else {
            result.errors = errors.errors;
        }

        return result;
    }

}

module.exports = Form;
