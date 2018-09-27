module.exports = {
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
            class: require('../module/error')
        },
        logger: {
            class: require('../module/logger')
        },
        mongoose: {
            class: require('../module/mongoose')
        },
        server: {
            class: require('../module/server'),
            config: {
                port: 3000
            }
        },
        observer: {
            class: require('../module/observer')
        }
    },
    util: {
        error: {
            class: require('../util/error')
        },
        fs: {
            class: require('../util/fs')
        },
        object: {
            class: require('../util/object')
        },
        string: {
            class: require('../util/string')
        }
    }
}