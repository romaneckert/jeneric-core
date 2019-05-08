#!/usr/bin/env node

const fs = require('../src/util/fs');
const string = require('../src/util/string');
const object = require('../src/util/object');

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
});

class Install {

    constructor() {
        this.install();
    }

    async install() {

        // load context specific config
        const pathToContextConfig = fs.path.join('config', 'config.' + process.env.NODE_ENV + '.js');

        if (!await fs.isFile(pathToContextConfig)) {
            throw new Error(`${pathToContextConfig} does not exists`);
        }

        // get args
        this.args = process.argv.slice(2);

        // detect path to root
        this.pathToRoot = process.cwd();

        // detect path to node_modules
        this.pathToNodeModules = fs.path.join(this.pathToRoot, 'node_modules');

        // check if node_modules writable
        if (!await fs.isWritable(this.pathToNodeModules)) {
            throw new Error(`${this.pathToNodeModules} is not writable`);
        }

        // detect path to @jeneric/app folder
        this.pathToApp = fs.path.join(this.pathToNodeModules, '@jeneric/app');

        // remove app folder node_modules/@jeneric/app
        await fs.remove(this.pathToApp);

        // create app folder @jeneric/app
        await fs.ensureDirExists(this.pathToApp);

        // add config
        this.config = {};

        // add locale
        this.locale = {};

        this.modulePaths = [];

        // loop over all modules and install
        for (let arg of this.args) {
            this.modulePaths.push(fs.path.join(this.pathToRoot, 'node_modules', arg));
        }

        this.modulePaths.push(this.pathToRoot);

        for (let modulePath of this.modulePaths) {

            // check if module path exists
            if (!await fs.isDirectory(modulePath)) {
                throw new Error(`${modulePath} is not a directory`);
            }

            // symlink all files in src and view
            for (let pathToDir of ['public', 'src', 'view']) {

                let src = fs.path.join(modulePath, pathToDir);
                let dest = fs.path.join(this.pathToApp, pathToDir);

                await this.copyOnlyFilesSync(src, dest);

            }

            // merge config files
            let pathToConfig = fs.path.join(modulePath, 'config/config.js');

            if (await fs.isFile(pathToConfig)) {
                object.merge(this.config, require(pathToConfig));
            }

            let pathToContextSpecificConfig = fs.path.join(modulePath, 'config/config.' + process.env.NODE_ENV + '.js');

            if (await fs.isFile(pathToContextSpecificConfig)) {
                object.merge(this.config, require(pathToContextSpecificConfig));
            }

            // merge locales
            await this.addLocale(fs.path.join(modulePath, 'locale'), this.locale);
        }

        await this.writeCustomConfig();
        await this.writeCustomLocale();
        await this.writeAppFile();
    }

    async writeCustomConfig() {

        this.config.app.buildTime = Date.now();

        this.config.app.path = this.pathToApp;

        let pathToConfig = fs.path.join(this.pathToApp, '/config/index.js');
        let fileContent = 'module.exports = ' + JSON.stringify(this.config, null, 4);

        await fs.ensureFileExists(pathToConfig);
        await fs.appendFile(pathToConfig, fileContent);

    }

    async writeCustomLocale() {
        let pathToLocale = fs.path.join(this.pathToApp, '/locale/index.js');
        let fileContent = 'module.exports = ' + JSON.stringify(this.locale, null, 4);
        await fs.ensureFileExists(pathToLocale);
        await fs.appendFile(pathToLocale, fileContent);
    }

    async writeAppFile() {

        let pathToAppModule = fs.path.join(this.pathToApp, './src/module/app.js');

        let appFileContent = await fs.readFile(pathToAppModule, 'utf8');

        let tab = '    ';

        let fileContent = '';

        for (let ns of ['util', 'model']) {

            let pathToNs = fs.path.join(this.pathToApp, './src/', ns);

            if (!await fs.isDirectory(pathToNs)) {
                throw new Error(`${pathToNs} does not exists.`);
            }

            fileContent += `${tab}${tab}this.${ns} = {\n`;

            for (let fileName of await fs.readdir(pathToNs)) {

                if ('util' === ns) {
                    fileContent += `${tab}${tab}${tab}${string.camelize(fileName)}: require('./${fs.path.join(`src/${ns}`, fileName)}'),\n`;
                } else {
                    fileContent += `${tab}${tab}${tab}${string.camelize(fileName)}: new (require('./${fs.path.join(`src/${ns}`, fileName)}'))(),\n`;
                }

            }

            fileContent += `${tab}${tab}};\n`;
        }

        fileContent += `${tab}${tab}this.logger = new (require('./src/module/logger.js'))();\n`;

        for (let ns of ['module']) {

            let pathToNs = fs.path.join(this.pathToApp, './src/', ns);

            if (!await fs.isDirectory(pathToNs)) {
                throw new Error(`${pathToNs} does not exists.`);
            }

            fileContent += `${tab}${tab}this.${ns} = {\n`;

            for (let fileName of await fs.readdir(pathToNs)) {

                if ('module' === ns && ('app.js' === fileName || 'logger.js' === fileName)) continue;

                fileContent += `${tab}${tab}${tab}${string.camelize(fileName)}: new (require('./${fs.path.join(`src/${ns}`, fileName)}'))(),\n`;

            }

            fileContent += `${tab}${tab}};\n`;
        }

        appFileContent = appFileContent.replace('// placeholder for install script', fileContent);

        let filePath = fs.path.join(this.pathToApp, 'index.js');

        await fs.ensureFileExists(filePath);
        await fs.appendFile(filePath, appFileContent);

        await fs.remove(fs.path.join(this.pathToApp, 'src/module/app.js'));
    }

    async addLocale(pathToLocale, locale) {

        for (let fileName of await fs.readdir(pathToLocale)) {

            let filePath = fs.path.join(pathToLocale, fileName);

            if (await fs.isDirectory(filePath)) {

                if ('object' !== typeof locale[fileName]) locale[fileName] = {};

                await this.addLocale(filePath, locale[fileName]);

            } else if (await fs.isFile(filePath)) {

                let fileDetails = fs.path.parse(fileName);

                if ('.txt' !== fileDetails.ext) continue;

                let content = await fs.readFile(filePath, 'utf8');

                locale[fileDetails.name] = content.trim();

            }
        }

    }

    async copyOnlyFilesSync(src, dest) {

        // check if source exists
        if (!await fs.isWritable(src)) return false;

        if (await fs.isDirectory(src)) {

            try {
                await fs.mkdir(dest);
            } catch (err) {
                if ('EEXIST' !== err.code) throw err;
            }

            for (let file of await fs.readdir(src)) {
                await this.copyOnlyFilesSync(fs.path.join(src, file), fs.path.join(dest, file));
            }
        } else {

            if (await fs.isWritable(dest)) {
                await fs.remove(dest);
                console.log(`overwrite: ${dest}`);
            }

            await fs.copyFile(src, dest);

        }

        return true;
    }
}

module.exports = new Install();












