const path = require('path');
const app = require('@jeneric/app');

class Asset {

    render(src, options) {

        // init options object
        if ('object' !== typeof options) options = {};

        // if options.source is true, then return content of file
        if (options.source) return app.util.fs.readFileSync(path.join(app.config.app.path, 'public', src));

        // return path to file in asset folder with timestamp of server start date / do not check if file exists because of performance
        return path.join('/assets/', src) + '?' + Math.floor(app.config.app.buildDate.getTime() / 1000);
    }

}

module.exports = Asset;
