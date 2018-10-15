class Test {

    handle(req, res) {
        this.logger.debug('Test: ' + req.url);
        return res.render('core/test');
    }

}

module.exports = Test;

