const cluster = require('cluster');
const os = require('os');
const nodePath = require('path');
const fs = require('@jeneric/app/src/util/fs');

module.exports = class Jeneric {

    constructor() {
        this.config = require('@jeneric/app/config');

        this.config.module.core.startDate = new Date();

        if ('string' === typeof process.env.NODE_ENV) {
            this.config.module.core.context = process.env.NODE_ENV;
        } else {
            this.config.module.core.context = 'production';
        }

        this.config.module.core.rootPath = nodePath.join(process.cwd(), 'node_modules/@jeneric/app');

        // check if config.appRoot exists
        if(!fs.isDirectorySync(this.config.module.core.rootPath)) {
            throw new Error(`application root ${this.config.module.core.rootPath} does not exists`);
        }
    }

    boot() {

        console.log(this._autoload(this.config.module.core.rootPath));
        process.exit();

        // init modules
        this.initModule(nodePath.join(this.config.module.core.rootPath, 'src/module'));

        // log information about start process of core
        if (!this.config.module.core.cluster || (cluster.worker && 1 === cluster.worker.id)) {
            logger.log('application startet in context: "' + this.config.module.core.context + '"', null, 5, 'core', 'core');
        }

        // start modules
        this.startModule(nodePath.join(config.module.core.rootPath, 'src/module'));

        // create process for each cpu
        if (cluster.isMaster && true === config.module.core.cluster) {
            for (let i = 0; i < os.cpus().length; i++) cluster.fork();
            return;
        }

        // handle uncaught exceptions
        process.on('uncaughtException', error.handleUncaughtException);

    }

    initModule(path) {

        for(let file of fs.readdirSync(path)) {

            if(fs.isDirectorySync(file)) {
                this.initModule(file);
            } else {
                let module = require(nodePath.join(path, file));

                if ('function' === typeof module.init) module.init();
            }
        }

    }

    startModule(path) {
        for(let file of fs.readdirSync(path)) {
            if(fs.isDirectorySync(file)) {
                this.startModule(file);
            } else {
                let module = require(nodePath.join(path, file));

                if ('function' === typeof module.start) module.start();
            }
        }
    }

    _autoload(directory) {
        let obj = {};

        if (fs.isDirectorySync(directory)) {

            for (let dirName of fs.readdirSync(directory)) {
                let result = this._autoload(nodePath.join(directory, dirName));

                if ('function' === typeof result) {
                    let key = dirName.split('.')[0];
                    let parts = key.split('-');

                    for (let p in parts) {
                        if (0 == p) {
                            continue;
                        }
                        parts[p] = parts[p].charAt(0).toUpperCase() + parts[p].slice(1)
                    }

                    obj[parts.join('')] = result;
                } else if ('object' === typeof result && null !== result) {
                    obj[dirName] = result;
                }
            }

        } else if (fs.isFileSync(directory)) {

            if ('.js' === nodePath.extname(directory)) return require(directory);

            return null;
        }

        return obj;
    }

    _instantiate(classes, config, instance) {

        if ('object' !== typeof instance) instance = {};

        for (let namespace in classes) {

            if ('object' === typeof classes[namespace] && 'object' === typeof config[namespace]) {
                instance[namespace] = this._instantiate(classes[namespace], config[namespace]);
            } else if ('function' === typeof classes[namespace] && 'object' === typeof config[namespace]) {
                instance[namespace] = new classes[namespace](config[namespace]);
            } else if ('object' === typeof classes[namespace]) {
                instance[namespace] = this._instantiate(classes[namespace], {});
            } else if ('function' === typeof classes[namespace]) {
                instance[namespace] = new classes[namespace]();
            }

        }

        return instance;
    }

};
