module.exports = {
    models : {
        log : {
            class : require('../model/log')
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
            class : require('../util/error'),
        },
        fileSystem : {
            class : require('../util/file-system'),
        },
        object : {
            class : require('../util/object'),
        },
        string : {
            class : require('../util/string'),
        }
    }
};