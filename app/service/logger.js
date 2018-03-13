const path = require('path');
const AbstractService = require('../abstract-service');

/**
 * @classDesc logger
 * @exports app/service/logger
 * @class
 */
class Logger extends AbstractService {
    constructor(config) {

        super();

        this._config = {
            directory : 'var/logs',
            levels : {
                0 : {
                    name : 'emergency',
                    console : true,
                    color: "\x1b[31m"
                },
                1 : {
                    name : 'alert',
                    console : true,
                    color: "\x1b[31m"
                },
                2 : {
                    name : 'critical',
                    console : true,
                    color: "\x1b[31m"
                },
                3 : {
                    name : 'error',
                    console : true,
                    color: "\x1b[31m"
                },
                4 : {
                    name : 'warning',
                    console : true,
                    color: "\x1b[33m"
                },
                5 : {
                    name : 'notice',
                    console : true,
                    color: "\x1b[34m"
                },
                6 : {
                    name : 'info',
                    console : true,
                    color: "\x1b[34m"
                },
                7 : {
                    name : 'debug',
                    console : true,
                    color: "\x1b[37m"
                },
                8 : {
                    name : 'observe',
                    console : false,
                    color: "\x1b[37m"
                }
            }
        };
        
        // merge config
        this.utils.object.merge(this._config, config);
        
        // ensure log files exists
        for(let code in this._config.levels) {
            this.fs.ensureFileExists(
                this._getPathToLogFile(code, 'type')
            );
        }

        this._logsToSaveQueue = [];
        this._history = [];
    }

    /**
     * @param message
     * @param meta
     * @param moduleDefinition
     * @param stack
     * @param code
     */
    log(message, meta, moduleDefinition, stack, code) {

        let module = '';

        if('object' === typeof moduleDefinition) {
            module = moduleDefinition.toString();
        }

        let date = new Date();

        // remove line breaks
        message = message.replace(/(\r?\n|\r)/gm, ' ');

        // remove whitespaces at the beginning and the end
        message = this.utils.string.cast(message).trim();

        meta = this.utils.string.cast(meta);

        if('object' !== typeof stack) {
            stack = this.utils.error.stack(new Error());
            stack.shift();
            stack.shift();
        }
        stack = this._stackToString(stack);

        let log = new this.entities.log(code, date, message, meta, module, stack);

        this._writeToLogFiles(log);
        this._writeToConsole(log);
        this._addToHistory(log);

        // call log handler
        this.handler.logger.log.handle(log);

        // save log to db
        this._saveInDB(log);
    }

    // TODO: add log rotation
    _writeToLogFiles(log) {

        // TODO: add file checks with file check cache

        // write log entry in specific log file
        let pathToLogFile = this._getPathToLogFile(log.code, 'type');

        let output = '[' + this._dateStringFromDate(log.date) + '] ';
        output += '[' + this._config.levels[log.code].name + '] ';
        output += '[' + log.module + '] ';
        output += '[' + log.message + ']';
        if(log.meta.length > 0) output += ' [' + log.meta + ']';
        output += ' [' + log.stack + ']';

        this.fs.appendFileSync(pathToLogFile, output + '\n');
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
        if(this._config.levels[log.code].console) {

            let consoleOutput = log.message + ' ';
            consoleOutput += '[' + log.module + '] ';
            if(log.meta.length > 0) consoleOutput += '[' + log.meta + '] ';
            consoleOutput += '[' + log.stack + ']';

            console.log(this._config.levels[log.code].color , consoleOutput, "\x1b[0m") ;
        }

    }

    _addToHistory(log) {
        // remove older entries if log history greater then 200
        if(this._history.length > 200) this._history.shift();

        // add current log to history
        this._history.push(log);
    }

    _saveInDB(log) {

        // remove older entries if log to save queue greater then 200
        if(this._logsToSaveQueue.length > 200) this._logsToSaveQueue.shift();

        this._logsToSaveQueue.push(log);

        if(this._kernel.services.data.ready) {

            for(let logToSave of this._logsToSaveQueue) {
                this._kernel.services.data.add(logToSave);
            }

            this._logsToSaveQueue = [];
        }

    }

    _stackToString(stack) {
        let outputs = [];

        for(let entry of stack) {

            let processParentDir = path.dirname(process.cwd());

            if(entry.path.includes(processParentDir)) {

                let scriptPath = entry.path.replace(processParentDir, '');

                outputs.push(entry.method + ' ' + scriptPath + ':' + entry.row);
            }
        }

        return outputs.join(' <- ');
    }

    /**
     * @param {date} date
     * @returns {string} date
     * @private
     */
    _dateStringFromDate(date) {

        return date.getFullYear()
            + '-'
            + ('0' + (date.getMonth() + 1)).slice(-2)
            + '-'
            + ('0' + date.getDate()).slice(-2)
            + ' '
            + date.toTimeString().slice(0,8);
    }

    get ready() {
        return true;
    }

    get history() {
        return this._history;
    }
}

module.exports = Logger;