module.exports = {
    core: {
        test: {
            path: '/test',
            method: 'get',
            class: require('../src/handler/core/test')
        }
    }
};
