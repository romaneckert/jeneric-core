class Asset {

    handle(req, res, next) {
        res.asset = res.locals.asset = function (src, opt) {
            return this.module.asset.asset(src, opt);
        }.bind(this);

        next();
    }

}

module.exports = Asset;
