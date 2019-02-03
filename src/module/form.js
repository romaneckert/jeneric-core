const mongoose = require('mongoose');

class Form {

    handle(Model, data) {

        let result = {
            instance: null,
            errors: null,
            submitted: false,
            valid: false
        };

        if (0 === Object.keys(data).length) {
            return result;
        }

        result.submitted = true;

        result.instance = new Model(data);

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
