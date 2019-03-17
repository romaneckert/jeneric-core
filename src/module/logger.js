const path = require('path');
const stackTrace = require('stack-trace');

class Logger {
    constructor(config) {

        this.config = {
            directory: 'var/logs',
            maxSizePerLogFile: 16 * 1024 * 1024, // in byte - default 16 mb
            maxLogRotationsPerType: 10,
            maxHistoryLength: 1000,
            duplicateTime: 10000,
            levels: {
                0: {
                    name: 'emergency',
                    console: true,
                    color: "\x1b[31m"
                },
                1: {
                    name: 'alert',
                    console: true,
                    color: "\x1b[31m"
                },
                2: {
                    name: 'critical',
                    console: true,
                    color: "\x1b[31m"
                },
                3: {
                    name: 'error',
                    console: true,
                    color: "\x1b[31m"
                },
                4: {
                    name: 'warning',
                    console: true,
                    color: "\x1b[33m"
                },
                5: {
                    name: 'notice',
                    console: true,
                    color: "\x1b[34m"
                },
                6: {
                    name: 'info',
                    console: true,
                    color: "\x1b[34m"
                },
                7: {
                    name: 'debug',
                    console: true,
                    color: "\x1b[37m"
                },
                8: {
                    name: 'observe',
                    console: false,
                    color: "\x1b[37m"
                }
            }
        };

        // merge config
        jeneric.util.object.merge(this.config, config);

        this._logsToSaveQueue = [];
        this._history = [];
    }

    emergency(message, meta) {
        this.log(message, meta, 0);
    }

    alert(message, meta) {
        this.log(message, meta, 1);
    }

    critical(message, meta) {
        this.log(message, meta, 2);
    }

    error(message, meta) {
        this.log(message, meta, 3);
    }

    warning(message, meta) {
        this.log(message, meta, 4);
    }

    notice(message, meta) {
        this.log(message, meta, 5);
    }

    info(message, meta) {
        this.log(message, meta, 6);
    }

    debug(message, meta) {
        this.log(message, meta, 7);
    }

    log(message, meta, code) {

        // create stack
        let stack = stackTrace.parse(new Error());

        // remove logger entries from stack
        stack = stack.filter(entry => entry.typeName !== 'Logger');

        let fileNameParts = stack[0].fileName.split('/').reverse();

        let type = null;
        let name = null;

        if ('src' === fileNameParts[2]) {
            type = fileNameParts[1].toLowerCase();
            name = fileNameParts[0].replace('.js', '').toLowerCase();
        }

        if (null === type && 'string' === typeof stack[0].typeName) {
            name = stack[0].typeName.toLowerCase();
        }

        if ('number' !== typeof code) code = 0;
        if ('string' !== typeof message) message = 'undefined';
        if ('string' !== typeof type) type = 'undefined';
        if ('string' !== typeof name) name = 'undefined';

        // create date for current log entry
        let date = new Date();

        // cast to string
        message = jeneric.util.string.cast(message).trim();

        // remove line breaks from message
        message = message.replace(/(\r?\n|\r)/gm, ' ');

        // cast meta data like objects to string
        meta = jeneric.util.string.cast(meta);

        stack = this._stackToString(stack);

        // create log entity
        let log = new jeneric.model.log({
            code: code,
            date: date,
            message: message,
            meta: meta,
            type: type,
            name: name,
            stack: stack
        });

        // check if log is duplicated
        if (this._isDublicated(log)) {
            return;
        }

        // add log entry to history
        this._addToHistory(log);

        // write log to log files
        this._writeToLogFiles(log);

        // write log to console
        this._writeToConsole(log);

        // save log to db
        this._saveInDB(log);
    }

    _isDublicated(log) {

        let k = 0;

        for (let oldLog of this._history) {

            if (
                oldLog.code === log.code
                && oldLog.message === log.message
                && oldLog.meta === log.meta
                && oldLog.type === log.type
                && log.date - oldLog.date < this.config.duplicateTime
            ) {
                return true;
            }
        }

        return false;
    }

    _writeToLogFiles(log) {

        // write log entry in specific log file by type and by class type/name
        let logFiles = [
            this._getPathToLogFile(log.code, []),
            this._getPathToLogFile(log.code, [log.type, log.name])
        ];

        let output = '[' + this._dateStringFromDate(log.date) + '] ';
        output += '[' + this.config.levels[log.code].name + '] ';
        output += '[' + log.type + '/' + log.name + '] ';
        output += '[' + log.message + ']';
        if (log.meta.length > 0) output += ' [' + log.meta + ']';
        output += ' [' + log.stack + ']';

        for (let logFile of logFiles) {

            // check if log file exists and create if not
            jeneric.util.fs.ensureFileExists(logFile);

            // check if log rotation is necessary
            this._rotateLogFile(logFile);

            // write line to log file
            jeneric.util.fs.appendFileSync(logFile, output.replace(/\r?\n?/g, '').trim() + '\n');

        }

    }

    _rotateLogFile(pathToLogFile) {

        let fileSize = jeneric.util.fs.statSync(pathToLogFile).size;

        if (fileSize < this.config.maxSizePerLogFile) return false;

        for (let i = this.config.maxLogRotationsPerType - 1; i >= 0; i--) {

            let pathToArchivedLogFile = pathToLogFile + '.' + i;

            // check if archived file exists
            if (!jeneric.util.fs.existsSync(pathToArchivedLogFile)) continue;

            // unlink last log file
            if (this.config.maxLogRotationsPerType - 1 === i) {
                jeneric.util.fs.unlinkSync(pathToArchivedLogFile);
                continue;
            }

            jeneric.util.fs.renameSync(pathToArchivedLogFile, pathToLogFile + '.' + (i + 1));
        }

        jeneric.util.fs.renameSync(pathToLogFile, pathToLogFile + '.' + 0);
        jeneric.util.fs.ensureFileExists(pathToLogFile);
    }

    _getPathToLogFile(code, namespaces) {

        return path.join(
            path.dirname(process.mainModule.filename),
            this.config.directory,
            namespaces.join('/'),
            this.config.levels[code].name + '.log'
        );
    }

    // write log entry to console
    _writeToConsole(log) {

        // disabled, if config console disabled
        if (!this.config.levels[log.code].console) return;

        // disabled, if log level less then notice and in mode production
        if (log.code > 5 && jeneric.config.context === 'production') return;

        let consoleOutput = '';

        consoleOutput += `[${this.config.levels[log.code].name}] `;
        consoleOutput += log.message + ' ';
        consoleOutput += '[' + log.type + '/' + log.name + '] ';

        if (log.meta.length > 0) consoleOutput += '[' + log.meta + '] ';

        consoleOutput += `[pid:${process.pid}] `;

        if (log.code < 4 && jeneric.config.context !== 'production') {
            consoleOutput += '[' + log.stack + ']';
        }

        console.log(this.config.levels[log.code].color, consoleOutput.replace(/\r?\n?/g, '').trim(), "\x1b[0m");

    }

    _addToHistory(log) {

        // remove older entries if log history greater then max histroy length
        while (this._history.length > this.config.maxHistoryLength) this._history.pop();

        // add current log to history
        this._history.push(log);

        // sort log history by date desc
        this._history.sort((a, b) => (a.date < b.date));
    }

    _saveInDB(log) {

        // remove older entries if log to save queue greater then 200
        if (this._logsToSaveQueue.length > 200) this._logsToSaveQueue.shift();

        this._logsToSaveQueue.push(log);

        if (jeneric.module.mongoose && 1 === jeneric.module.mongoose.instance.connection.readyState) {

            jeneric.model.log.insertMany(this._logsToSaveQueue, function (err) {
                if (err) {
                    console.error(err);
                }
            });

            this._logsToSaveQueue = [];
        }

    }

    _stackToString(stack) {
        let outputs = [];

        for (let entry of stack) {

            let processParentDir = path.dirname(process.cwd());

            if (entry.fileName.includes(processParentDir)) {

                let scriptPath = entry.fileName.replace(processParentDir, '');

                outputs.push(scriptPath + ':' + entry.lineNumber + ':' + entry.columnNumber);
            }

        }

        return outputs.join(' <- ');
    }

    _dateStringFromDate(date) {

        return date.getFullYear() +
            '-' +
            ('0' + (date.getMonth() + 1)).slice(-2) +
            '-' +
            ('0' + date.getDate()).slice(-2) +
            ' ' +
            date.toTimeString().slice(0, 8);
    }

    get history() {
        return this._history;
    }
}

module.exports = Logger;
