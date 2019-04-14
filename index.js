const mongoose = require('mongoose');
const cluster = require('cluster');
const os = require('os');
const path = require('path');
const fs = new (require('./src/util/fs'))();
const object = new (require('./src/util/object'))();

class Jeneric {
    constructor() {

        if ('object' === typeof global.jeneric) throw Error('global.jeneric already defined');

        this.class = {};
        this.model = {};

        global.jeneric = this;

    }

    boot(...directories) {

        // add current directory
        directories.unshift(__dirname);

        // init default config
        this.config = require('./config');

        // init config.startDate
        if (undefined !== this.config.startDate) throw new Error('config.startDate already defined');

        this.config.startDate = new Date();

        // init config.context
        if (undefined !== this.config.context) throw new Error('config.context already defined');

        this.config.context = 'production';

        if ('string' === typeof process.env.NODE_ENV) {
            this.config.context = process.env.NODE_ENV;
        }

        // init config.directories
        if (undefined !== this.config.directories) throw new Error('config.directories already defined');

        this.config.directories = directories;


        // loop over all directories
        for (let directory of directories) {

            let pathToConfig = path.join(directory, 'config/index.js');

            // load config and merge config from all directories
            if (fs.isFileSync(pathToConfig)) object.merge(this.config, require(pathToConfig));

            // autoload all classes from src folders of given directories
            object.merge(this.class, this._autoload(path.join(directory, 'src')));
        }

        // create process for each cpu
        if (cluster.isMaster && true === this.config.cluster) {
            for (var i = 0; i < os.cpus().length; i++) cluster.fork();
            return;
        }

        // instantiate some classes
        let classesToInstantiate = {
            util: this.class.util,
            module: this.class.module,
            middleware: this.class.middleware,
            handler: this.class.handler
        };

        this._instantiate(classesToInstantiate, this.config, this);

        // add logger to this
        this.logger = this.module.logger;

        // handle uncaught exceptions
        process.on('uncaughtException', this.module.error.handleUncaughtException);

        // add schema classes to container
        for (let ns in this.class.schema) {
            this.model[ns] = mongoose.model(ns, new this.class.schema[ns]());
        }

        // log information about start process of core
        if (!this.config.cluster || (cluster.worker && 1 === cluster.worker.id)) {
            this.logger.log('application startet in context: "' + this.config.context + '"', null, 5, 'core', 'core');
        }

        // call init methods on modules and middleware
        for (let ns of ['module', 'middleware']) {

            for (let k in this[ns]) {
                if ('function' === typeof this[ns][k].init) this[ns][k].init();
            }

        }

        // call start methods on modules
        for (let ns in this.module) {
            if ('function' === typeof this.module[ns].start) this.module[ns].start();
        }

    }

    _instantiate(classes, config, instance) {

        if ('object' !== typeof instance) instance = {};

        for (let namespace in classes) {

            if ('object' === typeof classes[namespace] && 'object' === typeof config[namespace]) {
                instance[namespace] = this._instantiate(classes[namespace], config[namespace]);
            } else if ('function' === typeof classes[namespace] && 'object' === typeof config[namespace]) {
                instance[namespace] = new classes[namespace](config[namespace]);
            } else if ('object' === typeof classes[namespace]) {
                instance[namespace] = this._instantiate(classes[namespace], {});
            } else if ('function' === typeof classes[namespace]) {
                instance[namespace] = new classes[namespace]();
            }

        }

        return instance;
    }

    _autoload(directory) {
        let obj = {};

        if (fs.isDirectorySync(directory)) {

            for (let dirName of fs.readdirSync(directory)) {
                let result = this._autoload(path.join(directory, dirName));

                if ('function' === typeof result) {
                    let key = dirName.split('.')[0];
                    let parts = key.split('-');

                    for (let p in parts) {
                        if (0 == p) {
                            continue;
                        }
                        parts[p] = parts[p].charAt(0).toUpperCase() + parts[p].slice(1)
                    }

                    obj[parts.join('')] = result;
                } else if ('object' === typeof result && null !== result) {
                    obj[dirName] = result;
                }
            }

        } else if (fs.isFileSync(directory)) {

            if ('.js' === path.extname(directory)) return require(directory);

            return null;
        }

        return obj;
    }
}

module.exports = new Jeneric();
