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
                    try {
                        string = JSON.stringify(string);
                    } catch(err) {
                        string = String(string);
                    }
                }
                break;
            case 'undefined':
                string = '';
                break;
            default:
                string = String(string);
                break;
        }

        return string;
    }
};