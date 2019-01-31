const mongoose = require('mongoose');

class Form {

    handle(schema, req) {

        let result = {
            data: null,
            errors: null,
            submitted: false,
            valid: false
        };

        if (0 === Object.keys(req.body).length) {
            return result;
        }

        result.submitted = true;

        let mongooseSchema = mongoose.Schema(schema);
        let Model = mongoose.model('form', schema);

        result.data = new Model(req.body);

        let errors = result.data.validateSync();

        if (undefined === errors) {
            result.valid = true;
        } else {
            result.errors = errors.errors;
        }

        return result;
    }

}

module.exports = Form;
