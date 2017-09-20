module.exports = {
    service : {
        logger : {
            class : require('../service/logger/web')
        },
        objectManager : {
            class : require('../service/object-manager/web')
        }
    },
    model : {
        log : {
            class : require('../model/log')
        }
    },
    repository : {
        log : {
            class : require('../repository/log')
        }
    }
};