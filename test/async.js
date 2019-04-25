let crypto = require('crypto');

let blocked = function (fn, options) {
    var opts = options || {};
    var start = process.hrtime();
    var interval = 100;
    var threshold = opts.threshold || 10;

    return setInterval(function () {
        var delta = process.hrtime(start);
        var nanosec = delta[0] * 1e9 + delta[1];
        var ms = nanosec / 1e6;
        var n = ms - interval;

        if (n > threshold) {
            fn(Math.round(n));
        }
        start = process.hrtime();
    }, interval).unref();
};

blocked(function(ms) {
    console.log(ms + ' ms blocked');
    process.exit();
}, {threshold:10});

function sleep(ms) {
    return new Promise(resolve => {
        console.log(`starting ${ms}`);
        setTimeout(() => {
            console.log(`done ${ms}`);
            resolve(ms);
        }, ms);
    });
}

(async () => {

    console.log('This will be executed concurrently - thanks to putting promises in the array');

    const start = new Date();
    const aPromise = sleep(2000);
    const bPromise = sleep(500);
    const cPromise = sleep(5);

    const [a, b, c] = [await aPromise, await bPromise, await cPromise];

    console.log(`sleeping done - got ${a} ${b} ${c} in ${new Date()-start}`);
})();

for (let i = 0; i < 100; i++) {
    crypto.scrypt('sadf' + i, 'asdfasdf', 12, () => {
        console.log('done');
    });
}



