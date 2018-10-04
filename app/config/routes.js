module.exports = {
    core: {
        test: {
            path: '/test',
            method: 'get',
            class: require('../handler/core/test')
        }
    }
};
