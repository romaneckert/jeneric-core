const app = require('@jeneric/app');
const path = require('path');

class View {

    handle(req, res, next) {

        let view = {};

        this._instantiate(view, req, path.join(app.config.app.path, 'src/view'));

        res.locals.view = view;

        return next();
    }

    _instantiate(view, req, dir) {

        if(app.util.fs.isDirectorySync(dir)) {

            for(let fileName of app.util.fs.readdirSync(dir)) {
                this._instantiate(view, req, path.join(dir, fileName))
            }


        } else if(app.util.fs.isFileSync(dir)) {
            let ns = app.util.fs.fileNameToClassName(path.basename(dir));

            let viewHelper = new (require(dir))(req);

            if('function' !== typeof viewHelper.render) {
                throw new Error(`${dir} has no render method`);
            }

            view[ns] = viewHelper.render.bind(viewHelper);

        }

    }

}

module.exports = View;
