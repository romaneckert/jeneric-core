const AbstractHandler = require('../../core/abstract-handler');

class Test extends AbstractHandler {

    action(req, res) {
        this.logger.debug('Test: ' + req.url);
        return res.render('core/test');
    }

}

module.exports = Test;

