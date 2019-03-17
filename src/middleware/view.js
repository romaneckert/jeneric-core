class View {

    handle(req, res, next) {

        let view = {};

        this._instantiate(res, jeneric.class.view, view)

        res.locals.view = view;
        
        return next();
    }

    _instantiate(res, classes, view) {

        for (let ns in classes) {
            let cls = classes[ns];

            if ('function' === typeof cls) {

                let instance = new cls(res);

                if ('function' !== typeof instance.render) {
                    jeneric.logger.error(`${ns} has no render methode`)
                    continue;
                }

                view[ns] = instance.render.bind(instance);
            } else if ('object' === typeof cls) {
                view[ns] = {};
                this._instantiate(res, classes[ns], view[ns]);
            }
        }

    }

}

module.exports = View;
