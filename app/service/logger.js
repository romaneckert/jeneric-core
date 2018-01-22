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
                path.join(
                    path.dirname(require.main.filename),
                    '../',
                    this._config.directory,
                    this._config.levels[code].name + '.log',
                )
            );
        }

        this._logs = [];
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

        // remove whitespaces and the beginning and the end
        message = this.utils.string.cast(message).trim();

        meta = this.utils.string.cast(meta);

        if('object' !== typeof stack) {
            stack = this.utils.error.stack(new Error());
            stack.shift();
            stack.shift();
        }
        stack = this._stackToString(stack);

        let output = '[' + this._dateStringFromDate(date) + '] ';
        output += '[' + this._config.levels[code].name + '] ';
        output += '[' + module + '] ';
        output += '[' + message + ']';

        if(meta.length > 0) output += ' [' + meta + ']';
        output += ' [' + stack + ']';

        // write log entry in specific log file
        let pathToLogFile = path.join(
            path.dirname(require.main.filename),
            '../',
            this._config.directory,
            this._config.levels[code].name + '.log'
        );

        this.fs.appendFileSync(pathToLogFile, output + '\n');

        // write log entry to console
        if(this._config.levels[code].console) {

            let consoleOutput = message + ' ';
            consoleOutput += '[' + module + '] ';
            if(meta.length > 0) consoleOutput += '[' + meta + '] ';
            consoleOutput += '[' + stack + ']';

            console.log(this._config.levels[code].color , consoleOutput, "\x1b[0m") ;
        }

        let log = new this.entities.log(code, date, message, meta, module, stack);

        this.handler.logger.log.handle(log);

        this._save(log);
    }

    _save(log) {

        this._logs.push(log);

        if(this._kernel.services.data.ready) {

            for(let log of this._logs) {
                this._kernel.services.data.add(log);
            }

            this._logs = [];
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
     * @param date
     * @returns {string}
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
}

module.exports = Logger;