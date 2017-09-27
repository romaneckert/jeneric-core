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
                },
                critical: {
                    file: 'var/logs/critical.log',
                    console: true
                }
            }
        };

        this.utils.object.merge(this._config, config);

        for(let type in this._config.level) {
            this._config.level[type].file = path.join(path.dirname(require.main.filename), this._config.level[type].file);
            this.fileSystem.ensureFileExists(this._config.level[type].file);
        }
    }

    _log(message, meta, type) {

        message = this.utils.string.cast(message);
        meta = this.utils.string.cast(meta);
        let err = new Error();
        let callStack = 'undefined' === typeof err.stack ? null : err.stack;

        let log = new Log(message, meta, type, new Date(), callStack);

        if('object' === typeof this.data) this.data.persist(log);

        let output = '[' + log.dateString + '] [' + log.type + ']'
            + ((null !== log.module) ? ' [' + log.module + ']' : '')
            + ' ' + log.message
            + ((null !== log.meta) ? ' [' + log.meta + ']' : '')
            + ((null !== log.callStack) ? ' [' + (log.callStack.split(" at ")[3].match(/\w+\.js:\d+:\d+|\w+\.\w+\.js:\d+:\d+/g)[0]) + ']' : '');

        switch (type) {
            case 'debug':
                this.fileSystem.appendFileSync(
                    this._config.level.debug.file,
                    output + '\n'
                );

                if(this._config.level.debug.console) console.log(output);
                break;
            case 'info':
                this.fileSystem.appendFileSync(
                    this._config.level.debug.file,
                    output + '\n'
                );

                this.fileSystem.appendFileSync(
                    this._config.level.info.file,
                    output + '\n'
                );

                if(this._config.level.info.console) console.log(output);

                break;
            case 'error':
                this.fileSystem.appendFileSync(
                    this._config.level.debug.file,
                    output + '\n'
                );

                this.fileSystem.appendFileSync(
                    this._config.level.info.file,
                    output + '\n'
                );

                this.fileSystem.appendFileSync(
                    this._config.level.error.file,
                    output + '\n'
                );

                if(this._config.level.error.console) console.error(output);
                break;
            case 'critical':
                this.fileSystem.appendFileSync(
                    this._config.level.debug.file,
                    output + '\n'
                );

                this.fileSystem.appendFileSync(
                    this._config.level.info.file,
                    output + '\n'
                );

                this.fileSystem.appendFileSync(
                    this._config.level.error.file,
                    output + '\n'
                );

                this.fileSystem.appendFileSync(
                    this._config.level.critical.file,
                    output + '\n'
                );

                if(this._config.level.critical.console) console.error(output);
                break;
        }
    }
}

module.exports = Logger;