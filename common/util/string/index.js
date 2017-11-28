module.exports = {
    toMany : function(string) {
        return (string.indexOf('y') === string.length - 1) ? string.slice(0, -1) + 'ies' : string + 's';
    },

    cast : function(val) {

        switch (typeof val) {
            case 'object':
                if(val === null) {
                    return '';
                } else {

                    let cache = [];

                    val = JSON.stringify(val, function(key, val) {

                        // prevent cycles
                        if (typeof val === 'object') {
                            if (cache.indexOf(val) >= 0) return;
                            cache.push(val)
                        }
                        return val
                    });
                }
                break;
            case 'undefined':
                return '';
                break;
            default:
                return String(val);
                break;
        }
    }
};