module.exports = {
    core: {
        cluster: false
    },
    model: {
        log: {
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
                type: {
                    type: String,
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                stack: {
                    type: String,
                    required: true
                }
            }
        }
    },
    module: {
        server: {
            port: 3000,
            middleware: {
                0: 'access',
                1000: 'locals',
                1001: 'router',
                10000: 'error',
                10001: 'notFound'
            }
        }
    }
}
