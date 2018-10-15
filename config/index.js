module.exports = {
    middleware: {
        error: {
            class: require('../src/middleware/error')
        },
        notFound: {
            class: require('../src/middleware/not-found')
        }
    },
    model: {
        log: {
            config: {
                schema: {
                    code: {
                        type: Number,
                        required: true
                    },
                    date: {
                        type: Date,
                        required: true,
                    },
                    message: {
                        type: String,
                        required: true,
                    },
                    meta: {
                        type: String
                    },
                    classType: {
                        type: String,
                        required: true
                    },
                    className: {
                        type: String,
                        required: true
                    },
                    stack: {
                        type: String,
                        required: true
                    }
                }
            }
        }
    },
    module: {
        error: {
            class: require('../src/module/error')
        },
        logger: {
            class: require('../src/module/logger')
        },
        mongoose: {
            class: require('../src/module/mongoose'),
            config: {
                uri: 'mongodb://localhost/jeneric-core'
            }
        },
        server: {
            class: require('../src/module/server'),
            config: {
                port: 3000,
                routes: require('./routes')
            }
        },
        observer: {
            class: require('../src/module/observer')
        }
    },
    util: {
        error: {
            class: require('../src/util/error')
        },
        fs: {
            class: require('../src/util/fs')
        },
        object: {
            class: require('../src/util/object')
        },
        string: {
            class: require('../src/util/string')
        }
    }
}
