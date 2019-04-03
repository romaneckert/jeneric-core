const path = require('path');

/**
 * I18n module for translation
 * @param {object} config
 */
class I18n {

    constructor(config) {

        this.config = {
            locales: ['en'],
            defaultLocale: 'en'
        };

        jeneric.util.object.merge(this.config, config);

        this._catalog = {};
    }

    init() {

        for (let directory of jeneric.config.directories) {

            let pathToLocales = path.join(directory, 'view/locale');

            if (!jeneric.util.fs.isDirectorySync(pathToLocales)) continue;

            let files = jeneric.util.fs.readdirSync(pathToLocales);

            for (let filename of files) {

                let fileDetails = path.parse(filename);

                if ('.json' !== fileDetails.ext) continue;

                if (-1 === this.config.locales.indexOf(fileDetails.name)) continue;

                let fileContent = jeneric.util.fs.readFileSync(path.join(pathToLocales, filename));

                if (undefined === this._catalog[fileDetails.name]) {
                    this._catalog[fileDetails.name] = {};
                }

                jeneric.util.object.merge(this._catalog[fileDetails.name], JSON.parse(fileContent));

            }
        }
    }

    /**
     * default locale, example: en_US
     * @type {string}
     */
    get defaultLocale() {
        return this.config.defaultLocale;
    }

    get catalog() {
        return this._catalog;
    }

    get locales() {
        return this.config.locales;
    }

    /**
     * method to translate
     *
     * @param {string} locale example: en_US
     * @param {string} key example: jeneric.title
     * @param {object} data example: {}
     *
     * @returns {string} translated key or key if translation not exist
     */
    translate(locale, key, data) {

        if (-1 === this.config.locales.indexOf(locale)) {
            locale = this.config.defaultLocale;
        }

        if (0 < key.replace(/[a-zA-Z0-9._]/g, '').length) {
            jeneric.logger.warning(`the translation key '${key}' does not seem to be valid`);
            return key;
        }

        let translation = null;

        // get translation for correct locale
        try {
            translation = key.split('.').reduce((o, i) => o[i], this._catalog[locale]);
        } catch (err) {
            translation = null;
        }

        if ('string' === typeof translation) {
            return this._addData(locale, key, translation, data);
        }

        // if translation not found, try to get from fallback
        // TODO: add fallback setting support

        // if translation not found from fallback, try to get from default locale
        try {
            translation = key.split('.').reduce((o, i) => o[i], this._catalog[this.config.defaultLocale]);
        } catch (err) {
            translation = null;
        }

        if ('string' === typeof translation) {
            jeneric.logger.debug(`the translation key '${key}' could not be found for the locale ${locale}, fallback to ${this.config.defaultLocale}`);

            return this._addData(this.config.defaultLocale, key, translation, data);
        }

        jeneric.logger.warning(`the translation key '${key}' could not be found for the default locale ${this.config.defaultLocale}`);

        return key;

    }

    _addData(locale, key, value, data) {

        return value.replace(/{{(.+?)}}/g, (match) => {

            let property = match.replace('{{', '').replace('}}', '').trim();

            if ('string' === typeof data[property]) return data[property];

            jeneric.logger.warning(`the translation key '${key}' in locale ${locale} has no data for ${match}`);

            return match;

        });

    }
}

module.exports = I18n;
