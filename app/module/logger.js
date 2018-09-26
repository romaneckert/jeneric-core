const path = require('path');
const AbstractModule = require('../abstract-module');
const Log = require('../model/log');

class Logger extends AbstractModule {
    constructor(config) {

        super();

        this._config = {
            directory: 'var/logs',
            maxSizePerLogFile: 16 * 1024 * 1024, // in byte - default 16 mb
            maxLogRotationsPerType: 10,
            maxHistoryLength: 1000,
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
        this.util.object.merge(this._config, config);

        this._logsToSaveQueue = [];
        this._history = [];
    }
    log(message, meta, moduleDefinition, stack, code) {

        // create date for current log entry
        let date = new Date();

        // detect module definition
        let module = ('object' === typeof moduleDefinition) ? moduleDefinition.toString().toLowerCase() : '';

        // cast to string
        message = this.util.string.cast(message).trim();

        // remove line breaks from message
        message = message.replace(/(\r?\n|\r)/gm, ' ');

        // cast meta data like objects to string
        meta = this.util.string.cast(meta);

        // create call stack if not defined
        if ('object' !== typeof stack) {
            stack = this.util.error.stack(new Error());
            stack.shift();
            stack.shift();
        }
        stack = this._stackToString(stack);

        // create log entity
        let log = new Log(code, date, message, meta, module, stack);

        // write log to log files
        this._writeToLogFiles(log);

        // write log to console
        this._writeToConsole(log);

        // add log entry to history
        this._addToHistory(log);

        // call log handler (can be used by application)
        // this.handler.logger.log.handle(log); TODO: check what this is

        // save log to db
        this._saveInDB(log);
    }

    // TODO: add write log by module
    _writeToLogFiles(log) {

        // write log entry in specific log file
        let pathToLogFile = this._getPathToLogFile(log.code, 'type');

        // check if log file exists and create if not
        this.fs.ensureFileExists(pathToLogFile);

        // check if log rotation is necessary
        this._rotateLogFile(pathToLogFile);

        let output = '[' + this._dateStringFromDate(log.date) + '] ';
        output += '[' + this._config.levels[log.code].name + '] ';
        output += '[' + log.module + '] ';
        output += '[' + log.message + ']';
        if (log.meta.length > 0) output += ' [' + log.meta + ']';
        output += ' [' + log.stack + ']';

        // write line to log file
        this.fs.appendFileSync(pathToLogFile, output + '\n');
    }

    _rotateLogFile(pathToLogFile) {

        let fileSize = this.fs.statSync(pathToLogFile).size;

        if (fileSize < this._config.maxSizePerLogFile) return false;

        for (let i = this._config.maxLogRotationsPerType - 1; i >= 0; i--) {

            let pathToArchivedLogFile = pathToLogFile + '.' + i;

            // check if archived file exists
            if (!this.fs.existsSync(pathToArchivedLogFile)) continue;

            // unlink last log file
            if (this._config.maxLogRotationsPerType - 1 === i) {
                this.fs.unlinkSync(pathToArchivedLogFile);
                continue;
            }

            this.fs.renameSync(pathToArchivedLogFile, pathToLogFile + '.' + (i + 1));
        }

        this.fs.renameSync(pathToLogFile, pathToLogFile + '.' + 0);
        this.fs.ensureFileExists(pathToLogFile);
    }

    _getPathToLogFile(code, namespace) {
        return path.join(
            path.dirname(require.main.filename),
            '../',
            this._config.directory,
            namespace,
            this._config.levels[code].name + '.log'
        );
    }

    _writeToConsole(log) {

        // write log entry to console
        if (this._config.levels[log.code].console) {

            let consoleOutput = log.message + ' ';
            consoleOutput += '[' + log.module + '] ';
            if (log.meta.length > 0) consoleOutput += '[' + log.meta + '] ';
            //consoleOutput += '[' + log.stack + ']';

            console.log(this._config.levels[log.code].color, consoleOutput, "\x1b[0m");
        }

    }

    _addToHistory(log) {
        // remove older entries if log history greater then 200
        if (this._history.length > this._config.maxHistoryLength) this._history.shift();

        // add current log to history
        this._history.push(log);
    }

    _saveInDB(log) {

        // remove older entries if log to save queue greater then 200
        if (this._logsToSaveQueue.length > 200) this._logsToSaveQueue.shift();

        this._logsToSaveQueue.push(log);

        if (this.module.db.ready) {

            for (let logToSave of this._logsToSaveQueue) {
                this.module.db.add(logToSave);
            }

            this._logsToSaveQueue = [];
        }

    }

    _stackToString(stack) {
        let outputs = [];

        for (let entry of stack) {

            let processParentDir = path.dirname(process.cwd());

            if (entry.path.includes(processParentDir)) {

                let scriptPath = entry.path.replace(processParentDir, '');

                outputs.push(entry.method + ' ' + scriptPath + ':' + entry.row);
            }
        }

        return outputs.join(' <- ');
    }

    _dateStringFromDate(date) {

        return date.getFullYear()
            + '-'
            + ('0' + (date.getMonth() + 1)).slice(-2)
            + '-'
            + ('0' + date.getDate()).slice(-2)
            + ' '
            + date.toTimeString().slice(0, 8);
    }

    get ready() {
        return true;
    }

    get history() {
        return this._history;
    }
}

module.exports = Logger;