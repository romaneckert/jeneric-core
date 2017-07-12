const Application = require('../application');

class Main extends Application {
    constructor() {

        super();

        console.log(this.modules.custom);

    }
}

let main = new Main();