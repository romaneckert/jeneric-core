class Access {

    handle(req, res, next) {
        this.logger.info(req.url);
        next();
    }

}

module.exports = Access;
