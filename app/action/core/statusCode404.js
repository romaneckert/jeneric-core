const AbstractAction = require('../../abstract-action');

class StatusCode404 extends AbstractAction {

    action(req, res) {
        this.logger.debug('404: ' + req.url);
        return res.render('core/statusCode404');
    }

}

module.exports = StatusCode404;

