(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Abstract = require('./abstract');

/** the main application class have to extend the application class. */

var AbstractApplication = function (_Abstract) {
    _inherits(AbstractApplication, _Abstract);

    function AbstractApplication() {
        _classCallCheck(this, AbstractApplication);

        return _possibleConstructorReturn(this, (AbstractApplication.__proto__ || Object.getPrototypeOf(AbstractApplication)).call(this));
    }

    return AbstractApplication;
}(Abstract);

module.exports = AbstractApplication;

},{"./abstract":2}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Kernel = require('./kernel');

/** all classes extends the abstract class.
 * @abstract
 */

var Abstract = function () {
    function Abstract() {
        _classCallCheck(this, Abstract);
    }

    /**
     * the application kernel
     * @returns {Kernel}
     */


    _createClass(Abstract, [{
        key: 'kernel',
        get: function get() {
            return require('./kernel');
        }

        /**
         * all registered components
         */

    }, {
        key: 'services',
        get: function get() {
            return this.kernel.services;
        }
    }, {
        key: 'config',
        get: function get() {
            return this.kernel.config;
        }
    }]);

    return Abstract;
}();

module.exports = Abstract;

},{"./kernel":3}],3:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Services = require('./services');

var Kernel = function () {
    function Kernel() {
        _classCallCheck(this, Kernel);

        this._config = null;
        this._services = new Services();
        this._initialized = false;
    }

    _createClass(Kernel, [{
        key: 'init',
        value: function init(config) {

            this._config = config;

            if ('object' !== _typeof(this._config.services)) throw new Error('config have no modules configuration');

            for (var key in this._config.services) {

                var configuration = this._config.services[key];

                if (!configuration.active) continue;

                this._services[key] = new configuration.module(configuration.options);
            }

            this._initialized = true;

            //this.services.logger.debug('all services are initialized');
        }
    }, {
        key: 'config',
        get: function get() {
            return this._config;
        }
    }, {
        key: 'services',
        get: function get() {

            if (!this._initialized) throw new Error('kernel not initialized, please call kernel.init');

            return this._services;
        }
    }]);

    return Kernel;
}();

module.exports = new Kernel();

},{"./services":4}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Services = function () {
    function Services() {
        _classCallCheck(this, Services);

        return new Proxy(this, this);
    }

    _createClass(Services, [{
        key: 'set',
        value: function set(target, serviceKey, instance, reciever) {
            if ('undefined' !== typeof this['_' + serviceKey]) throw new Error('service ' + serviceKey + ' already exists');
            this['_' + serviceKey] = instance;
            return true;
        }
    }, {
        key: 'get',
        value: function get(target, serviceKey) {
            if ('undefined' === typeof this['_' + serviceKey]) throw new Error('service ' + serviceKey + ' not exists, please check your config.js');
            return this['_' + serviceKey];
        }
    }]);

    return Services;
}();

module.exports = Services;

},{}],5:[function(require,module,exports){
'use strict';

module.exports = {
    services: {
        logger: {
            active: false,
            //module : require('@jeneric/logger'),
            options: {
                directory: 'var/logs/',
                consoleLevels: ['debug', 'info', 'error']
            }
        },
        custom: {
            active: true,
            module: require('../service/custom'),
            options: {
                test: true
            }
        }
    }
};

},{"../service/custom":6}],6:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Abstract = require('../../../abstract');

var Custom = function (_Abstract) {
    _inherits(Custom, _Abstract);

    function Custom(options) {
        _classCallCheck(this, Custom);

        var _this = _possibleConstructorReturn(this, (Custom.__proto__ || Object.getPrototypeOf(Custom)).call(this));

        console.log(options);
        return _this;
    }

    return Custom;
}(Abstract);

module.exports = Custom;

},{"../../../abstract":2}],7:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AbstractApplication = require('../abstract-application');

var Main = function (_AbstractApplication) {
    _inherits(Main, _AbstractApplication);

    function Main() {
        _classCallCheck(this, Main);

        var _this = _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).call(this));

        _this.kernel.init(require('./app/config/config'));

        console.log(_this.services.custom);
        console.log(_this.services.custom);
        console.log(_this.services.custom);

        return _this;
    }

    return Main;
}(AbstractApplication);

var main = new Main();

},{"../abstract-application":1,"./app/config/config":5}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhYnN0cmFjdC1hcHBsaWNhdGlvbi5qcyIsImFic3RyYWN0LmpzIiwia2VybmVsLmpzIiwic2VydmljZXMuanMiLCJ0ZXN0L2FwcC9jb25maWcvY29uZmlnLmpzIiwidGVzdC9hcHAvc2VydmljZS9jdXN0b20uanMiLCJ0ZXN0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQSxJQUFNLFdBQVcsUUFBUSxZQUFSLENBQWpCOztBQUVBOztJQUNNLG1COzs7QUFDRixtQ0FBYztBQUFBOztBQUFBO0FBRWI7OztFQUg2QixROztBQU1sQyxPQUFPLE9BQVAsR0FBaUIsbUJBQWpCOzs7Ozs7Ozs7QUNUQSxJQUFNLFNBQVMsUUFBUSxVQUFSLENBQWY7O0FBRUE7Ozs7SUFHTSxRO0FBRUYsd0JBQWM7QUFBQTtBQUViOztBQUVEOzs7Ozs7Ozs0QkFJYTtBQUNULG1CQUFPLFFBQVEsVUFBUixDQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs0QkFHZTtBQUNYLG1CQUFPLEtBQUssTUFBTCxDQUFZLFFBQW5CO0FBQ0g7Ozs0QkFFWTtBQUNULG1CQUFPLEtBQUssTUFBTCxDQUFZLE1BQW5CO0FBQ0g7Ozs7OztBQUlMLE9BQU8sT0FBUCxHQUFpQixRQUFqQjs7Ozs7Ozs7Ozs7QUNoQ0EsSUFBTSxXQUFXLFFBQVEsWUFBUixDQUFqQjs7SUFFTSxNO0FBRUYsc0JBQWM7QUFBQTs7QUFFVixhQUFLLE9BQUwsR0FBZSxJQUFmO0FBQ0EsYUFBSyxTQUFMLEdBQWlCLElBQUksUUFBSixFQUFqQjtBQUNBLGFBQUssWUFBTCxHQUFvQixLQUFwQjtBQUNIOzs7OzZCQUVJLE0sRUFBUTs7QUFFVCxpQkFBSyxPQUFMLEdBQWUsTUFBZjs7QUFFQSxnQkFBSSxxQkFBb0IsS0FBSyxPQUFMLENBQWEsUUFBakMsQ0FBSixFQUErQyxNQUFNLElBQUksS0FBSixDQUFVLHNDQUFWLENBQU47O0FBRS9DLGlCQUFJLElBQUksR0FBUixJQUFlLEtBQUssT0FBTCxDQUFhLFFBQTVCLEVBQXNDOztBQUVsQyxvQkFBSSxnQkFBZ0IsS0FBSyxPQUFMLENBQWEsUUFBYixDQUFzQixHQUF0QixDQUFwQjs7QUFFQSxvQkFBRyxDQUFDLGNBQWMsTUFBbEIsRUFBMEI7O0FBRTFCLHFCQUFLLFNBQUwsQ0FBZSxHQUFmLElBQXNCLElBQUksY0FBYyxNQUFsQixDQUF5QixjQUFjLE9BQXZDLENBQXRCO0FBRUg7O0FBRUQsaUJBQUssWUFBTCxHQUFvQixJQUFwQjs7QUFFQTtBQUNIOzs7NEJBRVk7QUFDVCxtQkFBTyxLQUFLLE9BQVo7QUFDSDs7OzRCQUVjOztBQUVYLGdCQUFHLENBQUMsS0FBSyxZQUFULEVBQXVCLE1BQU0sSUFBSSxLQUFKLENBQVUsaURBQVYsQ0FBTjs7QUFFdkIsbUJBQU8sS0FBSyxTQUFaO0FBQ0g7Ozs7OztBQUlMLE9BQU8sT0FBUCxHQUFpQixJQUFJLE1BQUosRUFBakI7Ozs7Ozs7OztJQzdDTSxRO0FBRUYsd0JBQWM7QUFBQTs7QUFDVixlQUFPLElBQUksS0FBSixDQUFVLElBQVYsRUFBZ0IsSUFBaEIsQ0FBUDtBQUNIOzs7OzRCQUVJLE0sRUFBUSxVLEVBQVksUSxFQUFVLFEsRUFBVTtBQUN6QyxnQkFBRyxnQkFBZ0IsT0FBTyxLQUFLLE1BQU0sVUFBWCxDQUExQixFQUFrRCxNQUFNLElBQUksS0FBSixjQUFxQixVQUFyQixxQkFBTjtBQUNsRCxpQkFBSyxNQUFNLFVBQVgsSUFBeUIsUUFBekI7QUFDQSxtQkFBTyxJQUFQO0FBQ0g7Ozs0QkFFSSxNLEVBQVEsVSxFQUFZO0FBQ3JCLGdCQUFHLGdCQUFnQixPQUFPLEtBQUssTUFBTSxVQUFYLENBQTFCLEVBQWtELE1BQU0sSUFBSSxLQUFKLGNBQXFCLFVBQXJCLDhDQUFOO0FBQ2xELG1CQUFPLEtBQUssTUFBTSxVQUFYLENBQVA7QUFDSDs7Ozs7O0FBR0wsT0FBTyxPQUFQLEdBQWlCLFFBQWpCOzs7OztBQ2xCQSxPQUFPLE9BQVAsR0FBaUI7QUFDYixjQUFVO0FBQ04sZ0JBQVM7QUFDTCxvQkFBUyxLQURKO0FBRUw7QUFDQSxxQkFBVTtBQUNOLDJCQUFZLFdBRE47QUFFTiwrQkFBZSxDQUNYLE9BRFcsRUFFWCxNQUZXLEVBR1gsT0FIVztBQUZUO0FBSEwsU0FESDtBQWFOLGdCQUFTO0FBQ0wsb0JBQVMsSUFESjtBQUVMLG9CQUFTLFFBQVEsbUJBQVIsQ0FGSjtBQUdMLHFCQUFVO0FBQ04sc0JBQU87QUFERDtBQUhMO0FBYkg7QUFERyxDQUFqQjs7Ozs7Ozs7Ozs7QUNBQSxJQUFNLFdBQVcsUUFBUSxtQkFBUixDQUFqQjs7SUFFTSxNOzs7QUFDRixvQkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQUE7O0FBR2pCLGdCQUFRLEdBQVIsQ0FBWSxPQUFaO0FBSGlCO0FBSXBCOzs7RUFMZ0IsUTs7QUFRckIsT0FBTyxPQUFQLEdBQWlCLE1BQWpCOzs7Ozs7Ozs7OztBQ1ZBLElBQU0sc0JBQXNCLFFBQVEseUJBQVIsQ0FBNUI7O0lBRU0sSTs7O0FBQ0Ysb0JBQWM7QUFBQTs7QUFBQTs7QUFJVixjQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLFFBQVEscUJBQVIsQ0FBakI7O0FBRUEsZ0JBQVEsR0FBUixDQUFZLE1BQUssUUFBTCxDQUFjLE1BQTFCO0FBQ0EsZ0JBQVEsR0FBUixDQUFZLE1BQUssUUFBTCxDQUFjLE1BQTFCO0FBQ0EsZ0JBQVEsR0FBUixDQUFZLE1BQUssUUFBTCxDQUFjLE1BQTFCOztBQVJVO0FBV2I7OztFQVpjLG1COztBQWVuQixJQUFJLE9BQU8sSUFBSSxJQUFKLEVBQVgiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgQWJzdHJhY3QgPSByZXF1aXJlKCcuL2Fic3RyYWN0Jyk7XG5cbi8qKiB0aGUgbWFpbiBhcHBsaWNhdGlvbiBjbGFzcyBoYXZlIHRvIGV4dGVuZCB0aGUgYXBwbGljYXRpb24gY2xhc3MuICovXG5jbGFzcyBBYnN0cmFjdEFwcGxpY2F0aW9uIGV4dGVuZHMgQWJzdHJhY3Qge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBYnN0cmFjdEFwcGxpY2F0aW9uOyIsImNvbnN0IEtlcm5lbCA9IHJlcXVpcmUoJy4va2VybmVsJyk7XG5cbi8qKiBhbGwgY2xhc3NlcyBleHRlbmRzIHRoZSBhYnN0cmFjdCBjbGFzcy5cbiAqIEBhYnN0cmFjdFxuICovXG5jbGFzcyBBYnN0cmFjdCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRoZSBhcHBsaWNhdGlvbiBrZXJuZWxcbiAgICAgKiBAcmV0dXJucyB7S2VybmVsfVxuICAgICAqL1xuICAgIGdldCBrZXJuZWwoKSB7XG4gICAgICAgIHJldHVybiByZXF1aXJlKCcuL2tlcm5lbCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFsbCByZWdpc3RlcmVkIGNvbXBvbmVudHNcbiAgICAgKi9cbiAgICBnZXQgc2VydmljZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmtlcm5lbC5zZXJ2aWNlcztcbiAgICB9XG5cbiAgICBnZXQgY29uZmlnKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5rZXJuZWwuY29uZmlnO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFic3RyYWN0OyIsImNvbnN0IFNlcnZpY2VzID0gcmVxdWlyZSgnLi9zZXJ2aWNlcycpO1xuXG5jbGFzcyBLZXJuZWwge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5fY29uZmlnID0gbnVsbDtcbiAgICAgICAgdGhpcy5fc2VydmljZXMgPSBuZXcgU2VydmljZXMoKTtcbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpbml0KGNvbmZpZykge1xuXG4gICAgICAgIHRoaXMuX2NvbmZpZyA9IGNvbmZpZztcblxuICAgICAgICBpZiAoJ29iamVjdCcgIT09IHR5cGVvZiB0aGlzLl9jb25maWcuc2VydmljZXMpIHRocm93IG5ldyBFcnJvcignY29uZmlnIGhhdmUgbm8gbW9kdWxlcyBjb25maWd1cmF0aW9uJyk7XG5cbiAgICAgICAgZm9yKGxldCBrZXkgaW4gdGhpcy5fY29uZmlnLnNlcnZpY2VzKSB7XG5cbiAgICAgICAgICAgIGxldCBjb25maWd1cmF0aW9uID0gdGhpcy5fY29uZmlnLnNlcnZpY2VzW2tleV07XG5cbiAgICAgICAgICAgIGlmKCFjb25maWd1cmF0aW9uLmFjdGl2ZSkgY29udGludWU7XG5cbiAgICAgICAgICAgIHRoaXMuX3NlcnZpY2VzW2tleV0gPSBuZXcgY29uZmlndXJhdGlvbi5tb2R1bGUoY29uZmlndXJhdGlvbi5vcHRpb25zKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZWQgPSB0cnVlO1xuXG4gICAgICAgIC8vdGhpcy5zZXJ2aWNlcy5sb2dnZXIuZGVidWcoJ2FsbCBzZXJ2aWNlcyBhcmUgaW5pdGlhbGl6ZWQnKTtcbiAgICB9XG5cbiAgICBnZXQgY29uZmlnKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlnO1xuICAgIH1cblxuICAgIGdldCBzZXJ2aWNlcygpIHtcblxuICAgICAgICBpZighdGhpcy5faW5pdGlhbGl6ZWQpIHRocm93IG5ldyBFcnJvcigna2VybmVsIG5vdCBpbml0aWFsaXplZCwgcGxlYXNlIGNhbGwga2VybmVsLmluaXQnKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fc2VydmljZXM7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IEtlcm5lbCgpOyIsImNsYXNzIFNlcnZpY2VzIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHRoaXMsIHRoaXMpO1xuICAgIH1cblxuICAgIHNldCAodGFyZ2V0LCBzZXJ2aWNlS2V5LCBpbnN0YW5jZSwgcmVjaWV2ZXIpIHtcbiAgICAgICAgaWYoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiB0aGlzWydfJyArIHNlcnZpY2VLZXldKSB0aHJvdyBuZXcgRXJyb3IoYHNlcnZpY2UgJHtzZXJ2aWNlS2V5fSBhbHJlYWR5IGV4aXN0c2ApO1xuICAgICAgICB0aGlzWydfJyArIHNlcnZpY2VLZXldID0gaW5zdGFuY2U7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGdldCAodGFyZ2V0LCBzZXJ2aWNlS2V5KSB7XG4gICAgICAgIGlmKCd1bmRlZmluZWQnID09PSB0eXBlb2YgdGhpc1snXycgKyBzZXJ2aWNlS2V5XSkgdGhyb3cgbmV3IEVycm9yKGBzZXJ2aWNlICR7c2VydmljZUtleX0gbm90IGV4aXN0cywgcGxlYXNlIGNoZWNrIHlvdXIgY29uZmlnLmpzYCk7XG4gICAgICAgIHJldHVybiB0aGlzWydfJyArIHNlcnZpY2VLZXldO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXJ2aWNlczsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBzZXJ2aWNlczoge1xuICAgICAgICBsb2dnZXIgOiB7XG4gICAgICAgICAgICBhY3RpdmUgOiBmYWxzZSxcbiAgICAgICAgICAgIC8vbW9kdWxlIDogcmVxdWlyZSgnQGplbmVyaWMvbG9nZ2VyJyksXG4gICAgICAgICAgICBvcHRpb25zIDoge1xuICAgICAgICAgICAgICAgIGRpcmVjdG9yeSA6ICd2YXIvbG9ncy8nLFxuICAgICAgICAgICAgICAgIGNvbnNvbGVMZXZlbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgJ2RlYnVnJyxcbiAgICAgICAgICAgICAgICAgICAgJ2luZm8nLFxuICAgICAgICAgICAgICAgICAgICAnZXJyb3InXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjdXN0b20gOiB7XG4gICAgICAgICAgICBhY3RpdmUgOiB0cnVlLFxuICAgICAgICAgICAgbW9kdWxlIDogcmVxdWlyZSgnLi4vc2VydmljZS9jdXN0b20nKSxcbiAgICAgICAgICAgIG9wdGlvbnMgOiB7XG4gICAgICAgICAgICAgICAgdGVzdCA6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07IiwiY29uc3QgQWJzdHJhY3QgPSByZXF1aXJlKCcuLi8uLi8uLi9hYnN0cmFjdCcpO1xuXG5jbGFzcyBDdXN0b20gZXh0ZW5kcyBBYnN0cmFjdCB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKG9wdGlvbnMpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDdXN0b207IiwiY29uc3QgQWJzdHJhY3RBcHBsaWNhdGlvbiA9IHJlcXVpcmUoJy4uL2Fic3RyYWN0LWFwcGxpY2F0aW9uJyk7XG5cbmNsYXNzIE1haW4gZXh0ZW5kcyBBYnN0cmFjdEFwcGxpY2F0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMua2VybmVsLmluaXQocmVxdWlyZSgnLi9hcHAvY29uZmlnL2NvbmZpZycpKTtcblxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnNlcnZpY2VzLmN1c3RvbSk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc2VydmljZXMuY3VzdG9tKTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5zZXJ2aWNlcy5jdXN0b20pO1xuXG5cbiAgICB9XG59XG5cbmxldCBtYWluID0gbmV3IE1haW4oKTsiXX0=
