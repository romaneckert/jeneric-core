const app = require('@jeneric/app');
const path = require('path');
const pug = require('pug');

class Renderer {

    render(filePath, options, callback) {


        app.util.fs.readFile(filePath, (err, content) => {
            if (err) return callback(err);

            let pathToMixinDir = path.join(app.config.app.path, 'view/mixins');

            for (let fileName of app.util.fs.readdirSync(pathToMixinDir)) {
                content += `include mixins/${fileName}\n` + content;
            }

            return callback(null, pug.compile(content, options));
        });
    }

}

module.exports = Renderer;
