const AbstractAction = require('../../abstract-action');

class StatusCode500 extends AbstractAction {

    action(err, req, res, next) {
        this.logger.error(err.message, null, this.util.error.stack(err));
        return res.render('core/statusCode500');
    }

}

module.exports = StatusCode500;
