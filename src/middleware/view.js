const app = require('@jeneric/app');
const path = require('path');

class View {

    handle(req, res, next) {

        res.locals.view = this._instantiate(req, path.join(app.config.app.path, 'src/view'));

        return next();
    }

    _instantiate(req, dir) {

        let view = {};

        if(app.util.fs.isDirectorySync(dir)) {

            for(let fileName of app.util.fs.readdirSync(dir)) {

                let ns = app.util.string.camelize(fileName);

                view[ns] = this._instantiate(req, path.join(dir, fileName));
            }


        } else if(app.util.fs.isFileSync(dir)) {

            let viewHelper = new (require(dir))(req);

            if('function' !== typeof viewHelper.render) {
                throw new Error(`${dir} has no render method`);
            }

            view = viewHelper.render.bind(viewHelper);

        }

        return view;

    }

}

module.exports = View;
