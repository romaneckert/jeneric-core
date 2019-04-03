class Error {

    handle(err, req, res) {
        jeneric.logger.error(req.url + ' ' + err.message, err.stack);
        res.status(500);
        return res.render('core/middleware/error');
    }

}

module.exports = Error;
