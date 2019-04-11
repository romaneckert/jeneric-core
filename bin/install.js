const fs = require('../src/util/fs');

// get args
const args = process.argv.slice(2);

fs.

for(let arg of args) {
    if (!fs.lstatSync(arg).isDirectory(arg)) throw new Error(`${arg} is not a directory`);


}
