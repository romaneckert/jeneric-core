const core = require('./app/core');
const cluster = require('cluster');
const os = require('os');

module.exports = {
    core: core,
    init: (config) => {

        core.init(config);

        return;

        if (cluster.isMaster) {
            // Count the machine's CPUs
            var cpuCount = os.cpus().length;

            // Create a worker for each CPU
            for (var i = 0; i < cpuCount; i++) {
                cluster.fork();
            }

        } else {
            core.init(config);
        }

    }
};