const app = require('@jeneric/app');

class Url {
    render(routeName, obj) {
        if ('object' !== typeof app.config.server.routes[routeName]) {
            throw new Error(`route with name ${routeName} does not exists`);
        }

        if ('string' !== typeof app.config.server.routes[routeName].path) {
            throw new Error(`route with name ${routeName} hat no path`);
        }

        return app.config.server.routes[routeName].path.replace(/(\/:\w+\??)/g, function (m, c) {
            c = c.replace(/[/:?]/g, '');
            return obj[c] ? '/' + obj[c] : "";
        });
    }
}

module.exports = Url;
