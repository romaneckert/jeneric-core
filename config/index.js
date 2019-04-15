module.exports = {
    module: {
        auth: {
            tokenExpiresIn: 86400
        },
        core: {
            cluster: false
        },
        logger: {
            directory: 'var/logs',
            maxSizePerLogFile: 16 * 1024 * 1024, // in byte - default 16 mb
            maxLogRotationsPerType: 10,
            maxHistoryLength: 1000,
            duplicateTime: 10000,
            levels: {
                0: {
                    name: 'emergency',
                    console: true,
                    color: "\x1b[31m"
                },
                1: {
                    name: 'alert',
                    console: true,
                    color: "\x1b[31m"
                },
                2: {
                    name: 'critical',
                    console: true,
                    color: "\x1b[31m"
                },
                3: {
                    name: 'error',
                    console: true,
                    color: "\x1b[31m"
                },
                4: {
                    name: 'warning',
                    console: true,
                    color: "\x1b[33m"
                },
                5: {
                    name: 'notice',
                    console: true,
                    color: "\x1b[34m"
                },
                6: {
                    name: 'info',
                    console: true,
                    color: "\x1b[34m"
                },
                7: {
                    name: 'debug',
                    console: true,
                    color: "\x1b[37m"
                },
                8: {
                    name: 'observe',
                    console: false,
                    color: "\x1b[37m"
                }
            }
        },
        mongoose: {
            connection: {
                useNewUrlParser: true,
                reconnectTries: Number.MAX_VALUE,
                reconnectInterval: 1000
            }
        },
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
