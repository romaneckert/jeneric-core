const object = {};

object.merge = (obj1, obj2) => {
    for (let key in obj2) {
        if ('object' === typeof obj1[key] && 'object' === typeof obj2[key]) {
            obj1[key] = object.merge(obj1[key], obj2[key]);
        } else {
            obj1[key] = obj2[key];
        }
    }
    return obj1;
};

object.clone = (obj) => {
    return object.merge({}, obj);
};

module.exports = object;


