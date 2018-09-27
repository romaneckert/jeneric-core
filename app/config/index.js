module.exports = {
    module: {
        error: {
            class: require('../module/error')
        },
        logger: {
            class: require('../module/logger')
        },
        mongoose: {
            class: require('../module/mongoose')
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