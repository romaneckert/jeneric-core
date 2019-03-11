class Access {

    handle(req, res, next) {
        this.logger.info(req.url);
        this.module.report.addRequest(req.url)
        return next();
    }

}

module.exports = Access;
