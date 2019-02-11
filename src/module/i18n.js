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

        this._catalog = {};
    }

    init() {

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

        if (0 < key.replace(/[a-zA-Z0-9._]/g, '').length) {
            this.logger.warning(`the translation key '${key}' does not seem to be valid`);
            return key;
        }

        let translation = null;

        // get translation for correct locale
        try {
            translation = key.split('.').reduce((o, i) => o[i], this._catalog[locale]);
        } catch (err) { }

        if ('string' === typeof translation) {
            return util.format(translation, ...args);
        }

        // if translation not found, try to get from fallback
        // TODO: add fallback setting support

        // if translation not found from fallback, try to get from default locale
        try {
            translation = key.split('.').reduce((o, i) => o[i], this._catalog[this._config.defaultLocale]);
        } catch (err) { }

        if ('string' === typeof translation) {
            this.logger.debug(`the translation key '${key}' could not be found for the locale ${locale}, fallback to ${this._config.defaultLocale}`);
            return util.format(translation, ...args);
        }

        this.logger.warning(`the translation key '${key}' could not be found for the default locale ${this._config.defaultLocale}`);

        return key;

    }
}

module.exports = I18n;
