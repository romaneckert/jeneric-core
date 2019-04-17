const app = require('@jeneric/app');

class Access {

    handle(req, res, next) {
        app.logger.info(req.url);
        app.module.report.addRequest(req.url)
        return next();
    }

}

module.exports = Access;
