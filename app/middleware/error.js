const AbstractMiddleware = require('../abstract-middleware');

class Error extends AbstractMiddleware {

    handle(err, req, res, next) {
        this.logger.error(err.message, null, this.util.error.stack(err));
        return res.render('core/middleware/error');
    }

}

module.exports = Error;
