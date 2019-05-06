const app = require('@jeneric/app');

/**
 * @param {object} config
 * @class i18n
 * @alias jeneric.module.i18n
 */
class I18n {

    constructor() {
        this.config = app.config.i18n;
        this.catalog = require('@jeneric/app/locale');

    }

    /**
     * @description Return the default locale
     * @example
     * jeneric.module.i18n.defaultLocale
     * @type {string}
     * @returns {string} Return the default locale.
     */
    get defaultLocale() {
        return this.config.defaultLocale;
    }

    get locales() {
        return this.config.locales;
    }

    /**
     * @description This is a method to get the translation for a key.
     *
     * @param {string} [locale=en_US] - The locale in which the key have to be translated.
     * @param {string} [key=translation.key] - The translation key.
     * @param {Object} [data={}] - Additional data which have to be inserted in the translation.
     *
     * @example Translation
     * @returns {string} The translated key or key if translation not exist.
     */
    async translate(locale, key, data) {

        // check if locale is in the list of predefined locales, if not fall back to default locale
        if (-1 === this.config.locales.indexOf(locale)) locale = this.config.defaultLocale;

        // check if the key is valid
        if (0 < key.replace(/[a-zA-Z0-9._]/g, '').length) {
            await app.logger.warning(`the translation key '${key}' does not seem to be valid`);
            return key;
        }

        let translation = null;

        // get translation for correct locale
        try {
            translation = key.split('.').reduce((o, i) => o[i], this.catalog[locale]);
        } catch (err) {
            translation = null;
        }

        if ('string' === typeof translation) {
            return await this._addData(locale, key, translation, data);
        }

        // if translation not found, try to get from fallback
        // TODO: add fallback setting support

        // if translation not found from fallback, try to get from default locale
        try {
            translation = key.split('.').reduce((o, i) => o[i], this.catalog[this.config.defaultLocale]);
        } catch (err) {
            translation = null;
        }

        if ('string' === typeof translation) {
            await app.logger.debug(`the translation key '${key}' could not be found for the locale ${locale}, fallback to ${this.config.defaultLocale}`);

            return await this._addData(this.config.defaultLocale, key, translation, data);
        }

        await app.logger.warning(`the translation key '${key}' could not be found for the default locale ${this.config.defaultLocale}`);

        return key;

    }

    async _addData(locale, key, value, data) {

        return value.replace(/{{(.+?)}}/g, async (match) => {

            let property = match.replace('{{', '').replace('}}', '').trim();

            if ('string' === typeof data[property]) return data[property];

            await app.logger.warning(`the translation key '${key}' in locale ${locale} has no data for ${match}`);

            return match;

        });

    }
}

module.exports = I18n;
