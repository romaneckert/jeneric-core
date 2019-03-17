class Access {

    handle(req, res, next) {
        jeneric.logger.info(req.url);
        jeneric.module.report.addRequest(req.url)
        return next();
    }

}

module.exports = Access;
