class Object {
    merge(object1, object2) {
        for (let key in object2) {
            if ('object' === typeof object1[key] && 'object' === typeof object2[key]) {
                object1[key] = this.merge(object1[key], object2[key]);
            } else {
                object1[key] = object2[key];
            }
        }
        return object1;
    }
}

module.exports = Object;
