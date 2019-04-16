'use strict';

const nodePath = require('path');
const fs = require('fs');

// TODO: optimize
fs.fileNameToClassName = (fileName) => {
    let key = fileName.split('.')[0];
    let parts = key.split('-');

    for (let p in parts) {
        if (0 == p) {
            continue;
        }
        parts[p] = parts[p].charAt(0).toUpperCase() + parts[p].slice(1)
    }

    return parts.join('');
};

/**
 * @description Check if a path is a directory or a symlink, which links to a directory.
 * @example
 * fs.isDirectorySync(path)
 * @param {string} path - Path of the directory.
 * @returns {boolean} - Returns true if directoryPath is a directory or a symlink, which links to a directory.
 */
fs.isDirectorySync = function(path) {

    let stats = null;

    // check if directory is a symlink or broken symlink
    try {
        stats = fs.lstatSync(path);
    } catch(err) {
        stats = null;
    }

    if(null === stats) return false;

    // return true if directory
    if(stats.isDirectory()) return true;

    // return true if symlink and symlink is dir
    if(stats.isSymbolicLink()) {
        try {
            return fs.lstatSync(fs.readlinkSync(path)).isDirectory();
        } catch(err) {
            return false;
        }
    }

    return false;

};

fs.isFileSync = (path) => {
    let stats = null;

    // check if directory is a symlink or broken symlink
    try {
        stats = fs.lstatSync(path);
    } catch(err) {
        stats = null;
    }

    if(null === stats) return false;

    // return true if directory
    if(stats.isFile()) return true;

    // return true if symlink and symlink is dir
    if(stats.isSymbolicLink()) {
        try {
            return fs.lstatSync(fs.readlinkSync(path)).isFile();
        } catch(err) {
            return false;
        }
    }

    return false;

};

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
            if (!fs.copySync(nodePath.join(src, file), nodePath.join(dest, file))) return false;
        }

    } else {
        fs.copyFileSync(src, dest);
    }

    return true;
};

fs.ensureFileExists = function (path) {
    if (fs.existsSync(path)) return true;

    fs.ensureDirExists(nodePath.dirname(path));

    try {
        fs.writeFileSync(path, '');
    } catch (err) {
        if ('EEXIST' !== err.code) {
            throw err;
        }
    }

    return true;
};

fs.ensureDirExists = function (path) {
    if (fs.existsSync(path)) return true;

    fs.ensureDirExists(nodePath.dirname(path));

    try {
        fs.mkdirSync(path);
    } catch (err) {
        if ('EEXIST' !== err.code) {
            throw err;
        }
    }

    return true;
};

fs.creationDate = function (path) {

    if (!fs.existsSync(path)) {
        return false;
    }

    return fs.lstatSync(path).ctime;
};

/**
 * @description Remove synchronous a file or directory.
 * @example
 * fs.removeSync('./path')
 * @param {string} path - Path to directory.
 * @returns {boolean} - True if done.
 */
fs.removeSync = function (path) {

    let stats = null;

    // check if directory is a symlink or broken symlink
    try {
        stats = fs.lstatSync(path);
    } catch(err) {
        stats = null;
    }

    if(null === stats) return true;

    if (stats.isDirectory()) {
        for (let file of fs.readdirSync(path)) {
            fs.removeSync(nodePath.join(path, file));
        }

        fs.rmdirSync(path);
    } else {
        fs.unlinkSync(path);
    }

    return true;

};

module.exports = fs;
