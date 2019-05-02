const app = require('@jeneric/app');

before(async () => {
    await app.start();
});

after(async () => {
    await app.stop();
});
