const AbstractMiddleware = require('../core/abstract-middleware');

class NotFound extends AbstractMiddleware {

    handle(req, res) {
        return res.render('core/middleware/not-found');
    }

}

module.exports = NotFound;

