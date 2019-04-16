const cluster = require('cluster');
const os = require('os');
const path = require('path');
const fs = require('@jeneric/app/src/util/fs');

module.exports = class Core {

    constructor() {
        this.config = require('@jeneric/app/config');

        this.config.module.core.startDate = new Date();

        if ('string' === typeof process.env.NODE_ENV) {
            this.config.module.core.context = process.env.NODE_ENV;
        } else {
            this.config.module.core.context = 'production';
        }

        this.config.module.core.rootPath = path.join(process.cwd(), 'node_modules/@jeneric/app');

        // check if config.appRoot exists
        if(!fs.isDirectorySync(this.config.module.core.rootPath)) {
            throw new Error(`application root ${this.config.module.core.rootPath} does not exists`);
        }

        this.module = {};
        this.logger = null;
    }

    init() {
        throw new Error('this init() function should be overwritten');
    }

    boot() {

        this.init();

        // init modules
        this._initModule(path.join(this.config.module.core.rootPath, 'src/module'));

        // log information about start process of core
        if (!this.config.module.core.cluster || (cluster.worker && 1 === cluster.worker.id)) {
            this.logger.log('application startet in context: "' + this.config.module.core.context + '"', null, 5, 'core', 'core');
        }

        // start modules
        this._startModule(path.join(this.config.module.core.rootPath, 'src/module'));

        // create process for each cpu
        if (cluster.isMaster && true === this.config.module.core.cluster) {
            for (let i = 0; i < os.cpus().length; i++) cluster.fork();
            return;
        }

        // handle uncaught exceptions
        process.on('uncaughtException', this.module.error.handleUncaughtException);

    }

    _initModule(pathToModule) {

        for(let file of fs.readdirSync(pathToModule)) {

            if(fs.isDirectorySync(file)) {
                this._initModule(file);
            } else {
                let module = require(path.join(pathToModule, file));

                if ('function' === typeof module.init) module.init();
            }
        }

    }

    _startModule(pathToModule) {
        for(let file of fs.readdirSync(pathToModule)) {
            if(fs.isDirectorySync(file)) {
                this._startModule(file);
            } else {
                let module = require(path.join(pathToModule, file));

                if ('function' === typeof module.start) module.start();
            }
        }
    }

};
