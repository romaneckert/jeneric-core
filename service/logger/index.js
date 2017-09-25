const AbstractLogger = require('./abstract-logger');
const path = require('path');
const Log = require('../../model/log');

class Logger extends AbstractLogger {
    constructor(config) {

        super();

        // default config
        this._config = {
            level: {
                debug: {
                    file: 'var/logs/debug.log',
                    console: false
                },
                info: {
                    file: 'var/logs/info.log',
                    console: true
                },
                error: {
                    file: 'var/logs/error.log',
                    console: true
                }
            }
        };

        Object.assign(this._config, config);

        for(let type in this._config.level) {
            this._config.level[type].file = path.join(path.dirname(require.main.filename), this._config.level[type].file);
            this.fileSystem.ensureFileExists(this._config.level[type].file);
        }
    }

    _log(message, meta, type) {

        let log = new Log(message, meta, type);

        let output = '[' + log.dateString + '] [' + log.type + ']'
            + ((null !== log.module) ? ' [' + log.module + ']' : '')
            + ' ' + log.message
            + ((null !== log.meta) ? ' [' + log.meta + ']' : '')
            + ((null !== log.callStack) ? ' [' + (log.callStack.split(" at ")[4].match(/\w+\.js:\d+:\d+|\w+\.\w+\.js:\d+:\d+/g)[0]) + ']' : '') + '\n';

        switch (type) {
            case 'debug':
                this.fileSystem.appendFileSync(
                    this._config.level.debug.file,
                    output
                );

                if(this._config.level.debug.console) console.log(output);
                break;
            case 'info':
                this.fileSystem.appendFileSync(
                    this._config.level.debug.file,
                    output
                );

                this.fileSystem.appendFileSync(
                    this._config.level.info.file,
                    output
                );

                if(this._config.level.info.console) console.log(output);

                break;
            case 'error':
                this.fileSystem.appendFileSync(
                    this._config.level.debug.file,
                    output
                );

                this.fileSystem.appendFileSync(
                    this._config.level.info.file,
                    output
                );

                this.fileSystem.appendFileSync(
                    this._config.level.error.file,
                    output
                );

                if(this._config.level.error.console) console.error(output);
                break;
        }
    }
}

module.exports = Logger;