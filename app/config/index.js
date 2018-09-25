module.exports = {
    model: {
        log: {
            class: require('../model/log')
        }
    },
    module: {
        db: {
            class: require('../module/db'),
            config: {
                uri: 'mongodb://localhost/cms'
            }
        },
        logger: {
            class: require('../module/logger')
        },
        server: {
            class: require('../module/server'),
            config: {
                port: 3000
            }
        }
    },
    util: {
        error: {
            class: require('../util/error')
        },
        fs: {
            class: require('../util/fs')
        },
        object: {
            class: require('../util/object')
        },
        string: {
            class: require('../util/string')
        }
    }
}
