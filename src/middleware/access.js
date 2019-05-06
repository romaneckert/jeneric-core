const app = require('@jeneric/app');

class Access {

    async handle(req, res, next) {
        await app.logger.info(req.url);
        app.module.report.addRequest(req.url)
        return next();
    }

}

module.exports = Access;
