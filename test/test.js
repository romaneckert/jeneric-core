const app = require('@jeneric/app');

before(async () => {
    await app.start();
    await app.util.fs.remove('./var');
});

after(async () => {
    await app.stop();
});
