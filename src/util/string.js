class StringUtil {

    toSingle(string) {
        if (string.indexOf('ies') === string.length - 3) return string.slice(0, -3) + 'y';
        if (string.indexOf('s') === string.length - 1) return string.slice(0, -1);
    }

    toMany(string) {
        return (string.indexOf('y') === string.length - 1) ? string.slice(0, -1) + 'ies' : string + 's';
    }

    cast(val) {

        if (null === val) return '';

        if (val instanceof Error) return String(val);

        if (val instanceof ReferenceError) return String(val);

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
}

module.exports = StringUtil;


