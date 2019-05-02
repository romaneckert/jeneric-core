module.exports = {

    camelize(text) {
        return text.split('.')[0].replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => {
            if (p2) return p2.toUpperCase();
            return p1.toLowerCase();
        });
    },

    toSingle(string) {
        if (string.indexOf('ies') === string.length - 3) return string.slice(0, -3) + 'y';
        if (string.indexOf('s') === string.length - 1) return string.slice(0, -1);
    },

    toMany(string) {
        return (string.indexOf('y') === string.length - 1) ? string.slice(0, -1) + 'ies' : string + 's';
    },

    cast(val) {

        if (null === val) return '';

        if (val instanceof Error || val instanceof TypeError || val instanceof ReferenceError) return String(val);

        if ('object' === typeof val) {
            let cache = [];

            return JSON.stringify(val, (key, val) => {

                // prevent cycles
                if (typeof val === 'object') {
                    if (cache.indexOf(val) >= 0) return;
                    cache.push(val)
                }
                return val
            });
        }

        if ('undefined' === typeof val) {
            return '';
        }

        return String(val);
    }
};


