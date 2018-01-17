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
                connection: {
                    class: require('../handler/server/io/connection')
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