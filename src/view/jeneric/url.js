module.exports = class Uri {

    render(routeName, obj) {

        if ('object' !== typeof jeneric.module.server.routes[routeName]) {
            throw new Error(`route with name ${routeName} does not exists`);
        }

        if ('string' !== typeof jeneric.module.server.routes[routeName].path) {
            throw new Error(`route with name ${routeName} hat no path`);
        }

        return jeneric.module.server.routes[routeName].path.replace(/(\/:\w+\??)/g, function (m, c) {
            c = c.replace(/[/:?]/g, '');
            return obj[c] ? '/' + obj[c] : "";
        });
    }

}
