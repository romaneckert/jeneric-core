const stackTrace = require('stack-trace');
const app = require('@jeneric/app');

class Logger {
    constructor() {

        // load config
        this.config = app.config.logger;

        // validate config.duplicateTime
        if ('number' !== typeof this.config.duplicateTime || 0 === this.config.duplicateTime) {
            throw new Error('config.logger.duplicateTime not valid');
        }

        // validate config.levels
        if ('object' !== typeof this.config.levels || 0 === this.config.levels.length) {
            throw new Error('config.logger.levels not valid');
        }

        // validate config.directory
        if ('string' !== typeof this.config.directory || 0 === this.config.directory.length) {
            throw new Error('config.logger.directory not valid');
        }

        // validate config.maxSizePerLogFile
        if ('number' !== typeof this.config.maxSizePerLogFile || 0 === this.config.maxSizePerLogFile) {
            throw new Error('config.logger.maxSizePerLogFile not valid');
        }

        // validate config.maxLogRotationsPerType
        if ('number' !== typeof this.config.maxLogRotationsPerType || 0 === this.config.maxLogRotationsPerType) {
            throw new Error('config.logger.maxLogRotationsPerType not valid');
        }

        // validate config.maxHistoryLength
        if ('number' !== typeof this.config.maxHistoryLength || 0 === this.config.maxHistoryLength) {
            throw new Error('config.logger.maxHistoryLength not valid');
        }

        // init logs to save queue
        this._logsToSaveQueue = [];

        // init history queue
        this._history = [];
    }

    async emergency(message, meta) {
        await this.log(message, meta, 0);
    }

    async alert(message, meta) {
        await this.log(message, meta, 1);
    }

    async critical(message, meta) {
        await this.log(message, meta, 2);
    }

    async error(message, meta) {
        await this.log(message, meta, 3);
    }

    async warning(message, meta) {
        await this.log(message, meta, 4);
    }

    async notice(message, meta) {
        await this.log(message, meta, 5);
    }

    async info(message, meta) {
        await this.log(message, meta, 6);
    }

    async debug(message, meta) {
        await this.log(message, meta, 7);
    }

    async log(message, meta, code, type, name) {

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
        message = app.util.string.cast(message).trim();

        // remove line breaks from message
        message = message.replace(/(\r?\n|\r)/gm, ' ');

        // cast meta data like objects to string
        meta = app.util.string.cast(meta);

        stack = this._stackToString(stack);

        // create log entity
        let log = new app.model.log({
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
        await this._writeToLogFiles(log);

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
                && log.date - oldLog.date < this.config.duplicateTime
            ) {
                return true;
            }
        }

        return false;
    }

    async _writeToLogFiles(log) {

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
            await app.util.fs.ensureFileExists(logFile);

            process.exit();

            // check if log rotation is necessary
            await this._rotateLogFile(logFile);

            // write line to log file
            await app.util.fs.appendFile(logFile, output.replace(/\r?\n?/g, '').trim() + '\n');

        }

    }

    async _rotateLogFile(pathToLogFile) {

        let fileSize = await app.util.fs.stat(pathToLogFile).size;

        if (fileSize < this.config.maxSizePerLogFile) return false;

        for (let i = this.config.maxLogRotationsPerType - 1; i >= 0; i--) {

            let pathToArchivedLogFile = pathToLogFile + '.' + i;

            // check if archived file exists
            if (!await app.util.fs.isFile(pathToArchivedLogFile)) continue;

            // unlink last log file
            if (this.config.maxLogRotationsPerType - 1 === i) {
                await app.util.fs.remove(pathToArchivedLogFile);
                continue;
            }

            await app.util.fs.rename(pathToArchivedLogFile, pathToLogFile + '.' + (i + 1));
        }

        await app.util.fs.rename(pathToLogFile, pathToLogFile + '.' + 0);
        await app.util.fs.ensureFileExists(pathToLogFile);
    }

    _getPathToLogFile(code, namespaces) {

        return app.util.fs.path.join(
            process.cwd(),
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
        if (log.code > 5 && app.config.app.context === 'production') return;

        let consoleOutput = '';

        consoleOutput += `[${this.config.levels[log.code].name}] `;
        consoleOutput += log.message + ' ';
        consoleOutput += '[' + log.type + '/' + log.name + '] ';

        if (log.meta.length > 0) consoleOutput += '[' + log.meta + '] ';

        consoleOutput += `[pid:${process.pid}] `;

        if (log.code < 4 && app.config.app.context !== 'production') {
            consoleOutput += '[' + log.stack + ']';
        }

        console.log(this.config.levels[log.code].color, consoleOutput.replace(/\r?\n?/g, '').trim(), "\x1b[0m");

    }

    _addToHistory(log) {

        // remove older entries if log history greater then max history length
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

        if (app.module.mongoose && 1 === app.module.mongoose.instance.connection.readyState) {

            app.model.log.insertMany(this._logsToSaveQueue, function (err) {
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

            let processParentDir = app.util.fs.path.dirname(process.cwd());

            if (null !== entry.fileName && entry.fileName.includes(processParentDir)) {

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
