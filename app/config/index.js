module.exports = {
    entities : {
        log : {
            class : require('../entity/log')
        }
    },
    repositories : {
        log : {
            class : require('../repository/log')
        }
    },
    handler : {
        error : {
            class : require('../handler/error')
        }
    },
    services : {
        logger : {
            class : require('../service/logger')
        },
        data : {
            class : require('../service/data')
        },
        server : {
            class : require('../service/server')
        }
    },
    utils : {
        error : {
            class : require('../../common/util/error'),
        },
        fileSystem : {
            class : require('../util/file-system'),
        },
        object : {
            class : require('../../common/util/object'),
        },
        string : {
            class : require('../../common/util/string'),
        }
    }
};