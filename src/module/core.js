const cluster = require('cluster');
const os = require('os');
const path = require('path');
const fs = require('@jeneric/app/src/util/fs');

class Core {

    constructor() {
        let config = require('@jeneric/app/config');

        if ('string' === typeof process.env.NODE_ENV) {
            config.app.context = process.env.NODE_ENV;
        } else {
            config.app.context = 'production';
        }

        // check if config.appRoot exists
        if(!fs.isDirectorySync(config.app.path)) {
            throw new Error(`application root ${config.app.path} does not exists`);
        }

        this.config = config;

        this.module = {};
        this.logger = null;
    }

    init() {
        throw new Error('this init() function should be overwritten');
    }

    boot() {

        this.init();

        // init modules
        this._initModule();

        // log information about start process of core
        if (!this.config.app.cluster || (cluster.worker && 1 === cluster.worker.id)) {
            this.logger.log('application startet in context: "' + this.config.app.context + '"', null, 5, 'core', 'core');
        }

        // start modules
        this._startModule();

        // create process for each cpu
        if (cluster.isMaster && true === this.config.app.cluster) {
            for (let i = 0; i < os.cpus().length; i++) cluster.fork();
            return;
        }

        // handle uncaught exceptions
        process.on('uncaughtException', this.module.error.handleUncaughtException);

    }

    _initModule() {

        for(let m in this.module) {
            let module = this.module[m];

            if ('function' === typeof module.init) module.init();

        }

    }

    _startModule() {
        for(let m in this.module) {
            let module = this.module[m];

            if ('function' === typeof module.start) module.start();

        }
    }

}

module.exports = Core;
