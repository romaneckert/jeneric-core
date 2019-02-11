class Report {
    start() {

        setInterval(() => {
            this._logMemoryUsage();
        }, 3600);
    }

    _logMemoryUsage() {
        this.logger.debug(`memory: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`);
    }
}

module.exports = Report;
