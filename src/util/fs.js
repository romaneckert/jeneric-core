'use strict';

const fs = require('fs').promises;

fs.path = require('path');
fs.constants = require('fs').constants;

fs.remove = async (path) => {

    if (fs.isDirectory(path)) {

        for (let file of await fs.readdir(path)) {
            await fs.remove(fs.path.join(path, file));
        }

        await fs.rmdir(path);
    } else if(fs.isFile(path)) {
        await fs.unlink(path);
    }

    return true;
};

fs.isFile = async(path) => {
    try {
        let stats = await fs.stat(path);
        return stats.isFile();
    } catch(err) {
        return false;
    }
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

module.exports = fs;
