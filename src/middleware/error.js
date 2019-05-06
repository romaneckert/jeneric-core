const app = require('@jeneric/app');

class Error {

    async handle(err, req, res, next) {
        await app.logger.error(req.url + ' ' + err.message, err.stack);
        res.status(500);
        return res.render('status-500');
    }

}

module.exports = Error;
