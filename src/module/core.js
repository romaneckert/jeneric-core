const cluster = require('cluster');
const os = require('os');
const nodePath = require('path');
const util = require('@jeneric/app/src/util');
const config = require('@jeneric/app/config');
const logger = require('@jeneric/app/src/module/logger');
const error = require('@jeneric/app/src/module/error');

class Jeneric {

    boot() {

        // add additional information to config
        config.module.core.startDate = new Date();
        config.module.core.context = 'production';
        config.module.core.rootPath = nodePath.join(process.cwd(), 'node_modules/@jeneric/app');

        // check if config.appRoot exists
        if(!util.fs.isDirectorySync(config.module.core.rootPath)) {
            throw new Error(`application root ${config.module.core.rootPath} does not exists`);
        }

        // set context
        if ('string' === typeof process.env.NODE_ENV) {
            config.module.core.context = process.env.NODE_ENV;
        }

        // init modules
        this.initModule(nodePath.join(config.module.core.rootPath, 'src/module'));

        // log information about start process of core
        if (!config.module.core.cluster || (cluster.worker && 1 === cluster.worker.id)) {
            logger.log('application startet in context: "' + config.module.core.context + '"', null, 5, 'core', 'core');
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

        for(let file of util.fs.readdirSync(path)) {

            if(util.fs.isDirectorySync(file)) {
                this.initModule(file);
            } else {
                let module = require(nodePath.join(path, file));

                if ('function' === typeof module.init) module.init();
            }
        }

    }

    startModule(path) {
        for(let file of util.fs.readdirSync(path)) {
            if(util.fs.isDirectorySync(file)) {
                this.startModule(file);
            } else {
                let module = require(nodePath.join(path, file));

                if ('function' === typeof module.start) module.start();
            }
        }
    }

}

module.exports = new Jeneric();
