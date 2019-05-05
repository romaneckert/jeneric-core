const cluster = require('cluster');
const os = require('os');
const config = require('@jeneric/app/config');

class App {

    constructor() {

        if ('string' === typeof process.env.NODE_ENV) {
            config.app.context = process.env.NODE_ENV;
        } else {
            config.app.context = 'production';
        }

        this.config = config;

        this.module = {};
        this.logger = null;

        // create process for each cpu
        if (cluster.isMaster && true === this.config.app.cluster) {
            for (let i = 0; i < os.cpus().length; i++) cluster.fork();
            return;
        }

        this.nodeLoopTimeCheckTimer = null;

    }

    async start() {

// placeholder for install script

        // init modules
        for(let m in this.module) {
            if ('function' === typeof this.module[m].start) await this.module[m].start();
        }

        // handle uncaught exceptions
        process.on('uncaughtException', this.module.error.handleUncaughtException);

        // log information about start process of core
        if (!this.config.app.cluster || (cluster.worker && 1 === cluster.worker.id)) {
            this.logger.log('application startet in context: "' + this.config.app.context + '"', null, 5, 'core', 'core');
        }

        // register set interval function to monitor blocking
        let interval = 200;
        let start = process.hrtime();
        let threshold = 10;

        this.nodeLoopTimeCheckTimer = setInterval(function () {
            let delta = process.hrtime(start);
            let nanosec = delta[0] * 1e9 + delta[1];
            let ms = nanosec / 1e6;

            if (ms - interval > threshold) {
                this.logger.error('block error');
            }
            start = process.hrtime();
        }, interval);
    }

    async stop() {

        clearInterval(this.nodeLoopTimeCheckTimer);

        // stop modules
        for(let m in this.module) {
            if ('function' === typeof this.module[m].stop) await this.module[m].stop();
        }
    }

}

module.exports = new App();
