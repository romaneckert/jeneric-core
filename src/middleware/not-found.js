const Middleware = require('../../middleware');

class NotFound extends Middleware {

    handle(req, res) {
        return res.render('core/middleware/not-found');
    }

}

module.exports = NotFound;

