'use strict';

const path = require('path');

const fs = require('fs');

fs.copySync = (src, dest) => {
    // check if source exists
    if (!fs.existsSync(src)) return false;

    // check if destination exists
    if (fs.existsSync(dest)) return false;

    let stats = fs.statSync(src);

    if (stats.isDirectory()) {
        try {
            fs.mkdirSync(dest);
        } catch (err) {
            if ('EEXIST' !== err.code) throw err;
        }

        let files = fs.readdirSync(src);

        for (let file of files) {
            if (!fs.copySync(path.join(src, file), path.join(dest, file))) return false;
        }

    } else {
        fs.copyFileSync(src, dest);
    }

    return true;
};

fs.symlinkOnlyFilesSync = (src,dest) => {

    // check if source exists
    if (!fs.existsSync(src)) return false;

    // check if destination exists
    if (fs.existsSync(dest)) return false;

    let stats = fs.statSync(src);

    if (stats.isDirectory()) {
        try {
            fs.mkdirSync(dest);
        } catch (err) {
            if ('EEXIST' !== err.code) throw err;
        }

        let files = fs.readdirSync(src);

        for (let file of files) {
            if (!fs.symlinkOnlyFilesSync(path.join(src, file), path.join(dest, file))) return false;
        }

    } else {
        fs.symlinkSync(src, dest);
    }

    return true;
};

fs.ensureFileExists = function (filePath) {
    if (fs.existsSync(filePath)) return true;

    fs.ensureDirExists(path.dirname(filePath));

    try {
        fs.writeFileSync(filePath, '');
    } catch (err) {
        if ('EEXIST' !== err.code) {
            throw err;
        }
    }

    return true;
};

fs.ensureDirExists = function (directoryPath) {
    if (fs.existsSync(directoryPath)) return true;

    fs.ensureDirExists(path.dirname(directoryPath));

    try {
        fs.mkdirSync(directoryPath);
    } catch (err) {
        if ('EEXIST' !== err.code) {
            throw err;
        }
    }

    return true;
};

fs.creationDate = function (directory) {

    if (!fs.existsSync(directory)) {
        return false;
    }

    return fs.lstatSync(directory).ctime;
};

/**
 * @description Remove synchronous a file or directory.
 * @example
 * fs.removeSync('./path')
 * @param {string} directory - Path to directory.
 * @returns {boolean} - True if done.
 */
fs.removeSync = function (directory) {

    if (fs.lstatSync(directory).isFile()) {
        fs.unlinkSync(directory);
        return true;
    }

    if (fs.lstatSync(directory).isSymbolicLink()) {
        fs.unlinkSync(directory);
        return true;
    }

    if (fs.lstatSync(directory).isDirectory()) {
        for (let file of fs.readdirSync(directory)) {
            fs.removeSync(path.join(directory, file));
        }

        fs.rmdirSync(directory);
    }

    return true;

};

module.exports = fs;
