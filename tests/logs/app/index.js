#!/usr/bin/env node
const AbstractApplication = require('../../../app/abstract-application');

class LoggerTest extends AbstractApplication {

    constructor() {
        super();

        this.logger.info('start testing logs');

        for(let i = 0; i < 999999999; i++) {
            this.logger.info('test logger with custom param: ' + i);
        }
    }
}

new LoggerTest();
