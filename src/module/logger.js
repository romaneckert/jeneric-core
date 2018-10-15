const path = require('path');
const Module = require('../../module');
const errorUtil = require('../../util/error');
const objectUtil = require('../../util/object');
const stringUtil = require('../../util/string');
const fs = require('../../util/fs');

class Logger extends Module {
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
        objectUtil.merge(this._config, config);

        this._logsToSaveQueue = [];
        this._history = [];
    }

    log(message, meta, classDefinition, stack, code) {

        if ('number' !== typeof code) {
            code = 0;
        }

        if ('string' !== typeof message) {
            message = 'undefined';
        }

        // detect class definition
        let classType = 'undefined';
        let className = 'undefined';

        if (('object' === typeof classDefinition)) {
            classType = classDefinition.type;
            className = classDefinition.name
        }

        // create date for current log entry
        let date = new Date();

        // cast to string
        message = stringUtil.cast(message).trim();

        // remove line breaks from message
        message = message.replace(/(\r?\n|\r)/gm, ' ');

        // cast meta data like objects to string
        meta = stringUtil.cast(meta);

        // create call stack if not defined
        if ('object' !== typeof stack) {
            stack = errorUtil.stack(new Error());
            stack.shift();
            stack.shift();
        }
        stack = this._stackToString(stack);

        // create log entity
        let log = new this.model.log({
            code: code,
            date: date,
            message: message,
            meta: meta,
            classType: classType,
            className: className,
            stack: stack
        });

        // write log to log files
        this._writeToLogFiles(log);

        // write log to console
        this._writeToConsole(log);

        // add log entry to history
        this._addToHistory(log);

        // save log to db
        this._saveInDB(log);
    }

    _writeToLogFiles(log) {

        // write log entry in specific log file by type and by class type/name
        let logFiles = [
            this._getPathToLogFile(log.code, []),
        ];

        if (null !== log.classType && null !== log.className) {
            logFiles.push(
                this._getPathToLogFile(log.code, [log.classType, log.className])
            );
        }

        for (let logFile of logFiles) {
            // check if log file exists and create if not
            fs.ensureFileExists(logFile);

            // check if log rotation is necessary
            this._rotateLogFile(logFile);

            let output = '[' + this._dateStringFromDate(log.date) + '] ';
            output += '[' + this._config.levels[log.code].name + '] ';
            output += '[' + log.classType + '/' + log.className + '] ';
            output += '[' + log.message + ']';
            if (log.meta.length > 0) output += ' [' + log.meta + ']';
            output += ' [' + log.stack + ']';

            // write line to log file
            fs.appendFileSync(logFile, output + '\n');
        }

    }

    _rotateLogFile(pathToLogFile) {

        let fileSize = fs.statSync(pathToLogFile).size;

        if (fileSize < this._config.maxSizePerLogFile) return false;

        for (let i = this._config.maxLogRotationsPerType - 1; i >= 0; i--) {

            let pathToArchivedLogFile = pathToLogFile + '.' + i;

            // check if archived file exists
            if (!fs.existsSync(pathToArchivedLogFile)) continue;

            // unlink last log file
            if (this._config.maxLogRotationsPerType - 1 === i) {
                fs.unlinkSync(pathToArchivedLogFile);
                continue;
            }

            fs.renameSync(pathToArchivedLogFile, pathToLogFile + '.' + (i + 1));
        }

        fs.renameSync(pathToLogFile, pathToLogFile + '.' + 0);
        fs.ensureFileExists(pathToLogFile);
    }

    _getPathToLogFile(code, namespaces) {

        return path.join(
            path.dirname(process.mainModule.filename),
            this._config.directory,
            namespaces.join('/'),
            this._config.levels[code].name + '.log'
        );
    }

    // write log entry to console
    _writeToConsole(log) {

        // disabled, if config console disabled
        if (!this._config.levels[log.code].console) {
            return;
        }

        // disabled, if log level less then notice and in mode production
        if (log.code > 5 && this.env === 'production') {
            return;
        }

        let consoleOutput = '';

        consoleOutput += `[${this._config.levels[log.code].name}] `;
        consoleOutput += log.message + ' ';
        consoleOutput += '[' + log.classType + '/' + log.className + '] ';
        if (log.meta.length > 0) consoleOutput += '[' + log.meta + '] ';

        consoleOutput += `[pid:${process.pid}] `;

        if (log.code < 4 && this.env !== 'production') {
            consoleOutput += '[' + log.stack + ']';
        }

        console.log(this._config.levels[log.code].color, consoleOutput, "\x1b[0m");

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

        if (this.module.mongoose && 1 === this.module.mongoose.connection.readyState) {

            this.model.log.insertMany(this._logsToSaveQueue, function (err) {
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

            if (entry.path.includes(processParentDir)) {

                let scriptPath = entry.path.replace(processParentDir, '');

                outputs.push(entry.method + ' ' + scriptPath + ':' + entry.row);
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
