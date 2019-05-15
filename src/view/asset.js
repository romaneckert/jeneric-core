const path = require('path');
const app = require('@jeneric/app');

class Asset {
    render(src) {
        // return path to file in asset folder with timestamp of server start date / do not check if file exists because of performance
        return path.join('/assets/', src) + '?' + app.config.app.buildTime;
    }
}

module.exports = Asset;
