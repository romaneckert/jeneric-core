module.exports = {
    toMany : function(string) {
        if(string.indexOf('y') === string.length - 1) return string.slice(0, -1) + 'ies';
        return string + 's';
    },

    cast : function(string) {

        switch (typeof string) {
            case 'object':
                if(string === null) {
                    string = '';
                } else {
                    string = JSON.stringify(string);
                }
                break;
            case 'undefined':
                string = null;
                break;
            default:
                string = String(string);
                break;
        }

        return string;
    }
};