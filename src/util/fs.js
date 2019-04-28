'use strict';

const fs = require('fs').promises;

fs.path = require('path');
fs.constants = require('fs').constants;

fs.remove = async (path) => {

    if(await fs.isFile(path)) {

        try {
            await fs.unlink(path);
        } catch(err) {
            console.log(err);
        }

    } else if (fs.isDirectory(path)) {

        for (let file of await fs.readdir(path)) {
            await fs.remove(fs.path.join(path, file));
        }

        try {
            await fs.rmdir(path);
        } catch(err) {
            throw new Error('can not remove dir');
        }

    }

    return true;
};

fs.isFile = async(path) => {

    let stats = null;

    try {
        stats = await fs.stat(path);
    } catch(err) {
        return false;
    }

    if(stats.isFile()) return true;

    if(stats.isSymbolicLink()) {
        return await fs.isFile(await fs.readlink(path));
    }

    return false;
};

fs.isDirectory = async(path) => {

    let stats = null;

    try {
        stats = await fs.stat(path);
    } catch(err) {
        return false;
    }

    if(stats.isDirectory()) return true;

    if(stats.isSymbolicLink()) {
        return await fs.isDirectory(await fs.readlink(path));
    }

    return false;
};

fs.ensureDirExists = async (path) => {
    try {
        await fs.access(path, fs.constants.R_OK);
        return true;
    } catch(err) {
        await fs.ensureDirExists(fs.path.dirname(path))
    }

    await fs.mkdir(path);

    return true;
};

fs.isWritable = async (path) => {
    try {
        await fs.access(path, fs.constants.R_OK | fs.constants.W_OK);
        return true;
    } catch(err) {
        return false;
    }
};

module.exports = fs;
