module.exports = {
    core: {
        statusCode404: {
            path: '/404',
            method: 'get',
            controller: require('../controller/core/statusCode404')
        }
    }
};
