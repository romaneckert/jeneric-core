class Report {

    constructor() {
        this._requests = [];
    }

    init() {

        setInterval(this._log.bind(this), 3600);
    }

    _log() {
        this.logger.debug(`memory: ${this.getMemoryUsageInMB()} MB | requests per minute: ${this.getRequestsPerMinute()}`);
    }

    getMemoryUsageInMB() {
        return Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    }

    getRequestsPerMinute() {

        let max = Math.ceil(Date.now() - this.container.env.startDate.getTime());

        if (max > 1000 * 60 * 60 * 24) max = 1000 * 60 * 60 * 24;

        // remove requests which are older then 24 hours
        this._requests = this._requests.filter((request) => {
            return request.getTime() > Date.now() - max;
        });

        return Math.round((this._requests.length / max) * 1000 * 60);
    }

    addRequest(url) {
        this._requests.push(new Date());
    }
}

module.exports = Report;
