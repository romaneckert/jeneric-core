const app = require('@jeneric/app');
const path = require('path');
const pug = require('pug');

class Renderer {

    async render(filePath, options) {

        let content = await app.util.fs.readFile(filePath, 'utf8');

        let pathToMixinDir = path.join(app.config.app.path, 'view/mixins');

        for (let fileName of await app.util.fs.readdir(pathToMixinDir)) {
            //content += `include mixins/${fileName}\n` + content;
        }

        console.log(pug.compile(content, options));

        return pug.compile(content, options);
    }

}

module.exports = Renderer;
