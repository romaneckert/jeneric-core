const AbstractApplication = require('../abstract-application');

class Main extends AbstractApplication {
    constructor() {

        super();

        this.kernel.init(require('./app/config/config'));

        console.log(this.services.custom);
        console.log(this.services.custom);
        console.log(this.services.custom);


    }
}

let main = new Main();