const app = require('@jeneric/app');

class Error {

    handle(err, req, res, next) {
        app.logger.error(req.url + ' ' + err.message, err.stack);
        res.status(500);
        return res.render('status-500');
    }

}

module.exports = Error;
