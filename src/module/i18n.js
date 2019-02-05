const path = require('path');
const fs = require('../../util/fs');
const objectUtil = require('../../util/object');
const util = require('util');

class I18n {

    constructor(config) {

        this._config = {
            locales: ['en'],
            defaultLocale: 'en'
        };

        objectUtil.merge(this._config, config);

        this._initialized = false;
        this._catalog = {};
    }

    init() {

        if (this._initialized) return;

        for (let directory of this.container.config.directories) {

            let pathToLocales = path.join(directory, 'view/locale');

            if (!fs.isDirectorySync(pathToLocales)) continue;

            let files = fs.readdirSync(pathToLocales);

            for (let filename of files) {

                let fileDetails = path.parse(filename);

                if ('.json' !== fileDetails.ext) continue;

                if (-1 === this._config.locales.indexOf(fileDetails.name)) continue;

                let fileContent = fs.readFileSync(path.join(pathToLocales, filename));

                if (undefined === this._catalog[fileDetails.name]) {
                    this._catalog[fileDetails.name] = {};
                }

                objectUtil.merge(this._catalog[fileDetails.name], JSON.parse(fileContent));

            }

        }

        this._initialized = true;
    }

    get defaultLocale() {
        return this._config.defaultLocale;
    }

    get catalog() {
        return this._catalog;
    }

    get locales() {
        return this._config.locales;
    }

    translate(locale, key, ...args) {

        if (-1 === this._config.locales.indexOf(locale)) {
            locale = this._config.defaultLocale;
        }

        try {
            return util.format(key.split('.').reduce((o, i) => o[i], this._catalog[locale]), ...args);
        } catch (err) {
            this.logger.warning(`the translation key ${key} is missing in locale ${locale}`);
        }

        return key;

    }

}

module.exports = I18n;
