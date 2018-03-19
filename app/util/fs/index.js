let fs = require('fs');

fs.path = require('path');

fs.copySync = function(src, dest) {

    // check if source exists
    if(!fs.existsSync(src)) return false;

    // check if destination exists
    if(fs.existsSync(dest)) return false;

    let stats = fs.statSync(src);

    if(stats.isDirectory()) {
        fs.mkdirSync(dest);
        let files = fs.readdirSync(src);

        for(let file of files) {
            if(!this.copySync(this.path.join(src, file), this.path.join(dest, file))) return false;
        }

    } else {
        fs.copyFileSync(src, dest);
    }

    return true;

};

fs.ensureFileExists = function(filePath) {
    if(this.existsSync(filePath)) return true;

    this.ensureFolderExists(this.path.dirname(filePath));

    this.writeFileSync(filePath, '');

    return true;
};

fs.ensureFolderExists = function(directoryPath) {
    if(this.existsSync(directoryPath)) return true;

    this.ensureFolderExists(this.path.dirname(directoryPath));
    this.mkdirSync(directoryPath);

    return true;
};

module.exports = fs;