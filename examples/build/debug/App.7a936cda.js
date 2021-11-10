// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../node_modules/@spfxappdev/utility/lib/functions/arrayFrom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = arrayFrom;

/**
 * this functions calls Array.from() or make the same logic if not Exists.
 * The Array.from() method creates a new, shallow-copied Array instance from an array-like or iterable object.
 * @param arrLike An array-like or iterable object to convert to an array.
 * @param mapFunc (optional) Map function to call on every element of the array.
 * @param thisArgs (optional) Value to use as this when executing mapFn.
 */

/* tslint:disable */
function arrayFrom(arrLike, mapFunc, thisArgs) {
  if (!Array["from"]) {
    Array["from"] = function () {
      var toStr = Object.prototype.toString;

      var isCallable = function (fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
      };

      var toInteger = function (value) {
        var numberVal = Number(value);

        if (isNaN(numberVal)) {
          return 0;
        }

        if (numberVal === 0 || !isFinite(numberVal)) {
          return numberVal;
        }

        return (numberVal > 0 ? 1 : -1) * Math.floor(Math.abs(numberVal));
      };

      var maxSafeInteger = Math.pow(2, 53) - 1;

      var toLength = function (value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      };

      return function from(arrayLike) {
        var C = this;
        var items = Object(arrayLike);

        if (arrayLike == null) {
          throw new TypeError('Array.from requires an array-like object - not null or undefined');
        }

        var mapFn;
        var args = arguments;

        if (args.length > 1) {
          mapFn = args[1];
        }

        var T;

        if (typeof mapFn !== 'undefined') {
          if (!isCallable(mapFn)) {
            throw new TypeError('Array.from: when provided, the second argument must be a function');
          }

          if (args.length > 2) {
            T = args[2];
          }
        }

        var len = toLength(items.length);
        var A = isCallable(C) ? Object(new C(len)) : new Array(len); // 16. Let k be 0.

        var k = 0; // 17. Repeat, while k < len… (also steps a - h)

        var kValue;

        while (k < len) {
          kValue = items[k];

          if (mapFn) {
            A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }

          k += 1;
        } // 18. Let putStatus be Put(A, "length", len, true).


        A.length = len; // 20. Return A.

        return A;
      };
    };
  }

  return Array["from"](arrLike, mapFunc, thisArgs);
}
},{}],"../../node_modules/@spfxappdev/utility/lib/functions/isset.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isset;

/**
 * Determines if the provided Property is set.
 * @param {any} property The Property to checked.
 * @returns {boolean} If the Property is set <c>true</c> otherwise <c>false</c>.
 */
function isset(property) {
  return typeof property !== 'undefined' && property != null;
}
},{}],"../../node_modules/@spfxappdev/utility/lib/functions/isNullOrEmpty.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isNullOrEmpty;

var _isset = _interopRequireDefault(require("./isset"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Determines if the provided Property is Null or Empty (or whitespace if string-value).
 * @param {any} property The Property to checked.
 * @returns {boolean} If the Property is Null or Empty or has
 * not "length" as property <c>true</c> otherwise <c>false</c>.
 */
function isNullOrEmpty(property) {
  if (!(0, _isset.default)(property)) {
    return true;
  }

  if (typeof property === 'string') {
    return property.trim().length < 1;
  }

  if (!property.hasOwnProperty('length')) {
    return false;
  }

  return property.length < 1;
}
},{"./isset":"../../node_modules/@spfxappdev/utility/lib/functions/isset.js"}],"../../node_modules/@spfxappdev/utility/lib/functions/cssClasses.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cssClasses;

var _isset = _interopRequireDefault(require("./isset"));

var _isNullOrEmpty = _interopRequireDefault(require("./isNullOrEmpty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A utility function for conditionally joining classNames together.
 * @example cssClasses('spfx-app-dev', 'theme'); // => 'spfx-app-dev theme'
 * @example cssClasses('spfx-app-dev', { theme: false });  // => 'spfx-app-dev'
 * @example cssClasses({ 'spfx-app-dev': true });  // => 'spfx-app-dev'
 * @example cssClasses({ 'spfx-app-dev': false });  // => ''
 * @example cssClasses({ spfx-app-dev: true }, { theme: true }); // => 'spfx-app-dev theme'
 * @example cssClasses({ spfx-app-dev: true, theme: true });  // => 'spfx-app-dev theme'
 * @example cssClasses('spfx-app-dev', { theme: true, active: false }, 'item');  // => 'spfx-app-dev theme item'
 * @example cssClasses(null, false, 'spfx-app-dev', undefined, 0, 1, { theme: null }, '');  // => 'spfx-app-dev'
 * @example const arr = ['theme', { active: true, item: false }]; cssClasses('spfx-app-dev', arr);  // => 'spfx-app-dev theme active'
 */
function cssClasses() {
  var args = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }

  var classes = [];
  var self = cssClasses;

  for (var i = 0; i < args.length; i++) {
    var arg = args[i];

    if (!(0, _isset.default)(arg)) {
      continue;
    }

    var argType = typeof arg;

    if (argType === 'string') {
      classes.push(arg);
      continue;
    }

    if (Array.isArray(arg) && arg.length > 0) {
      var classNamesFromArray = self.apply(null, arg);

      if ((0, _isset.default)(classNamesFromArray) && !(0, _isNullOrEmpty.default)(classNamesFromArray)) {
        classes.push(classNamesFromArray);
      }

      continue;
    }

    if (argType === 'object') {
      if (arg.toString !== Object.prototype.toString) {
        classes.push(arg.toString());
        continue;
      }

      for (var className in arg) {
        if (arg.hasOwnProperty(className) && arg[className]) {
          classes.push(className);
        }
      }
    }
  }

  return classes.join(' ');
}
},{"./isset":"../../node_modules/@spfxappdev/utility/lib/functions/isset.js","./isNullOrEmpty":"../../node_modules/@spfxappdev/utility/lib/functions/isNullOrEmpty.js"}],"../../node_modules/@spfxappdev/utility/lib/functions/extend.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extend;

var _isNullOrEmpty = _interopRequireDefault(require("./isNullOrEmpty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

/**
 * Deep merge two objects.
 * @param target An object that will receive the new properties if additional objects are passed in.
 * @param sources An object containing additional properties to merge in.
 * @param inCaseOfArrayUseSourceObject if true, then the array from source object will
 * be use if target-value and source-value are arrays. Otherwise both arrays will be merged
 */
function extend(target, source, inCaseOfArrayUseSourceObject) {
  if (inCaseOfArrayUseSourceObject === void 0) {
    inCaseOfArrayUseSourceObject = true;
  }

  if (Array.isArray(target) && Array.isArray(source)) {
    if (inCaseOfArrayUseSourceObject) {
      return source;
    }

    return (0, _isNullOrEmpty.default)(new Set(target.concat(source)));
  } // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties


  for (var _i = 0, _a = Object.keys(source); _i < _a.length; _i++) {
    var key = _a[_i];

    if (Array.isArray(source[key])) {
      var targetValue = target[key] || [];
      source[key] = extend(targetValue, source[key], inCaseOfArrayUseSourceObject);
    } else if (source[key] instanceof Object) {
      var targetValue = target[key] || {};
      source[key] = extend(targetValue, source[key], inCaseOfArrayUseSourceObject);
    }
  } // Join `target` and modified `source`


  target = target || {};

  var tempTarget = __assign(__assign({}, target), source);

  return tempTarget;
}
},{"./isNullOrEmpty":"../../node_modules/@spfxappdev/utility/lib/functions/isNullOrEmpty.js"}],"../../node_modules/@spfxappdev/utility/lib/functions/getDeepOrDefault.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDeepOrDefault;

var _isset = _interopRequireDefault(require("./isset"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets an nested property from an specific object or default, if not isset.
 * @param {any} objectToCheck The Property to checked.
 * @param {string} keyNameSpace The Key-Namespace of the Property (for example: "My.Nested.Property").
 * @param {any} defaultValue The defaultValue if property not exist.
 * @returns {any} If the Property is set, than the requested property otherwise defaultValue.
 */
function getDeepOrDefault(objectToCheck, keyNameSpace, defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = null;
  }

  if (!(0, _isset.default)(objectToCheck)) {
    return defaultValue;
  }

  var namespaceKeys = keyNameSpace.split('.');
  var currentObjectPath = objectToCheck;

  for (var i = 0; i < namespaceKeys.length; i++) {
    var currentKey = namespaceKeys[i];

    if (!(0, _isset.default)(currentObjectPath)) {
      return defaultValue;
    }

    currentObjectPath = currentObjectPath[currentKey];
  }

  return currentObjectPath;
}
},{"./isset":"../../node_modules/@spfxappdev/utility/lib/functions/isset.js"}],"../../node_modules/@spfxappdev/utility/lib/functions/getUrlParameter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getUrlParameter;

var _isNullOrEmpty = _interopRequireDefault(require("./isNullOrEmpty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get's the Value of a specific Url-Parameter.
 * @param {string} parameterName The Name of the searched Parameter.
 * @param {string} url The Url which the Parameter-Value is read from (if not set the current Url is used).
 * @returns {string|null} If the Parameter exists on the Url the Value is returned as a string.
 */
function getUrlParameter(parameterName, url) {
  if (url === void 0) {
    url = null;
  }

  if ((0, _isNullOrEmpty.default)(url)) {
    url = window.location.href;
  }

  url = url.toLowerCase();
  var name = parameterName.toLowerCase();
  name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
  var regexS = '[\\?&]' + name + '=([^&#]*)';
  var regex = new RegExp(regexS);
  var results = regex.exec(url);

  if (results == null) {
    return null;
  }

  return results[1];
}
},{"./isNullOrEmpty":"../../node_modules/@spfxappdev/utility/lib/functions/isNullOrEmpty.js"}],"../../node_modules/@spfxappdev/utility/lib/functions/isFunction.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isFunction;

var _isset = _interopRequireDefault(require("./isset"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Determines wheter the Property is a Function.
 * @param {any} property The Property to be determined.
 * @returns {boolean} Wheter the Property is a Function.
 */
function isFunction(property) {
  return (0, _isset.default)(property) && typeof property === 'function';
}
},{"./isset":"../../node_modules/@spfxappdev/utility/lib/functions/isset.js"}],"../../node_modules/@spfxappdev/utility/lib/functions/issetDeep.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = issetDeep;

var _isset = _interopRequireDefault(require("./isset"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Determines if the provided Property is set deep/nested.
 * @param {any} objectToCheck The Property to checked.
 * @param {string} keyNameSpace The Key-Namespace of the Property (for example: "My.Nested.Property").
 * @returns {boolean} If the Property is set <c>true</c> otherwise <c>false</c>.
 */
function issetDeep(objectToCheck, keyNameSpace) {
  if (!(0, _isset.default)(objectToCheck)) {
    return false;
  }

  var namespaceKeys = keyNameSpace.split('.');
  var currentObjectPath = objectToCheck;

  for (var i = 0; i < namespaceKeys.length; i++) {
    var currentKey = namespaceKeys[i];

    if (!(0, _isset.default)(currentObjectPath)) {
      return false;
    }

    currentObjectPath = currentObjectPath[currentKey];
  }

  return (0, _isset.default)(currentObjectPath);
}
},{"./isset":"../../node_modules/@spfxappdev/utility/lib/functions/isset.js"}],"../../node_modules/@spfxappdev/utility/lib/functions/toBoolean.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toBoolean;

var _isset = _interopRequireDefault(require("./isset"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Converts a value to a Boolean.
 * @param {any} value The Value to be converted to a Boolean.
 * @returns {boolean} If the Value is convertable to a Boolean it
 * is returned as a Boolean otherwise <c>false</c> is returned.
 */
function toBoolean(value) {
  if (!(0, _isset.default)(value)) {
    return false;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    value = value.toLowerCase();
  }

  if (value !== 'false' && value !== 'true' && value !== '0' && value !== '1' && value !== 0 && value !== 1) {
    return false;
  }

  return value === 'false' || value === '0' || value === 0 ? false : true;
}
},{"./isset":"../../node_modules/@spfxappdev/utility/lib/functions/isset.js"}],"../../node_modules/@spfxappdev/utility/lib/functions/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "arrayFrom", {
  enumerable: true,
  get: function () {
    return _arrayFrom.default;
  }
});
Object.defineProperty(exports, "cssClasses", {
  enumerable: true,
  get: function () {
    return _cssClasses.default;
  }
});
Object.defineProperty(exports, "extend", {
  enumerable: true,
  get: function () {
    return _extend.default;
  }
});
Object.defineProperty(exports, "getDeepOrDefault", {
  enumerable: true,
  get: function () {
    return _getDeepOrDefault.default;
  }
});
Object.defineProperty(exports, "getUrlParameter", {
  enumerable: true,
  get: function () {
    return _getUrlParameter.default;
  }
});
Object.defineProperty(exports, "isFunction", {
  enumerable: true,
  get: function () {
    return _isFunction.default;
  }
});
Object.defineProperty(exports, "isNullOrEmpty", {
  enumerable: true,
  get: function () {
    return _isNullOrEmpty.default;
  }
});
Object.defineProperty(exports, "isset", {
  enumerable: true,
  get: function () {
    return _isset.default;
  }
});
Object.defineProperty(exports, "issetDeep", {
  enumerable: true,
  get: function () {
    return _issetDeep.default;
  }
});
Object.defineProperty(exports, "toBoolean", {
  enumerable: true,
  get: function () {
    return _toBoolean.default;
  }
});

var _arrayFrom = _interopRequireDefault(require("./arrayFrom"));

var _cssClasses = _interopRequireDefault(require("./cssClasses"));

var _extend = _interopRequireDefault(require("./extend"));

var _getDeepOrDefault = _interopRequireDefault(require("./getDeepOrDefault"));

var _getUrlParameter = _interopRequireDefault(require("./getUrlParameter"));

var _isFunction = _interopRequireDefault(require("./isFunction"));

var _isNullOrEmpty = _interopRequireDefault(require("./isNullOrEmpty"));

var _isset = _interopRequireDefault(require("./isset"));

var _issetDeep = _interopRequireDefault(require("./issetDeep"));

var _toBoolean = _interopRequireDefault(require("./toBoolean"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./arrayFrom":"../../node_modules/@spfxappdev/utility/lib/functions/arrayFrom.js","./cssClasses":"../../node_modules/@spfxappdev/utility/lib/functions/cssClasses.js","./extend":"../../node_modules/@spfxappdev/utility/lib/functions/extend.js","./getDeepOrDefault":"../../node_modules/@spfxappdev/utility/lib/functions/getDeepOrDefault.js","./getUrlParameter":"../../node_modules/@spfxappdev/utility/lib/functions/getUrlParameter.js","./isFunction":"../../node_modules/@spfxappdev/utility/lib/functions/isFunction.js","./isNullOrEmpty":"../../node_modules/@spfxappdev/utility/lib/functions/isNullOrEmpty.js","./isset":"../../node_modules/@spfxappdev/utility/lib/functions/isset.js","./issetDeep":"../../node_modules/@spfxappdev/utility/lib/functions/issetDeep.js","./toBoolean":"../../node_modules/@spfxappdev/utility/lib/functions/toBoolean.js"}],"../../node_modules/@spfxappdev/utility/lib/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _functions = require("./functions");

Object.keys(_functions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _functions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _functions[key];
    }
  });
});
},{"./functions":"../../node_modules/@spfxappdev/utility/lib/functions/index.js"}],"../../node_modules/@spfxappdev/logger/lib/logger/Logger.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Logger = exports.LogType = exports.LogLevel = void 0;

var _utility = require("@spfxappdev/utility");

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __spreadArray = void 0 && (void 0).__spreadArray || function (to, from) {
  for (var i = 0, il = from.length, j = to.length; i < il; i++, j++) to[j] = from[i];

  return to;
};

var LogLevel;
exports.LogLevel = LogLevel;

(function (LogLevel) {
  LogLevel[LogLevel["None"] = 0] = "None";
  LogLevel[LogLevel["Log"] = 1] = "Log";
  LogLevel[LogLevel["Info"] = 2] = "Info";
  LogLevel[LogLevel["Warning"] = 4] = "Warning";
  LogLevel[LogLevel["Error"] = 8] = "Error";
  LogLevel[LogLevel["Table"] = 16] = "Table";
  LogLevel[LogLevel["All"] = 31] = "All";
})(LogLevel || (exports.LogLevel = LogLevel = {}));

;
var DefaultLoggerSettings = {
  LogNamespaceUrlParameterName: 'LogOnly',
  LoggingEnabledUrlParameterName: 'EnableConsoleLogging',
  LogLevel: LogLevel.All
};
var LogType;
exports.LogType = LogType;

(function (LogType) {
  LogType[LogType["Warning"] = 0] = "Warning";
  LogType[LogType["Info"] = 1] = "Info";
  LogType[LogType["Error"] = 2] = "Error";
  LogType[LogType["Table"] = 3] = "Table";
  LogType[LogType["Log"] = 4] = "Log";
})(LogType || (exports.LogType = LogType = {}));

var Logger =
/** @class */
function () {
  function Logger(logNamespace, settings) {
    if (settings === void 0) {
      settings = null;
    }

    this.logNamespace = logNamespace;
    this.settings = settings;
    this._loggingEnabledByUrl = undefined;
    this._namespacesToLog = undefined;

    if (!(0, _utility.isset)(settings)) {
      settings = __assign({}, Logger.DefaultSettings);
    }

    this.settings = __assign(__assign(__assign({}, DefaultLoggerSettings), Logger.DefaultSettings), settings);
  }

  Object.defineProperty(Logger.prototype, "isLoggingEnabledByUrl", {
    get: function () {
      // URL Parameter already checked, return value from Parameter
      if ((0, _utility.isset)(this._loggingEnabledByUrl)) {
        return this._loggingEnabledByUrl;
      } // URL Parameter is not checked. Check and set Parameter


      var isEnabledValue = (0, _utility.getUrlParameter)(this.settings.LoggingEnabledUrlParameterName);

      if (!(0, _utility.isset)(isEnabledValue)) {
        this._loggingEnabledByUrl = false;
        return this._loggingEnabledByUrl;
      }

      this._loggingEnabledByUrl = (0, _utility.toBoolean)(isEnabledValue);
      return this._loggingEnabledByUrl;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Logger.prototype, "isLoggingEnabledBySettings", {
    get: function () {
      return !(LogLevel.None == (this.settings.LogLevel | LogLevel.None));
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Logger.prototype, "namespacesToLogFromUrl", {
    get: function () {
      if ((0, _utility.isset)(this._namespacesToLog)) {
        return this._namespacesToLog;
      }

      var modules = (0, _utility.getUrlParameter)(this.settings.LogNamespaceUrlParameterName);

      if ((0, _utility.isNullOrEmpty)(modules)) {
        this._namespacesToLog = [];
        return this._namespacesToLog;
      }

      this._namespacesToLog = modules.toLowerCase().split(',');
      return this._namespacesToLog;
    },
    enumerable: false,
    configurable: true
  });

  Logger.prototype.getCurrentSettings = function () {
    return __assign({}, this.settings);
  };

  Logger.prototype.logToConsole = function (logType) {
    var _this = this;

    var data = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      data[_i - 1] = arguments[_i];
    }

    if (!(0, _utility.isset)(console)) {
      return;
    }

    if (!this.isLoggingEnabledBySettings && !this.isLoggingEnabledByUrl) {
      return;
    } //If namespaces are filtered by URL and the current namespace is NOT one of it


    if (!(0, _utility.isNullOrEmpty)(this.namespacesToLogFromUrl) && this.namespacesToLogFromUrl.indexOf(this.logNamespace.toLowerCase()) < 0) {
      return;
    }

    var valuesToLog = __spreadArray(__spreadArray([], data), [this.logNamespace]);

    var logEnabled = this.isLoggingEnabledByUrl;
    var currentLogLevel = this.settings.LogLevel;

    switch (logType) {
      case LogType.Warning:
        if (logEnabled || LogLevel.Warning == (currentLogLevel & LogLevel.Warning)) {
          console.warn.apply(console, valuesToLog);
        }

        break;

      case LogType.Info:
        if (logEnabled || LogLevel.Info == (currentLogLevel & LogLevel.Info)) {
          /* tslint:disable:no-console */
          console.info.apply(console, valuesToLog);
        }

        break;

      case LogType.Error:
        if (logEnabled || LogLevel.Info == (currentLogLevel & LogLevel.Info)) {
          console.error.apply(console, valuesToLog);
        }

        break;

      case LogType.Table:
        if (!(logEnabled || LogLevel.Table == (currentLogLevel & LogLevel.Table))) {
          break;
        }

        if (typeof console.table !== 'function') {
          /* tslint:disable:no-console */
          console.info('Your browser does not support console.table, console.log was used instead', this.logNamespace);
          console.log.apply(console, valuesToLog);
          break;
        }

        data.forEach(function (d) {
          var valueType = typeof d;

          if (valueType !== 'array' && valueType !== 'object') {
            /* tslint:disable:no-console */
            console.info('It is not possible to log table if logValue is not an array or object, console.log was used instead', _this.logNamespace);
            console.log(d, _this.logNamespace);
            return;
          }

          console.table(d, [_this.logNamespace]);
        });
        break;

      case LogType.Log:
      default:
        if (logEnabled || LogLevel.Log == (currentLogLevel & LogLevel.Log)) {
          console.log.apply(console, valuesToLog);
        }

        break;
    }
  };

  Logger.prototype.log = function () {
    var data = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      data[_i] = arguments[_i];
    }

    this.logToConsole.apply(this, __spreadArray([LogType.Log], data));
  };

  Logger.prototype.warn = function () {
    var data = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      data[_i] = arguments[_i];
    }

    this.logToConsole.apply(this, __spreadArray([LogType.Warning], data));
  };

  Logger.prototype.info = function () {
    var data = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      data[_i] = arguments[_i];
    }

    this.logToConsole.apply(this, __spreadArray([LogType.Info], data));
  };

  Logger.prototype.error = function () {
    var data = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      data[_i] = arguments[_i];
    }

    this.logToConsole.apply(this, __spreadArray([LogType.Error], data));
  };

  Logger.prototype.table = function () {
    var data = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      data[_i] = arguments[_i];
    }

    this.logToConsole.apply(this, __spreadArray([LogType.Table], data));
  };

  Logger.Log = function (logNamespace, logType) {
    var data = [];

    for (var _i = 2; _i < arguments.length; _i++) {
      data[_i - 2] = arguments[_i];
    }

    var logger = new Logger(logNamespace);

    switch (logType) {
      case LogType.Error:
        logger.error.apply(logger, data);
        break;

      case LogType.Info:
        logger.info.apply(logger, data);
        break;

      case LogType.Table:
        logger.table.apply(logger, data);
        break;

      case LogType.Warning:
        logger.warn.apply(logger, data);
        break;

      case LogType.Log:
      default:
        logger.log.apply(logger, data);
        break;
    }
  };

  Logger.DefaultSettings = DefaultLoggerSettings;
  return Logger;
}();

exports.Logger = Logger;
},{"@spfxappdev/utility":"../../node_modules/@spfxappdev/utility/lib/index.js"}],"../../node_modules/@spfxappdev/logger/lib/logger/ClassLoggerBase.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClassLoggerBase = void 0;

var _Logger = require("./Logger");

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __spreadArray = void 0 && (void 0).__spreadArray || function (to, from) {
  for (var i = 0, il = from.length, j = to.length; i < il; i++, j++) to[j] = from[i];

  return to;
};

/**
* A Base Class for Console Logger
* For Intellisense with the @classLogger(), use this:
* @example export interface MyClass extends ClassLoggerBase {}; export class MyClass;
*/
var ClassLoggerBase =
/** @class */
function () {
  function ClassLoggerBase() {
    this.assignLogger();
  }

  ClassLoggerBase.prototype.log = function (logType) {
    var _a;

    var data = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      data[_i - 1] = arguments[_i];
    }

    (_a = this.logger).logToConsole.apply(_a, __spreadArray([logType], data));
  };

  ClassLoggerBase.prototype.getLogCategory = function () {
    return 'SPFxAppDev Logger BASE';
  };

  ClassLoggerBase.prototype.getLogSettings = function () {
    return __assign({}, _Logger.Logger.DefaultSettings);
  };

  ClassLoggerBase.prototype.assignLogger = function () {
    if (!this.logger) {
      var loggingSettings = this.getLogSettings();
      this.logger = new _Logger.Logger(this.getLogCategory(), loggingSettings);
    }

    return this.logger;
  };

  return ClassLoggerBase;
}();

exports.ClassLoggerBase = ClassLoggerBase;
},{"./Logger":"../../node_modules/@spfxappdev/logger/lib/logger/Logger.js"}],"../../node_modules/@spfxappdev/logger/lib/logger/decorators/decorators.utility.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logFunc = exports.getLogSettings = exports.getLogCategoryOrCustom = void 0;

var _Logger = require("../Logger");

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __spreadArray = void 0 && (void 0).__spreadArray || function (to, from) {
  for (var i = 0, il = from.length, j = to.length; i < il; i++, j++) to[j] = from[i];

  return to;
};

var logFunc = function (target, logLevel, loggingCategory, logType) {
  var logData = [];

  for (var _i = 4; _i < arguments.length; _i++) {
    logData[_i - 4] = arguments[_i];
  }

  var containsLogger = typeof target['logger'] === 'object'; // && (target as any).getLogger() instanceof Logger;

  var loggingSettings = containsLogger ? target.logger.getCurrentSettings() : __assign({}, _Logger.Logger.DefaultSettings);
  loggingSettings.LogLevel = logLevel;
  var logger = new _Logger.Logger(loggingCategory, loggingSettings);
  logger.logToConsole.apply(logger, __spreadArray([logType], logData));
};

exports.logFunc = logFunc;

var getLogCategoryOrCustom = function (target, customLogCategory, fallbackValue) {
  if (customLogCategory === void 0) {
    customLogCategory = null;
  }

  if (fallbackValue === void 0) {
    fallbackValue = '';
  }

  var loggingCategory = '';

  if (typeof customLogCategory === 'string') {
    loggingCategory = customLogCategory;
  } else {
    var containsLoggingCategory = typeof target['getLogCategory'] === 'function' && typeof target.getLogCategory() === 'string'; // console.log("SSC", typeof target['getLogCategory'], (" loggingCategory: " +loggingCategory.slice(0) ), (" customLogCategory: " + customLogCategory));

    loggingCategory = containsLoggingCategory ? target.getLogCategory() : fallbackValue;
  }

  return loggingCategory;
};

exports.getLogCategoryOrCustom = getLogCategoryOrCustom;

var getLogSettings = function () {
  return _Logger.Logger.DefaultSettings;
};

exports.getLogSettings = getLogSettings;
},{"../Logger":"../../node_modules/@spfxappdev/logger/lib/logger/Logger.js"}],"../../node_modules/@spfxappdev/logger/lib/logger/decorators/class.decorators.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.classLogger = void 0;

var _Logger = require("../Logger");

var _decorators = require("./decorators.utility");

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __spreadArray = void 0 && (void 0).__spreadArray || function (to, from) {
  for (var i = 0, il = from.length, j = to.length; i < il; i++, j++) to[j] = from[i];

  return to;
};

var defaultOptions = {
  customLogCategory: null,
  logLevel: null,
  override: true
}; //TODO: Check for generic classes MyClass<T>...

/**
* A Class logger dexorator
* For Intellisense with the @classLogger(), use this:
* @example export interface MyClass extends LoggerBase {}; export class MyClass;
*/

var classLogger = function (options) {
  if (options === void 0) {
    options = null;
  }

  options = __assign(__assign({}, defaultOptions), options);

  var classLoggerFunc = function (Base) {
    // save a reference to the original constructor
    var original = Base;
    var fallbackName = original && original.name ? original.name : '';
    var enableConsoleLogging = options.logLevel ? options.logLevel : __assign({}, _Logger.Logger.DefaultSettings).LogLevel;
    var loggingCategory = (0, _decorators.getLogCategoryOrCustom)(original, options.customLogCategory, fallbackName);

    var getLogCategoryFunc = function () {
      return (0, _decorators.getLogCategoryOrCustom)(original, options.customLogCategory, fallbackName);
    };

    var logFunc = function (logType) {
      var logData = [];

      for (var _i = 1; _i < arguments.length; _i++) {
        logData[_i - 1] = arguments[_i];
      }

      _decorators.logFunc.apply(void 0, __spreadArray([original, enableConsoleLogging, loggingCategory, logType], logData));
    };

    var logSettingsFunc = function () {
      return (0, _decorators.getLogSettings)();
    };

    if (options.override) {
      original.prototype.getLogCategory = getLogCategoryFunc;
      original.prototype.log = logFunc;
      original.prototype.getLogSettings = logSettingsFunc;
    } else {
      original.prototype.getLogCategory = original.prototype.getLogCategory || getLogCategoryFunc;
      original.prototype.log = original.prototype.log || logFunc;
      original.prototype.getLogSettings = original.prototype.getLogSettings || logSettingsFunc;
    } // a utility function to generate instances of a class


    function construct(classConstructor, args) {
      var c = function () {
        return classConstructor.apply(this, args);
      };

      c.prototype = classConstructor.prototype;
      var instanceObj = new c();
      instanceObj.logger = new _Logger.Logger(instanceObj.getLogCategory(), instanceObj.getLogSettings());
      return instanceObj;
    } // the new constructor behaviour


    var f = function () {
      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      return construct(original, args);
    }; // copy prototype so intanceof operator still works


    f.prototype = original.prototype; // return new constructor (will override original)

    return f;
  };

  return classLoggerFunc;
};

exports.classLogger = classLogger;
},{"../Logger":"../../node_modules/@spfxappdev/logger/lib/logger/Logger.js","./decorators.utility":"../../node_modules/@spfxappdev/logger/lib/logger/decorators/decorators.utility.js"}],"../../node_modules/@spfxappdev/logger/lib/logger/decorators/method.decorators.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.methodLogger = void 0;

var _Logger = require("../Logger");

var _decorators = require("./decorators.utility");

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __spreadArray = void 0 && (void 0).__spreadArray || function (to, from) {
  for (var i = 0, il = from.length, j = to.length; i < il; i++, j++) to[j] = from[i];

  return to;
};

var defaultOptions = {
  customLogCategory: null,
  logLevel: null
};

var methodLogger = function (options) {
  if (options === void 0) {
    options = null;
  }

  options = __assign(__assign({}, defaultOptions), options);
  return function (target, propertyKey, descriptor) {
    var originalMethod = descriptor.value;

    descriptor.value = function () {
      var logLevel = options.logLevel;
      var loggingCategory = (0, _decorators.getLogCategoryOrCustom)(target, options.customLogCategory, propertyKey);
      var containsLogLevel = typeof logLevel !== 'undefined' && logLevel !== null;
      var targetContainsGetLogSettings = typeof target["getLogSettings"] == "function";

      if (!containsLogLevel && targetContainsGetLogSettings) {
        var settings = target["getLogSettings"]();

        if (settings && typeof settings["LogLevel"] == "number") {
          logLevel = settings["LogLevel"];
          containsLogLevel = true;
        }
      }

      logLevel = containsLogLevel ? logLevel : _Logger.Logger.DefaultSettings.LogLevel;

      var logFunc = function (logType) {
        var logData = [];

        for (var _i = 1; _i < arguments.length; _i++) {
          logData[_i - 1] = arguments[_i];
        }

        _decorators.logFunc.apply(void 0, __spreadArray([target, logLevel, loggingCategory, logType], logData));
      };

      if (arguments && arguments.length > 0) {
        logFunc(_Logger.LogType.Log, [propertyKey + " START with params", arguments]);
      } else {
        logFunc(_Logger.LogType.Log, propertyKey + " START");
      }

      var result = originalMethod.apply(this, arguments);

      if (!(result instanceof Promise)) {
        logFunc(_Logger.LogType.Log, propertyKey + " END");
        return result;
      }

      return Promise.resolve(result).then(function (value) {
        logFunc(_Logger.LogType.Log, propertyKey + " END");
        return value;
      }).catch(function (error) {
        logFunc(_Logger.LogType.Error, "ERROR occurred in " + propertyKey);
        logFunc(_Logger.LogType.Error, error);
        logFunc(_Logger.LogType.Log, propertyKey + " END");
        return Promise.reject(error);
      });
    };
  };
};

exports.methodLogger = methodLogger;
},{"../Logger":"../../node_modules/@spfxappdev/logger/lib/logger/Logger.js","./decorators.utility":"../../node_modules/@spfxappdev/logger/lib/logger/decorators/decorators.utility.js"}],"../../node_modules/@spfxappdev/logger/lib/logger/decorators/property.decorators.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.propertyLogger = void 0;

var _Logger = require("../Logger");

var _decorators = require("./decorators.utility");

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __spreadArray = void 0 && (void 0).__spreadArray || function (to, from) {
  for (var i = 0, il = from.length, j = to.length; i < il; i++, j++) to[j] = from[i];

  return to;
};

var defaultOptions = {
  customLogCategory: null,
  logLevel: null
};

var propertyLogger = function (options) {
  if (options === void 0) {
    options = null;
  }

  options = __assign(__assign({}, defaultOptions), options);
  return function (target, propertyName) {
    var logLevel = options.logLevel;
    var containsLogLevel = typeof logLevel !== 'undefined' && logLevel !== null;

    var logFunc = function (currentInstance, logType) {
      var logData = [];

      for (var _i = 2; _i < arguments.length; _i++) {
        logData[_i - 2] = arguments[_i];
      }

      var loggingCategory = (0, _decorators.getLogCategoryOrCustom)(currentInstance, options.customLogCategory, target.constructor['name'] + "." + propertyName);
      var targetContainsGetLogSettings = typeof currentInstance["getLogSettings"] == "function";

      if (!containsLogLevel && targetContainsGetLogSettings) {
        var settings = currentInstance["getLogSettings"]();

        if (settings && typeof settings["LogLevel"] == "number") {
          logLevel = settings["LogLevel"];
          containsLogLevel = true;
        }
      }

      _decorators.logFunc.apply(void 0, __spreadArray([target, logLevel, loggingCategory, logType], logData));
    }; // property value


    var _val = target[propertyName]; // property getter method

    var getter = function () {
      logFunc(target, _Logger.LogType.Log, "Get: " + propertyName + " => " + _val);
      return _val;
    }; // property setter method


    var setter = function (newVal) {
      logFunc(target, _Logger.LogType.Log, "Set: " + propertyName + " => " + newVal);
      _val = newVal;
    }; // Delete property.


    if (delete target[propertyName]) {
      // Create new property with getter and setter
      Object.defineProperty(target, propertyName, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
      });
    }
  };
};

exports.propertyLogger = propertyLogger;
},{"../Logger":"../../node_modules/@spfxappdev/logger/lib/logger/Logger.js","./decorators.utility":"../../node_modules/@spfxappdev/logger/lib/logger/decorators/decorators.utility.js"}],"../../node_modules/@spfxappdev/logger/lib/logger/decorators/logFactory.decorators.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = void 0;

var _class = require("./class.decorators");

var _method = require("./method.decorators");

var _property = require("./property.decorators");

var _this = void 0;

// decorator factory - which calls the corresponding decorators based on arguments passed
var log = function (options) {
  if (options === void 0) {
    options = null;
  }

  var factoryFunction = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    switch (args.length) {
      case 3:
        // can be method or property decorator
        if (typeof args[2] === 'number' || typeof args[2] === 'undefined') {
          return (0, _property.propertyLogger)(options).apply(_this, args);
        }

        return (0, _method.methodLogger)(options).apply(_this, args);

      case 2:
        // parameter decorator
        return (0, _property.propertyLogger)(options).apply(_this, args);

      case 1:
        // class decorator
        // return classLogger.apply(this, args);
        return (0, _class.classLogger)(options).apply(_this, args);

      default:
        // invalid size of arguments
        throw new Error('Not a valid decorator');
    }
  };

  return factoryFunction;
};

exports.log = log;
},{"./class.decorators":"../../node_modules/@spfxappdev/logger/lib/logger/decorators/class.decorators.js","./method.decorators":"../../node_modules/@spfxappdev/logger/lib/logger/decorators/method.decorators.js","./property.decorators":"../../node_modules/@spfxappdev/logger/lib/logger/decorators/property.decorators.js"}],"../../node_modules/@spfxappdev/logger/lib/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ClassLoggerBase", {
  enumerable: true,
  get: function () {
    return _ClassLoggerBase.ClassLoggerBase;
  }
});
Object.defineProperty(exports, "LogLevel", {
  enumerable: true,
  get: function () {
    return _Logger.LogLevel;
  }
});
Object.defineProperty(exports, "LogType", {
  enumerable: true,
  get: function () {
    return _Logger.LogType;
  }
});
Object.defineProperty(exports, "Logger", {
  enumerable: true,
  get: function () {
    return _Logger.Logger;
  }
});
Object.defineProperty(exports, "log", {
  enumerable: true,
  get: function () {
    return _logFactory.log;
  }
});

var _Logger = require("./logger/Logger");

var _ClassLoggerBase = require("./logger/ClassLoggerBase");

var _logFactory = require("./logger/decorators/logFactory.decorators");
},{"./logger/Logger":"../../node_modules/@spfxappdev/logger/lib/logger/Logger.js","./logger/ClassLoggerBase":"../../node_modules/@spfxappdev/logger/lib/logger/ClassLoggerBase.js","./logger/decorators/logFactory.decorators":"../../node_modules/@spfxappdev/logger/lib/logger/decorators/logFactory.decorators.js"}],"../../src/storage/Storage.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StorageBase = exports.SessionStorage = exports.LocalStorage = void 0;

var _utility = require("@spfxappdev/utility");

var _logger = require("@spfxappdev/logger");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var defaultStorageSettings = {
  UrlParameter: {
    RefreshAll: 'ResetCache',
    RefreshOnly: 'ResetOnly'
  },
  DefaultTimeToLife: 60,
  KeyPrefix: 'SPFxAppDev_'
};

var sessionStorageSettings = __assign({}, defaultStorageSettings);

var localStorageSettings = __assign({}, defaultStorageSettings);

var StorageBase =
/** @class */
function () {
  function StorageBase(storage, settings) {
    if (settings === void 0) {
      settings = defaultStorageSettings;
    }

    this.expiredCacheKeySuffix = '_expire';
    this.cacheLogCategory = 'SPFxAppDevCaching';
    this.cache = storage;
    this.Settings = settings;
    this.logger = new _logger.Logger(this.cacheLogCategory);
  }
  /**
   * Get's the Value associated with the specified CacheKey from the Local-/Session- Storage.
   * @param {string} cacheKey The specified Key for the Cache.
   * @param {Function|null} delegateFunction The delegate Function which if set is Called to refresh the Value in the Cache.
   * @param {number} timeToLife The Time 'til the Cache expires in Minutes.
   */


  StorageBase.prototype.get = function (cacheKey, delegateFunction, timeToLife) {
    if (delegateFunction === void 0) {
      delegateFunction = null;
    }

    if (timeToLife === void 0) {
      timeToLife = this.Settings.DefaultTimeToLife;
    }

    if ((0, _utility.isNullOrEmpty)(cacheKey)) {
      this.warn('cacheKey is required and cannot be null or empty');
      return;
    }

    var originalCacheKey = cacheKey;
    cacheKey = this.Settings.KeyPrefix + cacheKey;

    if (!(0, _utility.isset)(timeToLife)) {
      this.info('timeToLife is not set. Use default time to life of ' + this.Settings.DefaultTimeToLife + ' minutes.');
      timeToLife = this.Settings.DefaultTimeToLife;
    }

    var cache = this.cache; // Browser-Support-Check

    if (!(0, _utility.isset)(cache)) {
      if ((0, _utility.isFunction)(delegateFunction)) {
        this.warn('call delegate function because browser does not support this storage type');
        var valueToCache = delegateFunction();
        return valueToCache;
      }

      this.warn('The browser does not support this storage type and the delagte function is null');
      return null;
    }

    var refreshCacheValue = this.getUrlParameter(this.Settings.UrlParameter.RefreshAll);
    var refreshSpecific = this.getUrlParameter(this.Settings.UrlParameter.RefreshOnly);
    var refreshCache = (0, _utility.toBoolean)(refreshCacheValue);
    var cacheWasRemoved = window.SPFxAppDevCachingWasRemoved || false;

    if (refreshCache && !(0, _utility.isset)(window.SPFxAppDevCachingWasRemoved)) {
      this.log('remove all caching values. Because URL-Parameter is set');
      this.clear();
      window.SPFxAppDevCachingWasRemoved = true;
      cacheWasRemoved = true;
    }

    if (!refreshCache && (0, _utility.isset)(refreshSpecific)) {
      var keyArray = refreshSpecific.toLowerCase().split(',');

      for (var index = 0; index < keyArray.length; index++) {
        if (keyArray[index] !== originalCacheKey.toLowerCase()) {
          continue;
        }

        refreshCache = true;
        cacheWasRemoved = true;
        this.log('remove cache with key ' + cacheKey + '. Because URL-Parameter is set');
        break;
      }
    } // Do not clear again, because it was already done


    if ((0, _utility.isset)(window.SPFxAppDevCachingWasRemoved)) {
      refreshCache = false;
    }

    var expireKey = cacheKey + this.expiredCacheKeySuffix;
    var isExpired = refreshCache || this.cacheIsExpired(cache.getItem(expireKey));

    if (isExpired) {
      this.remove(originalCacheKey);
    }

    var cacheValue = cacheWasRemoved ? null : cache.getItem(cacheKey);

    if ((0, _utility.isset)(cacheValue)) {
      this.log('return cached value with key ' + originalCacheKey);
      var cacheReturnValue = null;

      try {
        cacheReturnValue = JSON.parse(cacheValue);
      } catch (e) {
        this.log('Could not parse JSON-String with value: ' + cacheValue);
        /* tslint:disable:no-eval */

        cacheReturnValue = eval('(' + cacheValue + ')');
      }

      return cacheReturnValue;
    }

    if ((0, _utility.isFunction)(delegateFunction)) {
      this.log('call delegate function to get the data and set in cache, because data is expired for cache with key ' + originalCacheKey);
      var valueToCache = delegateFunction();
      this.set(originalCacheKey, valueToCache, timeToLife);
      return valueToCache;
    }

    this.warn('cannot execute the delegate function, because it is not defined or not a function');
    return null;
  };
  /**
   * Set's the Value under the specified CacheKey in the Local-/Session- Storage.
   * @param {string} cacheKey The specified Key for the Cache.
   * @param {any} cacheValue The Value to be set in the Cache.
   * @param {number} timeToLife The Time 'til the Cache expires in Minutes.
   */


  StorageBase.prototype.set = function (cacheKey, cacheValue, timeToLife) {
    if (timeToLife === void 0) {
      timeToLife = this.Settings.DefaultTimeToLife;
    }

    if ((0, _utility.isNullOrEmpty)(cacheKey)) {
      this.warn('cacheKey is required and cannot be null or empty');
      return;
    }

    cacheKey = this.Settings.KeyPrefix + cacheKey;

    if (!(0, _utility.isset)(timeToLife)) {
      this.info('timeToLife is not set. Use default time to life of ' + this.Settings.DefaultTimeToLife + ' minutes.');
      timeToLife = this.Settings.DefaultTimeToLife;
    }

    var cache = this.cache; // Browser-Support-Check

    if (!(0, _utility.isset)(cache)) {
      this.warn('The browser does not support this storage type and the delagte function is null');
      return;
    }

    try {
      cacheValue = JSON.stringify(cacheValue); // Set the Value to cache

      cache.setItem(cacheKey, cacheValue); // Set the expired date

      var currentTime = new Date();
      currentTime.setMinutes(currentTime.getMinutes() + timeToLife);
      var expireKey = cacheKey + this.expiredCacheKeySuffix;
      cache.setItem(expireKey, currentTime.getTime().toString());
    } catch (e) {
      this.log('Could not set cache value for key: ' + cacheKey);
    }
  }; // /**
  //  * @param {boolean} includeUserId
  //  * @param {WebPartContext|ApplicationCustomizerContext} ctx
  //  */
  // public getWebSpecificCacheKey (includeUserId: boolean, ctx: WebPartContext|ApplicationCustomizerContext): string {
  //     const loginName: string = ctx.pageContext.user.loginName.replace(/[^\w\s]/gi, '_');
  //     const userKey: string = includeUserId ? ('_user_' + loginName) : '';
  //     return ctx.pageContext.web.id.toString().replace(/[^\w\s]/gi, '') + userKey;
  // }

  /**
   * Removes item from Cache based on the Key.
   * @param {string} cacheKey The Key within the Cache.
   */


  StorageBase.prototype.remove = function (cacheKey) {
    this.log('remove cache with key ' + cacheKey);
    cacheKey = this.Settings.KeyPrefix + cacheKey;
    var expiresCacheKey = cacheKey + this.expiredCacheKeySuffix;
    this.removeFromCache(cacheKey, expiresCacheKey);
  };
  /**
   * Removes every Key from the Cache/ Clears the Cache
   */


  StorageBase.prototype.clear = function () {
    var cache = this.cache;

    if (!(0, _utility.isset)(cache)) {
      return;
    }

    for (var i = cache.length - 1; i >= 0; i--) {
      var key = cache.key(i);

      if (key.toLowerCase().indexOf(this.Settings.KeyPrefix.toLowerCase()) !== 0) {
        continue;
      }

      key = key.replace(this.Settings.KeyPrefix, '');
      this.remove(key);
    }
  };
  /**
   * checks if an item exist in cache by cacheKey
   * IMPORTANT: this is the generell getItem-Methode of the cache store. You have to pass the prefix for the cacheKey
   * as well to return the values that you stored via the this.set()-Methode or use the this.get()-Methode instead
   * @param {string} cacheKey The Key to determine.
   * @returns {boolean} <c>true</c> if the Key exists within the Cache, else <c>false</c>.
   */


  StorageBase.prototype.exists = function (cacheKey) {
    return (0, _utility.isset)(this.cache) && (0, _utility.isset)(this.cache.getItem(cacheKey));
  };
  /**
   * @returns {string[]} An Array of all CacheKeys.
   */


  StorageBase.prototype.getStorageKeys = function () {
    var storageCache = this.cache;
    var keyArray = [];

    if (!(0, _utility.isset)(storageCache)) {
      return keyArray;
    }

    for (var keyName in storageCache) {
      if (typeof keyName === 'string' && keyName.indexOf(this.Settings.KeyPrefix) === 0 && keyName.indexOf(this.expiredCacheKeySuffix) < 0) {
        keyArray.push(keyName);
      }
    }

    return keyArray;
  };

  StorageBase.prototype.cacheIsExpired = function (expiredDate) {
    if (!(0, _utility.isset)(expiredDate)) {
      return true;
    }

    var currentTime = new Date();
    var expiresIn = parseInt(expiredDate, 10);
    var timeInCache = new Date(expiresIn);
    return currentTime > timeInCache;
  };

  StorageBase.prototype.getUrlParameter = function (parameterName) {
    return (0, _utility.getUrlParameter)(parameterName);
  };

  StorageBase.prototype.log = function (text) {
    this.logger.log(text);
  };

  StorageBase.prototype.warn = function (text) {
    this.logger.warn(text);
  };

  StorageBase.prototype.info = function (text) {
    this.logger.info(text);
  };

  StorageBase.prototype.removeFromCache = function (cacheKey, cacheExpireKey) {
    if (!(0, _utility.isset)(this.cache)) {
      this.log('removeFromCache this.cache is not set');
      return;
    }

    this.cache.removeItem(cacheKey);
    this.cache.removeItem(cacheExpireKey);
  };

  return StorageBase;
}();

exports.StorageBase = StorageBase;

var SessionStorage =
/** @class */
function (_super) {
  __extends(SessionStorage, _super);
  /**
   * @param {IConsoleLoggingEnabled} loggingEnabled Determines wheter Console-Logging is enabled and to which degree.
   * @param {IStorageSettings} customSettings Settings like a custom Key-Prefix or the Time to Live.
   */


  function SessionStorage(customSettings) {
    if (customSettings === void 0) {
      customSettings = SessionStorage.DefaultSettings;
    }

    return _super.call(this, window.sessionStorage, customSettings) || this;
  }

  SessionStorage.DefaultSettings = sessionStorageSettings;
  return SessionStorage;
}(StorageBase);

exports.SessionStorage = SessionStorage;

var LocalStorage =
/** @class */
function (_super) {
  __extends(LocalStorage, _super);
  /**
   * @param {IConsoleLoggingEnabled} loggingEnabled Determines wheter Console-Logging is enabled and to which degree.
   * @param {IStorageSettings} customSettings Settings like a custom Key-Prefix or the Time to Live.
   */


  function LocalStorage(customSettings) {
    if (customSettings === void 0) {
      customSettings = LocalStorage.DefaultSettings;
    }

    return _super.call(this, window.localStorage, customSettings) || this;
  }

  LocalStorage.DefaultSettings = localStorageSettings;
  return LocalStorage;
}(StorageBase);

exports.LocalStorage = LocalStorage;
},{"@spfxappdev/utility":"../../node_modules/@spfxappdev/utility/lib/index.js","@spfxappdev/logger":"../../node_modules/@spfxappdev/logger/lib/index.js"}],"../../src/storage/decorators/method.decorators.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sessionCache = exports.localCache = exports.clearSessionCache = exports.clearLocalCache = void 0;

var _utility = require("@spfxappdev/utility");

var _Storage = require("../Storage");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __spreadArray = void 0 && (void 0).__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};

var sessionStorageDefaultSettings = _Storage.SessionStorage.DefaultSettings;
var localStorageDefaultSettings = _Storage.LocalStorage.DefaultSettings;

var Factory =
/** @class */
function () {
  function Factory(objToCreate) {
    this.objToCreate = objToCreate;
  }

  Factory.prototype.create = function () {
    return new this.objToCreate();
  };

  return Factory;
}();

var sessionCache = function sessionCache(options) {
  var defaultSessionStorageOptions = {
    key: null,
    timeToLife: sessionStorageDefaultSettings.DefaultTimeToLife,
    keyPrefix: sessionStorageDefaultSettings.KeyPrefix
  };
  options = __assign(__assign({}, defaultSessionStorageOptions), options);
  return function (target, propertyKey, descriptor) {
    var originalMethod = descriptor.value;

    descriptor.value = function () {
      var storage = new _Storage.SessionStorage({
        KeyPrefix: options.keyPrefix,
        DefaultTimeToLife: options.timeToLife,
        UrlParameter: sessionStorageDefaultSettings.UrlParameter
      });
      return getFromStorageOrTarget(storage, options, originalMethod, this, propertyKey, descriptor, arguments);
    };
  };
};

exports.sessionCache = sessionCache;

var localCache = function localCache(options) {
  var defaultLocalStorageOptions = {
    key: null,
    timeToLife: localStorageDefaultSettings.DefaultTimeToLife,
    keyPrefix: localStorageDefaultSettings.KeyPrefix
  };
  options = __assign(__assign({}, defaultLocalStorageOptions), options);
  return function (target, propertyKey, descriptor) {
    var originalMethod = descriptor.value;

    descriptor.value = function () {
      var storage = new _Storage.LocalStorage({
        KeyPrefix: options.keyPrefix,
        DefaultTimeToLife: options.timeToLife,
        UrlParameter: localStorageDefaultSettings.UrlParameter
      });
      return getFromStorageOrTarget(storage, options, originalMethod, this, propertyKey, descriptor, arguments);
    };
  };
};

exports.localCache = localCache;

var clearSessionCache = function clearSessionCache(options) {
  var defaultClearSessionStorageOptions = {
    key: null,
    keyPrefix: sessionStorageDefaultSettings.KeyPrefix
  };
  options = __assign(__assign({}, defaultClearSessionStorageOptions), options);
  return function (target, propertyKey, descriptor) {
    var originalMethod = descriptor.value;

    descriptor.value = function () {
      var storage = new _Storage.SessionStorage({
        KeyPrefix: options.keyPrefix,
        DefaultTimeToLife: sessionStorageDefaultSettings.DefaultTimeToLife,
        UrlParameter: sessionStorageDefaultSettings.UrlParameter
      });
      removeFromStorage(storage, options, originalMethod, this, propertyKey, descriptor, arguments);
      var result = originalMethod.apply(this, arguments);

      if (!(result instanceof Promise)) {
        return result;
      }

      return Promise.resolve(result).then(function (value) {
        return value;
      }).catch(function (error) {
        storage.logger.error("ERROR occurred in " + propertyKey + ".clearSessionCache");
        storage.logger.error(error);
        storage.logger.log(propertyKey + " REMOVE Cache END");
        return Promise.reject(error);
      });
    };
  };
};

exports.clearSessionCache = clearSessionCache;

var clearLocalCache = function clearLocalCache(options) {
  var defaultClearLocalStorageOptions = {
    key: null,
    keyPrefix: localStorageDefaultSettings.KeyPrefix
  };
  options = __assign(__assign({}, defaultClearLocalStorageOptions), options);
  return function (target, propertyKey, descriptor) {
    var originalMethod = descriptor.value;

    descriptor.value = function () {
      var storage = new _Storage.LocalStorage({
        KeyPrefix: options.keyPrefix,
        DefaultTimeToLife: localStorageDefaultSettings.DefaultTimeToLife,
        UrlParameter: localStorageDefaultSettings.UrlParameter
      });
      removeFromStorage(storage, options, originalMethod, this, propertyKey, descriptor, arguments);
      var result = originalMethod.apply(this, arguments);

      if (!(result instanceof Promise)) {
        return result;
      }

      return Promise.resolve(result).then(function (value) {
        return value;
      }).catch(function (error) {
        storage.logger.error("ERROR occurred in " + propertyKey + ".clearLocalCache");
        storage.logger.error(error);
        storage.logger.log(propertyKey + " REMOVE Cache END");
        return Promise.reject(error);
      });
    };
  };
};

exports.clearLocalCache = clearLocalCache;

function getFromStorageOrTarget(storage, options, originalMethod, target, propertyKey, descriptor) {
  var _a;

  var args = [];

  for (var _i = 6; _i < arguments.length; _i++) {
    args[_i - 6] = arguments[_i];
  }

  var storageKey = typeof options.key == "function" ? (_a = options.key).apply.apply(_a, __spreadArray([target], args, false)) : options.key;
  var storageValue = storage.get(storageKey, undefined, options.timeToLife);
  var result = null;
  var setValueInCache = false;

  if ((0, _utility.isset)(storageValue)) {
    storage.logger.log(propertyKey + " GET from Storage");
    result = storageValue;

    if (!(0, _utility.isFunction)(options.convertFromCache) && _typeof(result) === 'object' && (0, _utility.isset)(options.sourceObj)) {
      storage.logger.log(propertyKey + " TRY to convert from sourceObj");
      var fac = new Factory(options.sourceObj).create();
      result = Object.assign(fac, result); // result = assignObject(fac, result);
    } else if ((0, _utility.isFunction)(options.convertFromCache)) {
      storage.logger.log(propertyKey + " TRY to convert from convertFromCache-Method");
      result = options.convertFromCache.call(target, result);
    }
  } else {
    storage.logger.log(propertyKey + " GET from Method-Logic");
    setValueInCache = true;
    result = originalMethod.apply.apply(originalMethod, __spreadArray([target], args, false));
  } //If not loaded from storage and original Method ReturnType is not a promise


  if (!(0, _utility.isset)(storageValue) && !(result instanceof Promise)) {
    storage.logger.log(propertyKey + " END");

    if (setValueInCache) {
      storage.set(storageKey, result, options.timeToLife);
    }

    return result;
  }

  return Promise.resolve(result).then(function (value) {
    storage.logger.log(propertyKey + " END");

    if (setValueInCache) {
      storage.set(storageKey, value, options.timeToLife);
    }

    return value;
  }).catch(function (error) {
    storage.logger.error("ERROR occurred in " + propertyKey);
    storage.logger.error(error);
    storage.logger.log(propertyKey + " END");
    return Promise.reject(error);
  });
}

function removeFromStorage(storage, options, originalMethod, target, propertyKey, descriptor) {
  var _a, _b;

  var args = [];

  for (var _i = 6; _i < arguments.length; _i++) {
    args[_i - 6] = arguments[_i];
  }

  var clear = true;
  storage.logger.log(propertyKey + " Remove " + options.key + " from cache");

  if ((0, _utility.isFunction)(options.when)) {
    storage.logger.log(propertyKey + " Remove from cache - when function is set, get Value from method");
    console.log(target);
    clear = (_a = options.when).apply.apply(_a, __spreadArray([target], args, false));
    storage.logger.log(propertyKey + " clearCache is set to " + clear + " from when-function");
  }

  if (clear === false) {
    storage.logger.log(propertyKey + " clearCache is set to false, skip removing");
    return;
  }

  var storageKey = typeof options.key == "function" ? (_b = options.key).apply.apply(_b, __spreadArray([target], args, false)) : options.key;
  storage.remove(storageKey);
}
},{"@spfxappdev/utility":"../../node_modules/@spfxappdev/utility/lib/index.js","../Storage":"../../src/storage/Storage.ts"}],"../../src/storage/decorators/options.decorators.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
},{}],"../../src/storage/decorators/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "IClearLocalStorageDecoratorOptions", {
  enumerable: true,
  get: function () {
    return _options.IClearLocalStorageDecoratorOptions;
  }
});
Object.defineProperty(exports, "IClearSessionStorageDecoratorOptions", {
  enumerable: true,
  get: function () {
    return _options.IClearSessionStorageDecoratorOptions;
  }
});
Object.defineProperty(exports, "IClearStorageDecoratorOptions", {
  enumerable: true,
  get: function () {
    return _options.IClearStorageDecoratorOptions;
  }
});
Object.defineProperty(exports, "ILocalStorageDecoratorOptions", {
  enumerable: true,
  get: function () {
    return _options.ILocalStorageDecoratorOptions;
  }
});
Object.defineProperty(exports, "ISessionStorageDecoratorOptions", {
  enumerable: true,
  get: function () {
    return _options.ISessionStorageDecoratorOptions;
  }
});
Object.defineProperty(exports, "IStorageDecoratorOptions", {
  enumerable: true,
  get: function () {
    return _options.IStorageDecoratorOptions;
  }
});
Object.defineProperty(exports, "clearLocalCache", {
  enumerable: true,
  get: function () {
    return _method.clearLocalCache;
  }
});
Object.defineProperty(exports, "clearSessionCache", {
  enumerable: true,
  get: function () {
    return _method.clearSessionCache;
  }
});
Object.defineProperty(exports, "localCache", {
  enumerable: true,
  get: function () {
    return _method.localCache;
  }
});
Object.defineProperty(exports, "sessionCache", {
  enumerable: true,
  get: function () {
    return _method.sessionCache;
  }
});

var _method = require("./method.decorators");

var _options = require("./options.decorators");
},{"./method.decorators":"../../src/storage/decorators/method.decorators.ts","./options.decorators":"../../src/storage/decorators/options.decorators.ts"}],"../../src/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  IStorageSettings: true,
  LocalStorage: true,
  SessionStorage: true,
  IStorageUrlParameters: true
};
Object.defineProperty(exports, "IStorageSettings", {
  enumerable: true,
  get: function () {
    return _Storage.IStorageSettings;
  }
});
Object.defineProperty(exports, "IStorageUrlParameters", {
  enumerable: true,
  get: function () {
    return _Storage.IStorageUrlParameters;
  }
});
Object.defineProperty(exports, "LocalStorage", {
  enumerable: true,
  get: function () {
    return _Storage.LocalStorage;
  }
});
Object.defineProperty(exports, "SessionStorage", {
  enumerable: true,
  get: function () {
    return _Storage.SessionStorage;
  }
});

var _Storage = require("./storage/Storage");

var _decorators = require("./storage/decorators");

Object.keys(_decorators).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _decorators[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _decorators[key];
    }
  });
});
},{"./storage/Storage":"../../src/storage/Storage.ts","./storage/decorators":"../../src/storage/decorators/index.ts"}],"App.ts":[function(require,module,exports) {
"use strict";

var _index = require("../../src/index");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}; //  import { IStorageSettings, LocalStorage, SessionStorage, IStorageUrlParameters } from '@spfxappdev/storage';


var defaultLocalStorageSettingsOverride = {
  UrlParameter: {
    RefreshAll: 'Reset',
    RefreshOnly: 'ResetOnly'
  },
  DefaultTimeToLife: 10,
  KeyPrefix: 'LocalDefault_10_Minutes_'
};
_index.LocalStorage.DefaultSettings = defaultLocalStorageSettingsOverride;

var myCustomSettings = __assign(__assign({}, _index.LocalStorage.DefaultSettings), {
  KeyPrefix: "TestLocal",
  DefaultTimeToLife: 5
});

var local = new _index.LocalStorage(myCustomSettings);
local.set("now", new Date());
var session = new _index.SessionStorage();
session.set("now", new Date());
var local2 = new _index.LocalStorage();
local2.set("now", new Date());

var TestStorageClassNormal =
/** @class */
function () {
  function TestStorageClassNormal() {
    this.sesssionStorage = new _index.SessionStorage();
  }

  TestStorageClassNormal.prototype.getDummyDataWithCallback = function () {
    return this.sesssionStorage.get("DummyDataWithCallback", function () {
      return "This is the stored data";
    });
  };

  TestStorageClassNormal.prototype.getDummyDataPromise = function () {
    var _this = this;

    this.sesssionStorage.logger.log("getDummyDataPromise START");
    var cacheKey = "getDummyDataPromise";
    var cacheData = this.sesssionStorage.get(cacheKey);

    if (cacheData != null) {
      this.sesssionStorage.logger.log("getDummyDataPromise get from cache");
      return Promise.resolve(cacheData);
    }

    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        var data = "This data is from 5s Promise";

        _this.sesssionStorage.logger.log("getDummyDataPromise get from Promise");

        _this.sesssionStorage.set(cacheKey, data);

        resolve(data);
      }, 5000);
    });
  };

  return TestStorageClassNormal;
}();

var t1 = new TestStorageClassNormal();
console.log(t1.getDummyDataWithCallback());
console.log(t1.getDummyDataPromise());

var TestStorageClassDecorators =
/** @class */
function () {
  function TestStorageClassDecorators() {}

  TestStorageClassDecorators.prototype.getDummyDataWithCallback = function () {
    return "This is the stored data";
  };

  TestStorageClassDecorators.prototype.getDummyDataPromise = function () {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        var data = "This data is from 5s Promise";
        resolve(data);
      }, 5000);
    });
  };

  __decorate([(0, _index.localCache)({
    key: "DummyDataWithCallbackDecorators"
  })], TestStorageClassDecorators.prototype, "getDummyDataWithCallback", null);

  __decorate([(0, _index.localCache)({
    key: "getDummyDataPromiseDecorators"
  })], TestStorageClassDecorators.prototype, "getDummyDataPromise", null);

  return TestStorageClassDecorators;
}();

var t2 = new TestStorageClassDecorators();
console.log(t2.getDummyDataWithCallback());
console.log(t2.getDummyDataPromise());
},{"../../src/index":"../../src/index.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52745" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","App.ts"], null)
//# sourceMappingURL=/App.7a936cda.js.map