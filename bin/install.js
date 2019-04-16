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
        this.writeAppFile();
    }

    writeCustomConfig() {

        let pathToConfig = path.join(this.pathToApp, '/config/index.js');
        let fileContent = 'module.exports = ' + JSON.stringify(this.config, null, 4);

        fs.ensureFileExists(pathToConfig);
        fs.appendFileSync(pathToConfig, fileContent);

    }

    writeAppFile() {

        let tab = '    ';

        let fileContent = "const Core = require('./src/module/core.js');\n";
        fileContent += "class App extends Core {\n";
        fileContent += `${tab}init() {\n`;

        for(let ns of ['util', 'model']) {

            let pathToNs = path.join(this.pathToApp, './src/', ns);

            if (!fs.isDirectorySync(pathToNs)) {
                throw new Error(`${pathToNs} does not exists.`);
            }

            fileContent += `${tab}${tab}this.${ns} = {\n`;

            for (let fileName of fs.readdirSync(pathToNs)) {

                if('util' === ns) {
                    fileContent += `${tab}${tab}${tab}${fs.fileNameToClassName(fileName)}: require('./${path.join(`src/${ns}`, fileName)}'),\n`;
                } else {
                    fileContent += `${tab}${tab}${tab}${fs.fileNameToClassName(fileName)}: new (require('./${path.join(`src/${ns}`, fileName)}'))(),\n`;
                }

            }

            fileContent += `${tab}${tab}};\n`;
        }

        fileContent += `${tab}${tab}this.logger = new (require('./src/module/logger.js'))();\n`;

        for(let ns of ['module']) {

            let pathToNs = path.join(this.pathToApp, './src/', ns);

            if (!fs.isDirectorySync(pathToNs)) {
                throw new Error(`${pathToNs} does not exists.`);
            }

            fileContent += `${tab}${tab}this.${ns} = {\n`;

            for (let fileName of fs.readdirSync(pathToNs)) {

                if('module' === ns && ('core.js' === fileName || 'logger.js' === fileName)) continue;

                fileContent += `${tab}${tab}${tab}${fs.fileNameToClassName(fileName)}: new (require('./${path.join(`src/${ns}`, fileName)}'))(),\n`;

            }

            fileContent += `${tab}${tab}};\n`;
        }

        fileContent += `${tab}}\n`;
        fileContent += "}\n";

        fileContent += "module.exports = new App();";

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

        if(!fs.isFileSync(pathToConfig)) {
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












