'use strict';

const fs = require('fs').promises;

fs.path = require('path');
fs.constants = require('fs').constants;

/**
 * @description Remove a file or directory.
 * @example
 * await app.util.fs.remove('./path')
 * @param {string} path - Path to directory.
 * @returns {boolean} - True if done.
 */
fs.remove = async (path) => {

    if (await fs.isFile(path)) {

        await fs.unlink(path);

    } else if (await fs.isSymbolicLink(path)) {

        await fs.unlink(path);

    } else if (await fs.isDirectory(path)) {

        for (let file of await fs.readdir(path)) {
            await fs.remove(fs.path.join(path, file));
        }

        await fs.rmdir(path);
    }

};

fs.isFile = async (path) => {

    let stats = null;

    try {
        stats = await fs.lstat(path);
    } catch (err) {
        return false;
    }

    return stats.isFile();
};

fs.isSymbolicLink = async (path) => {
    let stats = null;

    try {
        stats = await fs.lstat(path);
    } catch (err) {
        return false;
    }

    return stats.isSymbolicLink();
};

fs.isDirectory = async (path) => {

    let stats = null;

    try {
        stats = await fs.lstat(path);
    } catch (err) {
        return false;
    }

    return stats.isDirectory();
};

fs.ensureDirExists = async (path) => {

    await fs.mkdir(path, {recursive: true});

    return true;
};

fs.ensureFileExists = async (path) => {

    try {
        await fs.access(path, fs.constants.R_OK);
        return true;
    } catch (err) {
        await fs.ensureDirExists(fs.path.dirname(path))
    }

    await fs.appendFile(path, '');

    return true;
};

fs.isWritable = async (path) => {
    try {
        await fs.access(path, fs.constants.R_OK | fs.constants.W_OK);
        return true;
    } catch (err) {
        return false;
    }
};

module.exports = fs;
