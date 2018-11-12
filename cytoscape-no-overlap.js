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
 * Verifies each points of the bounding box (a) and looks if any of these points are inside the second bounding box (b)
 * @param {CytoscapeElement} a Node to compare
 * @param {CytoscapeElement} b Node to compare
 * @returns {boolean} Return true if node a overlaps node b
 */
function compareNodes(a, b) {
    var isOverlapping = false;
    // bottom right
    if (a.x1 < b.x2 && a.x1 > b.x1 && a.y1 < b.y2 && a.y1 > b.y1) {
        isOverlapping = true;
    }
    // bottom left
    if (a.x2 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y1 > b.y1) {
        isOverlapping = true;
    }
    // top left
    if (a.x2 < b.x2 && a.x2 > b.x1 && a.y2 > b.y1 && a.y2 < b.y2) {
        isOverlapping = true;
    }
    // top right
    if (a.x1 < b.x2 && a.x1 > b.x1 && a.y2 < b.y2 && a.y2 > b.y1) {
        isOverlapping = true;
    }
    return isOverlapping;
}

/**
 * Recursively checks if a node or it's parent overlaps any of the shown nodes
 * @param {CytoscapeElement} node The node to verify
 * @param {number} padding A bigger padding will make the overlap happen before
 * @returns {boolean} True if the node overlaps any of the other nodes
 */
function checkIfOverlaps(node, padding) {
    var siblings = void 0;
    if (node.isChild()) {
        siblings = node.parent().children().difference(node);
    } else {
        siblings = node.cy().nodes().orphans().difference(node);
    }
    var isOverlapping = false;
    siblings.forEach(function (neighbor) {
        var neighborBB = {
            w: neighbor.renderedOuterWidth(),
            h: neighbor.renderedOuterHeight(),
            x1: neighbor.renderedPoint().x - neighbor.renderedOuterWidth() / 2 - padding,
            x2: neighbor.renderedPoint().x + neighbor.renderedOuterWidth() / 2 + padding,
            y1: neighbor.renderedPoint().y - neighbor.renderedOuterHeight() / 2 - padding,
            y2: neighbor.renderedPoint().y + neighbor.renderedOuterHeight() / 2 + padding
        };
        var currentNodeBB = {
            w: node.renderedOuterWidth(),
            h: node.renderedOuterHeight(),
            x1: node.renderedPoint().x - node.renderedOuterWidth() / 2 - padding,
            x2: node.renderedPoint().x + node.renderedOuterWidth() / 2 + padding,
            y1: node.renderedPoint().y - node.renderedOuterHeight() / 2 - padding,
            y2: node.renderedPoint().y + node.renderedOuterHeight() / 2 + padding
        };
        if (compareNodes(currentNodeBB, neighborBB)) {
            isOverlapping = true;
        }
        if (compareNodes(neighborBB, currentNodeBB)) {
            isOverlapping = true;
        }
    });
    if (node.parent().length > 0) {
        if (checkIfOverlaps(node.parent(), padding)) {
            isOverlapping = true;
        }
    }
    return isOverlapping;
}

module.exports = function () {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$padding = _ref.padding,
        padding = _ref$padding === undefined ? 0 : _ref$padding;

    this.on('drag', function (evt) {
        if (checkIfOverlaps(evt.target, padding)) {
            evt.target.position(evt.target.scratch('previousPosition'));
        } else {
            evt.target.scratch('previousPosition', JSON.parse(JSON.stringify(evt.target.position())));
        }
    });

    return this;
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
  register(window.cytoscape);
}

module.exports = register;

/***/ })
/******/ ]);
});