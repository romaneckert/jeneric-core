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
    services : {
        logger : {
            class : require('../service/logger/web')
        },
        data : {
            class : require('../service/data/web')
        }
    },
    utils : {
        error : {
            class : require('../util/error'),
        },
        object : {
            class : require('../util/object'),
        },
        string : {
            class : require('../util/string'),
        }
    }
};