const path = require('path');

class Asset {

    constructor() {
        this.pathToPublic = null;
    }

    init() {
        // set path to public folder of the current project
        this.pathToPublic = path.join(jeneric.config.directories.slice(-1).pop(), 'public');
    }

    asset(src, options) {

        // init options object
        if ('object' !== typeof options) options = {};

        // if options.source is true, then return content of file
        if (options.source) return fs.readFileSync(path.join(this.pathToPublic, src));

        // return path to file in asset folder with timestamp of server start date / do not check if file exists becaus eof performance
        return path.join('/assets/', src) + '?' + Math.floor(this.container.env.startDate.getTime() / 1000);
    }

}

module.exports = Asset;
