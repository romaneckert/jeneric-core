const AbstractService = require('../../abstract-service');
const fs = require('fs');
const path = require('path')

class FileSystem extends AbstractService {

    constructor() {
        super();
    }

    appendFileSync(file, data, options) {
        return fs.appendFileSync(file, data, options);
    }

    dirname(filepath) {
        return path.dirname(filepath);
    }

    existsSync(path) {
        return fs.existsSync(path);
    }

    mkdirSync(filepath) {
        return fs.mkdirSync(filepath);
    }

    writeFileSync(file, data, options) {
        return fs.writeFileSync(file, data, options);
    }

    ensureFileExists(filepath) {

        if(this.existsSync(filepath)) return true;

        let dirname = this.dirname(filepath);

        this.ensureFolderExists(dirname);

        this.writeFileSync(filepath, '');

        return true;

    }

    ensureFolderExists(folderPath) {
        if(this.existsSync(folderPath)) return true;

        this.ensureFolderExists(this.dirname(folderPath));
        this.mkdirSync(folderPath);

        return true;
    }

}

module.exports = FileSystem;