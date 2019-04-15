const path = require('path');
const stackTrace = require('stack-trace');
const util = require('@jeneric/app/src/util');
const config = require('@jeneric/app/config');
const Log = require('@jeneric/app/src/model/log');

class Logger {
    constructor() {
        this._logsToSaveQueue = [];
        this._history = [];
        this._mongoose = require('@jeneric/app/src/module/mongoose');
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

    log(message, meta, code, type, name) {

        // create stack
        let stack = stackTrace.parse(new Error());

        // remove logger entries from stack
        stack = stack.filter(entry => entry.typeName !== 'Logger');

        let parts = stack[0].fileName.split('/src/');

        if ('string' === typeof parts[1] && 0 < parts[1].length) {
            parts = parts[1].split('/');

            if ('string' === typeof parts[0] && 0 < parts[0].length && 'string' !== typeof type) type = parts[0].toLowerCase();

            if (parts.length > 1 && 'string' === typeof parts[parts.length - 1] && 0 < parts[parts.length - 1].length && 'string' !== typeof name) {

                parts.shift();

                name = parts.join('/').replace('.js', '').toLowerCase();
            }

        }

        if ('number' !== typeof code) code = 0;
        if ('string' !== typeof message) message = 'undefined';
        if ('string' !== typeof type) type = 'undefined';
        if ('string' !== typeof name) name = 'undefined';

        // create date for current log entry
        let date = new Date();

        // cast to string
        message = util.string.cast(message).trim();

        // remove line breaks from message
        message = message.replace(/(\r?\n|\r)/gm, ' ');

        // cast meta data like objects to string
        meta = util.string.cast(meta);

        stack = this._stackToString(stack);

        // create log entity
        let log = new Log({
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

        for (let oldLog of this._history) {

            if (
                oldLog.code === log.code
                && oldLog.message === log.message
                && oldLog.meta === log.meta
                && oldLog.type === log.type
                && log.date - oldLog.date < config.module.logger.duplicateTime
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
        output += '[' + config.module.logger.levels[log.code].name + '] ';
        output += '[' + log.type + '/' + log.name + '] ';
        output += '[' + log.message + ']';
        if (log.meta.length > 0) output += ' [' + log.meta + ']';
        output += ' [' + log.stack + ']';

        for (let logFile of logFiles) {

            // check if log file exists and create if not
            util.fs.ensureFileExists(logFile);

            // check if log rotation is necessary
            this._rotateLogFile(logFile);

            // write line to log file
            util.fs.appendFileSync(logFile, output.replace(/\r?\n?/g, '').trim() + '\n');

        }

    }

    _rotateLogFile(pathToLogFile) {

        let fileSize = util.fs.statSync(pathToLogFile).size;

        if (fileSize < config.module.logger.maxSizePerLogFile) return false;

        for (let i = config.module.logger.maxLogRotationsPerType - 1; i >= 0; i--) {

            let pathToArchivedLogFile = pathToLogFile + '.' + i;

            // check if archived file exists
            if (!util.fs.existsSync(pathToArchivedLogFile)) continue;

            // unlink last log file
            if (config.module.logger.maxLogRotationsPerType - 1 === i) {
                util.fs.unlinkSync(pathToArchivedLogFile);
                continue;
            }

            util.fs.renameSync(pathToArchivedLogFile, pathToLogFile + '.' + (i + 1));
        }

        util.fs.renameSync(pathToLogFile, pathToLogFile + '.' + 0);
        util.fs.ensureFileExists(pathToLogFile);
    }

    _getPathToLogFile(code, namespaces) {

        return path.join(
            path.dirname(process.mainModule.filename),
            config.module.logger.directory,
            namespaces.join('/'),
            config.module.logger.levels[code].name + '.log'
        );
    }

    // write log entry to console
    _writeToConsole(log) {

        // disabled, if config console disabled
        if (!config.module.logger.levels[log.code].console) return;

        // disabled, if log level less then notice and in mode production
        if (log.code > 5 && config.module.core.context === 'production') return;

        let consoleOutput = '';

        consoleOutput += `[${config.module.logger.levels[log.code].name}] `;
        consoleOutput += log.message + ' ';
        consoleOutput += '[' + log.type + '/' + log.name + '] ';

        if (log.meta.length > 0) consoleOutput += '[' + log.meta + '] ';

        consoleOutput += `[pid:${process.pid}] `;

        if (log.code < 4 && jeneric.config.context !== 'production') {
            consoleOutput += '[' + log.stack + ']';
        }

        console.log(config.module.logger.levels[log.code].color, consoleOutput.replace(/\r?\n?/g, '').trim(), "\x1b[0m");

    }

    _addToHistory(log) {

        // remove older entries if log history greater then max history length
        while (this._history.length > config.module.logger.maxHistoryLength) this._history.pop();

        // add current log to history
        this._history.push(log);

        // sort log history by date desc
        this._history.sort((a, b) => (a.date < b.date));
    }

    _saveInDB(log) {

        // remove older entries if log to save queue greater then 200
        if (this._logsToSaveQueue.length > 200) this._logsToSaveQueue.shift();

        this._logsToSaveQueue.push(log);

        if (mongoose && 1 === mongoose.instance.connection.readyState) {

            log.insertMany(this._logsToSaveQueue, function (err) {
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

module.exports = new Logger();
