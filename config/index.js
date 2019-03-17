module.exports = {
    cluster: false,
    module: {
        server: {
            port: 3000,
            middleware: {
                100: 'auth',
                200: 'roles',
                300: 'locale',
                400: 'view',
                1000: 'handler'
            }
        }
    }
}
