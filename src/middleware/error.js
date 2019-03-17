class Error {

    handle(err, req, res, next) {
        jeneric.logger.error(req.url + ' ' + err.message);
        res.status(500);
        return res.render('core/middleware/error');
    }

}

module.exports = Error;
