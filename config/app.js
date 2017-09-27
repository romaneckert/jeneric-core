module.exports = {
    models : {
        log : {
            class : require('../model/log'),
            schema : {
                message : String,
                meta : String,
                type : String,
                date : Date,
                callStack : String
            }
        }
    },
    repositories : {
        log : {
            class : require('../repository/log')
        }
    },
    services : {
        logger : {
            class : require('../service/logger')
        },
        data : {
            class : require('../service/data')
        }
    },
    utils : {
        object : {
            class : require('../util/object'),
        },
        string : {
            class : require('../util/string'),
        },
        fileSystem : {
            class : require('../util/file-system'),
        }
    }
};