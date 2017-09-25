module.exports = {
    service : {
        fileSystem : {
            class : require('../service/file-system'),
        },
        logger : {
            class : require('../service/logger')
        },
        objectManager : {
            class : require('../service/object-manager')
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