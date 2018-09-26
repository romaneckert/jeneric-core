module.exports = {
    module: {
        logger: {
            class: require('../module/logger')
        },
        mongoose: {
            class: require('../module/mongoose'),
            config: {
                uri: 'mongodb://localhost/cms'
            }
        },
        server: {
            class: require('../module/server'),
            config: {
                port: 3000
            }
        },
        observer: {
            class: require('../module/observer')
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
