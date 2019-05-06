const app = require('@jeneric/app');
const path = require('path');

class View {

    async handle(req, res, next) {

        res.locals.view = await this._instantiate(req, path.join(app.config.app.path, 'src/view'));

        return next();
    }

    async _instantiate(req, dir) {

        let view = {};

        if (await app.util.fs.isDirectory(dir)) {

            for (let fileName of await app.util.fs.readdir(dir)) {

                let ns = app.util.string.camelize(fileName);

                view[ns] = await this._instantiate(req, path.join(dir, fileName));
            }


        } else if (await app.util.fs.isFile(dir)) {

            let viewHelper = new (require(dir))(req);

            if ('function' !== typeof viewHelper.render) {
                throw new Error(`${dir} has no render method`);
            }

            view = viewHelper.render.bind(viewHelper);

        }

        return view;

    }

}

module.exports = View;
