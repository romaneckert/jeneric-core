const app = require('@jeneric/app');

class View {

    handle(req, res, next) {
        res.locals.view = app.view;

        return next();
    }

}

module.exports = View;

