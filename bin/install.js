#!/usr/bin/env node
const fs = require('../src/util/fs');
const path = require('path');

class Install {

    constructor() {
        // get args
        this.args = process.argv.slice(2);

        if(-1 === this.args.indexOf('./')) {
            this.args.push('./')
        }

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

        for (let arg of this.args) {
            if (!fs.lstatSync(arg).isDirectory()) throw new Error(`${arg} is not a directory`);

            for(let pathToDir of ['src', 'view']) {

                let src = path.join(this.pathToRoot, arg, pathToDir);
                let dest = path.join(this.pathToApp, pathToDir);

                fs.symlinkOnlyFilesSync(src, dest);

            }

        }
    }
}

new Install();












