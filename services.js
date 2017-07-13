class Services {

    constructor() {
        return new Proxy(this, this);
    }

    set (target, serviceKey, instance, reciever) {
        if('undefined' !== typeof this['_' + serviceKey]) throw new Error(`service ${serviceKey} already exists`);
        this['_' + serviceKey] = instance;
        return true;
    }

    get (target, serviceKey) {
        if('undefined' === typeof this['_' + serviceKey]) throw new Error(`service ${serviceKey} not exists, please check your config.js`);
        return this['_' + serviceKey];
    }
}

module.exports = Services;