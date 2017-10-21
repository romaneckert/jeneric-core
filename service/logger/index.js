const AbstractLogger = require('./abstract-logger');
const path = require('path');
const Log = require('../../model/log');

class Logger extends AbstractLogger {
    constructor(config) {

        super();

        // extend config
        for(let levelName in this._config.levels) {
            this._config.levels[levelName].file = 'var/logs/' + levelName + '.log';
            this._config.levels[levelName].console = true;
        }

        this.utils.object.merge(this._config, config);

        for(let levelName in this._config.levels) {

            let level = this._config.levels[levelName];

            level.file = path.join(path.dirname(require.main.filename), level.file);
            this.fileSystem.ensureFileExists(level.file);
        }

        this._logs = [];
    }

    /**
     *
     * @param message
     * @param meta
     * @param stack
     * @param code
     * @private
     */
    _log(message, meta, stack, code) {

        let levelName = this._getLevelNameByCode(code);
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
        output += '[' + levelName + '] ';
        output += message;

        if(meta.length > 0) output += ' [' + meta + ']';
        output += ' [' + stack + ']';

        for(let levelNameInConfig in this._config.levels) {

            if(this._config.levels[levelNameInConfig].code >= code) {
                this.fileSystem.appendFileSync(
                    this._config.levels[levelNameInConfig].file,
                    output + '\n'
                );
            }

        }

        if(this._config.levels[levelName].console) console.log(output);

        let log = new Log(message, meta, code, date, stack);

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

            let processPartentDir = path.dirname(process.cwd());

            if(entry.path.includes(processPartentDir)) {

                let scriptPath = entry.path.replace(processPartentDir, '');

                outputs.push(entry.method + ' ' + scriptPath + ':' + entry.row);
            }
        }

        return outputs.join(' <- ');
    }
}

module.exports = Logger;