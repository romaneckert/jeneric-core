const path = require('path');
let fs = require('fs');

fs.copySync = function (src, dest) {

    // check if source exists
    if (!fs.existsSync(src)) return false;

    // check if destination exists
    if (fs.existsSync(dest)) return false;

    let stats = fs.statSync(src);

    if (stats.isDirectory()) {
        try {
            this.mkdirSync(dest);
        } catch (err) {
            if ('EEXIST' !== err.code) {
                throw err;
            }
        }

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

fs.creationDate = function (directory) {

    if (!this.existsSync(directory)) {
        return false;
    }

    return this.lstatSync(directory).ctime;
};

fs.isFileSync = function (directory) {

    if (!this.existsSync(directory)) {
        return false;
    }

    return this.lstatSync(directory).isFile();
};

fs.isDirectorySync = function (directory) {

    if (!this.existsSync(directory)) {
        return false;
    }

    return this.lstatSync(directory).isDirectory();
};

fs.removeSync = function (directory) {

    if (this.isFileSync(directory)) {
        this.unlinkSync(directory);
        return true;
    }

    if (this.isDirectorySync(directory)) {
        for (let file of this.readdirSync(directory)) {
            this.removeSync(path.join(directory, file));
        }

        this.rmdirSync(directory);
    }

    return true;
}

module.exports = fs;
