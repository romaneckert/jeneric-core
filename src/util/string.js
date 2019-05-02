module.exports = {

    camelize(text) {
        return text.split('.')[0].replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => {
            if (p2) return p2.toUpperCase();
            return p1.toLowerCase();
        });
    },

    cast(val) {

        if (null === val) {
            return '';
        }

        if('undefined' === typeof val) {
            return '';
        }

        if (val instanceof Error) {
            return String(val);
        }

        if ('object' === typeof val) {
            let cache = [];

            return JSON.stringify(val, (key, val) => {

                // prevent cycles
                if (typeof val === 'object') {
                    if (cache.indexOf(val) !== -1) {
                        return;
                    }
                    cache.push(val)
                }
                return val
            });
        }

        return String(val);
    }
};


