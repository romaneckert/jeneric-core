'use strict';

const nodePath = require('path');
const fsOld = require('fs');

// TODO: optimize
fsOld.fileNameToClassName = (fileName) => {
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
fsOld.isDirectorySync = function(path) {

    let stats = null;

    // check if directory is a symlink or broken symlink
    try {
        stats = fsOld.lstatSync(path);
    } catch(err) {
        stats = null;
    }

    if(null === stats) return false;

    // return true if directory
    if(stats.isDirectory()) return true;

    // return true if symlink and symlink is dir
    if(stats.isSymbolicLink()) {
        try {
            return fsOld.lstatSync(fsOld.readlinkSync(path)).isDirectory();
        } catch(err) {
            return false;
        }
    }

    return false;

};

fsOld.isFileSync = (path) => {
    let stats = null;

    // check if directory is a symlink or broken symlink
    try {
        stats = fsOld.lstatSync(path);
    } catch(err) {
        stats = null;
    }

    if(null === stats) return false;

    // return true if directory
    if(stats.isFile()) return true;

    // return true if symlink and symlink is dir
    if(stats.isSymbolicLink()) {
        try {
            return fsOld.lstatSync(fsOld.readlinkSync(path)).isFile();
        } catch(err) {
            return false;
        }
    }

    return false;

};

fsOld.copySync = (src, dest) => {
    // check if source exists
    if (!fsOld.existsSync(src)) return false;

    // check if destination exists
    if (fsOld.existsSync(dest)) return false;

    let stats = fsOld.statSync(src);

    if (stats.isDirectory()) {
        try {
            fsOld.mkdirSync(dest);
        } catch (err) {
            if ('EEXIST' !== err.code) throw err;
        }

        let files = fsOld.readdirSync(src);

        for (let file of files) {
            if (!fsOld.copySync(nodePath.join(src, file), nodePath.join(dest, file))) return false;
        }

    } else {
        fsOld.copyFileSync(src, dest);
    }

    return true;
};

fsOld.ensureFileExists = function (path) {
    if (fsOld.existsSync(path)) return true;

    fsOld.ensureDirExists(nodePath.dirname(path));

    try {
        fsOld.writeFileSync(path, '');
    } catch (err) {
        if ('EEXIST' !== err.code) {
            throw err;
        }
    }

    return true;
};

fsOld.ensureDirExists = function (path) {
    if (fsOld.existsSync(path)) return true;

    fsOld.ensureDirExists(nodePath.dirname(path));

    try {
        fsOld.mkdirSync(path);
    } catch (err) {
        if ('EEXIST' !== err.code) {
            throw err;
        }
    }

    return true;
};

fsOld.creationDate = function (path) {

    if (!fsOld.existsSync(path)) {
        return false;
    }

    return fsOld.lstatSync(path).ctime;
};

/**
 * @description Remove synchronous a file or directory.
 * @example
 * fs.removeSync('./path')
 * @param {string} path - Path to directory.
 * @returns {boolean} - True if done.
 */
fsOld.removeSync = function (path) {

    let stats = null;

    // check if directory is a symlink or broken symlink
    try {
        stats = fsOld.lstatSync(path);
    } catch(err) {
        stats = null;
    }

    if(null === stats) return true;

    if (stats.isDirectory()) {
        for (let file of fsOld.readdirSync(path)) {
            fsOld.removeSync(nodePath.join(path, file));
        }

        fsOld.rmdirSync(path);
    } else {
        fsOld.unlinkSync(path);
    }

    return true;

};

module.exports = fsOld;
