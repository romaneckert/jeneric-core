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
        observer : {
            class : require('../service/observer')
        },
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
        fs : {
            class : require('../util/fs'),
        },
        object : {
            class : require('../../common/util/object'),
        },
        string : {
            class : require('../../common/util/string'),
        }
    }
};