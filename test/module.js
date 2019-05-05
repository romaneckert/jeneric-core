const https = require('https');

describe('module', () => {

    describe('server', () => {

        https.request({
            hostname: 'localhost',
            port: 3000,
            path: '/',
            method: 'GET'
        }, (res) => {
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);

            res.on('data', (d) => {
                process.stdout.write(d);
            });
        });

    });

});
