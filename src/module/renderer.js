const app = require('@jeneric/app');
const path = require('path');
const pug = require('pug');

class Renderer {

    constructor() {
        this.mixins = {};
        this.pathToMixinDir = null;
    }


    async start() {
        this.pathToMixinDir = path.join(app.config.app.path, 'view/mixins');
        await this.instantiateMixins();
    }

    async render(filePath, options, callback) {

        let content = await app.util.fs.readFile(filePath, 'utf8');

        let fn = pug.compile(
            content,
            {
                filename: filePath,
                basedir: '/'
            }
        );

        let locals = {};

        if ('object' === typeof options && null !== options && 'object' === typeof options._locals) {
            locals = options._locals;
        }

        if ('string' !== typeof locals.locale || 0 === locals.locale.length) {
            locals.locale = null;
        }

        locals.view = this._instantiate(
            {
                locale: locals.locale
            },
            path.join(app.config.app.path, 'src/view')
        );

        app.util.object.merge(locals.view, this.mixins);

        callback(null, fn(locals, { cache: true }));
    }

    async instantiateMixins() {
        for (let fileName of await app.util.fs.readdir(this.pathToMixinDir)) {

            let fileContent = await app.util.fs.readFile(app.util.fs.path.join(this.pathToMixinDir, fileName));

            this.mixins[app.util.string.camelize(fileName)] = pug.compile(fileContent);
        }
    }

    async _instantiate(locals, dir) {

        let view = {};

        if (await app.util.fs.isDirectory(dir)) {

            for (let fileName of await app.util.fs.readdir(dir)) {

                let ns = app.util.string.camelize(fileName);

                view[ns] = await this._instantiate(locals, path.join(dir, fileName));
            }


        } else if (await app.util.fs.isFile(dir)) {

            let viewHelper = new (require(dir))(locals);

            if ('function' !== typeof viewHelper.render) {
                throw new Error(`${dir} has no render method`);
            }

            view = viewHelper.render.bind(viewHelper);

        }

        return view;

    }

}

module.exports = Renderer;
