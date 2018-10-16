const errorUtil = require('../../util/error');

class Error {

    handle(err, req, res, next) {
        this.logger.error(req.url + ' ' + err.message + '"', null, errorUtil.stack(err));
        return res.render('core/middleware/error');
    }

}

module.exports = Error;
