module.exports = {
    modules: {
        logger : {
            active : false,
            module : require('@jeneric/logger')
        },
        custom : {
            active : false,
            module : require('../modules/custom')
        }
    }
};