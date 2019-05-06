const cluster = require('cluster');
const os = require('os');
const config = require('@jeneric/app/config');

class App {

    constructor() {

        const allowedContexts = ['production', 'acceptance', 'staging', 'test', 'development'];

        if (-1 === allowedContexts.indexOf(process.env.NODE_ENV)) {
            throw new Error(`context "${process.env.NODE_ENV}" not allowed -> ${allowedContexts.join(',')}`);
        }

        this.config = config;
        this.config.app.context = process.env.NODE_ENV;

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
        for (let m in this.module) {
            if ('function' === typeof this.module[m].start) {
                await this.module[m].start();
            }
        }

        // handle uncaught exceptions
        process.on('uncaughtException', this.module.error.handleUncaughtException);

        // log information about start process of core
        if (!this.config.app.cluster || (cluster.worker && 1 === cluster.worker.id)) {
            await this.logger.log('application startet in context: "' + this.config.app.context + '"', null, 5, 'app', 'app');
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
        for (let m in this.module) {
            if ('function' === typeof this.module[m].stop) {
                await this.module[m].stop();
            }
        }
    }

}

module.exports = new App();
