const app = require('@jeneric/app');

module.exports = class Index {

    async handle(req, res) {

        let errors = {
            password: {
                short: 'The password is too short',
                special_chars: 'The password has no special chars'
            }
        };

        let logs = await app.model.log.find().sort({date: -1}).limit(10);

        res.render(
            'index',
            {
                errors: errors,
                logs: logs
            }
        );
    }

};
