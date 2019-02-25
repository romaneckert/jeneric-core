const path = require('path');
const objectUtil = require('../../util/object');
const fs = require('../../util/fs');

class Asset {

    constructor(config) {

        this.config = config;

        this.pathToPublic = null;
    }

    start() {

        this.pathToPublic = path.join(this.container.config.directories.slice(-1).pop(), 'public');

    }

    asset(src, opt) {

        if ('object' !== typeof opt) opt = {};

        if (opt.source) {
            return fs.readFileSync(path.join(this.pathToPublic, src));
        }

        return path.join('/', src) + '?' + Math.floor(this.container.config.startDate.getTime() / 1000);
    }

}

module.exports = Asset;
