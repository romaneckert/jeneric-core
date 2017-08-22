module.exports = {
    component : {
        logger : {
            service : {
                logger : {
                    class : require('../component/logger/service/logger')
                },
                objectManager : {
                    class : require('../component/object-manager/service/object-manager')
                }
            },
            model : {
                log : {
                    class : require('../component/logger/model/log')
                }
            },
            repository : {
                log : {
                    class : require('../component/logger/repository/log')
                }
            }
        }
    }
};