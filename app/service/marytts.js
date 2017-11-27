const spawn = require('child_process').spawn;
const querystring = require('querystring');
const http = require('http');
const slug = require('slug');
const fs = require('fs');
const AbstractService = require('@jeneric/app/abstract-service');
const path = require('path');

/** marytts module */
class MaryTTS extends AbstractService {

    constructor(config) {

        super();

        this._config = {
            directory : '../var/sounds',
            host: '127.0.0.1',
            port: 59125
        };

        // merge config

        this.utils.object.merge(this._config, config);

        // check if config bin set
        if('string' !== typeof this._config.bin) throw new Error('you have to set the path to the marytts binary in config');

        this._config.directory = path.join(path.dirname(require.main.filename), this._config.directory);
        this._config.bin = path.join(path.dirname(require.main.filename), this._config.bin);

        // check if binary exists
        if(!fs.existsSync(this._config.bin)) throw new Error(this._config.bin + 'does not exists');

        // check if directory exists
        this.utils.fileSystem.ensureFolderExists(this._config.directory);

        this._ready = false;

        http.get('http://' + this._config.host + ':' + this._config.port + '/version', (response) => {

            if(response && 200 === response.statusCode) {
                this._ready = true;
            } else {
                this._startServer();
            }

        }).on('error', (error) => {
            this._startServer();
        });
    }

    _startServer() {

        let child = spawn(this._config.bin, {
            detached: true
        });

        child.stdout.on('data', (data) => {
            this.logger.debug(data.toString());
        });

        child.stderr.on('data', (data) => {
            this.logger.debug(data.toString());
            if(data.toString().includes('started in') && data.toString().includes('on port')) this._ready = true;
        });

        child.on('close', (code) => {
            this.logger.debug(code);
        });

        child.unref();
    }

    textToSpeech(message, callback) {

        let filePath = path.join(this._config.directory, slug(message, {lower: true}) + '.wav');
        if(fs.existsSync(filePath)) {
            callback(message, filePath);
            return true;
        }

        let params = {
            'INPUT_TEXT' : message,
            'INPUT_TYPE': 'TEXT',
            'OUTPUT_TYPE' : 'AUDIO',
            'AUDIO' : 'WAVE_FILE',
            'LOCALE' : 'de',
            'effect_Chorus_selected' : 'on',
            'effect_Chorus_parameters' : 'delay1:466;amp1:0.54;delay2:600;amp2:-0.10;delay3:250;amp3:0.30'
        };

        let queryString = querystring.stringify(params);
        let url = 'http://' + this._config.host + ':' + this._config.port + '/process?' + queryString;

        let errorMessage = 'can not get message from marytts server for url: ' + url;

        http.get(url, (response) => {

            if(response && 200 === response.statusCode) {

                let file = fs.createWriteStream(filePath);

                file.on('finish', () => {

                    this.logger.debug('generate file ' + filePath);

                    file.close(() => {
                        callback(message, filePath);
                    });
                });

                response.pipe(file);

            } else {
                this.logger.error(errorMessage);
                throw errorMessage;
            }

        }).on('error', (errorMessage) => {
            this.logger.error(errorMessage);
            throw errorMessage;
        });

        return true;

    }

    get ready() {
        return this._ready;
    }
}

module.exports = MaryTTS;