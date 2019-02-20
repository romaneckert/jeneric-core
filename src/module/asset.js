const path = require('path');
const fs = require('../../util/fs');
const cluster = require('cluster');

class Asset {

    constructor(config) {

        this.config = config;

        this.pathToPublic = null;
    }

    start() {

        this.pathToPublic = path.join(this.container.config.directories.slice(-1).pop(), 'public');

    }

    asset(src) {
        return path.join('/', src) + '?' + Math.floor(this.container.config.startDate.getTime() / 1000);
    }

}

module.exports = Asset;
