const path = require('path');
let fs = require('fs');

// TODO: make methods cluster save

fs.copySync = function (src, dest) {

    // check if source exists
    if (!fs.existsSync(src)) return false;

    // check if destination exists
    if (fs.existsSync(dest)) return false;

    let stats = fs.statSync(src);

    if (stats.isDirectory()) {
        fs.mkdirSync(dest);
        let files = fs.readdirSync(src);

        for (let file of files) {
            if (!this.copySync(path.join(src, file), path.join(dest, file))) return false;
        }

    } else {
        fs.copyFileSync(src, dest);
    }

    return true;

};

fs.ensureFileExists = function (filePath) {
    if (this.existsSync(filePath)) return true;

    this.ensureDirExists(path.dirname(filePath));

    try {
        this.writeFileSync(filePath, '');
    } catch (err) {
        if ('EEXIST' !== err.code) {
            throw err;
        }
    }

    return true;
};

fs.ensureDirExists = function (directoryPath) {
    if (this.existsSync(directoryPath)) return true;

    this.ensureDirExists(path.dirname(directoryPath));

    try {
        this.mkdirSync(directoryPath);
    } catch (err) {
        if ('EEXIST' !== err.code) {
            throw err;
        }
    }

    return true;
};

class FileSystemUtil {
    constructor() {
        return fs;
    }
}

module.exports = FileSystemUtil;