/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var canvasPolygon = __webpack_require__(1),
	    canvas = document.getElementById('canvas'),
	    options = {};

	options.points = Array.apply(null, {length: 17}).map(function (d, i, arr) {
	    return {
	        x: 150 + 100 * Math.cos(Math.PI * 2 * i / arr.length),
	        y: 150 + 100 * Math.sin(Math.PI * 2 * i / arr.length),
	    };
	});

	canvasPolygon(canvas, options).draw();


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = function (canvas, options) {
	    var obj = {},
	        points = [],
	        width = canvas.width,
	        height = canvas.height,
	        ctx = canvas.getContext('2d');

	    if (options && options.points) {
	        loadPoints(options.points);
	    }

	    function loadPoints (dots) {
	        return points = dots;
	    }

	    function clearRect () {
	        ctx.clearRect(0, 0, width, height);
	        ctx.rect(0, 0, width, height);
	        ctx.fillStyle = 'rgb(0, 0, 120)';
	        ctx.fill();
	    }

	    function drawPolygon () {
	        ctx.beginPath();
	        points.forEach(function (p, i) {
	            if (!i) {
	                return ctx.moveTo(p.x, p.y);
	            }  
	            return ctx.lineTo(p.x, p.y);
	        });
	        ctx.closePath();
	        ctx.strokeStyle = 'rgb(255, 0, 0)';
	        ctx.stroke();
	        ctx.fillStyle = 'rgba(255, 0, 0, .2)';
	        ctx.fill();
	    }

	    function drawDots () {
	        points.forEach(function (d) {
	            ctx.beginPath();
	            ctx.arc(d.x, d.y, 6, 0, Math.PI * 2);
	            ctx.fillStyle = 'rgb(255, 0, 0)';
	            ctx.fill();
	            ctx.closePath();
	        });
	    }


	    obj.draw = function () {
	        clearRect();
	        drawPolygon();
	        drawDots();
	    }

	    return obj
	}


/***/ }
/******/ ]);