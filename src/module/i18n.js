const i18n = require('i18n');
const path = require('path');
const fs = require('../../util/fs');
const objectUtil = require('../../util/object');

class I18n {

    constructor(config) {

        this._config = {
            locales: ['en', 'de'],
            defaultLocale: 'en'
        };

        objectUtil.merge(this._config, config);

        this.provider = [];

        this._initialized = false;
    }

    _init() {

        if (this._initialized) return;

        this.provider = [];

        for (let directory of this.container.config.directories) {

            let config = {};

            let pathToLocales = path.join(directory, 'view/locale');

            if (!fs.existsSync(pathToLocales)) {
                continue;
            }

            config.directory = pathToLocales;

            objectUtil.merge(config, this._config);

            let provider = require('i18n');

            provider.configure(config);

            this.provider.push(provider);
        }

        if (0 === this.provider.length) {

            this.logger.wran('no locale folder exists');

            let provider = require('i18n');

            provider.configure(this._config);

            this.provider.push(provider);
        }

        this._initialized = true;
    }

    getCatalog() {

        this._init();

        let catalog = {};

        for (let provider of this.provider) {
            objectUtil.merge(catalog, provider.getCatalog());
        }

        return catalog;
    }

    getLocales() {

        this._init();

        return this.provider[0].getLocales();
    }

    get locale() {

        this._init();

        return this.provider[0].getLocale();
    }

    set locale(locale) {

        this._init();

        if (this.getLocales().indexOf(locale) !== -1) return;

        for (let provider of this.provider) {
            provider.setLocale(locale);
        }

    }

    translate(string, args = undefined) {

        this._init();

        return this.provider[0].__(string, args);
    }

    translatePlurals(phrase, count) {

        this._init();

        return this.provider[0].__n(phrase, count);
    }

}

module.exports = I18n;
