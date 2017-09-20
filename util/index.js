const path = require('path');
const fs = require('fs');

class Util {
    static ensureFileExists(filepath) {

        if(fs.existsSync(filepath)) return true;

        let dirname = path.dirname(filepath);

        this.ensureFolderExists(dirname);

        fs.writeFileSync(filepath, '');

        return true;

    }

    static ensureFolderExists(folderPath) {
        if(fs.existsSync(folderPath)) return true;

        this.ensureFolderExists(path.dirname(folderPath));
        fs.mkdirSync(folderPath);

        return true;
    }
}

module.exports = Util;