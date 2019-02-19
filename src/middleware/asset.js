class Asset {

    handle(req, res, next) {
        res.asset = res.locals.asset = function (src) {
            return this.module.asset.asset(src);
        }.bind(this);

        next();
    }

}

module.exports = Asset;
