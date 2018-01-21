module.exports = {
    entities: {
        log: {
            class: require('../../common/entity/log')
        }
    },
    repositories: {
        log: {
            class: require('../repository/log')
        }
    },
    handler: {
        error: {
            class: require('../handler/error')
        },
        logger: {
            log: {
                class: require('../handler/logger/log')
            }
        },
        server: {
            io: {
                connect: {
                    class: require('../handler/server/io/connect')
                },
                disconnect: {
                    class: require('../handler/server/io/disconnect')
                }
            }
        }
    },
    services: {
        observer: {
            class: require('../service/observer')
        },
        logger: {
            class: require('../service/logger')
        },
        data: {
            class: require('../service/data')
        },
        server: {
            class: require('../service/server')
        }
    },
    utils: {
        error: {
            class: require('../../common/util/error'),
        },
        fs: {
            class: require('../util/fs'),
        },
        object: {
            class: require('../../common/util/object'),
        },
        string: {
            class: require('../../common/util/string'),
        }
    }
};