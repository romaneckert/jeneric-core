module.exports = class Index {

    async handle(req, res) {

        let errors = {
            password: {
                short: 'The password is too short',
                special_chars: 'The password has no special chars'
            }
        };

        return res.render(
            'index',
            {
                errors: errors
            }
        );
    }

};
