const AbstractLogger = require('./abstract-logger');
const path = require('path');
const Log = require('../../model/log');

class Logger extends AbstractLogger {
    constructor(config) {

        super();

        // generate default config from log levels
        this._config = {
            levels: {}
        };

        for(let level of this._levels) {
            this._config.levels[level.name] = {
                file : 'var/logs/' + level.name + '.log',
                console : true
            };
        }

        this.utils.object.merge(this._config, config);

        for(let levelName in this._config.levels) {

            let level = this._config.levels[levelName];

            level.file = path.join(path.dirname(require.main.filename), level.file);
            this.fileSystem.ensureFileExists(level.file);
        }
    }

    /**
     * @param message
     * @param meta
     * @param type
     * @private
     */
    _log(message, meta, stack, code) {

        let level = this._getLevelByCode(code);
        let date = new Date();

        message = this.utils.string.cast(message);
        meta = this.utils.string.cast(meta);

        if('object' !== typeof stack) {
            stack = this.utils.error.stack(new Error());
            stack.shift();
            stack.shift();
        }
        stack = this._stackToString(stack);

        let output = '[' + this._dateStringFromDate(date) + '] ';
        output += '[' + level.name + '] ';
        output += message;

        if(meta.length > 0) output += ' [' + meta + ']';
        output += ' [' + stack + ']';

        /*
        let output = '[' + log.dateString + '] [' + log.code + ']'
            + ((null !== log.module) ? ' [' + log.module + ']' : '')
            + ' ' + log.message
            + ((null !== log.meta) ? ' [' + log.meta + ']' : '')
            + ((null !== log.callStack) ? ' [' + (log.callStack.split(" at ")[3].match(/\w+\.js:\d+:\d+|\w+\.\w+\.js:\d+:\d+/g)[0]) + ']' : '');*/

        for(let levelInLevels of this._levels) {

            if(levelInLevels.code >= code) {
                this.fileSystem.appendFileSync(
                    this._config.levels[levelInLevels.name].file,
                    output + '\n'
                );
            }

        }

        if(this._config.levels[level.name].console) console.log(output);

        /*
        let log = new Log(message, meta, code, date, callStack);

        if('object' === typeof this.data) this.data.persist(log);
        */

    }

    _stackToString(stack) {
        let outputs = [];

        for(let entry of stack) {

            if(entry.path !== 'module.js' && entry.path !== 'bootstrap_node.js') {
                outputs.push(entry.method + ' ' + entry.file + ':' + entry.row);
            }
        }

        return outputs.join(' <- ');
    }
}

module.exports = Logger;