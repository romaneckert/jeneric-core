#!/usr/bin/env node
let kernel = {
    services : {
        logger : {
            log : function(message) {
                console.log(message);
            }
        },
        observer : {
            log : function(module) {
                console.log(module);
            }
        }
    }
};

let services = kernel.services;

kernel.services = new Proxy({}, {
   get: function(target, serviceName) {

       let p = new Proxy(services[serviceName], {
           get : function(target, name) {

               console.log('execute ' + name + ' on ' + serviceName);

               return target[name];
           }
       });

       return p;

   }
});

kernel.services.logger.log('test log');