const Handler = require('../../../handler');

class Test extends Handler {

    handle(req, res) {
        this.logger.debug('Test: ' + req.url);
        return res.render('core/test');
    }

}

module.exports = Test;

