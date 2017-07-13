module.exports = {
    services: {
        logger : {
            active : false,
            //module : require('@jeneric/logger'),
            options : {
                directory : 'var/logs/',
                consoleLevels: [
                    'debug',
                    'info',
                    'error'
                ]
            }
        },
        custom : {
            active : true,
            module : require('../service/custom'),
            options : {
                test : true
            }
        }
    }
};