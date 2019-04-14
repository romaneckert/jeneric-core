#!/usr/bin/env node
const fs = require('../src/util/fs');
const path = require('path');

// get args
const args = process.argv.slice(2);

// detect path to node_modules
const pathToNodeModules = path.join(process.cwd(), 'node_modules');

// check if node_modules directory exists
if(!fs.existsSync(pathToNodeModules)) {
    console.error(`can not find path to node_modules ${pathToNodeModules}`);
}

// detect path to @jeneric/app folder
const pathToApp = path.join(pathToNodeModules, '@jeneric/app');

// remove app folder
fs.removeSync(pathToApp);

// create app folder
fs.ensureDirExists(pathToApp);

for(let arg of args) {
    if (!fs.lstatSync(arg).isDirectory()) throw new Error(`${arg} is not a directory`);

    let pathToSrc = path.join(arg, 'src');

    if(fs.lstatSync(pathToSrc).isDirectory()) {
        
    }

}
