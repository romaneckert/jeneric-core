module.exports = {
    toMany : function(string) {
        if(string.indexOf('y') === string.length - 1) return string.slice(0, -1) + 'ies';
        return string + 's';
    },

    cast : function(string) {
        switch (typeof string) {
            case 'string':
                string = String(string.split("\n"));
                break;
            case 'object':
                string = [JSON.stringify(string)];
                break;
            case 'undefined':
                string = null;
                break;
            default:
                string = [String(string)];
                break;
        }

        return string;
    }
};