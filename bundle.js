/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _info_box = __webpack_require__(1);
	
	var _info_box2 = _interopRequireDefault(_info_box);
	
	var _drawer = __webpack_require__(3);
	
	var _drawer2 = _interopRequireDefault(_drawer);
	
	var _loop = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var drawer = void 0;
	var wrapper = document.getElementById('wrapper');
	var CURVES_DURATION = 10000;
	
	var _createLoop = (0, _loop.createLoop)();
	
	var register = _createLoop.register;
	
	var info = new _info_box2.default(document.querySelector('.info'));
	setTimeout(function () {
	  return info.show();
	}, 500);
	
	var cancelCurCurve = function cancelCurCurve() {};
	
	function random(low, high) {
	  if (high === undefined) {
	    high = low;
	    low = 0;
	  }
	  return Math.random() * (high - low) + low | 0;
	}
	
	function averagePoints(ptA, ptB, perc) {
	  return ptB.map(function (coord, i) {
	    return coord * perc + ptA[i] * (1 - perc);
	  });
	}
	
	function generateCurve(ptA, ptB, ptC) {
	  var pts = [];
	  var granularity = 30;
	  var stepSize = 1 / granularity;
	  for (var i = 0; i <= granularity; i++) {
	    var step = stepSize * i;
	    var ptQ = averagePoints(ptA, ptB, step);
	    var ptR = averagePoints(ptB, ptC, step);
	    pts.push(averagePoints(ptQ, ptR, step));
	  }
	  return pts;
	}
	
	function drawCurve(pts, hue) {
	  var duration = random(1500, 2500);
	  var color = 'hsla(' + hue + ', 75%, ' + (random(45) + 55) + '%, 0.005)';
	  var lineWidth = Math.random() * 2 + 1 | 0;
	  drawer.arc(pts, duration, color, lineWidth);
	}
	
	function drawCurves(origin) {
	  var dbl = function dbl(i) {
	    return i * 2;
	  };
	  var hue = random(0, 360);
	  var ptB = [random(window.innerWidth), random(window.innerHeight)];
	  var curvesToDraw = 10;
	  var startTs = Date.now();
	  cancelCurCurve();
	  cancelCurCurve = register(function () {
	    var k = curvesToDraw;
	    while (k--) {
	      var ptC = [random(window.innerWidth), random(window.innerHeight)];
	      drawCurve(generateCurve(origin.map(dbl), ptB.map(dbl), ptC.map(dbl)), hue);
	    }
	    return Date.now() < CURVES_DURATION + startTs;
	  });
	}
	
	function start() {
	  drawer = new _drawer2.default(wrapper);
	  drawer.ctx.globalCompositeOperation = 'lighter';
	  drawer.ctx.lineCap = 'round';
	  drawer.canvas.style.opacity = 0.8;
	  var origin = [random(window.innerWidth), random(window.innerHeight)];
	  drawCurves(origin);
	  document.addEventListener('click', function (e) {
	    if (e.target.tagName === 'CANVAS') {
	      drawCurves([e.offsetX, e.offsetY]);
	    }
	  });
	}
	
	function main() {
	  function cycle() {
	    start();
	    // setTimeout(() => {
	    //   const fadeSpeed = 3000;
	    //   drawer.canvas.style.transition = `opacity ${fadeSpeed}ms ease-out`;
	    //   drawer.canvas.style.opacity = 0;
	    //   setTimeout(() => {
	    //     drawer.canvas.remove();
	    //     cycle();
	    //   }, fadeSpeed);
	    // }, CURVES_DURATION);
	  }
	  cycle();
	}
	
	setTimeout(main, 1000);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _utils = __webpack_require__(2);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var InfoBox = function () {
	  function InfoBox(el) {
	    _classCallCheck(this, InfoBox);
	
	    this.el = el;
	    var title = el.querySelector('h1');
	    var titleText = title.textContent.trim();
	    this.letters = this.buildLetterEls(titleText);
	    title.textContent = '';
	    this.letters.forEach(title.appendChild.bind(title));
	  }
	
	  _createClass(InfoBox, [{
	    key: 'buildLetterEls',
	    value: function buildLetterEls(text) {
	      var letters = [];
	      while (text.length) {
	        var span = document.createElement('span');
	        span.textContent = text[0];
	        text = text.slice(1);
	        letters.push(span);
	      }
	      return letters;
	    }
	  }, {
	    key: 'fadeInBg',
	    value: function fadeInBg() {
	      var _el$getBoundingClient = this.el.getBoundingClientRect();
	
	      var height = _el$getBoundingClient.height;
	      var width = _el$getBoundingClient.width;
	
	      var c = document.createElement('canvas');
	      var ctx = c.getContext('2d');
	      c.height = height;
	      c.width = width;
	      c.style.height = height + 'px';
	      c.style.width = width + 'px';
	      var divStyle = window.getComputedStyle(this.el);
	      c.style.bottom = divStyle.bottom;
	      c.style.left = divStyle.left;
	      c.style.position = 'absolute';
	      c.style.zIndex = this.el.style.zIndex || 0;
	      this.el.style.zIndex = this.el.style.zIndex ? this.el.style.zIndex + 1 : 1;
	      this.el.parentElement.appendChild(c);
	
	      var hue = (0, _utils.random)(360) | 0;
	
	      return (0, _utils.startAnimation)(function (step) {
	        step = Math.pow(step, 3);
	        var radius = step * width | 0;
	        var lightness = step * 50 + 30 | 0;
	        ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);
	        ctx.fillStyle = 'hsl(' + hue + ', ' + 5 + '%, ' + lightness + '%)';
	        ctx.fill();
	      }, 350);
	    }
	  }, {
	    key: 'fadeInText',
	    value: function fadeInText() {
	      var _this = this;
	
	      this.letters.forEach(function (span, i) {
	        var delay = (_this.letters.length - i) * 15;
	        span.style.transition = 'all 400ms cubic-bezier(.15,.62,.38,.94) ' + delay + 'ms';
	      });
	      this.el.classList.add('show');
	    }
	  }, {
	    key: 'show',
	    value: function show() {
	      this.fadeInBg().then(this.fadeInText.bind(this));
	    }
	  }]);
	
	  return InfoBox;
	}();
	
	exports.default = InfoBox;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = {};
	
	module.exports.uniqueId = function uniqueId() {
	    var r = (Math.random() * 100000000) | 0;
	    return Date.now().toString(32) + r.toString(32);
	};
	
	module.exports.getCookie = function getCookie(name) {
	    var cookies = document.cookie.split(';');
	    var nameEQ = name + '=';
	    for (var i = 0; i < cookies.length; i++) {
	        var c = cookies[i];
	        while (c.charAt(0) === ' ') {
	            c = c.substring(1, c.length);
	        }
	        if (c.indexOf(nameEQ) === 0) {
	            return c.substring(nameEQ.length, c.length);
	        }
	    }
	    return null;
	};
	
	module.exports.encodeQueryParams = function encodeQueryParams(paramsObj) {
	    var eUC = encodeURIComponent;
	    return Object.keys(paramsObj).map(function(param) {
	        return eUC(param) + '=' + eUC(paramsObj[param]);
	    }).join('&');
	};
	
	module.exports.extend = function extend(target, source, overwrite) {
	    for (var key in source)
	        if (overwrite || !(key in target)) {
	            target[key] = source[key];
	        }
	    return target;
	};
	
	module.exports.onReady = function onReady(fn) {
	    if (document.readyState !== 'loading') {
	        fn();
	    } else {
	        document.addEventListener('DOMContentLoaded', fn);
	    }
	};
	
	module.exports.getJSON = function getJSON(url) {
	    return new Promise(function(resolve, reject) {
	        var request = new XMLHttpRequest();
	        request.open('GET', url, true);
	        request.onload = function() {
	            if (this.status >= 200 && this.status < 400) {
	                try {
	                    resolve(JSON.parse(this.response));
	                } catch (err) {
	                    reject(this.response);
	                }
	            } else {
	                reject(this.response);
	            }
	        };
	        request.onerror = function() {
	            reject(this.response);
	        };
	        request.send();
	    });
	};
	
	module.exports.startAnimation = function startAnimation(renderFn, duration) {
	    var startTime;
	    return new Promise(function(resolve) {
	        function _render(t) {
	            startTime = startTime || t;
	            var step = (t - startTime) / duration;
	            renderFn(step);
	            if (step < 1) {
	                requestAnimationFrame(_render);
	            } else {
	                resolve();
	            }
	        }
	        requestAnimationFrame(_render);
	    });
	};
	
	module.exports.easeOut = function easeOut(step, start, change) {
	    return change * Math.pow(step, 2) + start;
	};
	
	module.exports.easeIn = function easeIn(step, start, change) {
	    return change * (1 - Math.pow(1 - step, 3)) + start;
	};
	
	module.exports.shuffle = function shuffle(list) {
	    list = list.slice();
	    var shuffled = [];
	    while (list.length) {
	        var i = Math.random() * list.length | 0;
	        shuffled.push(list.splice(i, 1)[0]);
	    }
	    return shuffled;
	};
	
	module.exports.random = function random(low, high) {
	    if (Array.isArray(low)) {
	        return low[random(low.length)];
	    }
	    if (high === undefined) {
	        high = low;
	        low = 0;
	    }
	    return Math.random() * (high - low) + low | 0;
	};
	
	// returns an array with ints between start and end (inclusive of start,
	// not inclusive of end). also accepts a single int, treating it as the end
	// and using 0 as start
	module.exports.range = function range(start, end) {
	    if (end === undefined) {
	        end = start;
	        start = 0;
	    }
	    var numbers = [];
	    while (start < end) {
	        numbers.push(start++);
	    }
	    return numbers;
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _loop = __webpack_require__(4);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var _createLoop = (0, _loop.createLoop)();
	
	var register = _createLoop.register;
	
	
	function easeIn(step, start, change) {
	    return change * (1 - Math.pow(1 - step, 3)) + start;
	}
	
	function startAnimation(renderFn, duration) {
	    return new Promise(function (resolve) {
	        var startTime = void 0;
	        register(function (t) {
	            startTime = startTime || t;
	            var step = (t - startTime) / duration;
	            renderFn(step);
	            if (step >= 1) {
	                resolve();
	                return false;
	            }
	            return true;
	        });
	    });
	}
	
	function dist(_ref, _ref2) {
	    var _ref4 = _slicedToArray(_ref, 2);
	
	    var x1 = _ref4[0];
	    var y1 = _ref4[1];
	
	    var _ref3 = _slicedToArray(_ref2, 2);
	
	    var x2 = _ref3[0];
	    var y2 = _ref3[1];
	
	    var xDist = x2 - x1;
	    var yDist = y2 - y1;
	    return Math.sqrt(xDist * xDist + yDist * yDist);
	}
	
	function drawCircle(ctx, _ref5, radius, startAngle, endAngle, color, width) {
	    var _ref6 = _slicedToArray(_ref5, 2);
	
	    var x = _ref6[0];
	    var y = _ref6[1];
	
	    ctx.beginPath();
	    ctx.arc(x, y, radius, startAngle, endAngle);
	    ctx.strokeStyle = color;
	    ctx.lineWidth = width;
	    ctx.stroke();
	}
	
	function drawLine(ctx, start, end, color, width) {
	    ctx.beginPath();
	    ctx.moveTo.apply(ctx, _toConsumableArray(start));
	    ctx.lineTo.apply(ctx, _toConsumableArray(end));
	    ctx.strokeStyle = color;
	    ctx.lineWidth = width;
	    ctx.stroke();
	}
	
	function drawArc(ctx, arc, color, width) {
	    ctx.beginPath();
	    ctx.strokeStyle = color;
	    ctx.lineWidth = width;
	    ctx.moveTo.apply(ctx, _toConsumableArray(arc[0]));
	    arc.slice(1).forEach(function (pt) {
	        return ctx.lineTo.apply(ctx, _toConsumableArray(pt));
	    });
	    ctx.stroke();
	}
	
	function getArcDist(arc) {
	    var last = arc[0];
	    return arc.reduce(function (total, pt) {
	        total += dist(last, pt);
	        last = pt;
	        return total;
	    }, 0);
	}
	
	function cutArc(arc, perc) {
	    var last = arc[0];
	    var toGo = getArcDist(arc) * perc;
	    var toDraw = [last];
	    for (var i = 1, len = arc.length; i < len; i++) {
	        var pt = arc[i];
	        var segmentDist = dist(last, pt);
	        if (!segmentDist) {
	            continue;
	        }
	        if (toGo === 0) {
	            break;
	        }
	        if (segmentDist <= toGo) {
	            toDraw.push(pt);
	            toGo -= segmentDist;
	            last = pt;
	            continue;
	        }
	        var cutPerc = toGo / segmentDist;
	        var x = (pt[0] - last[0]) * cutPerc + last[0];
	        var y = (pt[1] - last[1]) * cutPerc + last[1];
	        toDraw.push([x, y]);
	        break;
	    }
	    return toDraw;
	}
	
	var Drawer = function () {
	    function Drawer(container) {
	        _classCallCheck(this, Drawer);
	
	        var _container$getBoundin = container.getBoundingClientRect();
	
	        var height = _container$getBoundin.height;
	        var width = _container$getBoundin.width;
	
	        var canvas = document.createElement('canvas');
	        canvas.style.height = height + 'px';
	        canvas.style.width = width + 'px';
	        canvas.height = height * 2;
	        canvas.width = width * 2;
	        container.appendChild(canvas);
	        this.ctx = canvas.getContext('2d');
	        this.canvas = canvas;
	    }
	
	    _createClass(Drawer, [{
	        key: 'circle',
	        value: function circle(center, radius, startAngle, duration, color) {
	            var _this = this;
	
	            var width = arguments.length <= 5 || arguments[5] === undefined ? 1 : arguments[5];
	
	            center = center.map(function (num) {
	                return num * 2;
	            });
	            radius *= 2;
	            return startAnimation(function (step) {
	                var angle = easeIn(step, startAngle, 2);
	                drawCircle(_this.ctx, center, radius, startAngle * Math.PI, angle * Math.PI, color, width);
	            }, duration);
	        }
	    }, {
	        key: 'line',
	        value: function line(start, end, duration, color) {
	            var _this2 = this;
	
	            var width = arguments.length <= 4 || arguments[4] === undefined ? 1 : arguments[4];
	
	            start = start.map(function (num) {
	                return num * 2;
	            });
	            var _start = start;
	
	            var _start2 = _slicedToArray(_start, 2);
	
	            var startX = _start2[0];
	            var startY = _start2[1];
	
	            var _end$map = end.map(function (num) {
	                return num * 2;
	            });
	
	            var _end$map2 = _slicedToArray(_end$map, 2);
	
	            var endX = _end$map2[0];
	            var endY = _end$map2[1];
	
	            return startAnimation(function (step) {
	                var x = easeIn(step, startX, endX - startX);
	                var y = easeIn(step, startY, endY - startY);
	                drawLine(_this2.ctx, start, [x, y], color, width);
	            }, duration);
	        }
	    }, {
	        key: 'arc',
	        value: function arc(_arc, duration, color) {
	            var _this3 = this;
	
	            var width = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];
	
	            return startAnimation(function (step) {
	                var perc = easeIn(step, 0, 1);
	                var toDraw = cutArc(_arc, perc);
	                drawArc(_this3.ctx, toDraw, color, width);
	            }, duration);
	        }
	    }, {
	        key: 'clear',
	        value: function clear() {
	            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	        }
	    }]);
	
	    return Drawer;
	}();
	
	module.exports = Drawer;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.createLoop = createLoop;
	
	var _rAF = __webpack_require__(5);
	
	function createLoop() {
	    var callbacks = [];
	    var request = null;
	
	    function loop(t) {
	        callbacks = callbacks.filter(function (cb) {
	            return cb(t);
	        });
	        request = callbacks.length ? (0, _rAF.requestAnimationFrame)(loop) : null;
	    }
	
	    function register(cb) {
	        var running = !!callbacks.length;
	        callbacks.push(cb);
	        if (!running) {
	            request = (0, _rAF.requestAnimationFrame)(loop);
	        }
	
	        return function remove() {
	            var index = callbacks.indexOf(cb);
	            if (index < 0) {
	                return;
	            }
	            callbacks.splice(index, 1);
	        };
	    }
	
	    function clear() {
	        (0, _rAF.cancelAnimationFrame)(request);
	        request = null;
	        callbacks = [];
	    }
	
	    return { register: register, clear: clear };
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// using this as a module so we can mock this when testing
	var requestAnimationFrame = exports.requestAnimationFrame = function requestAnimationFrame() {
	  var _window;
	
	  return (_window = window).requestAnimationFrame.apply(_window, arguments);
	};
	var cancelAnimationFrame = exports.cancelAnimationFrame = function cancelAnimationFrame() {
	  var _window2;
	
	  return (_window2 = window).cancelAnimationFrame.apply(_window2, arguments);
	};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map