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
	
	var _simplexNoise = __webpack_require__(3);
	
	var _simplexNoise2 = _interopRequireDefault(_simplexNoise);
	
	var _drawer = __webpack_require__(4);
	
	var _drawer2 = _interopRequireDefault(_drawer);
	
	var _loop2 = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var drawer = void 0;
	var simplex = new _simplexNoise2.default();
	window.simplex = simplex;
	var wrapper = document.getElementById('wrapper');
	var CURVES_DURATION = 10000;
	
	var _createLoop = (0, _loop2.createLoop)();
	
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
	
	    var _loop = function _loop() {
	      var ptC = [random(window.innerWidth), random(window.innerHeight)];
	      var noise = simplex.noise2D.apply(simplex, _toConsumableArray(ptB));
	      ptB = ptB.map(function (coord) {
	        return coord + noise * 35;
	      });
	      // ptB = [window.innerWidth, window.innerHeight].map((winSize, i) => ptB[i] + winSize / 2);
	      drawCurve(generateCurve(ptC.map(dbl), ptB.map(dbl), origin.map(dbl)), hue);
	    };
	
	    while (k--) {
	      _loop();
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

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * A fast javascript implementation of simplex noise by Jonas Wagner
	 *
	 * Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
	 * Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
	 * With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
	 * Better rank ordering method by Stefan Gustavson in 2012.
	 *
	 *
	 * Copyright (C) 2012 Jonas Wagner
	 *
	 * Permission is hereby granted, free of charge, to any person obtaining
	 * a copy of this software and associated documentation files (the
	 * "Software"), to deal in the Software without restriction, including
	 * without limitation the rights to use, copy, modify, merge, publish,
	 * distribute, sublicense, and/or sell copies of the Software, and to
	 * permit persons to whom the Software is furnished to do so, subject to
	 * the following conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	 *
	 */
	(function () {
	"use strict";
	
	var F2 = 0.5 * (Math.sqrt(3.0) - 1.0),
	    G2 = (3.0 - Math.sqrt(3.0)) / 6.0,
	    F3 = 1.0 / 3.0,
	    G3 = 1.0 / 6.0,
	    F4 = (Math.sqrt(5.0) - 1.0) / 4.0,
	    G4 = (5.0 - Math.sqrt(5.0)) / 20.0;
	
	
	function SimplexNoise(random) {
	    if (!random) random = Math.random;
	    this.p = new Uint8Array(256);
	    this.perm = new Uint8Array(512);
	    this.permMod12 = new Uint8Array(512);
	    for (var i = 0; i < 256; i++) {
	        this.p[i] = random() * 256;
	    }
	    for (i = 0; i < 512; i++) {
	        this.perm[i] = this.p[i & 255];
	        this.permMod12[i] = this.perm[i] % 12;
	    }
	
	}
	SimplexNoise.prototype = {
	    grad3: new Float32Array([1, 1, 0,
	                            - 1, 1, 0,
	                            1, - 1, 0,
	
	                            - 1, - 1, 0,
	                            1, 0, 1,
	                            - 1, 0, 1,
	
	                            1, 0, - 1,
	                            - 1, 0, - 1,
	                            0, 1, 1,
	
	                            0, - 1, 1,
	                            0, 1, - 1,
	                            0, - 1, - 1]),
	    grad4: new Float32Array([0, 1, 1, 1, 0, 1, 1, - 1, 0, 1, - 1, 1, 0, 1, - 1, - 1,
	                            0, - 1, 1, 1, 0, - 1, 1, - 1, 0, - 1, - 1, 1, 0, - 1, - 1, - 1,
	                            1, 0, 1, 1, 1, 0, 1, - 1, 1, 0, - 1, 1, 1, 0, - 1, - 1,
	                            - 1, 0, 1, 1, - 1, 0, 1, - 1, - 1, 0, - 1, 1, - 1, 0, - 1, - 1,
	                            1, 1, 0, 1, 1, 1, 0, - 1, 1, - 1, 0, 1, 1, - 1, 0, - 1,
	                            - 1, 1, 0, 1, - 1, 1, 0, - 1, - 1, - 1, 0, 1, - 1, - 1, 0, - 1,
	                            1, 1, 1, 0, 1, 1, - 1, 0, 1, - 1, 1, 0, 1, - 1, - 1, 0,
	                            - 1, 1, 1, 0, - 1, 1, - 1, 0, - 1, - 1, 1, 0, - 1, - 1, - 1, 0]),
	    noise2D: function (xin, yin) {
	        var permMod12 = this.permMod12,
	            perm = this.perm,
	            grad3 = this.grad3;
	        var n0=0, n1=0, n2=0; // Noise contributions from the three corners
	        // Skew the input space to determine which simplex cell we're in
	        var s = (xin + yin) * F2; // Hairy factor for 2D
	        var i = Math.floor(xin + s);
	        var j = Math.floor(yin + s);
	        var t = (i + j) * G2;
	        var X0 = i - t; // Unskew the cell origin back to (x,y) space
	        var Y0 = j - t;
	        var x0 = xin - X0; // The x,y distances from the cell origin
	        var y0 = yin - Y0;
	        // For the 2D case, the simplex shape is an equilateral triangle.
	        // Determine which simplex we are in.
	        var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
	        if (x0 > y0) {
	            i1 = 1;
	            j1 = 0;
	        } // lower triangle, XY order: (0,0)->(1,0)->(1,1)
	        else {
	            i1 = 0;
	            j1 = 1;
	        } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
	        // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
	        // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
	        // c = (3-sqrt(3))/6
	        var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
	        var y1 = y0 - j1 + G2;
	        var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
	        var y2 = y0 - 1.0 + 2.0 * G2;
	        // Work out the hashed gradient indices of the three simplex corners
	        var ii = i & 255;
	        var jj = j & 255;
	        // Calculate the contribution from the three corners
	        var t0 = 0.5 - x0 * x0 - y0 * y0;
	        if (t0 >= 0) {
	            var gi0 = permMod12[ii + perm[jj]] * 3;
	            t0 *= t0;
	            n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0); // (x,y) of grad3 used for 2D gradient
	        }
	        var t1 = 0.5 - x1 * x1 - y1 * y1;
	        if (t1 >= 0) {
	            var gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
	            t1 *= t1;
	            n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
	        }
	        var t2 = 0.5 - x2 * x2 - y2 * y2;
	        if (t2 >= 0) {
	            var gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
	            t2 *= t2;
	            n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
	        }
	        // Add contributions from each corner to get the final noise value.
	        // The result is scaled to return values in the interval [-1,1].
	        return 70.0 * (n0 + n1 + n2);
	    },
	    // 3D simplex noise
	    noise3D: function (xin, yin, zin) {
	        var permMod12 = this.permMod12,
	            perm = this.perm,
	            grad3 = this.grad3;
	        var n0, n1, n2, n3; // Noise contributions from the four corners
	        // Skew the input space to determine which simplex cell we're in
	        var s = (xin + yin + zin) * F3; // Very nice and simple skew factor for 3D
	        var i = Math.floor(xin + s);
	        var j = Math.floor(yin + s);
	        var k = Math.floor(zin + s);
	        var t = (i + j + k) * G3;
	        var X0 = i - t; // Unskew the cell origin back to (x,y,z) space
	        var Y0 = j - t;
	        var Z0 = k - t;
	        var x0 = xin - X0; // The x,y,z distances from the cell origin
	        var y0 = yin - Y0;
	        var z0 = zin - Z0;
	        // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
	        // Determine which simplex we are in.
	        var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
	        var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
	        if (x0 >= y0) {
	            if (y0 >= z0) {
	                i1 = 1;
	                j1 = 0;
	                k1 = 0;
	                i2 = 1;
	                j2 = 1;
	                k2 = 0;
	            } // X Y Z order
	            else if (x0 >= z0) {
	                i1 = 1;
	                j1 = 0;
	                k1 = 0;
	                i2 = 1;
	                j2 = 0;
	                k2 = 1;
	            } // X Z Y order
	            else {
	                i1 = 0;
	                j1 = 0;
	                k1 = 1;
	                i2 = 1;
	                j2 = 0;
	                k2 = 1;
	            } // Z X Y order
	        }
	        else { // x0<y0
	            if (y0 < z0) {
	                i1 = 0;
	                j1 = 0;
	                k1 = 1;
	                i2 = 0;
	                j2 = 1;
	                k2 = 1;
	            } // Z Y X order
	            else if (x0 < z0) {
	                i1 = 0;
	                j1 = 1;
	                k1 = 0;
	                i2 = 0;
	                j2 = 1;
	                k2 = 1;
	            } // Y Z X order
	            else {
	                i1 = 0;
	                j1 = 1;
	                k1 = 0;
	                i2 = 1;
	                j2 = 1;
	                k2 = 0;
	            } // Y X Z order
	        }
	        // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
	        // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
	        // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
	        // c = 1/6.
	        var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
	        var y1 = y0 - j1 + G3;
	        var z1 = z0 - k1 + G3;
	        var x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords
	        var y2 = y0 - j2 + 2.0 * G3;
	        var z2 = z0 - k2 + 2.0 * G3;
	        var x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords
	        var y3 = y0 - 1.0 + 3.0 * G3;
	        var z3 = z0 - 1.0 + 3.0 * G3;
	        // Work out the hashed gradient indices of the four simplex corners
	        var ii = i & 255;
	        var jj = j & 255;
	        var kk = k & 255;
	        // Calculate the contribution from the four corners
	        var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
	        if (t0 < 0) n0 = 0.0;
	        else {
	            var gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
	            t0 *= t0;
	            n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
	        }
	        var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
	        if (t1 < 0) n1 = 0.0;
	        else {
	            var gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
	            t1 *= t1;
	            n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
	        }
	        var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
	        if (t2 < 0) n2 = 0.0;
	        else {
	            var gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
	            t2 *= t2;
	            n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
	        }
	        var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
	        if (t3 < 0) n3 = 0.0;
	        else {
	            var gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
	            t3 *= t3;
	            n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
	        }
	        // Add contributions from each corner to get the final noise value.
	        // The result is scaled to stay just inside [-1,1]
	        return 32.0 * (n0 + n1 + n2 + n3);
	    },
	    // 4D simplex noise, better simplex rank ordering method 2012-03-09
	    noise4D: function (x, y, z, w) {
	        var permMod12 = this.permMod12,
	            perm = this.perm,
	            grad4 = this.grad4;
	
	        var n0, n1, n2, n3, n4; // Noise contributions from the five corners
	        // Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in
	        var s = (x + y + z + w) * F4; // Factor for 4D skewing
	        var i = Math.floor(x + s);
	        var j = Math.floor(y + s);
	        var k = Math.floor(z + s);
	        var l = Math.floor(w + s);
	        var t = (i + j + k + l) * G4; // Factor for 4D unskewing
	        var X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space
	        var Y0 = j - t;
	        var Z0 = k - t;
	        var W0 = l - t;
	        var x0 = x - X0; // The x,y,z,w distances from the cell origin
	        var y0 = y - Y0;
	        var z0 = z - Z0;
	        var w0 = w - W0;
	        // For the 4D case, the simplex is a 4D shape I won't even try to describe.
	        // To find out which of the 24 possible simplices we're in, we need to
	        // determine the magnitude ordering of x0, y0, z0 and w0.
	        // Six pair-wise comparisons are performed between each possible pair
	        // of the four coordinates, and the results are used to rank the numbers.
	        var rankx = 0;
	        var ranky = 0;
	        var rankz = 0;
	        var rankw = 0;
	        if (x0 > y0) rankx++;
	        else ranky++;
	        if (x0 > z0) rankx++;
	        else rankz++;
	        if (x0 > w0) rankx++;
	        else rankw++;
	        if (y0 > z0) ranky++;
	        else rankz++;
	        if (y0 > w0) ranky++;
	        else rankw++;
	        if (z0 > w0) rankz++;
	        else rankw++;
	        var i1, j1, k1, l1; // The integer offsets for the second simplex corner
	        var i2, j2, k2, l2; // The integer offsets for the third simplex corner
	        var i3, j3, k3, l3; // The integer offsets for the fourth simplex corner
	        // simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
	        // Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
	        // impossible. Only the 24 indices which have non-zero entries make any sense.
	        // We use a thresholding to set the coordinates in turn from the largest magnitude.
	        // Rank 3 denotes the largest coordinate.
	        i1 = rankx >= 3 ? 1 : 0;
	        j1 = ranky >= 3 ? 1 : 0;
	        k1 = rankz >= 3 ? 1 : 0;
	        l1 = rankw >= 3 ? 1 : 0;
	        // Rank 2 denotes the second largest coordinate.
	        i2 = rankx >= 2 ? 1 : 0;
	        j2 = ranky >= 2 ? 1 : 0;
	        k2 = rankz >= 2 ? 1 : 0;
	        l2 = rankw >= 2 ? 1 : 0;
	        // Rank 1 denotes the second smallest coordinate.
	        i3 = rankx >= 1 ? 1 : 0;
	        j3 = ranky >= 1 ? 1 : 0;
	        k3 = rankz >= 1 ? 1 : 0;
	        l3 = rankw >= 1 ? 1 : 0;
	        // The fifth corner has all coordinate offsets = 1, so no need to compute that.
	        var x1 = x0 - i1 + G4; // Offsets for second corner in (x,y,z,w) coords
	        var y1 = y0 - j1 + G4;
	        var z1 = z0 - k1 + G4;
	        var w1 = w0 - l1 + G4;
	        var x2 = x0 - i2 + 2.0 * G4; // Offsets for third corner in (x,y,z,w) coords
	        var y2 = y0 - j2 + 2.0 * G4;
	        var z2 = z0 - k2 + 2.0 * G4;
	        var w2 = w0 - l2 + 2.0 * G4;
	        var x3 = x0 - i3 + 3.0 * G4; // Offsets for fourth corner in (x,y,z,w) coords
	        var y3 = y0 - j3 + 3.0 * G4;
	        var z3 = z0 - k3 + 3.0 * G4;
	        var w3 = w0 - l3 + 3.0 * G4;
	        var x4 = x0 - 1.0 + 4.0 * G4; // Offsets for last corner in (x,y,z,w) coords
	        var y4 = y0 - 1.0 + 4.0 * G4;
	        var z4 = z0 - 1.0 + 4.0 * G4;
	        var w4 = w0 - 1.0 + 4.0 * G4;
	        // Work out the hashed gradient indices of the five simplex corners
	        var ii = i & 255;
	        var jj = j & 255;
	        var kk = k & 255;
	        var ll = l & 255;
	        // Calculate the contribution from the five corners
	        var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
	        if (t0 < 0) n0 = 0.0;
	        else {
	            var gi0 = (perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32) * 4;
	            t0 *= t0;
	            n0 = t0 * t0 * (grad4[gi0] * x0 + grad4[gi0 + 1] * y0 + grad4[gi0 + 2] * z0 + grad4[gi0 + 3] * w0);
	        }
	        var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
	        if (t1 < 0) n1 = 0.0;
	        else {
	            var gi1 = (perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32) * 4;
	            t1 *= t1;
	            n1 = t1 * t1 * (grad4[gi1] * x1 + grad4[gi1 + 1] * y1 + grad4[gi1 + 2] * z1 + grad4[gi1 + 3] * w1);
	        }
	        var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
	        if (t2 < 0) n2 = 0.0;
	        else {
	            var gi2 = (perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32) * 4;
	            t2 *= t2;
	            n2 = t2 * t2 * (grad4[gi2] * x2 + grad4[gi2 + 1] * y2 + grad4[gi2 + 2] * z2 + grad4[gi2 + 3] * w2);
	        }
	        var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
	        if (t3 < 0) n3 = 0.0;
	        else {
	            var gi3 = (perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32) * 4;
	            t3 *= t3;
	            n3 = t3 * t3 * (grad4[gi3] * x3 + grad4[gi3 + 1] * y3 + grad4[gi3 + 2] * z3 + grad4[gi3 + 3] * w3);
	        }
	        var t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
	        if (t4 < 0) n4 = 0.0;
	        else {
	            var gi4 = (perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32) * 4;
	            t4 *= t4;
	            n4 = t4 * t4 * (grad4[gi4] * x4 + grad4[gi4 + 1] * y4 + grad4[gi4 + 2] * z4 + grad4[gi4 + 3] * w4);
	        }
	        // Sum up and scale the result to cover the range [-1,1]
	        return 27.0 * (n0 + n1 + n2 + n3 + n4);
	    }
	
	
	};
	
	// amd
	if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = function(){return SimplexNoise;}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//common js
	if (true) exports.SimplexNoise = SimplexNoise;
	// browser
	else if (typeof window !== 'undefined') window.SimplexNoise = SimplexNoise;
	// nodejs
	if (true) {
	    module.exports = SimplexNoise;
	}
	
	})();


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _loop = __webpack_require__(5);
	
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.createLoop = createLoop;
	
	var _rAF = __webpack_require__(6);
	
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
/* 6 */
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