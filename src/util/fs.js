const path = require('path');

class FS {
    copySync(src, dest) {

        // check if source exists
        if (!this.existsSync(src)) return false;

        // check if destination exists
        if (this.existsSync(dest)) return false;

        let stats = fs.statSync(src);

        if (stats.isDirectory()) {
            try {
                this.mkdirSync(dest);
            } catch (err) {
                if ('EEXIST' !== err.code) {
                    throw err;
                }
            }

            let files = this.readdirSync(src);

            for (let file of files) {
                if (!this.copySync(path.join(src, file), path.join(dest, file))) return false;
            }

        } else {
            this.copyFileSync(src, dest);
        }

        return true;

    };

    ensureFileExists(filePath) {
        if (this.existsSync(filePath)) return true;

        this.ensureDirExists(path.dirname(filePath));

        try {
            this.writeFileSync(filePath, '');
        } catch (err) {
            if ('EEXIST' !== err.code) {
                throw err;
            }
        }

        return true;
    };

    ensureDirExists(directoryPath) {
        if (this.existsSync(directoryPath)) return true;

        this.ensureDirExists(path.dirname(directoryPath));

        try {
            this.mkdirSync(directoryPath);
        } catch (err) {
            if ('EEXIST' !== err.code) {
                throw err;
            }
        }

        return true;
    };

    creationDate(directory) {

        if (!this.existsSync(directory)) {
            return false;
        }

        return this.lstatSync(directory).ctime;
    };

    isFileSync(directory) {

        if (!this.existsSync(directory)) {
            return false;
        }

        return this.lstatSync(directory).isFile();
    };

    isDirectorySync(directory) {

        if (!this.existsSync(directory)) {
            return false;
        }

        return this.lstatSync(directory).isDirectory();
    };

    removeSync(directory) {

        if (this.isFileSync(directory)) {
            this.unlinkSync(directory);
            return true;
        }

        if (this.isDirectorySync(directory)) {
            for (let file of this.readdirSync(directory)) {
                this.removeSync(path.join(directory, file));
            }

            this.rmdirSync(directory);
        }

        return true;
    }
}

Object.assign(FS.prototype, require('fs'));

module.exports = FS;
