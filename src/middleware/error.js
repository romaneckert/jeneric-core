class Error {

    handle(err, req, res, next) {
        this.logger.error('error in "' + req.url + '" with message: ' + err.message, null, this.util.error.stack(err));
        return res.render('core/middleware/error');
    }

}

module.exports = Error;
