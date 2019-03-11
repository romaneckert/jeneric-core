const errorUtil = require('../util/error');

class Error {

    handle(err, req, res, next) {
        this.logger.error(req.url + ' ' + err.message, null, errorUtil.stack(err));
        res.status(500);
        return res.render('core/middleware/error');
    }

}

module.exports = Error;
