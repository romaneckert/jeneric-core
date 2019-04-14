#!/usr/bin/env node
const fs = require('../src/util/fs');
const path = require('path');

class Install {

    constructor() {
        // get args
        this.args = process.argv.slice(2);

        // detect path to root
        this.pathToRoot = process.cwd();

        // detect path to node_modules
        this.pathToNodeModules = path.join(this.pathToRoot, 'node_modules');

        // check if node_modules directory exists
        if (!fs.existsSync(this.pathToNodeModules)) throw new Error(`can not find path to node_modules: ${this.pathToNodeModules}`);

        // detect path to @jeneric/app folder
        this.pathToApp = path.join(this.pathToNodeModules, '@jeneric/app');

        // remove app folder @jeneric/app
        fs.removeSync(this.pathToApp);

        // create app folder @jeneric/app
        fs.ensureDirExists(this.pathToApp);

        // loop over all modules and install
        for (let arg of this.args) {

            let pathToModule = path.join(this.pathToRoot, 'node_modules', arg);

            this.install(pathToModule);

        }

        this.install(this.pathToRoot);
    }

    install(pathToModule) {

        if (!fs.lstatSync(pathToModule).isDirectory() && !fs.lstatSync(pathToModule).isSymbolicLink()) throw new Error(`${pathToModule} is not a directory`);

        console.log(`${pathToModule}`);

        for(let pathToDir of ['config', 'src', 'view']) {

            let src = path.join(pathToModule, pathToDir);
            let dest = path.join(this.pathToApp, pathToDir);

            this.symlinkOnlyFilesSync(src, dest);

        }

        console.log('--------------------');
    }

    symlinkOnlyFilesSync(src,dest) {

        // check if source exists
        if (!fs.existsSync(src)) return false;

        let stats = fs.statSync(src);

        if (stats.isDirectory()) {
            try {
                fs.mkdirSync(dest);
            } catch (err) {
                if ('EEXIST' !== err.code) throw err;
            }

            let files = fs.readdirSync(src);

            for (let file of files) {
                if (!this.symlinkOnlyFilesSync(path.join(src, file), path.join(dest, file))) return false;
            }

        } else {
            if(fs.existsSync(dest)) {
                fs.removeSync(dest);
                console.log(`overwrite: ${dest}`);
            }
            fs.symlinkSync(src, dest);
        }

        return true;
    };
}

new Install();












