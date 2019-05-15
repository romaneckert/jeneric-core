const app = require('@jeneric/app');
const pug = require('pug');

class Renderer {

    constructor() {
        this.templates = {};
        this.templateCounter = 0;

        this.view = {};
        this.viewCounter = 0;

    }

    async start() {

        let pathToTemplates = app.util.fs.path.join(app.config.app.path, 'view/template');

        if (!await app.util.fs.isDirectory(pathToTemplates)) {
            throw new Error(`directory ${pathToTemplates} does not exists`);
        }

        await this.compileTemplate(pathToTemplates);

        let pathToViews = app.util.fs.path.join(app.config.app.path, 'src/view');

        this.view = await this._instantiate(pathToViews);

        app.logger.info(`${this.viewCounter} view helper created and ${this.templateCounter} templates compiled`);

    }

    async compileTemplate(path) {

        if (await app.util.fs.isDirectory(path)) {
            for (let fileName of await app.util.fs.readdir(path)) {
                await this.compileTemplate(app.util.fs.path.join(path, fileName));
            }
        } else if (await app.util.fs.isFile(path)) {
            this.templates[path] = pug.compileFile(path, {
                filename: path,
            });

            this.templateCounter++;
        }
    }

    async render(filePath, locals, callback) {

        if ('function' !== typeof this.templates[filePath]) {
            throw new Error(`template ${filePath} does not exists`);
        }

        if ('string' !== typeof locals.locale || 0 === locals.locale.length) {
            locals.locale = null;
        }

        locals.view = this.view;

        callback(null, this.templates[filePath](locals, {cache: true}));
    }

    async _instantiate(dir) {

        let view = {};

        if (await app.util.fs.isDirectory(dir)) {

            for (let fileName of await app.util.fs.readdir(dir)) {

                let ns = app.util.string.camelize(fileName);

                view[ns] = await this._instantiate(app.util.fs.path.join(dir, fileName));
            }


        } else if (await app.util.fs.isFile(dir)) {

            let viewHelper = new (require(dir))();

            if ('function' !== typeof viewHelper.render) {
                throw new Error(`${dir} has no render method`);
            }

            view = viewHelper.render.bind(viewHelper);

            this.viewCounter++;

        }

        return view;

    }

}

module.exports = Renderer;
