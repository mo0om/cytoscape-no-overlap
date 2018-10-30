(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cytoscapeNoOverlap"] = factory();
	else
		root["cytoscapeNoOverlap"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines on which position to draw the node
 * (top, bottom, left, right)
 * @param {CytoscapeElement} node The node
 * @param {CytoscapeElement} node The node
 * @returns {string} Returns the position
 */
function findPosition(movingNode, fixedNode) {
    var moving = movingNode.boundingBox();
    var fixed = fixedNode.boundingBox();

    var movingMiddleOfNode = {
        x: moving.x1 + moving.w / 2,
        y: moving.y1 + moving.h / 2
    };
    var fixedMiddleOfNode = {
        x: fixed.x1 + fixed.w / 2,
        y: fixed.y1 + fixed.h / 2
    };
    var finalPosition = '';
    if (movingMiddleOfNode.y > fixedMiddleOfNode.y && Math.abs(movingMiddleOfNode.y - fixedMiddleOfNode.y) > Math.abs(movingMiddleOfNode.x - fixedMiddleOfNode.x)) {
        finalPosition = 'bottom';
    } else if (movingMiddleOfNode.y < fixedMiddleOfNode.y && Math.abs(movingMiddleOfNode.y - fixedMiddleOfNode.y) > Math.abs(movingMiddleOfNode.x - fixedMiddleOfNode.x)) {
        finalPosition = 'top';
    } else if (movingMiddleOfNode.x > fixedMiddleOfNode.x && Math.abs(movingMiddleOfNode.x - fixedMiddleOfNode.x) > Math.abs(movingMiddleOfNode.y - fixedMiddleOfNode.y)) {
        finalPosition += 'right';
    } else if (movingMiddleOfNode.x < fixedMiddleOfNode.x && Math.abs(movingMiddleOfNode.x - fixedMiddleOfNode.x) > Math.abs(movingMiddleOfNode.y - fixedMiddleOfNode.y)) {
        finalPosition += 'left';
    }
    return finalPosition;
}

module.exports = function () {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$padding = _ref.padding,
        padding = _ref$padding === undefined ? 0 : _ref$padding;

    var eles = this;
    var cy = this.cy();

    eles.on('drag', function (evt) {
        // boundingBox() is not returnin the right width and height
        var currentPosition = {
            x1: evt.target.position().x - evt.target.width() / 2,
            x2: evt.target.position().x + evt.target.width() / 2,
            y1: evt.target.position().y - evt.target.height() / 2,
            y2: evt.target.position().y + evt.target.height() / 2,
            w: evt.target.width(),
            h: evt.target.height()
        };
        var overlappingNode = null;

        cy.nodes().forEach(function (aNode) {
            if (aNode.id() === evt.target.id()) {
                return;
            }
            var bb = JSON.parse(JSON.stringify(aNode.boundingbox()));
            bb.x1 -= padding;
            bb.x2 += padding;
            bb.y1 -= padding;
            bb.y2 += padding;
            // bottom right
            if (currentPosition.x1 < bb.x2 && currentPosition.x1 > bb.x1 && currentPosition.y1 < bb.y2 && currentPosition.y1 > bb.y1) {
                overlappingNode = aNode;
            }
            // bottom left
            if (currentPosition.x2 < bb.x2 && currentPosition.x2 > bb.x1 && currentPosition.y1 < bb.y2 && currentPosition.y1 > bb.y1) {
                overlappingNode = aNode;
            }
            // top left
            if (currentPosition.x2 < bb.x2 && currentPosition.x2 > bb.x1 && currentPosition.y2 > bb.y1 && currentPosition.y2 < bb.y2) {
                overlappingNode = aNode;
            }
            // top right
            if (currentPosition.x1 < bb.x2 && currentPosition.x1 > bb.x1 && currentPosition.y2 < bb.y2 && currentPosition.y2 > bb.y1) {
                overlappingNode = aNode;
            }
        });
        if (overlappingNode) {
            var position = findPosition(evt.target, overlappingNode);
            var overlappingBB = JSON.parse(JSON.stringify(overlappingNode.boundingBox()));
            overlappingBB.x1 -= padding;
            overlappingBB.x2 += padding;
            overlappingBB.y1 -= padding;
            overlappingBB.y2 += padding;

            var finalPos = { x: 0, y: 0 };
            switch (position) {
                case 'top':
                    finalPos = {
                        x: currentPosition.x1 + currentPosition.w / 2,
                        y: overlappingBB.y1 - currentPosition.h / 2
                    };
                    break;
                case 'right':
                    finalPos = {
                        x: overlappingBB.x2 + currentPosition.w / 2,
                        y: currentPosition.y1 + currentPosition.w / 2
                    };
                    break;
                case 'bottom':
                    finalPos = {
                        x: currentPosition.x1 + currentPosition.w / 2,
                        y: overlappingBB.y2 + currentPosition.h / 2
                    };
                    break;
                case 'left':
                    finalPos = {
                        x: overlappingBB.x1 - currentPosition.w / 2,
                        y: currentPosition.y1 + currentPosition.h / 2
                    };
                    break;
            }
            evt.target.position(finalPos);
            return;
        }
    });

    return this; // chainability
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var impl = __webpack_require__(0);

// registers the extension on a cytoscape lib ref
var register = function register(cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified

  cytoscape('collection', 'noOverlap', impl); // register with cytoscape.js
};

if (typeof cytoscape !== 'undefined') {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(cytoscape);
}

module.exports = register;

/***/ })
/******/ ]);
});