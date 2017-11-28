const fs = require('fs');
const path = require('path');

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
    },
    copySync : function(src, dest) {

        let ret = true;

        // check if source exists
        if(!fs.existsSync(src)) return false;

        // check if destination exists
        if(fs.existsSync(dest)) return false;

        let stats = fs.statSync(src);

        if(stats.isDirectory()) {
            fs.mkdirSync(dest);
            let files = fs.readdirSync(src);

            for(let file of files) {
                if(!this.copySync(path.join(src, file), path.join(dest, file))) return false;
            }

        } else {
            fs.copyFileSync(src, dest);
        }

        return ret;
    }
};