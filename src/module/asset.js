const path = require('path');
const fs = require('../../util/fs');
const cluster = require('cluster');

class Asset {

    constructor() {
        this.pathToPublic = null;
    }

    start() {

        this.pathToPublic = path.join(this.container.config.directories.slice(-1).pop(), 'public');

        if (cluster.isMaster) {
            fs.removeSync(this.pathToPublic);
            fs.ensureDirExists(this.pathToPublic);
        }

    }

    asset(src) {

        let dest = path.join(this.pathToPublic, src);

        if (!fs.isFileSync(dest)) {
            this._copyFileToPublic(src, dest);
        }

        return path.join('/', src) + '?' + Math.floor(this.container.config.startDate.getTime() / 1000);

    }

    _copyFileToPublic(src, dest) {

        let pathToFile = null;

        for (let dir of this.container.config.directories) {

            let pathToFileInDir = path.join(dir, 'view', src);

            if (fs.isFileSync(pathToFileInDir)) {
                pathToFile = pathToFileInDir;
            }
        }

        if (null === pathToFile) {
            throw new Error(`file ${src} could not be found`)
        }

        let result = path.join('/', src);

        if (!fs.isFileSync(dest)) {
            fs.ensureDirExists(path.dirname(dest));
            fs.copyFileSync(pathToFile, dest);
        }
    }

}

module.exports = Asset;
