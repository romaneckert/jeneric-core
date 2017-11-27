module.exports = {
    handler : {
        window : {
            error : {
                class : require('../handler/window/error')
            }
        }
    },
    services : {
        logger : {
            class : require('../service/logger')
        },
        socket : {
            class : require('../service/socket')
        }
    },
    utils : {
        error : {
            class : require('../../common/util/error')
        },
        object : {
            class : require('../../common/util/object')
        },
        string : {
            class : require('../../common/util/string')
        }
    }
};