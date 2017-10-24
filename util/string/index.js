module.exports = {
    toMany : function(string) {
        if(string.indexOf('y') === string.length - 1) return string.slice(0, -1) + 'ies';
        return string + 's';
    },

    cast : function(val) {

        switch (typeof val) {
            case 'object':
                if(val === null) {
                    val = '';
                } else {

                    let cache = [];

                    val = JSON.stringify(val, function(key, val) {
                        if (typeof val === 'object') {
                            if (cache.indexOf(val) >= 0) return;
                            cache.push(val)
                        }
                        return val
                    });
                }
                break;
            case 'undefined':
                val = '';
                break;
            default:
                val = String(val);
                break;
        }

        return val;
    }
};