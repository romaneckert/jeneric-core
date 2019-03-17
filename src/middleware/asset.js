class Asset {

    handle(req, res, next) {
        res.asset = res.locals.asset = jeneric.module.asset.asset;
        return next();
    }

}

module.exports = Asset;
