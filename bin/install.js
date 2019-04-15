#!/usr/bin/env node
const fs = require('../src/util/fs');
const object = require('../src/util/object');
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

        // add config
        this.config = {};

        // loop over all modules and install
        for (let arg of this.args) {

            let pathToModule = path.join(this.pathToRoot, 'node_modules', arg);

            this.install(pathToModule);

        }

        this.install(this.pathToRoot);

        this.writeCustomConfig();
        this.writeJeneric();
    }

    writeCustomConfig() {

        let pathToConfig = path.join(this.pathToApp, '/config/index.js');
        let fileContent = 'module.exports = ' + JSON.stringify(this.config, null, 4);

        fs.ensureFileExists(pathToConfig);
        fs.appendFileSync(pathToConfig, fileContent);

    }

    writeJeneric() {

        let pathToModules = path.join(this.pathToApp, './src/module');

        if (!fs.isDirectorySync(pathToModules)) throw new Error(`${pathToModules} does not exists.`);

        let fileContent = `const app = new (require('./src/module/core.js'))();\n`;
        fileContent += `app.module = {\n`;

        for (let fileName of fs.readdirSync(pathToModules)) {

            if('core.js' === fileName) continue;

            fileContent += `    ${fs.fileNameToClassName(fileName)}: new (require('./${path.join('src/module', fileName)}'))(),\n`;

        }

        fileContent += `};`;

        fileContent += `module.exports = app`;

        let filePath = path.join(this.pathToApp, 'index.js');

        fs.ensureFileExists(filePath);

        fs.appendFileSync(filePath, fileContent);
    }

    install(pathToModule) {
        console.log(`${pathToModule}`);
        this.checkPath(pathToModule);
        this.symlink(pathToModule);
        this.addConfig(pathToModule);
        console.log('--------------------');
    }

    checkPath(pathToModule) {
        // check if pathToModule is a directory
        let stats = null;

        try {
            stats = fs.lstatSync(pathToModule);
        } catch(err) {
            stats = null;
        }

        if(null === stats || !(stats.isDirectory() || stats.isSymbolicLink())) {
            throw new Error(`${pathToModule} is not a directory`);
        }
    }

    symlink(pathToModule) {

        // symlink all files in src and view
        for(let pathToDir of ['public', 'src', 'view']) {

            let src = path.join(pathToModule, pathToDir);
            let dest = path.join(this.pathToApp, pathToDir);

            this.symlinkOnlyFilesSync(src, dest);

        }

    }

    addConfig(pathToModule) {

        // check path to config
        let pathToConfig = path.join(pathToModule, 'config/index.js');

        // check if pathToModule is a directory
        let stats = null;

        try {
            stats = fs.lstatSync(pathToConfig);
        } catch(err) {
            stats = null;
        }

        if(null === stats || !stats.isFile()) {
            return false;
        }

        let config = require(pathToConfig);

        object.merge(this.config, config);

        return true;
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
    }
}

new Install();












