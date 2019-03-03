module.exports = {
    core: {
        cluster: false
    },
    module: {
        server: {
            port: 3000,
            middleware: {
                0: 'access',
                1000: 'locale',
                1001: 'asset',
                1100: 'router',
                10000: 'error',
                10001: 'notFound'
            }
        }
    }
}
