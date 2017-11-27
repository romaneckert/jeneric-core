const path = require('path');
const AbstractService = require('../abstract-service');

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
                }
            }
        };
        
        // merge config
        this.utils.object.merge(this._config, config);
        
        // ensure log files exists
        for(let code in this._config.levels) {

            this.fileSystem.ensureFileExists(
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

        let moduleString = '';

        if('object' === typeof moduleDefinition) {
            moduleString = moduleDefinition.toString();
        }

        let date = new Date();

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
        output += '[' + moduleString + '] ';
        output += '[' + message + ']';

        if(meta.length > 0) output += ' [' + meta + ']';
        output += ' [' + stack + ']';

        let consoleOutput = message + ' ';
        consoleOutput += '[' + moduleString + '] ';
        if(meta.length > 0) consoleOutput += '[' + meta + '] ';
        consoleOutput += '[' + stack + ']';

        for(let levelCode in this._config.levels) {

            if(levelCode >= code) {
                this.fileSystem.appendFileSync(
                    path.join(
                        path.dirname(require.main.filename),
                        '../',
                        this._config.directory,
                        this._config.levels[code].name + '.log',
                    ),
                    output + '\n'
                );
            }

        }

        if(this._config.levels[code].console) {
            console.log(this._config.levels[code].color , consoleOutput, "\x1b[0m") ;
        }

        let log = new this.entities.log(message, meta, code, date, stack);

        this._logs.push(log);

        this._saveLogs();
    }

    _saveLogs() {

        if(this.data.ready) {

            for(let log of this._logs) {
                this.data.add(log);
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