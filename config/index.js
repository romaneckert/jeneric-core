module.exports = {
    core: {
        cluster: false
    },
    module: {
        server: {
            port: 3000,
            middleware: {
                100: 'roles',
                200: 'locale',
                300: 'asset',
                1000: 'handler'
            }
        }
    }
}
