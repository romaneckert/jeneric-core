module.exports = {
    core: {
        statusCode404: {
            path: '/404',
            method: 'get',
            class: require('../action/core/statusCode404')
        }
    }
};
