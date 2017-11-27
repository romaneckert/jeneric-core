const fs = require('fs');
const path = require('path')

module.exports = {
    appendFileSync : function(file, data, options) {
        return fs.appendFileSync(file, data, options);
    },
    dirname : function(filepath) {
        return path.dirname(filepath);
    },
    existsSync : function(path) {
        return fs.existsSync(path);
    },
    mkdirSync : function(filepath) {
        return fs.mkdirSync(filepath);
    },
    writeFileSync : function(file, data, options) {
        return fs.writeFileSync(file, data, options);
    },
    ensureFileExists : function(filepath) {
        if(this.existsSync(filepath)) return true;

        let dirname = this.dirname(filepath);

        this.ensureFolderExists(dirname);

        this.writeFileSync(filepath, '');

        return true;
    },
    ensureFolderExists : function(folderPath) {
        if(this.existsSync(folderPath)) return true;

        this.ensureFolderExists(this.dirname(folderPath));
        this.mkdirSync(folderPath);

        return true;
    }
};