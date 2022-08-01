/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@popperjs/core/lib/createPopper.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/createPopper.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPopper": () => (/* binding */ createPopper),
/* harmony export */   "detectOverflow": () => (/* reexport safe */ _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_13__["default"]),
/* harmony export */   "popperGenerator": () => (/* binding */ popperGenerator)
/* harmony export */ });
/* harmony import */ var _dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./dom-utils/getCompositeRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom-utils/listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./dom-utils/getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/orderModifiers.js */ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js");
/* harmony import */ var _utils_debounce_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./utils/debounce.js */ "./node_modules/@popperjs/core/lib/utils/debounce.js");
/* harmony import */ var _utils_validateModifiers_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/validateModifiers.js */ "./node_modules/@popperjs/core/lib/utils/validateModifiers.js");
/* harmony import */ var _utils_uniqueBy_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/uniqueBy.js */ "./node_modules/@popperjs/core/lib/utils/uniqueBy.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/mergeByName.js */ "./node_modules/@popperjs/core/lib/utils/mergeByName.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./enums.js */ "./node_modules/@popperjs/core/lib/enums.js");














var INVALID_ELEMENT_ERROR = 'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.';
var INFINITE_LOOP_ERROR = 'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.';
var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: (0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(reference) ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference) : reference.contextElement ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference.contextElement) : [],
          popper: (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = (0,_utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__["default"])([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        }); // Validate the provided modifiers so that the consumer will get warned
        // if one of the modifiers is invalid for any reason

        if (true) {
          var modifiers = (0,_utils_uniqueBy_js__WEBPACK_IMPORTED_MODULE_4__["default"])([].concat(orderedModifiers, state.options.modifiers), function (_ref) {
            var name = _ref.name;
            return name;
          });
          (0,_utils_validateModifiers_js__WEBPACK_IMPORTED_MODULE_5__["default"])(modifiers);

          if ((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.options.placement) === _enums_js__WEBPACK_IMPORTED_MODULE_7__.auto) {
            var flipModifier = state.orderedModifiers.find(function (_ref2) {
              var name = _ref2.name;
              return name === 'flip';
            });

            if (!flipModifier) {
              console.error(['Popper: "auto" placements require the "flip" modifier be', 'present and enabled to work.'].join(' '));
            }
          }

          var _getComputedStyle = (0,_dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_8__["default"])(popper),
              marginTop = _getComputedStyle.marginTop,
              marginRight = _getComputedStyle.marginRight,
              marginBottom = _getComputedStyle.marginBottom,
              marginLeft = _getComputedStyle.marginLeft; // We no longer take into account `margins` on the popper, and it can
          // cause bugs with positioning, so we'll warn the consumer


          if ([marginTop, marginRight, marginBottom, marginLeft].some(function (margin) {
            return parseFloat(margin);
          })) {
            console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', 'between the popper and its reference element or boundary.', 'To replicate margin, use the `offset` modifier, as well as', 'the `padding` option in the `preventOverflow` and `flip`', 'modifiers.'].join(' '));
          }
        }

        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          if (true) {
            console.error(INVALID_ELEMENT_ERROR);
          }

          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: (0,_dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_9__["default"])(reference, (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__["default"])(popper), state.options.strategy === 'fixed'),
          popper: (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_11__["default"])(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        var __debug_loops__ = 0;

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (true) {
            __debug_loops__ += 1;

            if (__debug_loops__ > 100) {
              console.error(INFINITE_LOOP_ERROR);
              break;
            }
          }

          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: (0,_utils_debounce_js__WEBPACK_IMPORTED_MODULE_12__["default"])(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      if (true) {
        console.error(INVALID_ELEMENT_ERROR);
      }

      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref3) {
        var name = _ref3.name,
            _ref3$options = _ref3.options,
            options = _ref3$options === void 0 ? {} : _ref3$options,
            effect = _ref3.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}
var createPopper = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/contains.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/contains.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ contains)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getBoundingClientRect)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");


function getBoundingClientRect(element, includeScale) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  var rect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) && includeScale) {
    var offsetHeight = element.offsetHeight;
    var offsetWidth = element.offsetWidth; // Do not attempt to divide by 0, otherwise we get `Infinity` as scale
    // Fallback to 1 in case both values are `0`

    if (offsetWidth > 0) {
      scaleX = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(rect.width) / offsetWidth || 1;
    }

    if (offsetHeight > 0) {
      scaleY = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(rect.height) / offsetHeight || 1;
    }
  }

  return {
    width: rect.width / scaleX,
    height: rect.height / scaleY,
    top: rect.top / scaleY,
    right: rect.right / scaleX,
    bottom: rect.bottom / scaleY,
    left: rect.left / scaleX,
    x: rect.left / scaleX,
    y: rect.top / scaleY
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getClippingRect)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getViewportRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js");
/* harmony import */ var _getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getDocumentRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js");
/* harmony import */ var _listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _contains_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");















function getInnerBoundingClientRect(element) {
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent) {
  return clippingParent === _enums_js__WEBPACK_IMPORTED_MODULE_1__.viewport ? (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element)) : (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clippingParent) ? getInnerBoundingClientRect(clippingParent) : (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = (0,_listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_8__["default"])(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__["default"])(element).position) >= 0;
  var clipperElement = canEscapeClipping && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isHTMLElement)(element) ? (0,_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__["default"])(element) : element;

  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clippingParent) && (0,_contains_js__WEBPACK_IMPORTED_MODULE_11__["default"])(clippingParent, clipperElement) && (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_12__["default"])(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent);
    accRect.top = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.top, accRect.top);
    accRect.right = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.right, accRect.right);
    accRect.bottom = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.bottom, accRect.bottom);
    accRect.left = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getCompositeRect)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getNodeScroll_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getNodeScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");









function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(rect.width) / element.offsetWidth || 1;
  var scaleY = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent);
  var offsetParentIsScaled = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent) && isElementScaled(offsetParent);
  var documentElement = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(offsetParent);
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(elementOrVirtualElement, offsetParentIsScaled);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_5__["default"])(documentElement)) {
      scroll = (0,_getNodeScroll_js__WEBPACK_IMPORTED_MODULE_6__["default"])(offsetParent);
    }

    if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent)) {
      offsets = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_7__["default"])(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getComputedStyle)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getComputedStyle(element) {
  return (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element).getComputedStyle(element);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getDocumentElement)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return (((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getDocumentRect)
/* harmony export */ });
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");




 // Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var winScroll = (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element);
  var y = -winScroll.scrollTop;

  if ((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__["default"])(body || html).direction === 'rtl') {
    x += (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getHTMLElementScroll)
/* harmony export */ });
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getLayoutRect)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
 // Returns the layout rect of an element relative to its offsetParent. Layout
// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getNodeName)
/* harmony export */ });
function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getNodeScroll)
/* harmony export */ });
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getHTMLElementScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js");




function getNodeScroll(node) {
  if (node === (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node) || !(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node)) {
    return (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node);
  } else {
    return (0,_getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node);
  }
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOffsetParent)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _isTableElement_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isTableElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");







function getTrueOffsetParent(element) {
  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || // https://github.com/popperjs/popper-core/issues/837
  (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
  var isIE = navigator.userAgent.indexOf('Trident') !== -1;

  if (isIE && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = (0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element);

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(currentNode)) {
    currentNode = currentNode.host;
  }

  while ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(currentNode) && ['html', 'body'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_3__["default"])(currentNode)) < 0) {
    var css = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_4__["default"])(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && (0,_isTableElement_js__WEBPACK_IMPORTED_MODULE_5__["default"])(offsetParent) && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_3__["default"])(offsetParent) === 'html' || (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_3__["default"])(offsetParent) === 'body' && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getParentNode)
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");



function getParentNode(element) {
  if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isShadowRoot)(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element) // fallback

  );
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getScrollParent)
/* harmony export */ });
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");




function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node) && (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node)) {
    return node;
  }

  return getScrollParent((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getViewportRect)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");



function getViewportRect(element) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
  // can be obscured underneath it.
  // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
  // if it isn't open, so if this isn't available, the popper will be detected
  // to overflow the bottom of the screen too early.

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
    // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
    // errors due to floating point numbers, so we need to check precision.
    // Safari returns a number <= 0, usually < -1 when pinch-zoomed
    // Feature detection fails in mobile emulation mode in Chrome.
    // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
    // 0.001
    // Fallback here: "Not Safari" userAgent

    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element),
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js":
/*!****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindow.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindow)
/* harmony export */ });
function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindowScroll)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getWindowScroll(node) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindowScrollBarX)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");



function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)).left + (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element).scrollLeft;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isElement": () => (/* binding */ isElement),
/* harmony export */   "isHTMLElement": () => (/* binding */ isHTMLElement),
/* harmony export */   "isShadowRoot": () => (/* binding */ isShadowRoot)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");


function isElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isScrollParent)
/* harmony export */ });
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isTableElement)
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element)) >= 0;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js":
/*!************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ listScrollParents)
/* harmony export */ });
/* harmony import */ var _getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");




/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = (0,_getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(target)));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/enums.js":
/*!**************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/enums.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "afterMain": () => (/* binding */ afterMain),
/* harmony export */   "afterRead": () => (/* binding */ afterRead),
/* harmony export */   "afterWrite": () => (/* binding */ afterWrite),
/* harmony export */   "auto": () => (/* binding */ auto),
/* harmony export */   "basePlacements": () => (/* binding */ basePlacements),
/* harmony export */   "beforeMain": () => (/* binding */ beforeMain),
/* harmony export */   "beforeRead": () => (/* binding */ beforeRead),
/* harmony export */   "beforeWrite": () => (/* binding */ beforeWrite),
/* harmony export */   "bottom": () => (/* binding */ bottom),
/* harmony export */   "clippingParents": () => (/* binding */ clippingParents),
/* harmony export */   "end": () => (/* binding */ end),
/* harmony export */   "left": () => (/* binding */ left),
/* harmony export */   "main": () => (/* binding */ main),
/* harmony export */   "modifierPhases": () => (/* binding */ modifierPhases),
/* harmony export */   "placements": () => (/* binding */ placements),
/* harmony export */   "popper": () => (/* binding */ popper),
/* harmony export */   "read": () => (/* binding */ read),
/* harmony export */   "reference": () => (/* binding */ reference),
/* harmony export */   "right": () => (/* binding */ right),
/* harmony export */   "start": () => (/* binding */ start),
/* harmony export */   "top": () => (/* binding */ top),
/* harmony export */   "variationPlacements": () => (/* binding */ variationPlacements),
/* harmony export */   "viewport": () => (/* binding */ viewport),
/* harmony export */   "write": () => (/* binding */ write)
/* harmony export */ });
var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/index.js":
/*!**************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "afterMain": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterMain),
/* harmony export */   "afterRead": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterRead),
/* harmony export */   "afterWrite": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterWrite),
/* harmony export */   "applyStyles": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.applyStyles),
/* harmony export */   "arrow": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.arrow),
/* harmony export */   "auto": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.auto),
/* harmony export */   "basePlacements": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements),
/* harmony export */   "beforeMain": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeMain),
/* harmony export */   "beforeRead": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeRead),
/* harmony export */   "beforeWrite": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeWrite),
/* harmony export */   "bottom": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom),
/* harmony export */   "clippingParents": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.clippingParents),
/* harmony export */   "computeStyles": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.computeStyles),
/* harmony export */   "createPopper": () => (/* reexport safe */ _popper_js__WEBPACK_IMPORTED_MODULE_4__.createPopper),
/* harmony export */   "createPopperBase": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_2__.createPopper),
/* harmony export */   "createPopperLite": () => (/* reexport safe */ _popper_lite_js__WEBPACK_IMPORTED_MODULE_5__.createPopper),
/* harmony export */   "detectOverflow": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "end": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.end),
/* harmony export */   "eventListeners": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.eventListeners),
/* harmony export */   "flip": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.flip),
/* harmony export */   "hide": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.hide),
/* harmony export */   "left": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.left),
/* harmony export */   "main": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.main),
/* harmony export */   "modifierPhases": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.modifierPhases),
/* harmony export */   "offset": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.offset),
/* harmony export */   "placements": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.placements),
/* harmony export */   "popper": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper),
/* harmony export */   "popperGenerator": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_2__.popperGenerator),
/* harmony export */   "popperOffsets": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.popperOffsets),
/* harmony export */   "preventOverflow": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.preventOverflow),
/* harmony export */   "read": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.read),
/* harmony export */   "reference": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.reference),
/* harmony export */   "right": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.right),
/* harmony export */   "start": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.start),
/* harmony export */   "top": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.top),
/* harmony export */   "variationPlacements": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements),
/* harmony export */   "viewport": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.viewport),
/* harmony export */   "write": () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.write)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/index.js */ "./node_modules/@popperjs/core/lib/modifiers/index.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _popper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./popper.js */ "./node_modules/@popperjs/core/lib/popper.js");
/* harmony import */ var _popper_lite_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./popper-lite.js */ "./node_modules/@popperjs/core/lib/popper-lite.js");

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/applyStyles.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom-utils/getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

 // This modifier takes the styles prepared by the `computeStyles` modifier
// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect,
  requires: ['computeStyles']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/arrow.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/arrow.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../dom-utils/contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");









 // eslint-disable-next-line import/no-unused-modules

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return (0,_utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(typeof padding !== 'number' ? padding : (0,_utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_2__.basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(state.placement);
  var axis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(basePlacement);
  var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_2__.left, _enums_js__WEBPACK_IMPORTED_MODULE_2__.right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])(arrowElement);
  var minProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.top : _enums_js__WEBPACK_IMPORTED_MODULE_2__.left;
  var maxProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_2__.right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_7__.within)(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (true) {
    if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_8__.isHTMLElement)(arrowElement)) {
      console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', 'To use an SVG arrow, wrap it in an HTMLElement that will be used as', 'the arrow.'].join(' '));
    }
  }

  if (!(0,_dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_9__["default"])(state.elements.popper, arrowElement)) {
    if (true) {
      console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', 'element.'].join(' '));
    }

    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/computeStyles.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "mapToStyles": () => (/* binding */ mapToStyles)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");







 // eslint-disable-next-line import/no-unused-modules

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref) {
  var x = _ref.x,
      y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(x * dpr) / dpr || 0,
    y: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
      x = _offsets$x === void 0 ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === void 0 ? 0 : _offsets$y;

  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.left;
  var sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;
  var win = window;

  if (adaptive) {
    var offsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__["default"])(popper)) {
      offsetParent = (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(popper);

      if ((0,_dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__["default"])(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.right) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
      sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
      sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref4.x;
  y = _ref4.y;

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref5) {
  var state = _ref5.state,
      options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

  if (true) {
    var transitionProperty = (0,_dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__["default"])(state.elements.popper).transitionProperty || '';

    if (adaptive && ['transform', 'top', 'right', 'bottom', 'left'].some(function (property) {
      return transitionProperty.indexOf(property) >= 0;
    })) {
      console.warn(['Popper: Detected CSS transitions on at least one of the following', 'CSS properties: "transform", "top", "right", "bottom", "left".', '\n\n', 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', 'for smooth transitions, or remove these properties from the CSS', 'transition declaration on the popper element if only transitioning', 'opacity or background-color for example.', '\n\n', 'We recommend using the popper element as a wrapper around an inner', 'element that can have any CSS property transitioned for animations.'].join(' '));
    }
  }

  var commonStyles = {
    placement: (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.placement),
    variation: (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__["default"])(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/eventListeners.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
 // eslint-disable-next-line import/no-unused-modules

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/flip.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/flip.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getOppositePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getOppositeVariationPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/computeAutoPlacement.js */ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");






 // eslint-disable-next-line import/no-unused-modules

function getExpandedFallbackPlacements(placement) {
  if ((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto) {
    return [];
  }

  var oppositePlacement = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(placement);
  return [(0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement), oppositePlacement, (0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [(0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto ? (0,_utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);

    var isStartVariation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.start;
    var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.top, _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.right : _enums_js__WEBPACK_IMPORTED_MODULE_1__.left : isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
    }

    var altVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/hide.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/hide.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");



function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom, _enums_js__WEBPACK_IMPORTED_MODULE_0__.left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/index.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "applyStyles": () => (/* reexport safe */ _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "arrow": () => (/* reexport safe */ _arrow_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "computeStyles": () => (/* reexport safe */ _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "eventListeners": () => (/* reexport safe */ _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "flip": () => (/* reexport safe */ _flip_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   "hide": () => (/* reexport safe */ _hide_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   "offset": () => (/* reexport safe */ _offset_js__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   "popperOffsets": () => (/* reexport safe */ _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   "preventOverflow": () => (/* reexport safe */ _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__["default"])
/* harmony export */ });
/* harmony import */ var _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _arrow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _flip_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _hide_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _offset_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");










/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/offset.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/offset.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "distanceAndSkiddingToXY": () => (/* binding */ distanceAndSkiddingToXY)
/* harmony export */ });
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");

 // eslint-disable-next-line import/no-unused-modules

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);
  var invertDistance = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = _enums_js__WEBPACK_IMPORTED_MODULE_1__.placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");


function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = (0,_utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getAltAxis.js */ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");












function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state.placement);
  var variation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement);
  var altAxis = (0,_utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__["default"])(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var _offsetModifierState$;

    var mainSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;
    var altSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min = offset + overflow[mainSide];
    var max = offset - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : (0,_utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__["default"])(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.min)(min, tetherMin) : min, offset, tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.max)(max, tetherMax) : max);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _offsetModifierState$2;

    var _mainSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;

    var _altSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;

    var _offset = popperOffsets[altAxis];

    var _len = altAxis === 'y' ? 'height' : 'width';

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var isOriginSide = [_enums_js__WEBPACK_IMPORTED_MODULE_5__.top, _enums_js__WEBPACK_IMPORTED_MODULE_5__.left].indexOf(basePlacement) !== -1;

    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

    var _preventedOffset = tether && isOriginSide ? (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.withinMaxClamp)(_tetherMin, _offset, _tetherMax) : (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper-lite.js":
/*!********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper-lite.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPopper": () => (/* binding */ createPopper),
/* harmony export */   "defaultModifiers": () => (/* binding */ defaultModifiers),
/* harmony export */   "detectOverflow": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   "popperGenerator": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator)
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");





var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper.js":
/*!***************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "applyStyles": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.applyStyles),
/* harmony export */   "arrow": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.arrow),
/* harmony export */   "computeStyles": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.computeStyles),
/* harmony export */   "createPopper": () => (/* binding */ createPopper),
/* harmony export */   "createPopperLite": () => (/* reexport safe */ _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__.createPopper),
/* harmony export */   "defaultModifiers": () => (/* binding */ defaultModifiers),
/* harmony export */   "detectOverflow": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_10__["default"]),
/* harmony export */   "eventListeners": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.eventListeners),
/* harmony export */   "flip": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.flip),
/* harmony export */   "hide": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.hide),
/* harmony export */   "offset": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.offset),
/* harmony export */   "popperGenerator": () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator),
/* harmony export */   "popperOffsets": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.popperOffsets),
/* harmony export */   "preventOverflow": () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.preventOverflow)
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modifiers/offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modifiers/flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modifiers/preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");
/* harmony import */ var _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modifiers/arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modifiers/hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./popper-lite.js */ "./node_modules/@popperjs/core/lib/popper-lite.js");
/* harmony import */ var _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./modifiers/index.js */ "./node_modules/@popperjs/core/lib/modifiers/index.js");










var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"], _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__["default"], _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__["default"], _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"], _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__["default"], _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ computeAutoPlacement)
/* harmony export */ });
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");




function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.placements : _options$allowedAutoP;
  var variation = (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement);
  var placements = variation ? flipVariations ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements : _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements.filter(function (placement) {
    return (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) === variation;
  }) : _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements;
  var allowedPlacements = placements.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements;

    if (true) {
      console.error(['Popper: The `allowedAutoPlacements` option did not allow any', 'placements. Ensure the `placement` option matches the variation', 'of the allowed placements.', 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(' '));
    }
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = (0,_detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[(0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeOffsets.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ computeOffsets)
/* harmony export */ });
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");




function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? (0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) : null;
  var variation = placement ? (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? (0,_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case _enums_js__WEBPACK_IMPORTED_MODULE_2__.start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case _enums_js__WEBPACK_IMPORTED_MODULE_2__.end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;

      default:
    }
  }

  return offsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/debounce.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/debounce.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ debounce)
/* harmony export */ });
function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/detectOverflow.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ detectOverflow)
/* harmony export */ });
/* harmony import */ var _dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getClippingRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");
/* harmony import */ var _rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");








 // eslint-disable-next-line import/no-unused-modules

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = (0,_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(typeof padding !== 'number' ? padding : (0,_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements));
  var altContext = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.reference : _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = (0,_dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])((0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(element) ? element : element.contextElement || (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__["default"])(state.elements.popper), boundary, rootBoundary);
  var referenceClientRect = (0,_dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.elements.reference);
  var popperOffsets = (0,_computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"])({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = (0,_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__["default"])(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/expandToHashMap.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ expandToHashMap)
/* harmony export */ });
function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/format.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/format.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ format)
/* harmony export */ });
function format(str) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return [].concat(args).reduce(function (p, c) {
    return p.replace(/%s/, c);
  }, str);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getAltAxis.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getAltAxis)
/* harmony export */ });
function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getBasePlacement.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getBasePlacement)
/* harmony export */ });

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getFreshSideObject)
/* harmony export */ });
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getMainAxisFromPlacement)
/* harmony export */ });
function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOppositePlacement)
/* harmony export */ });
var hash = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOppositeVariationPlacement)
/* harmony export */ });
var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getVariation.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getVariation.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getVariation)
/* harmony export */ });
function getVariation(placement) {
  return placement.split('-')[1];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/math.js":
/*!*******************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/math.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "max": () => (/* binding */ max),
/* harmony export */   "min": () => (/* binding */ min),
/* harmony export */   "round": () => (/* binding */ round)
/* harmony export */ });
var max = Math.max;
var min = Math.min;
var round = Math.round;

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergeByName.js":
/*!**************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergeByName.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergeByName)
/* harmony export */ });
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergePaddingObject)
/* harmony export */ });
/* harmony import */ var _getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");

function mergePaddingObject(paddingObject) {
  return Object.assign({}, (0,_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(), paddingObject);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/orderModifiers.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ orderModifiers)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
 // source: https://stackoverflow.com/questions/49875255

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return _enums_js__WEBPACK_IMPORTED_MODULE_0__.modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/rectToClientRect.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rectToClientRect)
/* harmony export */ });
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/uniqueBy.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/uniqueBy.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ uniqueBy)
/* harmony export */ });
function uniqueBy(arr, fn) {
  var identifiers = new Set();
  return arr.filter(function (item) {
    var identifier = fn(item);

    if (!identifiers.has(identifier)) {
      identifiers.add(identifier);
      return true;
    }
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/validateModifiers.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/validateModifiers.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ validateModifiers)
/* harmony export */ });
/* harmony import */ var _format_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./format.js */ "./node_modules/@popperjs/core/lib/utils/format.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");


var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
var VALID_PROPERTIES = ['name', 'enabled', 'phase', 'fn', 'effect', 'requires', 'options'];
function validateModifiers(modifiers) {
  modifiers.forEach(function (modifier) {
    [].concat(Object.keys(modifier), VALID_PROPERTIES) // IE11-compatible replacement for `new Set(iterable)`
    .filter(function (value, index, self) {
      return self.indexOf(value) === index;
    }).forEach(function (key) {
      switch (key) {
        case 'name':
          if (typeof modifier.name !== 'string') {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', "\"" + String(modifier.name) + "\""));
          }

          break;

        case 'enabled':
          if (typeof modifier.enabled !== 'boolean') {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', "\"" + String(modifier.enabled) + "\""));
          }

          break;

        case 'phase':
          if (_enums_js__WEBPACK_IMPORTED_MODULE_1__.modifierPhases.indexOf(modifier.phase) < 0) {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + _enums_js__WEBPACK_IMPORTED_MODULE_1__.modifierPhases.join(', '), "\"" + String(modifier.phase) + "\""));
          }

          break;

        case 'fn':
          if (typeof modifier.fn !== 'function') {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'effect':
          if (modifier.effect != null && typeof modifier.effect !== 'function') {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'requires':
          if (modifier.requires != null && !Array.isArray(modifier.requires)) {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', "\"" + String(modifier.requires) + "\""));
          }

          break;

        case 'requiresIfExists':
          if (!Array.isArray(modifier.requiresIfExists)) {
            console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', "\"" + String(modifier.requiresIfExists) + "\""));
          }

          break;

        case 'options':
        case 'data':
          break;

        default:
          console.error("PopperJS: an invalid property has been provided to the \"" + modifier.name + "\" modifier, valid properties are " + VALID_PROPERTIES.map(function (s) {
            return "\"" + s + "\"";
          }).join(', ') + "; but \"" + key + "\" was provided.");
      }

      modifier.requires && modifier.requires.forEach(function (requirement) {
        if (modifiers.find(function (mod) {
          return mod.name === requirement;
        }) == null) {
          console.error((0,_format_js__WEBPACK_IMPORTED_MODULE_0__["default"])(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
        }
      });
    });
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/within.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/within.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "within": () => (/* binding */ within),
/* harmony export */   "withinMaxClamp": () => (/* binding */ withinMaxClamp)
/* harmony export */ });
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");

function within(min, value, max) {
  return (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.max)(min, (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.min)(value, max));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
}

/***/ }),

/***/ "./node_modules/bootstrap/dist/js/bootstrap.esm.js":
/*!*********************************************************!*\
  !*** ./node_modules/bootstrap/dist/js/bootstrap.esm.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Alert": () => (/* binding */ Alert),
/* harmony export */   "Button": () => (/* binding */ Button),
/* harmony export */   "Carousel": () => (/* binding */ Carousel),
/* harmony export */   "Collapse": () => (/* binding */ Collapse),
/* harmony export */   "Dropdown": () => (/* binding */ Dropdown),
/* harmony export */   "Modal": () => (/* binding */ Modal),
/* harmony export */   "Offcanvas": () => (/* binding */ Offcanvas),
/* harmony export */   "Popover": () => (/* binding */ Popover),
/* harmony export */   "ScrollSpy": () => (/* binding */ ScrollSpy),
/* harmony export */   "Tab": () => (/* binding */ Tab),
/* harmony export */   "Toast": () => (/* binding */ Toast),
/* harmony export */   "Tooltip": () => (/* binding */ Tooltip)
/* harmony export */ });
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/index.js");
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/popper.js");
/*!
  * Bootstrap v5.1.3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): util/index.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
const MAX_UID = 1000000;
const MILLISECONDS_MULTIPLIER = 1000;
const TRANSITION_END = 'transitionend'; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

const toType = obj => {
  if (obj === null || obj === undefined) {
    return `${obj}`;
  }

  return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
};
/**
 * --------------------------------------------------------------------------
 * Public Util Api
 * --------------------------------------------------------------------------
 */


const getUID = prefix => {
  do {
    prefix += Math.floor(Math.random() * MAX_UID);
  } while (document.getElementById(prefix));

  return prefix;
};

const getSelector = element => {
  let selector = element.getAttribute('data-bs-target');

  if (!selector || selector === '#') {
    let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
    // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
    // `document.querySelector` will rightfully complain it is invalid.
    // See https://github.com/twbs/bootstrap/issues/32273

    if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) {
      return null;
    } // Just in case some CMS puts out a full URL with the anchor appended


    if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
      hrefAttr = `#${hrefAttr.split('#')[1]}`;
    }

    selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
  }

  return selector;
};

const getSelectorFromElement = element => {
  const selector = getSelector(element);

  if (selector) {
    return document.querySelector(selector) ? selector : null;
  }

  return null;
};

const getElementFromSelector = element => {
  const selector = getSelector(element);
  return selector ? document.querySelector(selector) : null;
};

const getTransitionDurationFromElement = element => {
  if (!element) {
    return 0;
  } // Get transition-duration of the element


  let {
    transitionDuration,
    transitionDelay
  } = window.getComputedStyle(element);
  const floatTransitionDuration = Number.parseFloat(transitionDuration);
  const floatTransitionDelay = Number.parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

  if (!floatTransitionDuration && !floatTransitionDelay) {
    return 0;
  } // If multiple durations are defined, take the first


  transitionDuration = transitionDuration.split(',')[0];
  transitionDelay = transitionDelay.split(',')[0];
  return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
};

const triggerTransitionEnd = element => {
  element.dispatchEvent(new Event(TRANSITION_END));
};

const isElement = obj => {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  if (typeof obj.jquery !== 'undefined') {
    obj = obj[0];
  }

  return typeof obj.nodeType !== 'undefined';
};

const getElement = obj => {
  if (isElement(obj)) {
    // it's a jQuery object or a node element
    return obj.jquery ? obj[0] : obj;
  }

  if (typeof obj === 'string' && obj.length > 0) {
    return document.querySelector(obj);
  }

  return null;
};

const typeCheckConfig = (componentName, config, configTypes) => {
  Object.keys(configTypes).forEach(property => {
    const expectedTypes = configTypes[property];
    const value = config[property];
    const valueType = value && isElement(value) ? 'element' : toType(value);

    if (!new RegExp(expectedTypes).test(valueType)) {
      throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
    }
  });
};

const isVisible = element => {
  if (!isElement(element) || element.getClientRects().length === 0) {
    return false;
  }

  return getComputedStyle(element).getPropertyValue('visibility') === 'visible';
};

const isDisabled = element => {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return true;
  }

  if (element.classList.contains('disabled')) {
    return true;
  }

  if (typeof element.disabled !== 'undefined') {
    return element.disabled;
  }

  return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
};

const findShadowRoot = element => {
  if (!document.documentElement.attachShadow) {
    return null;
  } // Can find the shadow root otherwise it'll return the document


  if (typeof element.getRootNode === 'function') {
    const root = element.getRootNode();
    return root instanceof ShadowRoot ? root : null;
  }

  if (element instanceof ShadowRoot) {
    return element;
  } // when we don't find a shadow root


  if (!element.parentNode) {
    return null;
  }

  return findShadowRoot(element.parentNode);
};

const noop = () => {};
/**
 * Trick to restart an element's animation
 *
 * @param {HTMLElement} element
 * @return void
 *
 * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
 */


const reflow = element => {
  // eslint-disable-next-line no-unused-expressions
  element.offsetHeight;
};

const getjQuery = () => {
  const {
    jQuery
  } = window;

  if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
    return jQuery;
  }

  return null;
};

const DOMContentLoadedCallbacks = [];

const onDOMContentLoaded = callback => {
  if (document.readyState === 'loading') {
    // add listener on the first call when the document is in loading state
    if (!DOMContentLoadedCallbacks.length) {
      document.addEventListener('DOMContentLoaded', () => {
        DOMContentLoadedCallbacks.forEach(callback => callback());
      });
    }

    DOMContentLoadedCallbacks.push(callback);
  } else {
    callback();
  }
};

const isRTL = () => document.documentElement.dir === 'rtl';

const defineJQueryPlugin = plugin => {
  onDOMContentLoaded(() => {
    const $ = getjQuery();
    /* istanbul ignore if */

    if ($) {
      const name = plugin.NAME;
      const JQUERY_NO_CONFLICT = $.fn[name];
      $.fn[name] = plugin.jQueryInterface;
      $.fn[name].Constructor = plugin;

      $.fn[name].noConflict = () => {
        $.fn[name] = JQUERY_NO_CONFLICT;
        return plugin.jQueryInterface;
      };
    }
  });
};

const execute = callback => {
  if (typeof callback === 'function') {
    callback();
  }
};

const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
  if (!waitForTransition) {
    execute(callback);
    return;
  }

  const durationPadding = 5;
  const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
  let called = false;

  const handler = ({
    target
  }) => {
    if (target !== transitionElement) {
      return;
    }

    called = true;
    transitionElement.removeEventListener(TRANSITION_END, handler);
    execute(callback);
  };

  transitionElement.addEventListener(TRANSITION_END, handler);
  setTimeout(() => {
    if (!called) {
      triggerTransitionEnd(transitionElement);
    }
  }, emulatedDuration);
};
/**
 * Return the previous/next element of a list.
 *
 * @param {array} list    The list of elements
 * @param activeElement   The active element
 * @param shouldGetNext   Choose to get next or previous element
 * @param isCycleAllowed
 * @return {Element|elem} The proper element
 */


const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
  let index = list.indexOf(activeElement); // if the element does not exist in the list return an element depending on the direction and if cycle is allowed

  if (index === -1) {
    return list[!shouldGetNext && isCycleAllowed ? list.length - 1 : 0];
  }

  const listLength = list.length;
  index += shouldGetNext ? 1 : -1;

  if (isCycleAllowed) {
    index = (index + listLength) % listLength;
  }

  return list[Math.max(0, Math.min(index, listLength - 1))];
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): dom/event-handler.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
const stripNameRegex = /\..*/;
const stripUidRegex = /::\d+$/;
const eventRegistry = {}; // Events storage

let uidEvent = 1;
const customEvents = {
  mouseenter: 'mouseover',
  mouseleave: 'mouseout'
};
const customEventsRegex = /^(mouseenter|mouseleave)/i;
const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);
/**
 * ------------------------------------------------------------------------
 * Private methods
 * ------------------------------------------------------------------------
 */

function getUidEvent(element, uid) {
  return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
}

function getEvent(element) {
  const uid = getUidEvent(element);
  element.uidEvent = uid;
  eventRegistry[uid] = eventRegistry[uid] || {};
  return eventRegistry[uid];
}

function bootstrapHandler(element, fn) {
  return function handler(event) {
    event.delegateTarget = element;

    if (handler.oneOff) {
      EventHandler.off(element, event.type, fn);
    }

    return fn.apply(element, [event]);
  };
}

function bootstrapDelegationHandler(element, selector, fn) {
  return function handler(event) {
    const domElements = element.querySelectorAll(selector);

    for (let {
      target
    } = event; target && target !== this; target = target.parentNode) {
      for (let i = domElements.length; i--;) {
        if (domElements[i] === target) {
          event.delegateTarget = target;

          if (handler.oneOff) {
            EventHandler.off(element, event.type, selector, fn);
          }

          return fn.apply(target, [event]);
        }
      }
    } // To please ESLint


    return null;
  };
}

function findHandler(events, handler, delegationSelector = null) {
  const uidEventList = Object.keys(events);

  for (let i = 0, len = uidEventList.length; i < len; i++) {
    const event = events[uidEventList[i]];

    if (event.originalHandler === handler && event.delegationSelector === delegationSelector) {
      return event;
    }
  }

  return null;
}

function normalizeParams(originalTypeEvent, handler, delegationFn) {
  const delegation = typeof handler === 'string';
  const originalHandler = delegation ? delegationFn : handler;
  let typeEvent = getTypeEvent(originalTypeEvent);
  const isNative = nativeEvents.has(typeEvent);

  if (!isNative) {
    typeEvent = originalTypeEvent;
  }

  return [delegation, originalHandler, typeEvent];
}

function addHandler(element, originalTypeEvent, handler, delegationFn, oneOff) {
  if (typeof originalTypeEvent !== 'string' || !element) {
    return;
  }

  if (!handler) {
    handler = delegationFn;
    delegationFn = null;
  } // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
  // this prevents the handler from being dispatched the same way as mouseover or mouseout does


  if (customEventsRegex.test(originalTypeEvent)) {
    const wrapFn = fn => {
      return function (event) {
        if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
          return fn.call(this, event);
        }
      };
    };

    if (delegationFn) {
      delegationFn = wrapFn(delegationFn);
    } else {
      handler = wrapFn(handler);
    }
  }

  const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
  const events = getEvent(element);
  const handlers = events[typeEvent] || (events[typeEvent] = {});
  const previousFn = findHandler(handlers, originalHandler, delegation ? handler : null);

  if (previousFn) {
    previousFn.oneOff = previousFn.oneOff && oneOff;
    return;
  }

  const uid = getUidEvent(originalHandler, originalTypeEvent.replace(namespaceRegex, ''));
  const fn = delegation ? bootstrapDelegationHandler(element, handler, delegationFn) : bootstrapHandler(element, handler);
  fn.delegationSelector = delegation ? handler : null;
  fn.originalHandler = originalHandler;
  fn.oneOff = oneOff;
  fn.uidEvent = uid;
  handlers[uid] = fn;
  element.addEventListener(typeEvent, fn, delegation);
}

function removeHandler(element, events, typeEvent, handler, delegationSelector) {
  const fn = findHandler(events[typeEvent], handler, delegationSelector);

  if (!fn) {
    return;
  }

  element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
  delete events[typeEvent][fn.uidEvent];
}

function removeNamespacedHandlers(element, events, typeEvent, namespace) {
  const storeElementEvent = events[typeEvent] || {};
  Object.keys(storeElementEvent).forEach(handlerKey => {
    if (handlerKey.includes(namespace)) {
      const event = storeElementEvent[handlerKey];
      removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
    }
  });
}

function getTypeEvent(event) {
  // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
  event = event.replace(stripNameRegex, '');
  return customEvents[event] || event;
}

const EventHandler = {
  on(element, event, handler, delegationFn) {
    addHandler(element, event, handler, delegationFn, false);
  },

  one(element, event, handler, delegationFn) {
    addHandler(element, event, handler, delegationFn, true);
  },

  off(element, originalTypeEvent, handler, delegationFn) {
    if (typeof originalTypeEvent !== 'string' || !element) {
      return;
    }

    const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
    const inNamespace = typeEvent !== originalTypeEvent;
    const events = getEvent(element);
    const isNamespace = originalTypeEvent.startsWith('.');

    if (typeof originalHandler !== 'undefined') {
      // Simplest case: handler is passed, remove that listener ONLY.
      if (!events || !events[typeEvent]) {
        return;
      }

      removeHandler(element, events, typeEvent, originalHandler, delegation ? handler : null);
      return;
    }

    if (isNamespace) {
      Object.keys(events).forEach(elementEvent => {
        removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
      });
    }

    const storeElementEvent = events[typeEvent] || {};
    Object.keys(storeElementEvent).forEach(keyHandlers => {
      const handlerKey = keyHandlers.replace(stripUidRegex, '');

      if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
        const event = storeElementEvent[keyHandlers];
        removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
      }
    });
  },

  trigger(element, event, args) {
    if (typeof event !== 'string' || !element) {
      return null;
    }

    const $ = getjQuery();
    const typeEvent = getTypeEvent(event);
    const inNamespace = event !== typeEvent;
    const isNative = nativeEvents.has(typeEvent);
    let jQueryEvent;
    let bubbles = true;
    let nativeDispatch = true;
    let defaultPrevented = false;
    let evt = null;

    if (inNamespace && $) {
      jQueryEvent = $.Event(event, args);
      $(element).trigger(jQueryEvent);
      bubbles = !jQueryEvent.isPropagationStopped();
      nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
      defaultPrevented = jQueryEvent.isDefaultPrevented();
    }

    if (isNative) {
      evt = document.createEvent('HTMLEvents');
      evt.initEvent(typeEvent, bubbles, true);
    } else {
      evt = new CustomEvent(event, {
        bubbles,
        cancelable: true
      });
    } // merge custom information in our event


    if (typeof args !== 'undefined') {
      Object.keys(args).forEach(key => {
        Object.defineProperty(evt, key, {
          get() {
            return args[key];
          }

        });
      });
    }

    if (defaultPrevented) {
      evt.preventDefault();
    }

    if (nativeDispatch) {
      element.dispatchEvent(evt);
    }

    if (evt.defaultPrevented && typeof jQueryEvent !== 'undefined') {
      jQueryEvent.preventDefault();
    }

    return evt;
  }

};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): dom/data.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const elementMap = new Map();
const Data = {
  set(element, key, instance) {
    if (!elementMap.has(element)) {
      elementMap.set(element, new Map());
    }

    const instanceMap = elementMap.get(element); // make it clear we only want one instance per element
    // can be removed later when multiple key/instances are fine to be used

    if (!instanceMap.has(key) && instanceMap.size !== 0) {
      // eslint-disable-next-line no-console
      console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
      return;
    }

    instanceMap.set(key, instance);
  },

  get(element, key) {
    if (elementMap.has(element)) {
      return elementMap.get(element).get(key) || null;
    }

    return null;
  },

  remove(element, key) {
    if (!elementMap.has(element)) {
      return;
    }

    const instanceMap = elementMap.get(element);
    instanceMap.delete(key); // free up element references if there are no instances left for an element

    if (instanceMap.size === 0) {
      elementMap.delete(element);
    }
  }

};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): base-component.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const VERSION = '5.1.3';

class BaseComponent {
  constructor(element) {
    element = getElement(element);

    if (!element) {
      return;
    }

    this._element = element;
    Data.set(this._element, this.constructor.DATA_KEY, this);
  }

  dispose() {
    Data.remove(this._element, this.constructor.DATA_KEY);
    EventHandler.off(this._element, this.constructor.EVENT_KEY);
    Object.getOwnPropertyNames(this).forEach(propertyName => {
      this[propertyName] = null;
    });
  }

  _queueCallback(callback, element, isAnimated = true) {
    executeAfterTransition(callback, element, isAnimated);
  }
  /** Static */


  static getInstance(element) {
    return Data.get(getElement(element), this.DATA_KEY);
  }

  static getOrCreateInstance(element, config = {}) {
    return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
  }

  static get VERSION() {
    return VERSION;
  }

  static get NAME() {
    throw new Error('You have to implement the static method "NAME", for each component!');
  }

  static get DATA_KEY() {
    return `bs.${this.NAME}`;
  }

  static get EVENT_KEY() {
    return `.${this.DATA_KEY}`;
  }

}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): util/component-functions.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

const enableDismissTrigger = (component, method = 'hide') => {
  const clickEvent = `click.dismiss${component.EVENT_KEY}`;
  const name = component.NAME;
  EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }

    if (isDisabled(this)) {
      return;
    }

    const target = getElementFromSelector(this) || this.closest(`.${name}`);
    const instance = component.getOrCreateInstance(target); // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method

    instance[method]();
  });
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$d = 'alert';
const DATA_KEY$c = 'bs.alert';
const EVENT_KEY$c = `.${DATA_KEY$c}`;
const EVENT_CLOSE = `close${EVENT_KEY$c}`;
const EVENT_CLOSED = `closed${EVENT_KEY$c}`;
const CLASS_NAME_FADE$5 = 'fade';
const CLASS_NAME_SHOW$8 = 'show';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Alert extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME$d;
  } // Public


  close() {
    const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);

    if (closeEvent.defaultPrevented) {
      return;
    }

    this._element.classList.remove(CLASS_NAME_SHOW$8);

    const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5);

    this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
  } // Private


  _destroyElement() {
    this._element.remove();

    EventHandler.trigger(this._element, EVENT_CLOSED);
    this.dispose();
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = Alert.getOrCreateInstance(this);

      if (typeof config !== 'string') {
        return;
      }

      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config](this);
    });
  }

}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */


enableDismissTrigger(Alert, 'close');
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Alert to jQuery only if jQuery is present
 */

defineJQueryPlugin(Alert);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$c = 'button';
const DATA_KEY$b = 'bs.button';
const EVENT_KEY$b = `.${DATA_KEY$b}`;
const DATA_API_KEY$7 = '.data-api';
const CLASS_NAME_ACTIVE$3 = 'active';
const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$b}${DATA_API_KEY$7}`;
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Button extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME$c;
  } // Public


  toggle() {
    // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
    this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = Button.getOrCreateInstance(this);

      if (config === 'toggle') {
        data[config]();
      }
    });
  }

}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */


EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, event => {
  event.preventDefault();
  const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
  const data = Button.getOrCreateInstance(button);
  data.toggle();
});
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Button to jQuery only if jQuery is present
 */

defineJQueryPlugin(Button);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): dom/manipulator.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
function normalizeData(val) {
  if (val === 'true') {
    return true;
  }

  if (val === 'false') {
    return false;
  }

  if (val === Number(val).toString()) {
    return Number(val);
  }

  if (val === '' || val === 'null') {
    return null;
  }

  return val;
}

function normalizeDataKey(key) {
  return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
}

const Manipulator = {
  setDataAttribute(element, key, value) {
    element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
  },

  removeDataAttribute(element, key) {
    element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
  },

  getDataAttributes(element) {
    if (!element) {
      return {};
    }

    const attributes = {};
    Object.keys(element.dataset).filter(key => key.startsWith('bs')).forEach(key => {
      let pureKey = key.replace(/^bs/, '');
      pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
      attributes[pureKey] = normalizeData(element.dataset[key]);
    });
    return attributes;
  },

  getDataAttribute(element, key) {
    return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
  },

  offset(element) {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset
    };
  },

  position(element) {
    return {
      top: element.offsetTop,
      left: element.offsetLeft
    };
  }

};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): dom/selector-engine.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
const NODE_TEXT = 3;
const SelectorEngine = {
  find(selector, element = document.documentElement) {
    return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
  },

  findOne(selector, element = document.documentElement) {
    return Element.prototype.querySelector.call(element, selector);
  },

  children(element, selector) {
    return [].concat(...element.children).filter(child => child.matches(selector));
  },

  parents(element, selector) {
    const parents = [];
    let ancestor = element.parentNode;

    while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== NODE_TEXT) {
      if (ancestor.matches(selector)) {
        parents.push(ancestor);
      }

      ancestor = ancestor.parentNode;
    }

    return parents;
  },

  prev(element, selector) {
    let previous = element.previousElementSibling;

    while (previous) {
      if (previous.matches(selector)) {
        return [previous];
      }

      previous = previous.previousElementSibling;
    }

    return [];
  },

  next(element, selector) {
    let next = element.nextElementSibling;

    while (next) {
      if (next.matches(selector)) {
        return [next];
      }

      next = next.nextElementSibling;
    }

    return [];
  },

  focusableChildren(element) {
    const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map(selector => `${selector}:not([tabindex^="-"])`).join(', ');
    return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el));
  }

};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): carousel.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$b = 'carousel';
const DATA_KEY$a = 'bs.carousel';
const EVENT_KEY$a = `.${DATA_KEY$a}`;
const DATA_API_KEY$6 = '.data-api';
const ARROW_LEFT_KEY = 'ArrowLeft';
const ARROW_RIGHT_KEY = 'ArrowRight';
const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

const SWIPE_THRESHOLD = 40;
const Default$a = {
  interval: 5000,
  keyboard: true,
  slide: false,
  pause: 'hover',
  wrap: true,
  touch: true
};
const DefaultType$a = {
  interval: '(number|boolean)',
  keyboard: 'boolean',
  slide: '(boolean|string)',
  pause: '(string|boolean)',
  wrap: 'boolean',
  touch: 'boolean'
};
const ORDER_NEXT = 'next';
const ORDER_PREV = 'prev';
const DIRECTION_LEFT = 'left';
const DIRECTION_RIGHT = 'right';
const KEY_TO_DIRECTION = {
  [ARROW_LEFT_KEY]: DIRECTION_RIGHT,
  [ARROW_RIGHT_KEY]: DIRECTION_LEFT
};
const EVENT_SLIDE = `slide${EVENT_KEY$a}`;
const EVENT_SLID = `slid${EVENT_KEY$a}`;
const EVENT_KEYDOWN = `keydown${EVENT_KEY$a}`;
const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY$a}`;
const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY$a}`;
const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$a}`;
const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$a}`;
const EVENT_TOUCHEND = `touchend${EVENT_KEY$a}`;
const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$a}`;
const EVENT_POINTERUP = `pointerup${EVENT_KEY$a}`;
const EVENT_DRAG_START = `dragstart${EVENT_KEY$a}`;
const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$a}${DATA_API_KEY$6}`;
const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;
const CLASS_NAME_CAROUSEL = 'carousel';
const CLASS_NAME_ACTIVE$2 = 'active';
const CLASS_NAME_SLIDE = 'slide';
const CLASS_NAME_END = 'carousel-item-end';
const CLASS_NAME_START = 'carousel-item-start';
const CLASS_NAME_NEXT = 'carousel-item-next';
const CLASS_NAME_PREV = 'carousel-item-prev';
const CLASS_NAME_POINTER_EVENT = 'pointer-event';
const SELECTOR_ACTIVE$1 = '.active';
const SELECTOR_ACTIVE_ITEM = '.active.carousel-item';
const SELECTOR_ITEM = '.carousel-item';
const SELECTOR_ITEM_IMG = '.carousel-item img';
const SELECTOR_NEXT_PREV = '.carousel-item-next, .carousel-item-prev';
const SELECTOR_INDICATORS = '.carousel-indicators';
const SELECTOR_INDICATOR = '[data-bs-target]';
const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
const POINTER_TYPE_TOUCH = 'touch';
const POINTER_TYPE_PEN = 'pen';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Carousel extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._items = null;
    this._interval = null;
    this._activeElement = null;
    this._isPaused = false;
    this._isSliding = false;
    this.touchTimeout = null;
    this.touchStartX = 0;
    this.touchDeltaX = 0;
    this._config = this._getConfig(config);
    this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
    this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
    this._pointerEvent = Boolean(window.PointerEvent);

    this._addEventListeners();
  } // Getters


  static get Default() {
    return Default$a;
  }

  static get NAME() {
    return NAME$b;
  } // Public


  next() {
    this._slide(ORDER_NEXT);
  }

  nextWhenVisible() {
    // Don't call next when the page isn't visible
    // or the carousel or its parent isn't visible
    if (!document.hidden && isVisible(this._element)) {
      this.next();
    }
  }

  prev() {
    this._slide(ORDER_PREV);
  }

  pause(event) {
    if (!event) {
      this._isPaused = true;
    }

    if (SelectorEngine.findOne(SELECTOR_NEXT_PREV, this._element)) {
      triggerTransitionEnd(this._element);
      this.cycle(true);
    }

    clearInterval(this._interval);
    this._interval = null;
  }

  cycle(event) {
    if (!event) {
      this._isPaused = false;
    }

    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }

    if (this._config && this._config.interval && !this._isPaused) {
      this._updateInterval();

      this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
    }
  }

  to(index) {
    this._activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

    const activeIndex = this._getItemIndex(this._activeElement);

    if (index > this._items.length - 1 || index < 0) {
      return;
    }

    if (this._isSliding) {
      EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
      return;
    }

    if (activeIndex === index) {
      this.pause();
      this.cycle();
      return;
    }

    const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;

    this._slide(order, this._items[index]);
  } // Private


  _getConfig(config) {
    config = { ...Default$a,
      ...Manipulator.getDataAttributes(this._element),
      ...(typeof config === 'object' ? config : {})
    };
    typeCheckConfig(NAME$b, config, DefaultType$a);
    return config;
  }

  _handleSwipe() {
    const absDeltax = Math.abs(this.touchDeltaX);

    if (absDeltax <= SWIPE_THRESHOLD) {
      return;
    }

    const direction = absDeltax / this.touchDeltaX;
    this.touchDeltaX = 0;

    if (!direction) {
      return;
    }

    this._slide(direction > 0 ? DIRECTION_RIGHT : DIRECTION_LEFT);
  }

  _addEventListeners() {
    if (this._config.keyboard) {
      EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
    }

    if (this._config.pause === 'hover') {
      EventHandler.on(this._element, EVENT_MOUSEENTER, event => this.pause(event));
      EventHandler.on(this._element, EVENT_MOUSELEAVE, event => this.cycle(event));
    }

    if (this._config.touch && this._touchSupported) {
      this._addTouchEventListeners();
    }
  }

  _addTouchEventListeners() {
    const hasPointerPenTouch = event => {
      return this._pointerEvent && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
    };

    const start = event => {
      if (hasPointerPenTouch(event)) {
        this.touchStartX = event.clientX;
      } else if (!this._pointerEvent) {
        this.touchStartX = event.touches[0].clientX;
      }
    };

    const move = event => {
      // ensure swiping with one touch and not pinching
      this.touchDeltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this.touchStartX;
    };

    const end = event => {
      if (hasPointerPenTouch(event)) {
        this.touchDeltaX = event.clientX - this.touchStartX;
      }

      this._handleSwipe();

      if (this._config.pause === 'hover') {
        // If it's a touch-enabled device, mouseenter/leave are fired as
        // part of the mouse compatibility events on first tap - the carousel
        // would stop cycling until user tapped out of it;
        // here, we listen for touchend, explicitly pause the carousel
        // (as if it's the second time we tap on it, mouseenter compat event
        // is NOT fired) and after a timeout (to allow for mouse compatibility
        // events to fire) we explicitly restart cycling
        this.pause();

        if (this.touchTimeout) {
          clearTimeout(this.touchTimeout);
        }

        this.touchTimeout = setTimeout(event => this.cycle(event), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
      }
    };

    SelectorEngine.find(SELECTOR_ITEM_IMG, this._element).forEach(itemImg => {
      EventHandler.on(itemImg, EVENT_DRAG_START, event => event.preventDefault());
    });

    if (this._pointerEvent) {
      EventHandler.on(this._element, EVENT_POINTERDOWN, event => start(event));
      EventHandler.on(this._element, EVENT_POINTERUP, event => end(event));

      this._element.classList.add(CLASS_NAME_POINTER_EVENT);
    } else {
      EventHandler.on(this._element, EVENT_TOUCHSTART, event => start(event));
      EventHandler.on(this._element, EVENT_TOUCHMOVE, event => move(event));
      EventHandler.on(this._element, EVENT_TOUCHEND, event => end(event));
    }
  }

  _keydown(event) {
    if (/input|textarea/i.test(event.target.tagName)) {
      return;
    }

    const direction = KEY_TO_DIRECTION[event.key];

    if (direction) {
      event.preventDefault();

      this._slide(direction);
    }
  }

  _getItemIndex(element) {
    this._items = element && element.parentNode ? SelectorEngine.find(SELECTOR_ITEM, element.parentNode) : [];
    return this._items.indexOf(element);
  }

  _getItemByOrder(order, activeElement) {
    const isNext = order === ORDER_NEXT;
    return getNextActiveElement(this._items, activeElement, isNext, this._config.wrap);
  }

  _triggerSlideEvent(relatedTarget, eventDirectionName) {
    const targetIndex = this._getItemIndex(relatedTarget);

    const fromIndex = this._getItemIndex(SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element));

    return EventHandler.trigger(this._element, EVENT_SLIDE, {
      relatedTarget,
      direction: eventDirectionName,
      from: fromIndex,
      to: targetIndex
    });
  }

  _setActiveIndicatorElement(element) {
    if (this._indicatorsElement) {
      const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE$1, this._indicatorsElement);
      activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
      activeIndicator.removeAttribute('aria-current');
      const indicators = SelectorEngine.find(SELECTOR_INDICATOR, this._indicatorsElement);

      for (let i = 0; i < indicators.length; i++) {
        if (Number.parseInt(indicators[i].getAttribute('data-bs-slide-to'), 10) === this._getItemIndex(element)) {
          indicators[i].classList.add(CLASS_NAME_ACTIVE$2);
          indicators[i].setAttribute('aria-current', 'true');
          break;
        }
      }
    }
  }

  _updateInterval() {
    const element = this._activeElement || SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

    if (!element) {
      return;
    }

    const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);

    if (elementInterval) {
      this._config.defaultInterval = this._config.defaultInterval || this._config.interval;
      this._config.interval = elementInterval;
    } else {
      this._config.interval = this._config.defaultInterval || this._config.interval;
    }
  }

  _slide(directionOrOrder, element) {
    const order = this._directionToOrder(directionOrOrder);

    const activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

    const activeElementIndex = this._getItemIndex(activeElement);

    const nextElement = element || this._getItemByOrder(order, activeElement);

    const nextElementIndex = this._getItemIndex(nextElement);

    const isCycling = Boolean(this._interval);
    const isNext = order === ORDER_NEXT;
    const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
    const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;

    const eventDirectionName = this._orderToDirection(order);

    if (nextElement && nextElement.classList.contains(CLASS_NAME_ACTIVE$2)) {
      this._isSliding = false;
      return;
    }

    if (this._isSliding) {
      return;
    }

    const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);

    if (slideEvent.defaultPrevented) {
      return;
    }

    if (!activeElement || !nextElement) {
      // Some weirdness is happening, so we bail
      return;
    }

    this._isSliding = true;

    if (isCycling) {
      this.pause();
    }

    this._setActiveIndicatorElement(nextElement);

    this._activeElement = nextElement;

    const triggerSlidEvent = () => {
      EventHandler.trigger(this._element, EVENT_SLID, {
        relatedTarget: nextElement,
        direction: eventDirectionName,
        from: activeElementIndex,
        to: nextElementIndex
      });
    };

    if (this._element.classList.contains(CLASS_NAME_SLIDE)) {
      nextElement.classList.add(orderClassName);
      reflow(nextElement);
      activeElement.classList.add(directionalClassName);
      nextElement.classList.add(directionalClassName);

      const completeCallBack = () => {
        nextElement.classList.remove(directionalClassName, orderClassName);
        nextElement.classList.add(CLASS_NAME_ACTIVE$2);
        activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
        this._isSliding = false;
        setTimeout(triggerSlidEvent, 0);
      };

      this._queueCallback(completeCallBack, activeElement, true);
    } else {
      activeElement.classList.remove(CLASS_NAME_ACTIVE$2);
      nextElement.classList.add(CLASS_NAME_ACTIVE$2);
      this._isSliding = false;
      triggerSlidEvent();
    }

    if (isCycling) {
      this.cycle();
    }
  }

  _directionToOrder(direction) {
    if (![DIRECTION_RIGHT, DIRECTION_LEFT].includes(direction)) {
      return direction;
    }

    if (isRTL()) {
      return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
    }

    return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
  }

  _orderToDirection(order) {
    if (![ORDER_NEXT, ORDER_PREV].includes(order)) {
      return order;
    }

    if (isRTL()) {
      return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }

    return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
  } // Static


  static carouselInterface(element, config) {
    const data = Carousel.getOrCreateInstance(element, config);
    let {
      _config
    } = data;

    if (typeof config === 'object') {
      _config = { ..._config,
        ...config
      };
    }

    const action = typeof config === 'string' ? config : _config.slide;

    if (typeof config === 'number') {
      data.to(config);
    } else if (typeof action === 'string') {
      if (typeof data[action] === 'undefined') {
        throw new TypeError(`No method named "${action}"`);
      }

      data[action]();
    } else if (_config.interval && _config.ride) {
      data.pause();
      data.cycle();
    }
  }

  static jQueryInterface(config) {
    return this.each(function () {
      Carousel.carouselInterface(this, config);
    });
  }

  static dataApiClickHandler(event) {
    const target = getElementFromSelector(this);

    if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
      return;
    }

    const config = { ...Manipulator.getDataAttributes(target),
      ...Manipulator.getDataAttributes(this)
    };
    const slideIndex = this.getAttribute('data-bs-slide-to');

    if (slideIndex) {
      config.interval = false;
    }

    Carousel.carouselInterface(target, config);

    if (slideIndex) {
      Carousel.getInstance(target).to(slideIndex);
    }

    event.preventDefault();
  }

}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */


EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, Carousel.dataApiClickHandler);
EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
  const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);

  for (let i = 0, len = carousels.length; i < len; i++) {
    Carousel.carouselInterface(carousels[i], Carousel.getInstance(carousels[i]));
  }
});
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Carousel to jQuery only if jQuery is present
 */

defineJQueryPlugin(Carousel);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): collapse.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$a = 'collapse';
const DATA_KEY$9 = 'bs.collapse';
const EVENT_KEY$9 = `.${DATA_KEY$9}`;
const DATA_API_KEY$5 = '.data-api';
const Default$9 = {
  toggle: true,
  parent: null
};
const DefaultType$9 = {
  toggle: 'boolean',
  parent: '(null|element)'
};
const EVENT_SHOW$5 = `show${EVENT_KEY$9}`;
const EVENT_SHOWN$5 = `shown${EVENT_KEY$9}`;
const EVENT_HIDE$5 = `hide${EVENT_KEY$9}`;
const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$9}`;
const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$9}${DATA_API_KEY$5}`;
const CLASS_NAME_SHOW$7 = 'show';
const CLASS_NAME_COLLAPSE = 'collapse';
const CLASS_NAME_COLLAPSING = 'collapsing';
const CLASS_NAME_COLLAPSED = 'collapsed';
const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
const CLASS_NAME_HORIZONTAL = 'collapse-horizontal';
const WIDTH = 'width';
const HEIGHT = 'height';
const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing';
const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Collapse extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._isTransitioning = false;
    this._config = this._getConfig(config);
    this._triggerArray = [];
    const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);

    for (let i = 0, len = toggleList.length; i < len; i++) {
      const elem = toggleList[i];
      const selector = getSelectorFromElement(elem);
      const filterElement = SelectorEngine.find(selector).filter(foundElem => foundElem === this._element);

      if (selector !== null && filterElement.length) {
        this._selector = selector;

        this._triggerArray.push(elem);
      }
    }

    this._initializeChildren();

    if (!this._config.parent) {
      this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
    }

    if (this._config.toggle) {
      this.toggle();
    }
  } // Getters


  static get Default() {
    return Default$9;
  }

  static get NAME() {
    return NAME$a;
  } // Public


  toggle() {
    if (this._isShown()) {
      this.hide();
    } else {
      this.show();
    }
  }

  show() {
    if (this._isTransitioning || this._isShown()) {
      return;
    }

    let actives = [];
    let activesData;

    if (this._config.parent) {
      const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
      actives = SelectorEngine.find(SELECTOR_ACTIVES, this._config.parent).filter(elem => !children.includes(elem)); // remove children if greater depth
    }

    const container = SelectorEngine.findOne(this._selector);

    if (actives.length) {
      const tempActiveData = actives.find(elem => container !== elem);
      activesData = tempActiveData ? Collapse.getInstance(tempActiveData) : null;

      if (activesData && activesData._isTransitioning) {
        return;
      }
    }

    const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$5);

    if (startEvent.defaultPrevented) {
      return;
    }

    actives.forEach(elemActive => {
      if (container !== elemActive) {
        Collapse.getOrCreateInstance(elemActive, {
          toggle: false
        }).hide();
      }

      if (!activesData) {
        Data.set(elemActive, DATA_KEY$9, null);
      }
    });

    const dimension = this._getDimension();

    this._element.classList.remove(CLASS_NAME_COLLAPSE);

    this._element.classList.add(CLASS_NAME_COLLAPSING);

    this._element.style[dimension] = 0;

    this._addAriaAndCollapsedClass(this._triggerArray, true);

    this._isTransitioning = true;

    const complete = () => {
      this._isTransitioning = false;

      this._element.classList.remove(CLASS_NAME_COLLAPSING);

      this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);

      this._element.style[dimension] = '';
      EventHandler.trigger(this._element, EVENT_SHOWN$5);
    };

    const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
    const scrollSize = `scroll${capitalizedDimension}`;

    this._queueCallback(complete, this._element, true);

    this._element.style[dimension] = `${this._element[scrollSize]}px`;
  }

  hide() {
    if (this._isTransitioning || !this._isShown()) {
      return;
    }

    const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$5);

    if (startEvent.defaultPrevented) {
      return;
    }

    const dimension = this._getDimension();

    this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
    reflow(this._element);

    this._element.classList.add(CLASS_NAME_COLLAPSING);

    this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);

    const triggerArrayLength = this._triggerArray.length;

    for (let i = 0; i < triggerArrayLength; i++) {
      const trigger = this._triggerArray[i];
      const elem = getElementFromSelector(trigger);

      if (elem && !this._isShown(elem)) {
        this._addAriaAndCollapsedClass([trigger], false);
      }
    }

    this._isTransitioning = true;

    const complete = () => {
      this._isTransitioning = false;

      this._element.classList.remove(CLASS_NAME_COLLAPSING);

      this._element.classList.add(CLASS_NAME_COLLAPSE);

      EventHandler.trigger(this._element, EVENT_HIDDEN$5);
    };

    this._element.style[dimension] = '';

    this._queueCallback(complete, this._element, true);
  }

  _isShown(element = this._element) {
    return element.classList.contains(CLASS_NAME_SHOW$7);
  } // Private


  _getConfig(config) {
    config = { ...Default$9,
      ...Manipulator.getDataAttributes(this._element),
      ...config
    };
    config.toggle = Boolean(config.toggle); // Coerce string values

    config.parent = getElement(config.parent);
    typeCheckConfig(NAME$a, config, DefaultType$9);
    return config;
  }

  _getDimension() {
    return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
  }

  _initializeChildren() {
    if (!this._config.parent) {
      return;
    }

    const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
    SelectorEngine.find(SELECTOR_DATA_TOGGLE$4, this._config.parent).filter(elem => !children.includes(elem)).forEach(element => {
      const selected = getElementFromSelector(element);

      if (selected) {
        this._addAriaAndCollapsedClass([element], this._isShown(selected));
      }
    });
  }

  _addAriaAndCollapsedClass(triggerArray, isOpen) {
    if (!triggerArray.length) {
      return;
    }

    triggerArray.forEach(elem => {
      if (isOpen) {
        elem.classList.remove(CLASS_NAME_COLLAPSED);
      } else {
        elem.classList.add(CLASS_NAME_COLLAPSED);
      }

      elem.setAttribute('aria-expanded', isOpen);
    });
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const _config = {};

      if (typeof config === 'string' && /show|hide/.test(config)) {
        _config.toggle = false;
      }

      const data = Collapse.getOrCreateInstance(this, _config);

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    });
  }

}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */


EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function (event) {
  // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
  if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
    event.preventDefault();
  }

  const selector = getSelectorFromElement(this);
  const selectorElements = SelectorEngine.find(selector);
  selectorElements.forEach(element => {
    Collapse.getOrCreateInstance(element, {
      toggle: false
    }).toggle();
  });
});
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Collapse to jQuery only if jQuery is present
 */

defineJQueryPlugin(Collapse);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$9 = 'dropdown';
const DATA_KEY$8 = 'bs.dropdown';
const EVENT_KEY$8 = `.${DATA_KEY$8}`;
const DATA_API_KEY$4 = '.data-api';
const ESCAPE_KEY$2 = 'Escape';
const SPACE_KEY = 'Space';
const TAB_KEY$1 = 'Tab';
const ARROW_UP_KEY = 'ArrowUp';
const ARROW_DOWN_KEY = 'ArrowDown';
const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEY}|${ARROW_DOWN_KEY}|${ESCAPE_KEY$2}`);
const EVENT_HIDE$4 = `hide${EVENT_KEY$8}`;
const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$8}`;
const EVENT_SHOW$4 = `show${EVENT_KEY$8}`;
const EVENT_SHOWN$4 = `shown${EVENT_KEY$8}`;
const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$8}${DATA_API_KEY$4}`;
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$8}${DATA_API_KEY$4}`;
const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$8}${DATA_API_KEY$4}`;
const CLASS_NAME_SHOW$6 = 'show';
const CLASS_NAME_DROPUP = 'dropup';
const CLASS_NAME_DROPEND = 'dropend';
const CLASS_NAME_DROPSTART = 'dropstart';
const CLASS_NAME_NAVBAR = 'navbar';
const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]';
const SELECTOR_MENU = '.dropdown-menu';
const SELECTOR_NAVBAR_NAV = '.navbar-nav';
const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
const Default$8 = {
  offset: [0, 2],
  boundary: 'clippingParents',
  reference: 'toggle',
  display: 'dynamic',
  popperConfig: null,
  autoClose: true
};
const DefaultType$8 = {
  offset: '(array|string|function)',
  boundary: '(string|element)',
  reference: '(string|element|object)',
  display: 'string',
  popperConfig: '(null|object|function)',
  autoClose: '(boolean|string)'
};
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Dropdown extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._popper = null;
    this._config = this._getConfig(config);
    this._menu = this._getMenuElement();
    this._inNavbar = this._detectNavbar();
  } // Getters


  static get Default() {
    return Default$8;
  }

  static get DefaultType() {
    return DefaultType$8;
  }

  static get NAME() {
    return NAME$9;
  } // Public


  toggle() {
    return this._isShown() ? this.hide() : this.show();
  }

  show() {
    if (isDisabled(this._element) || this._isShown(this._menu)) {
      return;
    }

    const relatedTarget = {
      relatedTarget: this._element
    };
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, relatedTarget);

    if (showEvent.defaultPrevented) {
      return;
    }

    const parent = Dropdown.getParentFromElement(this._element); // Totally disable Popper for Dropdowns in Navbar

    if (this._inNavbar) {
      Manipulator.setDataAttribute(this._menu, 'popper', 'none');
    } else {
      this._createPopper(parent);
    } // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


    if ('ontouchstart' in document.documentElement && !parent.closest(SELECTOR_NAVBAR_NAV)) {
      [].concat(...document.body.children).forEach(elem => EventHandler.on(elem, 'mouseover', noop));
    }

    this._element.focus();

    this._element.setAttribute('aria-expanded', true);

    this._menu.classList.add(CLASS_NAME_SHOW$6);

    this._element.classList.add(CLASS_NAME_SHOW$6);

    EventHandler.trigger(this._element, EVENT_SHOWN$4, relatedTarget);
  }

  hide() {
    if (isDisabled(this._element) || !this._isShown(this._menu)) {
      return;
    }

    const relatedTarget = {
      relatedTarget: this._element
    };

    this._completeHide(relatedTarget);
  }

  dispose() {
    if (this._popper) {
      this._popper.destroy();
    }

    super.dispose();
  }

  update() {
    this._inNavbar = this._detectNavbar();

    if (this._popper) {
      this._popper.update();
    }
  } // Private


  _completeHide(relatedTarget) {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4, relatedTarget);

    if (hideEvent.defaultPrevented) {
      return;
    } // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support


    if ('ontouchstart' in document.documentElement) {
      [].concat(...document.body.children).forEach(elem => EventHandler.off(elem, 'mouseover', noop));
    }

    if (this._popper) {
      this._popper.destroy();
    }

    this._menu.classList.remove(CLASS_NAME_SHOW$6);

    this._element.classList.remove(CLASS_NAME_SHOW$6);

    this._element.setAttribute('aria-expanded', 'false');

    Manipulator.removeDataAttribute(this._menu, 'popper');
    EventHandler.trigger(this._element, EVENT_HIDDEN$4, relatedTarget);
  }

  _getConfig(config) {
    config = { ...this.constructor.Default,
      ...Manipulator.getDataAttributes(this._element),
      ...config
    };
    typeCheckConfig(NAME$9, config, this.constructor.DefaultType);

    if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
      // Popper virtual elements require a getBoundingClientRect method
      throw new TypeError(`${NAME$9.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
    }

    return config;
  }

  _createPopper(parent) {
    if (typeof _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ === 'undefined') {
      throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
    }

    let referenceElement = this._element;

    if (this._config.reference === 'parent') {
      referenceElement = parent;
    } else if (isElement(this._config.reference)) {
      referenceElement = getElement(this._config.reference);
    } else if (typeof this._config.reference === 'object') {
      referenceElement = this._config.reference;
    }

    const popperConfig = this._getPopperConfig();

    const isDisplayStatic = popperConfig.modifiers.find(modifier => modifier.name === 'applyStyles' && modifier.enabled === false);
    this._popper = _popperjs_core__WEBPACK_IMPORTED_MODULE_1__.createPopper(referenceElement, this._menu, popperConfig);

    if (isDisplayStatic) {
      Manipulator.setDataAttribute(this._menu, 'popper', 'static');
    }
  }

  _isShown(element = this._element) {
    return element.classList.contains(CLASS_NAME_SHOW$6);
  }

  _getMenuElement() {
    return SelectorEngine.next(this._element, SELECTOR_MENU)[0];
  }

  _getPlacement() {
    const parentDropdown = this._element.parentNode;

    if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
      return PLACEMENT_RIGHT;
    }

    if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
      return PLACEMENT_LEFT;
    } // We need to trim the value because custom properties can also include spaces


    const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';

    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
      return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
    }

    return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
  }

  _detectNavbar() {
    return this._element.closest(`.${CLASS_NAME_NAVBAR}`) !== null;
  }

  _getOffset() {
    const {
      offset
    } = this._config;

    if (typeof offset === 'string') {
      return offset.split(',').map(val => Number.parseInt(val, 10));
    }

    if (typeof offset === 'function') {
      return popperData => offset(popperData, this._element);
    }

    return offset;
  }

  _getPopperConfig() {
    const defaultBsPopperConfig = {
      placement: this._getPlacement(),
      modifiers: [{
        name: 'preventOverflow',
        options: {
          boundary: this._config.boundary
        }
      }, {
        name: 'offset',
        options: {
          offset: this._getOffset()
        }
      }]
    }; // Disable Popper if we have a static display

    if (this._config.display === 'static') {
      defaultBsPopperConfig.modifiers = [{
        name: 'applyStyles',
        enabled: false
      }];
    }

    return { ...defaultBsPopperConfig,
      ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
    };
  }

  _selectMenuItem({
    key,
    target
  }) {
    const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(isVisible);

    if (!items.length) {
      return;
    } // if target isn't included in items (e.g. when expanding the dropdown)
    // allow cycling to get the last item in case key equals ARROW_UP_KEY


    getNextActiveElement(items, target, key === ARROW_DOWN_KEY, !items.includes(target)).focus();
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = Dropdown.getOrCreateInstance(this, config);

      if (typeof config !== 'string') {
        return;
      }

      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config]();
    });
  }

  static clearMenus(event) {
    if (event && (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY$1)) {
      return;
    }

    const toggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE$3);

    for (let i = 0, len = toggles.length; i < len; i++) {
      const context = Dropdown.getInstance(toggles[i]);

      if (!context || context._config.autoClose === false) {
        continue;
      }

      if (!context._isShown()) {
        continue;
      }

      const relatedTarget = {
        relatedTarget: context._element
      };

      if (event) {
        const composedPath = event.composedPath();
        const isMenuTarget = composedPath.includes(context._menu);

        if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
          continue;
        } // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu


        if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
          continue;
        }

        if (event.type === 'click') {
          relatedTarget.clickEvent = event;
        }
      }

      context._completeHide(relatedTarget);
    }
  }

  static getParentFromElement(element) {
    return getElementFromSelector(element) || element.parentNode;
  }

  static dataApiKeydownHandler(event) {
    // If not input/textarea:
    //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
    // If input/textarea:
    //  - If space key => not a dropdown command
    //  - If key is other than escape
    //    - If key is not up or down => not a dropdown command
    //    - If trigger inside the menu => not a dropdown command
    if (/input|textarea/i.test(event.target.tagName) ? event.key === SPACE_KEY || event.key !== ESCAPE_KEY$2 && (event.key !== ARROW_DOWN_KEY && event.key !== ARROW_UP_KEY || event.target.closest(SELECTOR_MENU)) : !REGEXP_KEYDOWN.test(event.key)) {
      return;
    }

    const isActive = this.classList.contains(CLASS_NAME_SHOW$6);

    if (!isActive && event.key === ESCAPE_KEY$2) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (isDisabled(this)) {
      return;
    }

    const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0];
    const instance = Dropdown.getOrCreateInstance(getToggleButton);

    if (event.key === ESCAPE_KEY$2) {
      instance.hide();
      return;
    }

    if (event.key === ARROW_UP_KEY || event.key === ARROW_DOWN_KEY) {
      if (!isActive) {
        instance.show();
      }

      instance._selectMenuItem(event);

      return;
    }

    if (!isActive || event.key === SPACE_KEY) {
      Dropdown.clearMenus();
    }
  }

}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */


EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
  event.preventDefault();
  Dropdown.getOrCreateInstance(this).toggle();
});
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Dropdown to jQuery only if jQuery is present
 */

defineJQueryPlugin(Dropdown);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): util/scrollBar.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
const SELECTOR_STICKY_CONTENT = '.sticky-top';

class ScrollBarHelper {
  constructor() {
    this._element = document.body;
  }

  getWidth() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
    const documentWidth = document.documentElement.clientWidth;
    return Math.abs(window.innerWidth - documentWidth);
  }

  hide() {
    const width = this.getWidth();

    this._disableOverFlow(); // give padding to element to balance the hidden scrollbar width


    this._setElementAttributes(this._element, 'paddingRight', calculatedValue => calculatedValue + width); // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth


    this._setElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight', calculatedValue => calculatedValue + width);

    this._setElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight', calculatedValue => calculatedValue - width);
  }

  _disableOverFlow() {
    this._saveInitialAttribute(this._element, 'overflow');

    this._element.style.overflow = 'hidden';
  }

  _setElementAttributes(selector, styleProp, callback) {
    const scrollbarWidth = this.getWidth();

    const manipulationCallBack = element => {
      if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
        return;
      }

      this._saveInitialAttribute(element, styleProp);

      const calculatedValue = window.getComputedStyle(element)[styleProp];
      element.style[styleProp] = `${callback(Number.parseFloat(calculatedValue))}px`;
    };

    this._applyManipulationCallback(selector, manipulationCallBack);
  }

  reset() {
    this._resetElementAttributes(this._element, 'overflow');

    this._resetElementAttributes(this._element, 'paddingRight');

    this._resetElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight');

    this._resetElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight');
  }

  _saveInitialAttribute(element, styleProp) {
    const actualValue = element.style[styleProp];

    if (actualValue) {
      Manipulator.setDataAttribute(element, styleProp, actualValue);
    }
  }

  _resetElementAttributes(selector, styleProp) {
    const manipulationCallBack = element => {
      const value = Manipulator.getDataAttribute(element, styleProp);

      if (typeof value === 'undefined') {
        element.style.removeProperty(styleProp);
      } else {
        Manipulator.removeDataAttribute(element, styleProp);
        element.style[styleProp] = value;
      }
    };

    this._applyManipulationCallback(selector, manipulationCallBack);
  }

  _applyManipulationCallback(selector, callBack) {
    if (isElement(selector)) {
      callBack(selector);
    } else {
      SelectorEngine.find(selector, this._element).forEach(callBack);
    }
  }

  isOverflowing() {
    return this.getWidth() > 0;
  }

}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): util/backdrop.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
const Default$7 = {
  className: 'modal-backdrop',
  isVisible: true,
  // if false, we use the backdrop helper without adding any element to the dom
  isAnimated: false,
  rootElement: 'body',
  // give the choice to place backdrop under different elements
  clickCallback: null
};
const DefaultType$7 = {
  className: 'string',
  isVisible: 'boolean',
  isAnimated: 'boolean',
  rootElement: '(element|string)',
  clickCallback: '(function|null)'
};
const NAME$8 = 'backdrop';
const CLASS_NAME_FADE$4 = 'fade';
const CLASS_NAME_SHOW$5 = 'show';
const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$8}`;

class Backdrop {
  constructor(config) {
    this._config = this._getConfig(config);
    this._isAppended = false;
    this._element = null;
  }

  show(callback) {
    if (!this._config.isVisible) {
      execute(callback);
      return;
    }

    this._append();

    if (this._config.isAnimated) {
      reflow(this._getElement());
    }

    this._getElement().classList.add(CLASS_NAME_SHOW$5);

    this._emulateAnimation(() => {
      execute(callback);
    });
  }

  hide(callback) {
    if (!this._config.isVisible) {
      execute(callback);
      return;
    }

    this._getElement().classList.remove(CLASS_NAME_SHOW$5);

    this._emulateAnimation(() => {
      this.dispose();
      execute(callback);
    });
  } // Private


  _getElement() {
    if (!this._element) {
      const backdrop = document.createElement('div');
      backdrop.className = this._config.className;

      if (this._config.isAnimated) {
        backdrop.classList.add(CLASS_NAME_FADE$4);
      }

      this._element = backdrop;
    }

    return this._element;
  }

  _getConfig(config) {
    config = { ...Default$7,
      ...(typeof config === 'object' ? config : {})
    }; // use getElement() with the default "body" to get a fresh Element on each instantiation

    config.rootElement = getElement(config.rootElement);
    typeCheckConfig(NAME$8, config, DefaultType$7);
    return config;
  }

  _append() {
    if (this._isAppended) {
      return;
    }

    this._config.rootElement.append(this._getElement());

    EventHandler.on(this._getElement(), EVENT_MOUSEDOWN, () => {
      execute(this._config.clickCallback);
    });
    this._isAppended = true;
  }

  dispose() {
    if (!this._isAppended) {
      return;
    }

    EventHandler.off(this._element, EVENT_MOUSEDOWN);

    this._element.remove();

    this._isAppended = false;
  }

  _emulateAnimation(callback) {
    executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
  }

}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): util/focustrap.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
const Default$6 = {
  trapElement: null,
  // The element to trap focus inside of
  autofocus: true
};
const DefaultType$6 = {
  trapElement: 'element',
  autofocus: 'boolean'
};
const NAME$7 = 'focustrap';
const DATA_KEY$7 = 'bs.focustrap';
const EVENT_KEY$7 = `.${DATA_KEY$7}`;
const EVENT_FOCUSIN$1 = `focusin${EVENT_KEY$7}`;
const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$7}`;
const TAB_KEY = 'Tab';
const TAB_NAV_FORWARD = 'forward';
const TAB_NAV_BACKWARD = 'backward';

class FocusTrap {
  constructor(config) {
    this._config = this._getConfig(config);
    this._isActive = false;
    this._lastTabNavDirection = null;
  }

  activate() {
    const {
      trapElement,
      autofocus
    } = this._config;

    if (this._isActive) {
      return;
    }

    if (autofocus) {
      trapElement.focus();
    }

    EventHandler.off(document, EVENT_KEY$7); // guard against infinite focus loop

    EventHandler.on(document, EVENT_FOCUSIN$1, event => this._handleFocusin(event));
    EventHandler.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event));
    this._isActive = true;
  }

  deactivate() {
    if (!this._isActive) {
      return;
    }

    this._isActive = false;
    EventHandler.off(document, EVENT_KEY$7);
  } // Private


  _handleFocusin(event) {
    const {
      target
    } = event;
    const {
      trapElement
    } = this._config;

    if (target === document || target === trapElement || trapElement.contains(target)) {
      return;
    }

    const elements = SelectorEngine.focusableChildren(trapElement);

    if (elements.length === 0) {
      trapElement.focus();
    } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
      elements[elements.length - 1].focus();
    } else {
      elements[0].focus();
    }
  }

  _handleKeydown(event) {
    if (event.key !== TAB_KEY) {
      return;
    }

    this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
  }

  _getConfig(config) {
    config = { ...Default$6,
      ...(typeof config === 'object' ? config : {})
    };
    typeCheckConfig(NAME$7, config, DefaultType$6);
    return config;
  }

}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): modal.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$6 = 'modal';
const DATA_KEY$6 = 'bs.modal';
const EVENT_KEY$6 = `.${DATA_KEY$6}`;
const DATA_API_KEY$3 = '.data-api';
const ESCAPE_KEY$1 = 'Escape';
const Default$5 = {
  backdrop: true,
  keyboard: true,
  focus: true
};
const DefaultType$5 = {
  backdrop: '(boolean|string)',
  keyboard: 'boolean',
  focus: 'boolean'
};
const EVENT_HIDE$3 = `hide${EVENT_KEY$6}`;
const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$6}`;
const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$6}`;
const EVENT_SHOW$3 = `show${EVENT_KEY$6}`;
const EVENT_SHOWN$3 = `shown${EVENT_KEY$6}`;
const EVENT_RESIZE = `resize${EVENT_KEY$6}`;
const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY$6}`;
const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$6}`;
const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY$6}`;
const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$6}`;
const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
const CLASS_NAME_OPEN = 'modal-open';
const CLASS_NAME_FADE$3 = 'fade';
const CLASS_NAME_SHOW$4 = 'show';
const CLASS_NAME_STATIC = 'modal-static';
const OPEN_SELECTOR$1 = '.modal.show';
const SELECTOR_DIALOG = '.modal-dialog';
const SELECTOR_MODAL_BODY = '.modal-body';
const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Modal extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._config = this._getConfig(config);
    this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
    this._backdrop = this._initializeBackDrop();
    this._focustrap = this._initializeFocusTrap();
    this._isShown = false;
    this._ignoreBackdropClick = false;
    this._isTransitioning = false;
    this._scrollBar = new ScrollBarHelper();
  } // Getters


  static get Default() {
    return Default$5;
  }

  static get NAME() {
    return NAME$6;
  } // Public


  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget);
  }

  show(relatedTarget) {
    if (this._isShown || this._isTransitioning) {
      return;
    }

    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
      relatedTarget
    });

    if (showEvent.defaultPrevented) {
      return;
    }

    this._isShown = true;

    if (this._isAnimated()) {
      this._isTransitioning = true;
    }

    this._scrollBar.hide();

    document.body.classList.add(CLASS_NAME_OPEN);

    this._adjustDialog();

    this._setEscapeEvent();

    this._setResizeEvent();

    EventHandler.on(this._dialog, EVENT_MOUSEDOWN_DISMISS, () => {
      EventHandler.one(this._element, EVENT_MOUSEUP_DISMISS, event => {
        if (event.target === this._element) {
          this._ignoreBackdropClick = true;
        }
      });
    });

    this._showBackdrop(() => this._showElement(relatedTarget));
  }

  hide() {
    if (!this._isShown || this._isTransitioning) {
      return;
    }

    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);

    if (hideEvent.defaultPrevented) {
      return;
    }

    this._isShown = false;

    const isAnimated = this._isAnimated();

    if (isAnimated) {
      this._isTransitioning = true;
    }

    this._setEscapeEvent();

    this._setResizeEvent();

    this._focustrap.deactivate();

    this._element.classList.remove(CLASS_NAME_SHOW$4);

    EventHandler.off(this._element, EVENT_CLICK_DISMISS);
    EventHandler.off(this._dialog, EVENT_MOUSEDOWN_DISMISS);

    this._queueCallback(() => this._hideModal(), this._element, isAnimated);
  }

  dispose() {
    [window, this._dialog].forEach(htmlElement => EventHandler.off(htmlElement, EVENT_KEY$6));

    this._backdrop.dispose();

    this._focustrap.deactivate();

    super.dispose();
  }

  handleUpdate() {
    this._adjustDialog();
  } // Private


  _initializeBackDrop() {
    return new Backdrop({
      isVisible: Boolean(this._config.backdrop),
      // 'static' option will be translated to true, and booleans will keep their value
      isAnimated: this._isAnimated()
    });
  }

  _initializeFocusTrap() {
    return new FocusTrap({
      trapElement: this._element
    });
  }

  _getConfig(config) {
    config = { ...Default$5,
      ...Manipulator.getDataAttributes(this._element),
      ...(typeof config === 'object' ? config : {})
    };
    typeCheckConfig(NAME$6, config, DefaultType$5);
    return config;
  }

  _showElement(relatedTarget) {
    const isAnimated = this._isAnimated();

    const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);

    if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
      // Don't move modal's DOM position
      document.body.append(this._element);
    }

    this._element.style.display = 'block';

    this._element.removeAttribute('aria-hidden');

    this._element.setAttribute('aria-modal', true);

    this._element.setAttribute('role', 'dialog');

    this._element.scrollTop = 0;

    if (modalBody) {
      modalBody.scrollTop = 0;
    }

    if (isAnimated) {
      reflow(this._element);
    }

    this._element.classList.add(CLASS_NAME_SHOW$4);

    const transitionComplete = () => {
      if (this._config.focus) {
        this._focustrap.activate();
      }

      this._isTransitioning = false;
      EventHandler.trigger(this._element, EVENT_SHOWN$3, {
        relatedTarget
      });
    };

    this._queueCallback(transitionComplete, this._dialog, isAnimated);
  }

  _setEscapeEvent() {
    if (this._isShown) {
      EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, event => {
        if (this._config.keyboard && event.key === ESCAPE_KEY$1) {
          event.preventDefault();
          this.hide();
        } else if (!this._config.keyboard && event.key === ESCAPE_KEY$1) {
          this._triggerBackdropTransition();
        }
      });
    } else {
      EventHandler.off(this._element, EVENT_KEYDOWN_DISMISS$1);
    }
  }

  _setResizeEvent() {
    if (this._isShown) {
      EventHandler.on(window, EVENT_RESIZE, () => this._adjustDialog());
    } else {
      EventHandler.off(window, EVENT_RESIZE);
    }
  }

  _hideModal() {
    this._element.style.display = 'none';

    this._element.setAttribute('aria-hidden', true);

    this._element.removeAttribute('aria-modal');

    this._element.removeAttribute('role');

    this._isTransitioning = false;

    this._backdrop.hide(() => {
      document.body.classList.remove(CLASS_NAME_OPEN);

      this._resetAdjustments();

      this._scrollBar.reset();

      EventHandler.trigger(this._element, EVENT_HIDDEN$3);
    });
  }

  _showBackdrop(callback) {
    EventHandler.on(this._element, EVENT_CLICK_DISMISS, event => {
      if (this._ignoreBackdropClick) {
        this._ignoreBackdropClick = false;
        return;
      }

      if (event.target !== event.currentTarget) {
        return;
      }

      if (this._config.backdrop === true) {
        this.hide();
      } else if (this._config.backdrop === 'static') {
        this._triggerBackdropTransition();
      }
    });

    this._backdrop.show(callback);
  }

  _isAnimated() {
    return this._element.classList.contains(CLASS_NAME_FADE$3);
  }

  _triggerBackdropTransition() {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);

    if (hideEvent.defaultPrevented) {
      return;
    }

    const {
      classList,
      scrollHeight,
      style
    } = this._element;
    const isModalOverflowing = scrollHeight > document.documentElement.clientHeight; // return if the following background transition hasn't yet completed

    if (!isModalOverflowing && style.overflowY === 'hidden' || classList.contains(CLASS_NAME_STATIC)) {
      return;
    }

    if (!isModalOverflowing) {
      style.overflowY = 'hidden';
    }

    classList.add(CLASS_NAME_STATIC);

    this._queueCallback(() => {
      classList.remove(CLASS_NAME_STATIC);

      if (!isModalOverflowing) {
        this._queueCallback(() => {
          style.overflowY = '';
        }, this._dialog);
      }
    }, this._dialog);

    this._element.focus();
  } // ----------------------------------------------------------------------
  // the following methods are used to handle overflowing modals
  // ----------------------------------------------------------------------


  _adjustDialog() {
    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

    const scrollbarWidth = this._scrollBar.getWidth();

    const isBodyOverflowing = scrollbarWidth > 0;

    if (!isBodyOverflowing && isModalOverflowing && !isRTL() || isBodyOverflowing && !isModalOverflowing && isRTL()) {
      this._element.style.paddingLeft = `${scrollbarWidth}px`;
    }

    if (isBodyOverflowing && !isModalOverflowing && !isRTL() || !isBodyOverflowing && isModalOverflowing && isRTL()) {
      this._element.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  _resetAdjustments() {
    this._element.style.paddingLeft = '';
    this._element.style.paddingRight = '';
  } // Static


  static jQueryInterface(config, relatedTarget) {
    return this.each(function () {
      const data = Modal.getOrCreateInstance(this, config);

      if (typeof config !== 'string') {
        return;
      }

      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config](relatedTarget);
    });
  }

}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */


EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
  const target = getElementFromSelector(this);

  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }

  EventHandler.one(target, EVENT_SHOW$3, showEvent => {
    if (showEvent.defaultPrevented) {
      // only register focus restorer if modal will actually get shown
      return;
    }

    EventHandler.one(target, EVENT_HIDDEN$3, () => {
      if (isVisible(this)) {
        this.focus();
      }
    });
  }); // avoid conflict when clicking moddal toggler while another one is open

  const allReadyOpen = SelectorEngine.findOne(OPEN_SELECTOR$1);

  if (allReadyOpen) {
    Modal.getInstance(allReadyOpen).hide();
  }

  const data = Modal.getOrCreateInstance(target);
  data.toggle(this);
});
enableDismissTrigger(Modal);
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Modal to jQuery only if jQuery is present
 */

defineJQueryPlugin(Modal);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): offcanvas.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$5 = 'offcanvas';
const DATA_KEY$5 = 'bs.offcanvas';
const EVENT_KEY$5 = `.${DATA_KEY$5}`;
const DATA_API_KEY$2 = '.data-api';
const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$5}${DATA_API_KEY$2}`;
const ESCAPE_KEY = 'Escape';
const Default$4 = {
  backdrop: true,
  keyboard: true,
  scroll: false
};
const DefaultType$4 = {
  backdrop: 'boolean',
  keyboard: 'boolean',
  scroll: 'boolean'
};
const CLASS_NAME_SHOW$3 = 'show';
const CLASS_NAME_BACKDROP = 'offcanvas-backdrop';
const OPEN_SELECTOR = '.offcanvas.show';
const EVENT_SHOW$2 = `show${EVENT_KEY$5}`;
const EVENT_SHOWN$2 = `shown${EVENT_KEY$5}`;
const EVENT_HIDE$2 = `hide${EVENT_KEY$5}`;
const EVENT_HIDDEN$2 = `hidden${EVENT_KEY$5}`;
const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$5}${DATA_API_KEY$2}`;
const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$5}`;
const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Offcanvas extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._config = this._getConfig(config);
    this._isShown = false;
    this._backdrop = this._initializeBackDrop();
    this._focustrap = this._initializeFocusTrap();

    this._addEventListeners();
  } // Getters


  static get NAME() {
    return NAME$5;
  }

  static get Default() {
    return Default$4;
  } // Public


  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget);
  }

  show(relatedTarget) {
    if (this._isShown) {
      return;
    }

    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$2, {
      relatedTarget
    });

    if (showEvent.defaultPrevented) {
      return;
    }

    this._isShown = true;
    this._element.style.visibility = 'visible';

    this._backdrop.show();

    if (!this._config.scroll) {
      new ScrollBarHelper().hide();
    }

    this._element.removeAttribute('aria-hidden');

    this._element.setAttribute('aria-modal', true);

    this._element.setAttribute('role', 'dialog');

    this._element.classList.add(CLASS_NAME_SHOW$3);

    const completeCallBack = () => {
      if (!this._config.scroll) {
        this._focustrap.activate();
      }

      EventHandler.trigger(this._element, EVENT_SHOWN$2, {
        relatedTarget
      });
    };

    this._queueCallback(completeCallBack, this._element, true);
  }

  hide() {
    if (!this._isShown) {
      return;
    }

    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$2);

    if (hideEvent.defaultPrevented) {
      return;
    }

    this._focustrap.deactivate();

    this._element.blur();

    this._isShown = false;

    this._element.classList.remove(CLASS_NAME_SHOW$3);

    this._backdrop.hide();

    const completeCallback = () => {
      this._element.setAttribute('aria-hidden', true);

      this._element.removeAttribute('aria-modal');

      this._element.removeAttribute('role');

      this._element.style.visibility = 'hidden';

      if (!this._config.scroll) {
        new ScrollBarHelper().reset();
      }

      EventHandler.trigger(this._element, EVENT_HIDDEN$2);
    };

    this._queueCallback(completeCallback, this._element, true);
  }

  dispose() {
    this._backdrop.dispose();

    this._focustrap.deactivate();

    super.dispose();
  } // Private


  _getConfig(config) {
    config = { ...Default$4,
      ...Manipulator.getDataAttributes(this._element),
      ...(typeof config === 'object' ? config : {})
    };
    typeCheckConfig(NAME$5, config, DefaultType$4);
    return config;
  }

  _initializeBackDrop() {
    return new Backdrop({
      className: CLASS_NAME_BACKDROP,
      isVisible: this._config.backdrop,
      isAnimated: true,
      rootElement: this._element.parentNode,
      clickCallback: () => this.hide()
    });
  }

  _initializeFocusTrap() {
    return new FocusTrap({
      trapElement: this._element
    });
  }

  _addEventListeners() {
    EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
      if (this._config.keyboard && event.key === ESCAPE_KEY) {
        this.hide();
      }
    });
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = Offcanvas.getOrCreateInstance(this, config);

      if (typeof config !== 'string') {
        return;
      }

      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config](this);
    });
  }

}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */


EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
  const target = getElementFromSelector(this);

  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }

  if (isDisabled(this)) {
    return;
  }

  EventHandler.one(target, EVENT_HIDDEN$2, () => {
    // focus on trigger when it is closed
    if (isVisible(this)) {
      this.focus();
    }
  }); // avoid conflict when clicking a toggler of an offcanvas, while another is open

  const allReadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);

  if (allReadyOpen && allReadyOpen !== target) {
    Offcanvas.getInstance(allReadyOpen).hide();
  }

  const data = Offcanvas.getOrCreateInstance(target);
  data.toggle(this);
});
EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => SelectorEngine.find(OPEN_SELECTOR).forEach(el => Offcanvas.getOrCreateInstance(el).show()));
enableDismissTrigger(Offcanvas);
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

defineJQueryPlugin(Offcanvas);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): util/sanitizer.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
const uriAttributes = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);
const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
/**
 * A pattern that recognizes a commonly useful subset of URLs that are safe.
 *
 * Shoutout to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
 */

const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i;
/**
 * A pattern that matches safe data URLs. Only matches image, video and audio types.
 *
 * Shoutout to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
 */

const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;

const allowedAttribute = (attribute, allowedAttributeList) => {
  const attributeName = attribute.nodeName.toLowerCase();

  if (allowedAttributeList.includes(attributeName)) {
    if (uriAttributes.has(attributeName)) {
      return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue) || DATA_URL_PATTERN.test(attribute.nodeValue));
    }

    return true;
  }

  const regExp = allowedAttributeList.filter(attributeRegex => attributeRegex instanceof RegExp); // Check if a regular expression validates the attribute.

  for (let i = 0, len = regExp.length; i < len; i++) {
    if (regExp[i].test(attributeName)) {
      return true;
    }
  }

  return false;
};

const DefaultAllowlist = {
  // Global attributes allowed on any supplied element below.
  '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
  a: ['target', 'href', 'title', 'rel'],
  area: [],
  b: [],
  br: [],
  col: [],
  code: [],
  div: [],
  em: [],
  hr: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  i: [],
  img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
  li: [],
  ol: [],
  p: [],
  pre: [],
  s: [],
  small: [],
  span: [],
  sub: [],
  sup: [],
  strong: [],
  u: [],
  ul: []
};
function sanitizeHtml(unsafeHtml, allowList, sanitizeFn) {
  if (!unsafeHtml.length) {
    return unsafeHtml;
  }

  if (sanitizeFn && typeof sanitizeFn === 'function') {
    return sanitizeFn(unsafeHtml);
  }

  const domParser = new window.DOMParser();
  const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
  const elements = [].concat(...createdDocument.body.querySelectorAll('*'));

  for (let i = 0, len = elements.length; i < len; i++) {
    const element = elements[i];
    const elementName = element.nodeName.toLowerCase();

    if (!Object.keys(allowList).includes(elementName)) {
      element.remove();
      continue;
    }

    const attributeList = [].concat(...element.attributes);
    const allowedAttributes = [].concat(allowList['*'] || [], allowList[elementName] || []);
    attributeList.forEach(attribute => {
      if (!allowedAttribute(attribute, allowedAttributes)) {
        element.removeAttribute(attribute.nodeName);
      }
    });
  }

  return createdDocument.body.innerHTML;
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): tooltip.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$4 = 'tooltip';
const DATA_KEY$4 = 'bs.tooltip';
const EVENT_KEY$4 = `.${DATA_KEY$4}`;
const CLASS_PREFIX$1 = 'bs-tooltip';
const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
const DefaultType$3 = {
  animation: 'boolean',
  template: 'string',
  title: '(string|element|function)',
  trigger: 'string',
  delay: '(number|object)',
  html: 'boolean',
  selector: '(string|boolean)',
  placement: '(string|function)',
  offset: '(array|string|function)',
  container: '(string|element|boolean)',
  fallbackPlacements: 'array',
  boundary: '(string|element)',
  customClass: '(string|function)',
  sanitize: 'boolean',
  sanitizeFn: '(null|function)',
  allowList: 'object',
  popperConfig: '(null|object|function)'
};
const AttachmentMap = {
  AUTO: 'auto',
  TOP: 'top',
  RIGHT: isRTL() ? 'left' : 'right',
  BOTTOM: 'bottom',
  LEFT: isRTL() ? 'right' : 'left'
};
const Default$3 = {
  animation: true,
  template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
  trigger: 'hover focus',
  title: '',
  delay: 0,
  html: false,
  selector: false,
  placement: 'top',
  offset: [0, 0],
  container: false,
  fallbackPlacements: ['top', 'right', 'bottom', 'left'],
  boundary: 'clippingParents',
  customClass: '',
  sanitize: true,
  sanitizeFn: null,
  allowList: DefaultAllowlist,
  popperConfig: null
};
const Event$2 = {
  HIDE: `hide${EVENT_KEY$4}`,
  HIDDEN: `hidden${EVENT_KEY$4}`,
  SHOW: `show${EVENT_KEY$4}`,
  SHOWN: `shown${EVENT_KEY$4}`,
  INSERTED: `inserted${EVENT_KEY$4}`,
  CLICK: `click${EVENT_KEY$4}`,
  FOCUSIN: `focusin${EVENT_KEY$4}`,
  FOCUSOUT: `focusout${EVENT_KEY$4}`,
  MOUSEENTER: `mouseenter${EVENT_KEY$4}`,
  MOUSELEAVE: `mouseleave${EVENT_KEY$4}`
};
const CLASS_NAME_FADE$2 = 'fade';
const CLASS_NAME_MODAL = 'modal';
const CLASS_NAME_SHOW$2 = 'show';
const HOVER_STATE_SHOW = 'show';
const HOVER_STATE_OUT = 'out';
const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
const EVENT_MODAL_HIDE = 'hide.bs.modal';
const TRIGGER_HOVER = 'hover';
const TRIGGER_FOCUS = 'focus';
const TRIGGER_CLICK = 'click';
const TRIGGER_MANUAL = 'manual';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Tooltip extends BaseComponent {
  constructor(element, config) {
    if (typeof _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ === 'undefined') {
      throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)');
    }

    super(element); // private

    this._isEnabled = true;
    this._timeout = 0;
    this._hoverState = '';
    this._activeTrigger = {};
    this._popper = null; // Protected

    this._config = this._getConfig(config);
    this.tip = null;

    this._setListeners();
  } // Getters


  static get Default() {
    return Default$3;
  }

  static get NAME() {
    return NAME$4;
  }

  static get Event() {
    return Event$2;
  }

  static get DefaultType() {
    return DefaultType$3;
  } // Public


  enable() {
    this._isEnabled = true;
  }

  disable() {
    this._isEnabled = false;
  }

  toggleEnabled() {
    this._isEnabled = !this._isEnabled;
  }

  toggle(event) {
    if (!this._isEnabled) {
      return;
    }

    if (event) {
      const context = this._initializeOnDelegatedTarget(event);

      context._activeTrigger.click = !context._activeTrigger.click;

      if (context._isWithActiveTrigger()) {
        context._enter(null, context);
      } else {
        context._leave(null, context);
      }
    } else {
      if (this.getTipElement().classList.contains(CLASS_NAME_SHOW$2)) {
        this._leave(null, this);

        return;
      }

      this._enter(null, this);
    }
  }

  dispose() {
    clearTimeout(this._timeout);
    EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);

    if (this.tip) {
      this.tip.remove();
    }

    this._disposePopper();

    super.dispose();
  }

  show() {
    if (this._element.style.display === 'none') {
      throw new Error('Please use show on visible elements');
    }

    if (!(this.isWithContent() && this._isEnabled)) {
      return;
    }

    const showEvent = EventHandler.trigger(this._element, this.constructor.Event.SHOW);
    const shadowRoot = findShadowRoot(this._element);
    const isInTheDom = shadowRoot === null ? this._element.ownerDocument.documentElement.contains(this._element) : shadowRoot.contains(this._element);

    if (showEvent.defaultPrevented || !isInTheDom) {
      return;
    } // A trick to recreate a tooltip in case a new title is given by using the NOT documented `data-bs-original-title`
    // This will be removed later in favor of a `setContent` method


    if (this.constructor.NAME === 'tooltip' && this.tip && this.getTitle() !== this.tip.querySelector(SELECTOR_TOOLTIP_INNER).innerHTML) {
      this._disposePopper();

      this.tip.remove();
      this.tip = null;
    }

    const tip = this.getTipElement();
    const tipId = getUID(this.constructor.NAME);
    tip.setAttribute('id', tipId);

    this._element.setAttribute('aria-describedby', tipId);

    if (this._config.animation) {
      tip.classList.add(CLASS_NAME_FADE$2);
    }

    const placement = typeof this._config.placement === 'function' ? this._config.placement.call(this, tip, this._element) : this._config.placement;

    const attachment = this._getAttachment(placement);

    this._addAttachmentClass(attachment);

    const {
      container
    } = this._config;
    Data.set(tip, this.constructor.DATA_KEY, this);

    if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
      container.append(tip);
      EventHandler.trigger(this._element, this.constructor.Event.INSERTED);
    }

    if (this._popper) {
      this._popper.update();
    } else {
      this._popper = _popperjs_core__WEBPACK_IMPORTED_MODULE_1__.createPopper(this._element, tip, this._getPopperConfig(attachment));
    }

    tip.classList.add(CLASS_NAME_SHOW$2);

    const customClass = this._resolvePossibleFunction(this._config.customClass);

    if (customClass) {
      tip.classList.add(...customClass.split(' '));
    } // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


    if ('ontouchstart' in document.documentElement) {
      [].concat(...document.body.children).forEach(element => {
        EventHandler.on(element, 'mouseover', noop);
      });
    }

    const complete = () => {
      const prevHoverState = this._hoverState;
      this._hoverState = null;
      EventHandler.trigger(this._element, this.constructor.Event.SHOWN);

      if (prevHoverState === HOVER_STATE_OUT) {
        this._leave(null, this);
      }
    };

    const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$2);

    this._queueCallback(complete, this.tip, isAnimated);
  }

  hide() {
    if (!this._popper) {
      return;
    }

    const tip = this.getTipElement();

    const complete = () => {
      if (this._isWithActiveTrigger()) {
        return;
      }

      if (this._hoverState !== HOVER_STATE_SHOW) {
        tip.remove();
      }

      this._cleanTipClass();

      this._element.removeAttribute('aria-describedby');

      EventHandler.trigger(this._element, this.constructor.Event.HIDDEN);

      this._disposePopper();
    };

    const hideEvent = EventHandler.trigger(this._element, this.constructor.Event.HIDE);

    if (hideEvent.defaultPrevented) {
      return;
    }

    tip.classList.remove(CLASS_NAME_SHOW$2); // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support

    if ('ontouchstart' in document.documentElement) {
      [].concat(...document.body.children).forEach(element => EventHandler.off(element, 'mouseover', noop));
    }

    this._activeTrigger[TRIGGER_CLICK] = false;
    this._activeTrigger[TRIGGER_FOCUS] = false;
    this._activeTrigger[TRIGGER_HOVER] = false;
    const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$2);

    this._queueCallback(complete, this.tip, isAnimated);

    this._hoverState = '';
  }

  update() {
    if (this._popper !== null) {
      this._popper.update();
    }
  } // Protected


  isWithContent() {
    return Boolean(this.getTitle());
  }

  getTipElement() {
    if (this.tip) {
      return this.tip;
    }

    const element = document.createElement('div');
    element.innerHTML = this._config.template;
    const tip = element.children[0];
    this.setContent(tip);
    tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
    this.tip = tip;
    return this.tip;
  }

  setContent(tip) {
    this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TOOLTIP_INNER);
  }

  _sanitizeAndSetContent(template, content, selector) {
    const templateElement = SelectorEngine.findOne(selector, template);

    if (!content && templateElement) {
      templateElement.remove();
      return;
    } // we use append for html objects to maintain js events


    this.setElementContent(templateElement, content);
  }

  setElementContent(element, content) {
    if (element === null) {
      return;
    }

    if (isElement(content)) {
      content = getElement(content); // content is a DOM node or a jQuery

      if (this._config.html) {
        if (content.parentNode !== element) {
          element.innerHTML = '';
          element.append(content);
        }
      } else {
        element.textContent = content.textContent;
      }

      return;
    }

    if (this._config.html) {
      if (this._config.sanitize) {
        content = sanitizeHtml(content, this._config.allowList, this._config.sanitizeFn);
      }

      element.innerHTML = content;
    } else {
      element.textContent = content;
    }
  }

  getTitle() {
    const title = this._element.getAttribute('data-bs-original-title') || this._config.title;

    return this._resolvePossibleFunction(title);
  }

  updateAttachment(attachment) {
    if (attachment === 'right') {
      return 'end';
    }

    if (attachment === 'left') {
      return 'start';
    }

    return attachment;
  } // Private


  _initializeOnDelegatedTarget(event, context) {
    return context || this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
  }

  _getOffset() {
    const {
      offset
    } = this._config;

    if (typeof offset === 'string') {
      return offset.split(',').map(val => Number.parseInt(val, 10));
    }

    if (typeof offset === 'function') {
      return popperData => offset(popperData, this._element);
    }

    return offset;
  }

  _resolvePossibleFunction(content) {
    return typeof content === 'function' ? content.call(this._element) : content;
  }

  _getPopperConfig(attachment) {
    const defaultBsPopperConfig = {
      placement: attachment,
      modifiers: [{
        name: 'flip',
        options: {
          fallbackPlacements: this._config.fallbackPlacements
        }
      }, {
        name: 'offset',
        options: {
          offset: this._getOffset()
        }
      }, {
        name: 'preventOverflow',
        options: {
          boundary: this._config.boundary
        }
      }, {
        name: 'arrow',
        options: {
          element: `.${this.constructor.NAME}-arrow`
        }
      }, {
        name: 'onChange',
        enabled: true,
        phase: 'afterWrite',
        fn: data => this._handlePopperPlacementChange(data)
      }],
      onFirstUpdate: data => {
        if (data.options.placement !== data.placement) {
          this._handlePopperPlacementChange(data);
        }
      }
    };
    return { ...defaultBsPopperConfig,
      ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
    };
  }

  _addAttachmentClass(attachment) {
    this.getTipElement().classList.add(`${this._getBasicClassPrefix()}-${this.updateAttachment(attachment)}`);
  }

  _getAttachment(placement) {
    return AttachmentMap[placement.toUpperCase()];
  }

  _setListeners() {
    const triggers = this._config.trigger.split(' ');

    triggers.forEach(trigger => {
      if (trigger === 'click') {
        EventHandler.on(this._element, this.constructor.Event.CLICK, this._config.selector, event => this.toggle(event));
      } else if (trigger !== TRIGGER_MANUAL) {
        const eventIn = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSEENTER : this.constructor.Event.FOCUSIN;
        const eventOut = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSELEAVE : this.constructor.Event.FOCUSOUT;
        EventHandler.on(this._element, eventIn, this._config.selector, event => this._enter(event));
        EventHandler.on(this._element, eventOut, this._config.selector, event => this._leave(event));
      }
    });

    this._hideModalHandler = () => {
      if (this._element) {
        this.hide();
      }
    };

    EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);

    if (this._config.selector) {
      this._config = { ...this._config,
        trigger: 'manual',
        selector: ''
      };
    } else {
      this._fixTitle();
    }
  }

  _fixTitle() {
    const title = this._element.getAttribute('title');

    const originalTitleType = typeof this._element.getAttribute('data-bs-original-title');

    if (title || originalTitleType !== 'string') {
      this._element.setAttribute('data-bs-original-title', title || '');

      if (title && !this._element.getAttribute('aria-label') && !this._element.textContent) {
        this._element.setAttribute('aria-label', title);
      }

      this._element.setAttribute('title', '');
    }
  }

  _enter(event, context) {
    context = this._initializeOnDelegatedTarget(event, context);

    if (event) {
      context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
    }

    if (context.getTipElement().classList.contains(CLASS_NAME_SHOW$2) || context._hoverState === HOVER_STATE_SHOW) {
      context._hoverState = HOVER_STATE_SHOW;
      return;
    }

    clearTimeout(context._timeout);
    context._hoverState = HOVER_STATE_SHOW;

    if (!context._config.delay || !context._config.delay.show) {
      context.show();
      return;
    }

    context._timeout = setTimeout(() => {
      if (context._hoverState === HOVER_STATE_SHOW) {
        context.show();
      }
    }, context._config.delay.show);
  }

  _leave(event, context) {
    context = this._initializeOnDelegatedTarget(event, context);

    if (event) {
      context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
    }

    if (context._isWithActiveTrigger()) {
      return;
    }

    clearTimeout(context._timeout);
    context._hoverState = HOVER_STATE_OUT;

    if (!context._config.delay || !context._config.delay.hide) {
      context.hide();
      return;
    }

    context._timeout = setTimeout(() => {
      if (context._hoverState === HOVER_STATE_OUT) {
        context.hide();
      }
    }, context._config.delay.hide);
  }

  _isWithActiveTrigger() {
    for (const trigger in this._activeTrigger) {
      if (this._activeTrigger[trigger]) {
        return true;
      }
    }

    return false;
  }

  _getConfig(config) {
    const dataAttributes = Manipulator.getDataAttributes(this._element);
    Object.keys(dataAttributes).forEach(dataAttr => {
      if (DISALLOWED_ATTRIBUTES.has(dataAttr)) {
        delete dataAttributes[dataAttr];
      }
    });
    config = { ...this.constructor.Default,
      ...dataAttributes,
      ...(typeof config === 'object' && config ? config : {})
    };
    config.container = config.container === false ? document.body : getElement(config.container);

    if (typeof config.delay === 'number') {
      config.delay = {
        show: config.delay,
        hide: config.delay
      };
    }

    if (typeof config.title === 'number') {
      config.title = config.title.toString();
    }

    if (typeof config.content === 'number') {
      config.content = config.content.toString();
    }

    typeCheckConfig(NAME$4, config, this.constructor.DefaultType);

    if (config.sanitize) {
      config.template = sanitizeHtml(config.template, config.allowList, config.sanitizeFn);
    }

    return config;
  }

  _getDelegateConfig() {
    const config = {};

    for (const key in this._config) {
      if (this.constructor.Default[key] !== this._config[key]) {
        config[key] = this._config[key];
      }
    } // In the future can be replaced with:
    // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
    // `Object.fromEntries(keysWithDifferentValues)`


    return config;
  }

  _cleanTipClass() {
    const tip = this.getTipElement();
    const basicClassPrefixRegex = new RegExp(`(^|\\s)${this._getBasicClassPrefix()}\\S+`, 'g');
    const tabClass = tip.getAttribute('class').match(basicClassPrefixRegex);

    if (tabClass !== null && tabClass.length > 0) {
      tabClass.map(token => token.trim()).forEach(tClass => tip.classList.remove(tClass));
    }
  }

  _getBasicClassPrefix() {
    return CLASS_PREFIX$1;
  }

  _handlePopperPlacementChange(popperData) {
    const {
      state
    } = popperData;

    if (!state) {
      return;
    }

    this.tip = state.elements.popper;

    this._cleanTipClass();

    this._addAttachmentClass(this._getAttachment(state.placement));
  }

  _disposePopper() {
    if (this._popper) {
      this._popper.destroy();

      this._popper = null;
    }
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = Tooltip.getOrCreateInstance(this, config);

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    });
  }

}
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Tooltip to jQuery only if jQuery is present
 */


defineJQueryPlugin(Tooltip);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): popover.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$3 = 'popover';
const DATA_KEY$3 = 'bs.popover';
const EVENT_KEY$3 = `.${DATA_KEY$3}`;
const CLASS_PREFIX = 'bs-popover';
const Default$2 = { ...Tooltip.Default,
  placement: 'right',
  offset: [0, 8],
  trigger: 'click',
  content: '',
  template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>'
};
const DefaultType$2 = { ...Tooltip.DefaultType,
  content: '(string|element|function)'
};
const Event$1 = {
  HIDE: `hide${EVENT_KEY$3}`,
  HIDDEN: `hidden${EVENT_KEY$3}`,
  SHOW: `show${EVENT_KEY$3}`,
  SHOWN: `shown${EVENT_KEY$3}`,
  INSERTED: `inserted${EVENT_KEY$3}`,
  CLICK: `click${EVENT_KEY$3}`,
  FOCUSIN: `focusin${EVENT_KEY$3}`,
  FOCUSOUT: `focusout${EVENT_KEY$3}`,
  MOUSEENTER: `mouseenter${EVENT_KEY$3}`,
  MOUSELEAVE: `mouseleave${EVENT_KEY$3}`
};
const SELECTOR_TITLE = '.popover-header';
const SELECTOR_CONTENT = '.popover-body';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Popover extends Tooltip {
  // Getters
  static get Default() {
    return Default$2;
  }

  static get NAME() {
    return NAME$3;
  }

  static get Event() {
    return Event$1;
  }

  static get DefaultType() {
    return DefaultType$2;
  } // Overrides


  isWithContent() {
    return this.getTitle() || this._getContent();
  }

  setContent(tip) {
    this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TITLE);

    this._sanitizeAndSetContent(tip, this._getContent(), SELECTOR_CONTENT);
  } // Private


  _getContent() {
    return this._resolvePossibleFunction(this._config.content);
  }

  _getBasicClassPrefix() {
    return CLASS_PREFIX;
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = Popover.getOrCreateInstance(this, config);

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    });
  }

}
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Popover to jQuery only if jQuery is present
 */


defineJQueryPlugin(Popover);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): scrollspy.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$2 = 'scrollspy';
const DATA_KEY$2 = 'bs.scrollspy';
const EVENT_KEY$2 = `.${DATA_KEY$2}`;
const DATA_API_KEY$1 = '.data-api';
const Default$1 = {
  offset: 10,
  method: 'auto',
  target: ''
};
const DefaultType$1 = {
  offset: 'number',
  method: 'string',
  target: '(string|element)'
};
const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
const EVENT_SCROLL = `scroll${EVENT_KEY$2}`;
const EVENT_LOAD_DATA_API = `load${EVENT_KEY$2}${DATA_API_KEY$1}`;
const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
const CLASS_NAME_ACTIVE$1 = 'active';
const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
const SELECTOR_NAV_LIST_GROUP$1 = '.nav, .list-group';
const SELECTOR_NAV_LINKS = '.nav-link';
const SELECTOR_NAV_ITEMS = '.nav-item';
const SELECTOR_LIST_ITEMS = '.list-group-item';
const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}, .${CLASS_NAME_DROPDOWN_ITEM}`;
const SELECTOR_DROPDOWN$1 = '.dropdown';
const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
const METHOD_OFFSET = 'offset';
const METHOD_POSITION = 'position';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class ScrollSpy extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._scrollElement = this._element.tagName === 'BODY' ? window : this._element;
    this._config = this._getConfig(config);
    this._offsets = [];
    this._targets = [];
    this._activeTarget = null;
    this._scrollHeight = 0;
    EventHandler.on(this._scrollElement, EVENT_SCROLL, () => this._process());
    this.refresh();

    this._process();
  } // Getters


  static get Default() {
    return Default$1;
  }

  static get NAME() {
    return NAME$2;
  } // Public


  refresh() {
    const autoMethod = this._scrollElement === this._scrollElement.window ? METHOD_OFFSET : METHOD_POSITION;
    const offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
    const offsetBase = offsetMethod === METHOD_POSITION ? this._getScrollTop() : 0;
    this._offsets = [];
    this._targets = [];
    this._scrollHeight = this._getScrollHeight();
    const targets = SelectorEngine.find(SELECTOR_LINK_ITEMS, this._config.target);
    targets.map(element => {
      const targetSelector = getSelectorFromElement(element);
      const target = targetSelector ? SelectorEngine.findOne(targetSelector) : null;

      if (target) {
        const targetBCR = target.getBoundingClientRect();

        if (targetBCR.width || targetBCR.height) {
          return [Manipulator[offsetMethod](target).top + offsetBase, targetSelector];
        }
      }

      return null;
    }).filter(item => item).sort((a, b) => a[0] - b[0]).forEach(item => {
      this._offsets.push(item[0]);

      this._targets.push(item[1]);
    });
  }

  dispose() {
    EventHandler.off(this._scrollElement, EVENT_KEY$2);
    super.dispose();
  } // Private


  _getConfig(config) {
    config = { ...Default$1,
      ...Manipulator.getDataAttributes(this._element),
      ...(typeof config === 'object' && config ? config : {})
    };
    config.target = getElement(config.target) || document.documentElement;
    typeCheckConfig(NAME$2, config, DefaultType$1);
    return config;
  }

  _getScrollTop() {
    return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
  }

  _getScrollHeight() {
    return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  }

  _getOffsetHeight() {
    return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
  }

  _process() {
    const scrollTop = this._getScrollTop() + this._config.offset;

    const scrollHeight = this._getScrollHeight();

    const maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

    if (this._scrollHeight !== scrollHeight) {
      this.refresh();
    }

    if (scrollTop >= maxScroll) {
      const target = this._targets[this._targets.length - 1];

      if (this._activeTarget !== target) {
        this._activate(target);
      }

      return;
    }

    if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
      this._activeTarget = null;

      this._clear();

      return;
    }

    for (let i = this._offsets.length; i--;) {
      const isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1]);

      if (isActiveTarget) {
        this._activate(this._targets[i]);
      }
    }
  }

  _activate(target) {
    this._activeTarget = target;

    this._clear();

    const queries = SELECTOR_LINK_ITEMS.split(',').map(selector => `${selector}[data-bs-target="${target}"],${selector}[href="${target}"]`);
    const link = SelectorEngine.findOne(queries.join(','), this._config.target);
    link.classList.add(CLASS_NAME_ACTIVE$1);

    if (link.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
      SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, link.closest(SELECTOR_DROPDOWN$1)).classList.add(CLASS_NAME_ACTIVE$1);
    } else {
      SelectorEngine.parents(link, SELECTOR_NAV_LIST_GROUP$1).forEach(listGroup => {
        // Set triggered links parents as active
        // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
        SelectorEngine.prev(listGroup, `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1)); // Handle special case when .nav-link is inside .nav-item

        SelectorEngine.prev(listGroup, SELECTOR_NAV_ITEMS).forEach(navItem => {
          SelectorEngine.children(navItem, SELECTOR_NAV_LINKS).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1));
        });
      });
    }

    EventHandler.trigger(this._scrollElement, EVENT_ACTIVATE, {
      relatedTarget: target
    });
  }

  _clear() {
    SelectorEngine.find(SELECTOR_LINK_ITEMS, this._config.target).filter(node => node.classList.contains(CLASS_NAME_ACTIVE$1)).forEach(node => node.classList.remove(CLASS_NAME_ACTIVE$1));
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = ScrollSpy.getOrCreateInstance(this, config);

      if (typeof config !== 'string') {
        return;
      }

      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config]();
    });
  }

}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */


EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  SelectorEngine.find(SELECTOR_DATA_SPY).forEach(spy => new ScrollSpy(spy));
});
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .ScrollSpy to jQuery only if jQuery is present
 */

defineJQueryPlugin(ScrollSpy);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$1 = 'tab';
const DATA_KEY$1 = 'bs.tab';
const EVENT_KEY$1 = `.${DATA_KEY$1}`;
const DATA_API_KEY = '.data-api';
const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}${DATA_API_KEY}`;
const CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu';
const CLASS_NAME_ACTIVE = 'active';
const CLASS_NAME_FADE$1 = 'fade';
const CLASS_NAME_SHOW$1 = 'show';
const SELECTOR_DROPDOWN = '.dropdown';
const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
const SELECTOR_ACTIVE = '.active';
const SELECTOR_ACTIVE_UL = ':scope > li > .active';
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]';
const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
const SELECTOR_DROPDOWN_ACTIVE_CHILD = ':scope > .dropdown-menu .active';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Tab extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME$1;
  } // Public


  show() {
    if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && this._element.classList.contains(CLASS_NAME_ACTIVE)) {
      return;
    }

    let previous;
    const target = getElementFromSelector(this._element);

    const listElement = this._element.closest(SELECTOR_NAV_LIST_GROUP);

    if (listElement) {
      const itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? SELECTOR_ACTIVE_UL : SELECTOR_ACTIVE;
      previous = SelectorEngine.find(itemSelector, listElement);
      previous = previous[previous.length - 1];
    }

    const hideEvent = previous ? EventHandler.trigger(previous, EVENT_HIDE$1, {
      relatedTarget: this._element
    }) : null;
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$1, {
      relatedTarget: previous
    });

    if (showEvent.defaultPrevented || hideEvent !== null && hideEvent.defaultPrevented) {
      return;
    }

    this._activate(this._element, listElement);

    const complete = () => {
      EventHandler.trigger(previous, EVENT_HIDDEN$1, {
        relatedTarget: this._element
      });
      EventHandler.trigger(this._element, EVENT_SHOWN$1, {
        relatedTarget: previous
      });
    };

    if (target) {
      this._activate(target, target.parentNode, complete);
    } else {
      complete();
    }
  } // Private


  _activate(element, container, callback) {
    const activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? SelectorEngine.find(SELECTOR_ACTIVE_UL, container) : SelectorEngine.children(container, SELECTOR_ACTIVE);
    const active = activeElements[0];
    const isTransitioning = callback && active && active.classList.contains(CLASS_NAME_FADE$1);

    const complete = () => this._transitionComplete(element, active, callback);

    if (active && isTransitioning) {
      active.classList.remove(CLASS_NAME_SHOW$1);

      this._queueCallback(complete, element, true);
    } else {
      complete();
    }
  }

  _transitionComplete(element, active, callback) {
    if (active) {
      active.classList.remove(CLASS_NAME_ACTIVE);
      const dropdownChild = SelectorEngine.findOne(SELECTOR_DROPDOWN_ACTIVE_CHILD, active.parentNode);

      if (dropdownChild) {
        dropdownChild.classList.remove(CLASS_NAME_ACTIVE);
      }

      if (active.getAttribute('role') === 'tab') {
        active.setAttribute('aria-selected', false);
      }
    }

    element.classList.add(CLASS_NAME_ACTIVE);

    if (element.getAttribute('role') === 'tab') {
      element.setAttribute('aria-selected', true);
    }

    reflow(element);

    if (element.classList.contains(CLASS_NAME_FADE$1)) {
      element.classList.add(CLASS_NAME_SHOW$1);
    }

    let parent = element.parentNode;

    if (parent && parent.nodeName === 'LI') {
      parent = parent.parentNode;
    }

    if (parent && parent.classList.contains(CLASS_NAME_DROPDOWN_MENU)) {
      const dropdownElement = element.closest(SELECTOR_DROPDOWN);

      if (dropdownElement) {
        SelectorEngine.find(SELECTOR_DROPDOWN_TOGGLE, dropdownElement).forEach(dropdown => dropdown.classList.add(CLASS_NAME_ACTIVE));
      }

      element.setAttribute('aria-expanded', true);
    }

    if (callback) {
      callback();
    }
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = Tab.getOrCreateInstance(this);

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    });
  }

}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */


EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }

  if (isDisabled(this)) {
    return;
  }

  const data = Tab.getOrCreateInstance(this);
  data.show();
});
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Tab to jQuery only if jQuery is present
 */

defineJQueryPlugin(Tab);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): toast.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'toast';
const DATA_KEY = 'bs.toast';
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const CLASS_NAME_FADE = 'fade';
const CLASS_NAME_HIDE = 'hide'; // @deprecated - kept here only for backwards compatibility

const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_SHOWING = 'showing';
const DefaultType = {
  animation: 'boolean',
  autohide: 'boolean',
  delay: 'number'
};
const Default = {
  animation: true,
  autohide: true,
  delay: 5000
};
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Toast extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._config = this._getConfig(config);
    this._timeout = null;
    this._hasMouseInteraction = false;
    this._hasKeyboardInteraction = false;

    this._setListeners();
  } // Getters


  static get DefaultType() {
    return DefaultType;
  }

  static get Default() {
    return Default;
  }

  static get NAME() {
    return NAME;
  } // Public


  show() {
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);

    if (showEvent.defaultPrevented) {
      return;
    }

    this._clearTimeout();

    if (this._config.animation) {
      this._element.classList.add(CLASS_NAME_FADE);
    }

    const complete = () => {
      this._element.classList.remove(CLASS_NAME_SHOWING);

      EventHandler.trigger(this._element, EVENT_SHOWN);

      this._maybeScheduleHide();
    };

    this._element.classList.remove(CLASS_NAME_HIDE); // @deprecated


    reflow(this._element);

    this._element.classList.add(CLASS_NAME_SHOW);

    this._element.classList.add(CLASS_NAME_SHOWING);

    this._queueCallback(complete, this._element, this._config.animation);
  }

  hide() {
    if (!this._element.classList.contains(CLASS_NAME_SHOW)) {
      return;
    }

    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);

    if (hideEvent.defaultPrevented) {
      return;
    }

    const complete = () => {
      this._element.classList.add(CLASS_NAME_HIDE); // @deprecated


      this._element.classList.remove(CLASS_NAME_SHOWING);

      this._element.classList.remove(CLASS_NAME_SHOW);

      EventHandler.trigger(this._element, EVENT_HIDDEN);
    };

    this._element.classList.add(CLASS_NAME_SHOWING);

    this._queueCallback(complete, this._element, this._config.animation);
  }

  dispose() {
    this._clearTimeout();

    if (this._element.classList.contains(CLASS_NAME_SHOW)) {
      this._element.classList.remove(CLASS_NAME_SHOW);
    }

    super.dispose();
  } // Private


  _getConfig(config) {
    config = { ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...(typeof config === 'object' && config ? config : {})
    };
    typeCheckConfig(NAME, config, this.constructor.DefaultType);
    return config;
  }

  _maybeScheduleHide() {
    if (!this._config.autohide) {
      return;
    }

    if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
      return;
    }

    this._timeout = setTimeout(() => {
      this.hide();
    }, this._config.delay);
  }

  _onInteraction(event, isInteracting) {
    switch (event.type) {
      case 'mouseover':
      case 'mouseout':
        this._hasMouseInteraction = isInteracting;
        break;

      case 'focusin':
      case 'focusout':
        this._hasKeyboardInteraction = isInteracting;
        break;
    }

    if (isInteracting) {
      this._clearTimeout();

      return;
    }

    const nextElement = event.relatedTarget;

    if (this._element === nextElement || this._element.contains(nextElement)) {
      return;
    }

    this._maybeScheduleHide();
  }

  _setListeners() {
    EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
    EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
    EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
    EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
  }

  _clearTimeout() {
    clearTimeout(this._timeout);
    this._timeout = null;
  } // Static


  static jQueryInterface(config) {
    return this.each(function () {
      const data = Toast.getOrCreateInstance(this, config);

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config](this);
      }
    });
  }

}

enableDismissTrigger(Toast);
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Toast to jQuery only if jQuery is present
 */

defineJQueryPlugin(Toast);




/***/ }),

/***/ "./src/components/header.ts":
/*!**********************************!*\
  !*** ./src/components/header.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ header)
/* harmony export */ });
/* harmony import */ var _modules_elementBuilder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/elementBuilder */ "./src/modules/elementBuilder.ts");

function header() {
    const headerContainer = (0,_modules_elementBuilder__WEBPACK_IMPORTED_MODULE_0__.newElement)({
        element: 'header',
        className: 'test test2',
        elementID: 'headerContainer',
    });
    const headerText = (0,_modules_elementBuilder__WEBPACK_IMPORTED_MODULE_0__.newElement)({
        element: 'h1',
        className: 'test',
        elementID: 'header',
        text: 'Battleship!!',
    });
    headerContainer.appendChild(headerText);
    return headerContainer;
}


/***/ }),

/***/ "./src/modules/elementBuilder.ts":
/*!***************************************!*\
  !*** ./src/modules/elementBuilder.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "closeWindow": () => (/* binding */ closeWindow),
/* harmony export */   "moduleRender": () => (/* binding */ moduleRender),
/* harmony export */   "newElement": () => (/* binding */ newElement),
/* harmony export */   "removeAllChildNodes": () => (/* binding */ removeAllChildNodes),
/* harmony export */   "sendToBody": () => (/* binding */ sendToBody)
/* harmony export */ });
/* eslint-disable object-curly-newline */
function newElement({ element = '', className = '', elementID = '', text = '', href = '', src = '', alt = '' }) {
    const DOMelement = document.createElement(element);
    if (className)
        DOMelement.className = className;
    if (elementID)
        DOMelement.id = elementID;
    if (text)
        DOMelement.textContent = text;
    if (element === 'a' && href)
        DOMelement.setAttribute('href', href);
    if (element === 'img' && src)
        DOMelement.setAttribute('src', src);
    if (element === 'img' && alt)
        DOMelement.setAttribute('alt', alt);
    return DOMelement;
}
function sendToBody(HTML) {
    return document.body.appendChild(HTML);
}
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
function moduleRender(obj, parentNode) {
    removeAllChildNodes(parentNode);
    Object.keys(obj).forEach((x) => parentNode.appendChild(obj[x]));
}
const closeWindow = (element) => {
    document.body.removeChild(element);
};



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bootstrap */ "./node_modules/bootstrap/dist/js/bootstrap.esm.js");
/* harmony import */ var _modules_elementBuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/elementBuilder */ "./src/modules/elementBuilder.ts");
/* harmony import */ var _components_header__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/header */ "./src/components/header.ts");

// import Player from './modules/player';


const main = _modules_elementBuilder__WEBPACK_IMPORTED_MODULE_1__.newElement({
    element: 'div',
    elementID: 'main',
});
const headerModel = (0,_components_header__WEBPACK_IMPORTED_MODULE_2__["default"])();
const model = {
    headerModel,
};
_modules_elementBuilder__WEBPACK_IMPORTED_MODULE_1__.moduleRender(model, main);
_modules_elementBuilder__WEBPACK_IMPORTED_MODULE_1__.sendToBody(main);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDa0Y7Ozs7Ozs7VUNoQ2xGO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ05tQjtBQUNuQjtBQUMyRDtBQUNsQjtBQUN6QyxhQUFhLCtEQUF5QjtBQUN0QztBQUNBO0FBQ0EsQ0FBQztBQUNELG9CQUFvQiw4REFBTTtBQUMxQjtBQUNBO0FBQ0E7QUFDQSxpRUFBMkI7QUFDM0IsK0RBQXlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvY3JlYXRlUG9wcGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9jb250YWlucy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Qm91bmRpbmdDbGllbnRSZWN0LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRDbGlwcGluZ1JlY3QuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldENvbXBvc2l0ZVJlY3QuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldENvbXB1dGVkU3R5bGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldERvY3VtZW50RWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0RG9jdW1lbnRSZWN0LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRIVE1MRWxlbWVudFNjcm9sbC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0TGF5b3V0UmVjdC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Tm9kZU5hbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldE5vZGVTY3JvbGwuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldE9mZnNldFBhcmVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0UGFyZW50Tm9kZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0U2Nyb2xsUGFyZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRWaWV3cG9ydFJlY3QuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldFdpbmRvdy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0V2luZG93U2Nyb2xsLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRXaW5kb3dTY3JvbGxCYXJYLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9pbnN0YW5jZU9mLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9pc1Njcm9sbFBhcmVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvaXNUYWJsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2xpc3RTY3JvbGxQYXJlbnRzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2VudW1zLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9hcHBseVN0eWxlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvYXJyb3cuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL2NvbXB1dGVTdHlsZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL2V2ZW50TGlzdGVuZXJzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9mbGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9oaWRlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvb2Zmc2V0LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9wb3BwZXJPZmZzZXRzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9wcmV2ZW50T3ZlcmZsb3cuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvcG9wcGVyLWxpdGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvcG9wcGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2NvbXB1dGVBdXRvUGxhY2VtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2NvbXB1dGVPZmZzZXRzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2RlYm91bmNlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2RldGVjdE92ZXJmbG93LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2V4cGFuZFRvSGFzaE1hcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9mb3JtYXQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvZ2V0QWx0QXhpcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRCYXNlUGxhY2VtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2dldEZyZXNoU2lkZU9iamVjdC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvZ2V0T3Bwb3NpdGVQbGFjZW1lbnQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvZ2V0VmFyaWF0aW9uLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL21hdGguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvbWVyZ2VCeU5hbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvbWVyZ2VQYWRkaW5nT2JqZWN0LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL29yZGVyTW9kaWZpZXJzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL3JlY3RUb0NsaWVudFJlY3QuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvdW5pcXVlQnkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvdmFsaWRhdGVNb2RpZmllcnMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvd2l0aGluLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvYm9vdHN0cmFwL2pzL3NyYy91dGlsL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvYm9vdHN0cmFwL2pzL3NyYy9kb20vZXZlbnQtaGFuZGxlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Jvb3RzdHJhcC9qcy9zcmMvZG9tL2RhdGEuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9ib290c3RyYXAvanMvc3JjL2Jhc2UtY29tcG9uZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvYm9vdHN0cmFwL2pzL3NyYy91dGlsL2NvbXBvbmVudC1mdW5jdGlvbnMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9ib290c3RyYXAvanMvc3JjL2FsZXJ0LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvYm9vdHN0cmFwL2pzL3NyYy9idXR0b24uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9ib290c3RyYXAvanMvc3JjL2RvbS9tYW5pcHVsYXRvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Jvb3RzdHJhcC9qcy9zcmMvZG9tL3NlbGVjdG9yLWVuZ2luZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Jvb3RzdHJhcC9qcy9zcmMvY2Fyb3VzZWwuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9ib290c3RyYXAvanMvc3JjL2NvbGxhcHNlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvYm9vdHN0cmFwL2pzL3NyYy9kcm9wZG93bi5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Jvb3RzdHJhcC9qcy9zcmMvdXRpbC9zY3JvbGxiYXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9ib290c3RyYXAvanMvc3JjL3V0aWwvYmFja2Ryb3AuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9ib290c3RyYXAvanMvc3JjL3V0aWwvZm9jdXN0cmFwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvYm9vdHN0cmFwL2pzL3NyYy9tb2RhbC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Jvb3RzdHJhcC9qcy9zcmMvb2ZmY2FudmFzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvYm9vdHN0cmFwL2pzL3NyYy91dGlsL3Nhbml0aXplci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Jvb3RzdHJhcC9qcy9zcmMvdG9vbHRpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Jvb3RzdHJhcC9qcy9zcmMvcG9wb3Zlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Jvb3RzdHJhcC9qcy9zcmMvc2Nyb2xsc3B5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvYm9vdHN0cmFwL2pzL3NyYy90YWIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9ib290c3RyYXAvanMvc3JjL3RvYXN0LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvY29tcG9uZW50cy9oZWFkZXIudHMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2VsZW1lbnRCdWlsZGVyLnRzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnZXRDb21wb3NpdGVSZWN0IGZyb20gXCIuL2RvbS11dGlscy9nZXRDb21wb3NpdGVSZWN0LmpzXCI7XG5pbXBvcnQgZ2V0TGF5b3V0UmVjdCBmcm9tIFwiLi9kb20tdXRpbHMvZ2V0TGF5b3V0UmVjdC5qc1wiO1xuaW1wb3J0IGxpc3RTY3JvbGxQYXJlbnRzIGZyb20gXCIuL2RvbS11dGlscy9saXN0U2Nyb2xsUGFyZW50cy5qc1wiO1xuaW1wb3J0IGdldE9mZnNldFBhcmVudCBmcm9tIFwiLi9kb20tdXRpbHMvZ2V0T2Zmc2V0UGFyZW50LmpzXCI7XG5pbXBvcnQgZ2V0Q29tcHV0ZWRTdHlsZSBmcm9tIFwiLi9kb20tdXRpbHMvZ2V0Q29tcHV0ZWRTdHlsZS5qc1wiO1xuaW1wb3J0IG9yZGVyTW9kaWZpZXJzIGZyb20gXCIuL3V0aWxzL29yZGVyTW9kaWZpZXJzLmpzXCI7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSBcIi4vdXRpbHMvZGVib3VuY2UuanNcIjtcbmltcG9ydCB2YWxpZGF0ZU1vZGlmaWVycyBmcm9tIFwiLi91dGlscy92YWxpZGF0ZU1vZGlmaWVycy5qc1wiO1xuaW1wb3J0IHVuaXF1ZUJ5IGZyb20gXCIuL3V0aWxzL3VuaXF1ZUJ5LmpzXCI7XG5pbXBvcnQgZ2V0QmFzZVBsYWNlbWVudCBmcm9tIFwiLi91dGlscy9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgbWVyZ2VCeU5hbWUgZnJvbSBcIi4vdXRpbHMvbWVyZ2VCeU5hbWUuanNcIjtcbmltcG9ydCBkZXRlY3RPdmVyZmxvdyBmcm9tIFwiLi91dGlscy9kZXRlY3RPdmVyZmxvdy5qc1wiO1xuaW1wb3J0IHsgaXNFbGVtZW50IH0gZnJvbSBcIi4vZG9tLXV0aWxzL2luc3RhbmNlT2YuanNcIjtcbmltcG9ydCB7IGF1dG8gfSBmcm9tIFwiLi9lbnVtcy5qc1wiO1xudmFyIElOVkFMSURfRUxFTUVOVF9FUlJPUiA9ICdQb3BwZXI6IEludmFsaWQgcmVmZXJlbmNlIG9yIHBvcHBlciBhcmd1bWVudCBwcm92aWRlZC4gVGhleSBtdXN0IGJlIGVpdGhlciBhIERPTSBlbGVtZW50IG9yIHZpcnR1YWwgZWxlbWVudC4nO1xudmFyIElORklOSVRFX0xPT1BfRVJST1IgPSAnUG9wcGVyOiBBbiBpbmZpbml0ZSBsb29wIGluIHRoZSBtb2RpZmllcnMgY3ljbGUgaGFzIGJlZW4gZGV0ZWN0ZWQhIFRoZSBjeWNsZSBoYXMgYmVlbiBpbnRlcnJ1cHRlZCB0byBwcmV2ZW50IGEgYnJvd3NlciBjcmFzaC4nO1xudmFyIERFRkFVTFRfT1BUSU9OUyA9IHtcbiAgcGxhY2VtZW50OiAnYm90dG9tJyxcbiAgbW9kaWZpZXJzOiBbXSxcbiAgc3RyYXRlZ3k6ICdhYnNvbHV0ZSdcbn07XG5cbmZ1bmN0aW9uIGFyZVZhbGlkRWxlbWVudHMoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICByZXR1cm4gIWFyZ3Muc29tZShmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIHJldHVybiAhKGVsZW1lbnQgJiYgdHlwZW9mIGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0ID09PSAnZnVuY3Rpb24nKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb3BwZXJHZW5lcmF0b3IoZ2VuZXJhdG9yT3B0aW9ucykge1xuICBpZiAoZ2VuZXJhdG9yT3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgZ2VuZXJhdG9yT3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdmFyIF9nZW5lcmF0b3JPcHRpb25zID0gZ2VuZXJhdG9yT3B0aW9ucyxcbiAgICAgIF9nZW5lcmF0b3JPcHRpb25zJGRlZiA9IF9nZW5lcmF0b3JPcHRpb25zLmRlZmF1bHRNb2RpZmllcnMsXG4gICAgICBkZWZhdWx0TW9kaWZpZXJzID0gX2dlbmVyYXRvck9wdGlvbnMkZGVmID09PSB2b2lkIDAgPyBbXSA6IF9nZW5lcmF0b3JPcHRpb25zJGRlZixcbiAgICAgIF9nZW5lcmF0b3JPcHRpb25zJGRlZjIgPSBfZ2VuZXJhdG9yT3B0aW9ucy5kZWZhdWx0T3B0aW9ucyxcbiAgICAgIGRlZmF1bHRPcHRpb25zID0gX2dlbmVyYXRvck9wdGlvbnMkZGVmMiA9PT0gdm9pZCAwID8gREVGQVVMVF9PUFRJT05TIDogX2dlbmVyYXRvck9wdGlvbnMkZGVmMjtcbiAgcmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZVBvcHBlcihyZWZlcmVuY2UsIHBvcHBlciwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICAgIG9wdGlvbnMgPSBkZWZhdWx0T3B0aW9ucztcbiAgICB9XG5cbiAgICB2YXIgc3RhdGUgPSB7XG4gICAgICBwbGFjZW1lbnQ6ICdib3R0b20nLFxuICAgICAgb3JkZXJlZE1vZGlmaWVyczogW10sXG4gICAgICBvcHRpb25zOiBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX09QVElPTlMsIGRlZmF1bHRPcHRpb25zKSxcbiAgICAgIG1vZGlmaWVyc0RhdGE6IHt9LFxuICAgICAgZWxlbWVudHM6IHtcbiAgICAgICAgcmVmZXJlbmNlOiByZWZlcmVuY2UsXG4gICAgICAgIHBvcHBlcjogcG9wcGVyXG4gICAgICB9LFxuICAgICAgYXR0cmlidXRlczoge30sXG4gICAgICBzdHlsZXM6IHt9XG4gICAgfTtcbiAgICB2YXIgZWZmZWN0Q2xlYW51cEZucyA9IFtdO1xuICAgIHZhciBpc0Rlc3Ryb3llZCA9IGZhbHNlO1xuICAgIHZhciBpbnN0YW5jZSA9IHtcbiAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgIHNldE9wdGlvbnM6IGZ1bmN0aW9uIHNldE9wdGlvbnMoc2V0T3B0aW9uc0FjdGlvbikge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBzZXRPcHRpb25zQWN0aW9uID09PSAnZnVuY3Rpb24nID8gc2V0T3B0aW9uc0FjdGlvbihzdGF0ZS5vcHRpb25zKSA6IHNldE9wdGlvbnNBY3Rpb247XG4gICAgICAgIGNsZWFudXBNb2RpZmllckVmZmVjdHMoKTtcbiAgICAgICAgc3RhdGUub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBzdGF0ZS5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgICAgc3RhdGUuc2Nyb2xsUGFyZW50cyA9IHtcbiAgICAgICAgICByZWZlcmVuY2U6IGlzRWxlbWVudChyZWZlcmVuY2UpID8gbGlzdFNjcm9sbFBhcmVudHMocmVmZXJlbmNlKSA6IHJlZmVyZW5jZS5jb250ZXh0RWxlbWVudCA/IGxpc3RTY3JvbGxQYXJlbnRzKHJlZmVyZW5jZS5jb250ZXh0RWxlbWVudCkgOiBbXSxcbiAgICAgICAgICBwb3BwZXI6IGxpc3RTY3JvbGxQYXJlbnRzKHBvcHBlcilcbiAgICAgICAgfTsgLy8gT3JkZXJzIHRoZSBtb2RpZmllcnMgYmFzZWQgb24gdGhlaXIgZGVwZW5kZW5jaWVzIGFuZCBgcGhhc2VgXG4gICAgICAgIC8vIHByb3BlcnRpZXNcblxuICAgICAgICB2YXIgb3JkZXJlZE1vZGlmaWVycyA9IG9yZGVyTW9kaWZpZXJzKG1lcmdlQnlOYW1lKFtdLmNvbmNhdChkZWZhdWx0TW9kaWZpZXJzLCBzdGF0ZS5vcHRpb25zLm1vZGlmaWVycykpKTsgLy8gU3RyaXAgb3V0IGRpc2FibGVkIG1vZGlmaWVyc1xuXG4gICAgICAgIHN0YXRlLm9yZGVyZWRNb2RpZmllcnMgPSBvcmRlcmVkTW9kaWZpZXJzLmZpbHRlcihmdW5jdGlvbiAobSkge1xuICAgICAgICAgIHJldHVybiBtLmVuYWJsZWQ7XG4gICAgICAgIH0pOyAvLyBWYWxpZGF0ZSB0aGUgcHJvdmlkZWQgbW9kaWZpZXJzIHNvIHRoYXQgdGhlIGNvbnN1bWVyIHdpbGwgZ2V0IHdhcm5lZFxuICAgICAgICAvLyBpZiBvbmUgb2YgdGhlIG1vZGlmaWVycyBpcyBpbnZhbGlkIGZvciBhbnkgcmVhc29uXG5cbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgICAgICAgIHZhciBtb2RpZmllcnMgPSB1bmlxdWVCeShbXS5jb25jYXQob3JkZXJlZE1vZGlmaWVycywgc3RhdGUub3B0aW9ucy5tb2RpZmllcnMpLCBmdW5jdGlvbiAoX3JlZikge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBfcmVmLm5hbWU7XG4gICAgICAgICAgICByZXR1cm4gbmFtZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB2YWxpZGF0ZU1vZGlmaWVycyhtb2RpZmllcnMpO1xuXG4gICAgICAgICAgaWYgKGdldEJhc2VQbGFjZW1lbnQoc3RhdGUub3B0aW9ucy5wbGFjZW1lbnQpID09PSBhdXRvKSB7XG4gICAgICAgICAgICB2YXIgZmxpcE1vZGlmaWVyID0gc3RhdGUub3JkZXJlZE1vZGlmaWVycy5maW5kKGZ1bmN0aW9uIChfcmVmMikge1xuICAgICAgICAgICAgICB2YXIgbmFtZSA9IF9yZWYyLm5hbWU7XG4gICAgICAgICAgICAgIHJldHVybiBuYW1lID09PSAnZmxpcCc7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCFmbGlwTW9kaWZpZXIpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihbJ1BvcHBlcjogXCJhdXRvXCIgcGxhY2VtZW50cyByZXF1aXJlIHRoZSBcImZsaXBcIiBtb2RpZmllciBiZScsICdwcmVzZW50IGFuZCBlbmFibGVkIHRvIHdvcmsuJ10uam9pbignICcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgX2dldENvbXB1dGVkU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKHBvcHBlciksXG4gICAgICAgICAgICAgIG1hcmdpblRvcCA9IF9nZXRDb21wdXRlZFN0eWxlLm1hcmdpblRvcCxcbiAgICAgICAgICAgICAgbWFyZ2luUmlnaHQgPSBfZ2V0Q29tcHV0ZWRTdHlsZS5tYXJnaW5SaWdodCxcbiAgICAgICAgICAgICAgbWFyZ2luQm90dG9tID0gX2dldENvbXB1dGVkU3R5bGUubWFyZ2luQm90dG9tLFxuICAgICAgICAgICAgICBtYXJnaW5MZWZ0ID0gX2dldENvbXB1dGVkU3R5bGUubWFyZ2luTGVmdDsgLy8gV2Ugbm8gbG9uZ2VyIHRha2UgaW50byBhY2NvdW50IGBtYXJnaW5zYCBvbiB0aGUgcG9wcGVyLCBhbmQgaXQgY2FuXG4gICAgICAgICAgLy8gY2F1c2UgYnVncyB3aXRoIHBvc2l0aW9uaW5nLCBzbyB3ZSdsbCB3YXJuIHRoZSBjb25zdW1lclxuXG5cbiAgICAgICAgICBpZiAoW21hcmdpblRvcCwgbWFyZ2luUmlnaHQsIG1hcmdpbkJvdHRvbSwgbWFyZ2luTGVmdF0uc29tZShmdW5jdGlvbiAobWFyZ2luKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChtYXJnaW4pO1xuICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oWydQb3BwZXI6IENTUyBcIm1hcmdpblwiIHN0eWxlcyBjYW5ub3QgYmUgdXNlZCB0byBhcHBseSBwYWRkaW5nJywgJ2JldHdlZW4gdGhlIHBvcHBlciBhbmQgaXRzIHJlZmVyZW5jZSBlbGVtZW50IG9yIGJvdW5kYXJ5LicsICdUbyByZXBsaWNhdGUgbWFyZ2luLCB1c2UgdGhlIGBvZmZzZXRgIG1vZGlmaWVyLCBhcyB3ZWxsIGFzJywgJ3RoZSBgcGFkZGluZ2Agb3B0aW9uIGluIHRoZSBgcHJldmVudE92ZXJmbG93YCBhbmQgYGZsaXBgJywgJ21vZGlmaWVycy4nXS5qb2luKCcgJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJ1bk1vZGlmaWVyRWZmZWN0cygpO1xuICAgICAgICByZXR1cm4gaW5zdGFuY2UudXBkYXRlKCk7XG4gICAgICB9LFxuICAgICAgLy8gU3luYyB1cGRhdGUg4oCTIGl0IHdpbGwgYWx3YXlzIGJlIGV4ZWN1dGVkLCBldmVuIGlmIG5vdCBuZWNlc3NhcnkuIFRoaXNcbiAgICAgIC8vIGlzIHVzZWZ1bCBmb3IgbG93IGZyZXF1ZW5jeSB1cGRhdGVzIHdoZXJlIHN5bmMgYmVoYXZpb3Igc2ltcGxpZmllcyB0aGVcbiAgICAgIC8vIGxvZ2ljLlxuICAgICAgLy8gRm9yIGhpZ2ggZnJlcXVlbmN5IHVwZGF0ZXMgKGUuZy4gYHJlc2l6ZWAgYW5kIGBzY3JvbGxgIGV2ZW50cyksIGFsd2F5c1xuICAgICAgLy8gcHJlZmVyIHRoZSBhc3luYyBQb3BwZXIjdXBkYXRlIG1ldGhvZFxuICAgICAgZm9yY2VVcGRhdGU6IGZ1bmN0aW9uIGZvcmNlVXBkYXRlKCkge1xuICAgICAgICBpZiAoaXNEZXN0cm95ZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgX3N0YXRlJGVsZW1lbnRzID0gc3RhdGUuZWxlbWVudHMsXG4gICAgICAgICAgICByZWZlcmVuY2UgPSBfc3RhdGUkZWxlbWVudHMucmVmZXJlbmNlLFxuICAgICAgICAgICAgcG9wcGVyID0gX3N0YXRlJGVsZW1lbnRzLnBvcHBlcjsgLy8gRG9uJ3QgcHJvY2VlZCBpZiBgcmVmZXJlbmNlYCBvciBgcG9wcGVyYCBhcmUgbm90IHZhbGlkIGVsZW1lbnRzXG4gICAgICAgIC8vIGFueW1vcmVcblxuICAgICAgICBpZiAoIWFyZVZhbGlkRWxlbWVudHMocmVmZXJlbmNlLCBwb3BwZXIpKSB7XG4gICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihJTlZBTElEX0VMRU1FTlRfRVJST1IpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSAvLyBTdG9yZSB0aGUgcmVmZXJlbmNlIGFuZCBwb3BwZXIgcmVjdHMgdG8gYmUgcmVhZCBieSBtb2RpZmllcnNcblxuXG4gICAgICAgIHN0YXRlLnJlY3RzID0ge1xuICAgICAgICAgIHJlZmVyZW5jZTogZ2V0Q29tcG9zaXRlUmVjdChyZWZlcmVuY2UsIGdldE9mZnNldFBhcmVudChwb3BwZXIpLCBzdGF0ZS5vcHRpb25zLnN0cmF0ZWd5ID09PSAnZml4ZWQnKSxcbiAgICAgICAgICBwb3BwZXI6IGdldExheW91dFJlY3QocG9wcGVyKVxuICAgICAgICB9OyAvLyBNb2RpZmllcnMgaGF2ZSB0aGUgYWJpbGl0eSB0byByZXNldCB0aGUgY3VycmVudCB1cGRhdGUgY3ljbGUuIFRoZVxuICAgICAgICAvLyBtb3N0IGNvbW1vbiB1c2UgY2FzZSBmb3IgdGhpcyBpcyB0aGUgYGZsaXBgIG1vZGlmaWVyIGNoYW5naW5nIHRoZVxuICAgICAgICAvLyBwbGFjZW1lbnQsIHdoaWNoIHRoZW4gbmVlZHMgdG8gcmUtcnVuIGFsbCB0aGUgbW9kaWZpZXJzLCBiZWNhdXNlIHRoZVxuICAgICAgICAvLyBsb2dpYyB3YXMgcHJldmlvdXNseSByYW4gZm9yIHRoZSBwcmV2aW91cyBwbGFjZW1lbnQgYW5kIGlzIHRoZXJlZm9yZVxuICAgICAgICAvLyBzdGFsZS9pbmNvcnJlY3RcblxuICAgICAgICBzdGF0ZS5yZXNldCA9IGZhbHNlO1xuICAgICAgICBzdGF0ZS5wbGFjZW1lbnQgPSBzdGF0ZS5vcHRpb25zLnBsYWNlbWVudDsgLy8gT24gZWFjaCB1cGRhdGUgY3ljbGUsIHRoZSBgbW9kaWZpZXJzRGF0YWAgcHJvcGVydHkgZm9yIGVhY2ggbW9kaWZpZXJcbiAgICAgICAgLy8gaXMgZmlsbGVkIHdpdGggdGhlIGluaXRpYWwgZGF0YSBzcGVjaWZpZWQgYnkgdGhlIG1vZGlmaWVyLiBUaGlzIG1lYW5zXG4gICAgICAgIC8vIGl0IGRvZXNuJ3QgcGVyc2lzdCBhbmQgaXMgZnJlc2ggb24gZWFjaCB1cGRhdGUuXG4gICAgICAgIC8vIFRvIGVuc3VyZSBwZXJzaXN0ZW50IGRhdGEsIHVzZSBgJHtuYW1lfSNwZXJzaXN0ZW50YFxuXG4gICAgICAgIHN0YXRlLm9yZGVyZWRNb2RpZmllcnMuZm9yRWFjaChmdW5jdGlvbiAobW9kaWZpZXIpIHtcbiAgICAgICAgICByZXR1cm4gc3RhdGUubW9kaWZpZXJzRGF0YVttb2RpZmllci5uYW1lXSA9IE9iamVjdC5hc3NpZ24oe30sIG1vZGlmaWVyLmRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIF9fZGVidWdfbG9vcHNfXyA9IDA7XG5cbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHN0YXRlLm9yZGVyZWRNb2RpZmllcnMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgICAgICAgICAgX19kZWJ1Z19sb29wc19fICs9IDE7XG5cbiAgICAgICAgICAgIGlmIChfX2RlYnVnX2xvb3BzX18gPiAxMDApIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihJTkZJTklURV9MT09QX0VSUk9SKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHN0YXRlLnJlc2V0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICBzdGF0ZS5yZXNldCA9IGZhbHNlO1xuICAgICAgICAgICAgaW5kZXggPSAtMTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBfc3RhdGUkb3JkZXJlZE1vZGlmaWUgPSBzdGF0ZS5vcmRlcmVkTW9kaWZpZXJzW2luZGV4XSxcbiAgICAgICAgICAgICAgZm4gPSBfc3RhdGUkb3JkZXJlZE1vZGlmaWUuZm4sXG4gICAgICAgICAgICAgIF9zdGF0ZSRvcmRlcmVkTW9kaWZpZTIgPSBfc3RhdGUkb3JkZXJlZE1vZGlmaWUub3B0aW9ucyxcbiAgICAgICAgICAgICAgX29wdGlvbnMgPSBfc3RhdGUkb3JkZXJlZE1vZGlmaWUyID09PSB2b2lkIDAgPyB7fSA6IF9zdGF0ZSRvcmRlcmVkTW9kaWZpZTIsXG4gICAgICAgICAgICAgIG5hbWUgPSBfc3RhdGUkb3JkZXJlZE1vZGlmaWUubmFtZTtcblxuICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHN0YXRlID0gZm4oe1xuICAgICAgICAgICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICAgICAgICAgIG9wdGlvbnM6IF9vcHRpb25zLFxuICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2VcbiAgICAgICAgICAgIH0pIHx8IHN0YXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIEFzeW5jIGFuZCBvcHRpbWlzdGljYWxseSBvcHRpbWl6ZWQgdXBkYXRlIOKAkyBpdCB3aWxsIG5vdCBiZSBleGVjdXRlZCBpZlxuICAgICAgLy8gbm90IG5lY2Vzc2FyeSAoZGVib3VuY2VkIHRvIHJ1biBhdCBtb3N0IG9uY2UtcGVyLXRpY2spXG4gICAgICB1cGRhdGU6IGRlYm91bmNlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgICAgaW5zdGFuY2UuZm9yY2VVcGRhdGUoKTtcbiAgICAgICAgICByZXNvbHZlKHN0YXRlKTtcbiAgICAgICAgfSk7XG4gICAgICB9KSxcbiAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICAgIGNsZWFudXBNb2RpZmllckVmZmVjdHMoKTtcbiAgICAgICAgaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoIWFyZVZhbGlkRWxlbWVudHMocmVmZXJlbmNlLCBwb3BwZXIpKSB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoSU5WQUxJRF9FTEVNRU5UX0VSUk9SKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH1cblxuICAgIGluc3RhbmNlLnNldE9wdGlvbnMob3B0aW9ucykudGhlbihmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgIGlmICghaXNEZXN0cm95ZWQgJiYgb3B0aW9ucy5vbkZpcnN0VXBkYXRlKSB7XG4gICAgICAgIG9wdGlvbnMub25GaXJzdFVwZGF0ZShzdGF0ZSk7XG4gICAgICB9XG4gICAgfSk7IC8vIE1vZGlmaWVycyBoYXZlIHRoZSBhYmlsaXR5IHRvIGV4ZWN1dGUgYXJiaXRyYXJ5IGNvZGUgYmVmb3JlIHRoZSBmaXJzdFxuICAgIC8vIHVwZGF0ZSBjeWNsZSBydW5zLiBUaGV5IHdpbGwgYmUgZXhlY3V0ZWQgaW4gdGhlIHNhbWUgb3JkZXIgYXMgdGhlIHVwZGF0ZVxuICAgIC8vIGN5Y2xlLiBUaGlzIGlzIHVzZWZ1bCB3aGVuIGEgbW9kaWZpZXIgYWRkcyBzb21lIHBlcnNpc3RlbnQgZGF0YSB0aGF0XG4gICAgLy8gb3RoZXIgbW9kaWZpZXJzIG5lZWQgdG8gdXNlLCBidXQgdGhlIG1vZGlmaWVyIGlzIHJ1biBhZnRlciB0aGUgZGVwZW5kZW50XG4gICAgLy8gb25lLlxuXG4gICAgZnVuY3Rpb24gcnVuTW9kaWZpZXJFZmZlY3RzKCkge1xuICAgICAgc3RhdGUub3JkZXJlZE1vZGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChfcmVmMykge1xuICAgICAgICB2YXIgbmFtZSA9IF9yZWYzLm5hbWUsXG4gICAgICAgICAgICBfcmVmMyRvcHRpb25zID0gX3JlZjMub3B0aW9ucyxcbiAgICAgICAgICAgIG9wdGlvbnMgPSBfcmVmMyRvcHRpb25zID09PSB2b2lkIDAgPyB7fSA6IF9yZWYzJG9wdGlvbnMsXG4gICAgICAgICAgICBlZmZlY3QgPSBfcmVmMy5lZmZlY3Q7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBlZmZlY3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB2YXIgY2xlYW51cEZuID0gZWZmZWN0KHtcbiAgICAgICAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2UsXG4gICAgICAgICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB2YXIgbm9vcEZuID0gZnVuY3Rpb24gbm9vcEZuKCkge307XG5cbiAgICAgICAgICBlZmZlY3RDbGVhbnVwRm5zLnB1c2goY2xlYW51cEZuIHx8IG5vb3BGbik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFudXBNb2RpZmllckVmZmVjdHMoKSB7XG4gICAgICBlZmZlY3RDbGVhbnVwRm5zLmZvckVhY2goZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgIHJldHVybiBmbigpO1xuICAgICAgfSk7XG4gICAgICBlZmZlY3RDbGVhbnVwRm5zID0gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9O1xufVxuZXhwb3J0IHZhciBjcmVhdGVQb3BwZXIgPSAvKiNfX1BVUkVfXyovcG9wcGVyR2VuZXJhdG9yKCk7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuZXhwb3J0IHsgZGV0ZWN0T3ZlcmZsb3cgfTsiLCJpbXBvcnQgeyBpc1NoYWRvd1Jvb3QgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb250YWlucyhwYXJlbnQsIGNoaWxkKSB7XG4gIHZhciByb290Tm9kZSA9IGNoaWxkLmdldFJvb3ROb2RlICYmIGNoaWxkLmdldFJvb3ROb2RlKCk7IC8vIEZpcnN0LCBhdHRlbXB0IHdpdGggZmFzdGVyIG5hdGl2ZSBtZXRob2RcblxuICBpZiAocGFyZW50LmNvbnRhaW5zKGNoaWxkKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IC8vIHRoZW4gZmFsbGJhY2sgdG8gY3VzdG9tIGltcGxlbWVudGF0aW9uIHdpdGggU2hhZG93IERPTSBzdXBwb3J0XG4gIGVsc2UgaWYgKHJvb3ROb2RlICYmIGlzU2hhZG93Um9vdChyb290Tm9kZSkpIHtcbiAgICAgIHZhciBuZXh0ID0gY2hpbGQ7XG5cbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKG5leHQgJiYgcGFyZW50LmlzU2FtZU5vZGUobmV4dCkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSAvLyAkRmxvd0ZpeE1lW3Byb3AtbWlzc2luZ106IG5lZWQgYSBiZXR0ZXIgd2F5IHRvIGhhbmRsZSB0aGlzLi4uXG5cblxuICAgICAgICBuZXh0ID0gbmV4dC5wYXJlbnROb2RlIHx8IG5leHQuaG9zdDtcbiAgICAgIH0gd2hpbGUgKG5leHQpO1xuICAgIH0gLy8gR2l2ZSB1cCwgdGhlIHJlc3VsdCBpcyBmYWxzZVxuXG5cbiAgcmV0dXJuIGZhbHNlO1xufSIsImltcG9ydCB7IGlzSFRNTEVsZW1lbnQgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5pbXBvcnQgeyByb3VuZCB9IGZyb20gXCIuLi91dGlscy9tYXRoLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZWxlbWVudCwgaW5jbHVkZVNjYWxlKSB7XG4gIGlmIChpbmNsdWRlU2NhbGUgPT09IHZvaWQgMCkge1xuICAgIGluY2x1ZGVTY2FsZSA9IGZhbHNlO1xuICB9XG5cbiAgdmFyIHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICB2YXIgc2NhbGVYID0gMTtcbiAgdmFyIHNjYWxlWSA9IDE7XG5cbiAgaWYgKGlzSFRNTEVsZW1lbnQoZWxlbWVudCkgJiYgaW5jbHVkZVNjYWxlKSB7XG4gICAgdmFyIG9mZnNldEhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgIHZhciBvZmZzZXRXaWR0aCA9IGVsZW1lbnQub2Zmc2V0V2lkdGg7IC8vIERvIG5vdCBhdHRlbXB0IHRvIGRpdmlkZSBieSAwLCBvdGhlcndpc2Ugd2UgZ2V0IGBJbmZpbml0eWAgYXMgc2NhbGVcbiAgICAvLyBGYWxsYmFjayB0byAxIGluIGNhc2UgYm90aCB2YWx1ZXMgYXJlIGAwYFxuXG4gICAgaWYgKG9mZnNldFdpZHRoID4gMCkge1xuICAgICAgc2NhbGVYID0gcm91bmQocmVjdC53aWR0aCkgLyBvZmZzZXRXaWR0aCB8fCAxO1xuICAgIH1cblxuICAgIGlmIChvZmZzZXRIZWlnaHQgPiAwKSB7XG4gICAgICBzY2FsZVkgPSByb3VuZChyZWN0LmhlaWdodCkgLyBvZmZzZXRIZWlnaHQgfHwgMTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHdpZHRoOiByZWN0LndpZHRoIC8gc2NhbGVYLFxuICAgIGhlaWdodDogcmVjdC5oZWlnaHQgLyBzY2FsZVksXG4gICAgdG9wOiByZWN0LnRvcCAvIHNjYWxlWSxcbiAgICByaWdodDogcmVjdC5yaWdodCAvIHNjYWxlWCxcbiAgICBib3R0b206IHJlY3QuYm90dG9tIC8gc2NhbGVZLFxuICAgIGxlZnQ6IHJlY3QubGVmdCAvIHNjYWxlWCxcbiAgICB4OiByZWN0LmxlZnQgLyBzY2FsZVgsXG4gICAgeTogcmVjdC50b3AgLyBzY2FsZVlcbiAgfTtcbn0iLCJpbXBvcnQgeyB2aWV3cG9ydCB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IGdldFZpZXdwb3J0UmVjdCBmcm9tIFwiLi9nZXRWaWV3cG9ydFJlY3QuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudFJlY3QgZnJvbSBcIi4vZ2V0RG9jdW1lbnRSZWN0LmpzXCI7XG5pbXBvcnQgbGlzdFNjcm9sbFBhcmVudHMgZnJvbSBcIi4vbGlzdFNjcm9sbFBhcmVudHMuanNcIjtcbmltcG9ydCBnZXRPZmZzZXRQYXJlbnQgZnJvbSBcIi4vZ2V0T2Zmc2V0UGFyZW50LmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IGdldENvbXB1dGVkU3R5bGUgZnJvbSBcIi4vZ2V0Q29tcHV0ZWRTdHlsZS5qc1wiO1xuaW1wb3J0IHsgaXNFbGVtZW50LCBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuaW1wb3J0IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBmcm9tIFwiLi9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCBnZXRQYXJlbnROb2RlIGZyb20gXCIuL2dldFBhcmVudE5vZGUuanNcIjtcbmltcG9ydCBjb250YWlucyBmcm9tIFwiLi9jb250YWlucy5qc1wiO1xuaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuL2dldE5vZGVOYW1lLmpzXCI7XG5pbXBvcnQgcmVjdFRvQ2xpZW50UmVjdCBmcm9tIFwiLi4vdXRpbHMvcmVjdFRvQ2xpZW50UmVjdC5qc1wiO1xuaW1wb3J0IHsgbWF4LCBtaW4gfSBmcm9tIFwiLi4vdXRpbHMvbWF0aC5qc1wiO1xuXG5mdW5jdGlvbiBnZXRJbm5lckJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50KSB7XG4gIHZhciByZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGVsZW1lbnQpO1xuICByZWN0LnRvcCA9IHJlY3QudG9wICsgZWxlbWVudC5jbGllbnRUb3A7XG4gIHJlY3QubGVmdCA9IHJlY3QubGVmdCArIGVsZW1lbnQuY2xpZW50TGVmdDtcbiAgcmVjdC5ib3R0b20gPSByZWN0LnRvcCArIGVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICByZWN0LnJpZ2h0ID0gcmVjdC5sZWZ0ICsgZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgcmVjdC53aWR0aCA9IGVsZW1lbnQuY2xpZW50V2lkdGg7XG4gIHJlY3QuaGVpZ2h0ID0gZWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gIHJlY3QueCA9IHJlY3QubGVmdDtcbiAgcmVjdC55ID0gcmVjdC50b3A7XG4gIHJldHVybiByZWN0O1xufVxuXG5mdW5jdGlvbiBnZXRDbGllbnRSZWN0RnJvbU1peGVkVHlwZShlbGVtZW50LCBjbGlwcGluZ1BhcmVudCkge1xuICByZXR1cm4gY2xpcHBpbmdQYXJlbnQgPT09IHZpZXdwb3J0ID8gcmVjdFRvQ2xpZW50UmVjdChnZXRWaWV3cG9ydFJlY3QoZWxlbWVudCkpIDogaXNFbGVtZW50KGNsaXBwaW5nUGFyZW50KSA/IGdldElubmVyQm91bmRpbmdDbGllbnRSZWN0KGNsaXBwaW5nUGFyZW50KSA6IHJlY3RUb0NsaWVudFJlY3QoZ2V0RG9jdW1lbnRSZWN0KGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KSkpO1xufSAvLyBBIFwiY2xpcHBpbmcgcGFyZW50XCIgaXMgYW4gb3ZlcmZsb3dhYmxlIGNvbnRhaW5lciB3aXRoIHRoZSBjaGFyYWN0ZXJpc3RpYyBvZlxuLy8gY2xpcHBpbmcgKG9yIGhpZGluZykgb3ZlcmZsb3dpbmcgZWxlbWVudHMgd2l0aCBhIHBvc2l0aW9uIGRpZmZlcmVudCBmcm9tXG4vLyBgaW5pdGlhbGBcblxuXG5mdW5jdGlvbiBnZXRDbGlwcGluZ1BhcmVudHMoZWxlbWVudCkge1xuICB2YXIgY2xpcHBpbmdQYXJlbnRzID0gbGlzdFNjcm9sbFBhcmVudHMoZ2V0UGFyZW50Tm9kZShlbGVtZW50KSk7XG4gIHZhciBjYW5Fc2NhcGVDbGlwcGluZyA9IFsnYWJzb2x1dGUnLCAnZml4ZWQnXS5pbmRleE9mKGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkucG9zaXRpb24pID49IDA7XG4gIHZhciBjbGlwcGVyRWxlbWVudCA9IGNhbkVzY2FwZUNsaXBwaW5nICYmIGlzSFRNTEVsZW1lbnQoZWxlbWVudCkgPyBnZXRPZmZzZXRQYXJlbnQoZWxlbWVudCkgOiBlbGVtZW50O1xuXG4gIGlmICghaXNFbGVtZW50KGNsaXBwZXJFbGVtZW50KSkge1xuICAgIHJldHVybiBbXTtcbiAgfSAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS1yZXR1cm5dOiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svZmxvdy9pc3N1ZXMvMTQxNFxuXG5cbiAgcmV0dXJuIGNsaXBwaW5nUGFyZW50cy5maWx0ZXIoZnVuY3Rpb24gKGNsaXBwaW5nUGFyZW50KSB7XG4gICAgcmV0dXJuIGlzRWxlbWVudChjbGlwcGluZ1BhcmVudCkgJiYgY29udGFpbnMoY2xpcHBpbmdQYXJlbnQsIGNsaXBwZXJFbGVtZW50KSAmJiBnZXROb2RlTmFtZShjbGlwcGluZ1BhcmVudCkgIT09ICdib2R5JztcbiAgfSk7XG59IC8vIEdldHMgdGhlIG1heGltdW0gYXJlYSB0aGF0IHRoZSBlbGVtZW50IGlzIHZpc2libGUgaW4gZHVlIHRvIGFueSBudW1iZXIgb2Zcbi8vIGNsaXBwaW5nIHBhcmVudHNcblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRDbGlwcGluZ1JlY3QoZWxlbWVudCwgYm91bmRhcnksIHJvb3RCb3VuZGFyeSkge1xuICB2YXIgbWFpbkNsaXBwaW5nUGFyZW50cyA9IGJvdW5kYXJ5ID09PSAnY2xpcHBpbmdQYXJlbnRzJyA/IGdldENsaXBwaW5nUGFyZW50cyhlbGVtZW50KSA6IFtdLmNvbmNhdChib3VuZGFyeSk7XG4gIHZhciBjbGlwcGluZ1BhcmVudHMgPSBbXS5jb25jYXQobWFpbkNsaXBwaW5nUGFyZW50cywgW3Jvb3RCb3VuZGFyeV0pO1xuICB2YXIgZmlyc3RDbGlwcGluZ1BhcmVudCA9IGNsaXBwaW5nUGFyZW50c1swXTtcbiAgdmFyIGNsaXBwaW5nUmVjdCA9IGNsaXBwaW5nUGFyZW50cy5yZWR1Y2UoZnVuY3Rpb24gKGFjY1JlY3QsIGNsaXBwaW5nUGFyZW50KSB7XG4gICAgdmFyIHJlY3QgPSBnZXRDbGllbnRSZWN0RnJvbU1peGVkVHlwZShlbGVtZW50LCBjbGlwcGluZ1BhcmVudCk7XG4gICAgYWNjUmVjdC50b3AgPSBtYXgocmVjdC50b3AsIGFjY1JlY3QudG9wKTtcbiAgICBhY2NSZWN0LnJpZ2h0ID0gbWluKHJlY3QucmlnaHQsIGFjY1JlY3QucmlnaHQpO1xuICAgIGFjY1JlY3QuYm90dG9tID0gbWluKHJlY3QuYm90dG9tLCBhY2NSZWN0LmJvdHRvbSk7XG4gICAgYWNjUmVjdC5sZWZ0ID0gbWF4KHJlY3QubGVmdCwgYWNjUmVjdC5sZWZ0KTtcbiAgICByZXR1cm4gYWNjUmVjdDtcbiAgfSwgZ2V0Q2xpZW50UmVjdEZyb21NaXhlZFR5cGUoZWxlbWVudCwgZmlyc3RDbGlwcGluZ1BhcmVudCkpO1xuICBjbGlwcGluZ1JlY3Qud2lkdGggPSBjbGlwcGluZ1JlY3QucmlnaHQgLSBjbGlwcGluZ1JlY3QubGVmdDtcbiAgY2xpcHBpbmdSZWN0LmhlaWdodCA9IGNsaXBwaW5nUmVjdC5ib3R0b20gLSBjbGlwcGluZ1JlY3QudG9wO1xuICBjbGlwcGluZ1JlY3QueCA9IGNsaXBwaW5nUmVjdC5sZWZ0O1xuICBjbGlwcGluZ1JlY3QueSA9IGNsaXBwaW5nUmVjdC50b3A7XG4gIHJldHVybiBjbGlwcGluZ1JlY3Q7XG59IiwiaW1wb3J0IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBmcm9tIFwiLi9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCBnZXROb2RlU2Nyb2xsIGZyb20gXCIuL2dldE5vZGVTY3JvbGwuanNcIjtcbmltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi9nZXROb2RlTmFtZS5qc1wiO1xuaW1wb3J0IHsgaXNIVE1MRWxlbWVudCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmltcG9ydCBnZXRXaW5kb3dTY3JvbGxCYXJYIGZyb20gXCIuL2dldFdpbmRvd1Njcm9sbEJhclguanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4vZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgaXNTY3JvbGxQYXJlbnQgZnJvbSBcIi4vaXNTY3JvbGxQYXJlbnQuanNcIjtcbmltcG9ydCB7IHJvdW5kIH0gZnJvbSBcIi4uL3V0aWxzL21hdGguanNcIjtcblxuZnVuY3Rpb24gaXNFbGVtZW50U2NhbGVkKGVsZW1lbnQpIHtcbiAgdmFyIHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICB2YXIgc2NhbGVYID0gcm91bmQocmVjdC53aWR0aCkgLyBlbGVtZW50Lm9mZnNldFdpZHRoIHx8IDE7XG4gIHZhciBzY2FsZVkgPSByb3VuZChyZWN0LmhlaWdodCkgLyBlbGVtZW50Lm9mZnNldEhlaWdodCB8fCAxO1xuICByZXR1cm4gc2NhbGVYICE9PSAxIHx8IHNjYWxlWSAhPT0gMTtcbn0gLy8gUmV0dXJucyB0aGUgY29tcG9zaXRlIHJlY3Qgb2YgYW4gZWxlbWVudCByZWxhdGl2ZSB0byBpdHMgb2Zmc2V0UGFyZW50LlxuLy8gQ29tcG9zaXRlIG1lYW5zIGl0IHRha2VzIGludG8gYWNjb3VudCB0cmFuc2Zvcm1zIGFzIHdlbGwgYXMgbGF5b3V0LlxuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldENvbXBvc2l0ZVJlY3QoZWxlbWVudE9yVmlydHVhbEVsZW1lbnQsIG9mZnNldFBhcmVudCwgaXNGaXhlZCkge1xuICBpZiAoaXNGaXhlZCA9PT0gdm9pZCAwKSB7XG4gICAgaXNGaXhlZCA9IGZhbHNlO1xuICB9XG5cbiAgdmFyIGlzT2Zmc2V0UGFyZW50QW5FbGVtZW50ID0gaXNIVE1MRWxlbWVudChvZmZzZXRQYXJlbnQpO1xuICB2YXIgb2Zmc2V0UGFyZW50SXNTY2FsZWQgPSBpc0hUTUxFbGVtZW50KG9mZnNldFBhcmVudCkgJiYgaXNFbGVtZW50U2NhbGVkKG9mZnNldFBhcmVudCk7XG4gIHZhciBkb2N1bWVudEVsZW1lbnQgPSBnZXREb2N1bWVudEVsZW1lbnQob2Zmc2V0UGFyZW50KTtcbiAgdmFyIHJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZWxlbWVudE9yVmlydHVhbEVsZW1lbnQsIG9mZnNldFBhcmVudElzU2NhbGVkKTtcbiAgdmFyIHNjcm9sbCA9IHtcbiAgICBzY3JvbGxMZWZ0OiAwLFxuICAgIHNjcm9sbFRvcDogMFxuICB9O1xuICB2YXIgb2Zmc2V0cyA9IHtcbiAgICB4OiAwLFxuICAgIHk6IDBcbiAgfTtcblxuICBpZiAoaXNPZmZzZXRQYXJlbnRBbkVsZW1lbnQgfHwgIWlzT2Zmc2V0UGFyZW50QW5FbGVtZW50ICYmICFpc0ZpeGVkKSB7XG4gICAgaWYgKGdldE5vZGVOYW1lKG9mZnNldFBhcmVudCkgIT09ICdib2R5JyB8fCAvLyBodHRwczovL2dpdGh1Yi5jb20vcG9wcGVyanMvcG9wcGVyLWNvcmUvaXNzdWVzLzEwNzhcbiAgICBpc1Njcm9sbFBhcmVudChkb2N1bWVudEVsZW1lbnQpKSB7XG4gICAgICBzY3JvbGwgPSBnZXROb2RlU2Nyb2xsKG9mZnNldFBhcmVudCk7XG4gICAgfVxuXG4gICAgaWYgKGlzSFRNTEVsZW1lbnQob2Zmc2V0UGFyZW50KSkge1xuICAgICAgb2Zmc2V0cyA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChvZmZzZXRQYXJlbnQsIHRydWUpO1xuICAgICAgb2Zmc2V0cy54ICs9IG9mZnNldFBhcmVudC5jbGllbnRMZWZ0O1xuICAgICAgb2Zmc2V0cy55ICs9IG9mZnNldFBhcmVudC5jbGllbnRUb3A7XG4gICAgfSBlbHNlIGlmIChkb2N1bWVudEVsZW1lbnQpIHtcbiAgICAgIG9mZnNldHMueCA9IGdldFdpbmRvd1Njcm9sbEJhclgoZG9jdW1lbnRFbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHg6IHJlY3QubGVmdCArIHNjcm9sbC5zY3JvbGxMZWZ0IC0gb2Zmc2V0cy54LFxuICAgIHk6IHJlY3QudG9wICsgc2Nyb2xsLnNjcm9sbFRvcCAtIG9mZnNldHMueSxcbiAgICB3aWR0aDogcmVjdC53aWR0aCxcbiAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0XG4gIH07XG59IiwiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkge1xuICByZXR1cm4gZ2V0V2luZG93KGVsZW1lbnQpLmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG59IiwiaW1wb3J0IHsgaXNFbGVtZW50IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpIHtcbiAgLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtcmV0dXJuXTogYXNzdW1lIGJvZHkgaXMgYWx3YXlzIGF2YWlsYWJsZVxuICByZXR1cm4gKChpc0VsZW1lbnQoZWxlbWVudCkgPyBlbGVtZW50Lm93bmVyRG9jdW1lbnQgOiAvLyAkRmxvd0ZpeE1lW3Byb3AtbWlzc2luZ11cbiAgZWxlbWVudC5kb2N1bWVudCkgfHwgd2luZG93LmRvY3VtZW50KS5kb2N1bWVudEVsZW1lbnQ7XG59IiwiaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBnZXRDb21wdXRlZFN0eWxlIGZyb20gXCIuL2dldENvbXB1dGVkU3R5bGUuanNcIjtcbmltcG9ydCBnZXRXaW5kb3dTY3JvbGxCYXJYIGZyb20gXCIuL2dldFdpbmRvd1Njcm9sbEJhclguanNcIjtcbmltcG9ydCBnZXRXaW5kb3dTY3JvbGwgZnJvbSBcIi4vZ2V0V2luZG93U2Nyb2xsLmpzXCI7XG5pbXBvcnQgeyBtYXggfSBmcm9tIFwiLi4vdXRpbHMvbWF0aC5qc1wiOyAvLyBHZXRzIHRoZSBlbnRpcmUgc2l6ZSBvZiB0aGUgc2Nyb2xsYWJsZSBkb2N1bWVudCBhcmVhLCBldmVuIGV4dGVuZGluZyBvdXRzaWRlXG4vLyBvZiB0aGUgYDxodG1sPmAgYW5kIGA8Ym9keT5gIHJlY3QgYm91bmRzIGlmIGhvcml6b250YWxseSBzY3JvbGxhYmxlXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERvY3VtZW50UmVjdChlbGVtZW50KSB7XG4gIHZhciBfZWxlbWVudCRvd25lckRvY3VtZW47XG5cbiAgdmFyIGh0bWwgPSBnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCk7XG4gIHZhciB3aW5TY3JvbGwgPSBnZXRXaW5kb3dTY3JvbGwoZWxlbWVudCk7XG4gIHZhciBib2R5ID0gKF9lbGVtZW50JG93bmVyRG9jdW1lbiA9IGVsZW1lbnQub3duZXJEb2N1bWVudCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9lbGVtZW50JG93bmVyRG9jdW1lbi5ib2R5O1xuICB2YXIgd2lkdGggPSBtYXgoaHRtbC5zY3JvbGxXaWR0aCwgaHRtbC5jbGllbnRXaWR0aCwgYm9keSA/IGJvZHkuc2Nyb2xsV2lkdGggOiAwLCBib2R5ID8gYm9keS5jbGllbnRXaWR0aCA6IDApO1xuICB2YXIgaGVpZ2h0ID0gbWF4KGh0bWwuc2Nyb2xsSGVpZ2h0LCBodG1sLmNsaWVudEhlaWdodCwgYm9keSA/IGJvZHkuc2Nyb2xsSGVpZ2h0IDogMCwgYm9keSA/IGJvZHkuY2xpZW50SGVpZ2h0IDogMCk7XG4gIHZhciB4ID0gLXdpblNjcm9sbC5zY3JvbGxMZWZ0ICsgZ2V0V2luZG93U2Nyb2xsQmFyWChlbGVtZW50KTtcbiAgdmFyIHkgPSAtd2luU2Nyb2xsLnNjcm9sbFRvcDtcblxuICBpZiAoZ2V0Q29tcHV0ZWRTdHlsZShib2R5IHx8IGh0bWwpLmRpcmVjdGlvbiA9PT0gJ3J0bCcpIHtcbiAgICB4ICs9IG1heChodG1sLmNsaWVudFdpZHRoLCBib2R5ID8gYm9keS5jbGllbnRXaWR0aCA6IDApIC0gd2lkdGg7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICB4OiB4LFxuICAgIHk6IHlcbiAgfTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRIVE1MRWxlbWVudFNjcm9sbChlbGVtZW50KSB7XG4gIHJldHVybiB7XG4gICAgc2Nyb2xsTGVmdDogZWxlbWVudC5zY3JvbGxMZWZ0LFxuICAgIHNjcm9sbFRvcDogZWxlbWVudC5zY3JvbGxUb3BcbiAgfTtcbn0iLCJpbXBvcnQgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGZyb20gXCIuL2dldEJvdW5kaW5nQ2xpZW50UmVjdC5qc1wiOyAvLyBSZXR1cm5zIHRoZSBsYXlvdXQgcmVjdCBvZiBhbiBlbGVtZW50IHJlbGF0aXZlIHRvIGl0cyBvZmZzZXRQYXJlbnQuIExheW91dFxuLy8gbWVhbnMgaXQgZG9lc24ndCB0YWtlIGludG8gYWNjb3VudCB0cmFuc2Zvcm1zLlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRMYXlvdXRSZWN0KGVsZW1lbnQpIHtcbiAgdmFyIGNsaWVudFJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZWxlbWVudCk7IC8vIFVzZSB0aGUgY2xpZW50UmVjdCBzaXplcyBpZiBpdCdzIG5vdCBiZWVuIHRyYW5zZm9ybWVkLlxuICAvLyBGaXhlcyBodHRwczovL2dpdGh1Yi5jb20vcG9wcGVyanMvcG9wcGVyLWNvcmUvaXNzdWVzLzEyMjNcblxuICB2YXIgd2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoO1xuICB2YXIgaGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cbiAgaWYgKE1hdGguYWJzKGNsaWVudFJlY3Qud2lkdGggLSB3aWR0aCkgPD0gMSkge1xuICAgIHdpZHRoID0gY2xpZW50UmVjdC53aWR0aDtcbiAgfVxuXG4gIGlmIChNYXRoLmFicyhjbGllbnRSZWN0LmhlaWdodCAtIGhlaWdodCkgPD0gMSkge1xuICAgIGhlaWdodCA9IGNsaWVudFJlY3QuaGVpZ2h0O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB4OiBlbGVtZW50Lm9mZnNldExlZnQsXG4gICAgeTogZWxlbWVudC5vZmZzZXRUb3AsXG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0XG4gIH07XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0Tm9kZU5hbWUoZWxlbWVudCkge1xuICByZXR1cm4gZWxlbWVudCA/IChlbGVtZW50Lm5vZGVOYW1lIHx8ICcnKS50b0xvd2VyQ2FzZSgpIDogbnVsbDtcbn0iLCJpbXBvcnQgZ2V0V2luZG93U2Nyb2xsIGZyb20gXCIuL2dldFdpbmRvd1Njcm9sbC5qc1wiO1xuaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmltcG9ydCB7IGlzSFRNTEVsZW1lbnQgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5pbXBvcnQgZ2V0SFRNTEVsZW1lbnRTY3JvbGwgZnJvbSBcIi4vZ2V0SFRNTEVsZW1lbnRTY3JvbGwuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldE5vZGVTY3JvbGwobm9kZSkge1xuICBpZiAobm9kZSA9PT0gZ2V0V2luZG93KG5vZGUpIHx8ICFpc0hUTUxFbGVtZW50KG5vZGUpKSB7XG4gICAgcmV0dXJuIGdldFdpbmRvd1Njcm9sbChub2RlKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZ2V0SFRNTEVsZW1lbnRTY3JvbGwobm9kZSk7XG4gIH1cbn0iLCJpbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuL2dldFdpbmRvdy5qc1wiO1xuaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuL2dldE5vZGVOYW1lLmpzXCI7XG5pbXBvcnQgZ2V0Q29tcHV0ZWRTdHlsZSBmcm9tIFwiLi9nZXRDb21wdXRlZFN0eWxlLmpzXCI7XG5pbXBvcnQgeyBpc0hUTUxFbGVtZW50LCBpc1NoYWRvd1Jvb3QgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5pbXBvcnQgaXNUYWJsZUVsZW1lbnQgZnJvbSBcIi4vaXNUYWJsZUVsZW1lbnQuanNcIjtcbmltcG9ydCBnZXRQYXJlbnROb2RlIGZyb20gXCIuL2dldFBhcmVudE5vZGUuanNcIjtcblxuZnVuY3Rpb24gZ2V0VHJ1ZU9mZnNldFBhcmVudChlbGVtZW50KSB7XG4gIGlmICghaXNIVE1MRWxlbWVudChlbGVtZW50KSB8fCAvLyBodHRwczovL2dpdGh1Yi5jb20vcG9wcGVyanMvcG9wcGVyLWNvcmUvaXNzdWVzLzgzN1xuICBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLnBvc2l0aW9uID09PSAnZml4ZWQnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gZWxlbWVudC5vZmZzZXRQYXJlbnQ7XG59IC8vIGAub2Zmc2V0UGFyZW50YCByZXBvcnRzIGBudWxsYCBmb3IgZml4ZWQgZWxlbWVudHMsIHdoaWxlIGFic29sdXRlIGVsZW1lbnRzXG4vLyByZXR1cm4gdGhlIGNvbnRhaW5pbmcgYmxvY2tcblxuXG5mdW5jdGlvbiBnZXRDb250YWluaW5nQmxvY2soZWxlbWVudCkge1xuICB2YXIgaXNGaXJlZm94ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2ZpcmVmb3gnKSAhPT0gLTE7XG4gIHZhciBpc0lFID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdUcmlkZW50JykgIT09IC0xO1xuXG4gIGlmIChpc0lFICYmIGlzSFRNTEVsZW1lbnQoZWxlbWVudCkpIHtcbiAgICAvLyBJbiBJRSA5LCAxMCBhbmQgMTEgZml4ZWQgZWxlbWVudHMgY29udGFpbmluZyBibG9jayBpcyBhbHdheXMgZXN0YWJsaXNoZWQgYnkgdGhlIHZpZXdwb3J0XG4gICAgdmFyIGVsZW1lbnRDc3MgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuXG4gICAgaWYgKGVsZW1lbnRDc3MucG9zaXRpb24gPT09ICdmaXhlZCcpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHZhciBjdXJyZW50Tm9kZSA9IGdldFBhcmVudE5vZGUoZWxlbWVudCk7XG5cbiAgaWYgKGlzU2hhZG93Um9vdChjdXJyZW50Tm9kZSkpIHtcbiAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLmhvc3Q7XG4gIH1cblxuICB3aGlsZSAoaXNIVE1MRWxlbWVudChjdXJyZW50Tm9kZSkgJiYgWydodG1sJywgJ2JvZHknXS5pbmRleE9mKGdldE5vZGVOYW1lKGN1cnJlbnROb2RlKSkgPCAwKSB7XG4gICAgdmFyIGNzcyA9IGdldENvbXB1dGVkU3R5bGUoY3VycmVudE5vZGUpOyAvLyBUaGlzIGlzIG5vbi1leGhhdXN0aXZlIGJ1dCBjb3ZlcnMgdGhlIG1vc3QgY29tbW9uIENTUyBwcm9wZXJ0aWVzIHRoYXRcbiAgICAvLyBjcmVhdGUgYSBjb250YWluaW5nIGJsb2NrLlxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0NTUy9Db250YWluaW5nX2Jsb2NrI2lkZW50aWZ5aW5nX3RoZV9jb250YWluaW5nX2Jsb2NrXG5cbiAgICBpZiAoY3NzLnRyYW5zZm9ybSAhPT0gJ25vbmUnIHx8IGNzcy5wZXJzcGVjdGl2ZSAhPT0gJ25vbmUnIHx8IGNzcy5jb250YWluID09PSAncGFpbnQnIHx8IFsndHJhbnNmb3JtJywgJ3BlcnNwZWN0aXZlJ10uaW5kZXhPZihjc3Mud2lsbENoYW5nZSkgIT09IC0xIHx8IGlzRmlyZWZveCAmJiBjc3Mud2lsbENoYW5nZSA9PT0gJ2ZpbHRlcicgfHwgaXNGaXJlZm94ICYmIGNzcy5maWx0ZXIgJiYgY3NzLmZpbHRlciAhPT0gJ25vbmUnKSB7XG4gICAgICByZXR1cm4gY3VycmVudE5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnROb2RlID0gY3VycmVudE5vZGUucGFyZW50Tm9kZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn0gLy8gR2V0cyB0aGUgY2xvc2VzdCBhbmNlc3RvciBwb3NpdGlvbmVkIGVsZW1lbnQuIEhhbmRsZXMgc29tZSBlZGdlIGNhc2VzLFxuLy8gc3VjaCBhcyB0YWJsZSBhbmNlc3RvcnMgYW5kIGNyb3NzIGJyb3dzZXIgYnVncy5cblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRPZmZzZXRQYXJlbnQoZWxlbWVudCkge1xuICB2YXIgd2luZG93ID0gZ2V0V2luZG93KGVsZW1lbnQpO1xuICB2YXIgb2Zmc2V0UGFyZW50ID0gZ2V0VHJ1ZU9mZnNldFBhcmVudChlbGVtZW50KTtcblxuICB3aGlsZSAob2Zmc2V0UGFyZW50ICYmIGlzVGFibGVFbGVtZW50KG9mZnNldFBhcmVudCkgJiYgZ2V0Q29tcHV0ZWRTdHlsZShvZmZzZXRQYXJlbnQpLnBvc2l0aW9uID09PSAnc3RhdGljJykge1xuICAgIG9mZnNldFBhcmVudCA9IGdldFRydWVPZmZzZXRQYXJlbnQob2Zmc2V0UGFyZW50KTtcbiAgfVxuXG4gIGlmIChvZmZzZXRQYXJlbnQgJiYgKGdldE5vZGVOYW1lKG9mZnNldFBhcmVudCkgPT09ICdodG1sJyB8fCBnZXROb2RlTmFtZShvZmZzZXRQYXJlbnQpID09PSAnYm9keScgJiYgZ2V0Q29tcHV0ZWRTdHlsZShvZmZzZXRQYXJlbnQpLnBvc2l0aW9uID09PSAnc3RhdGljJykpIHtcbiAgICByZXR1cm4gd2luZG93O1xuICB9XG5cbiAgcmV0dXJuIG9mZnNldFBhcmVudCB8fCBnZXRDb250YWluaW5nQmxvY2soZWxlbWVudCkgfHwgd2luZG93O1xufSIsImltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi9nZXROb2RlTmFtZS5qc1wiO1xuaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCB7IGlzU2hhZG93Um9vdCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFBhcmVudE5vZGUoZWxlbWVudCkge1xuICBpZiAoZ2V0Tm9kZU5hbWUoZWxlbWVudCkgPT09ICdodG1sJykge1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgcmV0dXJuICgvLyB0aGlzIGlzIGEgcXVpY2tlciAoYnV0IGxlc3MgdHlwZSBzYWZlKSB3YXkgdG8gc2F2ZSBxdWl0ZSBzb21lIGJ5dGVzIGZyb20gdGhlIGJ1bmRsZVxuICAgIC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLXJldHVybl1cbiAgICAvLyAkRmxvd0ZpeE1lW3Byb3AtbWlzc2luZ11cbiAgICBlbGVtZW50LmFzc2lnbmVkU2xvdCB8fCAvLyBzdGVwIGludG8gdGhlIHNoYWRvdyBET00gb2YgdGhlIHBhcmVudCBvZiBhIHNsb3R0ZWQgbm9kZVxuICAgIGVsZW1lbnQucGFyZW50Tm9kZSB8fCAoIC8vIERPTSBFbGVtZW50IGRldGVjdGVkXG4gICAgaXNTaGFkb3dSb290KGVsZW1lbnQpID8gZWxlbWVudC5ob3N0IDogbnVsbCkgfHwgLy8gU2hhZG93Um9vdCBkZXRlY3RlZFxuICAgIC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLWNhbGxdOiBIVE1MRWxlbWVudCBpcyBhIE5vZGVcbiAgICBnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCkgLy8gZmFsbGJhY2tcblxuICApO1xufSIsImltcG9ydCBnZXRQYXJlbnROb2RlIGZyb20gXCIuL2dldFBhcmVudE5vZGUuanNcIjtcbmltcG9ydCBpc1Njcm9sbFBhcmVudCBmcm9tIFwiLi9pc1Njcm9sbFBhcmVudC5qc1wiO1xuaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuL2dldE5vZGVOYW1lLmpzXCI7XG5pbXBvcnQgeyBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0U2Nyb2xsUGFyZW50KG5vZGUpIHtcbiAgaWYgKFsnaHRtbCcsICdib2R5JywgJyNkb2N1bWVudCddLmluZGV4T2YoZ2V0Tm9kZU5hbWUobm9kZSkpID49IDApIHtcbiAgICAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS1yZXR1cm5dOiBhc3N1bWUgYm9keSBpcyBhbHdheXMgYXZhaWxhYmxlXG4gICAgcmV0dXJuIG5vZGUub3duZXJEb2N1bWVudC5ib2R5O1xuICB9XG5cbiAgaWYgKGlzSFRNTEVsZW1lbnQobm9kZSkgJiYgaXNTY3JvbGxQYXJlbnQobm9kZSkpIHtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHJldHVybiBnZXRTY3JvbGxQYXJlbnQoZ2V0UGFyZW50Tm9kZShub2RlKSk7XG59IiwiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4vZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93U2Nyb2xsQmFyWCBmcm9tIFwiLi9nZXRXaW5kb3dTY3JvbGxCYXJYLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRWaWV3cG9ydFJlY3QoZWxlbWVudCkge1xuICB2YXIgd2luID0gZ2V0V2luZG93KGVsZW1lbnQpO1xuICB2YXIgaHRtbCA9IGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KTtcbiAgdmFyIHZpc3VhbFZpZXdwb3J0ID0gd2luLnZpc3VhbFZpZXdwb3J0O1xuICB2YXIgd2lkdGggPSBodG1sLmNsaWVudFdpZHRoO1xuICB2YXIgaGVpZ2h0ID0gaHRtbC5jbGllbnRIZWlnaHQ7XG4gIHZhciB4ID0gMDtcbiAgdmFyIHkgPSAwOyAvLyBOQjogVGhpcyBpc24ndCBzdXBwb3J0ZWQgb24gaU9TIDw9IDEyLiBJZiB0aGUga2V5Ym9hcmQgaXMgb3BlbiwgdGhlIHBvcHBlclxuICAvLyBjYW4gYmUgb2JzY3VyZWQgdW5kZXJuZWF0aCBpdC5cbiAgLy8gQWxzbywgYGh0bWwuY2xpZW50SGVpZ2h0YCBhZGRzIHRoZSBib3R0b20gYmFyIGhlaWdodCBpbiBTYWZhcmkgaU9TLCBldmVuXG4gIC8vIGlmIGl0IGlzbid0IG9wZW4sIHNvIGlmIHRoaXMgaXNuJ3QgYXZhaWxhYmxlLCB0aGUgcG9wcGVyIHdpbGwgYmUgZGV0ZWN0ZWRcbiAgLy8gdG8gb3ZlcmZsb3cgdGhlIGJvdHRvbSBvZiB0aGUgc2NyZWVuIHRvbyBlYXJseS5cblxuICBpZiAodmlzdWFsVmlld3BvcnQpIHtcbiAgICB3aWR0aCA9IHZpc3VhbFZpZXdwb3J0LndpZHRoO1xuICAgIGhlaWdodCA9IHZpc3VhbFZpZXdwb3J0LmhlaWdodDsgLy8gVXNlcyBMYXlvdXQgVmlld3BvcnQgKGxpa2UgQ2hyb21lOyBTYWZhcmkgZG9lcyBub3QgY3VycmVudGx5KVxuICAgIC8vIEluIENocm9tZSwgaXQgcmV0dXJucyBhIHZhbHVlIHZlcnkgY2xvc2UgdG8gMCAoKy8tKSBidXQgY29udGFpbnMgcm91bmRpbmdcbiAgICAvLyBlcnJvcnMgZHVlIHRvIGZsb2F0aW5nIHBvaW50IG51bWJlcnMsIHNvIHdlIG5lZWQgdG8gY2hlY2sgcHJlY2lzaW9uLlxuICAgIC8vIFNhZmFyaSByZXR1cm5zIGEgbnVtYmVyIDw9IDAsIHVzdWFsbHkgPCAtMSB3aGVuIHBpbmNoLXpvb21lZFxuICAgIC8vIEZlYXR1cmUgZGV0ZWN0aW9uIGZhaWxzIGluIG1vYmlsZSBlbXVsYXRpb24gbW9kZSBpbiBDaHJvbWUuXG4gICAgLy8gTWF0aC5hYnMod2luLmlubmVyV2lkdGggLyB2aXN1YWxWaWV3cG9ydC5zY2FsZSAtIHZpc3VhbFZpZXdwb3J0LndpZHRoKSA8XG4gICAgLy8gMC4wMDFcbiAgICAvLyBGYWxsYmFjayBoZXJlOiBcIk5vdCBTYWZhcmlcIiB1c2VyQWdlbnRcblxuICAgIGlmICghL14oKD8hY2hyb21lfGFuZHJvaWQpLikqc2FmYXJpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSkge1xuICAgICAgeCA9IHZpc3VhbFZpZXdwb3J0Lm9mZnNldExlZnQ7XG4gICAgICB5ID0gdmlzdWFsVmlld3BvcnQub2Zmc2V0VG9wO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIHg6IHggKyBnZXRXaW5kb3dTY3JvbGxCYXJYKGVsZW1lbnQpLFxuICAgIHk6IHlcbiAgfTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRXaW5kb3cobm9kZSkge1xuICBpZiAobm9kZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHdpbmRvdztcbiAgfVxuXG4gIGlmIChub2RlLnRvU3RyaW5nKCkgIT09ICdbb2JqZWN0IFdpbmRvd10nKSB7XG4gICAgdmFyIG93bmVyRG9jdW1lbnQgPSBub2RlLm93bmVyRG9jdW1lbnQ7XG4gICAgcmV0dXJuIG93bmVyRG9jdW1lbnQgPyBvd25lckRvY3VtZW50LmRlZmF1bHRWaWV3IHx8IHdpbmRvdyA6IHdpbmRvdztcbiAgfVxuXG4gIHJldHVybiBub2RlO1xufSIsImltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRXaW5kb3dTY3JvbGwobm9kZSkge1xuICB2YXIgd2luID0gZ2V0V2luZG93KG5vZGUpO1xuICB2YXIgc2Nyb2xsTGVmdCA9IHdpbi5wYWdlWE9mZnNldDtcbiAgdmFyIHNjcm9sbFRvcCA9IHdpbi5wYWdlWU9mZnNldDtcbiAgcmV0dXJuIHtcbiAgICBzY3JvbGxMZWZ0OiBzY3JvbGxMZWZ0LFxuICAgIHNjcm9sbFRvcDogc2Nyb2xsVG9wXG4gIH07XG59IiwiaW1wb3J0IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBmcm9tIFwiLi9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4vZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93U2Nyb2xsIGZyb20gXCIuL2dldFdpbmRvd1Njcm9sbC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0V2luZG93U2Nyb2xsQmFyWChlbGVtZW50KSB7XG4gIC8vIElmIDxodG1sPiBoYXMgYSBDU1Mgd2lkdGggZ3JlYXRlciB0aGFuIHRoZSB2aWV3cG9ydCwgdGhlbiB0aGlzIHdpbGwgYmVcbiAgLy8gaW5jb3JyZWN0IGZvciBSVEwuXG4gIC8vIFBvcHBlciAxIGlzIGJyb2tlbiBpbiB0aGlzIGNhc2UgYW5kIG5ldmVyIGhhZCBhIGJ1ZyByZXBvcnQgc28gbGV0J3MgYXNzdW1lXG4gIC8vIGl0J3Mgbm90IGFuIGlzc3VlLiBJIGRvbid0IHRoaW5rIGFueW9uZSBldmVyIHNwZWNpZmllcyB3aWR0aCBvbiA8aHRtbD5cbiAgLy8gYW55d2F5LlxuICAvLyBCcm93c2VycyB3aGVyZSB0aGUgbGVmdCBzY3JvbGxiYXIgZG9lc24ndCBjYXVzZSBhbiBpc3N1ZSByZXBvcnQgYDBgIGZvclxuICAvLyB0aGlzIChlLmcuIEVkZ2UgMjAxOSwgSUUxMSwgU2FmYXJpKVxuICByZXR1cm4gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KSkubGVmdCArIGdldFdpbmRvd1Njcm9sbChlbGVtZW50KS5zY3JvbGxMZWZ0O1xufSIsImltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5cbmZ1bmN0aW9uIGlzRWxlbWVudChub2RlKSB7XG4gIHZhciBPd25FbGVtZW50ID0gZ2V0V2luZG93KG5vZGUpLkVsZW1lbnQ7XG4gIHJldHVybiBub2RlIGluc3RhbmNlb2YgT3duRWxlbWVudCB8fCBub2RlIGluc3RhbmNlb2YgRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gaXNIVE1MRWxlbWVudChub2RlKSB7XG4gIHZhciBPd25FbGVtZW50ID0gZ2V0V2luZG93KG5vZGUpLkhUTUxFbGVtZW50O1xuICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIE93bkVsZW1lbnQgfHwgbm9kZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBpc1NoYWRvd1Jvb3Qobm9kZSkge1xuICAvLyBJRSAxMSBoYXMgbm8gU2hhZG93Um9vdFxuICBpZiAodHlwZW9mIFNoYWRvd1Jvb3QgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIE93bkVsZW1lbnQgPSBnZXRXaW5kb3cobm9kZSkuU2hhZG93Um9vdDtcbiAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBPd25FbGVtZW50IHx8IG5vZGUgaW5zdGFuY2VvZiBTaGFkb3dSb290O1xufVxuXG5leHBvcnQgeyBpc0VsZW1lbnQsIGlzSFRNTEVsZW1lbnQsIGlzU2hhZG93Um9vdCB9OyIsImltcG9ydCBnZXRDb21wdXRlZFN0eWxlIGZyb20gXCIuL2dldENvbXB1dGVkU3R5bGUuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzU2Nyb2xsUGFyZW50KGVsZW1lbnQpIHtcbiAgLy8gRmlyZWZveCB3YW50cyB1cyB0byBjaGVjayBgLXhgIGFuZCBgLXlgIHZhcmlhdGlvbnMgYXMgd2VsbFxuICB2YXIgX2dldENvbXB1dGVkU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLFxuICAgICAgb3ZlcmZsb3cgPSBfZ2V0Q29tcHV0ZWRTdHlsZS5vdmVyZmxvdyxcbiAgICAgIG92ZXJmbG93WCA9IF9nZXRDb21wdXRlZFN0eWxlLm92ZXJmbG93WCxcbiAgICAgIG92ZXJmbG93WSA9IF9nZXRDb21wdXRlZFN0eWxlLm92ZXJmbG93WTtcblxuICByZXR1cm4gL2F1dG98c2Nyb2xsfG92ZXJsYXl8aGlkZGVuLy50ZXN0KG92ZXJmbG93ICsgb3ZlcmZsb3dZICsgb3ZlcmZsb3dYKTtcbn0iLCJpbXBvcnQgZ2V0Tm9kZU5hbWUgZnJvbSBcIi4vZ2V0Tm9kZU5hbWUuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzVGFibGVFbGVtZW50KGVsZW1lbnQpIHtcbiAgcmV0dXJuIFsndGFibGUnLCAndGQnLCAndGgnXS5pbmRleE9mKGdldE5vZGVOYW1lKGVsZW1lbnQpKSA+PSAwO1xufSIsImltcG9ydCBnZXRTY3JvbGxQYXJlbnQgZnJvbSBcIi4vZ2V0U2Nyb2xsUGFyZW50LmpzXCI7XG5pbXBvcnQgZ2V0UGFyZW50Tm9kZSBmcm9tIFwiLi9nZXRQYXJlbnROb2RlLmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuL2dldFdpbmRvdy5qc1wiO1xuaW1wb3J0IGlzU2Nyb2xsUGFyZW50IGZyb20gXCIuL2lzU2Nyb2xsUGFyZW50LmpzXCI7XG4vKlxuZ2l2ZW4gYSBET00gZWxlbWVudCwgcmV0dXJuIHRoZSBsaXN0IG9mIGFsbCBzY3JvbGwgcGFyZW50cywgdXAgdGhlIGxpc3Qgb2YgYW5jZXNvcnNcbnVudGlsIHdlIGdldCB0byB0aGUgdG9wIHdpbmRvdyBvYmplY3QuIFRoaXMgbGlzdCBpcyB3aGF0IHdlIGF0dGFjaCBzY3JvbGwgbGlzdGVuZXJzXG50bywgYmVjYXVzZSBpZiBhbnkgb2YgdGhlc2UgcGFyZW50IGVsZW1lbnRzIHNjcm9sbCwgd2UnbGwgbmVlZCB0byByZS1jYWxjdWxhdGUgdGhlXG5yZWZlcmVuY2UgZWxlbWVudCdzIHBvc2l0aW9uLlxuKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbGlzdFNjcm9sbFBhcmVudHMoZWxlbWVudCwgbGlzdCkge1xuICB2YXIgX2VsZW1lbnQkb3duZXJEb2N1bWVuO1xuXG4gIGlmIChsaXN0ID09PSB2b2lkIDApIHtcbiAgICBsaXN0ID0gW107XG4gIH1cblxuICB2YXIgc2Nyb2xsUGFyZW50ID0gZ2V0U2Nyb2xsUGFyZW50KGVsZW1lbnQpO1xuICB2YXIgaXNCb2R5ID0gc2Nyb2xsUGFyZW50ID09PSAoKF9lbGVtZW50JG93bmVyRG9jdW1lbiA9IGVsZW1lbnQub3duZXJEb2N1bWVudCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9lbGVtZW50JG93bmVyRG9jdW1lbi5ib2R5KTtcbiAgdmFyIHdpbiA9IGdldFdpbmRvdyhzY3JvbGxQYXJlbnQpO1xuICB2YXIgdGFyZ2V0ID0gaXNCb2R5ID8gW3dpbl0uY29uY2F0KHdpbi52aXN1YWxWaWV3cG9ydCB8fCBbXSwgaXNTY3JvbGxQYXJlbnQoc2Nyb2xsUGFyZW50KSA/IHNjcm9sbFBhcmVudCA6IFtdKSA6IHNjcm9sbFBhcmVudDtcbiAgdmFyIHVwZGF0ZWRMaXN0ID0gbGlzdC5jb25jYXQodGFyZ2V0KTtcbiAgcmV0dXJuIGlzQm9keSA/IHVwZGF0ZWRMaXN0IDogLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtY2FsbF06IGlzQm9keSB0ZWxscyB1cyB0YXJnZXQgd2lsbCBiZSBhbiBIVE1MRWxlbWVudCBoZXJlXG4gIHVwZGF0ZWRMaXN0LmNvbmNhdChsaXN0U2Nyb2xsUGFyZW50cyhnZXRQYXJlbnROb2RlKHRhcmdldCkpKTtcbn0iLCJleHBvcnQgdmFyIHRvcCA9ICd0b3AnO1xuZXhwb3J0IHZhciBib3R0b20gPSAnYm90dG9tJztcbmV4cG9ydCB2YXIgcmlnaHQgPSAncmlnaHQnO1xuZXhwb3J0IHZhciBsZWZ0ID0gJ2xlZnQnO1xuZXhwb3J0IHZhciBhdXRvID0gJ2F1dG8nO1xuZXhwb3J0IHZhciBiYXNlUGxhY2VtZW50cyA9IFt0b3AsIGJvdHRvbSwgcmlnaHQsIGxlZnRdO1xuZXhwb3J0IHZhciBzdGFydCA9ICdzdGFydCc7XG5leHBvcnQgdmFyIGVuZCA9ICdlbmQnO1xuZXhwb3J0IHZhciBjbGlwcGluZ1BhcmVudHMgPSAnY2xpcHBpbmdQYXJlbnRzJztcbmV4cG9ydCB2YXIgdmlld3BvcnQgPSAndmlld3BvcnQnO1xuZXhwb3J0IHZhciBwb3BwZXIgPSAncG9wcGVyJztcbmV4cG9ydCB2YXIgcmVmZXJlbmNlID0gJ3JlZmVyZW5jZSc7XG5leHBvcnQgdmFyIHZhcmlhdGlvblBsYWNlbWVudHMgPSAvKiNfX1BVUkVfXyovYmFzZVBsYWNlbWVudHMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHBsYWNlbWVudCkge1xuICByZXR1cm4gYWNjLmNvbmNhdChbcGxhY2VtZW50ICsgXCItXCIgKyBzdGFydCwgcGxhY2VtZW50ICsgXCItXCIgKyBlbmRdKTtcbn0sIFtdKTtcbmV4cG9ydCB2YXIgcGxhY2VtZW50cyA9IC8qI19fUFVSRV9fKi9bXS5jb25jYXQoYmFzZVBsYWNlbWVudHMsIFthdXRvXSkucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHBsYWNlbWVudCkge1xuICByZXR1cm4gYWNjLmNvbmNhdChbcGxhY2VtZW50LCBwbGFjZW1lbnQgKyBcIi1cIiArIHN0YXJ0LCBwbGFjZW1lbnQgKyBcIi1cIiArIGVuZF0pO1xufSwgW10pOyAvLyBtb2RpZmllcnMgdGhhdCBuZWVkIHRvIHJlYWQgdGhlIERPTVxuXG5leHBvcnQgdmFyIGJlZm9yZVJlYWQgPSAnYmVmb3JlUmVhZCc7XG5leHBvcnQgdmFyIHJlYWQgPSAncmVhZCc7XG5leHBvcnQgdmFyIGFmdGVyUmVhZCA9ICdhZnRlclJlYWQnOyAvLyBwdXJlLWxvZ2ljIG1vZGlmaWVyc1xuXG5leHBvcnQgdmFyIGJlZm9yZU1haW4gPSAnYmVmb3JlTWFpbic7XG5leHBvcnQgdmFyIG1haW4gPSAnbWFpbic7XG5leHBvcnQgdmFyIGFmdGVyTWFpbiA9ICdhZnRlck1haW4nOyAvLyBtb2RpZmllciB3aXRoIHRoZSBwdXJwb3NlIHRvIHdyaXRlIHRvIHRoZSBET00gKG9yIHdyaXRlIGludG8gYSBmcmFtZXdvcmsgc3RhdGUpXG5cbmV4cG9ydCB2YXIgYmVmb3JlV3JpdGUgPSAnYmVmb3JlV3JpdGUnO1xuZXhwb3J0IHZhciB3cml0ZSA9ICd3cml0ZSc7XG5leHBvcnQgdmFyIGFmdGVyV3JpdGUgPSAnYWZ0ZXJXcml0ZSc7XG5leHBvcnQgdmFyIG1vZGlmaWVyUGhhc2VzID0gW2JlZm9yZVJlYWQsIHJlYWQsIGFmdGVyUmVhZCwgYmVmb3JlTWFpbiwgbWFpbiwgYWZ0ZXJNYWluLCBiZWZvcmVXcml0ZSwgd3JpdGUsIGFmdGVyV3JpdGVdOyIsImV4cG9ydCAqIGZyb20gXCIuL2VudW1zLmpzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9tb2RpZmllcnMvaW5kZXguanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgeyBwb3BwZXJHZW5lcmF0b3IsIGRldGVjdE92ZXJmbG93LCBjcmVhdGVQb3BwZXIgYXMgY3JlYXRlUG9wcGVyQmFzZSB9IGZyb20gXCIuL2NyZWF0ZVBvcHBlci5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbmV4cG9ydCB7IGNyZWF0ZVBvcHBlciB9IGZyb20gXCIuL3BvcHBlci5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbmV4cG9ydCB7IGNyZWF0ZVBvcHBlciBhcyBjcmVhdGVQb3BwZXJMaXRlIH0gZnJvbSBcIi4vcG9wcGVyLWxpdGUuanNcIjsiLCJpbXBvcnQgZ2V0Tm9kZU5hbWUgZnJvbSBcIi4uL2RvbS11dGlscy9nZXROb2RlTmFtZS5qc1wiO1xuaW1wb3J0IHsgaXNIVE1MRWxlbWVudCB9IGZyb20gXCIuLi9kb20tdXRpbHMvaW5zdGFuY2VPZi5qc1wiOyAvLyBUaGlzIG1vZGlmaWVyIHRha2VzIHRoZSBzdHlsZXMgcHJlcGFyZWQgYnkgdGhlIGBjb21wdXRlU3R5bGVzYCBtb2RpZmllclxuLy8gYW5kIGFwcGxpZXMgdGhlbSB0byB0aGUgSFRNTEVsZW1lbnRzIHN1Y2ggYXMgcG9wcGVyIGFuZCBhcnJvd1xuXG5mdW5jdGlvbiBhcHBseVN0eWxlcyhfcmVmKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGU7XG4gIE9iamVjdC5rZXlzKHN0YXRlLmVsZW1lbnRzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIHN0eWxlID0gc3RhdGUuc3R5bGVzW25hbWVdIHx8IHt9O1xuICAgIHZhciBhdHRyaWJ1dGVzID0gc3RhdGUuYXR0cmlidXRlc1tuYW1lXSB8fCB7fTtcbiAgICB2YXIgZWxlbWVudCA9IHN0YXRlLmVsZW1lbnRzW25hbWVdOyAvLyBhcnJvdyBpcyBvcHRpb25hbCArIHZpcnR1YWwgZWxlbWVudHNcblxuICAgIGlmICghaXNIVE1MRWxlbWVudChlbGVtZW50KSB8fCAhZ2V0Tm9kZU5hbWUoZWxlbWVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9IC8vIEZsb3cgZG9lc24ndCBzdXBwb3J0IHRvIGV4dGVuZCB0aGlzIHByb3BlcnR5LCBidXQgaXQncyB0aGUgbW9zdFxuICAgIC8vIGVmZmVjdGl2ZSB3YXkgdG8gYXBwbHkgc3R5bGVzIHRvIGFuIEhUTUxFbGVtZW50XG4gICAgLy8gJEZsb3dGaXhNZVtjYW5ub3Qtd3JpdGVdXG5cblxuICAgIE9iamVjdC5hc3NpZ24oZWxlbWVudC5zdHlsZSwgc3R5bGUpO1xuICAgIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGF0dHJpYnV0ZXNbbmFtZV07XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSA9PT0gdHJ1ZSA/ICcnIDogdmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZWZmZWN0KF9yZWYyKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYyLnN0YXRlO1xuICB2YXIgaW5pdGlhbFN0eWxlcyA9IHtcbiAgICBwb3BwZXI6IHtcbiAgICAgIHBvc2l0aW9uOiBzdGF0ZS5vcHRpb25zLnN0cmF0ZWd5LFxuICAgICAgbGVmdDogJzAnLFxuICAgICAgdG9wOiAnMCcsXG4gICAgICBtYXJnaW46ICcwJ1xuICAgIH0sXG4gICAgYXJyb3c6IHtcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgfSxcbiAgICByZWZlcmVuY2U6IHt9XG4gIH07XG4gIE9iamVjdC5hc3NpZ24oc3RhdGUuZWxlbWVudHMucG9wcGVyLnN0eWxlLCBpbml0aWFsU3R5bGVzLnBvcHBlcik7XG4gIHN0YXRlLnN0eWxlcyA9IGluaXRpYWxTdHlsZXM7XG5cbiAgaWYgKHN0YXRlLmVsZW1lbnRzLmFycm93KSB7XG4gICAgT2JqZWN0LmFzc2lnbihzdGF0ZS5lbGVtZW50cy5hcnJvdy5zdHlsZSwgaW5pdGlhbFN0eWxlcy5hcnJvdyk7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIE9iamVjdC5rZXlzKHN0YXRlLmVsZW1lbnRzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB2YXIgZWxlbWVudCA9IHN0YXRlLmVsZW1lbnRzW25hbWVdO1xuICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBzdGF0ZS5hdHRyaWJ1dGVzW25hbWVdIHx8IHt9O1xuICAgICAgdmFyIHN0eWxlUHJvcGVydGllcyA9IE9iamVjdC5rZXlzKHN0YXRlLnN0eWxlcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSA/IHN0YXRlLnN0eWxlc1tuYW1lXSA6IGluaXRpYWxTdHlsZXNbbmFtZV0pOyAvLyBTZXQgYWxsIHZhbHVlcyB0byBhbiBlbXB0eSBzdHJpbmcgdG8gdW5zZXQgdGhlbVxuXG4gICAgICB2YXIgc3R5bGUgPSBzdHlsZVByb3BlcnRpZXMucmVkdWNlKGZ1bmN0aW9uIChzdHlsZSwgcHJvcGVydHkpIHtcbiAgICAgICAgc3R5bGVbcHJvcGVydHldID0gJyc7XG4gICAgICAgIHJldHVybiBzdHlsZTtcbiAgICAgIH0sIHt9KTsgLy8gYXJyb3cgaXMgb3B0aW9uYWwgKyB2aXJ0dWFsIGVsZW1lbnRzXG5cbiAgICAgIGlmICghaXNIVE1MRWxlbWVudChlbGVtZW50KSB8fCAhZ2V0Tm9kZU5hbWUoZWxlbWVudCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBPYmplY3QuYXNzaWduKGVsZW1lbnQuc3R5bGUsIHN0eWxlKTtcbiAgICAgIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdhcHBseVN0eWxlcycsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAnd3JpdGUnLFxuICBmbjogYXBwbHlTdHlsZXMsXG4gIGVmZmVjdDogZWZmZWN0LFxuICByZXF1aXJlczogWydjb21wdXRlU3R5bGVzJ11cbn07IiwiaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRMYXlvdXRSZWN0IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0TGF5b3V0UmVjdC5qc1wiO1xuaW1wb3J0IGNvbnRhaW5zIGZyb20gXCIuLi9kb20tdXRpbHMvY29udGFpbnMuanNcIjtcbmltcG9ydCBnZXRPZmZzZXRQYXJlbnQgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRPZmZzZXRQYXJlbnQuanNcIjtcbmltcG9ydCBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldE1haW5BeGlzRnJvbVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IHsgd2l0aGluIH0gZnJvbSBcIi4uL3V0aWxzL3dpdGhpbi5qc1wiO1xuaW1wb3J0IG1lcmdlUGFkZGluZ09iamVjdCBmcm9tIFwiLi4vdXRpbHMvbWVyZ2VQYWRkaW5nT2JqZWN0LmpzXCI7XG5pbXBvcnQgZXhwYW5kVG9IYXNoTWFwIGZyb20gXCIuLi91dGlscy9leHBhbmRUb0hhc2hNYXAuanNcIjtcbmltcG9ydCB7IGxlZnQsIHJpZ2h0LCBiYXNlUGxhY2VtZW50cywgdG9wLCBib3R0b20gfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCB7IGlzSFRNTEVsZW1lbnQgfSBmcm9tIFwiLi4vZG9tLXV0aWxzL2luc3RhbmNlT2YuanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG52YXIgdG9QYWRkaW5nT2JqZWN0ID0gZnVuY3Rpb24gdG9QYWRkaW5nT2JqZWN0KHBhZGRpbmcsIHN0YXRlKSB7XG4gIHBhZGRpbmcgPSB0eXBlb2YgcGFkZGluZyA9PT0gJ2Z1bmN0aW9uJyA/IHBhZGRpbmcoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUucmVjdHMsIHtcbiAgICBwbGFjZW1lbnQ6IHN0YXRlLnBsYWNlbWVudFxuICB9KSkgOiBwYWRkaW5nO1xuICByZXR1cm4gbWVyZ2VQYWRkaW5nT2JqZWN0KHR5cGVvZiBwYWRkaW5nICE9PSAnbnVtYmVyJyA/IHBhZGRpbmcgOiBleHBhbmRUb0hhc2hNYXAocGFkZGluZywgYmFzZVBsYWNlbWVudHMpKTtcbn07XG5cbmZ1bmN0aW9uIGFycm93KF9yZWYpIHtcbiAgdmFyIF9zdGF0ZSRtb2RpZmllcnNEYXRhJDtcblxuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlLFxuICAgICAgbmFtZSA9IF9yZWYubmFtZSxcbiAgICAgIG9wdGlvbnMgPSBfcmVmLm9wdGlvbnM7XG4gIHZhciBhcnJvd0VsZW1lbnQgPSBzdGF0ZS5lbGVtZW50cy5hcnJvdztcbiAgdmFyIHBvcHBlck9mZnNldHMgPSBzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHM7XG4gIHZhciBiYXNlUGxhY2VtZW50ID0gZ2V0QmFzZVBsYWNlbWVudChzdGF0ZS5wbGFjZW1lbnQpO1xuICB2YXIgYXhpcyA9IGdldE1haW5BeGlzRnJvbVBsYWNlbWVudChiYXNlUGxhY2VtZW50KTtcbiAgdmFyIGlzVmVydGljYWwgPSBbbGVmdCwgcmlnaHRdLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgPj0gMDtcbiAgdmFyIGxlbiA9IGlzVmVydGljYWwgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG5cbiAgaWYgKCFhcnJvd0VsZW1lbnQgfHwgIXBvcHBlck9mZnNldHMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgcGFkZGluZ09iamVjdCA9IHRvUGFkZGluZ09iamVjdChvcHRpb25zLnBhZGRpbmcsIHN0YXRlKTtcbiAgdmFyIGFycm93UmVjdCA9IGdldExheW91dFJlY3QoYXJyb3dFbGVtZW50KTtcbiAgdmFyIG1pblByb3AgPSBheGlzID09PSAneScgPyB0b3AgOiBsZWZ0O1xuICB2YXIgbWF4UHJvcCA9IGF4aXMgPT09ICd5JyA/IGJvdHRvbSA6IHJpZ2h0O1xuICB2YXIgZW5kRGlmZiA9IHN0YXRlLnJlY3RzLnJlZmVyZW5jZVtsZW5dICsgc3RhdGUucmVjdHMucmVmZXJlbmNlW2F4aXNdIC0gcG9wcGVyT2Zmc2V0c1theGlzXSAtIHN0YXRlLnJlY3RzLnBvcHBlcltsZW5dO1xuICB2YXIgc3RhcnREaWZmID0gcG9wcGVyT2Zmc2V0c1theGlzXSAtIHN0YXRlLnJlY3RzLnJlZmVyZW5jZVtheGlzXTtcbiAgdmFyIGFycm93T2Zmc2V0UGFyZW50ID0gZ2V0T2Zmc2V0UGFyZW50KGFycm93RWxlbWVudCk7XG4gIHZhciBjbGllbnRTaXplID0gYXJyb3dPZmZzZXRQYXJlbnQgPyBheGlzID09PSAneScgPyBhcnJvd09mZnNldFBhcmVudC5jbGllbnRIZWlnaHQgfHwgMCA6IGFycm93T2Zmc2V0UGFyZW50LmNsaWVudFdpZHRoIHx8IDAgOiAwO1xuICB2YXIgY2VudGVyVG9SZWZlcmVuY2UgPSBlbmREaWZmIC8gMiAtIHN0YXJ0RGlmZiAvIDI7IC8vIE1ha2Ugc3VyZSB0aGUgYXJyb3cgZG9lc24ndCBvdmVyZmxvdyB0aGUgcG9wcGVyIGlmIHRoZSBjZW50ZXIgcG9pbnQgaXNcbiAgLy8gb3V0c2lkZSBvZiB0aGUgcG9wcGVyIGJvdW5kc1xuXG4gIHZhciBtaW4gPSBwYWRkaW5nT2JqZWN0W21pblByb3BdO1xuICB2YXIgbWF4ID0gY2xpZW50U2l6ZSAtIGFycm93UmVjdFtsZW5dIC0gcGFkZGluZ09iamVjdFttYXhQcm9wXTtcbiAgdmFyIGNlbnRlciA9IGNsaWVudFNpemUgLyAyIC0gYXJyb3dSZWN0W2xlbl0gLyAyICsgY2VudGVyVG9SZWZlcmVuY2U7XG4gIHZhciBvZmZzZXQgPSB3aXRoaW4obWluLCBjZW50ZXIsIG1heCk7IC8vIFByZXZlbnRzIGJyZWFraW5nIHN5bnRheCBoaWdobGlnaHRpbmcuLi5cblxuICB2YXIgYXhpc1Byb3AgPSBheGlzO1xuICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdID0gKF9zdGF0ZSRtb2RpZmllcnNEYXRhJCA9IHt9LCBfc3RhdGUkbW9kaWZpZXJzRGF0YSRbYXhpc1Byb3BdID0gb2Zmc2V0LCBfc3RhdGUkbW9kaWZpZXJzRGF0YSQuY2VudGVyT2Zmc2V0ID0gb2Zmc2V0IC0gY2VudGVyLCBfc3RhdGUkbW9kaWZpZXJzRGF0YSQpO1xufVxuXG5mdW5jdGlvbiBlZmZlY3QoX3JlZjIpIHtcbiAgdmFyIHN0YXRlID0gX3JlZjIuc3RhdGUsXG4gICAgICBvcHRpb25zID0gX3JlZjIub3B0aW9ucztcbiAgdmFyIF9vcHRpb25zJGVsZW1lbnQgPSBvcHRpb25zLmVsZW1lbnQsXG4gICAgICBhcnJvd0VsZW1lbnQgPSBfb3B0aW9ucyRlbGVtZW50ID09PSB2b2lkIDAgPyAnW2RhdGEtcG9wcGVyLWFycm93XScgOiBfb3B0aW9ucyRlbGVtZW50O1xuXG4gIGlmIChhcnJvd0VsZW1lbnQgPT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfSAvLyBDU1Mgc2VsZWN0b3JcblxuXG4gIGlmICh0eXBlb2YgYXJyb3dFbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgIGFycm93RWxlbWVudCA9IHN0YXRlLmVsZW1lbnRzLnBvcHBlci5xdWVyeVNlbGVjdG9yKGFycm93RWxlbWVudCk7XG5cbiAgICBpZiAoIWFycm93RWxlbWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICBpZiAoIWlzSFRNTEVsZW1lbnQoYXJyb3dFbGVtZW50KSkge1xuICAgICAgY29uc29sZS5lcnJvcihbJ1BvcHBlcjogXCJhcnJvd1wiIGVsZW1lbnQgbXVzdCBiZSBhbiBIVE1MRWxlbWVudCAobm90IGFuIFNWR0VsZW1lbnQpLicsICdUbyB1c2UgYW4gU1ZHIGFycm93LCB3cmFwIGl0IGluIGFuIEhUTUxFbGVtZW50IHRoYXQgd2lsbCBiZSB1c2VkIGFzJywgJ3RoZSBhcnJvdy4nXS5qb2luKCcgJykpO1xuICAgIH1cbiAgfVxuXG4gIGlmICghY29udGFpbnMoc3RhdGUuZWxlbWVudHMucG9wcGVyLCBhcnJvd0VsZW1lbnQpKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgICAgY29uc29sZS5lcnJvcihbJ1BvcHBlcjogXCJhcnJvd1wiIG1vZGlmaWVyXFwncyBgZWxlbWVudGAgbXVzdCBiZSBhIGNoaWxkIG9mIHRoZSBwb3BwZXInLCAnZWxlbWVudC4nXS5qb2luKCcgJykpO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIHN0YXRlLmVsZW1lbnRzLmFycm93ID0gYXJyb3dFbGVtZW50O1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnYXJyb3cnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ21haW4nLFxuICBmbjogYXJyb3csXG4gIGVmZmVjdDogZWZmZWN0LFxuICByZXF1aXJlczogWydwb3BwZXJPZmZzZXRzJ10sXG4gIHJlcXVpcmVzSWZFeGlzdHM6IFsncHJldmVudE92ZXJmbG93J11cbn07IiwiaW1wb3J0IHsgdG9wLCBsZWZ0LCByaWdodCwgYm90dG9tLCBlbmQgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBnZXRPZmZzZXRQYXJlbnQgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRPZmZzZXRQYXJlbnQuanNcIjtcbmltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRXaW5kb3cuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4uL2RvbS11dGlscy9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBnZXRDb21wdXRlZFN0eWxlIGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0Q29tcHV0ZWRTdHlsZS5qc1wiO1xuaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRWYXJpYXRpb24gZnJvbSBcIi4uL3V0aWxzL2dldFZhcmlhdGlvbi5qc1wiO1xuaW1wb3J0IHsgcm91bmQgfSBmcm9tIFwiLi4vdXRpbHMvbWF0aC5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbnZhciB1bnNldFNpZGVzID0ge1xuICB0b3A6ICdhdXRvJyxcbiAgcmlnaHQ6ICdhdXRvJyxcbiAgYm90dG9tOiAnYXV0bycsXG4gIGxlZnQ6ICdhdXRvJ1xufTsgLy8gUm91bmQgdGhlIG9mZnNldHMgdG8gdGhlIG5lYXJlc3Qgc3VpdGFibGUgc3VicGl4ZWwgYmFzZWQgb24gdGhlIERQUi5cbi8vIFpvb21pbmcgY2FuIGNoYW5nZSB0aGUgRFBSLCBidXQgaXQgc2VlbXMgdG8gcmVwb3J0IGEgdmFsdWUgdGhhdCB3aWxsXG4vLyBjbGVhbmx5IGRpdmlkZSB0aGUgdmFsdWVzIGludG8gdGhlIGFwcHJvcHJpYXRlIHN1YnBpeGVscy5cblxuZnVuY3Rpb24gcm91bmRPZmZzZXRzQnlEUFIoX3JlZikge1xuICB2YXIgeCA9IF9yZWYueCxcbiAgICAgIHkgPSBfcmVmLnk7XG4gIHZhciB3aW4gPSB3aW5kb3c7XG4gIHZhciBkcHIgPSB3aW4uZGV2aWNlUGl4ZWxSYXRpbyB8fCAxO1xuICByZXR1cm4ge1xuICAgIHg6IHJvdW5kKHggKiBkcHIpIC8gZHByIHx8IDAsXG4gICAgeTogcm91bmQoeSAqIGRwcikgLyBkcHIgfHwgMFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwVG9TdHlsZXMoX3JlZjIpIHtcbiAgdmFyIF9PYmplY3QkYXNzaWduMjtcblxuICB2YXIgcG9wcGVyID0gX3JlZjIucG9wcGVyLFxuICAgICAgcG9wcGVyUmVjdCA9IF9yZWYyLnBvcHBlclJlY3QsXG4gICAgICBwbGFjZW1lbnQgPSBfcmVmMi5wbGFjZW1lbnQsXG4gICAgICB2YXJpYXRpb24gPSBfcmVmMi52YXJpYXRpb24sXG4gICAgICBvZmZzZXRzID0gX3JlZjIub2Zmc2V0cyxcbiAgICAgIHBvc2l0aW9uID0gX3JlZjIucG9zaXRpb24sXG4gICAgICBncHVBY2NlbGVyYXRpb24gPSBfcmVmMi5ncHVBY2NlbGVyYXRpb24sXG4gICAgICBhZGFwdGl2ZSA9IF9yZWYyLmFkYXB0aXZlLFxuICAgICAgcm91bmRPZmZzZXRzID0gX3JlZjIucm91bmRPZmZzZXRzLFxuICAgICAgaXNGaXhlZCA9IF9yZWYyLmlzRml4ZWQ7XG4gIHZhciBfb2Zmc2V0cyR4ID0gb2Zmc2V0cy54LFxuICAgICAgeCA9IF9vZmZzZXRzJHggPT09IHZvaWQgMCA/IDAgOiBfb2Zmc2V0cyR4LFxuICAgICAgX29mZnNldHMkeSA9IG9mZnNldHMueSxcbiAgICAgIHkgPSBfb2Zmc2V0cyR5ID09PSB2b2lkIDAgPyAwIDogX29mZnNldHMkeTtcblxuICB2YXIgX3JlZjMgPSB0eXBlb2Ygcm91bmRPZmZzZXRzID09PSAnZnVuY3Rpb24nID8gcm91bmRPZmZzZXRzKHtcbiAgICB4OiB4LFxuICAgIHk6IHlcbiAgfSkgOiB7XG4gICAgeDogeCxcbiAgICB5OiB5XG4gIH07XG5cbiAgeCA9IF9yZWYzLng7XG4gIHkgPSBfcmVmMy55O1xuICB2YXIgaGFzWCA9IG9mZnNldHMuaGFzT3duUHJvcGVydHkoJ3gnKTtcbiAgdmFyIGhhc1kgPSBvZmZzZXRzLmhhc093blByb3BlcnR5KCd5Jyk7XG4gIHZhciBzaWRlWCA9IGxlZnQ7XG4gIHZhciBzaWRlWSA9IHRvcDtcbiAgdmFyIHdpbiA9IHdpbmRvdztcblxuICBpZiAoYWRhcHRpdmUpIHtcbiAgICB2YXIgb2Zmc2V0UGFyZW50ID0gZ2V0T2Zmc2V0UGFyZW50KHBvcHBlcik7XG4gICAgdmFyIGhlaWdodFByb3AgPSAnY2xpZW50SGVpZ2h0JztcbiAgICB2YXIgd2lkdGhQcm9wID0gJ2NsaWVudFdpZHRoJztcblxuICAgIGlmIChvZmZzZXRQYXJlbnQgPT09IGdldFdpbmRvdyhwb3BwZXIpKSB7XG4gICAgICBvZmZzZXRQYXJlbnQgPSBnZXREb2N1bWVudEVsZW1lbnQocG9wcGVyKTtcblxuICAgICAgaWYgKGdldENvbXB1dGVkU3R5bGUob2Zmc2V0UGFyZW50KS5wb3NpdGlvbiAhPT0gJ3N0YXRpYycgJiYgcG9zaXRpb24gPT09ICdhYnNvbHV0ZScpIHtcbiAgICAgICAgaGVpZ2h0UHJvcCA9ICdzY3JvbGxIZWlnaHQnO1xuICAgICAgICB3aWR0aFByb3AgPSAnc2Nyb2xsV2lkdGgnO1xuICAgICAgfVxuICAgIH0gLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtY2FzdF06IGZvcmNlIHR5cGUgcmVmaW5lbWVudCwgd2UgY29tcGFyZSBvZmZzZXRQYXJlbnQgd2l0aCB3aW5kb3cgYWJvdmUsIGJ1dCBGbG93IGRvZXNuJ3QgZGV0ZWN0IGl0XG5cblxuICAgIG9mZnNldFBhcmVudCA9IG9mZnNldFBhcmVudDtcblxuICAgIGlmIChwbGFjZW1lbnQgPT09IHRvcCB8fCAocGxhY2VtZW50ID09PSBsZWZ0IHx8IHBsYWNlbWVudCA9PT0gcmlnaHQpICYmIHZhcmlhdGlvbiA9PT0gZW5kKSB7XG4gICAgICBzaWRlWSA9IGJvdHRvbTtcbiAgICAgIHZhciBvZmZzZXRZID0gaXNGaXhlZCAmJiBvZmZzZXRQYXJlbnQgPT09IHdpbiAmJiB3aW4udmlzdWFsVmlld3BvcnQgPyB3aW4udmlzdWFsVmlld3BvcnQuaGVpZ2h0IDogLy8gJEZsb3dGaXhNZVtwcm9wLW1pc3NpbmddXG4gICAgICBvZmZzZXRQYXJlbnRbaGVpZ2h0UHJvcF07XG4gICAgICB5IC09IG9mZnNldFkgLSBwb3BwZXJSZWN0LmhlaWdodDtcbiAgICAgIHkgKj0gZ3B1QWNjZWxlcmF0aW9uID8gMSA6IC0xO1xuICAgIH1cblxuICAgIGlmIChwbGFjZW1lbnQgPT09IGxlZnQgfHwgKHBsYWNlbWVudCA9PT0gdG9wIHx8IHBsYWNlbWVudCA9PT0gYm90dG9tKSAmJiB2YXJpYXRpb24gPT09IGVuZCkge1xuICAgICAgc2lkZVggPSByaWdodDtcbiAgICAgIHZhciBvZmZzZXRYID0gaXNGaXhlZCAmJiBvZmZzZXRQYXJlbnQgPT09IHdpbiAmJiB3aW4udmlzdWFsVmlld3BvcnQgPyB3aW4udmlzdWFsVmlld3BvcnQud2lkdGggOiAvLyAkRmxvd0ZpeE1lW3Byb3AtbWlzc2luZ11cbiAgICAgIG9mZnNldFBhcmVudFt3aWR0aFByb3BdO1xuICAgICAgeCAtPSBvZmZzZXRYIC0gcG9wcGVyUmVjdC53aWR0aDtcbiAgICAgIHggKj0gZ3B1QWNjZWxlcmF0aW9uID8gMSA6IC0xO1xuICAgIH1cbiAgfVxuXG4gIHZhciBjb21tb25TdHlsZXMgPSBPYmplY3QuYXNzaWduKHtcbiAgICBwb3NpdGlvbjogcG9zaXRpb25cbiAgfSwgYWRhcHRpdmUgJiYgdW5zZXRTaWRlcyk7XG5cbiAgdmFyIF9yZWY0ID0gcm91bmRPZmZzZXRzID09PSB0cnVlID8gcm91bmRPZmZzZXRzQnlEUFIoe1xuICAgIHg6IHgsXG4gICAgeTogeVxuICB9KSA6IHtcbiAgICB4OiB4LFxuICAgIHk6IHlcbiAgfTtcblxuICB4ID0gX3JlZjQueDtcbiAgeSA9IF9yZWY0Lnk7XG5cbiAgaWYgKGdwdUFjY2VsZXJhdGlvbikge1xuICAgIHZhciBfT2JqZWN0JGFzc2lnbjtcblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBjb21tb25TdHlsZXMsIChfT2JqZWN0JGFzc2lnbiA9IHt9LCBfT2JqZWN0JGFzc2lnbltzaWRlWV0gPSBoYXNZID8gJzAnIDogJycsIF9PYmplY3QkYXNzaWduW3NpZGVYXSA9IGhhc1ggPyAnMCcgOiAnJywgX09iamVjdCRhc3NpZ24udHJhbnNmb3JtID0gKHdpbi5kZXZpY2VQaXhlbFJhdGlvIHx8IDEpIDw9IDEgPyBcInRyYW5zbGF0ZShcIiArIHggKyBcInB4LCBcIiArIHkgKyBcInB4KVwiIDogXCJ0cmFuc2xhdGUzZChcIiArIHggKyBcInB4LCBcIiArIHkgKyBcInB4LCAwKVwiLCBfT2JqZWN0JGFzc2lnbikpO1xuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGNvbW1vblN0eWxlcywgKF9PYmplY3QkYXNzaWduMiA9IHt9LCBfT2JqZWN0JGFzc2lnbjJbc2lkZVldID0gaGFzWSA/IHkgKyBcInB4XCIgOiAnJywgX09iamVjdCRhc3NpZ24yW3NpZGVYXSA9IGhhc1ggPyB4ICsgXCJweFwiIDogJycsIF9PYmplY3QkYXNzaWduMi50cmFuc2Zvcm0gPSAnJywgX09iamVjdCRhc3NpZ24yKSk7XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVTdHlsZXMoX3JlZjUpIHtcbiAgdmFyIHN0YXRlID0gX3JlZjUuc3RhdGUsXG4gICAgICBvcHRpb25zID0gX3JlZjUub3B0aW9ucztcbiAgdmFyIF9vcHRpb25zJGdwdUFjY2VsZXJhdCA9IG9wdGlvbnMuZ3B1QWNjZWxlcmF0aW9uLFxuICAgICAgZ3B1QWNjZWxlcmF0aW9uID0gX29wdGlvbnMkZ3B1QWNjZWxlcmF0ID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkZ3B1QWNjZWxlcmF0LFxuICAgICAgX29wdGlvbnMkYWRhcHRpdmUgPSBvcHRpb25zLmFkYXB0aXZlLFxuICAgICAgYWRhcHRpdmUgPSBfb3B0aW9ucyRhZGFwdGl2ZSA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJGFkYXB0aXZlLFxuICAgICAgX29wdGlvbnMkcm91bmRPZmZzZXRzID0gb3B0aW9ucy5yb3VuZE9mZnNldHMsXG4gICAgICByb3VuZE9mZnNldHMgPSBfb3B0aW9ucyRyb3VuZE9mZnNldHMgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRyb3VuZE9mZnNldHM7XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgIHZhciB0cmFuc2l0aW9uUHJvcGVydHkgPSBnZXRDb21wdXRlZFN0eWxlKHN0YXRlLmVsZW1lbnRzLnBvcHBlcikudHJhbnNpdGlvblByb3BlcnR5IHx8ICcnO1xuXG4gICAgaWYgKGFkYXB0aXZlICYmIFsndHJhbnNmb3JtJywgJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCddLnNvbWUoZnVuY3Rpb24gKHByb3BlcnR5KSB7XG4gICAgICByZXR1cm4gdHJhbnNpdGlvblByb3BlcnR5LmluZGV4T2YocHJvcGVydHkpID49IDA7XG4gICAgfSkpIHtcbiAgICAgIGNvbnNvbGUud2FybihbJ1BvcHBlcjogRGV0ZWN0ZWQgQ1NTIHRyYW5zaXRpb25zIG9uIGF0IGxlYXN0IG9uZSBvZiB0aGUgZm9sbG93aW5nJywgJ0NTUyBwcm9wZXJ0aWVzOiBcInRyYW5zZm9ybVwiLCBcInRvcFwiLCBcInJpZ2h0XCIsIFwiYm90dG9tXCIsIFwibGVmdFwiLicsICdcXG5cXG4nLCAnRGlzYWJsZSB0aGUgXCJjb21wdXRlU3R5bGVzXCIgbW9kaWZpZXJcXCdzIGBhZGFwdGl2ZWAgb3B0aW9uIHRvIGFsbG93JywgJ2ZvciBzbW9vdGggdHJhbnNpdGlvbnMsIG9yIHJlbW92ZSB0aGVzZSBwcm9wZXJ0aWVzIGZyb20gdGhlIENTUycsICd0cmFuc2l0aW9uIGRlY2xhcmF0aW9uIG9uIHRoZSBwb3BwZXIgZWxlbWVudCBpZiBvbmx5IHRyYW5zaXRpb25pbmcnLCAnb3BhY2l0eSBvciBiYWNrZ3JvdW5kLWNvbG9yIGZvciBleGFtcGxlLicsICdcXG5cXG4nLCAnV2UgcmVjb21tZW5kIHVzaW5nIHRoZSBwb3BwZXIgZWxlbWVudCBhcyBhIHdyYXBwZXIgYXJvdW5kIGFuIGlubmVyJywgJ2VsZW1lbnQgdGhhdCBjYW4gaGF2ZSBhbnkgQ1NTIHByb3BlcnR5IHRyYW5zaXRpb25lZCBmb3IgYW5pbWF0aW9ucy4nXS5qb2luKCcgJykpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBjb21tb25TdHlsZXMgPSB7XG4gICAgcGxhY2VtZW50OiBnZXRCYXNlUGxhY2VtZW50KHN0YXRlLnBsYWNlbWVudCksXG4gICAgdmFyaWF0aW9uOiBnZXRWYXJpYXRpb24oc3RhdGUucGxhY2VtZW50KSxcbiAgICBwb3BwZXI6IHN0YXRlLmVsZW1lbnRzLnBvcHBlcixcbiAgICBwb3BwZXJSZWN0OiBzdGF0ZS5yZWN0cy5wb3BwZXIsXG4gICAgZ3B1QWNjZWxlcmF0aW9uOiBncHVBY2NlbGVyYXRpb24sXG4gICAgaXNGaXhlZDogc3RhdGUub3B0aW9ucy5zdHJhdGVneSA9PT0gJ2ZpeGVkJ1xuICB9O1xuXG4gIGlmIChzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHMgIT0gbnVsbCkge1xuICAgIHN0YXRlLnN0eWxlcy5wb3BwZXIgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5zdHlsZXMucG9wcGVyLCBtYXBUb1N0eWxlcyhPYmplY3QuYXNzaWduKHt9LCBjb21tb25TdHlsZXMsIHtcbiAgICAgIG9mZnNldHM6IHN0YXRlLm1vZGlmaWVyc0RhdGEucG9wcGVyT2Zmc2V0cyxcbiAgICAgIHBvc2l0aW9uOiBzdGF0ZS5vcHRpb25zLnN0cmF0ZWd5LFxuICAgICAgYWRhcHRpdmU6IGFkYXB0aXZlLFxuICAgICAgcm91bmRPZmZzZXRzOiByb3VuZE9mZnNldHNcbiAgICB9KSkpO1xuICB9XG5cbiAgaWYgKHN0YXRlLm1vZGlmaWVyc0RhdGEuYXJyb3cgIT0gbnVsbCkge1xuICAgIHN0YXRlLnN0eWxlcy5hcnJvdyA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLnN0eWxlcy5hcnJvdywgbWFwVG9TdHlsZXMoT2JqZWN0LmFzc2lnbih7fSwgY29tbW9uU3R5bGVzLCB7XG4gICAgICBvZmZzZXRzOiBzdGF0ZS5tb2RpZmllcnNEYXRhLmFycm93LFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICBhZGFwdGl2ZTogZmFsc2UsXG4gICAgICByb3VuZE9mZnNldHM6IHJvdW5kT2Zmc2V0c1xuICAgIH0pKSk7XG4gIH1cblxuICBzdGF0ZS5hdHRyaWJ1dGVzLnBvcHBlciA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmF0dHJpYnV0ZXMucG9wcGVyLCB7XG4gICAgJ2RhdGEtcG9wcGVyLXBsYWNlbWVudCc6IHN0YXRlLnBsYWNlbWVudFxuICB9KTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ2NvbXB1dGVTdHlsZXMnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ2JlZm9yZVdyaXRlJyxcbiAgZm46IGNvbXB1dGVTdHlsZXMsXG4gIGRhdGE6IHt9XG59OyIsImltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRXaW5kb3cuanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG52YXIgcGFzc2l2ZSA9IHtcbiAgcGFzc2l2ZTogdHJ1ZVxufTtcblxuZnVuY3Rpb24gZWZmZWN0KF9yZWYpIHtcbiAgdmFyIHN0YXRlID0gX3JlZi5zdGF0ZSxcbiAgICAgIGluc3RhbmNlID0gX3JlZi5pbnN0YW5jZSxcbiAgICAgIG9wdGlvbnMgPSBfcmVmLm9wdGlvbnM7XG4gIHZhciBfb3B0aW9ucyRzY3JvbGwgPSBvcHRpb25zLnNjcm9sbCxcbiAgICAgIHNjcm9sbCA9IF9vcHRpb25zJHNjcm9sbCA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJHNjcm9sbCxcbiAgICAgIF9vcHRpb25zJHJlc2l6ZSA9IG9wdGlvbnMucmVzaXplLFxuICAgICAgcmVzaXplID0gX29wdGlvbnMkcmVzaXplID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkcmVzaXplO1xuICB2YXIgd2luZG93ID0gZ2V0V2luZG93KHN0YXRlLmVsZW1lbnRzLnBvcHBlcik7XG4gIHZhciBzY3JvbGxQYXJlbnRzID0gW10uY29uY2F0KHN0YXRlLnNjcm9sbFBhcmVudHMucmVmZXJlbmNlLCBzdGF0ZS5zY3JvbGxQYXJlbnRzLnBvcHBlcik7XG5cbiAgaWYgKHNjcm9sbCkge1xuICAgIHNjcm9sbFBhcmVudHMuZm9yRWFjaChmdW5jdGlvbiAoc2Nyb2xsUGFyZW50KSB7XG4gICAgICBzY3JvbGxQYXJlbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgaW5zdGFuY2UudXBkYXRlLCBwYXNzaXZlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChyZXNpemUpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgaW5zdGFuY2UudXBkYXRlLCBwYXNzaXZlKTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHNjcm9sbCkge1xuICAgICAgc2Nyb2xsUGFyZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChzY3JvbGxQYXJlbnQpIHtcbiAgICAgICAgc2Nyb2xsUGFyZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGluc3RhbmNlLnVwZGF0ZSwgcGFzc2l2ZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAocmVzaXplKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgaW5zdGFuY2UudXBkYXRlLCBwYXNzaXZlKTtcbiAgICB9XG4gIH07XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdldmVudExpc3RlbmVycycsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAnd3JpdGUnLFxuICBmbjogZnVuY3Rpb24gZm4oKSB7fSxcbiAgZWZmZWN0OiBlZmZlY3QsXG4gIGRhdGE6IHt9XG59OyIsImltcG9ydCBnZXRPcHBvc2l0ZVBsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvZ2V0T3Bwb3NpdGVQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldE9wcG9zaXRlVmFyaWF0aW9uUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZGV0ZWN0T3ZlcmZsb3cgZnJvbSBcIi4uL3V0aWxzL2RldGVjdE92ZXJmbG93LmpzXCI7XG5pbXBvcnQgY29tcHV0ZUF1dG9QbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2NvbXB1dGVBdXRvUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgeyBib3R0b20sIHRvcCwgc3RhcnQsIHJpZ2h0LCBsZWZ0LCBhdXRvIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5pbXBvcnQgZ2V0VmFyaWF0aW9uIGZyb20gXCIuLi91dGlscy9nZXRWYXJpYXRpb24uanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5mdW5jdGlvbiBnZXRFeHBhbmRlZEZhbGxiYWNrUGxhY2VtZW50cyhwbGFjZW1lbnQpIHtcbiAgaWYgKGdldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KSA9PT0gYXV0bykge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHZhciBvcHBvc2l0ZVBsYWNlbWVudCA9IGdldE9wcG9zaXRlUGxhY2VtZW50KHBsYWNlbWVudCk7XG4gIHJldHVybiBbZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQocGxhY2VtZW50KSwgb3Bwb3NpdGVQbGFjZW1lbnQsIGdldE9wcG9zaXRlVmFyaWF0aW9uUGxhY2VtZW50KG9wcG9zaXRlUGxhY2VtZW50KV07XG59XG5cbmZ1bmN0aW9uIGZsaXAoX3JlZikge1xuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlLFxuICAgICAgb3B0aW9ucyA9IF9yZWYub3B0aW9ucyxcbiAgICAgIG5hbWUgPSBfcmVmLm5hbWU7XG5cbiAgaWYgKHN0YXRlLm1vZGlmaWVyc0RhdGFbbmFtZV0uX3NraXApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgX29wdGlvbnMkbWFpbkF4aXMgPSBvcHRpb25zLm1haW5BeGlzLFxuICAgICAgY2hlY2tNYWluQXhpcyA9IF9vcHRpb25zJG1haW5BeGlzID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkbWFpbkF4aXMsXG4gICAgICBfb3B0aW9ucyRhbHRBeGlzID0gb3B0aW9ucy5hbHRBeGlzLFxuICAgICAgY2hlY2tBbHRBeGlzID0gX29wdGlvbnMkYWx0QXhpcyA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJGFsdEF4aXMsXG4gICAgICBzcGVjaWZpZWRGYWxsYmFja1BsYWNlbWVudHMgPSBvcHRpb25zLmZhbGxiYWNrUGxhY2VtZW50cyxcbiAgICAgIHBhZGRpbmcgPSBvcHRpb25zLnBhZGRpbmcsXG4gICAgICBib3VuZGFyeSA9IG9wdGlvbnMuYm91bmRhcnksXG4gICAgICByb290Qm91bmRhcnkgPSBvcHRpb25zLnJvb3RCb3VuZGFyeSxcbiAgICAgIGFsdEJvdW5kYXJ5ID0gb3B0aW9ucy5hbHRCb3VuZGFyeSxcbiAgICAgIF9vcHRpb25zJGZsaXBWYXJpYXRpbyA9IG9wdGlvbnMuZmxpcFZhcmlhdGlvbnMsXG4gICAgICBmbGlwVmFyaWF0aW9ucyA9IF9vcHRpb25zJGZsaXBWYXJpYXRpbyA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJGZsaXBWYXJpYXRpbyxcbiAgICAgIGFsbG93ZWRBdXRvUGxhY2VtZW50cyA9IG9wdGlvbnMuYWxsb3dlZEF1dG9QbGFjZW1lbnRzO1xuICB2YXIgcHJlZmVycmVkUGxhY2VtZW50ID0gc3RhdGUub3B0aW9ucy5wbGFjZW1lbnQ7XG4gIHZhciBiYXNlUGxhY2VtZW50ID0gZ2V0QmFzZVBsYWNlbWVudChwcmVmZXJyZWRQbGFjZW1lbnQpO1xuICB2YXIgaXNCYXNlUGxhY2VtZW50ID0gYmFzZVBsYWNlbWVudCA9PT0gcHJlZmVycmVkUGxhY2VtZW50O1xuICB2YXIgZmFsbGJhY2tQbGFjZW1lbnRzID0gc3BlY2lmaWVkRmFsbGJhY2tQbGFjZW1lbnRzIHx8IChpc0Jhc2VQbGFjZW1lbnQgfHwgIWZsaXBWYXJpYXRpb25zID8gW2dldE9wcG9zaXRlUGxhY2VtZW50KHByZWZlcnJlZFBsYWNlbWVudCldIDogZ2V0RXhwYW5kZWRGYWxsYmFja1BsYWNlbWVudHMocHJlZmVycmVkUGxhY2VtZW50KSk7XG4gIHZhciBwbGFjZW1lbnRzID0gW3ByZWZlcnJlZFBsYWNlbWVudF0uY29uY2F0KGZhbGxiYWNrUGxhY2VtZW50cykucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHBsYWNlbWVudCkge1xuICAgIHJldHVybiBhY2MuY29uY2F0KGdldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KSA9PT0gYXV0byA/IGNvbXB1dGVBdXRvUGxhY2VtZW50KHN0YXRlLCB7XG4gICAgICBwbGFjZW1lbnQ6IHBsYWNlbWVudCxcbiAgICAgIGJvdW5kYXJ5OiBib3VuZGFyeSxcbiAgICAgIHJvb3RCb3VuZGFyeTogcm9vdEJvdW5kYXJ5LFxuICAgICAgcGFkZGluZzogcGFkZGluZyxcbiAgICAgIGZsaXBWYXJpYXRpb25zOiBmbGlwVmFyaWF0aW9ucyxcbiAgICAgIGFsbG93ZWRBdXRvUGxhY2VtZW50czogYWxsb3dlZEF1dG9QbGFjZW1lbnRzXG4gICAgfSkgOiBwbGFjZW1lbnQpO1xuICB9LCBbXSk7XG4gIHZhciByZWZlcmVuY2VSZWN0ID0gc3RhdGUucmVjdHMucmVmZXJlbmNlO1xuICB2YXIgcG9wcGVyUmVjdCA9IHN0YXRlLnJlY3RzLnBvcHBlcjtcbiAgdmFyIGNoZWNrc01hcCA9IG5ldyBNYXAoKTtcbiAgdmFyIG1ha2VGYWxsYmFja0NoZWNrcyA9IHRydWU7XG4gIHZhciBmaXJzdEZpdHRpbmdQbGFjZW1lbnQgPSBwbGFjZW1lbnRzWzBdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGxhY2VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBwbGFjZW1lbnQgPSBwbGFjZW1lbnRzW2ldO1xuXG4gICAgdmFyIF9iYXNlUGxhY2VtZW50ID0gZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpO1xuXG4gICAgdmFyIGlzU3RhcnRWYXJpYXRpb24gPSBnZXRWYXJpYXRpb24ocGxhY2VtZW50KSA9PT0gc3RhcnQ7XG4gICAgdmFyIGlzVmVydGljYWwgPSBbdG9wLCBib3R0b21dLmluZGV4T2YoX2Jhc2VQbGFjZW1lbnQpID49IDA7XG4gICAgdmFyIGxlbiA9IGlzVmVydGljYWwgPyAnd2lkdGgnIDogJ2hlaWdodCc7XG4gICAgdmFyIG92ZXJmbG93ID0gZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIHtcbiAgICAgIHBsYWNlbWVudDogcGxhY2VtZW50LFxuICAgICAgYm91bmRhcnk6IGJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5OiByb290Qm91bmRhcnksXG4gICAgICBhbHRCb3VuZGFyeTogYWx0Qm91bmRhcnksXG4gICAgICBwYWRkaW5nOiBwYWRkaW5nXG4gICAgfSk7XG4gICAgdmFyIG1haW5WYXJpYXRpb25TaWRlID0gaXNWZXJ0aWNhbCA/IGlzU3RhcnRWYXJpYXRpb24gPyByaWdodCA6IGxlZnQgOiBpc1N0YXJ0VmFyaWF0aW9uID8gYm90dG9tIDogdG9wO1xuXG4gICAgaWYgKHJlZmVyZW5jZVJlY3RbbGVuXSA+IHBvcHBlclJlY3RbbGVuXSkge1xuICAgICAgbWFpblZhcmlhdGlvblNpZGUgPSBnZXRPcHBvc2l0ZVBsYWNlbWVudChtYWluVmFyaWF0aW9uU2lkZSk7XG4gICAgfVxuXG4gICAgdmFyIGFsdFZhcmlhdGlvblNpZGUgPSBnZXRPcHBvc2l0ZVBsYWNlbWVudChtYWluVmFyaWF0aW9uU2lkZSk7XG4gICAgdmFyIGNoZWNrcyA9IFtdO1xuXG4gICAgaWYgKGNoZWNrTWFpbkF4aXMpIHtcbiAgICAgIGNoZWNrcy5wdXNoKG92ZXJmbG93W19iYXNlUGxhY2VtZW50XSA8PSAwKTtcbiAgICB9XG5cbiAgICBpZiAoY2hlY2tBbHRBeGlzKSB7XG4gICAgICBjaGVja3MucHVzaChvdmVyZmxvd1ttYWluVmFyaWF0aW9uU2lkZV0gPD0gMCwgb3ZlcmZsb3dbYWx0VmFyaWF0aW9uU2lkZV0gPD0gMCk7XG4gICAgfVxuXG4gICAgaWYgKGNoZWNrcy5ldmVyeShmdW5jdGlvbiAoY2hlY2spIHtcbiAgICAgIHJldHVybiBjaGVjaztcbiAgICB9KSkge1xuICAgICAgZmlyc3RGaXR0aW5nUGxhY2VtZW50ID0gcGxhY2VtZW50O1xuICAgICAgbWFrZUZhbGxiYWNrQ2hlY2tzID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjaGVja3NNYXAuc2V0KHBsYWNlbWVudCwgY2hlY2tzKTtcbiAgfVxuXG4gIGlmIChtYWtlRmFsbGJhY2tDaGVja3MpIHtcbiAgICAvLyBgMmAgbWF5IGJlIGRlc2lyZWQgaW4gc29tZSBjYXNlcyDigJMgcmVzZWFyY2ggbGF0ZXJcbiAgICB2YXIgbnVtYmVyT2ZDaGVja3MgPSBmbGlwVmFyaWF0aW9ucyA/IDMgOiAxO1xuXG4gICAgdmFyIF9sb29wID0gZnVuY3Rpb24gX2xvb3AoX2kpIHtcbiAgICAgIHZhciBmaXR0aW5nUGxhY2VtZW50ID0gcGxhY2VtZW50cy5maW5kKGZ1bmN0aW9uIChwbGFjZW1lbnQpIHtcbiAgICAgICAgdmFyIGNoZWNrcyA9IGNoZWNrc01hcC5nZXQocGxhY2VtZW50KTtcblxuICAgICAgICBpZiAoY2hlY2tzKSB7XG4gICAgICAgICAgcmV0dXJuIGNoZWNrcy5zbGljZSgwLCBfaSkuZXZlcnkoZnVuY3Rpb24gKGNoZWNrKSB7XG4gICAgICAgICAgICByZXR1cm4gY2hlY2s7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoZml0dGluZ1BsYWNlbWVudCkge1xuICAgICAgICBmaXJzdEZpdHRpbmdQbGFjZW1lbnQgPSBmaXR0aW5nUGxhY2VtZW50O1xuICAgICAgICByZXR1cm4gXCJicmVha1wiO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmb3IgKHZhciBfaSA9IG51bWJlck9mQ2hlY2tzOyBfaSA+IDA7IF9pLS0pIHtcbiAgICAgIHZhciBfcmV0ID0gX2xvb3AoX2kpO1xuXG4gICAgICBpZiAoX3JldCA9PT0gXCJicmVha1wiKSBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoc3RhdGUucGxhY2VtZW50ICE9PSBmaXJzdEZpdHRpbmdQbGFjZW1lbnQpIHtcbiAgICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdLl9za2lwID0gdHJ1ZTtcbiAgICBzdGF0ZS5wbGFjZW1lbnQgPSBmaXJzdEZpdHRpbmdQbGFjZW1lbnQ7XG4gICAgc3RhdGUucmVzZXQgPSB0cnVlO1xuICB9XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdmbGlwJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdtYWluJyxcbiAgZm46IGZsaXAsXG4gIHJlcXVpcmVzSWZFeGlzdHM6IFsnb2Zmc2V0J10sXG4gIGRhdGE6IHtcbiAgICBfc2tpcDogZmFsc2VcbiAgfVxufTsiLCJpbXBvcnQgeyB0b3AsIGJvdHRvbSwgbGVmdCwgcmlnaHQgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBkZXRlY3RPdmVyZmxvdyBmcm9tIFwiLi4vdXRpbHMvZGV0ZWN0T3ZlcmZsb3cuanNcIjtcblxuZnVuY3Rpb24gZ2V0U2lkZU9mZnNldHMob3ZlcmZsb3csIHJlY3QsIHByZXZlbnRlZE9mZnNldHMpIHtcbiAgaWYgKHByZXZlbnRlZE9mZnNldHMgPT09IHZvaWQgMCkge1xuICAgIHByZXZlbnRlZE9mZnNldHMgPSB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHRvcDogb3ZlcmZsb3cudG9wIC0gcmVjdC5oZWlnaHQgLSBwcmV2ZW50ZWRPZmZzZXRzLnksXG4gICAgcmlnaHQ6IG92ZXJmbG93LnJpZ2h0IC0gcmVjdC53aWR0aCArIHByZXZlbnRlZE9mZnNldHMueCxcbiAgICBib3R0b206IG92ZXJmbG93LmJvdHRvbSAtIHJlY3QuaGVpZ2h0ICsgcHJldmVudGVkT2Zmc2V0cy55LFxuICAgIGxlZnQ6IG92ZXJmbG93LmxlZnQgLSByZWN0LndpZHRoIC0gcHJldmVudGVkT2Zmc2V0cy54XG4gIH07XG59XG5cbmZ1bmN0aW9uIGlzQW55U2lkZUZ1bGx5Q2xpcHBlZChvdmVyZmxvdykge1xuICByZXR1cm4gW3RvcCwgcmlnaHQsIGJvdHRvbSwgbGVmdF0uc29tZShmdW5jdGlvbiAoc2lkZSkge1xuICAgIHJldHVybiBvdmVyZmxvd1tzaWRlXSA+PSAwO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gaGlkZShfcmVmKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGUsXG4gICAgICBuYW1lID0gX3JlZi5uYW1lO1xuICB2YXIgcmVmZXJlbmNlUmVjdCA9IHN0YXRlLnJlY3RzLnJlZmVyZW5jZTtcbiAgdmFyIHBvcHBlclJlY3QgPSBzdGF0ZS5yZWN0cy5wb3BwZXI7XG4gIHZhciBwcmV2ZW50ZWRPZmZzZXRzID0gc3RhdGUubW9kaWZpZXJzRGF0YS5wcmV2ZW50T3ZlcmZsb3c7XG4gIHZhciByZWZlcmVuY2VPdmVyZmxvdyA9IGRldGVjdE92ZXJmbG93KHN0YXRlLCB7XG4gICAgZWxlbWVudENvbnRleHQ6ICdyZWZlcmVuY2UnXG4gIH0pO1xuICB2YXIgcG9wcGVyQWx0T3ZlcmZsb3cgPSBkZXRlY3RPdmVyZmxvdyhzdGF0ZSwge1xuICAgIGFsdEJvdW5kYXJ5OiB0cnVlXG4gIH0pO1xuICB2YXIgcmVmZXJlbmNlQ2xpcHBpbmdPZmZzZXRzID0gZ2V0U2lkZU9mZnNldHMocmVmZXJlbmNlT3ZlcmZsb3csIHJlZmVyZW5jZVJlY3QpO1xuICB2YXIgcG9wcGVyRXNjYXBlT2Zmc2V0cyA9IGdldFNpZGVPZmZzZXRzKHBvcHBlckFsdE92ZXJmbG93LCBwb3BwZXJSZWN0LCBwcmV2ZW50ZWRPZmZzZXRzKTtcbiAgdmFyIGlzUmVmZXJlbmNlSGlkZGVuID0gaXNBbnlTaWRlRnVsbHlDbGlwcGVkKHJlZmVyZW5jZUNsaXBwaW5nT2Zmc2V0cyk7XG4gIHZhciBoYXNQb3BwZXJFc2NhcGVkID0gaXNBbnlTaWRlRnVsbHlDbGlwcGVkKHBvcHBlckVzY2FwZU9mZnNldHMpO1xuICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdID0ge1xuICAgIHJlZmVyZW5jZUNsaXBwaW5nT2Zmc2V0czogcmVmZXJlbmNlQ2xpcHBpbmdPZmZzZXRzLFxuICAgIHBvcHBlckVzY2FwZU9mZnNldHM6IHBvcHBlckVzY2FwZU9mZnNldHMsXG4gICAgaXNSZWZlcmVuY2VIaWRkZW46IGlzUmVmZXJlbmNlSGlkZGVuLFxuICAgIGhhc1BvcHBlckVzY2FwZWQ6IGhhc1BvcHBlckVzY2FwZWRcbiAgfTtcbiAgc3RhdGUuYXR0cmlidXRlcy5wb3BwZXIgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5hdHRyaWJ1dGVzLnBvcHBlciwge1xuICAgICdkYXRhLXBvcHBlci1yZWZlcmVuY2UtaGlkZGVuJzogaXNSZWZlcmVuY2VIaWRkZW4sXG4gICAgJ2RhdGEtcG9wcGVyLWVzY2FwZWQnOiBoYXNQb3BwZXJFc2NhcGVkXG4gIH0pO1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnaGlkZScsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAnbWFpbicsXG4gIHJlcXVpcmVzSWZFeGlzdHM6IFsncHJldmVudE92ZXJmbG93J10sXG4gIGZuOiBoaWRlXG59OyIsImV4cG9ydCB7IGRlZmF1bHQgYXMgYXBwbHlTdHlsZXMgfSBmcm9tIFwiLi9hcHBseVN0eWxlcy5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBhcnJvdyB9IGZyb20gXCIuL2Fycm93LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGNvbXB1dGVTdHlsZXMgfSBmcm9tIFwiLi9jb21wdXRlU3R5bGVzLmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGV2ZW50TGlzdGVuZXJzIH0gZnJvbSBcIi4vZXZlbnRMaXN0ZW5lcnMuanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZmxpcCB9IGZyb20gXCIuL2ZsaXAuanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgaGlkZSB9IGZyb20gXCIuL2hpZGUuanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgb2Zmc2V0IH0gZnJvbSBcIi4vb2Zmc2V0LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHBvcHBlck9mZnNldHMgfSBmcm9tIFwiLi9wb3BwZXJPZmZzZXRzLmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHByZXZlbnRPdmVyZmxvdyB9IGZyb20gXCIuL3ByZXZlbnRPdmVyZmxvdy5qc1wiOyIsImltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgeyB0b3AsIGxlZnQsIHJpZ2h0LCBwbGFjZW1lbnRzIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3RhbmNlQW5kU2tpZGRpbmdUb1hZKHBsYWNlbWVudCwgcmVjdHMsIG9mZnNldCkge1xuICB2YXIgYmFzZVBsYWNlbWVudCA9IGdldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KTtcbiAgdmFyIGludmVydERpc3RhbmNlID0gW2xlZnQsIHRvcF0uaW5kZXhPZihiYXNlUGxhY2VtZW50KSA+PSAwID8gLTEgOiAxO1xuXG4gIHZhciBfcmVmID0gdHlwZW9mIG9mZnNldCA9PT0gJ2Z1bmN0aW9uJyA/IG9mZnNldChPYmplY3QuYXNzaWduKHt9LCByZWN0cywge1xuICAgIHBsYWNlbWVudDogcGxhY2VtZW50XG4gIH0pKSA6IG9mZnNldCxcbiAgICAgIHNraWRkaW5nID0gX3JlZlswXSxcbiAgICAgIGRpc3RhbmNlID0gX3JlZlsxXTtcblxuICBza2lkZGluZyA9IHNraWRkaW5nIHx8IDA7XG4gIGRpc3RhbmNlID0gKGRpc3RhbmNlIHx8IDApICogaW52ZXJ0RGlzdGFuY2U7XG4gIHJldHVybiBbbGVmdCwgcmlnaHRdLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgPj0gMCA/IHtcbiAgICB4OiBkaXN0YW5jZSxcbiAgICB5OiBza2lkZGluZ1xuICB9IDoge1xuICAgIHg6IHNraWRkaW5nLFxuICAgIHk6IGRpc3RhbmNlXG4gIH07XG59XG5cbmZ1bmN0aW9uIG9mZnNldChfcmVmMikge1xuICB2YXIgc3RhdGUgPSBfcmVmMi5zdGF0ZSxcbiAgICAgIG9wdGlvbnMgPSBfcmVmMi5vcHRpb25zLFxuICAgICAgbmFtZSA9IF9yZWYyLm5hbWU7XG4gIHZhciBfb3B0aW9ucyRvZmZzZXQgPSBvcHRpb25zLm9mZnNldCxcbiAgICAgIG9mZnNldCA9IF9vcHRpb25zJG9mZnNldCA9PT0gdm9pZCAwID8gWzAsIDBdIDogX29wdGlvbnMkb2Zmc2V0O1xuICB2YXIgZGF0YSA9IHBsYWNlbWVudHMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHBsYWNlbWVudCkge1xuICAgIGFjY1twbGFjZW1lbnRdID0gZGlzdGFuY2VBbmRTa2lkZGluZ1RvWFkocGxhY2VtZW50LCBzdGF0ZS5yZWN0cywgb2Zmc2V0KTtcbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG4gIHZhciBfZGF0YSRzdGF0ZSRwbGFjZW1lbnQgPSBkYXRhW3N0YXRlLnBsYWNlbWVudF0sXG4gICAgICB4ID0gX2RhdGEkc3RhdGUkcGxhY2VtZW50LngsXG4gICAgICB5ID0gX2RhdGEkc3RhdGUkcGxhY2VtZW50Lnk7XG5cbiAgaWYgKHN0YXRlLm1vZGlmaWVyc0RhdGEucG9wcGVyT2Zmc2V0cyAhPSBudWxsKSB7XG4gICAgc3RhdGUubW9kaWZpZXJzRGF0YS5wb3BwZXJPZmZzZXRzLnggKz0geDtcbiAgICBzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHMueSArPSB5O1xuICB9XG5cbiAgc3RhdGUubW9kaWZpZXJzRGF0YVtuYW1lXSA9IGRhdGE7XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdvZmZzZXQnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ21haW4nLFxuICByZXF1aXJlczogWydwb3BwZXJPZmZzZXRzJ10sXG4gIGZuOiBvZmZzZXRcbn07IiwiaW1wb3J0IGNvbXB1dGVPZmZzZXRzIGZyb20gXCIuLi91dGlscy9jb21wdXRlT2Zmc2V0cy5qc1wiO1xuXG5mdW5jdGlvbiBwb3BwZXJPZmZzZXRzKF9yZWYpIHtcbiAgdmFyIHN0YXRlID0gX3JlZi5zdGF0ZSxcbiAgICAgIG5hbWUgPSBfcmVmLm5hbWU7XG4gIC8vIE9mZnNldHMgYXJlIHRoZSBhY3R1YWwgcG9zaXRpb24gdGhlIHBvcHBlciBuZWVkcyB0byBoYXZlIHRvIGJlXG4gIC8vIHByb3Blcmx5IHBvc2l0aW9uZWQgbmVhciBpdHMgcmVmZXJlbmNlIGVsZW1lbnRcbiAgLy8gVGhpcyBpcyB0aGUgbW9zdCBiYXNpYyBwbGFjZW1lbnQsIGFuZCB3aWxsIGJlIGFkanVzdGVkIGJ5XG4gIC8vIHRoZSBtb2RpZmllcnMgaW4gdGhlIG5leHQgc3RlcFxuICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdID0gY29tcHV0ZU9mZnNldHMoe1xuICAgIHJlZmVyZW5jZTogc3RhdGUucmVjdHMucmVmZXJlbmNlLFxuICAgIGVsZW1lbnQ6IHN0YXRlLnJlY3RzLnBvcHBlcixcbiAgICBzdHJhdGVneTogJ2Fic29sdXRlJyxcbiAgICBwbGFjZW1lbnQ6IHN0YXRlLnBsYWNlbWVudFxuICB9KTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ3BvcHBlck9mZnNldHMnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ3JlYWQnLFxuICBmbjogcG9wcGVyT2Zmc2V0cyxcbiAgZGF0YToge31cbn07IiwiaW1wb3J0IHsgdG9wLCBsZWZ0LCByaWdodCwgYm90dG9tLCBzdGFydCB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldE1haW5BeGlzRnJvbVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IGdldEFsdEF4aXMgZnJvbSBcIi4uL3V0aWxzL2dldEFsdEF4aXMuanNcIjtcbmltcG9ydCB7IHdpdGhpbiwgd2l0aGluTWF4Q2xhbXAgfSBmcm9tIFwiLi4vdXRpbHMvd2l0aGluLmpzXCI7XG5pbXBvcnQgZ2V0TGF5b3V0UmVjdCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldExheW91dFJlY3QuanNcIjtcbmltcG9ydCBnZXRPZmZzZXRQYXJlbnQgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRPZmZzZXRQYXJlbnQuanNcIjtcbmltcG9ydCBkZXRlY3RPdmVyZmxvdyBmcm9tIFwiLi4vdXRpbHMvZGV0ZWN0T3ZlcmZsb3cuanNcIjtcbmltcG9ydCBnZXRWYXJpYXRpb24gZnJvbSBcIi4uL3V0aWxzL2dldFZhcmlhdGlvbi5qc1wiO1xuaW1wb3J0IGdldEZyZXNoU2lkZU9iamVjdCBmcm9tIFwiLi4vdXRpbHMvZ2V0RnJlc2hTaWRlT2JqZWN0LmpzXCI7XG5pbXBvcnQgeyBtaW4gYXMgbWF0aE1pbiwgbWF4IGFzIG1hdGhNYXggfSBmcm9tIFwiLi4vdXRpbHMvbWF0aC5qc1wiO1xuXG5mdW5jdGlvbiBwcmV2ZW50T3ZlcmZsb3coX3JlZikge1xuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlLFxuICAgICAgb3B0aW9ucyA9IF9yZWYub3B0aW9ucyxcbiAgICAgIG5hbWUgPSBfcmVmLm5hbWU7XG4gIHZhciBfb3B0aW9ucyRtYWluQXhpcyA9IG9wdGlvbnMubWFpbkF4aXMsXG4gICAgICBjaGVja01haW5BeGlzID0gX29wdGlvbnMkbWFpbkF4aXMgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRtYWluQXhpcyxcbiAgICAgIF9vcHRpb25zJGFsdEF4aXMgPSBvcHRpb25zLmFsdEF4aXMsXG4gICAgICBjaGVja0FsdEF4aXMgPSBfb3B0aW9ucyRhbHRBeGlzID09PSB2b2lkIDAgPyBmYWxzZSA6IF9vcHRpb25zJGFsdEF4aXMsXG4gICAgICBib3VuZGFyeSA9IG9wdGlvbnMuYm91bmRhcnksXG4gICAgICByb290Qm91bmRhcnkgPSBvcHRpb25zLnJvb3RCb3VuZGFyeSxcbiAgICAgIGFsdEJvdW5kYXJ5ID0gb3B0aW9ucy5hbHRCb3VuZGFyeSxcbiAgICAgIHBhZGRpbmcgPSBvcHRpb25zLnBhZGRpbmcsXG4gICAgICBfb3B0aW9ucyR0ZXRoZXIgPSBvcHRpb25zLnRldGhlcixcbiAgICAgIHRldGhlciA9IF9vcHRpb25zJHRldGhlciA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJHRldGhlcixcbiAgICAgIF9vcHRpb25zJHRldGhlck9mZnNldCA9IG9wdGlvbnMudGV0aGVyT2Zmc2V0LFxuICAgICAgdGV0aGVyT2Zmc2V0ID0gX29wdGlvbnMkdGV0aGVyT2Zmc2V0ID09PSB2b2lkIDAgPyAwIDogX29wdGlvbnMkdGV0aGVyT2Zmc2V0O1xuICB2YXIgb3ZlcmZsb3cgPSBkZXRlY3RPdmVyZmxvdyhzdGF0ZSwge1xuICAgIGJvdW5kYXJ5OiBib3VuZGFyeSxcbiAgICByb290Qm91bmRhcnk6IHJvb3RCb3VuZGFyeSxcbiAgICBwYWRkaW5nOiBwYWRkaW5nLFxuICAgIGFsdEJvdW5kYXJ5OiBhbHRCb3VuZGFyeVxuICB9KTtcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBnZXRCYXNlUGxhY2VtZW50KHN0YXRlLnBsYWNlbWVudCk7XG4gIHZhciB2YXJpYXRpb24gPSBnZXRWYXJpYXRpb24oc3RhdGUucGxhY2VtZW50KTtcbiAgdmFyIGlzQmFzZVBsYWNlbWVudCA9ICF2YXJpYXRpb247XG4gIHZhciBtYWluQXhpcyA9IGdldE1haW5BeGlzRnJvbVBsYWNlbWVudChiYXNlUGxhY2VtZW50KTtcbiAgdmFyIGFsdEF4aXMgPSBnZXRBbHRBeGlzKG1haW5BeGlzKTtcbiAgdmFyIHBvcHBlck9mZnNldHMgPSBzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHM7XG4gIHZhciByZWZlcmVuY2VSZWN0ID0gc3RhdGUucmVjdHMucmVmZXJlbmNlO1xuICB2YXIgcG9wcGVyUmVjdCA9IHN0YXRlLnJlY3RzLnBvcHBlcjtcbiAgdmFyIHRldGhlck9mZnNldFZhbHVlID0gdHlwZW9mIHRldGhlck9mZnNldCA9PT0gJ2Z1bmN0aW9uJyA/IHRldGhlck9mZnNldChPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5yZWN0cywge1xuICAgIHBsYWNlbWVudDogc3RhdGUucGxhY2VtZW50XG4gIH0pKSA6IHRldGhlck9mZnNldDtcbiAgdmFyIG5vcm1hbGl6ZWRUZXRoZXJPZmZzZXRWYWx1ZSA9IHR5cGVvZiB0ZXRoZXJPZmZzZXRWYWx1ZSA9PT0gJ251bWJlcicgPyB7XG4gICAgbWFpbkF4aXM6IHRldGhlck9mZnNldFZhbHVlLFxuICAgIGFsdEF4aXM6IHRldGhlck9mZnNldFZhbHVlXG4gIH0gOiBPYmplY3QuYXNzaWduKHtcbiAgICBtYWluQXhpczogMCxcbiAgICBhbHRBeGlzOiAwXG4gIH0sIHRldGhlck9mZnNldFZhbHVlKTtcbiAgdmFyIG9mZnNldE1vZGlmaWVyU3RhdGUgPSBzdGF0ZS5tb2RpZmllcnNEYXRhLm9mZnNldCA/IHN0YXRlLm1vZGlmaWVyc0RhdGEub2Zmc2V0W3N0YXRlLnBsYWNlbWVudF0gOiBudWxsO1xuICB2YXIgZGF0YSA9IHtcbiAgICB4OiAwLFxuICAgIHk6IDBcbiAgfTtcblxuICBpZiAoIXBvcHBlck9mZnNldHMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY2hlY2tNYWluQXhpcykge1xuICAgIHZhciBfb2Zmc2V0TW9kaWZpZXJTdGF0ZSQ7XG5cbiAgICB2YXIgbWFpblNpZGUgPSBtYWluQXhpcyA9PT0gJ3knID8gdG9wIDogbGVmdDtcbiAgICB2YXIgYWx0U2lkZSA9IG1haW5BeGlzID09PSAneScgPyBib3R0b20gOiByaWdodDtcbiAgICB2YXIgbGVuID0gbWFpbkF4aXMgPT09ICd5JyA/ICdoZWlnaHQnIDogJ3dpZHRoJztcbiAgICB2YXIgb2Zmc2V0ID0gcG9wcGVyT2Zmc2V0c1ttYWluQXhpc107XG4gICAgdmFyIG1pbiA9IG9mZnNldCArIG92ZXJmbG93W21haW5TaWRlXTtcbiAgICB2YXIgbWF4ID0gb2Zmc2V0IC0gb3ZlcmZsb3dbYWx0U2lkZV07XG4gICAgdmFyIGFkZGl0aXZlID0gdGV0aGVyID8gLXBvcHBlclJlY3RbbGVuXSAvIDIgOiAwO1xuICAgIHZhciBtaW5MZW4gPSB2YXJpYXRpb24gPT09IHN0YXJ0ID8gcmVmZXJlbmNlUmVjdFtsZW5dIDogcG9wcGVyUmVjdFtsZW5dO1xuICAgIHZhciBtYXhMZW4gPSB2YXJpYXRpb24gPT09IHN0YXJ0ID8gLXBvcHBlclJlY3RbbGVuXSA6IC1yZWZlcmVuY2VSZWN0W2xlbl07IC8vIFdlIG5lZWQgdG8gaW5jbHVkZSB0aGUgYXJyb3cgaW4gdGhlIGNhbGN1bGF0aW9uIHNvIHRoZSBhcnJvdyBkb2Vzbid0IGdvXG4gICAgLy8gb3V0c2lkZSB0aGUgcmVmZXJlbmNlIGJvdW5kc1xuXG4gICAgdmFyIGFycm93RWxlbWVudCA9IHN0YXRlLmVsZW1lbnRzLmFycm93O1xuICAgIHZhciBhcnJvd1JlY3QgPSB0ZXRoZXIgJiYgYXJyb3dFbGVtZW50ID8gZ2V0TGF5b3V0UmVjdChhcnJvd0VsZW1lbnQpIDoge1xuICAgICAgd2lkdGg6IDAsXG4gICAgICBoZWlnaHQ6IDBcbiAgICB9O1xuICAgIHZhciBhcnJvd1BhZGRpbmdPYmplY3QgPSBzdGF0ZS5tb2RpZmllcnNEYXRhWydhcnJvdyNwZXJzaXN0ZW50J10gPyBzdGF0ZS5tb2RpZmllcnNEYXRhWydhcnJvdyNwZXJzaXN0ZW50J10ucGFkZGluZyA6IGdldEZyZXNoU2lkZU9iamVjdCgpO1xuICAgIHZhciBhcnJvd1BhZGRpbmdNaW4gPSBhcnJvd1BhZGRpbmdPYmplY3RbbWFpblNpZGVdO1xuICAgIHZhciBhcnJvd1BhZGRpbmdNYXggPSBhcnJvd1BhZGRpbmdPYmplY3RbYWx0U2lkZV07IC8vIElmIHRoZSByZWZlcmVuY2UgbGVuZ3RoIGlzIHNtYWxsZXIgdGhhbiB0aGUgYXJyb3cgbGVuZ3RoLCB3ZSBkb24ndCB3YW50XG4gICAgLy8gdG8gaW5jbHVkZSBpdHMgZnVsbCBzaXplIGluIHRoZSBjYWxjdWxhdGlvbi4gSWYgdGhlIHJlZmVyZW5jZSBpcyBzbWFsbFxuICAgIC8vIGFuZCBuZWFyIHRoZSBlZGdlIG9mIGEgYm91bmRhcnksIHRoZSBwb3BwZXIgY2FuIG92ZXJmbG93IGV2ZW4gaWYgdGhlXG4gICAgLy8gcmVmZXJlbmNlIGlzIG5vdCBvdmVyZmxvd2luZyBhcyB3ZWxsIChlLmcuIHZpcnR1YWwgZWxlbWVudHMgd2l0aCBub1xuICAgIC8vIHdpZHRoIG9yIGhlaWdodClcblxuICAgIHZhciBhcnJvd0xlbiA9IHdpdGhpbigwLCByZWZlcmVuY2VSZWN0W2xlbl0sIGFycm93UmVjdFtsZW5dKTtcbiAgICB2YXIgbWluT2Zmc2V0ID0gaXNCYXNlUGxhY2VtZW50ID8gcmVmZXJlbmNlUmVjdFtsZW5dIC8gMiAtIGFkZGl0aXZlIC0gYXJyb3dMZW4gLSBhcnJvd1BhZGRpbmdNaW4gLSBub3JtYWxpemVkVGV0aGVyT2Zmc2V0VmFsdWUubWFpbkF4aXMgOiBtaW5MZW4gLSBhcnJvd0xlbiAtIGFycm93UGFkZGluZ01pbiAtIG5vcm1hbGl6ZWRUZXRoZXJPZmZzZXRWYWx1ZS5tYWluQXhpcztcbiAgICB2YXIgbWF4T2Zmc2V0ID0gaXNCYXNlUGxhY2VtZW50ID8gLXJlZmVyZW5jZVJlY3RbbGVuXSAvIDIgKyBhZGRpdGl2ZSArIGFycm93TGVuICsgYXJyb3dQYWRkaW5nTWF4ICsgbm9ybWFsaXplZFRldGhlck9mZnNldFZhbHVlLm1haW5BeGlzIDogbWF4TGVuICsgYXJyb3dMZW4gKyBhcnJvd1BhZGRpbmdNYXggKyBub3JtYWxpemVkVGV0aGVyT2Zmc2V0VmFsdWUubWFpbkF4aXM7XG4gICAgdmFyIGFycm93T2Zmc2V0UGFyZW50ID0gc3RhdGUuZWxlbWVudHMuYXJyb3cgJiYgZ2V0T2Zmc2V0UGFyZW50KHN0YXRlLmVsZW1lbnRzLmFycm93KTtcbiAgICB2YXIgY2xpZW50T2Zmc2V0ID0gYXJyb3dPZmZzZXRQYXJlbnQgPyBtYWluQXhpcyA9PT0gJ3knID8gYXJyb3dPZmZzZXRQYXJlbnQuY2xpZW50VG9wIHx8IDAgOiBhcnJvd09mZnNldFBhcmVudC5jbGllbnRMZWZ0IHx8IDAgOiAwO1xuICAgIHZhciBvZmZzZXRNb2RpZmllclZhbHVlID0gKF9vZmZzZXRNb2RpZmllclN0YXRlJCA9IG9mZnNldE1vZGlmaWVyU3RhdGUgPT0gbnVsbCA/IHZvaWQgMCA6IG9mZnNldE1vZGlmaWVyU3RhdGVbbWFpbkF4aXNdKSAhPSBudWxsID8gX29mZnNldE1vZGlmaWVyU3RhdGUkIDogMDtcbiAgICB2YXIgdGV0aGVyTWluID0gb2Zmc2V0ICsgbWluT2Zmc2V0IC0gb2Zmc2V0TW9kaWZpZXJWYWx1ZSAtIGNsaWVudE9mZnNldDtcbiAgICB2YXIgdGV0aGVyTWF4ID0gb2Zmc2V0ICsgbWF4T2Zmc2V0IC0gb2Zmc2V0TW9kaWZpZXJWYWx1ZTtcbiAgICB2YXIgcHJldmVudGVkT2Zmc2V0ID0gd2l0aGluKHRldGhlciA/IG1hdGhNaW4obWluLCB0ZXRoZXJNaW4pIDogbWluLCBvZmZzZXQsIHRldGhlciA/IG1hdGhNYXgobWF4LCB0ZXRoZXJNYXgpIDogbWF4KTtcbiAgICBwb3BwZXJPZmZzZXRzW21haW5BeGlzXSA9IHByZXZlbnRlZE9mZnNldDtcbiAgICBkYXRhW21haW5BeGlzXSA9IHByZXZlbnRlZE9mZnNldCAtIG9mZnNldDtcbiAgfVxuXG4gIGlmIChjaGVja0FsdEF4aXMpIHtcbiAgICB2YXIgX29mZnNldE1vZGlmaWVyU3RhdGUkMjtcblxuICAgIHZhciBfbWFpblNpZGUgPSBtYWluQXhpcyA9PT0gJ3gnID8gdG9wIDogbGVmdDtcblxuICAgIHZhciBfYWx0U2lkZSA9IG1haW5BeGlzID09PSAneCcgPyBib3R0b20gOiByaWdodDtcblxuICAgIHZhciBfb2Zmc2V0ID0gcG9wcGVyT2Zmc2V0c1thbHRBeGlzXTtcblxuICAgIHZhciBfbGVuID0gYWx0QXhpcyA9PT0gJ3knID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xuXG4gICAgdmFyIF9taW4gPSBfb2Zmc2V0ICsgb3ZlcmZsb3dbX21haW5TaWRlXTtcblxuICAgIHZhciBfbWF4ID0gX29mZnNldCAtIG92ZXJmbG93W19hbHRTaWRlXTtcblxuICAgIHZhciBpc09yaWdpblNpZGUgPSBbdG9wLCBsZWZ0XS5pbmRleE9mKGJhc2VQbGFjZW1lbnQpICE9PSAtMTtcblxuICAgIHZhciBfb2Zmc2V0TW9kaWZpZXJWYWx1ZSA9IChfb2Zmc2V0TW9kaWZpZXJTdGF0ZSQyID0gb2Zmc2V0TW9kaWZpZXJTdGF0ZSA9PSBudWxsID8gdm9pZCAwIDogb2Zmc2V0TW9kaWZpZXJTdGF0ZVthbHRBeGlzXSkgIT0gbnVsbCA/IF9vZmZzZXRNb2RpZmllclN0YXRlJDIgOiAwO1xuXG4gICAgdmFyIF90ZXRoZXJNaW4gPSBpc09yaWdpblNpZGUgPyBfbWluIDogX29mZnNldCAtIHJlZmVyZW5jZVJlY3RbX2xlbl0gLSBwb3BwZXJSZWN0W19sZW5dIC0gX29mZnNldE1vZGlmaWVyVmFsdWUgKyBub3JtYWxpemVkVGV0aGVyT2Zmc2V0VmFsdWUuYWx0QXhpcztcblxuICAgIHZhciBfdGV0aGVyTWF4ID0gaXNPcmlnaW5TaWRlID8gX29mZnNldCArIHJlZmVyZW5jZVJlY3RbX2xlbl0gKyBwb3BwZXJSZWN0W19sZW5dIC0gX29mZnNldE1vZGlmaWVyVmFsdWUgLSBub3JtYWxpemVkVGV0aGVyT2Zmc2V0VmFsdWUuYWx0QXhpcyA6IF9tYXg7XG5cbiAgICB2YXIgX3ByZXZlbnRlZE9mZnNldCA9IHRldGhlciAmJiBpc09yaWdpblNpZGUgPyB3aXRoaW5NYXhDbGFtcChfdGV0aGVyTWluLCBfb2Zmc2V0LCBfdGV0aGVyTWF4KSA6IHdpdGhpbih0ZXRoZXIgPyBfdGV0aGVyTWluIDogX21pbiwgX29mZnNldCwgdGV0aGVyID8gX3RldGhlck1heCA6IF9tYXgpO1xuXG4gICAgcG9wcGVyT2Zmc2V0c1thbHRBeGlzXSA9IF9wcmV2ZW50ZWRPZmZzZXQ7XG4gICAgZGF0YVthbHRBeGlzXSA9IF9wcmV2ZW50ZWRPZmZzZXQgLSBfb2Zmc2V0O1xuICB9XG5cbiAgc3RhdGUubW9kaWZpZXJzRGF0YVtuYW1lXSA9IGRhdGE7XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdwcmV2ZW50T3ZlcmZsb3cnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ21haW4nLFxuICBmbjogcHJldmVudE92ZXJmbG93LFxuICByZXF1aXJlc0lmRXhpc3RzOiBbJ29mZnNldCddXG59OyIsImltcG9ydCB7IHBvcHBlckdlbmVyYXRvciwgZGV0ZWN0T3ZlcmZsb3cgfSBmcm9tIFwiLi9jcmVhdGVQb3BwZXIuanNcIjtcbmltcG9ydCBldmVudExpc3RlbmVycyBmcm9tIFwiLi9tb2RpZmllcnMvZXZlbnRMaXN0ZW5lcnMuanNcIjtcbmltcG9ydCBwb3BwZXJPZmZzZXRzIGZyb20gXCIuL21vZGlmaWVycy9wb3BwZXJPZmZzZXRzLmpzXCI7XG5pbXBvcnQgY29tcHV0ZVN0eWxlcyBmcm9tIFwiLi9tb2RpZmllcnMvY29tcHV0ZVN0eWxlcy5qc1wiO1xuaW1wb3J0IGFwcGx5U3R5bGVzIGZyb20gXCIuL21vZGlmaWVycy9hcHBseVN0eWxlcy5qc1wiO1xudmFyIGRlZmF1bHRNb2RpZmllcnMgPSBbZXZlbnRMaXN0ZW5lcnMsIHBvcHBlck9mZnNldHMsIGNvbXB1dGVTdHlsZXMsIGFwcGx5U3R5bGVzXTtcbnZhciBjcmVhdGVQb3BwZXIgPSAvKiNfX1BVUkVfXyovcG9wcGVyR2VuZXJhdG9yKHtcbiAgZGVmYXVsdE1vZGlmaWVyczogZGVmYXVsdE1vZGlmaWVyc1xufSk7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuZXhwb3J0IHsgY3JlYXRlUG9wcGVyLCBwb3BwZXJHZW5lcmF0b3IsIGRlZmF1bHRNb2RpZmllcnMsIGRldGVjdE92ZXJmbG93IH07IiwiaW1wb3J0IHsgcG9wcGVyR2VuZXJhdG9yLCBkZXRlY3RPdmVyZmxvdyB9IGZyb20gXCIuL2NyZWF0ZVBvcHBlci5qc1wiO1xuaW1wb3J0IGV2ZW50TGlzdGVuZXJzIGZyb20gXCIuL21vZGlmaWVycy9ldmVudExpc3RlbmVycy5qc1wiO1xuaW1wb3J0IHBvcHBlck9mZnNldHMgZnJvbSBcIi4vbW9kaWZpZXJzL3BvcHBlck9mZnNldHMuanNcIjtcbmltcG9ydCBjb21wdXRlU3R5bGVzIGZyb20gXCIuL21vZGlmaWVycy9jb21wdXRlU3R5bGVzLmpzXCI7XG5pbXBvcnQgYXBwbHlTdHlsZXMgZnJvbSBcIi4vbW9kaWZpZXJzL2FwcGx5U3R5bGVzLmpzXCI7XG5pbXBvcnQgb2Zmc2V0IGZyb20gXCIuL21vZGlmaWVycy9vZmZzZXQuanNcIjtcbmltcG9ydCBmbGlwIGZyb20gXCIuL21vZGlmaWVycy9mbGlwLmpzXCI7XG5pbXBvcnQgcHJldmVudE92ZXJmbG93IGZyb20gXCIuL21vZGlmaWVycy9wcmV2ZW50T3ZlcmZsb3cuanNcIjtcbmltcG9ydCBhcnJvdyBmcm9tIFwiLi9tb2RpZmllcnMvYXJyb3cuanNcIjtcbmltcG9ydCBoaWRlIGZyb20gXCIuL21vZGlmaWVycy9oaWRlLmpzXCI7XG52YXIgZGVmYXVsdE1vZGlmaWVycyA9IFtldmVudExpc3RlbmVycywgcG9wcGVyT2Zmc2V0cywgY29tcHV0ZVN0eWxlcywgYXBwbHlTdHlsZXMsIG9mZnNldCwgZmxpcCwgcHJldmVudE92ZXJmbG93LCBhcnJvdywgaGlkZV07XG52YXIgY3JlYXRlUG9wcGVyID0gLyojX19QVVJFX18qL3BvcHBlckdlbmVyYXRvcih7XG4gIGRlZmF1bHRNb2RpZmllcnM6IGRlZmF1bHRNb2RpZmllcnNcbn0pOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbmV4cG9ydCB7IGNyZWF0ZVBvcHBlciwgcG9wcGVyR2VuZXJhdG9yLCBkZWZhdWx0TW9kaWZpZXJzLCBkZXRlY3RPdmVyZmxvdyB9OyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbmV4cG9ydCB7IGNyZWF0ZVBvcHBlciBhcyBjcmVhdGVQb3BwZXJMaXRlIH0gZnJvbSBcIi4vcG9wcGVyLWxpdGUuanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgKiBmcm9tIFwiLi9tb2RpZmllcnMvaW5kZXguanNcIjsiLCJpbXBvcnQgZ2V0VmFyaWF0aW9uIGZyb20gXCIuL2dldFZhcmlhdGlvbi5qc1wiO1xuaW1wb3J0IHsgdmFyaWF0aW9uUGxhY2VtZW50cywgYmFzZVBsYWNlbWVudHMsIHBsYWNlbWVudHMgYXMgYWxsUGxhY2VtZW50cyB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IGRldGVjdE92ZXJmbG93IGZyb20gXCIuL2RldGVjdE92ZXJmbG93LmpzXCI7XG5pbXBvcnQgZ2V0QmFzZVBsYWNlbWVudCBmcm9tIFwiLi9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb21wdXRlQXV0b1BsYWNlbWVudChzdGF0ZSwgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdmFyIF9vcHRpb25zID0gb3B0aW9ucyxcbiAgICAgIHBsYWNlbWVudCA9IF9vcHRpb25zLnBsYWNlbWVudCxcbiAgICAgIGJvdW5kYXJ5ID0gX29wdGlvbnMuYm91bmRhcnksXG4gICAgICByb290Qm91bmRhcnkgPSBfb3B0aW9ucy5yb290Qm91bmRhcnksXG4gICAgICBwYWRkaW5nID0gX29wdGlvbnMucGFkZGluZyxcbiAgICAgIGZsaXBWYXJpYXRpb25zID0gX29wdGlvbnMuZmxpcFZhcmlhdGlvbnMsXG4gICAgICBfb3B0aW9ucyRhbGxvd2VkQXV0b1AgPSBfb3B0aW9ucy5hbGxvd2VkQXV0b1BsYWNlbWVudHMsXG4gICAgICBhbGxvd2VkQXV0b1BsYWNlbWVudHMgPSBfb3B0aW9ucyRhbGxvd2VkQXV0b1AgPT09IHZvaWQgMCA/IGFsbFBsYWNlbWVudHMgOiBfb3B0aW9ucyRhbGxvd2VkQXV0b1A7XG4gIHZhciB2YXJpYXRpb24gPSBnZXRWYXJpYXRpb24ocGxhY2VtZW50KTtcbiAgdmFyIHBsYWNlbWVudHMgPSB2YXJpYXRpb24gPyBmbGlwVmFyaWF0aW9ucyA/IHZhcmlhdGlvblBsYWNlbWVudHMgOiB2YXJpYXRpb25QbGFjZW1lbnRzLmZpbHRlcihmdW5jdGlvbiAocGxhY2VtZW50KSB7XG4gICAgcmV0dXJuIGdldFZhcmlhdGlvbihwbGFjZW1lbnQpID09PSB2YXJpYXRpb247XG4gIH0pIDogYmFzZVBsYWNlbWVudHM7XG4gIHZhciBhbGxvd2VkUGxhY2VtZW50cyA9IHBsYWNlbWVudHMuZmlsdGVyKGZ1bmN0aW9uIChwbGFjZW1lbnQpIHtcbiAgICByZXR1cm4gYWxsb3dlZEF1dG9QbGFjZW1lbnRzLmluZGV4T2YocGxhY2VtZW50KSA+PSAwO1xuICB9KTtcblxuICBpZiAoYWxsb3dlZFBsYWNlbWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgYWxsb3dlZFBsYWNlbWVudHMgPSBwbGFjZW1lbnRzO1xuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgICAgY29uc29sZS5lcnJvcihbJ1BvcHBlcjogVGhlIGBhbGxvd2VkQXV0b1BsYWNlbWVudHNgIG9wdGlvbiBkaWQgbm90IGFsbG93IGFueScsICdwbGFjZW1lbnRzLiBFbnN1cmUgdGhlIGBwbGFjZW1lbnRgIG9wdGlvbiBtYXRjaGVzIHRoZSB2YXJpYXRpb24nLCAnb2YgdGhlIGFsbG93ZWQgcGxhY2VtZW50cy4nLCAnRm9yIGV4YW1wbGUsIFwiYXV0b1wiIGNhbm5vdCBiZSB1c2VkIHRvIGFsbG93IFwiYm90dG9tLXN0YXJ0XCIuJywgJ1VzZSBcImF1dG8tc3RhcnRcIiBpbnN0ZWFkLiddLmpvaW4oJyAnKSk7XG4gICAgfVxuICB9IC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLXR5cGVdOiBGbG93IHNlZW1zIHRvIGhhdmUgcHJvYmxlbXMgd2l0aCB0d28gYXJyYXkgdW5pb25zLi4uXG5cblxuICB2YXIgb3ZlcmZsb3dzID0gYWxsb3dlZFBsYWNlbWVudHMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHBsYWNlbWVudCkge1xuICAgIGFjY1twbGFjZW1lbnRdID0gZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIHtcbiAgICAgIHBsYWNlbWVudDogcGxhY2VtZW50LFxuICAgICAgYm91bmRhcnk6IGJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5OiByb290Qm91bmRhcnksXG4gICAgICBwYWRkaW5nOiBwYWRkaW5nXG4gICAgfSlbZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpXTtcbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvdmVyZmxvd3MpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gb3ZlcmZsb3dzW2FdIC0gb3ZlcmZsb3dzW2JdO1xuICB9KTtcbn0iLCJpbXBvcnQgZ2V0QmFzZVBsYWNlbWVudCBmcm9tIFwiLi9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0VmFyaWF0aW9uIGZyb20gXCIuL2dldFZhcmlhdGlvbi5qc1wiO1xuaW1wb3J0IGdldE1haW5BeGlzRnJvbVBsYWNlbWVudCBmcm9tIFwiLi9nZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQuanNcIjtcbmltcG9ydCB7IHRvcCwgcmlnaHQsIGJvdHRvbSwgbGVmdCwgc3RhcnQsIGVuZCB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29tcHV0ZU9mZnNldHMoX3JlZikge1xuICB2YXIgcmVmZXJlbmNlID0gX3JlZi5yZWZlcmVuY2UsXG4gICAgICBlbGVtZW50ID0gX3JlZi5lbGVtZW50LFxuICAgICAgcGxhY2VtZW50ID0gX3JlZi5wbGFjZW1lbnQ7XG4gIHZhciBiYXNlUGxhY2VtZW50ID0gcGxhY2VtZW50ID8gZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpIDogbnVsbDtcbiAgdmFyIHZhcmlhdGlvbiA9IHBsYWNlbWVudCA/IGdldFZhcmlhdGlvbihwbGFjZW1lbnQpIDogbnVsbDtcbiAgdmFyIGNvbW1vblggPSByZWZlcmVuY2UueCArIHJlZmVyZW5jZS53aWR0aCAvIDIgLSBlbGVtZW50LndpZHRoIC8gMjtcbiAgdmFyIGNvbW1vblkgPSByZWZlcmVuY2UueSArIHJlZmVyZW5jZS5oZWlnaHQgLyAyIC0gZWxlbWVudC5oZWlnaHQgLyAyO1xuICB2YXIgb2Zmc2V0cztcblxuICBzd2l0Y2ggKGJhc2VQbGFjZW1lbnQpIHtcbiAgICBjYXNlIHRvcDpcbiAgICAgIG9mZnNldHMgPSB7XG4gICAgICAgIHg6IGNvbW1vblgsXG4gICAgICAgIHk6IHJlZmVyZW5jZS55IC0gZWxlbWVudC5oZWlnaHRcbiAgICAgIH07XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgYm90dG9tOlxuICAgICAgb2Zmc2V0cyA9IHtcbiAgICAgICAgeDogY29tbW9uWCxcbiAgICAgICAgeTogcmVmZXJlbmNlLnkgKyByZWZlcmVuY2UuaGVpZ2h0XG4gICAgICB9O1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIHJpZ2h0OlxuICAgICAgb2Zmc2V0cyA9IHtcbiAgICAgICAgeDogcmVmZXJlbmNlLnggKyByZWZlcmVuY2Uud2lkdGgsXG4gICAgICAgIHk6IGNvbW1vbllcbiAgICAgIH07XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgbGVmdDpcbiAgICAgIG9mZnNldHMgPSB7XG4gICAgICAgIHg6IHJlZmVyZW5jZS54IC0gZWxlbWVudC53aWR0aCxcbiAgICAgICAgeTogY29tbW9uWVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIG9mZnNldHMgPSB7XG4gICAgICAgIHg6IHJlZmVyZW5jZS54LFxuICAgICAgICB5OiByZWZlcmVuY2UueVxuICAgICAgfTtcbiAgfVxuXG4gIHZhciBtYWluQXhpcyA9IGJhc2VQbGFjZW1lbnQgPyBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQoYmFzZVBsYWNlbWVudCkgOiBudWxsO1xuXG4gIGlmIChtYWluQXhpcyAhPSBudWxsKSB7XG4gICAgdmFyIGxlbiA9IG1haW5BeGlzID09PSAneScgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG5cbiAgICBzd2l0Y2ggKHZhcmlhdGlvbikge1xuICAgICAgY2FzZSBzdGFydDpcbiAgICAgICAgb2Zmc2V0c1ttYWluQXhpc10gPSBvZmZzZXRzW21haW5BeGlzXSAtIChyZWZlcmVuY2VbbGVuXSAvIDIgLSBlbGVtZW50W2xlbl0gLyAyKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgZW5kOlxuICAgICAgICBvZmZzZXRzW21haW5BeGlzXSA9IG9mZnNldHNbbWFpbkF4aXNdICsgKHJlZmVyZW5jZVtsZW5dIC8gMiAtIGVsZW1lbnRbbGVuXSAvIDIpO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2Zmc2V0cztcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkZWJvdW5jZShmbikge1xuICB2YXIgcGVuZGluZztcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXBlbmRpbmcpIHtcbiAgICAgIHBlbmRpbmcgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBwZW5kaW5nID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJlc29sdmUoZm4oKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBlbmRpbmc7XG4gIH07XG59IiwiaW1wb3J0IGdldENsaXBwaW5nUmVjdCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldENsaXBwaW5nUmVjdC5qc1wiO1xuaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldEJvdW5kaW5nQ2xpZW50UmVjdC5qc1wiO1xuaW1wb3J0IGNvbXB1dGVPZmZzZXRzIGZyb20gXCIuL2NvbXB1dGVPZmZzZXRzLmpzXCI7XG5pbXBvcnQgcmVjdFRvQ2xpZW50UmVjdCBmcm9tIFwiLi9yZWN0VG9DbGllbnRSZWN0LmpzXCI7XG5pbXBvcnQgeyBjbGlwcGluZ1BhcmVudHMsIHJlZmVyZW5jZSwgcG9wcGVyLCBib3R0b20sIHRvcCwgcmlnaHQsIGJhc2VQbGFjZW1lbnRzLCB2aWV3cG9ydCB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IHsgaXNFbGVtZW50IH0gZnJvbSBcIi4uL2RvbS11dGlscy9pbnN0YW5jZU9mLmpzXCI7XG5pbXBvcnQgbWVyZ2VQYWRkaW5nT2JqZWN0IGZyb20gXCIuL21lcmdlUGFkZGluZ09iamVjdC5qc1wiO1xuaW1wb3J0IGV4cGFuZFRvSGFzaE1hcCBmcm9tIFwiLi9leHBhbmRUb0hhc2hNYXAuanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkZXRlY3RPdmVyZmxvdyhzdGF0ZSwgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdmFyIF9vcHRpb25zID0gb3B0aW9ucyxcbiAgICAgIF9vcHRpb25zJHBsYWNlbWVudCA9IF9vcHRpb25zLnBsYWNlbWVudCxcbiAgICAgIHBsYWNlbWVudCA9IF9vcHRpb25zJHBsYWNlbWVudCA9PT0gdm9pZCAwID8gc3RhdGUucGxhY2VtZW50IDogX29wdGlvbnMkcGxhY2VtZW50LFxuICAgICAgX29wdGlvbnMkYm91bmRhcnkgPSBfb3B0aW9ucy5ib3VuZGFyeSxcbiAgICAgIGJvdW5kYXJ5ID0gX29wdGlvbnMkYm91bmRhcnkgPT09IHZvaWQgMCA/IGNsaXBwaW5nUGFyZW50cyA6IF9vcHRpb25zJGJvdW5kYXJ5LFxuICAgICAgX29wdGlvbnMkcm9vdEJvdW5kYXJ5ID0gX29wdGlvbnMucm9vdEJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5ID0gX29wdGlvbnMkcm9vdEJvdW5kYXJ5ID09PSB2b2lkIDAgPyB2aWV3cG9ydCA6IF9vcHRpb25zJHJvb3RCb3VuZGFyeSxcbiAgICAgIF9vcHRpb25zJGVsZW1lbnRDb250ZSA9IF9vcHRpb25zLmVsZW1lbnRDb250ZXh0LFxuICAgICAgZWxlbWVudENvbnRleHQgPSBfb3B0aW9ucyRlbGVtZW50Q29udGUgPT09IHZvaWQgMCA/IHBvcHBlciA6IF9vcHRpb25zJGVsZW1lbnRDb250ZSxcbiAgICAgIF9vcHRpb25zJGFsdEJvdW5kYXJ5ID0gX29wdGlvbnMuYWx0Qm91bmRhcnksXG4gICAgICBhbHRCb3VuZGFyeSA9IF9vcHRpb25zJGFsdEJvdW5kYXJ5ID09PSB2b2lkIDAgPyBmYWxzZSA6IF9vcHRpb25zJGFsdEJvdW5kYXJ5LFxuICAgICAgX29wdGlvbnMkcGFkZGluZyA9IF9vcHRpb25zLnBhZGRpbmcsXG4gICAgICBwYWRkaW5nID0gX29wdGlvbnMkcGFkZGluZyA9PT0gdm9pZCAwID8gMCA6IF9vcHRpb25zJHBhZGRpbmc7XG4gIHZhciBwYWRkaW5nT2JqZWN0ID0gbWVyZ2VQYWRkaW5nT2JqZWN0KHR5cGVvZiBwYWRkaW5nICE9PSAnbnVtYmVyJyA/IHBhZGRpbmcgOiBleHBhbmRUb0hhc2hNYXAocGFkZGluZywgYmFzZVBsYWNlbWVudHMpKTtcbiAgdmFyIGFsdENvbnRleHQgPSBlbGVtZW50Q29udGV4dCA9PT0gcG9wcGVyID8gcmVmZXJlbmNlIDogcG9wcGVyO1xuICB2YXIgcG9wcGVyUmVjdCA9IHN0YXRlLnJlY3RzLnBvcHBlcjtcbiAgdmFyIGVsZW1lbnQgPSBzdGF0ZS5lbGVtZW50c1thbHRCb3VuZGFyeSA/IGFsdENvbnRleHQgOiBlbGVtZW50Q29udGV4dF07XG4gIHZhciBjbGlwcGluZ0NsaWVudFJlY3QgPSBnZXRDbGlwcGluZ1JlY3QoaXNFbGVtZW50KGVsZW1lbnQpID8gZWxlbWVudCA6IGVsZW1lbnQuY29udGV4dEVsZW1lbnQgfHwgZ2V0RG9jdW1lbnRFbGVtZW50KHN0YXRlLmVsZW1lbnRzLnBvcHBlciksIGJvdW5kYXJ5LCByb290Qm91bmRhcnkpO1xuICB2YXIgcmVmZXJlbmNlQ2xpZW50UmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChzdGF0ZS5lbGVtZW50cy5yZWZlcmVuY2UpO1xuICB2YXIgcG9wcGVyT2Zmc2V0cyA9IGNvbXB1dGVPZmZzZXRzKHtcbiAgICByZWZlcmVuY2U6IHJlZmVyZW5jZUNsaWVudFJlY3QsXG4gICAgZWxlbWVudDogcG9wcGVyUmVjdCxcbiAgICBzdHJhdGVneTogJ2Fic29sdXRlJyxcbiAgICBwbGFjZW1lbnQ6IHBsYWNlbWVudFxuICB9KTtcbiAgdmFyIHBvcHBlckNsaWVudFJlY3QgPSByZWN0VG9DbGllbnRSZWN0KE9iamVjdC5hc3NpZ24oe30sIHBvcHBlclJlY3QsIHBvcHBlck9mZnNldHMpKTtcbiAgdmFyIGVsZW1lbnRDbGllbnRSZWN0ID0gZWxlbWVudENvbnRleHQgPT09IHBvcHBlciA/IHBvcHBlckNsaWVudFJlY3QgOiByZWZlcmVuY2VDbGllbnRSZWN0OyAvLyBwb3NpdGl2ZSA9IG92ZXJmbG93aW5nIHRoZSBjbGlwcGluZyByZWN0XG4gIC8vIDAgb3IgbmVnYXRpdmUgPSB3aXRoaW4gdGhlIGNsaXBwaW5nIHJlY3RcblxuICB2YXIgb3ZlcmZsb3dPZmZzZXRzID0ge1xuICAgIHRvcDogY2xpcHBpbmdDbGllbnRSZWN0LnRvcCAtIGVsZW1lbnRDbGllbnRSZWN0LnRvcCArIHBhZGRpbmdPYmplY3QudG9wLFxuICAgIGJvdHRvbTogZWxlbWVudENsaWVudFJlY3QuYm90dG9tIC0gY2xpcHBpbmdDbGllbnRSZWN0LmJvdHRvbSArIHBhZGRpbmdPYmplY3QuYm90dG9tLFxuICAgIGxlZnQ6IGNsaXBwaW5nQ2xpZW50UmVjdC5sZWZ0IC0gZWxlbWVudENsaWVudFJlY3QubGVmdCArIHBhZGRpbmdPYmplY3QubGVmdCxcbiAgICByaWdodDogZWxlbWVudENsaWVudFJlY3QucmlnaHQgLSBjbGlwcGluZ0NsaWVudFJlY3QucmlnaHQgKyBwYWRkaW5nT2JqZWN0LnJpZ2h0XG4gIH07XG4gIHZhciBvZmZzZXREYXRhID0gc3RhdGUubW9kaWZpZXJzRGF0YS5vZmZzZXQ7IC8vIE9mZnNldHMgY2FuIGJlIGFwcGxpZWQgb25seSB0byB0aGUgcG9wcGVyIGVsZW1lbnRcblxuICBpZiAoZWxlbWVudENvbnRleHQgPT09IHBvcHBlciAmJiBvZmZzZXREYXRhKSB7XG4gICAgdmFyIG9mZnNldCA9IG9mZnNldERhdGFbcGxhY2VtZW50XTtcbiAgICBPYmplY3Qua2V5cyhvdmVyZmxvd09mZnNldHMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgdmFyIG11bHRpcGx5ID0gW3JpZ2h0LCBib3R0b21dLmluZGV4T2Yoa2V5KSA+PSAwID8gMSA6IC0xO1xuICAgICAgdmFyIGF4aXMgPSBbdG9wLCBib3R0b21dLmluZGV4T2Yoa2V5KSA+PSAwID8gJ3knIDogJ3gnO1xuICAgICAgb3ZlcmZsb3dPZmZzZXRzW2tleV0gKz0gb2Zmc2V0W2F4aXNdICogbXVsdGlwbHk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gb3ZlcmZsb3dPZmZzZXRzO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGV4cGFuZFRvSGFzaE1hcCh2YWx1ZSwga2V5cykge1xuICByZXR1cm4ga2V5cy5yZWR1Y2UoZnVuY3Rpb24gKGhhc2hNYXAsIGtleSkge1xuICAgIGhhc2hNYXBba2V5XSA9IHZhbHVlO1xuICAgIHJldHVybiBoYXNoTWFwO1xuICB9LCB7fSk7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZm9ybWF0KHN0cikge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICByZXR1cm4gW10uY29uY2F0KGFyZ3MpLnJlZHVjZShmdW5jdGlvbiAocCwgYykge1xuICAgIHJldHVybiBwLnJlcGxhY2UoLyVzLywgYyk7XG4gIH0sIHN0cik7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0QWx0QXhpcyhheGlzKSB7XG4gIHJldHVybiBheGlzID09PSAneCcgPyAneScgOiAneCc7XG59IiwiaW1wb3J0IHsgYXV0byB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIHBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEZyZXNoU2lkZU9iamVjdCgpIHtcbiAgcmV0dXJuIHtcbiAgICB0b3A6IDAsXG4gICAgcmlnaHQ6IDAsXG4gICAgYm90dG9tOiAwLFxuICAgIGxlZnQ6IDBcbiAgfTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQocGxhY2VtZW50KSB7XG4gIHJldHVybiBbJ3RvcCcsICdib3R0b20nXS5pbmRleE9mKHBsYWNlbWVudCkgPj0gMCA/ICd4JyA6ICd5Jztcbn0iLCJ2YXIgaGFzaCA9IHtcbiAgbGVmdDogJ3JpZ2h0JyxcbiAgcmlnaHQ6ICdsZWZ0JyxcbiAgYm90dG9tOiAndG9wJyxcbiAgdG9wOiAnYm90dG9tJ1xufTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldE9wcG9zaXRlUGxhY2VtZW50KHBsYWNlbWVudCkge1xuICByZXR1cm4gcGxhY2VtZW50LnJlcGxhY2UoL2xlZnR8cmlnaHR8Ym90dG9tfHRvcC9nLCBmdW5jdGlvbiAobWF0Y2hlZCkge1xuICAgIHJldHVybiBoYXNoW21hdGNoZWRdO1xuICB9KTtcbn0iLCJ2YXIgaGFzaCA9IHtcbiAgc3RhcnQ6ICdlbmQnLFxuICBlbmQ6ICdzdGFydCdcbn07XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRPcHBvc2l0ZVZhcmlhdGlvblBsYWNlbWVudChwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIHBsYWNlbWVudC5yZXBsYWNlKC9zdGFydHxlbmQvZywgZnVuY3Rpb24gKG1hdGNoZWQpIHtcbiAgICByZXR1cm4gaGFzaFttYXRjaGVkXTtcbiAgfSk7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0VmFyaWF0aW9uKHBsYWNlbWVudCkge1xuICByZXR1cm4gcGxhY2VtZW50LnNwbGl0KCctJylbMV07XG59IiwiZXhwb3J0IHZhciBtYXggPSBNYXRoLm1heDtcbmV4cG9ydCB2YXIgbWluID0gTWF0aC5taW47XG5leHBvcnQgdmFyIHJvdW5kID0gTWF0aC5yb3VuZDsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtZXJnZUJ5TmFtZShtb2RpZmllcnMpIHtcbiAgdmFyIG1lcmdlZCA9IG1vZGlmaWVycy5yZWR1Y2UoZnVuY3Rpb24gKG1lcmdlZCwgY3VycmVudCkge1xuICAgIHZhciBleGlzdGluZyA9IG1lcmdlZFtjdXJyZW50Lm5hbWVdO1xuICAgIG1lcmdlZFtjdXJyZW50Lm5hbWVdID0gZXhpc3RpbmcgPyBPYmplY3QuYXNzaWduKHt9LCBleGlzdGluZywgY3VycmVudCwge1xuICAgICAgb3B0aW9uczogT2JqZWN0LmFzc2lnbih7fSwgZXhpc3Rpbmcub3B0aW9ucywgY3VycmVudC5vcHRpb25zKSxcbiAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oe30sIGV4aXN0aW5nLmRhdGEsIGN1cnJlbnQuZGF0YSlcbiAgICB9KSA6IGN1cnJlbnQ7XG4gICAgcmV0dXJuIG1lcmdlZDtcbiAgfSwge30pOyAvLyBJRTExIGRvZXMgbm90IHN1cHBvcnQgT2JqZWN0LnZhbHVlc1xuXG4gIHJldHVybiBPYmplY3Qua2V5cyhtZXJnZWQpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIG1lcmdlZFtrZXldO1xuICB9KTtcbn0iLCJpbXBvcnQgZ2V0RnJlc2hTaWRlT2JqZWN0IGZyb20gXCIuL2dldEZyZXNoU2lkZU9iamVjdC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWVyZ2VQYWRkaW5nT2JqZWN0KHBhZGRpbmdPYmplY3QpIHtcbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGdldEZyZXNoU2lkZU9iamVjdCgpLCBwYWRkaW5nT2JqZWN0KTtcbn0iLCJpbXBvcnQgeyBtb2RpZmllclBoYXNlcyB9IGZyb20gXCIuLi9lbnVtcy5qc1wiOyAvLyBzb3VyY2U6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ5ODc1MjU1XG5cbmZ1bmN0aW9uIG9yZGVyKG1vZGlmaWVycykge1xuICB2YXIgbWFwID0gbmV3IE1hcCgpO1xuICB2YXIgdmlzaXRlZCA9IG5ldyBTZXQoKTtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBtb2RpZmllcnMuZm9yRWFjaChmdW5jdGlvbiAobW9kaWZpZXIpIHtcbiAgICBtYXAuc2V0KG1vZGlmaWVyLm5hbWUsIG1vZGlmaWVyKTtcbiAgfSk7IC8vIE9uIHZpc2l0aW5nIG9iamVjdCwgY2hlY2sgZm9yIGl0cyBkZXBlbmRlbmNpZXMgYW5kIHZpc2l0IHRoZW0gcmVjdXJzaXZlbHlcblxuICBmdW5jdGlvbiBzb3J0KG1vZGlmaWVyKSB7XG4gICAgdmlzaXRlZC5hZGQobW9kaWZpZXIubmFtZSk7XG4gICAgdmFyIHJlcXVpcmVzID0gW10uY29uY2F0KG1vZGlmaWVyLnJlcXVpcmVzIHx8IFtdLCBtb2RpZmllci5yZXF1aXJlc0lmRXhpc3RzIHx8IFtdKTtcbiAgICByZXF1aXJlcy5mb3JFYWNoKGZ1bmN0aW9uIChkZXApIHtcbiAgICAgIGlmICghdmlzaXRlZC5oYXMoZGVwKSkge1xuICAgICAgICB2YXIgZGVwTW9kaWZpZXIgPSBtYXAuZ2V0KGRlcCk7XG5cbiAgICAgICAgaWYgKGRlcE1vZGlmaWVyKSB7XG4gICAgICAgICAgc29ydChkZXBNb2RpZmllcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXN1bHQucHVzaChtb2RpZmllcik7XG4gIH1cblxuICBtb2RpZmllcnMuZm9yRWFjaChmdW5jdGlvbiAobW9kaWZpZXIpIHtcbiAgICBpZiAoIXZpc2l0ZWQuaGFzKG1vZGlmaWVyLm5hbWUpKSB7XG4gICAgICAvLyBjaGVjayBmb3IgdmlzaXRlZCBvYmplY3RcbiAgICAgIHNvcnQobW9kaWZpZXIpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9yZGVyTW9kaWZpZXJzKG1vZGlmaWVycykge1xuICAvLyBvcmRlciBiYXNlZCBvbiBkZXBlbmRlbmNpZXNcbiAgdmFyIG9yZGVyZWRNb2RpZmllcnMgPSBvcmRlcihtb2RpZmllcnMpOyAvLyBvcmRlciBiYXNlZCBvbiBwaGFzZVxuXG4gIHJldHVybiBtb2RpZmllclBoYXNlcy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgcGhhc2UpIHtcbiAgICByZXR1cm4gYWNjLmNvbmNhdChvcmRlcmVkTW9kaWZpZXJzLmZpbHRlcihmdW5jdGlvbiAobW9kaWZpZXIpIHtcbiAgICAgIHJldHVybiBtb2RpZmllci5waGFzZSA9PT0gcGhhc2U7XG4gICAgfSkpO1xuICB9LCBbXSk7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVjdFRvQ2xpZW50UmVjdChyZWN0KSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCByZWN0LCB7XG4gICAgbGVmdDogcmVjdC54LFxuICAgIHRvcDogcmVjdC55LFxuICAgIHJpZ2h0OiByZWN0LnggKyByZWN0LndpZHRoLFxuICAgIGJvdHRvbTogcmVjdC55ICsgcmVjdC5oZWlnaHRcbiAgfSk7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdW5pcXVlQnkoYXJyLCBmbikge1xuICB2YXIgaWRlbnRpZmllcnMgPSBuZXcgU2V0KCk7XG4gIHJldHVybiBhcnIuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBmbihpdGVtKTtcblxuICAgIGlmICghaWRlbnRpZmllcnMuaGFzKGlkZW50aWZpZXIpKSB7XG4gICAgICBpZGVudGlmaWVycy5hZGQoaWRlbnRpZmllcik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0pO1xufSIsImltcG9ydCBmb3JtYXQgZnJvbSBcIi4vZm9ybWF0LmpzXCI7XG5pbXBvcnQgeyBtb2RpZmllclBoYXNlcyB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xudmFyIElOVkFMSURfTU9ESUZJRVJfRVJST1IgPSAnUG9wcGVyOiBtb2RpZmllciBcIiVzXCIgcHJvdmlkZWQgYW4gaW52YWxpZCAlcyBwcm9wZXJ0eSwgZXhwZWN0ZWQgJXMgYnV0IGdvdCAlcyc7XG52YXIgTUlTU0lOR19ERVBFTkRFTkNZX0VSUk9SID0gJ1BvcHBlcjogbW9kaWZpZXIgXCIlc1wiIHJlcXVpcmVzIFwiJXNcIiwgYnV0IFwiJXNcIiBtb2RpZmllciBpcyBub3QgYXZhaWxhYmxlJztcbnZhciBWQUxJRF9QUk9QRVJUSUVTID0gWyduYW1lJywgJ2VuYWJsZWQnLCAncGhhc2UnLCAnZm4nLCAnZWZmZWN0JywgJ3JlcXVpcmVzJywgJ29wdGlvbnMnXTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHZhbGlkYXRlTW9kaWZpZXJzKG1vZGlmaWVycykge1xuICBtb2RpZmllcnMuZm9yRWFjaChmdW5jdGlvbiAobW9kaWZpZXIpIHtcbiAgICBbXS5jb25jYXQoT2JqZWN0LmtleXMobW9kaWZpZXIpLCBWQUxJRF9QUk9QRVJUSUVTKSAvLyBJRTExLWNvbXBhdGlibGUgcmVwbGFjZW1lbnQgZm9yIGBuZXcgU2V0KGl0ZXJhYmxlKWBcbiAgICAuZmlsdGVyKGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgsIHNlbGYpIHtcbiAgICAgIHJldHVybiBzZWxmLmluZGV4T2YodmFsdWUpID09PSBpbmRleDtcbiAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgIGNhc2UgJ25hbWUnOlxuICAgICAgICAgIGlmICh0eXBlb2YgbW9kaWZpZXIubmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZm9ybWF0KElOVkFMSURfTU9ESUZJRVJfRVJST1IsIFN0cmluZyhtb2RpZmllci5uYW1lKSwgJ1wibmFtZVwiJywgJ1wic3RyaW5nXCInLCBcIlxcXCJcIiArIFN0cmluZyhtb2RpZmllci5uYW1lKSArIFwiXFxcIlwiKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnZW5hYmxlZCc6XG4gICAgICAgICAgaWYgKHR5cGVvZiBtb2RpZmllci5lbmFibGVkICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZm9ybWF0KElOVkFMSURfTU9ESUZJRVJfRVJST1IsIG1vZGlmaWVyLm5hbWUsICdcImVuYWJsZWRcIicsICdcImJvb2xlYW5cIicsIFwiXFxcIlwiICsgU3RyaW5nKG1vZGlmaWVyLmVuYWJsZWQpICsgXCJcXFwiXCIpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdwaGFzZSc6XG4gICAgICAgICAgaWYgKG1vZGlmaWVyUGhhc2VzLmluZGV4T2YobW9kaWZpZXIucGhhc2UpIDwgMCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihmb3JtYXQoSU5WQUxJRF9NT0RJRklFUl9FUlJPUiwgbW9kaWZpZXIubmFtZSwgJ1wicGhhc2VcIicsIFwiZWl0aGVyIFwiICsgbW9kaWZpZXJQaGFzZXMuam9pbignLCAnKSwgXCJcXFwiXCIgKyBTdHJpbmcobW9kaWZpZXIucGhhc2UpICsgXCJcXFwiXCIpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdmbic6XG4gICAgICAgICAgaWYgKHR5cGVvZiBtb2RpZmllci5mbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihmb3JtYXQoSU5WQUxJRF9NT0RJRklFUl9FUlJPUiwgbW9kaWZpZXIubmFtZSwgJ1wiZm5cIicsICdcImZ1bmN0aW9uXCInLCBcIlxcXCJcIiArIFN0cmluZyhtb2RpZmllci5mbikgKyBcIlxcXCJcIikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2VmZmVjdCc6XG4gICAgICAgICAgaWYgKG1vZGlmaWVyLmVmZmVjdCAhPSBudWxsICYmIHR5cGVvZiBtb2RpZmllci5lZmZlY3QgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZm9ybWF0KElOVkFMSURfTU9ESUZJRVJfRVJST1IsIG1vZGlmaWVyLm5hbWUsICdcImVmZmVjdFwiJywgJ1wiZnVuY3Rpb25cIicsIFwiXFxcIlwiICsgU3RyaW5nKG1vZGlmaWVyLmZuKSArIFwiXFxcIlwiKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAncmVxdWlyZXMnOlxuICAgICAgICAgIGlmIChtb2RpZmllci5yZXF1aXJlcyAhPSBudWxsICYmICFBcnJheS5pc0FycmF5KG1vZGlmaWVyLnJlcXVpcmVzKSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihmb3JtYXQoSU5WQUxJRF9NT0RJRklFUl9FUlJPUiwgbW9kaWZpZXIubmFtZSwgJ1wicmVxdWlyZXNcIicsICdcImFycmF5XCInLCBcIlxcXCJcIiArIFN0cmluZyhtb2RpZmllci5yZXF1aXJlcykgKyBcIlxcXCJcIikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ3JlcXVpcmVzSWZFeGlzdHMnOlxuICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShtb2RpZmllci5yZXF1aXJlc0lmRXhpc3RzKSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihmb3JtYXQoSU5WQUxJRF9NT0RJRklFUl9FUlJPUiwgbW9kaWZpZXIubmFtZSwgJ1wicmVxdWlyZXNJZkV4aXN0c1wiJywgJ1wiYXJyYXlcIicsIFwiXFxcIlwiICsgU3RyaW5nKG1vZGlmaWVyLnJlcXVpcmVzSWZFeGlzdHMpICsgXCJcXFwiXCIpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdvcHRpb25zJzpcbiAgICAgICAgY2FzZSAnZGF0YSc6XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiUG9wcGVySlM6IGFuIGludmFsaWQgcHJvcGVydHkgaGFzIGJlZW4gcHJvdmlkZWQgdG8gdGhlIFxcXCJcIiArIG1vZGlmaWVyLm5hbWUgKyBcIlxcXCIgbW9kaWZpZXIsIHZhbGlkIHByb3BlcnRpZXMgYXJlIFwiICsgVkFMSURfUFJPUEVSVElFUy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlxcXCJcIiArIHMgKyBcIlxcXCJcIjtcbiAgICAgICAgICB9KS5qb2luKCcsICcpICsgXCI7IGJ1dCBcXFwiXCIgKyBrZXkgKyBcIlxcXCIgd2FzIHByb3ZpZGVkLlwiKTtcbiAgICAgIH1cblxuICAgICAgbW9kaWZpZXIucmVxdWlyZXMgJiYgbW9kaWZpZXIucmVxdWlyZXMuZm9yRWFjaChmdW5jdGlvbiAocmVxdWlyZW1lbnQpIHtcbiAgICAgICAgaWYgKG1vZGlmaWVycy5maW5kKGZ1bmN0aW9uIChtb2QpIHtcbiAgICAgICAgICByZXR1cm4gbW9kLm5hbWUgPT09IHJlcXVpcmVtZW50O1xuICAgICAgICB9KSA9PSBudWxsKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihmb3JtYXQoTUlTU0lOR19ERVBFTkRFTkNZX0VSUk9SLCBTdHJpbmcobW9kaWZpZXIubmFtZSksIHJlcXVpcmVtZW50LCByZXF1aXJlbWVudCkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59IiwiaW1wb3J0IHsgbWF4IGFzIG1hdGhNYXgsIG1pbiBhcyBtYXRoTWluIH0gZnJvbSBcIi4vbWF0aC5qc1wiO1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhpbihtaW4sIHZhbHVlLCBtYXgpIHtcbiAgcmV0dXJuIG1hdGhNYXgobWluLCBtYXRoTWluKHZhbHVlLCBtYXgpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB3aXRoaW5NYXhDbGFtcChtaW4sIHZhbHVlLCBtYXgpIHtcbiAgdmFyIHYgPSB3aXRoaW4obWluLCB2YWx1ZSwgbWF4KTtcbiAgcmV0dXJuIHYgPiBtYXggPyBtYXggOiB2O1xufSIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEJvb3RzdHJhcCAodjUuMS4zKTogdXRpbC9pbmRleC5qc1xuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmNvbnN0IE1BWF9VSUQgPSAxMDAwMDAwXG5jb25zdCBNSUxMSVNFQ09ORFNfTVVMVElQTElFUiA9IDEwMDBcbmNvbnN0IFRSQU5TSVRJT05fRU5EID0gJ3RyYW5zaXRpb25lbmQnXG5cbi8vIFNob3V0b3V0IEFuZ3VzQ3JvbGwgKGh0dHBzOi8vZ29vLmdsL3B4d1FHcClcbmNvbnN0IHRvVHlwZSA9IG9iaiA9PiB7XG4gIGlmIChvYmogPT09IG51bGwgfHwgb2JqID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gYCR7b2JqfWBcbiAgfVxuXG4gIHJldHVybiB7fS50b1N0cmluZy5jYWxsKG9iaikubWF0Y2goL1xccyhbYS16XSspL2kpWzFdLnRvTG93ZXJDYXNlKClcbn1cblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogUHVibGljIFV0aWwgQXBpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmNvbnN0IGdldFVJRCA9IHByZWZpeCA9PiB7XG4gIGRvIHtcbiAgICBwcmVmaXggKz0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogTUFYX1VJRClcbiAgfSB3aGlsZSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJlZml4KSlcblxuICByZXR1cm4gcHJlZml4XG59XG5cbmNvbnN0IGdldFNlbGVjdG9yID0gZWxlbWVudCA9PiB7XG4gIGxldCBzZWxlY3RvciA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWJzLXRhcmdldCcpXG5cbiAgaWYgKCFzZWxlY3RvciB8fCBzZWxlY3RvciA9PT0gJyMnKSB7XG4gICAgbGV0IGhyZWZBdHRyID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxuXG4gICAgLy8gVGhlIG9ubHkgdmFsaWQgY29udGVudCB0aGF0IGNvdWxkIGRvdWJsZSBhcyBhIHNlbGVjdG9yIGFyZSBJRHMgb3IgY2xhc3NlcyxcbiAgICAvLyBzbyBldmVyeXRoaW5nIHN0YXJ0aW5nIHdpdGggYCNgIG9yIGAuYC4gSWYgYSBcInJlYWxcIiBVUkwgaXMgdXNlZCBhcyB0aGUgc2VsZWN0b3IsXG4gICAgLy8gYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JgIHdpbGwgcmlnaHRmdWxseSBjb21wbGFpbiBpdCBpcyBpbnZhbGlkLlxuICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvaXNzdWVzLzMyMjczXG4gICAgaWYgKCFocmVmQXR0ciB8fCAoIWhyZWZBdHRyLmluY2x1ZGVzKCcjJykgJiYgIWhyZWZBdHRyLnN0YXJ0c1dpdGgoJy4nKSkpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgLy8gSnVzdCBpbiBjYXNlIHNvbWUgQ01TIHB1dHMgb3V0IGEgZnVsbCBVUkwgd2l0aCB0aGUgYW5jaG9yIGFwcGVuZGVkXG4gICAgaWYgKGhyZWZBdHRyLmluY2x1ZGVzKCcjJykgJiYgIWhyZWZBdHRyLnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgaHJlZkF0dHIgPSBgIyR7aHJlZkF0dHIuc3BsaXQoJyMnKVsxXX1gXG4gICAgfVxuXG4gICAgc2VsZWN0b3IgPSBocmVmQXR0ciAmJiBocmVmQXR0ciAhPT0gJyMnID8gaHJlZkF0dHIudHJpbSgpIDogbnVsbFxuICB9XG5cbiAgcmV0dXJuIHNlbGVjdG9yXG59XG5cbmNvbnN0IGdldFNlbGVjdG9yRnJvbUVsZW1lbnQgPSBlbGVtZW50ID0+IHtcbiAgY29uc3Qgc2VsZWN0b3IgPSBnZXRTZWxlY3RvcihlbGVtZW50KVxuXG4gIGlmIChzZWxlY3Rvcikge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSA/IHNlbGVjdG9yIDogbnVsbFxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cblxuY29uc3QgZ2V0RWxlbWVudEZyb21TZWxlY3RvciA9IGVsZW1lbnQgPT4ge1xuICBjb25zdCBzZWxlY3RvciA9IGdldFNlbGVjdG9yKGVsZW1lbnQpXG5cbiAgcmV0dXJuIHNlbGVjdG9yID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgOiBudWxsXG59XG5cbmNvbnN0IGdldFRyYW5zaXRpb25EdXJhdGlvbkZyb21FbGVtZW50ID0gZWxlbWVudCA9PiB7XG4gIGlmICghZWxlbWVudCkge1xuICAgIHJldHVybiAwXG4gIH1cblxuICAvLyBHZXQgdHJhbnNpdGlvbi1kdXJhdGlvbiBvZiB0aGUgZWxlbWVudFxuICBsZXQgeyB0cmFuc2l0aW9uRHVyYXRpb24sIHRyYW5zaXRpb25EZWxheSB9ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudClcblxuICBjb25zdCBmbG9hdFRyYW5zaXRpb25EdXJhdGlvbiA9IE51bWJlci5wYXJzZUZsb2F0KHRyYW5zaXRpb25EdXJhdGlvbilcbiAgY29uc3QgZmxvYXRUcmFuc2l0aW9uRGVsYXkgPSBOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRGVsYXkpXG5cbiAgLy8gUmV0dXJuIDAgaWYgZWxlbWVudCBvciB0cmFuc2l0aW9uIGR1cmF0aW9uIGlzIG5vdCBmb3VuZFxuICBpZiAoIWZsb2F0VHJhbnNpdGlvbkR1cmF0aW9uICYmICFmbG9hdFRyYW5zaXRpb25EZWxheSkge1xuICAgIHJldHVybiAwXG4gIH1cblxuICAvLyBJZiBtdWx0aXBsZSBkdXJhdGlvbnMgYXJlIGRlZmluZWQsIHRha2UgdGhlIGZpcnN0XG4gIHRyYW5zaXRpb25EdXJhdGlvbiA9IHRyYW5zaXRpb25EdXJhdGlvbi5zcGxpdCgnLCcpWzBdXG4gIHRyYW5zaXRpb25EZWxheSA9IHRyYW5zaXRpb25EZWxheS5zcGxpdCgnLCcpWzBdXG5cbiAgcmV0dXJuIChOdW1iZXIucGFyc2VGbG9hdCh0cmFuc2l0aW9uRHVyYXRpb24pICsgTnVtYmVyLnBhcnNlRmxvYXQodHJhbnNpdGlvbkRlbGF5KSkgKiBNSUxMSVNFQ09ORFNfTVVMVElQTElFUlxufVxuXG5jb25zdCB0cmlnZ2VyVHJhbnNpdGlvbkVuZCA9IGVsZW1lbnQgPT4ge1xuICBlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFRSQU5TSVRJT05fRU5EKSlcbn1cblxuY29uc3QgaXNFbGVtZW50ID0gb2JqID0+IHtcbiAgaWYgKCFvYmogfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb2JqLmpxdWVyeSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBvYmogPSBvYmpbMF1cbiAgfVxuXG4gIHJldHVybiB0eXBlb2Ygb2JqLm5vZGVUeXBlICE9PSAndW5kZWZpbmVkJ1xufVxuXG5jb25zdCBnZXRFbGVtZW50ID0gb2JqID0+IHtcbiAgaWYgKGlzRWxlbWVudChvYmopKSB7IC8vIGl0J3MgYSBqUXVlcnkgb2JqZWN0IG9yIGEgbm9kZSBlbGVtZW50XG4gICAgcmV0dXJuIG9iai5qcXVlcnkgPyBvYmpbMF0gOiBvYmpcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb2JqID09PSAnc3RyaW5nJyAmJiBvYmoubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG9iailcbiAgfVxuXG4gIHJldHVybiBudWxsXG59XG5cbmNvbnN0IHR5cGVDaGVja0NvbmZpZyA9IChjb21wb25lbnROYW1lLCBjb25maWcsIGNvbmZpZ1R5cGVzKSA9PiB7XG4gIE9iamVjdC5rZXlzKGNvbmZpZ1R5cGVzKS5mb3JFYWNoKHByb3BlcnR5ID0+IHtcbiAgICBjb25zdCBleHBlY3RlZFR5cGVzID0gY29uZmlnVHlwZXNbcHJvcGVydHldXG4gICAgY29uc3QgdmFsdWUgPSBjb25maWdbcHJvcGVydHldXG4gICAgY29uc3QgdmFsdWVUeXBlID0gdmFsdWUgJiYgaXNFbGVtZW50KHZhbHVlKSA/ICdlbGVtZW50JyA6IHRvVHlwZSh2YWx1ZSlcblxuICAgIGlmICghbmV3IFJlZ0V4cChleHBlY3RlZFR5cGVzKS50ZXN0KHZhbHVlVHlwZSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgIGAke2NvbXBvbmVudE5hbWUudG9VcHBlckNhc2UoKX06IE9wdGlvbiBcIiR7cHJvcGVydHl9XCIgcHJvdmlkZWQgdHlwZSBcIiR7dmFsdWVUeXBlfVwiIGJ1dCBleHBlY3RlZCB0eXBlIFwiJHtleHBlY3RlZFR5cGVzfVwiLmBcbiAgICAgIClcbiAgICB9XG4gIH0pXG59XG5cbmNvbnN0IGlzVmlzaWJsZSA9IGVsZW1lbnQgPT4ge1xuICBpZiAoIWlzRWxlbWVudChlbGVtZW50KSB8fCBlbGVtZW50LmdldENsaWVudFJlY3RzKCkubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCd2aXNpYmlsaXR5JykgPT09ICd2aXNpYmxlJ1xufVxuXG5jb25zdCBpc0Rpc2FibGVkID0gZWxlbWVudCA9PiB7XG4gIGlmICghZWxlbWVudCB8fCBlbGVtZW50Lm5vZGVUeXBlICE9PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2Rpc2FibGVkJykpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgaWYgKHR5cGVvZiBlbGVtZW50LmRpc2FibGVkICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBlbGVtZW50LmRpc2FibGVkXG4gIH1cblxuICByZXR1cm4gZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJykgIT09ICdmYWxzZSdcbn1cblxuY29uc3QgZmluZFNoYWRvd1Jvb3QgPSBlbGVtZW50ID0+IHtcbiAgaWYgKCFkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXR0YWNoU2hhZG93KSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIC8vIENhbiBmaW5kIHRoZSBzaGFkb3cgcm9vdCBvdGhlcndpc2UgaXQnbGwgcmV0dXJuIHRoZSBkb2N1bWVudFxuICBpZiAodHlwZW9mIGVsZW1lbnQuZ2V0Um9vdE5vZGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjb25zdCByb290ID0gZWxlbWVudC5nZXRSb290Tm9kZSgpXG4gICAgcmV0dXJuIHJvb3QgaW5zdGFuY2VvZiBTaGFkb3dSb290ID8gcm9vdCA6IG51bGxcbiAgfVxuXG4gIGlmIChlbGVtZW50IGluc3RhbmNlb2YgU2hhZG93Um9vdCkge1xuICAgIHJldHVybiBlbGVtZW50XG4gIH1cblxuICAvLyB3aGVuIHdlIGRvbid0IGZpbmQgYSBzaGFkb3cgcm9vdFxuICBpZiAoIWVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICByZXR1cm4gZmluZFNoYWRvd1Jvb3QoZWxlbWVudC5wYXJlbnROb2RlKVxufVxuXG5jb25zdCBub29wID0gKCkgPT4ge31cblxuLyoqXG4gKiBUcmljayB0byByZXN0YXJ0IGFuIGVsZW1lbnQncyBhbmltYXRpb25cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKiBAcmV0dXJuIHZvaWRcbiAqXG4gKiBAc2VlIGh0dHBzOi8vd3d3LmNoYXJpc3RoZW8uaW8vYmxvZy8yMDIxLzAyL3Jlc3RhcnQtYS1jc3MtYW5pbWF0aW9uLXdpdGgtamF2YXNjcmlwdC8jcmVzdGFydGluZy1hLWNzcy1hbmltYXRpb25cbiAqL1xuY29uc3QgcmVmbG93ID0gZWxlbWVudCA9PiB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcbiAgZWxlbWVudC5vZmZzZXRIZWlnaHRcbn1cblxuY29uc3QgZ2V0alF1ZXJ5ID0gKCkgPT4ge1xuICBjb25zdCB7IGpRdWVyeSB9ID0gd2luZG93XG5cbiAgaWYgKGpRdWVyeSAmJiAhZG9jdW1lbnQuYm9keS5oYXNBdHRyaWJ1dGUoJ2RhdGEtYnMtbm8tanF1ZXJ5JykpIHtcbiAgICByZXR1cm4galF1ZXJ5XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG5jb25zdCBET01Db250ZW50TG9hZGVkQ2FsbGJhY2tzID0gW11cblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkID0gY2FsbGJhY2sgPT4ge1xuICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2xvYWRpbmcnKSB7XG4gICAgLy8gYWRkIGxpc3RlbmVyIG9uIHRoZSBmaXJzdCBjYWxsIHdoZW4gdGhlIGRvY3VtZW50IGlzIGluIGxvYWRpbmcgc3RhdGVcbiAgICBpZiAoIURPTUNvbnRlbnRMb2FkZWRDYWxsYmFja3MubGVuZ3RoKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgICAgICBET01Db250ZW50TG9hZGVkQ2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2soKSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgRE9NQ29udGVudExvYWRlZENhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKVxuICB9IGVsc2Uge1xuICAgIGNhbGxiYWNrKClcbiAgfVxufVxuXG5jb25zdCBpc1JUTCA9ICgpID0+IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5kaXIgPT09ICdydGwnXG5cbmNvbnN0IGRlZmluZUpRdWVyeVBsdWdpbiA9IHBsdWdpbiA9PiB7XG4gIG9uRE9NQ29udGVudExvYWRlZCgoKSA9PiB7XG4gICAgY29uc3QgJCA9IGdldGpRdWVyeSgpXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCQpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBwbHVnaW4uTkFNRVxuICAgICAgY29uc3QgSlFVRVJZX05PX0NPTkZMSUNUID0gJC5mbltuYW1lXVxuICAgICAgJC5mbltuYW1lXSA9IHBsdWdpbi5qUXVlcnlJbnRlcmZhY2VcbiAgICAgICQuZm5bbmFtZV0uQ29uc3RydWN0b3IgPSBwbHVnaW5cbiAgICAgICQuZm5bbmFtZV0ubm9Db25mbGljdCA9ICgpID0+IHtcbiAgICAgICAgJC5mbltuYW1lXSA9IEpRVUVSWV9OT19DT05GTElDVFxuICAgICAgICByZXR1cm4gcGx1Z2luLmpRdWVyeUludGVyZmFjZVxuICAgICAgfVxuICAgIH1cbiAgfSlcbn1cblxuY29uc3QgZXhlY3V0ZSA9IGNhbGxiYWNrID0+IHtcbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrKClcbiAgfVxufVxuXG5jb25zdCBleGVjdXRlQWZ0ZXJUcmFuc2l0aW9uID0gKGNhbGxiYWNrLCB0cmFuc2l0aW9uRWxlbWVudCwgd2FpdEZvclRyYW5zaXRpb24gPSB0cnVlKSA9PiB7XG4gIGlmICghd2FpdEZvclRyYW5zaXRpb24pIHtcbiAgICBleGVjdXRlKGNhbGxiYWNrKVxuICAgIHJldHVyblxuICB9XG5cbiAgY29uc3QgZHVyYXRpb25QYWRkaW5nID0gNVxuICBjb25zdCBlbXVsYXRlZER1cmF0aW9uID0gZ2V0VHJhbnNpdGlvbkR1cmF0aW9uRnJvbUVsZW1lbnQodHJhbnNpdGlvbkVsZW1lbnQpICsgZHVyYXRpb25QYWRkaW5nXG5cbiAgbGV0IGNhbGxlZCA9IGZhbHNlXG5cbiAgY29uc3QgaGFuZGxlciA9ICh7IHRhcmdldCB9KSA9PiB7XG4gICAgaWYgKHRhcmdldCAhPT0gdHJhbnNpdGlvbkVsZW1lbnQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNhbGxlZCA9IHRydWVcbiAgICB0cmFuc2l0aW9uRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFRSQU5TSVRJT05fRU5ELCBoYW5kbGVyKVxuICAgIGV4ZWN1dGUoY2FsbGJhY2spXG4gIH1cblxuICB0cmFuc2l0aW9uRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFRSQU5TSVRJT05fRU5ELCBoYW5kbGVyKVxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBpZiAoIWNhbGxlZCkge1xuICAgICAgdHJpZ2dlclRyYW5zaXRpb25FbmQodHJhbnNpdGlvbkVsZW1lbnQpXG4gICAgfVxuICB9LCBlbXVsYXRlZER1cmF0aW9uKVxufVxuXG4vKipcbiAqIFJldHVybiB0aGUgcHJldmlvdXMvbmV4dCBlbGVtZW50IG9mIGEgbGlzdC5cbiAqXG4gKiBAcGFyYW0ge2FycmF5fSBsaXN0ICAgIFRoZSBsaXN0IG9mIGVsZW1lbnRzXG4gKiBAcGFyYW0gYWN0aXZlRWxlbWVudCAgIFRoZSBhY3RpdmUgZWxlbWVudFxuICogQHBhcmFtIHNob3VsZEdldE5leHQgICBDaG9vc2UgdG8gZ2V0IG5leHQgb3IgcHJldmlvdXMgZWxlbWVudFxuICogQHBhcmFtIGlzQ3ljbGVBbGxvd2VkXG4gKiBAcmV0dXJuIHtFbGVtZW50fGVsZW19IFRoZSBwcm9wZXIgZWxlbWVudFxuICovXG5jb25zdCBnZXROZXh0QWN0aXZlRWxlbWVudCA9IChsaXN0LCBhY3RpdmVFbGVtZW50LCBzaG91bGRHZXROZXh0LCBpc0N5Y2xlQWxsb3dlZCkgPT4ge1xuICBsZXQgaW5kZXggPSBsaXN0LmluZGV4T2YoYWN0aXZlRWxlbWVudClcblxuICAvLyBpZiB0aGUgZWxlbWVudCBkb2VzIG5vdCBleGlzdCBpbiB0aGUgbGlzdCByZXR1cm4gYW4gZWxlbWVudCBkZXBlbmRpbmcgb24gdGhlIGRpcmVjdGlvbiBhbmQgaWYgY3ljbGUgaXMgYWxsb3dlZFxuICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgcmV0dXJuIGxpc3RbIXNob3VsZEdldE5leHQgJiYgaXNDeWNsZUFsbG93ZWQgPyBsaXN0Lmxlbmd0aCAtIDEgOiAwXVxuICB9XG5cbiAgY29uc3QgbGlzdExlbmd0aCA9IGxpc3QubGVuZ3RoXG5cbiAgaW5kZXggKz0gc2hvdWxkR2V0TmV4dCA/IDEgOiAtMVxuXG4gIGlmIChpc0N5Y2xlQWxsb3dlZCkge1xuICAgIGluZGV4ID0gKGluZGV4ICsgbGlzdExlbmd0aCkgJSBsaXN0TGVuZ3RoXG4gIH1cblxuICByZXR1cm4gbGlzdFtNYXRoLm1heCgwLCBNYXRoLm1pbihpbmRleCwgbGlzdExlbmd0aCAtIDEpKV1cbn1cblxuZXhwb3J0IHtcbiAgZ2V0RWxlbWVudCxcbiAgZ2V0VUlELFxuICBnZXRTZWxlY3RvckZyb21FbGVtZW50LFxuICBnZXRFbGVtZW50RnJvbVNlbGVjdG9yLFxuICBnZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCxcbiAgdHJpZ2dlclRyYW5zaXRpb25FbmQsXG4gIGlzRWxlbWVudCxcbiAgdHlwZUNoZWNrQ29uZmlnLFxuICBpc1Zpc2libGUsXG4gIGlzRGlzYWJsZWQsXG4gIGZpbmRTaGFkb3dSb290LFxuICBub29wLFxuICBnZXROZXh0QWN0aXZlRWxlbWVudCxcbiAgcmVmbG93LFxuICBnZXRqUXVlcnksXG4gIG9uRE9NQ29udGVudExvYWRlZCxcbiAgaXNSVEwsXG4gIGRlZmluZUpRdWVyeVBsdWdpbixcbiAgZXhlY3V0ZSxcbiAgZXhlY3V0ZUFmdGVyVHJhbnNpdGlvblxufVxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQm9vdHN0cmFwICh2NS4xLjMpOiBkb20vZXZlbnQtaGFuZGxlci5qc1xuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmltcG9ydCB7IGdldGpRdWVyeSB9IGZyb20gJy4uL3V0aWwvaW5kZXgnXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBDb25zdGFudHNcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmNvbnN0IG5hbWVzcGFjZVJlZ2V4ID0gL1teLl0qKD89XFwuLiopXFwufC4qL1xuY29uc3Qgc3RyaXBOYW1lUmVnZXggPSAvXFwuLiovXG5jb25zdCBzdHJpcFVpZFJlZ2V4ID0gLzo6XFxkKyQvXG5jb25zdCBldmVudFJlZ2lzdHJ5ID0ge30gLy8gRXZlbnRzIHN0b3JhZ2VcbmxldCB1aWRFdmVudCA9IDFcbmNvbnN0IGN1c3RvbUV2ZW50cyA9IHtcbiAgbW91c2VlbnRlcjogJ21vdXNlb3ZlcicsXG4gIG1vdXNlbGVhdmU6ICdtb3VzZW91dCdcbn1cbmNvbnN0IGN1c3RvbUV2ZW50c1JlZ2V4ID0gL14obW91c2VlbnRlcnxtb3VzZWxlYXZlKS9pXG5jb25zdCBuYXRpdmVFdmVudHMgPSBuZXcgU2V0KFtcbiAgJ2NsaWNrJyxcbiAgJ2RibGNsaWNrJyxcbiAgJ21vdXNldXAnLFxuICAnbW91c2Vkb3duJyxcbiAgJ2NvbnRleHRtZW51JyxcbiAgJ21vdXNld2hlZWwnLFxuICAnRE9NTW91c2VTY3JvbGwnLFxuICAnbW91c2VvdmVyJyxcbiAgJ21vdXNlb3V0JyxcbiAgJ21vdXNlbW92ZScsXG4gICdzZWxlY3RzdGFydCcsXG4gICdzZWxlY3RlbmQnLFxuICAna2V5ZG93bicsXG4gICdrZXlwcmVzcycsXG4gICdrZXl1cCcsXG4gICdvcmllbnRhdGlvbmNoYW5nZScsXG4gICd0b3VjaHN0YXJ0JyxcbiAgJ3RvdWNobW92ZScsXG4gICd0b3VjaGVuZCcsXG4gICd0b3VjaGNhbmNlbCcsXG4gICdwb2ludGVyZG93bicsXG4gICdwb2ludGVybW92ZScsXG4gICdwb2ludGVydXAnLFxuICAncG9pbnRlcmxlYXZlJyxcbiAgJ3BvaW50ZXJjYW5jZWwnLFxuICAnZ2VzdHVyZXN0YXJ0JyxcbiAgJ2dlc3R1cmVjaGFuZ2UnLFxuICAnZ2VzdHVyZWVuZCcsXG4gICdmb2N1cycsXG4gICdibHVyJyxcbiAgJ2NoYW5nZScsXG4gICdyZXNldCcsXG4gICdzZWxlY3QnLFxuICAnc3VibWl0JyxcbiAgJ2ZvY3VzaW4nLFxuICAnZm9jdXNvdXQnLFxuICAnbG9hZCcsXG4gICd1bmxvYWQnLFxuICAnYmVmb3JldW5sb2FkJyxcbiAgJ3Jlc2l6ZScsXG4gICdtb3ZlJyxcbiAgJ0RPTUNvbnRlbnRMb2FkZWQnLFxuICAncmVhZHlzdGF0ZWNoYW5nZScsXG4gICdlcnJvcicsXG4gICdhYm9ydCcsXG4gICdzY3JvbGwnXG5dKVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogUHJpdmF0ZSBtZXRob2RzXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5mdW5jdGlvbiBnZXRVaWRFdmVudChlbGVtZW50LCB1aWQpIHtcbiAgcmV0dXJuICh1aWQgJiYgYCR7dWlkfTo6JHt1aWRFdmVudCsrfWApIHx8IGVsZW1lbnQudWlkRXZlbnQgfHwgdWlkRXZlbnQrK1xufVxuXG5mdW5jdGlvbiBnZXRFdmVudChlbGVtZW50KSB7XG4gIGNvbnN0IHVpZCA9IGdldFVpZEV2ZW50KGVsZW1lbnQpXG5cbiAgZWxlbWVudC51aWRFdmVudCA9IHVpZFxuICBldmVudFJlZ2lzdHJ5W3VpZF0gPSBldmVudFJlZ2lzdHJ5W3VpZF0gfHwge31cblxuICByZXR1cm4gZXZlbnRSZWdpc3RyeVt1aWRdXG59XG5cbmZ1bmN0aW9uIGJvb3RzdHJhcEhhbmRsZXIoZWxlbWVudCwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQpIHtcbiAgICBldmVudC5kZWxlZ2F0ZVRhcmdldCA9IGVsZW1lbnRcblxuICAgIGlmIChoYW5kbGVyLm9uZU9mZikge1xuICAgICAgRXZlbnRIYW5kbGVyLm9mZihlbGVtZW50LCBldmVudC50eXBlLCBmbilcbiAgICB9XG5cbiAgICByZXR1cm4gZm4uYXBwbHkoZWxlbWVudCwgW2V2ZW50XSlcbiAgfVxufVxuXG5mdW5jdGlvbiBib290c3RyYXBEZWxlZ2F0aW9uSGFuZGxlcihlbGVtZW50LCBzZWxlY3RvciwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQpIHtcbiAgICBjb25zdCBkb21FbGVtZW50cyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcilcblxuICAgIGZvciAobGV0IHsgdGFyZ2V0IH0gPSBldmVudDsgdGFyZ2V0ICYmIHRhcmdldCAhPT0gdGhpczsgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGUpIHtcbiAgICAgIGZvciAobGV0IGkgPSBkb21FbGVtZW50cy5sZW5ndGg7IGktLTspIHtcbiAgICAgICAgaWYgKGRvbUVsZW1lbnRzW2ldID09PSB0YXJnZXQpIHtcbiAgICAgICAgICBldmVudC5kZWxlZ2F0ZVRhcmdldCA9IHRhcmdldFxuXG4gICAgICAgICAgaWYgKGhhbmRsZXIub25lT2ZmKSB7XG4gICAgICAgICAgICBFdmVudEhhbmRsZXIub2ZmKGVsZW1lbnQsIGV2ZW50LnR5cGUsIHNlbGVjdG9yLCBmbilcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGFyZ2V0LCBbZXZlbnRdKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVG8gcGxlYXNlIEVTTGludFxuICAgIHJldHVybiBudWxsXG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZEhhbmRsZXIoZXZlbnRzLCBoYW5kbGVyLCBkZWxlZ2F0aW9uU2VsZWN0b3IgPSBudWxsKSB7XG4gIGNvbnN0IHVpZEV2ZW50TGlzdCA9IE9iamVjdC5rZXlzKGV2ZW50cylcblxuICBmb3IgKGxldCBpID0gMCwgbGVuID0gdWlkRXZlbnRMaXN0Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgY29uc3QgZXZlbnQgPSBldmVudHNbdWlkRXZlbnRMaXN0W2ldXVxuXG4gICAgaWYgKGV2ZW50Lm9yaWdpbmFsSGFuZGxlciA9PT0gaGFuZGxlciAmJiBldmVudC5kZWxlZ2F0aW9uU2VsZWN0b3IgPT09IGRlbGVnYXRpb25TZWxlY3Rvcikge1xuICAgICAgcmV0dXJuIGV2ZW50XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplUGFyYW1zKG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRm4pIHtcbiAgY29uc3QgZGVsZWdhdGlvbiA9IHR5cGVvZiBoYW5kbGVyID09PSAnc3RyaW5nJ1xuICBjb25zdCBvcmlnaW5hbEhhbmRsZXIgPSBkZWxlZ2F0aW9uID8gZGVsZWdhdGlvbkZuIDogaGFuZGxlclxuXG4gIGxldCB0eXBlRXZlbnQgPSBnZXRUeXBlRXZlbnQob3JpZ2luYWxUeXBlRXZlbnQpXG4gIGNvbnN0IGlzTmF0aXZlID0gbmF0aXZlRXZlbnRzLmhhcyh0eXBlRXZlbnQpXG5cbiAgaWYgKCFpc05hdGl2ZSkge1xuICAgIHR5cGVFdmVudCA9IG9yaWdpbmFsVHlwZUV2ZW50XG4gIH1cblxuICByZXR1cm4gW2RlbGVnYXRpb24sIG9yaWdpbmFsSGFuZGxlciwgdHlwZUV2ZW50XVxufVxuXG5mdW5jdGlvbiBhZGRIYW5kbGVyKGVsZW1lbnQsIG9yaWdpbmFsVHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRm4sIG9uZU9mZikge1xuICBpZiAodHlwZW9mIG9yaWdpbmFsVHlwZUV2ZW50ICE9PSAnc3RyaW5nJyB8fCAhZWxlbWVudCkge1xuICAgIHJldHVyblxuICB9XG5cbiAgaWYgKCFoYW5kbGVyKSB7XG4gICAgaGFuZGxlciA9IGRlbGVnYXRpb25GblxuICAgIGRlbGVnYXRpb25GbiA9IG51bGxcbiAgfVxuXG4gIC8vIGluIGNhc2Ugb2YgbW91c2VlbnRlciBvciBtb3VzZWxlYXZlIHdyYXAgdGhlIGhhbmRsZXIgd2l0aGluIGEgZnVuY3Rpb24gdGhhdCBjaGVja3MgZm9yIGl0cyBET00gcG9zaXRpb25cbiAgLy8gdGhpcyBwcmV2ZW50cyB0aGUgaGFuZGxlciBmcm9tIGJlaW5nIGRpc3BhdGNoZWQgdGhlIHNhbWUgd2F5IGFzIG1vdXNlb3ZlciBvciBtb3VzZW91dCBkb2VzXG4gIGlmIChjdXN0b21FdmVudHNSZWdleC50ZXN0KG9yaWdpbmFsVHlwZUV2ZW50KSkge1xuICAgIGNvbnN0IHdyYXBGbiA9IGZuID0+IHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKCFldmVudC5yZWxhdGVkVGFyZ2V0IHx8IChldmVudC5yZWxhdGVkVGFyZ2V0ICE9PSBldmVudC5kZWxlZ2F0ZVRhcmdldCAmJiAhZXZlbnQuZGVsZWdhdGVUYXJnZXQuY29udGFpbnMoZXZlbnQucmVsYXRlZFRhcmdldCkpKSB7XG4gICAgICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgZXZlbnQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGVsZWdhdGlvbkZuKSB7XG4gICAgICBkZWxlZ2F0aW9uRm4gPSB3cmFwRm4oZGVsZWdhdGlvbkZuKVxuICAgIH0gZWxzZSB7XG4gICAgICBoYW5kbGVyID0gd3JhcEZuKGhhbmRsZXIpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgW2RlbGVnYXRpb24sIG9yaWdpbmFsSGFuZGxlciwgdHlwZUV2ZW50XSA9IG5vcm1hbGl6ZVBhcmFtcyhvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZuKVxuICBjb25zdCBldmVudHMgPSBnZXRFdmVudChlbGVtZW50KVxuICBjb25zdCBoYW5kbGVycyA9IGV2ZW50c1t0eXBlRXZlbnRdIHx8IChldmVudHNbdHlwZUV2ZW50XSA9IHt9KVxuICBjb25zdCBwcmV2aW91c0ZuID0gZmluZEhhbmRsZXIoaGFuZGxlcnMsIG9yaWdpbmFsSGFuZGxlciwgZGVsZWdhdGlvbiA/IGhhbmRsZXIgOiBudWxsKVxuXG4gIGlmIChwcmV2aW91c0ZuKSB7XG4gICAgcHJldmlvdXNGbi5vbmVPZmYgPSBwcmV2aW91c0ZuLm9uZU9mZiAmJiBvbmVPZmZcblxuICAgIHJldHVyblxuICB9XG5cbiAgY29uc3QgdWlkID0gZ2V0VWlkRXZlbnQob3JpZ2luYWxIYW5kbGVyLCBvcmlnaW5hbFR5cGVFdmVudC5yZXBsYWNlKG5hbWVzcGFjZVJlZ2V4LCAnJykpXG4gIGNvbnN0IGZuID0gZGVsZWdhdGlvbiA/XG4gICAgYm9vdHN0cmFwRGVsZWdhdGlvbkhhbmRsZXIoZWxlbWVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZuKSA6XG4gICAgYm9vdHN0cmFwSGFuZGxlcihlbGVtZW50LCBoYW5kbGVyKVxuXG4gIGZuLmRlbGVnYXRpb25TZWxlY3RvciA9IGRlbGVnYXRpb24gPyBoYW5kbGVyIDogbnVsbFxuICBmbi5vcmlnaW5hbEhhbmRsZXIgPSBvcmlnaW5hbEhhbmRsZXJcbiAgZm4ub25lT2ZmID0gb25lT2ZmXG4gIGZuLnVpZEV2ZW50ID0gdWlkXG4gIGhhbmRsZXJzW3VpZF0gPSBmblxuXG4gIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlRXZlbnQsIGZuLCBkZWxlZ2F0aW9uKVxufVxuXG5mdW5jdGlvbiByZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uU2VsZWN0b3IpIHtcbiAgY29uc3QgZm4gPSBmaW5kSGFuZGxlcihldmVudHNbdHlwZUV2ZW50XSwgaGFuZGxlciwgZGVsZWdhdGlvblNlbGVjdG9yKVxuXG4gIGlmICghZm4pIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlRXZlbnQsIGZuLCBCb29sZWFuKGRlbGVnYXRpb25TZWxlY3RvcikpXG4gIGRlbGV0ZSBldmVudHNbdHlwZUV2ZW50XVtmbi51aWRFdmVudF1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlTmFtZXNwYWNlZEhhbmRsZXJzKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBuYW1lc3BhY2UpIHtcbiAgY29uc3Qgc3RvcmVFbGVtZW50RXZlbnQgPSBldmVudHNbdHlwZUV2ZW50XSB8fCB7fVxuXG4gIE9iamVjdC5rZXlzKHN0b3JlRWxlbWVudEV2ZW50KS5mb3JFYWNoKGhhbmRsZXJLZXkgPT4ge1xuICAgIGlmIChoYW5kbGVyS2V5LmluY2x1ZGVzKG5hbWVzcGFjZSkpIHtcbiAgICAgIGNvbnN0IGV2ZW50ID0gc3RvcmVFbGVtZW50RXZlbnRbaGFuZGxlcktleV1cblxuICAgICAgcmVtb3ZlSGFuZGxlcihlbGVtZW50LCBldmVudHMsIHR5cGVFdmVudCwgZXZlbnQub3JpZ2luYWxIYW5kbGVyLCBldmVudC5kZWxlZ2F0aW9uU2VsZWN0b3IpXG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiBnZXRUeXBlRXZlbnQoZXZlbnQpIHtcbiAgLy8gYWxsb3cgdG8gZ2V0IHRoZSBuYXRpdmUgZXZlbnRzIGZyb20gbmFtZXNwYWNlZCBldmVudHMgKCdjbGljay5icy5idXR0b24nIC0tPiAnY2xpY2snKVxuICBldmVudCA9IGV2ZW50LnJlcGxhY2Uoc3RyaXBOYW1lUmVnZXgsICcnKVxuICByZXR1cm4gY3VzdG9tRXZlbnRzW2V2ZW50XSB8fCBldmVudFxufVxuXG5jb25zdCBFdmVudEhhbmRsZXIgPSB7XG4gIG9uKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRm4pIHtcbiAgICBhZGRIYW5kbGVyKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyLCBkZWxlZ2F0aW9uRm4sIGZhbHNlKVxuICB9LFxuXG4gIG9uZShlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZuKSB7XG4gICAgYWRkSGFuZGxlcihlbGVtZW50LCBldmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZuLCB0cnVlKVxuICB9LFxuXG4gIG9mZihlbGVtZW50LCBvcmlnaW5hbFR5cGVFdmVudCwgaGFuZGxlciwgZGVsZWdhdGlvbkZuKSB7XG4gICAgaWYgKHR5cGVvZiBvcmlnaW5hbFR5cGVFdmVudCAhPT0gJ3N0cmluZycgfHwgIWVsZW1lbnQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IFtkZWxlZ2F0aW9uLCBvcmlnaW5hbEhhbmRsZXIsIHR5cGVFdmVudF0gPSBub3JtYWxpemVQYXJhbXMob3JpZ2luYWxUeXBlRXZlbnQsIGhhbmRsZXIsIGRlbGVnYXRpb25GbilcbiAgICBjb25zdCBpbk5hbWVzcGFjZSA9IHR5cGVFdmVudCAhPT0gb3JpZ2luYWxUeXBlRXZlbnRcbiAgICBjb25zdCBldmVudHMgPSBnZXRFdmVudChlbGVtZW50KVxuICAgIGNvbnN0IGlzTmFtZXNwYWNlID0gb3JpZ2luYWxUeXBlRXZlbnQuc3RhcnRzV2l0aCgnLicpXG5cbiAgICBpZiAodHlwZW9mIG9yaWdpbmFsSGFuZGxlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIC8vIFNpbXBsZXN0IGNhc2U6IGhhbmRsZXIgaXMgcGFzc2VkLCByZW1vdmUgdGhhdCBsaXN0ZW5lciBPTkxZLlxuICAgICAgaWYgKCFldmVudHMgfHwgIWV2ZW50c1t0eXBlRXZlbnRdKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICByZW1vdmVIYW5kbGVyKGVsZW1lbnQsIGV2ZW50cywgdHlwZUV2ZW50LCBvcmlnaW5hbEhhbmRsZXIsIGRlbGVnYXRpb24gPyBoYW5kbGVyIDogbnVsbClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChpc05hbWVzcGFjZSkge1xuICAgICAgT2JqZWN0LmtleXMoZXZlbnRzKS5mb3JFYWNoKGVsZW1lbnRFdmVudCA9PiB7XG4gICAgICAgIHJlbW92ZU5hbWVzcGFjZWRIYW5kbGVycyhlbGVtZW50LCBldmVudHMsIGVsZW1lbnRFdmVudCwgb3JpZ2luYWxUeXBlRXZlbnQuc2xpY2UoMSkpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGNvbnN0IHN0b3JlRWxlbWVudEV2ZW50ID0gZXZlbnRzW3R5cGVFdmVudF0gfHwge31cbiAgICBPYmplY3Qua2V5cyhzdG9yZUVsZW1lbnRFdmVudCkuZm9yRWFjaChrZXlIYW5kbGVycyA9PiB7XG4gICAgICBjb25zdCBoYW5kbGVyS2V5ID0ga2V5SGFuZGxlcnMucmVwbGFjZShzdHJpcFVpZFJlZ2V4LCAnJylcblxuICAgICAgaWYgKCFpbk5hbWVzcGFjZSB8fCBvcmlnaW5hbFR5cGVFdmVudC5pbmNsdWRlcyhoYW5kbGVyS2V5KSkge1xuICAgICAgICBjb25zdCBldmVudCA9IHN0b3JlRWxlbWVudEV2ZW50W2tleUhhbmRsZXJzXVxuXG4gICAgICAgIHJlbW92ZUhhbmRsZXIoZWxlbWVudCwgZXZlbnRzLCB0eXBlRXZlbnQsIGV2ZW50Lm9yaWdpbmFsSGFuZGxlciwgZXZlbnQuZGVsZWdhdGlvblNlbGVjdG9yKVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG5cbiAgdHJpZ2dlcihlbGVtZW50LCBldmVudCwgYXJncykge1xuICAgIGlmICh0eXBlb2YgZXZlbnQgIT09ICdzdHJpbmcnIHx8ICFlbGVtZW50KSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGNvbnN0ICQgPSBnZXRqUXVlcnkoKVxuICAgIGNvbnN0IHR5cGVFdmVudCA9IGdldFR5cGVFdmVudChldmVudClcbiAgICBjb25zdCBpbk5hbWVzcGFjZSA9IGV2ZW50ICE9PSB0eXBlRXZlbnRcbiAgICBjb25zdCBpc05hdGl2ZSA9IG5hdGl2ZUV2ZW50cy5oYXModHlwZUV2ZW50KVxuXG4gICAgbGV0IGpRdWVyeUV2ZW50XG4gICAgbGV0IGJ1YmJsZXMgPSB0cnVlXG4gICAgbGV0IG5hdGl2ZURpc3BhdGNoID0gdHJ1ZVxuICAgIGxldCBkZWZhdWx0UHJldmVudGVkID0gZmFsc2VcbiAgICBsZXQgZXZ0ID0gbnVsbFxuXG4gICAgaWYgKGluTmFtZXNwYWNlICYmICQpIHtcbiAgICAgIGpRdWVyeUV2ZW50ID0gJC5FdmVudChldmVudCwgYXJncylcblxuICAgICAgJChlbGVtZW50KS50cmlnZ2VyKGpRdWVyeUV2ZW50KVxuICAgICAgYnViYmxlcyA9ICFqUXVlcnlFdmVudC5pc1Byb3BhZ2F0aW9uU3RvcHBlZCgpXG4gICAgICBuYXRpdmVEaXNwYXRjaCA9ICFqUXVlcnlFdmVudC5pc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCgpXG4gICAgICBkZWZhdWx0UHJldmVudGVkID0galF1ZXJ5RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKClcbiAgICB9XG5cbiAgICBpZiAoaXNOYXRpdmUpIHtcbiAgICAgIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJylcbiAgICAgIGV2dC5pbml0RXZlbnQodHlwZUV2ZW50LCBidWJibGVzLCB0cnVlKVxuICAgIH0gZWxzZSB7XG4gICAgICBldnQgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnQsIHtcbiAgICAgICAgYnViYmxlcyxcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyBtZXJnZSBjdXN0b20gaW5mb3JtYXRpb24gaW4gb3VyIGV2ZW50XG4gICAgaWYgKHR5cGVvZiBhcmdzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgT2JqZWN0LmtleXMoYXJncykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXZ0LCBrZXksIHtcbiAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJnc1trZXldXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAoZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICB9XG5cbiAgICBpZiAobmF0aXZlRGlzcGF0Y2gpIHtcbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldnQpXG4gICAgfVxuXG4gICAgaWYgKGV2dC5kZWZhdWx0UHJldmVudGVkICYmIHR5cGVvZiBqUXVlcnlFdmVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGpRdWVyeUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICB9XG5cbiAgICByZXR1cm4gZXZ0XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRIYW5kbGVyXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBCb290c3RyYXAgKHY1LjEuMyk6IGRvbS9kYXRhLmpzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvbnN0YW50c1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuY29uc3QgZWxlbWVudE1hcCA9IG5ldyBNYXAoKVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHNldChlbGVtZW50LCBrZXksIGluc3RhbmNlKSB7XG4gICAgaWYgKCFlbGVtZW50TWFwLmhhcyhlbGVtZW50KSkge1xuICAgICAgZWxlbWVudE1hcC5zZXQoZWxlbWVudCwgbmV3IE1hcCgpKVxuICAgIH1cblxuICAgIGNvbnN0IGluc3RhbmNlTWFwID0gZWxlbWVudE1hcC5nZXQoZWxlbWVudClcblxuICAgIC8vIG1ha2UgaXQgY2xlYXIgd2Ugb25seSB3YW50IG9uZSBpbnN0YW5jZSBwZXIgZWxlbWVudFxuICAgIC8vIGNhbiBiZSByZW1vdmVkIGxhdGVyIHdoZW4gbXVsdGlwbGUga2V5L2luc3RhbmNlcyBhcmUgZmluZSB0byBiZSB1c2VkXG4gICAgaWYgKCFpbnN0YW5jZU1hcC5oYXMoa2V5KSAmJiBpbnN0YW5jZU1hcC5zaXplICE9PSAwKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS5lcnJvcihgQm9vdHN0cmFwIGRvZXNuJ3QgYWxsb3cgbW9yZSB0aGFuIG9uZSBpbnN0YW5jZSBwZXIgZWxlbWVudC4gQm91bmQgaW5zdGFuY2U6ICR7QXJyYXkuZnJvbShpbnN0YW5jZU1hcC5rZXlzKCkpWzBdfS5gKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaW5zdGFuY2VNYXAuc2V0KGtleSwgaW5zdGFuY2UpXG4gIH0sXG5cbiAgZ2V0KGVsZW1lbnQsIGtleSkge1xuICAgIGlmIChlbGVtZW50TWFwLmhhcyhlbGVtZW50KSkge1xuICAgICAgcmV0dXJuIGVsZW1lbnRNYXAuZ2V0KGVsZW1lbnQpLmdldChrZXkpIHx8IG51bGxcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbFxuICB9LFxuXG4gIHJlbW92ZShlbGVtZW50LCBrZXkpIHtcbiAgICBpZiAoIWVsZW1lbnRNYXAuaGFzKGVsZW1lbnQpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBpbnN0YW5jZU1hcCA9IGVsZW1lbnRNYXAuZ2V0KGVsZW1lbnQpXG5cbiAgICBpbnN0YW5jZU1hcC5kZWxldGUoa2V5KVxuXG4gICAgLy8gZnJlZSB1cCBlbGVtZW50IHJlZmVyZW5jZXMgaWYgdGhlcmUgYXJlIG5vIGluc3RhbmNlcyBsZWZ0IGZvciBhbiBlbGVtZW50XG4gICAgaWYgKGluc3RhbmNlTWFwLnNpemUgPT09IDApIHtcbiAgICAgIGVsZW1lbnRNYXAuZGVsZXRlKGVsZW1lbnQpXG4gICAgfVxuICB9XG59XG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBCb290c3RyYXAgKHY1LjEuMyk6IGJhc2UtY29tcG9uZW50LmpzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuaW1wb3J0IERhdGEgZnJvbSAnLi9kb20vZGF0YSdcbmltcG9ydCB7XG4gIGV4ZWN1dGVBZnRlclRyYW5zaXRpb24sXG4gIGdldEVsZW1lbnRcbn0gZnJvbSAnLi91dGlsL2luZGV4J1xuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tICcuL2RvbS9ldmVudC1oYW5kbGVyJ1xuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQ29uc3RhbnRzXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5jb25zdCBWRVJTSU9OID0gJzUuMS4zJ1xuXG5jbGFzcyBCYXNlQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoZWxlbWVudCkge1xuICAgIGVsZW1lbnQgPSBnZXRFbGVtZW50KGVsZW1lbnQpXG5cbiAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50XG4gICAgRGF0YS5zZXQodGhpcy5fZWxlbWVudCwgdGhpcy5jb25zdHJ1Y3Rvci5EQVRBX0tFWSwgdGhpcylcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgRGF0YS5yZW1vdmUodGhpcy5fZWxlbWVudCwgdGhpcy5jb25zdHJ1Y3Rvci5EQVRBX0tFWSlcbiAgICBFdmVudEhhbmRsZXIub2ZmKHRoaXMuX2VsZW1lbnQsIHRoaXMuY29uc3RydWN0b3IuRVZFTlRfS0VZKVxuXG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcykuZm9yRWFjaChwcm9wZXJ0eU5hbWUgPT4ge1xuICAgICAgdGhpc1twcm9wZXJ0eU5hbWVdID0gbnVsbFxuICAgIH0pXG4gIH1cblxuICBfcXVldWVDYWxsYmFjayhjYWxsYmFjaywgZWxlbWVudCwgaXNBbmltYXRlZCA9IHRydWUpIHtcbiAgICBleGVjdXRlQWZ0ZXJUcmFuc2l0aW9uKGNhbGxiYWNrLCBlbGVtZW50LCBpc0FuaW1hdGVkKVxuICB9XG5cbiAgLyoqIFN0YXRpYyAqL1xuXG4gIHN0YXRpYyBnZXRJbnN0YW5jZShlbGVtZW50KSB7XG4gICAgcmV0dXJuIERhdGEuZ2V0KGdldEVsZW1lbnQoZWxlbWVudCksIHRoaXMuREFUQV9LRVkpXG4gIH1cblxuICBzdGF0aWMgZ2V0T3JDcmVhdGVJbnN0YW5jZShlbGVtZW50LCBjb25maWcgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmdldEluc3RhbmNlKGVsZW1lbnQpIHx8IG5ldyB0aGlzKGVsZW1lbnQsIHR5cGVvZiBjb25maWcgPT09ICdvYmplY3QnID8gY29uZmlnIDogbnVsbClcbiAgfVxuXG4gIHN0YXRpYyBnZXQgVkVSU0lPTigpIHtcbiAgICByZXR1cm4gVkVSU0lPTlxuICB9XG5cbiAgc3RhdGljIGdldCBOQU1FKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignWW91IGhhdmUgdG8gaW1wbGVtZW50IHRoZSBzdGF0aWMgbWV0aG9kIFwiTkFNRVwiLCBmb3IgZWFjaCBjb21wb25lbnQhJylcbiAgfVxuXG4gIHN0YXRpYyBnZXQgREFUQV9LRVkoKSB7XG4gICAgcmV0dXJuIGBicy4ke3RoaXMuTkFNRX1gXG4gIH1cblxuICBzdGF0aWMgZ2V0IEVWRU5UX0tFWSgpIHtcbiAgICByZXR1cm4gYC4ke3RoaXMuREFUQV9LRVl9YFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJhc2VDb21wb25lbnRcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEJvb3RzdHJhcCAodjUuMS4zKTogdXRpbC9jb21wb25lbnQtZnVuY3Rpb25zLmpzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tICcuLi9kb20vZXZlbnQtaGFuZGxlcidcbmltcG9ydCB7IGdldEVsZW1lbnRGcm9tU2VsZWN0b3IsIGlzRGlzYWJsZWQgfSBmcm9tICcuL2luZGV4J1xuXG5jb25zdCBlbmFibGVEaXNtaXNzVHJpZ2dlciA9IChjb21wb25lbnQsIG1ldGhvZCA9ICdoaWRlJykgPT4ge1xuICBjb25zdCBjbGlja0V2ZW50ID0gYGNsaWNrLmRpc21pc3Mke2NvbXBvbmVudC5FVkVOVF9LRVl9YFxuICBjb25zdCBuYW1lID0gY29tcG9uZW50Lk5BTUVcblxuICBFdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIGNsaWNrRXZlbnQsIGBbZGF0YS1icy1kaXNtaXNzPVwiJHtuYW1lfVwiXWAsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlmIChbJ0EnLCAnQVJFQSddLmluY2x1ZGVzKHRoaXMudGFnTmFtZSkpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICB9XG5cbiAgICBpZiAoaXNEaXNhYmxlZCh0aGlzKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgdGFyZ2V0ID0gZ2V0RWxlbWVudEZyb21TZWxlY3Rvcih0aGlzKSB8fCB0aGlzLmNsb3Nlc3QoYC4ke25hbWV9YClcbiAgICBjb25zdCBpbnN0YW5jZSA9IGNvbXBvbmVudC5nZXRPckNyZWF0ZUluc3RhbmNlKHRhcmdldClcblxuICAgIC8vIE1ldGhvZCBhcmd1bWVudCBpcyBsZWZ0LCBmb3IgQWxlcnQgYW5kIG9ubHksIGFzIGl0IGRvZXNuJ3QgaW1wbGVtZW50IHRoZSAnaGlkZScgbWV0aG9kXG4gICAgaW5zdGFuY2VbbWV0aG9kXSgpXG4gIH0pXG59XG5cbmV4cG9ydCB7XG4gIGVuYWJsZURpc21pc3NUcmlnZ2VyXG59XG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBCb290c3RyYXAgKHY1LjEuMyk6IGFsZXJ0LmpzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuaW1wb3J0IHsgZGVmaW5lSlF1ZXJ5UGx1Z2luIH0gZnJvbSAnLi91dGlsL2luZGV4J1xuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tICcuL2RvbS9ldmVudC1oYW5kbGVyJ1xuaW1wb3J0IEJhc2VDb21wb25lbnQgZnJvbSAnLi9iYXNlLWNvbXBvbmVudCdcbmltcG9ydCB7IGVuYWJsZURpc21pc3NUcmlnZ2VyIH0gZnJvbSAnLi91dGlsL2NvbXBvbmVudC1mdW5jdGlvbnMnXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBDb25zdGFudHNcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmNvbnN0IE5BTUUgPSAnYWxlcnQnXG5jb25zdCBEQVRBX0tFWSA9ICdicy5hbGVydCdcbmNvbnN0IEVWRU5UX0tFWSA9IGAuJHtEQVRBX0tFWX1gXG5cbmNvbnN0IEVWRU5UX0NMT1NFID0gYGNsb3NlJHtFVkVOVF9LRVl9YFxuY29uc3QgRVZFTlRfQ0xPU0VEID0gYGNsb3NlZCR7RVZFTlRfS0VZfWBcbmNvbnN0IENMQVNTX05BTUVfRkFERSA9ICdmYWRlJ1xuY29uc3QgQ0xBU1NfTkFNRV9TSE9XID0gJ3Nob3cnXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBDbGFzcyBEZWZpbml0aW9uXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5jbGFzcyBBbGVydCBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuICAvLyBHZXR0ZXJzXG5cbiAgc3RhdGljIGdldCBOQU1FKCkge1xuICAgIHJldHVybiBOQU1FXG4gIH1cblxuICAvLyBQdWJsaWNcblxuICBjbG9zZSgpIHtcbiAgICBjb25zdCBjbG9zZUV2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfQ0xPU0UpXG5cbiAgICBpZiAoY2xvc2VFdmVudC5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKVxuXG4gICAgY29uc3QgaXNBbmltYXRlZCA9IHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfRkFERSlcbiAgICB0aGlzLl9xdWV1ZUNhbGxiYWNrKCgpID0+IHRoaXMuX2Rlc3Ryb3lFbGVtZW50KCksIHRoaXMuX2VsZW1lbnQsIGlzQW5pbWF0ZWQpXG4gIH1cblxuICAvLyBQcml2YXRlXG4gIF9kZXN0cm95RWxlbWVudCgpIHtcbiAgICB0aGlzLl9lbGVtZW50LnJlbW92ZSgpXG4gICAgRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfQ0xPU0VEKVxuICAgIHRoaXMuZGlzcG9zZSgpXG4gIH1cblxuICAvLyBTdGF0aWNcblxuICBzdGF0aWMgalF1ZXJ5SW50ZXJmYWNlKGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgZGF0YSA9IEFsZXJ0LmdldE9yQ3JlYXRlSW5zdGFuY2UodGhpcylcblxuICAgICAgaWYgKHR5cGVvZiBjb25maWcgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAoZGF0YVtjb25maWddID09PSB1bmRlZmluZWQgfHwgY29uZmlnLnN0YXJ0c1dpdGgoJ18nKSB8fCBjb25maWcgPT09ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgTm8gbWV0aG9kIG5hbWVkIFwiJHtjb25maWd9XCJgKVxuICAgICAgfVxuXG4gICAgICBkYXRhW2NvbmZpZ10odGhpcylcbiAgICB9KVxuICB9XG59XG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBEYXRhIEFwaSBpbXBsZW1lbnRhdGlvblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuZW5hYmxlRGlzbWlzc1RyaWdnZXIoQWxlcnQsICdjbG9zZScpXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBqUXVlcnlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogYWRkIC5BbGVydCB0byBqUXVlcnkgb25seSBpZiBqUXVlcnkgaXMgcHJlc2VudFxuICovXG5cbmRlZmluZUpRdWVyeVBsdWdpbihBbGVydClcblxuZXhwb3J0IGRlZmF1bHQgQWxlcnRcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEJvb3RzdHJhcCAodjUuMS4zKTogYnV0dG9uLmpzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuaW1wb3J0IHsgZGVmaW5lSlF1ZXJ5UGx1Z2luIH0gZnJvbSAnLi91dGlsL2luZGV4J1xuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tICcuL2RvbS9ldmVudC1oYW5kbGVyJ1xuaW1wb3J0IEJhc2VDb21wb25lbnQgZnJvbSAnLi9iYXNlLWNvbXBvbmVudCdcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvbnN0YW50c1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuY29uc3QgTkFNRSA9ICdidXR0b24nXG5jb25zdCBEQVRBX0tFWSA9ICdicy5idXR0b24nXG5jb25zdCBFVkVOVF9LRVkgPSBgLiR7REFUQV9LRVl9YFxuY29uc3QgREFUQV9BUElfS0VZID0gJy5kYXRhLWFwaSdcblxuY29uc3QgQ0xBU1NfTkFNRV9BQ1RJVkUgPSAnYWN0aXZlJ1xuXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSA9ICdbZGF0YS1icy10b2dnbGU9XCJidXR0b25cIl0nXG5cbmNvbnN0IEVWRU5UX0NMSUNLX0RBVEFfQVBJID0gYGNsaWNrJHtFVkVOVF9LRVl9JHtEQVRBX0FQSV9LRVl9YFxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQ2xhc3MgRGVmaW5pdGlvblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuY2xhc3MgQnV0dG9uIGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG4gIC8vIEdldHRlcnNcblxuICBzdGF0aWMgZ2V0IE5BTUUoKSB7XG4gICAgcmV0dXJuIE5BTUVcbiAgfVxuXG4gIC8vIFB1YmxpY1xuXG4gIHRvZ2dsZSgpIHtcbiAgICAvLyBUb2dnbGUgY2xhc3MgYW5kIHN5bmMgdGhlIGBhcmlhLXByZXNzZWRgIGF0dHJpYnV0ZSB3aXRoIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGAudG9nZ2xlKClgIG1ldGhvZFxuICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLXByZXNzZWQnLCB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoQ0xBU1NfTkFNRV9BQ1RJVkUpKVxuICB9XG5cbiAgLy8gU3RhdGljXG5cbiAgc3RhdGljIGpRdWVyeUludGVyZmFjZShjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IGRhdGEgPSBCdXR0b24uZ2V0T3JDcmVhdGVJbnN0YW5jZSh0aGlzKVxuXG4gICAgICBpZiAoY29uZmlnID09PSAndG9nZ2xlJykge1xuICAgICAgICBkYXRhW2NvbmZpZ10oKVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIERhdGEgQXBpIGltcGxlbWVudGF0aW9uXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5FdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0NMSUNLX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgZXZlbnQgPT4ge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgY29uc3QgYnV0dG9uID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoU0VMRUNUT1JfREFUQV9UT0dHTEUpXG4gIGNvbnN0IGRhdGEgPSBCdXR0b24uZ2V0T3JDcmVhdGVJbnN0YW5jZShidXR0b24pXG5cbiAgZGF0YS50b2dnbGUoKVxufSlcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIGpRdWVyeVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBhZGQgLkJ1dHRvbiB0byBqUXVlcnkgb25seSBpZiBqUXVlcnkgaXMgcHJlc2VudFxuICovXG5cbmRlZmluZUpRdWVyeVBsdWdpbihCdXR0b24pXG5cbmV4cG9ydCBkZWZhdWx0IEJ1dHRvblxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQm9vdHN0cmFwICh2NS4xLjMpOiBkb20vbWFuaXB1bGF0b3IuanNcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFpbi9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5mdW5jdGlvbiBub3JtYWxpemVEYXRhKHZhbCkge1xuICBpZiAodmFsID09PSAndHJ1ZScpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgaWYgKHZhbCA9PT0gJ2ZhbHNlJykge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgaWYgKHZhbCA9PT0gTnVtYmVyKHZhbCkudG9TdHJpbmcoKSkge1xuICAgIHJldHVybiBOdW1iZXIodmFsKVxuICB9XG5cbiAgaWYgKHZhbCA9PT0gJycgfHwgdmFsID09PSAnbnVsbCcpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVEYXRhS2V5KGtleSkge1xuICByZXR1cm4ga2V5LnJlcGxhY2UoL1tBLVpdL2csIGNociA9PiBgLSR7Y2hyLnRvTG93ZXJDYXNlKCl9YClcbn1cblxuY29uc3QgTWFuaXB1bGF0b3IgPSB7XG4gIHNldERhdGFBdHRyaWJ1dGUoZWxlbWVudCwga2V5LCB2YWx1ZSkge1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGBkYXRhLWJzLSR7bm9ybWFsaXplRGF0YUtleShrZXkpfWAsIHZhbHVlKVxuICB9LFxuXG4gIHJlbW92ZURhdGFBdHRyaWJ1dGUoZWxlbWVudCwga2V5KSB7XG4gICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYGRhdGEtYnMtJHtub3JtYWxpemVEYXRhS2V5KGtleSl9YClcbiAgfSxcblxuICBnZXREYXRhQXR0cmlidXRlcyhlbGVtZW50KSB7XG4gICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICByZXR1cm4ge31cbiAgICB9XG5cbiAgICBjb25zdCBhdHRyaWJ1dGVzID0ge31cblxuICAgIE9iamVjdC5rZXlzKGVsZW1lbnQuZGF0YXNldClcbiAgICAgIC5maWx0ZXIoa2V5ID0+IGtleS5zdGFydHNXaXRoKCdicycpKVxuICAgICAgLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgbGV0IHB1cmVLZXkgPSBrZXkucmVwbGFjZSgvXmJzLywgJycpXG4gICAgICAgIHB1cmVLZXkgPSBwdXJlS2V5LmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpICsgcHVyZUtleS5zbGljZSgxLCBwdXJlS2V5Lmxlbmd0aClcbiAgICAgICAgYXR0cmlidXRlc1twdXJlS2V5XSA9IG5vcm1hbGl6ZURhdGEoZWxlbWVudC5kYXRhc2V0W2tleV0pXG4gICAgICB9KVxuXG4gICAgcmV0dXJuIGF0dHJpYnV0ZXNcbiAgfSxcblxuICBnZXREYXRhQXR0cmlidXRlKGVsZW1lbnQsIGtleSkge1xuICAgIHJldHVybiBub3JtYWxpemVEYXRhKGVsZW1lbnQuZ2V0QXR0cmlidXRlKGBkYXRhLWJzLSR7bm9ybWFsaXplRGF0YUtleShrZXkpfWApKVxuICB9LFxuXG4gIG9mZnNldChlbGVtZW50KSB7XG4gICAgY29uc3QgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgIHJldHVybiB7XG4gICAgICB0b3A6IHJlY3QudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0LFxuICAgICAgbGVmdDogcmVjdC5sZWZ0ICsgd2luZG93LnBhZ2VYT2Zmc2V0XG4gICAgfVxuICB9LFxuXG4gIHBvc2l0aW9uKGVsZW1lbnQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdG9wOiBlbGVtZW50Lm9mZnNldFRvcCxcbiAgICAgIGxlZnQ6IGVsZW1lbnQub2Zmc2V0TGVmdFxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYW5pcHVsYXRvclxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQm9vdHN0cmFwICh2NS4xLjMpOiBkb20vc2VsZWN0b3ItZW5naW5lLmpzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvbnN0YW50c1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuaW1wb3J0IHsgaXNEaXNhYmxlZCwgaXNWaXNpYmxlIH0gZnJvbSAnLi4vdXRpbC9pbmRleCdcblxuY29uc3QgTk9ERV9URVhUID0gM1xuXG5jb25zdCBTZWxlY3RvckVuZ2luZSA9IHtcbiAgZmluZChzZWxlY3RvciwgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xuICAgIHJldHVybiBbXS5jb25jYXQoLi4uRWxlbWVudC5wcm90b3R5cGUucXVlcnlTZWxlY3RvckFsbC5jYWxsKGVsZW1lbnQsIHNlbGVjdG9yKSlcbiAgfSxcblxuICBmaW5kT25lKHNlbGVjdG9yLCBlbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgcmV0dXJuIEVsZW1lbnQucHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3IuY2FsbChlbGVtZW50LCBzZWxlY3RvcilcbiAgfSxcblxuICBjaGlsZHJlbihlbGVtZW50LCBzZWxlY3Rvcikge1xuICAgIHJldHVybiBbXS5jb25jYXQoLi4uZWxlbWVudC5jaGlsZHJlbilcbiAgICAgIC5maWx0ZXIoY2hpbGQgPT4gY2hpbGQubWF0Y2hlcyhzZWxlY3RvcikpXG4gIH0sXG5cbiAgcGFyZW50cyhlbGVtZW50LCBzZWxlY3Rvcikge1xuICAgIGNvbnN0IHBhcmVudHMgPSBbXVxuXG4gICAgbGV0IGFuY2VzdG9yID0gZWxlbWVudC5wYXJlbnROb2RlXG5cbiAgICB3aGlsZSAoYW5jZXN0b3IgJiYgYW5jZXN0b3Iubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFICYmIGFuY2VzdG9yLm5vZGVUeXBlICE9PSBOT0RFX1RFWFQpIHtcbiAgICAgIGlmIChhbmNlc3Rvci5tYXRjaGVzKHNlbGVjdG9yKSkge1xuICAgICAgICBwYXJlbnRzLnB1c2goYW5jZXN0b3IpXG4gICAgICB9XG5cbiAgICAgIGFuY2VzdG9yID0gYW5jZXN0b3IucGFyZW50Tm9kZVxuICAgIH1cblxuICAgIHJldHVybiBwYXJlbnRzXG4gIH0sXG5cbiAgcHJldihlbGVtZW50LCBzZWxlY3Rvcikge1xuICAgIGxldCBwcmV2aW91cyA9IGVsZW1lbnQucHJldmlvdXNFbGVtZW50U2libGluZ1xuXG4gICAgd2hpbGUgKHByZXZpb3VzKSB7XG4gICAgICBpZiAocHJldmlvdXMubWF0Y2hlcyhzZWxlY3RvcikpIHtcbiAgICAgICAgcmV0dXJuIFtwcmV2aW91c11cbiAgICAgIH1cblxuICAgICAgcHJldmlvdXMgPSBwcmV2aW91cy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nXG4gICAgfVxuXG4gICAgcmV0dXJuIFtdXG4gIH0sXG5cbiAgbmV4dChlbGVtZW50LCBzZWxlY3Rvcikge1xuICAgIGxldCBuZXh0ID0gZWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmdcblxuICAgIHdoaWxlIChuZXh0KSB7XG4gICAgICBpZiAobmV4dC5tYXRjaGVzKHNlbGVjdG9yKSkge1xuICAgICAgICByZXR1cm4gW25leHRdXG4gICAgICB9XG5cbiAgICAgIG5leHQgPSBuZXh0Lm5leHRFbGVtZW50U2libGluZ1xuICAgIH1cblxuICAgIHJldHVybiBbXVxuICB9LFxuXG4gIGZvY3VzYWJsZUNoaWxkcmVuKGVsZW1lbnQpIHtcbiAgICBjb25zdCBmb2N1c2FibGVzID0gW1xuICAgICAgJ2EnLFxuICAgICAgJ2J1dHRvbicsXG4gICAgICAnaW5wdXQnLFxuICAgICAgJ3RleHRhcmVhJyxcbiAgICAgICdzZWxlY3QnLFxuICAgICAgJ2RldGFpbHMnLFxuICAgICAgJ1t0YWJpbmRleF0nLFxuICAgICAgJ1tjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCJdJ1xuICAgIF0ubWFwKHNlbGVjdG9yID0+IGAke3NlbGVjdG9yfTpub3QoW3RhYmluZGV4Xj1cIi1cIl0pYCkuam9pbignLCAnKVxuXG4gICAgcmV0dXJuIHRoaXMuZmluZChmb2N1c2FibGVzLCBlbGVtZW50KS5maWx0ZXIoZWwgPT4gIWlzRGlzYWJsZWQoZWwpICYmIGlzVmlzaWJsZShlbCkpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0b3JFbmdpbmVcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEJvb3RzdHJhcCAodjUuMS4zKTogY2Fyb3VzZWwuanNcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFpbi9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5pbXBvcnQge1xuICBkZWZpbmVKUXVlcnlQbHVnaW4sXG4gIGdldEVsZW1lbnRGcm9tU2VsZWN0b3IsXG4gIGlzUlRMLFxuICBpc1Zpc2libGUsXG4gIGdldE5leHRBY3RpdmVFbGVtZW50LFxuICByZWZsb3csXG4gIHRyaWdnZXJUcmFuc2l0aW9uRW5kLFxuICB0eXBlQ2hlY2tDb25maWdcbn0gZnJvbSAnLi91dGlsL2luZGV4J1xuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tICcuL2RvbS9ldmVudC1oYW5kbGVyJ1xuaW1wb3J0IE1hbmlwdWxhdG9yIGZyb20gJy4vZG9tL21hbmlwdWxhdG9yJ1xuaW1wb3J0IFNlbGVjdG9yRW5naW5lIGZyb20gJy4vZG9tL3NlbGVjdG9yLWVuZ2luZSdcbmltcG9ydCBCYXNlQ29tcG9uZW50IGZyb20gJy4vYmFzZS1jb21wb25lbnQnXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBDb25zdGFudHNcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmNvbnN0IE5BTUUgPSAnY2Fyb3VzZWwnXG5jb25zdCBEQVRBX0tFWSA9ICdicy5jYXJvdXNlbCdcbmNvbnN0IEVWRU5UX0tFWSA9IGAuJHtEQVRBX0tFWX1gXG5jb25zdCBEQVRBX0FQSV9LRVkgPSAnLmRhdGEtYXBpJ1xuXG5jb25zdCBBUlJPV19MRUZUX0tFWSA9ICdBcnJvd0xlZnQnXG5jb25zdCBBUlJPV19SSUdIVF9LRVkgPSAnQXJyb3dSaWdodCdcbmNvbnN0IFRPVUNIRVZFTlRfQ09NUEFUX1dBSVQgPSA1MDAgLy8gVGltZSBmb3IgbW91c2UgY29tcGF0IGV2ZW50cyB0byBmaXJlIGFmdGVyIHRvdWNoXG5jb25zdCBTV0lQRV9USFJFU0hPTEQgPSA0MFxuXG5jb25zdCBEZWZhdWx0ID0ge1xuICBpbnRlcnZhbDogNTAwMCxcbiAga2V5Ym9hcmQ6IHRydWUsXG4gIHNsaWRlOiBmYWxzZSxcbiAgcGF1c2U6ICdob3ZlcicsXG4gIHdyYXA6IHRydWUsXG4gIHRvdWNoOiB0cnVlXG59XG5cbmNvbnN0IERlZmF1bHRUeXBlID0ge1xuICBpbnRlcnZhbDogJyhudW1iZXJ8Ym9vbGVhbiknLFxuICBrZXlib2FyZDogJ2Jvb2xlYW4nLFxuICBzbGlkZTogJyhib29sZWFufHN0cmluZyknLFxuICBwYXVzZTogJyhzdHJpbmd8Ym9vbGVhbiknLFxuICB3cmFwOiAnYm9vbGVhbicsXG4gIHRvdWNoOiAnYm9vbGVhbidcbn1cblxuY29uc3QgT1JERVJfTkVYVCA9ICduZXh0J1xuY29uc3QgT1JERVJfUFJFViA9ICdwcmV2J1xuY29uc3QgRElSRUNUSU9OX0xFRlQgPSAnbGVmdCdcbmNvbnN0IERJUkVDVElPTl9SSUdIVCA9ICdyaWdodCdcblxuY29uc3QgS0VZX1RPX0RJUkVDVElPTiA9IHtcbiAgW0FSUk9XX0xFRlRfS0VZXTogRElSRUNUSU9OX1JJR0hULFxuICBbQVJST1dfUklHSFRfS0VZXTogRElSRUNUSU9OX0xFRlRcbn1cblxuY29uc3QgRVZFTlRfU0xJREUgPSBgc2xpZGUke0VWRU5UX0tFWX1gXG5jb25zdCBFVkVOVF9TTElEID0gYHNsaWQke0VWRU5UX0tFWX1gXG5jb25zdCBFVkVOVF9LRVlET1dOID0gYGtleWRvd24ke0VWRU5UX0tFWX1gXG5jb25zdCBFVkVOVF9NT1VTRUVOVEVSID0gYG1vdXNlZW50ZXIke0VWRU5UX0tFWX1gXG5jb25zdCBFVkVOVF9NT1VTRUxFQVZFID0gYG1vdXNlbGVhdmUke0VWRU5UX0tFWX1gXG5jb25zdCBFVkVOVF9UT1VDSFNUQVJUID0gYHRvdWNoc3RhcnQke0VWRU5UX0tFWX1gXG5jb25zdCBFVkVOVF9UT1VDSE1PVkUgPSBgdG91Y2htb3ZlJHtFVkVOVF9LRVl9YFxuY29uc3QgRVZFTlRfVE9VQ0hFTkQgPSBgdG91Y2hlbmQke0VWRU5UX0tFWX1gXG5jb25zdCBFVkVOVF9QT0lOVEVSRE9XTiA9IGBwb2ludGVyZG93biR7RVZFTlRfS0VZfWBcbmNvbnN0IEVWRU5UX1BPSU5URVJVUCA9IGBwb2ludGVydXAke0VWRU5UX0tFWX1gXG5jb25zdCBFVkVOVF9EUkFHX1NUQVJUID0gYGRyYWdzdGFydCR7RVZFTlRfS0VZfWBcbmNvbnN0IEVWRU5UX0xPQURfREFUQV9BUEkgPSBgbG9hZCR7RVZFTlRfS0VZfSR7REFUQV9BUElfS0VZfWBcbmNvbnN0IEVWRU5UX0NMSUNLX0RBVEFfQVBJID0gYGNsaWNrJHtFVkVOVF9LRVl9JHtEQVRBX0FQSV9LRVl9YFxuXG5jb25zdCBDTEFTU19OQU1FX0NBUk9VU0VMID0gJ2Nhcm91c2VsJ1xuY29uc3QgQ0xBU1NfTkFNRV9BQ1RJVkUgPSAnYWN0aXZlJ1xuY29uc3QgQ0xBU1NfTkFNRV9TTElERSA9ICdzbGlkZSdcbmNvbnN0IENMQVNTX05BTUVfRU5EID0gJ2Nhcm91c2VsLWl0ZW0tZW5kJ1xuY29uc3QgQ0xBU1NfTkFNRV9TVEFSVCA9ICdjYXJvdXNlbC1pdGVtLXN0YXJ0J1xuY29uc3QgQ0xBU1NfTkFNRV9ORVhUID0gJ2Nhcm91c2VsLWl0ZW0tbmV4dCdcbmNvbnN0IENMQVNTX05BTUVfUFJFViA9ICdjYXJvdXNlbC1pdGVtLXByZXYnXG5jb25zdCBDTEFTU19OQU1FX1BPSU5URVJfRVZFTlQgPSAncG9pbnRlci1ldmVudCdcblxuY29uc3QgU0VMRUNUT1JfQUNUSVZFID0gJy5hY3RpdmUnXG5jb25zdCBTRUxFQ1RPUl9BQ1RJVkVfSVRFTSA9ICcuYWN0aXZlLmNhcm91c2VsLWl0ZW0nXG5jb25zdCBTRUxFQ1RPUl9JVEVNID0gJy5jYXJvdXNlbC1pdGVtJ1xuY29uc3QgU0VMRUNUT1JfSVRFTV9JTUcgPSAnLmNhcm91c2VsLWl0ZW0gaW1nJ1xuY29uc3QgU0VMRUNUT1JfTkVYVF9QUkVWID0gJy5jYXJvdXNlbC1pdGVtLW5leHQsIC5jYXJvdXNlbC1pdGVtLXByZXYnXG5jb25zdCBTRUxFQ1RPUl9JTkRJQ0FUT1JTID0gJy5jYXJvdXNlbC1pbmRpY2F0b3JzJ1xuY29uc3QgU0VMRUNUT1JfSU5ESUNBVE9SID0gJ1tkYXRhLWJzLXRhcmdldF0nXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1NMSURFID0gJ1tkYXRhLWJzLXNsaWRlXSwgW2RhdGEtYnMtc2xpZGUtdG9dJ1xuY29uc3QgU0VMRUNUT1JfREFUQV9SSURFID0gJ1tkYXRhLWJzLXJpZGU9XCJjYXJvdXNlbFwiXSdcblxuY29uc3QgUE9JTlRFUl9UWVBFX1RPVUNIID0gJ3RvdWNoJ1xuY29uc3QgUE9JTlRFUl9UWVBFX1BFTiA9ICdwZW4nXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBDbGFzcyBEZWZpbml0aW9uXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuY2xhc3MgQ2Fyb3VzZWwgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoZWxlbWVudCwgY29uZmlnKSB7XG4gICAgc3VwZXIoZWxlbWVudClcblxuICAgIHRoaXMuX2l0ZW1zID0gbnVsbFxuICAgIHRoaXMuX2ludGVydmFsID0gbnVsbFxuICAgIHRoaXMuX2FjdGl2ZUVsZW1lbnQgPSBudWxsXG4gICAgdGhpcy5faXNQYXVzZWQgPSBmYWxzZVxuICAgIHRoaXMuX2lzU2xpZGluZyA9IGZhbHNlXG4gICAgdGhpcy50b3VjaFRpbWVvdXQgPSBudWxsXG4gICAgdGhpcy50b3VjaFN0YXJ0WCA9IDBcbiAgICB0aGlzLnRvdWNoRGVsdGFYID0gMFxuXG4gICAgdGhpcy5fY29uZmlnID0gdGhpcy5fZ2V0Q29uZmlnKGNvbmZpZylcbiAgICB0aGlzLl9pbmRpY2F0b3JzRWxlbWVudCA9IFNlbGVjdG9yRW5naW5lLmZpbmRPbmUoU0VMRUNUT1JfSU5ESUNBVE9SUywgdGhpcy5fZWxlbWVudClcbiAgICB0aGlzLl90b3VjaFN1cHBvcnRlZCA9ICdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCB8fCBuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgPiAwXG4gICAgdGhpcy5fcG9pbnRlckV2ZW50ID0gQm9vbGVhbih3aW5kb3cuUG9pbnRlckV2ZW50KVxuXG4gICAgdGhpcy5fYWRkRXZlbnRMaXN0ZW5lcnMoKVxuICB9XG5cbiAgLy8gR2V0dGVyc1xuXG4gIHN0YXRpYyBnZXQgRGVmYXVsdCgpIHtcbiAgICByZXR1cm4gRGVmYXVsdFxuICB9XG5cbiAgc3RhdGljIGdldCBOQU1FKCkge1xuICAgIHJldHVybiBOQU1FXG4gIH1cblxuICAvLyBQdWJsaWNcblxuICBuZXh0KCkge1xuICAgIHRoaXMuX3NsaWRlKE9SREVSX05FWFQpXG4gIH1cblxuICBuZXh0V2hlblZpc2libGUoKSB7XG4gICAgLy8gRG9uJ3QgY2FsbCBuZXh0IHdoZW4gdGhlIHBhZ2UgaXNuJ3QgdmlzaWJsZVxuICAgIC8vIG9yIHRoZSBjYXJvdXNlbCBvciBpdHMgcGFyZW50IGlzbid0IHZpc2libGVcbiAgICBpZiAoIWRvY3VtZW50LmhpZGRlbiAmJiBpc1Zpc2libGUodGhpcy5fZWxlbWVudCkpIHtcbiAgICAgIHRoaXMubmV4dCgpXG4gICAgfVxuICB9XG5cbiAgcHJldigpIHtcbiAgICB0aGlzLl9zbGlkZShPUkRFUl9QUkVWKVxuICB9XG5cbiAgcGF1c2UoZXZlbnQpIHtcbiAgICBpZiAoIWV2ZW50KSB7XG4gICAgICB0aGlzLl9pc1BhdXNlZCA9IHRydWVcbiAgICB9XG5cbiAgICBpZiAoU2VsZWN0b3JFbmdpbmUuZmluZE9uZShTRUxFQ1RPUl9ORVhUX1BSRVYsIHRoaXMuX2VsZW1lbnQpKSB7XG4gICAgICB0cmlnZ2VyVHJhbnNpdGlvbkVuZCh0aGlzLl9lbGVtZW50KVxuICAgICAgdGhpcy5jeWNsZSh0cnVlKVxuICAgIH1cblxuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5faW50ZXJ2YWwpXG4gICAgdGhpcy5faW50ZXJ2YWwgPSBudWxsXG4gIH1cblxuICBjeWNsZShldmVudCkge1xuICAgIGlmICghZXZlbnQpIHtcbiAgICAgIHRoaXMuX2lzUGF1c2VkID0gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAodGhpcy5faW50ZXJ2YWwpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5faW50ZXJ2YWwpXG4gICAgICB0aGlzLl9pbnRlcnZhbCA9IG51bGxcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fY29uZmlnICYmIHRoaXMuX2NvbmZpZy5pbnRlcnZhbCAmJiAhdGhpcy5faXNQYXVzZWQpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZUludGVydmFsKClcblxuICAgICAgdGhpcy5faW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChcbiAgICAgICAgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA/IHRoaXMubmV4dFdoZW5WaXNpYmxlIDogdGhpcy5uZXh0KS5iaW5kKHRoaXMpLFxuICAgICAgICB0aGlzLl9jb25maWcuaW50ZXJ2YWxcbiAgICAgIClcbiAgICB9XG4gIH1cblxuICB0byhpbmRleCkge1xuICAgIHRoaXMuX2FjdGl2ZUVsZW1lbnQgPSBTZWxlY3RvckVuZ2luZS5maW5kT25lKFNFTEVDVE9SX0FDVElWRV9JVEVNLCB0aGlzLl9lbGVtZW50KVxuICAgIGNvbnN0IGFjdGl2ZUluZGV4ID0gdGhpcy5fZ2V0SXRlbUluZGV4KHRoaXMuX2FjdGl2ZUVsZW1lbnQpXG5cbiAgICBpZiAoaW5kZXggPiB0aGlzLl9pdGVtcy5sZW5ndGggLSAxIHx8IGluZGV4IDwgMCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2lzU2xpZGluZykge1xuICAgICAgRXZlbnRIYW5kbGVyLm9uZSh0aGlzLl9lbGVtZW50LCBFVkVOVF9TTElELCAoKSA9PiB0aGlzLnRvKGluZGV4KSlcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChhY3RpdmVJbmRleCA9PT0gaW5kZXgpIHtcbiAgICAgIHRoaXMucGF1c2UoKVxuICAgICAgdGhpcy5jeWNsZSgpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBvcmRlciA9IGluZGV4ID4gYWN0aXZlSW5kZXggP1xuICAgICAgT1JERVJfTkVYVCA6XG4gICAgICBPUkRFUl9QUkVWXG5cbiAgICB0aGlzLl9zbGlkZShvcmRlciwgdGhpcy5faXRlbXNbaW5kZXhdKVxuICB9XG5cbiAgLy8gUHJpdmF0ZVxuXG4gIF9nZXRDb25maWcoY29uZmlnKSB7XG4gICAgY29uZmlnID0ge1xuICAgICAgLi4uRGVmYXVsdCxcbiAgICAgIC4uLk1hbmlwdWxhdG9yLmdldERhdGFBdHRyaWJ1dGVzKHRoaXMuX2VsZW1lbnQpLFxuICAgICAgLi4uKHR5cGVvZiBjb25maWcgPT09ICdvYmplY3QnID8gY29uZmlnIDoge30pXG4gICAgfVxuICAgIHR5cGVDaGVja0NvbmZpZyhOQU1FLCBjb25maWcsIERlZmF1bHRUeXBlKVxuICAgIHJldHVybiBjb25maWdcbiAgfVxuXG4gIF9oYW5kbGVTd2lwZSgpIHtcbiAgICBjb25zdCBhYnNEZWx0YXggPSBNYXRoLmFicyh0aGlzLnRvdWNoRGVsdGFYKVxuXG4gICAgaWYgKGFic0RlbHRheCA8PSBTV0lQRV9USFJFU0hPTEQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGRpcmVjdGlvbiA9IGFic0RlbHRheCAvIHRoaXMudG91Y2hEZWx0YVhcblxuICAgIHRoaXMudG91Y2hEZWx0YVggPSAwXG5cbiAgICBpZiAoIWRpcmVjdGlvbikge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5fc2xpZGUoZGlyZWN0aW9uID4gMCA/IERJUkVDVElPTl9SSUdIVCA6IERJUkVDVElPTl9MRUZUKVxuICB9XG5cbiAgX2FkZEV2ZW50TGlzdGVuZXJzKCkge1xuICAgIGlmICh0aGlzLl9jb25maWcua2V5Ym9hcmQpIHtcbiAgICAgIEV2ZW50SGFuZGxlci5vbih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlET1dOLCBldmVudCA9PiB0aGlzLl9rZXlkb3duKGV2ZW50KSlcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fY29uZmlnLnBhdXNlID09PSAnaG92ZXInKSB7XG4gICAgICBFdmVudEhhbmRsZXIub24odGhpcy5fZWxlbWVudCwgRVZFTlRfTU9VU0VFTlRFUiwgZXZlbnQgPT4gdGhpcy5wYXVzZShldmVudCkpXG4gICAgICBFdmVudEhhbmRsZXIub24odGhpcy5fZWxlbWVudCwgRVZFTlRfTU9VU0VMRUFWRSwgZXZlbnQgPT4gdGhpcy5jeWNsZShldmVudCkpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2NvbmZpZy50b3VjaCAmJiB0aGlzLl90b3VjaFN1cHBvcnRlZCkge1xuICAgICAgdGhpcy5fYWRkVG91Y2hFdmVudExpc3RlbmVycygpXG4gICAgfVxuICB9XG5cbiAgX2FkZFRvdWNoRXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgY29uc3QgaGFzUG9pbnRlclBlblRvdWNoID0gZXZlbnQgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuX3BvaW50ZXJFdmVudCAmJlxuICAgICAgICAoZXZlbnQucG9pbnRlclR5cGUgPT09IFBPSU5URVJfVFlQRV9QRU4gfHwgZXZlbnQucG9pbnRlclR5cGUgPT09IFBPSU5URVJfVFlQRV9UT1VDSClcbiAgICB9XG5cbiAgICBjb25zdCBzdGFydCA9IGV2ZW50ID0+IHtcbiAgICAgIGlmIChoYXNQb2ludGVyUGVuVG91Y2goZXZlbnQpKSB7XG4gICAgICAgIHRoaXMudG91Y2hTdGFydFggPSBldmVudC5jbGllbnRYXG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLl9wb2ludGVyRXZlbnQpIHtcbiAgICAgICAgdGhpcy50b3VjaFN0YXJ0WCA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WFxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG1vdmUgPSBldmVudCA9PiB7XG4gICAgICAvLyBlbnN1cmUgc3dpcGluZyB3aXRoIG9uZSB0b3VjaCBhbmQgbm90IHBpbmNoaW5nXG4gICAgICB0aGlzLnRvdWNoRGVsdGFYID0gZXZlbnQudG91Y2hlcyAmJiBldmVudC50b3VjaGVzLmxlbmd0aCA+IDEgP1xuICAgICAgICAwIDpcbiAgICAgICAgZXZlbnQudG91Y2hlc1swXS5jbGllbnRYIC0gdGhpcy50b3VjaFN0YXJ0WFxuICAgIH1cblxuICAgIGNvbnN0IGVuZCA9IGV2ZW50ID0+IHtcbiAgICAgIGlmIChoYXNQb2ludGVyUGVuVG91Y2goZXZlbnQpKSB7XG4gICAgICAgIHRoaXMudG91Y2hEZWx0YVggPSBldmVudC5jbGllbnRYIC0gdGhpcy50b3VjaFN0YXJ0WFxuICAgICAgfVxuXG4gICAgICB0aGlzLl9oYW5kbGVTd2lwZSgpXG4gICAgICBpZiAodGhpcy5fY29uZmlnLnBhdXNlID09PSAnaG92ZXInKSB7XG4gICAgICAgIC8vIElmIGl0J3MgYSB0b3VjaC1lbmFibGVkIGRldmljZSwgbW91c2VlbnRlci9sZWF2ZSBhcmUgZmlyZWQgYXNcbiAgICAgICAgLy8gcGFydCBvZiB0aGUgbW91c2UgY29tcGF0aWJpbGl0eSBldmVudHMgb24gZmlyc3QgdGFwIC0gdGhlIGNhcm91c2VsXG4gICAgICAgIC8vIHdvdWxkIHN0b3AgY3ljbGluZyB1bnRpbCB1c2VyIHRhcHBlZCBvdXQgb2YgaXQ7XG4gICAgICAgIC8vIGhlcmUsIHdlIGxpc3RlbiBmb3IgdG91Y2hlbmQsIGV4cGxpY2l0bHkgcGF1c2UgdGhlIGNhcm91c2VsXG4gICAgICAgIC8vIChhcyBpZiBpdCdzIHRoZSBzZWNvbmQgdGltZSB3ZSB0YXAgb24gaXQsIG1vdXNlZW50ZXIgY29tcGF0IGV2ZW50XG4gICAgICAgIC8vIGlzIE5PVCBmaXJlZCkgYW5kIGFmdGVyIGEgdGltZW91dCAodG8gYWxsb3cgZm9yIG1vdXNlIGNvbXBhdGliaWxpdHlcbiAgICAgICAgLy8gZXZlbnRzIHRvIGZpcmUpIHdlIGV4cGxpY2l0bHkgcmVzdGFydCBjeWNsaW5nXG5cbiAgICAgICAgdGhpcy5wYXVzZSgpXG4gICAgICAgIGlmICh0aGlzLnRvdWNoVGltZW91dCkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRvdWNoVGltZW91dClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG91Y2hUaW1lb3V0ID0gc2V0VGltZW91dChldmVudCA9PiB0aGlzLmN5Y2xlKGV2ZW50KSwgVE9VQ0hFVkVOVF9DT01QQVRfV0FJVCArIHRoaXMuX2NvbmZpZy5pbnRlcnZhbClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBTZWxlY3RvckVuZ2luZS5maW5kKFNFTEVDVE9SX0lURU1fSU1HLCB0aGlzLl9lbGVtZW50KS5mb3JFYWNoKGl0ZW1JbWcgPT4ge1xuICAgICAgRXZlbnRIYW5kbGVyLm9uKGl0ZW1JbWcsIEVWRU5UX0RSQUdfU1RBUlQsIGV2ZW50ID0+IGV2ZW50LnByZXZlbnREZWZhdWx0KCkpXG4gICAgfSlcblxuICAgIGlmICh0aGlzLl9wb2ludGVyRXZlbnQpIHtcbiAgICAgIEV2ZW50SGFuZGxlci5vbih0aGlzLl9lbGVtZW50LCBFVkVOVF9QT0lOVEVSRE9XTiwgZXZlbnQgPT4gc3RhcnQoZXZlbnQpKVxuICAgICAgRXZlbnRIYW5kbGVyLm9uKHRoaXMuX2VsZW1lbnQsIEVWRU5UX1BPSU5URVJVUCwgZXZlbnQgPT4gZW5kKGV2ZW50KSlcblxuICAgICAgdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfUE9JTlRFUl9FVkVOVClcbiAgICB9IGVsc2Uge1xuICAgICAgRXZlbnRIYW5kbGVyLm9uKHRoaXMuX2VsZW1lbnQsIEVWRU5UX1RPVUNIU1RBUlQsIGV2ZW50ID0+IHN0YXJ0KGV2ZW50KSlcbiAgICAgIEV2ZW50SGFuZGxlci5vbih0aGlzLl9lbGVtZW50LCBFVkVOVF9UT1VDSE1PVkUsIGV2ZW50ID0+IG1vdmUoZXZlbnQpKVxuICAgICAgRXZlbnRIYW5kbGVyLm9uKHRoaXMuX2VsZW1lbnQsIEVWRU5UX1RPVUNIRU5ELCBldmVudCA9PiBlbmQoZXZlbnQpKVxuICAgIH1cbiAgfVxuXG4gIF9rZXlkb3duKGV2ZW50KSB7XG4gICAgaWYgKC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoZXZlbnQudGFyZ2V0LnRhZ05hbWUpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBkaXJlY3Rpb24gPSBLRVlfVE9fRElSRUNUSU9OW2V2ZW50LmtleV1cbiAgICBpZiAoZGlyZWN0aW9uKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICB0aGlzLl9zbGlkZShkaXJlY3Rpb24pXG4gICAgfVxuICB9XG5cbiAgX2dldEl0ZW1JbmRleChlbGVtZW50KSB7XG4gICAgdGhpcy5faXRlbXMgPSBlbGVtZW50ICYmIGVsZW1lbnQucGFyZW50Tm9kZSA/XG4gICAgICBTZWxlY3RvckVuZ2luZS5maW5kKFNFTEVDVE9SX0lURU0sIGVsZW1lbnQucGFyZW50Tm9kZSkgOlxuICAgICAgW11cblxuICAgIHJldHVybiB0aGlzLl9pdGVtcy5pbmRleE9mKGVsZW1lbnQpXG4gIH1cblxuICBfZ2V0SXRlbUJ5T3JkZXIob3JkZXIsIGFjdGl2ZUVsZW1lbnQpIHtcbiAgICBjb25zdCBpc05leHQgPSBvcmRlciA9PT0gT1JERVJfTkVYVFxuICAgIHJldHVybiBnZXROZXh0QWN0aXZlRWxlbWVudCh0aGlzLl9pdGVtcywgYWN0aXZlRWxlbWVudCwgaXNOZXh0LCB0aGlzLl9jb25maWcud3JhcClcbiAgfVxuXG4gIF90cmlnZ2VyU2xpZGVFdmVudChyZWxhdGVkVGFyZ2V0LCBldmVudERpcmVjdGlvbk5hbWUpIHtcbiAgICBjb25zdCB0YXJnZXRJbmRleCA9IHRoaXMuX2dldEl0ZW1JbmRleChyZWxhdGVkVGFyZ2V0KVxuICAgIGNvbnN0IGZyb21JbmRleCA9IHRoaXMuX2dldEl0ZW1JbmRleChTZWxlY3RvckVuZ2luZS5maW5kT25lKFNFTEVDVE9SX0FDVElWRV9JVEVNLCB0aGlzLl9lbGVtZW50KSlcblxuICAgIHJldHVybiBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9TTElERSwge1xuICAgICAgcmVsYXRlZFRhcmdldCxcbiAgICAgIGRpcmVjdGlvbjogZXZlbnREaXJlY3Rpb25OYW1lLFxuICAgICAgZnJvbTogZnJvbUluZGV4LFxuICAgICAgdG86IHRhcmdldEluZGV4XG4gICAgfSlcbiAgfVxuXG4gIF9zZXRBY3RpdmVJbmRpY2F0b3JFbGVtZW50KGVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5faW5kaWNhdG9yc0VsZW1lbnQpIHtcbiAgICAgIGNvbnN0IGFjdGl2ZUluZGljYXRvciA9IFNlbGVjdG9yRW5naW5lLmZpbmRPbmUoU0VMRUNUT1JfQUNUSVZFLCB0aGlzLl9pbmRpY2F0b3JzRWxlbWVudClcblxuICAgICAgYWN0aXZlSW5kaWNhdG9yLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9BQ1RJVkUpXG4gICAgICBhY3RpdmVJbmRpY2F0b3IucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWN1cnJlbnQnKVxuXG4gICAgICBjb25zdCBpbmRpY2F0b3JzID0gU2VsZWN0b3JFbmdpbmUuZmluZChTRUxFQ1RPUl9JTkRJQ0FUT1IsIHRoaXMuX2luZGljYXRvcnNFbGVtZW50KVxuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluZGljYXRvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKE51bWJlci5wYXJzZUludChpbmRpY2F0b3JzW2ldLmdldEF0dHJpYnV0ZSgnZGF0YS1icy1zbGlkZS10bycpLCAxMCkgPT09IHRoaXMuX2dldEl0ZW1JbmRleChlbGVtZW50KSkge1xuICAgICAgICAgIGluZGljYXRvcnNbaV0uY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0FDVElWRSlcbiAgICAgICAgICBpbmRpY2F0b3JzW2ldLnNldEF0dHJpYnV0ZSgnYXJpYS1jdXJyZW50JywgJ3RydWUnKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfdXBkYXRlSW50ZXJ2YWwoKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2FjdGl2ZUVsZW1lbnQgfHwgU2VsZWN0b3JFbmdpbmUuZmluZE9uZShTRUxFQ1RPUl9BQ1RJVkVfSVRFTSwgdGhpcy5fZWxlbWVudClcblxuICAgIGlmICghZWxlbWVudCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgZWxlbWVudEludGVydmFsID0gTnVtYmVyLnBhcnNlSW50KGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWJzLWludGVydmFsJyksIDEwKVxuXG4gICAgaWYgKGVsZW1lbnRJbnRlcnZhbCkge1xuICAgICAgdGhpcy5fY29uZmlnLmRlZmF1bHRJbnRlcnZhbCA9IHRoaXMuX2NvbmZpZy5kZWZhdWx0SW50ZXJ2YWwgfHwgdGhpcy5fY29uZmlnLmludGVydmFsXG4gICAgICB0aGlzLl9jb25maWcuaW50ZXJ2YWwgPSBlbGVtZW50SW50ZXJ2YWxcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY29uZmlnLmludGVydmFsID0gdGhpcy5fY29uZmlnLmRlZmF1bHRJbnRlcnZhbCB8fCB0aGlzLl9jb25maWcuaW50ZXJ2YWxcbiAgICB9XG4gIH1cblxuICBfc2xpZGUoZGlyZWN0aW9uT3JPcmRlciwgZWxlbWVudCkge1xuICAgIGNvbnN0IG9yZGVyID0gdGhpcy5fZGlyZWN0aW9uVG9PcmRlcihkaXJlY3Rpb25Pck9yZGVyKVxuICAgIGNvbnN0IGFjdGl2ZUVsZW1lbnQgPSBTZWxlY3RvckVuZ2luZS5maW5kT25lKFNFTEVDVE9SX0FDVElWRV9JVEVNLCB0aGlzLl9lbGVtZW50KVxuICAgIGNvbnN0IGFjdGl2ZUVsZW1lbnRJbmRleCA9IHRoaXMuX2dldEl0ZW1JbmRleChhY3RpdmVFbGVtZW50KVxuICAgIGNvbnN0IG5leHRFbGVtZW50ID0gZWxlbWVudCB8fCB0aGlzLl9nZXRJdGVtQnlPcmRlcihvcmRlciwgYWN0aXZlRWxlbWVudClcblxuICAgIGNvbnN0IG5leHRFbGVtZW50SW5kZXggPSB0aGlzLl9nZXRJdGVtSW5kZXgobmV4dEVsZW1lbnQpXG4gICAgY29uc3QgaXNDeWNsaW5nID0gQm9vbGVhbih0aGlzLl9pbnRlcnZhbClcblxuICAgIGNvbnN0IGlzTmV4dCA9IG9yZGVyID09PSBPUkRFUl9ORVhUXG4gICAgY29uc3QgZGlyZWN0aW9uYWxDbGFzc05hbWUgPSBpc05leHQgPyBDTEFTU19OQU1FX1NUQVJUIDogQ0xBU1NfTkFNRV9FTkRcbiAgICBjb25zdCBvcmRlckNsYXNzTmFtZSA9IGlzTmV4dCA/IENMQVNTX05BTUVfTkVYVCA6IENMQVNTX05BTUVfUFJFVlxuICAgIGNvbnN0IGV2ZW50RGlyZWN0aW9uTmFtZSA9IHRoaXMuX29yZGVyVG9EaXJlY3Rpb24ob3JkZXIpXG5cbiAgICBpZiAobmV4dEVsZW1lbnQgJiYgbmV4dEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfQUNUSVZFKSkge1xuICAgICAgdGhpcy5faXNTbGlkaW5nID0gZmFsc2VcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmICh0aGlzLl9pc1NsaWRpbmcpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IHNsaWRlRXZlbnQgPSB0aGlzLl90cmlnZ2VyU2xpZGVFdmVudChuZXh0RWxlbWVudCwgZXZlbnREaXJlY3Rpb25OYW1lKVxuICAgIGlmIChzbGlkZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmICghYWN0aXZlRWxlbWVudCB8fCAhbmV4dEVsZW1lbnQpIHtcbiAgICAgIC8vIFNvbWUgd2VpcmRuZXNzIGlzIGhhcHBlbmluZywgc28gd2UgYmFpbFxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5faXNTbGlkaW5nID0gdHJ1ZVxuXG4gICAgaWYgKGlzQ3ljbGluZykge1xuICAgICAgdGhpcy5wYXVzZSgpXG4gICAgfVxuXG4gICAgdGhpcy5fc2V0QWN0aXZlSW5kaWNhdG9yRWxlbWVudChuZXh0RWxlbWVudClcbiAgICB0aGlzLl9hY3RpdmVFbGVtZW50ID0gbmV4dEVsZW1lbnRcblxuICAgIGNvbnN0IHRyaWdnZXJTbGlkRXZlbnQgPSAoKSA9PiB7XG4gICAgICBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9TTElELCB7XG4gICAgICAgIHJlbGF0ZWRUYXJnZXQ6IG5leHRFbGVtZW50LFxuICAgICAgICBkaXJlY3Rpb246IGV2ZW50RGlyZWN0aW9uTmFtZSxcbiAgICAgICAgZnJvbTogYWN0aXZlRWxlbWVudEluZGV4LFxuICAgICAgICB0bzogbmV4dEVsZW1lbnRJbmRleFxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9TTElERSkpIHtcbiAgICAgIG5leHRFbGVtZW50LmNsYXNzTGlzdC5hZGQob3JkZXJDbGFzc05hbWUpXG5cbiAgICAgIHJlZmxvdyhuZXh0RWxlbWVudClcblxuICAgICAgYWN0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGRpcmVjdGlvbmFsQ2xhc3NOYW1lKVxuICAgICAgbmV4dEVsZW1lbnQuY2xhc3NMaXN0LmFkZChkaXJlY3Rpb25hbENsYXNzTmFtZSlcblxuICAgICAgY29uc3QgY29tcGxldGVDYWxsQmFjayA9ICgpID0+IHtcbiAgICAgICAgbmV4dEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShkaXJlY3Rpb25hbENsYXNzTmFtZSwgb3JkZXJDbGFzc05hbWUpXG4gICAgICAgIG5leHRFbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9BQ1RJVkUpXG5cbiAgICAgICAgYWN0aXZlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfQUNUSVZFLCBvcmRlckNsYXNzTmFtZSwgZGlyZWN0aW9uYWxDbGFzc05hbWUpXG5cbiAgICAgICAgdGhpcy5faXNTbGlkaW5nID0gZmFsc2VcblxuICAgICAgICBzZXRUaW1lb3V0KHRyaWdnZXJTbGlkRXZlbnQsIDApXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsQmFjaywgYWN0aXZlRWxlbWVudCwgdHJ1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgYWN0aXZlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfQUNUSVZFKVxuICAgICAgbmV4dEVsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0FDVElWRSlcblxuICAgICAgdGhpcy5faXNTbGlkaW5nID0gZmFsc2VcbiAgICAgIHRyaWdnZXJTbGlkRXZlbnQoKVxuICAgIH1cblxuICAgIGlmIChpc0N5Y2xpbmcpIHtcbiAgICAgIHRoaXMuY3ljbGUoKVxuICAgIH1cbiAgfVxuXG4gIF9kaXJlY3Rpb25Ub09yZGVyKGRpcmVjdGlvbikge1xuICAgIGlmICghW0RJUkVDVElPTl9SSUdIVCwgRElSRUNUSU9OX0xFRlRdLmluY2x1ZGVzKGRpcmVjdGlvbikpIHtcbiAgICAgIHJldHVybiBkaXJlY3Rpb25cbiAgICB9XG5cbiAgICBpZiAoaXNSVEwoKSkge1xuICAgICAgcmV0dXJuIGRpcmVjdGlvbiA9PT0gRElSRUNUSU9OX0xFRlQgPyBPUkRFUl9QUkVWIDogT1JERVJfTkVYVFxuICAgIH1cblxuICAgIHJldHVybiBkaXJlY3Rpb24gPT09IERJUkVDVElPTl9MRUZUID8gT1JERVJfTkVYVCA6IE9SREVSX1BSRVZcbiAgfVxuXG4gIF9vcmRlclRvRGlyZWN0aW9uKG9yZGVyKSB7XG4gICAgaWYgKCFbT1JERVJfTkVYVCwgT1JERVJfUFJFVl0uaW5jbHVkZXMob3JkZXIpKSB7XG4gICAgICByZXR1cm4gb3JkZXJcbiAgICB9XG5cbiAgICBpZiAoaXNSVEwoKSkge1xuICAgICAgcmV0dXJuIG9yZGVyID09PSBPUkRFUl9QUkVWID8gRElSRUNUSU9OX0xFRlQgOiBESVJFQ1RJT05fUklHSFRcbiAgICB9XG5cbiAgICByZXR1cm4gb3JkZXIgPT09IE9SREVSX1BSRVYgPyBESVJFQ1RJT05fUklHSFQgOiBESVJFQ1RJT05fTEVGVFxuICB9XG5cbiAgLy8gU3RhdGljXG5cbiAgc3RhdGljIGNhcm91c2VsSW50ZXJmYWNlKGVsZW1lbnQsIGNvbmZpZykge1xuICAgIGNvbnN0IGRhdGEgPSBDYXJvdXNlbC5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIGNvbmZpZylcblxuICAgIGxldCB7IF9jb25maWcgfSA9IGRhdGFcbiAgICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIF9jb25maWcgPSB7XG4gICAgICAgIC4uLl9jb25maWcsXG4gICAgICAgIC4uLmNvbmZpZ1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGFjdGlvbiA9IHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnID8gY29uZmlnIDogX2NvbmZpZy5zbGlkZVxuXG4gICAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdudW1iZXInKSB7XG4gICAgICBkYXRhLnRvKGNvbmZpZylcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBhY3Rpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAodHlwZW9mIGRhdGFbYWN0aW9uXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgTm8gbWV0aG9kIG5hbWVkIFwiJHthY3Rpb259XCJgKVxuICAgICAgfVxuXG4gICAgICBkYXRhW2FjdGlvbl0oKVxuICAgIH0gZWxzZSBpZiAoX2NvbmZpZy5pbnRlcnZhbCAmJiBfY29uZmlnLnJpZGUpIHtcbiAgICAgIGRhdGEucGF1c2UoKVxuICAgICAgZGF0YS5jeWNsZSgpXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGpRdWVyeUludGVyZmFjZShjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIENhcm91c2VsLmNhcm91c2VsSW50ZXJmYWNlKHRoaXMsIGNvbmZpZylcbiAgICB9KVxuICB9XG5cbiAgc3RhdGljIGRhdGFBcGlDbGlja0hhbmRsZXIoZXZlbnQpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBnZXRFbGVtZW50RnJvbVNlbGVjdG9yKHRoaXMpXG5cbiAgICBpZiAoIXRhcmdldCB8fCAhdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX0NBUk9VU0VMKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgLi4uTWFuaXB1bGF0b3IuZ2V0RGF0YUF0dHJpYnV0ZXModGFyZ2V0KSxcbiAgICAgIC4uLk1hbmlwdWxhdG9yLmdldERhdGFBdHRyaWJ1dGVzKHRoaXMpXG4gICAgfVxuICAgIGNvbnN0IHNsaWRlSW5kZXggPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1icy1zbGlkZS10bycpXG5cbiAgICBpZiAoc2xpZGVJbmRleCkge1xuICAgICAgY29uZmlnLmludGVydmFsID0gZmFsc2VcbiAgICB9XG5cbiAgICBDYXJvdXNlbC5jYXJvdXNlbEludGVyZmFjZSh0YXJnZXQsIGNvbmZpZylcblxuICAgIGlmIChzbGlkZUluZGV4KSB7XG4gICAgICBDYXJvdXNlbC5nZXRJbnN0YW5jZSh0YXJnZXQpLnRvKHNsaWRlSW5kZXgpXG4gICAgfVxuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICB9XG59XG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBEYXRhIEFwaSBpbXBsZW1lbnRhdGlvblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9DTElDS19EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9TTElERSwgQ2Fyb3VzZWwuZGF0YUFwaUNsaWNrSGFuZGxlcilcblxuRXZlbnRIYW5kbGVyLm9uKHdpbmRvdywgRVZFTlRfTE9BRF9EQVRBX0FQSSwgKCkgPT4ge1xuICBjb25zdCBjYXJvdXNlbHMgPSBTZWxlY3RvckVuZ2luZS5maW5kKFNFTEVDVE9SX0RBVEFfUklERSlcblxuICBmb3IgKGxldCBpID0gMCwgbGVuID0gY2Fyb3VzZWxzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgQ2Fyb3VzZWwuY2Fyb3VzZWxJbnRlcmZhY2UoY2Fyb3VzZWxzW2ldLCBDYXJvdXNlbC5nZXRJbnN0YW5jZShjYXJvdXNlbHNbaV0pKVxuICB9XG59KVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogalF1ZXJ5XG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIGFkZCAuQ2Fyb3VzZWwgdG8galF1ZXJ5IG9ubHkgaWYgalF1ZXJ5IGlzIHByZXNlbnRcbiAqL1xuXG5kZWZpbmVKUXVlcnlQbHVnaW4oQ2Fyb3VzZWwpXG5cbmV4cG9ydCBkZWZhdWx0IENhcm91c2VsXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBCb290c3RyYXAgKHY1LjEuMyk6IGNvbGxhcHNlLmpzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuaW1wb3J0IHtcbiAgZGVmaW5lSlF1ZXJ5UGx1Z2luLFxuICBnZXRFbGVtZW50LFxuICBnZXRTZWxlY3RvckZyb21FbGVtZW50LFxuICBnZXRFbGVtZW50RnJvbVNlbGVjdG9yLFxuICByZWZsb3csXG4gIHR5cGVDaGVja0NvbmZpZ1xufSBmcm9tICcuL3V0aWwvaW5kZXgnXG5pbXBvcnQgRGF0YSBmcm9tICcuL2RvbS9kYXRhJ1xuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tICcuL2RvbS9ldmVudC1oYW5kbGVyJ1xuaW1wb3J0IE1hbmlwdWxhdG9yIGZyb20gJy4vZG9tL21hbmlwdWxhdG9yJ1xuaW1wb3J0IFNlbGVjdG9yRW5naW5lIGZyb20gJy4vZG9tL3NlbGVjdG9yLWVuZ2luZSdcbmltcG9ydCBCYXNlQ29tcG9uZW50IGZyb20gJy4vYmFzZS1jb21wb25lbnQnXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBDb25zdGFudHNcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmNvbnN0IE5BTUUgPSAnY29sbGFwc2UnXG5jb25zdCBEQVRBX0tFWSA9ICdicy5jb2xsYXBzZSdcbmNvbnN0IEVWRU5UX0tFWSA9IGAuJHtEQVRBX0tFWX1gXG5jb25zdCBEQVRBX0FQSV9LRVkgPSAnLmRhdGEtYXBpJ1xuXG5jb25zdCBEZWZhdWx0ID0ge1xuICB0b2dnbGU6IHRydWUsXG4gIHBhcmVudDogbnVsbFxufVxuXG5jb25zdCBEZWZhdWx0VHlwZSA9IHtcbiAgdG9nZ2xlOiAnYm9vbGVhbicsXG4gIHBhcmVudDogJyhudWxsfGVsZW1lbnQpJ1xufVxuXG5jb25zdCBFVkVOVF9TSE9XID0gYHNob3cke0VWRU5UX0tFWX1gXG5jb25zdCBFVkVOVF9TSE9XTiA9IGBzaG93biR7RVZFTlRfS0VZfWBcbmNvbnN0IEVWRU5UX0hJREUgPSBgaGlkZSR7RVZFTlRfS0VZfWBcbmNvbnN0IEVWRU5UX0hJRERFTiA9IGBoaWRkZW4ke0VWRU5UX0tFWX1gXG5jb25zdCBFVkVOVF9DTElDS19EQVRBX0FQSSA9IGBjbGljayR7RVZFTlRfS0VZfSR7REFUQV9BUElfS0VZfWBcblxuY29uc3QgQ0xBU1NfTkFNRV9TSE9XID0gJ3Nob3cnXG5jb25zdCBDTEFTU19OQU1FX0NPTExBUFNFID0gJ2NvbGxhcHNlJ1xuY29uc3QgQ0xBU1NfTkFNRV9DT0xMQVBTSU5HID0gJ2NvbGxhcHNpbmcnXG5jb25zdCBDTEFTU19OQU1FX0NPTExBUFNFRCA9ICdjb2xsYXBzZWQnXG5jb25zdCBDTEFTU19OQU1FX0RFRVBFUl9DSElMRFJFTiA9IGA6c2NvcGUgLiR7Q0xBU1NfTkFNRV9DT0xMQVBTRX0gLiR7Q0xBU1NfTkFNRV9DT0xMQVBTRX1gXG5jb25zdCBDTEFTU19OQU1FX0hPUklaT05UQUwgPSAnY29sbGFwc2UtaG9yaXpvbnRhbCdcblxuY29uc3QgV0lEVEggPSAnd2lkdGgnXG5jb25zdCBIRUlHSFQgPSAnaGVpZ2h0J1xuXG5jb25zdCBTRUxFQ1RPUl9BQ1RJVkVTID0gJy5jb2xsYXBzZS5zaG93LCAuY29sbGFwc2UuY29sbGFwc2luZydcbmNvbnN0IFNFTEVDVE9SX0RBVEFfVE9HR0xFID0gJ1tkYXRhLWJzLXRvZ2dsZT1cImNvbGxhcHNlXCJdJ1xuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQ2xhc3MgRGVmaW5pdGlvblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuY2xhc3MgQ29sbGFwc2UgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoZWxlbWVudCwgY29uZmlnKSB7XG4gICAgc3VwZXIoZWxlbWVudClcblxuICAgIHRoaXMuX2lzVHJhbnNpdGlvbmluZyA9IGZhbHNlXG4gICAgdGhpcy5fY29uZmlnID0gdGhpcy5fZ2V0Q29uZmlnKGNvbmZpZylcbiAgICB0aGlzLl90cmlnZ2VyQXJyYXkgPSBbXVxuXG4gICAgY29uc3QgdG9nZ2xlTGlzdCA9IFNlbGVjdG9yRW5naW5lLmZpbmQoU0VMRUNUT1JfREFUQV9UT0dHTEUpXG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdG9nZ2xlTGlzdC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3QgZWxlbSA9IHRvZ2dsZUxpc3RbaV1cbiAgICAgIGNvbnN0IHNlbGVjdG9yID0gZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlbGVtKVxuICAgICAgY29uc3QgZmlsdGVyRWxlbWVudCA9IFNlbGVjdG9yRW5naW5lLmZpbmQoc2VsZWN0b3IpXG4gICAgICAgIC5maWx0ZXIoZm91bmRFbGVtID0+IGZvdW5kRWxlbSA9PT0gdGhpcy5fZWxlbWVudClcblxuICAgICAgaWYgKHNlbGVjdG9yICE9PSBudWxsICYmIGZpbHRlckVsZW1lbnQubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdG9yID0gc2VsZWN0b3JcbiAgICAgICAgdGhpcy5fdHJpZ2dlckFycmF5LnB1c2goZWxlbSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9pbml0aWFsaXplQ2hpbGRyZW4oKVxuXG4gICAgaWYgKCF0aGlzLl9jb25maWcucGFyZW50KSB7XG4gICAgICB0aGlzLl9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3ModGhpcy5fdHJpZ2dlckFycmF5LCB0aGlzLl9pc1Nob3duKCkpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2NvbmZpZy50b2dnbGUpIHtcbiAgICAgIHRoaXMudG9nZ2xlKClcbiAgICB9XG4gIH1cblxuICAvLyBHZXR0ZXJzXG5cbiAgc3RhdGljIGdldCBEZWZhdWx0KCkge1xuICAgIHJldHVybiBEZWZhdWx0XG4gIH1cblxuICBzdGF0aWMgZ2V0IE5BTUUoKSB7XG4gICAgcmV0dXJuIE5BTUVcbiAgfVxuXG4gIC8vIFB1YmxpY1xuXG4gIHRvZ2dsZSgpIHtcbiAgICBpZiAodGhpcy5faXNTaG93bigpKSB7XG4gICAgICB0aGlzLmhpZGUoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNob3coKVxuICAgIH1cbiAgfVxuXG4gIHNob3coKSB7XG4gICAgaWYgKHRoaXMuX2lzVHJhbnNpdGlvbmluZyB8fCB0aGlzLl9pc1Nob3duKCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGxldCBhY3RpdmVzID0gW11cbiAgICBsZXQgYWN0aXZlc0RhdGFcblxuICAgIGlmICh0aGlzLl9jb25maWcucGFyZW50KSB7XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IFNlbGVjdG9yRW5naW5lLmZpbmQoQ0xBU1NfTkFNRV9ERUVQRVJfQ0hJTERSRU4sIHRoaXMuX2NvbmZpZy5wYXJlbnQpXG4gICAgICBhY3RpdmVzID0gU2VsZWN0b3JFbmdpbmUuZmluZChTRUxFQ1RPUl9BQ1RJVkVTLCB0aGlzLl9jb25maWcucGFyZW50KS5maWx0ZXIoZWxlbSA9PiAhY2hpbGRyZW4uaW5jbHVkZXMoZWxlbSkpIC8vIHJlbW92ZSBjaGlsZHJlbiBpZiBncmVhdGVyIGRlcHRoXG4gICAgfVxuXG4gICAgY29uc3QgY29udGFpbmVyID0gU2VsZWN0b3JFbmdpbmUuZmluZE9uZSh0aGlzLl9zZWxlY3RvcilcbiAgICBpZiAoYWN0aXZlcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHRlbXBBY3RpdmVEYXRhID0gYWN0aXZlcy5maW5kKGVsZW0gPT4gY29udGFpbmVyICE9PSBlbGVtKVxuICAgICAgYWN0aXZlc0RhdGEgPSB0ZW1wQWN0aXZlRGF0YSA/IENvbGxhcHNlLmdldEluc3RhbmNlKHRlbXBBY3RpdmVEYXRhKSA6IG51bGxcblxuICAgICAgaWYgKGFjdGl2ZXNEYXRhICYmIGFjdGl2ZXNEYXRhLl9pc1RyYW5zaXRpb25pbmcpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhcnRFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX1NIT1cpXG4gICAgaWYgKHN0YXJ0RXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgYWN0aXZlcy5mb3JFYWNoKGVsZW1BY3RpdmUgPT4ge1xuICAgICAgaWYgKGNvbnRhaW5lciAhPT0gZWxlbUFjdGl2ZSkge1xuICAgICAgICBDb2xsYXBzZS5nZXRPckNyZWF0ZUluc3RhbmNlKGVsZW1BY3RpdmUsIHsgdG9nZ2xlOiBmYWxzZSB9KS5oaWRlKClcbiAgICAgIH1cblxuICAgICAgaWYgKCFhY3RpdmVzRGF0YSkge1xuICAgICAgICBEYXRhLnNldChlbGVtQWN0aXZlLCBEQVRBX0tFWSwgbnVsbClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY29uc3QgZGltZW5zaW9uID0gdGhpcy5fZ2V0RGltZW5zaW9uKClcblxuICAgIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX0NPTExBUFNFKVxuICAgIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0NPTExBUFNJTkcpXG5cbiAgICB0aGlzLl9lbGVtZW50LnN0eWxlW2RpbWVuc2lvbl0gPSAwXG5cbiAgICB0aGlzLl9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3ModGhpcy5fdHJpZ2dlckFycmF5LCB0cnVlKVxuICAgIHRoaXMuX2lzVHJhbnNpdGlvbmluZyA9IHRydWVcblxuICAgIGNvbnN0IGNvbXBsZXRlID0gKCkgPT4ge1xuICAgICAgdGhpcy5faXNUcmFuc2l0aW9uaW5nID0gZmFsc2VcblxuICAgICAgdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfQ09MTEFQU0lORylcbiAgICAgIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0NPTExBUFNFLCBDTEFTU19OQU1FX1NIT1cpXG5cbiAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGVbZGltZW5zaW9uXSA9ICcnXG5cbiAgICAgIEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX1NIT1dOKVxuICAgIH1cblxuICAgIGNvbnN0IGNhcGl0YWxpemVkRGltZW5zaW9uID0gZGltZW5zaW9uWzBdLnRvVXBwZXJDYXNlKCkgKyBkaW1lbnNpb24uc2xpY2UoMSlcbiAgICBjb25zdCBzY3JvbGxTaXplID0gYHNjcm9sbCR7Y2FwaXRhbGl6ZWREaW1lbnNpb259YFxuXG4gICAgdGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZSwgdGhpcy5fZWxlbWVudCwgdHJ1ZSlcbiAgICB0aGlzLl9lbGVtZW50LnN0eWxlW2RpbWVuc2lvbl0gPSBgJHt0aGlzLl9lbGVtZW50W3Njcm9sbFNpemVdfXB4YFxuICB9XG5cbiAgaGlkZSgpIHtcbiAgICBpZiAodGhpcy5faXNUcmFuc2l0aW9uaW5nIHx8ICF0aGlzLl9pc1Nob3duKCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IHN0YXJ0RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9ISURFKVxuICAgIGlmIChzdGFydEV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGRpbWVuc2lvbiA9IHRoaXMuX2dldERpbWVuc2lvbigpXG5cbiAgICB0aGlzLl9lbGVtZW50LnN0eWxlW2RpbWVuc2lvbl0gPSBgJHt0aGlzLl9lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpW2RpbWVuc2lvbl19cHhgXG5cbiAgICByZWZsb3codGhpcy5fZWxlbWVudClcblxuICAgIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0NPTExBUFNJTkcpXG4gICAgdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfQ09MTEFQU0UsIENMQVNTX05BTUVfU0hPVylcblxuICAgIGNvbnN0IHRyaWdnZXJBcnJheUxlbmd0aCA9IHRoaXMuX3RyaWdnZXJBcnJheS5sZW5ndGhcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyaWdnZXJBcnJheUxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCB0cmlnZ2VyID0gdGhpcy5fdHJpZ2dlckFycmF5W2ldXG4gICAgICBjb25zdCBlbGVtID0gZ2V0RWxlbWVudEZyb21TZWxlY3Rvcih0cmlnZ2VyKVxuXG4gICAgICBpZiAoZWxlbSAmJiAhdGhpcy5faXNTaG93bihlbGVtKSkge1xuICAgICAgICB0aGlzLl9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MoW3RyaWdnZXJdLCBmYWxzZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9pc1RyYW5zaXRpb25pbmcgPSB0cnVlXG5cbiAgICBjb25zdCBjb21wbGV0ZSA9ICgpID0+IHtcbiAgICAgIHRoaXMuX2lzVHJhbnNpdGlvbmluZyA9IGZhbHNlXG4gICAgICB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9DT0xMQVBTSU5HKVxuICAgICAgdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfQ09MTEFQU0UpXG4gICAgICBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9ISURERU4pXG4gICAgfVxuXG4gICAgdGhpcy5fZWxlbWVudC5zdHlsZVtkaW1lbnNpb25dID0gJydcblxuICAgIHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGUsIHRoaXMuX2VsZW1lbnQsIHRydWUpXG4gIH1cblxuICBfaXNTaG93bihlbGVtZW50ID0gdGhpcy5fZWxlbWVudCkge1xuICAgIHJldHVybiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX1NIT1cpXG4gIH1cblxuICAvLyBQcml2YXRlXG5cbiAgX2dldENvbmZpZyhjb25maWcpIHtcbiAgICBjb25maWcgPSB7XG4gICAgICAuLi5EZWZhdWx0LFxuICAgICAgLi4uTWFuaXB1bGF0b3IuZ2V0RGF0YUF0dHJpYnV0ZXModGhpcy5fZWxlbWVudCksXG4gICAgICAuLi5jb25maWdcbiAgICB9XG4gICAgY29uZmlnLnRvZ2dsZSA9IEJvb2xlYW4oY29uZmlnLnRvZ2dsZSkgLy8gQ29lcmNlIHN0cmluZyB2YWx1ZXNcbiAgICBjb25maWcucGFyZW50ID0gZ2V0RWxlbWVudChjb25maWcucGFyZW50KVxuICAgIHR5cGVDaGVja0NvbmZpZyhOQU1FLCBjb25maWcsIERlZmF1bHRUeXBlKVxuICAgIHJldHVybiBjb25maWdcbiAgfVxuXG4gIF9nZXREaW1lbnNpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfSE9SSVpPTlRBTCkgPyBXSURUSCA6IEhFSUdIVFxuICB9XG5cbiAgX2luaXRpYWxpemVDaGlsZHJlbigpIHtcbiAgICBpZiAoIXRoaXMuX2NvbmZpZy5wYXJlbnQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGNoaWxkcmVuID0gU2VsZWN0b3JFbmdpbmUuZmluZChDTEFTU19OQU1FX0RFRVBFUl9DSElMRFJFTiwgdGhpcy5fY29uZmlnLnBhcmVudClcbiAgICBTZWxlY3RvckVuZ2luZS5maW5kKFNFTEVDVE9SX0RBVEFfVE9HR0xFLCB0aGlzLl9jb25maWcucGFyZW50KS5maWx0ZXIoZWxlbSA9PiAhY2hpbGRyZW4uaW5jbHVkZXMoZWxlbSkpXG4gICAgICAuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBnZXRFbGVtZW50RnJvbVNlbGVjdG9yKGVsZW1lbnQpXG5cbiAgICAgICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICAgICAgdGhpcy5fYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKFtlbGVtZW50XSwgdGhpcy5faXNTaG93bihzZWxlY3RlZCkpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gIH1cblxuICBfYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKHRyaWdnZXJBcnJheSwgaXNPcGVuKSB7XG4gICAgaWYgKCF0cmlnZ2VyQXJyYXkubGVuZ3RoKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0cmlnZ2VyQXJyYXkuZm9yRWFjaChlbGVtID0+IHtcbiAgICAgIGlmIChpc09wZW4pIHtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfQ09MTEFQU0VEKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfQ09MTEFQU0VEKVxuICAgICAgfVxuXG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGlzT3BlbilcbiAgICB9KVxuICB9XG5cbiAgLy8gU3RhdGljXG5cbiAgc3RhdGljIGpRdWVyeUludGVyZmFjZShjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IF9jb25maWcgPSB7fVxuICAgICAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnICYmIC9zaG93fGhpZGUvLnRlc3QoY29uZmlnKSkge1xuICAgICAgICBfY29uZmlnLnRvZ2dsZSA9IGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRhdGEgPSBDb2xsYXBzZS5nZXRPckNyZWF0ZUluc3RhbmNlKHRoaXMsIF9jb25maWcpXG5cbiAgICAgIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAodHlwZW9mIGRhdGFbY29uZmlnXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBObyBtZXRob2QgbmFtZWQgXCIke2NvbmZpZ31cImApXG4gICAgICAgIH1cblxuICAgICAgICBkYXRhW2NvbmZpZ10oKVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIERhdGEgQXBpIGltcGxlbWVudGF0aW9uXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5FdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0NMSUNLX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gIC8vIHByZXZlbnREZWZhdWx0IG9ubHkgZm9yIDxhPiBlbGVtZW50cyAod2hpY2ggY2hhbmdlIHRoZSBVUkwpIG5vdCBpbnNpZGUgdGhlIGNvbGxhcHNpYmxlIGVsZW1lbnRcbiAgaWYgKGV2ZW50LnRhcmdldC50YWdOYW1lID09PSAnQScgfHwgKGV2ZW50LmRlbGVnYXRlVGFyZ2V0ICYmIGV2ZW50LmRlbGVnYXRlVGFyZ2V0LnRhZ05hbWUgPT09ICdBJykpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gIH1cblxuICBjb25zdCBzZWxlY3RvciA9IGdldFNlbGVjdG9yRnJvbUVsZW1lbnQodGhpcylcbiAgY29uc3Qgc2VsZWN0b3JFbGVtZW50cyA9IFNlbGVjdG9yRW5naW5lLmZpbmQoc2VsZWN0b3IpXG5cbiAgc2VsZWN0b3JFbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgIENvbGxhcHNlLmdldE9yQ3JlYXRlSW5zdGFuY2UoZWxlbWVudCwgeyB0b2dnbGU6IGZhbHNlIH0pLnRvZ2dsZSgpXG4gIH0pXG59KVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogalF1ZXJ5XG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIGFkZCAuQ29sbGFwc2UgdG8galF1ZXJ5IG9ubHkgaWYgalF1ZXJ5IGlzIHByZXNlbnRcbiAqL1xuXG5kZWZpbmVKUXVlcnlQbHVnaW4oQ29sbGFwc2UpXG5cbmV4cG9ydCBkZWZhdWx0IENvbGxhcHNlXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBCb290c3RyYXAgKHY1LjEuMyk6IGRyb3Bkb3duLmpzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuaW1wb3J0ICogYXMgUG9wcGVyIGZyb20gJ0Bwb3BwZXJqcy9jb3JlJ1xuXG5pbXBvcnQge1xuICBkZWZpbmVKUXVlcnlQbHVnaW4sXG4gIGdldEVsZW1lbnQsXG4gIGdldEVsZW1lbnRGcm9tU2VsZWN0b3IsXG4gIGdldE5leHRBY3RpdmVFbGVtZW50LFxuICBpc0Rpc2FibGVkLFxuICBpc0VsZW1lbnQsXG4gIGlzUlRMLFxuICBpc1Zpc2libGUsXG4gIG5vb3AsXG4gIHR5cGVDaGVja0NvbmZpZ1xufSBmcm9tICcuL3V0aWwvaW5kZXgnXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gJy4vZG9tL2V2ZW50LWhhbmRsZXInXG5pbXBvcnQgTWFuaXB1bGF0b3IgZnJvbSAnLi9kb20vbWFuaXB1bGF0b3InXG5pbXBvcnQgU2VsZWN0b3JFbmdpbmUgZnJvbSAnLi9kb20vc2VsZWN0b3ItZW5naW5lJ1xuaW1wb3J0IEJhc2VDb21wb25lbnQgZnJvbSAnLi9iYXNlLWNvbXBvbmVudCdcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvbnN0YW50c1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuY29uc3QgTkFNRSA9ICdkcm9wZG93bidcbmNvbnN0IERBVEFfS0VZID0gJ2JzLmRyb3Bkb3duJ1xuY29uc3QgRVZFTlRfS0VZID0gYC4ke0RBVEFfS0VZfWBcbmNvbnN0IERBVEFfQVBJX0tFWSA9ICcuZGF0YS1hcGknXG5cbmNvbnN0IEVTQ0FQRV9LRVkgPSAnRXNjYXBlJ1xuY29uc3QgU1BBQ0VfS0VZID0gJ1NwYWNlJ1xuY29uc3QgVEFCX0tFWSA9ICdUYWInXG5jb25zdCBBUlJPV19VUF9LRVkgPSAnQXJyb3dVcCdcbmNvbnN0IEFSUk9XX0RPV05fS0VZID0gJ0Fycm93RG93bidcbmNvbnN0IFJJR0hUX01PVVNFX0JVVFRPTiA9IDIgLy8gTW91c2VFdmVudC5idXR0b24gdmFsdWUgZm9yIHRoZSBzZWNvbmRhcnkgYnV0dG9uLCB1c3VhbGx5IHRoZSByaWdodCBidXR0b25cblxuY29uc3QgUkVHRVhQX0tFWURPV04gPSBuZXcgUmVnRXhwKGAke0FSUk9XX1VQX0tFWX18JHtBUlJPV19ET1dOX0tFWX18JHtFU0NBUEVfS0VZfWApXG5cbmNvbnN0IEVWRU5UX0hJREUgPSBgaGlkZSR7RVZFTlRfS0VZfWBcbmNvbnN0IEVWRU5UX0hJRERFTiA9IGBoaWRkZW4ke0VWRU5UX0tFWX1gXG5jb25zdCBFVkVOVF9TSE9XID0gYHNob3cke0VWRU5UX0tFWX1gXG5jb25zdCBFVkVOVF9TSE9XTiA9IGBzaG93biR7RVZFTlRfS0VZfWBcbmNvbnN0IEVWRU5UX0NMSUNLX0RBVEFfQVBJID0gYGNsaWNrJHtFVkVOVF9LRVl9JHtEQVRBX0FQSV9LRVl9YFxuY29uc3QgRVZFTlRfS0VZRE9XTl9EQVRBX0FQSSA9IGBrZXlkb3duJHtFVkVOVF9LRVl9JHtEQVRBX0FQSV9LRVl9YFxuY29uc3QgRVZFTlRfS0VZVVBfREFUQV9BUEkgPSBga2V5dXAke0VWRU5UX0tFWX0ke0RBVEFfQVBJX0tFWX1gXG5cbmNvbnN0IENMQVNTX05BTUVfU0hPVyA9ICdzaG93J1xuY29uc3QgQ0xBU1NfTkFNRV9EUk9QVVAgPSAnZHJvcHVwJ1xuY29uc3QgQ0xBU1NfTkFNRV9EUk9QRU5EID0gJ2Ryb3BlbmQnXG5jb25zdCBDTEFTU19OQU1FX0RST1BTVEFSVCA9ICdkcm9wc3RhcnQnXG5jb25zdCBDTEFTU19OQU1FX05BVkJBUiA9ICduYXZiYXInXG5cbmNvbnN0IFNFTEVDVE9SX0RBVEFfVE9HR0xFID0gJ1tkYXRhLWJzLXRvZ2dsZT1cImRyb3Bkb3duXCJdJ1xuY29uc3QgU0VMRUNUT1JfTUVOVSA9ICcuZHJvcGRvd24tbWVudSdcbmNvbnN0IFNFTEVDVE9SX05BVkJBUl9OQVYgPSAnLm5hdmJhci1uYXYnXG5jb25zdCBTRUxFQ1RPUl9WSVNJQkxFX0lURU1TID0gJy5kcm9wZG93bi1tZW51IC5kcm9wZG93bi1pdGVtOm5vdCguZGlzYWJsZWQpOm5vdCg6ZGlzYWJsZWQpJ1xuXG5jb25zdCBQTEFDRU1FTlRfVE9QID0gaXNSVEwoKSA/ICd0b3AtZW5kJyA6ICd0b3Atc3RhcnQnXG5jb25zdCBQTEFDRU1FTlRfVE9QRU5EID0gaXNSVEwoKSA/ICd0b3Atc3RhcnQnIDogJ3RvcC1lbmQnXG5jb25zdCBQTEFDRU1FTlRfQk9UVE9NID0gaXNSVEwoKSA/ICdib3R0b20tZW5kJyA6ICdib3R0b20tc3RhcnQnXG5jb25zdCBQTEFDRU1FTlRfQk9UVE9NRU5EID0gaXNSVEwoKSA/ICdib3R0b20tc3RhcnQnIDogJ2JvdHRvbS1lbmQnXG5jb25zdCBQTEFDRU1FTlRfUklHSFQgPSBpc1JUTCgpID8gJ2xlZnQtc3RhcnQnIDogJ3JpZ2h0LXN0YXJ0J1xuY29uc3QgUExBQ0VNRU5UX0xFRlQgPSBpc1JUTCgpID8gJ3JpZ2h0LXN0YXJ0JyA6ICdsZWZ0LXN0YXJ0J1xuXG5jb25zdCBEZWZhdWx0ID0ge1xuICBvZmZzZXQ6IFswLCAyXSxcbiAgYm91bmRhcnk6ICdjbGlwcGluZ1BhcmVudHMnLFxuICByZWZlcmVuY2U6ICd0b2dnbGUnLFxuICBkaXNwbGF5OiAnZHluYW1pYycsXG4gIHBvcHBlckNvbmZpZzogbnVsbCxcbiAgYXV0b0Nsb3NlOiB0cnVlXG59XG5cbmNvbnN0IERlZmF1bHRUeXBlID0ge1xuICBvZmZzZXQ6ICcoYXJyYXl8c3RyaW5nfGZ1bmN0aW9uKScsXG4gIGJvdW5kYXJ5OiAnKHN0cmluZ3xlbGVtZW50KScsXG4gIHJlZmVyZW5jZTogJyhzdHJpbmd8ZWxlbWVudHxvYmplY3QpJyxcbiAgZGlzcGxheTogJ3N0cmluZycsXG4gIHBvcHBlckNvbmZpZzogJyhudWxsfG9iamVjdHxmdW5jdGlvbiknLFxuICBhdXRvQ2xvc2U6ICcoYm9vbGVhbnxzdHJpbmcpJ1xufVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQ2xhc3MgRGVmaW5pdGlvblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuY2xhc3MgRHJvcGRvd24gZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoZWxlbWVudCwgY29uZmlnKSB7XG4gICAgc3VwZXIoZWxlbWVudClcblxuICAgIHRoaXMuX3BvcHBlciA9IG51bGxcbiAgICB0aGlzLl9jb25maWcgPSB0aGlzLl9nZXRDb25maWcoY29uZmlnKVxuICAgIHRoaXMuX21lbnUgPSB0aGlzLl9nZXRNZW51RWxlbWVudCgpXG4gICAgdGhpcy5faW5OYXZiYXIgPSB0aGlzLl9kZXRlY3ROYXZiYXIoKVxuICB9XG5cbiAgLy8gR2V0dGVyc1xuXG4gIHN0YXRpYyBnZXQgRGVmYXVsdCgpIHtcbiAgICByZXR1cm4gRGVmYXVsdFxuICB9XG5cbiAgc3RhdGljIGdldCBEZWZhdWx0VHlwZSgpIHtcbiAgICByZXR1cm4gRGVmYXVsdFR5cGVcbiAgfVxuXG4gIHN0YXRpYyBnZXQgTkFNRSgpIHtcbiAgICByZXR1cm4gTkFNRVxuICB9XG5cbiAgLy8gUHVibGljXG5cbiAgdG9nZ2xlKCkge1xuICAgIHJldHVybiB0aGlzLl9pc1Nob3duKCkgPyB0aGlzLmhpZGUoKSA6IHRoaXMuc2hvdygpXG4gIH1cblxuICBzaG93KCkge1xuICAgIGlmIChpc0Rpc2FibGVkKHRoaXMuX2VsZW1lbnQpIHx8IHRoaXMuX2lzU2hvd24odGhpcy5fbWVudSkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IHJlbGF0ZWRUYXJnZXQgPSB7XG4gICAgICByZWxhdGVkVGFyZ2V0OiB0aGlzLl9lbGVtZW50XG4gICAgfVxuXG4gICAgY29uc3Qgc2hvd0V2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfU0hPVywgcmVsYXRlZFRhcmdldClcblxuICAgIGlmIChzaG93RXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgcGFyZW50ID0gRHJvcGRvd24uZ2V0UGFyZW50RnJvbUVsZW1lbnQodGhpcy5fZWxlbWVudClcbiAgICAvLyBUb3RhbGx5IGRpc2FibGUgUG9wcGVyIGZvciBEcm9wZG93bnMgaW4gTmF2YmFyXG4gICAgaWYgKHRoaXMuX2luTmF2YmFyKSB7XG4gICAgICBNYW5pcHVsYXRvci5zZXREYXRhQXR0cmlidXRlKHRoaXMuX21lbnUsICdwb3BwZXInLCAnbm9uZScpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NyZWF0ZVBvcHBlcihwYXJlbnQpXG4gICAgfVxuXG4gICAgLy8gSWYgdGhpcyBpcyBhIHRvdWNoLWVuYWJsZWQgZGV2aWNlIHdlIGFkZCBleHRyYVxuICAgIC8vIGVtcHR5IG1vdXNlb3ZlciBsaXN0ZW5lcnMgdG8gdGhlIGJvZHkncyBpbW1lZGlhdGUgY2hpbGRyZW47XG4gICAgLy8gb25seSBuZWVkZWQgYmVjYXVzZSBvZiBicm9rZW4gZXZlbnQgZGVsZWdhdGlvbiBvbiBpT1NcbiAgICAvLyBodHRwczovL3d3dy5xdWlya3Ntb2RlLm9yZy9ibG9nL2FyY2hpdmVzLzIwMTQvMDIvbW91c2VfZXZlbnRfYnViLmh0bWxcbiAgICBpZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmXG4gICAgICAhcGFyZW50LmNsb3Nlc3QoU0VMRUNUT1JfTkFWQkFSX05BVikpIHtcbiAgICAgIFtdLmNvbmNhdCguLi5kb2N1bWVudC5ib2R5LmNoaWxkcmVuKVxuICAgICAgICAuZm9yRWFjaChlbGVtID0+IEV2ZW50SGFuZGxlci5vbihlbGVtLCAnbW91c2VvdmVyJywgbm9vcCkpXG4gICAgfVxuXG4gICAgdGhpcy5fZWxlbWVudC5mb2N1cygpXG4gICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxuXG4gICAgdGhpcy5fbWVudS5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU0hPVylcbiAgICB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKVxuICAgIEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX1NIT1dOLCByZWxhdGVkVGFyZ2V0KVxuICB9XG5cbiAgaGlkZSgpIHtcbiAgICBpZiAoaXNEaXNhYmxlZCh0aGlzLl9lbGVtZW50KSB8fCAhdGhpcy5faXNTaG93bih0aGlzLl9tZW51KSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgcmVsYXRlZFRhcmdldCA9IHtcbiAgICAgIHJlbGF0ZWRUYXJnZXQ6IHRoaXMuX2VsZW1lbnRcbiAgICB9XG5cbiAgICB0aGlzLl9jb21wbGV0ZUhpZGUocmVsYXRlZFRhcmdldClcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgaWYgKHRoaXMuX3BvcHBlcikge1xuICAgICAgdGhpcy5fcG9wcGVyLmRlc3Ryb3koKVxuICAgIH1cblxuICAgIHN1cGVyLmRpc3Bvc2UoKVxuICB9XG5cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMuX2luTmF2YmFyID0gdGhpcy5fZGV0ZWN0TmF2YmFyKClcbiAgICBpZiAodGhpcy5fcG9wcGVyKSB7XG4gICAgICB0aGlzLl9wb3BwZXIudXBkYXRlKClcbiAgICB9XG4gIH1cblxuICAvLyBQcml2YXRlXG5cbiAgX2NvbXBsZXRlSGlkZShyZWxhdGVkVGFyZ2V0KSB7XG4gICAgY29uc3QgaGlkZUV2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfSElERSwgcmVsYXRlZFRhcmdldClcbiAgICBpZiAoaGlkZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIElmIHRoaXMgaXMgYSB0b3VjaC1lbmFibGVkIGRldmljZSB3ZSByZW1vdmUgdGhlIGV4dHJhXG4gICAgLy8gZW1wdHkgbW91c2VvdmVyIGxpc3RlbmVycyB3ZSBhZGRlZCBmb3IgaU9TIHN1cHBvcnRcbiAgICBpZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgICBbXS5jb25jYXQoLi4uZG9jdW1lbnQuYm9keS5jaGlsZHJlbilcbiAgICAgICAgLmZvckVhY2goZWxlbSA9PiBFdmVudEhhbmRsZXIub2ZmKGVsZW0sICdtb3VzZW92ZXInLCBub29wKSlcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcG9wcGVyKSB7XG4gICAgICB0aGlzLl9wb3BwZXIuZGVzdHJveSgpXG4gICAgfVxuXG4gICAgdGhpcy5fbWVudS5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPVylcbiAgICB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKVxuICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJylcbiAgICBNYW5pcHVsYXRvci5yZW1vdmVEYXRhQXR0cmlidXRlKHRoaXMuX21lbnUsICdwb3BwZXInKVxuICAgIEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0hJRERFTiwgcmVsYXRlZFRhcmdldClcbiAgfVxuXG4gIF9nZXRDb25maWcoY29uZmlnKSB7XG4gICAgY29uZmlnID0ge1xuICAgICAgLi4udGhpcy5jb25zdHJ1Y3Rvci5EZWZhdWx0LFxuICAgICAgLi4uTWFuaXB1bGF0b3IuZ2V0RGF0YUF0dHJpYnV0ZXModGhpcy5fZWxlbWVudCksXG4gICAgICAuLi5jb25maWdcbiAgICB9XG5cbiAgICB0eXBlQ2hlY2tDb25maWcoTkFNRSwgY29uZmlnLCB0aGlzLmNvbnN0cnVjdG9yLkRlZmF1bHRUeXBlKVxuXG4gICAgaWYgKHR5cGVvZiBjb25maWcucmVmZXJlbmNlID09PSAnb2JqZWN0JyAmJiAhaXNFbGVtZW50KGNvbmZpZy5yZWZlcmVuY2UpICYmXG4gICAgICB0eXBlb2YgY29uZmlnLnJlZmVyZW5jZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QgIT09ICdmdW5jdGlvbidcbiAgICApIHtcbiAgICAgIC8vIFBvcHBlciB2aXJ0dWFsIGVsZW1lbnRzIHJlcXVpcmUgYSBnZXRCb3VuZGluZ0NsaWVudFJlY3QgbWV0aG9kXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGAke05BTUUudG9VcHBlckNhc2UoKX06IE9wdGlvbiBcInJlZmVyZW5jZVwiIHByb3ZpZGVkIHR5cGUgXCJvYmplY3RcIiB3aXRob3V0IGEgcmVxdWlyZWQgXCJnZXRCb3VuZGluZ0NsaWVudFJlY3RcIiBtZXRob2QuYClcbiAgICB9XG5cbiAgICByZXR1cm4gY29uZmlnXG4gIH1cblxuICBfY3JlYXRlUG9wcGVyKHBhcmVudCkge1xuICAgIGlmICh0eXBlb2YgUG9wcGVyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQm9vdHN0cmFwXFwncyBkcm9wZG93bnMgcmVxdWlyZSBQb3BwZXIgKGh0dHBzOi8vcG9wcGVyLmpzLm9yZyknKVxuICAgIH1cblxuICAgIGxldCByZWZlcmVuY2VFbGVtZW50ID0gdGhpcy5fZWxlbWVudFxuXG4gICAgaWYgKHRoaXMuX2NvbmZpZy5yZWZlcmVuY2UgPT09ICdwYXJlbnQnKSB7XG4gICAgICByZWZlcmVuY2VFbGVtZW50ID0gcGFyZW50XG4gICAgfSBlbHNlIGlmIChpc0VsZW1lbnQodGhpcy5fY29uZmlnLnJlZmVyZW5jZSkpIHtcbiAgICAgIHJlZmVyZW5jZUVsZW1lbnQgPSBnZXRFbGVtZW50KHRoaXMuX2NvbmZpZy5yZWZlcmVuY2UpXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5fY29uZmlnLnJlZmVyZW5jZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHJlZmVyZW5jZUVsZW1lbnQgPSB0aGlzLl9jb25maWcucmVmZXJlbmNlXG4gICAgfVxuXG4gICAgY29uc3QgcG9wcGVyQ29uZmlnID0gdGhpcy5fZ2V0UG9wcGVyQ29uZmlnKClcbiAgICBjb25zdCBpc0Rpc3BsYXlTdGF0aWMgPSBwb3BwZXJDb25maWcubW9kaWZpZXJzLmZpbmQobW9kaWZpZXIgPT4gbW9kaWZpZXIubmFtZSA9PT0gJ2FwcGx5U3R5bGVzJyAmJiBtb2RpZmllci5lbmFibGVkID09PSBmYWxzZSlcblxuICAgIHRoaXMuX3BvcHBlciA9IFBvcHBlci5jcmVhdGVQb3BwZXIocmVmZXJlbmNlRWxlbWVudCwgdGhpcy5fbWVudSwgcG9wcGVyQ29uZmlnKVxuXG4gICAgaWYgKGlzRGlzcGxheVN0YXRpYykge1xuICAgICAgTWFuaXB1bGF0b3Iuc2V0RGF0YUF0dHJpYnV0ZSh0aGlzLl9tZW51LCAncG9wcGVyJywgJ3N0YXRpYycpXG4gICAgfVxuICB9XG5cbiAgX2lzU2hvd24oZWxlbWVudCA9IHRoaXMuX2VsZW1lbnQpIHtcbiAgICByZXR1cm4gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9TSE9XKVxuICB9XG5cbiAgX2dldE1lbnVFbGVtZW50KCkge1xuICAgIHJldHVybiBTZWxlY3RvckVuZ2luZS5uZXh0KHRoaXMuX2VsZW1lbnQsIFNFTEVDVE9SX01FTlUpWzBdXG4gIH1cblxuICBfZ2V0UGxhY2VtZW50KCkge1xuICAgIGNvbnN0IHBhcmVudERyb3Bkb3duID0gdGhpcy5fZWxlbWVudC5wYXJlbnROb2RlXG5cbiAgICBpZiAocGFyZW50RHJvcGRvd24uY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfRFJPUEVORCkpIHtcbiAgICAgIHJldHVybiBQTEFDRU1FTlRfUklHSFRcbiAgICB9XG5cbiAgICBpZiAocGFyZW50RHJvcGRvd24uY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfRFJPUFNUQVJUKSkge1xuICAgICAgcmV0dXJuIFBMQUNFTUVOVF9MRUZUXG4gICAgfVxuXG4gICAgLy8gV2UgbmVlZCB0byB0cmltIHRoZSB2YWx1ZSBiZWNhdXNlIGN1c3RvbSBwcm9wZXJ0aWVzIGNhbiBhbHNvIGluY2x1ZGUgc3BhY2VzXG4gICAgY29uc3QgaXNFbmQgPSBnZXRDb21wdXRlZFN0eWxlKHRoaXMuX21lbnUpLmdldFByb3BlcnR5VmFsdWUoJy0tYnMtcG9zaXRpb24nKS50cmltKCkgPT09ICdlbmQnXG5cbiAgICBpZiAocGFyZW50RHJvcGRvd24uY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfRFJPUFVQKSkge1xuICAgICAgcmV0dXJuIGlzRW5kID8gUExBQ0VNRU5UX1RPUEVORCA6IFBMQUNFTUVOVF9UT1BcbiAgICB9XG5cbiAgICByZXR1cm4gaXNFbmQgPyBQTEFDRU1FTlRfQk9UVE9NRU5EIDogUExBQ0VNRU5UX0JPVFRPTVxuICB9XG5cbiAgX2RldGVjdE5hdmJhcigpIHtcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5jbG9zZXN0KGAuJHtDTEFTU19OQU1FX05BVkJBUn1gKSAhPT0gbnVsbFxuICB9XG5cbiAgX2dldE9mZnNldCgpIHtcbiAgICBjb25zdCB7IG9mZnNldCB9ID0gdGhpcy5fY29uZmlnXG5cbiAgICBpZiAodHlwZW9mIG9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBvZmZzZXQuc3BsaXQoJywnKS5tYXAodmFsID0+IE51bWJlci5wYXJzZUludCh2YWwsIDEwKSlcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9mZnNldCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHBvcHBlckRhdGEgPT4gb2Zmc2V0KHBvcHBlckRhdGEsIHRoaXMuX2VsZW1lbnQpXG4gICAgfVxuXG4gICAgcmV0dXJuIG9mZnNldFxuICB9XG5cbiAgX2dldFBvcHBlckNvbmZpZygpIHtcbiAgICBjb25zdCBkZWZhdWx0QnNQb3BwZXJDb25maWcgPSB7XG4gICAgICBwbGFjZW1lbnQ6IHRoaXMuX2dldFBsYWNlbWVudCgpLFxuICAgICAgbW9kaWZpZXJzOiBbe1xuICAgICAgICBuYW1lOiAncHJldmVudE92ZXJmbG93JyxcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIGJvdW5kYXJ5OiB0aGlzLl9jb25maWcuYm91bmRhcnlcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ29mZnNldCcsXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICBvZmZzZXQ6IHRoaXMuX2dldE9mZnNldCgpXG4gICAgICAgIH1cbiAgICAgIH1dXG4gICAgfVxuXG4gICAgLy8gRGlzYWJsZSBQb3BwZXIgaWYgd2UgaGF2ZSBhIHN0YXRpYyBkaXNwbGF5XG4gICAgaWYgKHRoaXMuX2NvbmZpZy5kaXNwbGF5ID09PSAnc3RhdGljJykge1xuICAgICAgZGVmYXVsdEJzUG9wcGVyQ29uZmlnLm1vZGlmaWVycyA9IFt7XG4gICAgICAgIG5hbWU6ICdhcHBseVN0eWxlcycsXG4gICAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgICB9XVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAuLi5kZWZhdWx0QnNQb3BwZXJDb25maWcsXG4gICAgICAuLi4odHlwZW9mIHRoaXMuX2NvbmZpZy5wb3BwZXJDb25maWcgPT09ICdmdW5jdGlvbicgPyB0aGlzLl9jb25maWcucG9wcGVyQ29uZmlnKGRlZmF1bHRCc1BvcHBlckNvbmZpZykgOiB0aGlzLl9jb25maWcucG9wcGVyQ29uZmlnKVxuICAgIH1cbiAgfVxuXG4gIF9zZWxlY3RNZW51SXRlbSh7IGtleSwgdGFyZ2V0IH0pIHtcbiAgICBjb25zdCBpdGVtcyA9IFNlbGVjdG9yRW5naW5lLmZpbmQoU0VMRUNUT1JfVklTSUJMRV9JVEVNUywgdGhpcy5fbWVudSkuZmlsdGVyKGlzVmlzaWJsZSlcblxuICAgIGlmICghaXRlbXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBpZiB0YXJnZXQgaXNuJ3QgaW5jbHVkZWQgaW4gaXRlbXMgKGUuZy4gd2hlbiBleHBhbmRpbmcgdGhlIGRyb3Bkb3duKVxuICAgIC8vIGFsbG93IGN5Y2xpbmcgdG8gZ2V0IHRoZSBsYXN0IGl0ZW0gaW4gY2FzZSBrZXkgZXF1YWxzIEFSUk9XX1VQX0tFWVxuICAgIGdldE5leHRBY3RpdmVFbGVtZW50KGl0ZW1zLCB0YXJnZXQsIGtleSA9PT0gQVJST1dfRE9XTl9LRVksICFpdGVtcy5pbmNsdWRlcyh0YXJnZXQpKS5mb2N1cygpXG4gIH1cblxuICAvLyBTdGF0aWNcblxuICBzdGF0aWMgalF1ZXJ5SW50ZXJmYWNlKGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgZGF0YSA9IERyb3Bkb3duLmdldE9yQ3JlYXRlSW5zdGFuY2UodGhpcywgY29uZmlnKVxuXG4gICAgICBpZiAodHlwZW9mIGNvbmZpZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgZGF0YVtjb25maWddID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBObyBtZXRob2QgbmFtZWQgXCIke2NvbmZpZ31cImApXG4gICAgICB9XG5cbiAgICAgIGRhdGFbY29uZmlnXSgpXG4gICAgfSlcbiAgfVxuXG4gIHN0YXRpYyBjbGVhck1lbnVzKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50ICYmIChldmVudC5idXR0b24gPT09IFJJR0hUX01PVVNFX0JVVFRPTiB8fCAoZXZlbnQudHlwZSA9PT0gJ2tleXVwJyAmJiBldmVudC5rZXkgIT09IFRBQl9LRVkpKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgdG9nZ2xlcyA9IFNlbGVjdG9yRW5naW5lLmZpbmQoU0VMRUNUT1JfREFUQV9UT0dHTEUpXG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdG9nZ2xlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3QgY29udGV4dCA9IERyb3Bkb3duLmdldEluc3RhbmNlKHRvZ2dsZXNbaV0pXG4gICAgICBpZiAoIWNvbnRleHQgfHwgY29udGV4dC5fY29uZmlnLmF1dG9DbG9zZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgaWYgKCFjb250ZXh0Ll9pc1Nob3duKCkpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVsYXRlZFRhcmdldCA9IHtcbiAgICAgICAgcmVsYXRlZFRhcmdldDogY29udGV4dC5fZWxlbWVudFxuICAgICAgfVxuXG4gICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgY29uc3QgY29tcG9zZWRQYXRoID0gZXZlbnQuY29tcG9zZWRQYXRoKClcbiAgICAgICAgY29uc3QgaXNNZW51VGFyZ2V0ID0gY29tcG9zZWRQYXRoLmluY2x1ZGVzKGNvbnRleHQuX21lbnUpXG4gICAgICAgIGlmIChcbiAgICAgICAgICBjb21wb3NlZFBhdGguaW5jbHVkZXMoY29udGV4dC5fZWxlbWVudCkgfHxcbiAgICAgICAgICAoY29udGV4dC5fY29uZmlnLmF1dG9DbG9zZSA9PT0gJ2luc2lkZScgJiYgIWlzTWVudVRhcmdldCkgfHxcbiAgICAgICAgICAoY29udGV4dC5fY29uZmlnLmF1dG9DbG9zZSA9PT0gJ291dHNpZGUnICYmIGlzTWVudVRhcmdldClcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRhYiBuYXZpZ2F0aW9uIHRocm91Z2ggdGhlIGRyb3Bkb3duIG1lbnUgb3IgZXZlbnRzIGZyb20gY29udGFpbmVkIGlucHV0cyBzaG91bGRuJ3QgY2xvc2UgdGhlIG1lbnVcbiAgICAgICAgaWYgKGNvbnRleHQuX21lbnUuY29udGFpbnMoZXZlbnQudGFyZ2V0KSAmJiAoKGV2ZW50LnR5cGUgPT09ICdrZXl1cCcgJiYgZXZlbnQua2V5ID09PSBUQUJfS0VZKSB8fCAvaW5wdXR8c2VsZWN0fG9wdGlvbnx0ZXh0YXJlYXxmb3JtL2kudGVzdChldmVudC50YXJnZXQudGFnTmFtZSkpKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudC50eXBlID09PSAnY2xpY2snKSB7XG4gICAgICAgICAgcmVsYXRlZFRhcmdldC5jbGlja0V2ZW50ID0gZXZlbnRcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb250ZXh0Ll9jb21wbGV0ZUhpZGUocmVsYXRlZFRhcmdldClcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgZ2V0UGFyZW50RnJvbUVsZW1lbnQoZWxlbWVudCkge1xuICAgIHJldHVybiBnZXRFbGVtZW50RnJvbVNlbGVjdG9yKGVsZW1lbnQpIHx8IGVsZW1lbnQucGFyZW50Tm9kZVxuICB9XG5cbiAgc3RhdGljIGRhdGFBcGlLZXlkb3duSGFuZGxlcihldmVudCkge1xuICAgIC8vIElmIG5vdCBpbnB1dC90ZXh0YXJlYTpcbiAgICAvLyAgLSBBbmQgbm90IGEga2V5IGluIFJFR0VYUF9LRVlET1dOID0+IG5vdCBhIGRyb3Bkb3duIGNvbW1hbmRcbiAgICAvLyBJZiBpbnB1dC90ZXh0YXJlYTpcbiAgICAvLyAgLSBJZiBzcGFjZSBrZXkgPT4gbm90IGEgZHJvcGRvd24gY29tbWFuZFxuICAgIC8vICAtIElmIGtleSBpcyBvdGhlciB0aGFuIGVzY2FwZVxuICAgIC8vICAgIC0gSWYga2V5IGlzIG5vdCB1cCBvciBkb3duID0+IG5vdCBhIGRyb3Bkb3duIGNvbW1hbmRcbiAgICAvLyAgICAtIElmIHRyaWdnZXIgaW5zaWRlIHRoZSBtZW51ID0+IG5vdCBhIGRyb3Bkb3duIGNvbW1hbmRcbiAgICBpZiAoL2lucHV0fHRleHRhcmVhL2kudGVzdChldmVudC50YXJnZXQudGFnTmFtZSkgP1xuICAgICAgZXZlbnQua2V5ID09PSBTUEFDRV9LRVkgfHwgKGV2ZW50LmtleSAhPT0gRVNDQVBFX0tFWSAmJlxuICAgICAgKChldmVudC5rZXkgIT09IEFSUk9XX0RPV05fS0VZICYmIGV2ZW50LmtleSAhPT0gQVJST1dfVVBfS0VZKSB8fFxuICAgICAgICBldmVudC50YXJnZXQuY2xvc2VzdChTRUxFQ1RPUl9NRU5VKSkpIDpcbiAgICAgICFSRUdFWFBfS0VZRE9XTi50ZXN0KGV2ZW50LmtleSkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGlzQWN0aXZlID0gdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9TSE9XKVxuXG4gICAgaWYgKCFpc0FjdGl2ZSAmJiBldmVudC5rZXkgPT09IEVTQ0FQRV9LRVkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgaWYgKGlzRGlzYWJsZWQodGhpcykpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGdldFRvZ2dsZUJ1dHRvbiA9IHRoaXMubWF0Y2hlcyhTRUxFQ1RPUl9EQVRBX1RPR0dMRSkgPyB0aGlzIDogU2VsZWN0b3JFbmdpbmUucHJldih0aGlzLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSlbMF1cbiAgICBjb25zdCBpbnN0YW5jZSA9IERyb3Bkb3duLmdldE9yQ3JlYXRlSW5zdGFuY2UoZ2V0VG9nZ2xlQnV0dG9uKVxuXG4gICAgaWYgKGV2ZW50LmtleSA9PT0gRVNDQVBFX0tFWSkge1xuICAgICAgaW5zdGFuY2UuaGlkZSgpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoZXZlbnQua2V5ID09PSBBUlJPV19VUF9LRVkgfHwgZXZlbnQua2V5ID09PSBBUlJPV19ET1dOX0tFWSkge1xuICAgICAgaWYgKCFpc0FjdGl2ZSkge1xuICAgICAgICBpbnN0YW5jZS5zaG93KClcbiAgICAgIH1cblxuICAgICAgaW5zdGFuY2UuX3NlbGVjdE1lbnVJdGVtKGV2ZW50KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKCFpc0FjdGl2ZSB8fCBldmVudC5rZXkgPT09IFNQQUNFX0tFWSkge1xuICAgICAgRHJvcGRvd24uY2xlYXJNZW51cygpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBEYXRhIEFwaSBpbXBsZW1lbnRhdGlvblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlET1dOX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgRHJvcGRvd24uZGF0YUFwaUtleWRvd25IYW5kbGVyKVxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlET1dOX0RBVEFfQVBJLCBTRUxFQ1RPUl9NRU5VLCBEcm9wZG93bi5kYXRhQXBpS2V5ZG93bkhhbmRsZXIpXG5FdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0NMSUNLX0RBVEFfQVBJLCBEcm9wZG93bi5jbGVhck1lbnVzKVxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlVUF9EQVRBX0FQSSwgRHJvcGRvd24uY2xlYXJNZW51cylcbkV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfQ0xJQ0tfREFUQV9BUEksIFNFTEVDVE9SX0RBVEFfVE9HR0xFLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICBEcm9wZG93bi5nZXRPckNyZWF0ZUluc3RhbmNlKHRoaXMpLnRvZ2dsZSgpXG59KVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogalF1ZXJ5XG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIGFkZCAuRHJvcGRvd24gdG8galF1ZXJ5IG9ubHkgaWYgalF1ZXJ5IGlzIHByZXNlbnRcbiAqL1xuXG5kZWZpbmVKUXVlcnlQbHVnaW4oRHJvcGRvd24pXG5cbmV4cG9ydCBkZWZhdWx0IERyb3Bkb3duXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBCb290c3RyYXAgKHY1LjEuMyk6IHV0aWwvc2Nyb2xsQmFyLmpzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21haW4vTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuaW1wb3J0IFNlbGVjdG9yRW5naW5lIGZyb20gJy4uL2RvbS9zZWxlY3Rvci1lbmdpbmUnXG5pbXBvcnQgTWFuaXB1bGF0b3IgZnJvbSAnLi4vZG9tL21hbmlwdWxhdG9yJ1xuaW1wb3J0IHsgaXNFbGVtZW50IH0gZnJvbSAnLi9pbmRleCdcblxuY29uc3QgU0VMRUNUT1JfRklYRURfQ09OVEVOVCA9ICcuZml4ZWQtdG9wLCAuZml4ZWQtYm90dG9tLCAuaXMtZml4ZWQsIC5zdGlja3ktdG9wJ1xuY29uc3QgU0VMRUNUT1JfU1RJQ0tZX0NPTlRFTlQgPSAnLnN0aWNreS10b3AnXG5cbmNsYXNzIFNjcm9sbEJhckhlbHBlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5ib2R5XG4gIH1cblxuICBnZXRXaWR0aCgpIHtcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2luZG93L2lubmVyV2lkdGgjdXNhZ2Vfbm90ZXNcbiAgICBjb25zdCBkb2N1bWVudFdpZHRoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoXG4gICAgcmV0dXJuIE1hdGguYWJzKHdpbmRvdy5pbm5lcldpZHRoIC0gZG9jdW1lbnRXaWR0aClcbiAgfVxuXG4gIGhpZGUoKSB7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLmdldFdpZHRoKClcbiAgICB0aGlzLl9kaXNhYmxlT3ZlckZsb3coKVxuICAgIC8vIGdpdmUgcGFkZGluZyB0byBlbGVtZW50IHRvIGJhbGFuY2UgdGhlIGhpZGRlbiBzY3JvbGxiYXIgd2lkdGhcbiAgICB0aGlzLl9zZXRFbGVtZW50QXR0cmlidXRlcyh0aGlzLl9lbGVtZW50LCAncGFkZGluZ1JpZ2h0JywgY2FsY3VsYXRlZFZhbHVlID0+IGNhbGN1bGF0ZWRWYWx1ZSArIHdpZHRoKVxuICAgIC8vIHRyaWNrOiBXZSBhZGp1c3QgcG9zaXRpdmUgcGFkZGluZ1JpZ2h0IGFuZCBuZWdhdGl2ZSBtYXJnaW5SaWdodCB0byBzdGlja3ktdG9wIGVsZW1lbnRzIHRvIGtlZXAgc2hvd2luZyBmdWxsd2lkdGhcbiAgICB0aGlzLl9zZXRFbGVtZW50QXR0cmlidXRlcyhTRUxFQ1RPUl9GSVhFRF9DT05URU5ULCAncGFkZGluZ1JpZ2h0JywgY2FsY3VsYXRlZFZhbHVlID0+IGNhbGN1bGF0ZWRWYWx1ZSArIHdpZHRoKVxuICAgIHRoaXMuX3NldEVsZW1lbnRBdHRyaWJ1dGVzKFNFTEVDVE9SX1NUSUNLWV9DT05URU5ULCAnbWFyZ2luUmlnaHQnLCBjYWxjdWxhdGVkVmFsdWUgPT4gY2FsY3VsYXRlZFZhbHVlIC0gd2lkdGgpXG4gIH1cblxuICBfZGlzYWJsZU92ZXJGbG93KCkge1xuICAgIHRoaXMuX3NhdmVJbml0aWFsQXR0cmlidXRlKHRoaXMuX2VsZW1lbnQsICdvdmVyZmxvdycpXG4gICAgdGhpcy5fZWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXG4gIH1cblxuICBfc2V0RWxlbWVudEF0dHJpYnV0ZXMoc2VsZWN0b3IsIHN0eWxlUHJvcCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBzY3JvbGxiYXJXaWR0aCA9IHRoaXMuZ2V0V2lkdGgoKVxuICAgIGNvbnN0IG1hbmlwdWxhdGlvbkNhbGxCYWNrID0gZWxlbWVudCA9PiB7XG4gICAgICBpZiAoZWxlbWVudCAhPT0gdGhpcy5fZWxlbWVudCAmJiB3aW5kb3cuaW5uZXJXaWR0aCA+IGVsZW1lbnQuY2xpZW50V2lkdGggKyBzY3JvbGxiYXJXaWR0aCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5fc2F2ZUluaXRpYWxBdHRyaWJ1dGUoZWxlbWVudCwgc3R5bGVQcm9wKVxuICAgICAgY29uc3QgY2FsY3VsYXRlZFZhbHVlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudClbc3R5bGVQcm9wXVxuICAgICAgZWxlbWVudC5zdHlsZVtzdHlsZVByb3BdID0gYCR7Y2FsbGJhY2soTnVtYmVyLnBhcnNlRmxvYXQoY2FsY3VsYXRlZFZhbHVlKSl9cHhgXG4gICAgfVxuXG4gICAgdGhpcy5fYXBwbHlNYW5pcHVsYXRpb25DYWxsYmFjayhzZWxlY3RvciwgbWFuaXB1bGF0aW9uQ2FsbEJhY2spXG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLl9yZXNldEVsZW1lbnRBdHRyaWJ1dGVzKHRoaXMuX2VsZW1lbnQsICdvdmVyZmxvdycpXG4gICAgdGhpcy5fcmVzZXRFbGVtZW50QXR0cmlidXRlcyh0aGlzLl9lbGVtZW50LCAncGFkZGluZ1JpZ2h0JylcbiAgICB0aGlzLl9yZXNldEVsZW1lbnRBdHRyaWJ1dGVzKFNFTEVDVE9SX0ZJWEVEX0NPTlRFTlQsICdwYWRkaW5nUmlnaHQnKVxuICAgIHRoaXMuX3Jlc2V0RWxlbWVudEF0dHJpYnV0ZXMoU0VMRUNUT1JfU1RJQ0tZX0NPTlRFTlQsICdtYXJnaW5SaWdodCcpXG4gIH1cblxuICBfc2F2ZUluaXRpYWxBdHRyaWJ1dGUoZWxlbWVudCwgc3R5bGVQcm9wKSB7XG4gICAgY29uc3QgYWN0dWFsVmFsdWUgPSBlbGVtZW50LnN0eWxlW3N0eWxlUHJvcF1cbiAgICBpZiAoYWN0dWFsVmFsdWUpIHtcbiAgICAgIE1hbmlwdWxhdG9yLnNldERhdGFBdHRyaWJ1dGUoZWxlbWVudCwgc3R5bGVQcm9wLCBhY3R1YWxWYWx1ZSlcbiAgICB9XG4gIH1cblxuICBfcmVzZXRFbGVtZW50QXR0cmlidXRlcyhzZWxlY3Rvciwgc3R5bGVQcm9wKSB7XG4gICAgY29uc3QgbWFuaXB1bGF0aW9uQ2FsbEJhY2sgPSBlbGVtZW50ID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gTWFuaXB1bGF0b3IuZ2V0RGF0YUF0dHJpYnV0ZShlbGVtZW50LCBzdHlsZVByb3ApXG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBlbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KHN0eWxlUHJvcClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIE1hbmlwdWxhdG9yLnJlbW92ZURhdGFBdHRyaWJ1dGUoZWxlbWVudCwgc3R5bGVQcm9wKVxuICAgICAgICBlbGVtZW50LnN0eWxlW3N0eWxlUHJvcF0gPSB2YWx1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX2FwcGx5TWFuaXB1bGF0aW9uQ2FsbGJhY2soc2VsZWN0b3IsIG1hbmlwdWxhdGlvbkNhbGxCYWNrKVxuICB9XG5cbiAgX2FwcGx5TWFuaXB1bGF0aW9uQ2FsbGJhY2soc2VsZWN0b3IsIGNhbGxCYWNrKSB7XG4gICAgaWYgKGlzRWxlbWVudChzZWxlY3RvcikpIHtcbiAgICAgIGNhbGxCYWNrKHNlbGVjdG9yKVxuICAgIH0gZWxzZSB7XG4gICAgICBTZWxlY3RvckVuZ2luZS5maW5kKHNlbGVjdG9yLCB0aGlzLl9lbGVtZW50KS5mb3JFYWNoKGNhbGxCYWNrKVxuICAgIH1cbiAgfVxuXG4gIGlzT3ZlcmZsb3dpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0V2lkdGgoKSA+IDBcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTY3JvbGxCYXJIZWxwZXJcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEJvb3RzdHJhcCAodjUuMS4zKTogdXRpbC9iYWNrZHJvcC5qc1xuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSAnLi4vZG9tL2V2ZW50LWhhbmRsZXInXG5pbXBvcnQgeyBleGVjdXRlLCBleGVjdXRlQWZ0ZXJUcmFuc2l0aW9uLCBnZXRFbGVtZW50LCByZWZsb3csIHR5cGVDaGVja0NvbmZpZyB9IGZyb20gJy4vaW5kZXgnXG5cbmNvbnN0IERlZmF1bHQgPSB7XG4gIGNsYXNzTmFtZTogJ21vZGFsLWJhY2tkcm9wJyxcbiAgaXNWaXNpYmxlOiB0cnVlLCAvLyBpZiBmYWxzZSwgd2UgdXNlIHRoZSBiYWNrZHJvcCBoZWxwZXIgd2l0aG91dCBhZGRpbmcgYW55IGVsZW1lbnQgdG8gdGhlIGRvbVxuICBpc0FuaW1hdGVkOiBmYWxzZSxcbiAgcm9vdEVsZW1lbnQ6ICdib2R5JywgLy8gZ2l2ZSB0aGUgY2hvaWNlIHRvIHBsYWNlIGJhY2tkcm9wIHVuZGVyIGRpZmZlcmVudCBlbGVtZW50c1xuICBjbGlja0NhbGxiYWNrOiBudWxsXG59XG5cbmNvbnN0IERlZmF1bHRUeXBlID0ge1xuICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICBpc1Zpc2libGU6ICdib29sZWFuJyxcbiAgaXNBbmltYXRlZDogJ2Jvb2xlYW4nLFxuICByb290RWxlbWVudDogJyhlbGVtZW50fHN0cmluZyknLFxuICBjbGlja0NhbGxiYWNrOiAnKGZ1bmN0aW9ufG51bGwpJ1xufVxuY29uc3QgTkFNRSA9ICdiYWNrZHJvcCdcbmNvbnN0IENMQVNTX05BTUVfRkFERSA9ICdmYWRlJ1xuY29uc3QgQ0xBU1NfTkFNRV9TSE9XID0gJ3Nob3cnXG5cbmNvbnN0IEVWRU5UX01PVVNFRE9XTiA9IGBtb3VzZWRvd24uYnMuJHtOQU1FfWBcblxuY2xhc3MgQmFja2Ryb3Age1xuICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICB0aGlzLl9jb25maWcgPSB0aGlzLl9nZXRDb25maWcoY29uZmlnKVxuICAgIHRoaXMuX2lzQXBwZW5kZWQgPSBmYWxzZVxuICAgIHRoaXMuX2VsZW1lbnQgPSBudWxsXG4gIH1cblxuICBzaG93KGNhbGxiYWNrKSB7XG4gICAgaWYgKCF0aGlzLl9jb25maWcuaXNWaXNpYmxlKSB7XG4gICAgICBleGVjdXRlKGNhbGxiYWNrKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5fYXBwZW5kKClcblxuICAgIGlmICh0aGlzLl9jb25maWcuaXNBbmltYXRlZCkge1xuICAgICAgcmVmbG93KHRoaXMuX2dldEVsZW1lbnQoKSlcbiAgICB9XG5cbiAgICB0aGlzLl9nZXRFbGVtZW50KCkuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpXG5cbiAgICB0aGlzLl9lbXVsYXRlQW5pbWF0aW9uKCgpID0+IHtcbiAgICAgIGV4ZWN1dGUoY2FsbGJhY2spXG4gICAgfSlcbiAgfVxuXG4gIGhpZGUoY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMuX2NvbmZpZy5pc1Zpc2libGUpIHtcbiAgICAgIGV4ZWN1dGUoY2FsbGJhY2spXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLl9nZXRFbGVtZW50KCkuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX1NIT1cpXG5cbiAgICB0aGlzLl9lbXVsYXRlQW5pbWF0aW9uKCgpID0+IHtcbiAgICAgIHRoaXMuZGlzcG9zZSgpXG4gICAgICBleGVjdXRlKGNhbGxiYWNrKVxuICAgIH0pXG4gIH1cblxuICAvLyBQcml2YXRlXG5cbiAgX2dldEVsZW1lbnQoKSB7XG4gICAgaWYgKCF0aGlzLl9lbGVtZW50KSB7XG4gICAgICBjb25zdCBiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICBiYWNrZHJvcC5jbGFzc05hbWUgPSB0aGlzLl9jb25maWcuY2xhc3NOYW1lXG4gICAgICBpZiAodGhpcy5fY29uZmlnLmlzQW5pbWF0ZWQpIHtcbiAgICAgICAgYmFja2Ryb3AuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0ZBREUpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2VsZW1lbnQgPSBiYWNrZHJvcFxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50XG4gIH1cblxuICBfZ2V0Q29uZmlnKGNvbmZpZykge1xuICAgIGNvbmZpZyA9IHtcbiAgICAgIC4uLkRlZmF1bHQsXG4gICAgICAuLi4odHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcgPyBjb25maWcgOiB7fSlcbiAgICB9XG5cbiAgICAvLyB1c2UgZ2V0RWxlbWVudCgpIHdpdGggdGhlIGRlZmF1bHQgXCJib2R5XCIgdG8gZ2V0IGEgZnJlc2ggRWxlbWVudCBvbiBlYWNoIGluc3RhbnRpYXRpb25cbiAgICBjb25maWcucm9vdEVsZW1lbnQgPSBnZXRFbGVtZW50KGNvbmZpZy5yb290RWxlbWVudClcbiAgICB0eXBlQ2hlY2tDb25maWcoTkFNRSwgY29uZmlnLCBEZWZhdWx0VHlwZSlcbiAgICByZXR1cm4gY29uZmlnXG4gIH1cblxuICBfYXBwZW5kKCkge1xuICAgIGlmICh0aGlzLl9pc0FwcGVuZGVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLl9jb25maWcucm9vdEVsZW1lbnQuYXBwZW5kKHRoaXMuX2dldEVsZW1lbnQoKSlcblxuICAgIEV2ZW50SGFuZGxlci5vbih0aGlzLl9nZXRFbGVtZW50KCksIEVWRU5UX01PVVNFRE9XTiwgKCkgPT4ge1xuICAgICAgZXhlY3V0ZSh0aGlzLl9jb25maWcuY2xpY2tDYWxsYmFjaylcbiAgICB9KVxuXG4gICAgdGhpcy5faXNBcHBlbmRlZCA9IHRydWVcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgaWYgKCF0aGlzLl9pc0FwcGVuZGVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBFdmVudEhhbmRsZXIub2ZmKHRoaXMuX2VsZW1lbnQsIEVWRU5UX01PVVNFRE9XTilcblxuICAgIHRoaXMuX2VsZW1lbnQucmVtb3ZlKClcbiAgICB0aGlzLl9pc0FwcGVuZGVkID0gZmFsc2VcbiAgfVxuXG4gIF9lbXVsYXRlQW5pbWF0aW9uKGNhbGxiYWNrKSB7XG4gICAgZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbihjYWxsYmFjaywgdGhpcy5fZ2V0RWxlbWVudCgpLCB0aGlzLl9jb25maWcuaXNBbmltYXRlZClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCYWNrZHJvcFxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQm9vdHN0cmFwICh2NS4xLjMpOiB1dGlsL2ZvY3VzdHJhcC5qc1xuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSAnLi4vZG9tL2V2ZW50LWhhbmRsZXInXG5pbXBvcnQgU2VsZWN0b3JFbmdpbmUgZnJvbSAnLi4vZG9tL3NlbGVjdG9yLWVuZ2luZSdcbmltcG9ydCB7IHR5cGVDaGVja0NvbmZpZyB9IGZyb20gJy4vaW5kZXgnXG5cbmNvbnN0IERlZmF1bHQgPSB7XG4gIHRyYXBFbGVtZW50OiBudWxsLCAvLyBUaGUgZWxlbWVudCB0byB0cmFwIGZvY3VzIGluc2lkZSBvZlxuICBhdXRvZm9jdXM6IHRydWVcbn1cblxuY29uc3QgRGVmYXVsdFR5cGUgPSB7XG4gIHRyYXBFbGVtZW50OiAnZWxlbWVudCcsXG4gIGF1dG9mb2N1czogJ2Jvb2xlYW4nXG59XG5cbmNvbnN0IE5BTUUgPSAnZm9jdXN0cmFwJ1xuY29uc3QgREFUQV9LRVkgPSAnYnMuZm9jdXN0cmFwJ1xuY29uc3QgRVZFTlRfS0VZID0gYC4ke0RBVEFfS0VZfWBcbmNvbnN0IEVWRU5UX0ZPQ1VTSU4gPSBgZm9jdXNpbiR7RVZFTlRfS0VZfWBcbmNvbnN0IEVWRU5UX0tFWURPV05fVEFCID0gYGtleWRvd24udGFiJHtFVkVOVF9LRVl9YFxuXG5jb25zdCBUQUJfS0VZID0gJ1RhYidcbmNvbnN0IFRBQl9OQVZfRk9SV0FSRCA9ICdmb3J3YXJkJ1xuY29uc3QgVEFCX05BVl9CQUNLV0FSRCA9ICdiYWNrd2FyZCdcblxuY2xhc3MgRm9jdXNUcmFwIHtcbiAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgdGhpcy5fY29uZmlnID0gdGhpcy5fZ2V0Q29uZmlnKGNvbmZpZylcbiAgICB0aGlzLl9pc0FjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5fbGFzdFRhYk5hdkRpcmVjdGlvbiA9IG51bGxcbiAgfVxuXG4gIGFjdGl2YXRlKCkge1xuICAgIGNvbnN0IHsgdHJhcEVsZW1lbnQsIGF1dG9mb2N1cyB9ID0gdGhpcy5fY29uZmlnXG5cbiAgICBpZiAodGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChhdXRvZm9jdXMpIHtcbiAgICAgIHRyYXBFbGVtZW50LmZvY3VzKClcbiAgICB9XG5cbiAgICBFdmVudEhhbmRsZXIub2ZmKGRvY3VtZW50LCBFVkVOVF9LRVkpIC8vIGd1YXJkIGFnYWluc3QgaW5maW5pdGUgZm9jdXMgbG9vcFxuICAgIEV2ZW50SGFuZGxlci5vbihkb2N1bWVudCwgRVZFTlRfRk9DVVNJTiwgZXZlbnQgPT4gdGhpcy5faGFuZGxlRm9jdXNpbihldmVudCkpXG4gICAgRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9LRVlET1dOX1RBQiwgZXZlbnQgPT4gdGhpcy5faGFuZGxlS2V5ZG93bihldmVudCkpXG5cbiAgICB0aGlzLl9pc0FjdGl2ZSA9IHRydWVcbiAgfVxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgaWYgKCF0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5faXNBY3RpdmUgPSBmYWxzZVxuICAgIEV2ZW50SGFuZGxlci5vZmYoZG9jdW1lbnQsIEVWRU5UX0tFWSlcbiAgfVxuXG4gIC8vIFByaXZhdGVcblxuICBfaGFuZGxlRm9jdXNpbihldmVudCkge1xuICAgIGNvbnN0IHsgdGFyZ2V0IH0gPSBldmVudFxuICAgIGNvbnN0IHsgdHJhcEVsZW1lbnQgfSA9IHRoaXMuX2NvbmZpZ1xuXG4gICAgaWYgKHRhcmdldCA9PT0gZG9jdW1lbnQgfHwgdGFyZ2V0ID09PSB0cmFwRWxlbWVudCB8fCB0cmFwRWxlbWVudC5jb250YWlucyh0YXJnZXQpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBlbGVtZW50cyA9IFNlbGVjdG9yRW5naW5lLmZvY3VzYWJsZUNoaWxkcmVuKHRyYXBFbGVtZW50KVxuXG4gICAgaWYgKGVsZW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdHJhcEVsZW1lbnQuZm9jdXMoKVxuICAgIH0gZWxzZSBpZiAodGhpcy5fbGFzdFRhYk5hdkRpcmVjdGlvbiA9PT0gVEFCX05BVl9CQUNLV0FSRCkge1xuICAgICAgZWxlbWVudHNbZWxlbWVudHMubGVuZ3RoIC0gMV0uZm9jdXMoKVxuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50c1swXS5mb2N1cygpXG4gICAgfVxuICB9XG5cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQua2V5ICE9PSBUQUJfS0VZKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLl9sYXN0VGFiTmF2RGlyZWN0aW9uID0gZXZlbnQuc2hpZnRLZXkgPyBUQUJfTkFWX0JBQ0tXQVJEIDogVEFCX05BVl9GT1JXQVJEXG4gIH1cblxuICBfZ2V0Q29uZmlnKGNvbmZpZykge1xuICAgIGNvbmZpZyA9IHtcbiAgICAgIC4uLkRlZmF1bHQsXG4gICAgICAuLi4odHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcgPyBjb25maWcgOiB7fSlcbiAgICB9XG4gICAgdHlwZUNoZWNrQ29uZmlnKE5BTUUsIGNvbmZpZywgRGVmYXVsdFR5cGUpXG4gICAgcmV0dXJuIGNvbmZpZ1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZvY3VzVHJhcFxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQm9vdHN0cmFwICh2NS4xLjMpOiBtb2RhbC5qc1xuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmltcG9ydCB7XG4gIGRlZmluZUpRdWVyeVBsdWdpbixcbiAgZ2V0RWxlbWVudEZyb21TZWxlY3RvcixcbiAgaXNSVEwsXG4gIGlzVmlzaWJsZSxcbiAgcmVmbG93LFxuICB0eXBlQ2hlY2tDb25maWdcbn0gZnJvbSAnLi91dGlsL2luZGV4J1xuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tICcuL2RvbS9ldmVudC1oYW5kbGVyJ1xuaW1wb3J0IE1hbmlwdWxhdG9yIGZyb20gJy4vZG9tL21hbmlwdWxhdG9yJ1xuaW1wb3J0IFNlbGVjdG9yRW5naW5lIGZyb20gJy4vZG9tL3NlbGVjdG9yLWVuZ2luZSdcbmltcG9ydCBTY3JvbGxCYXJIZWxwZXIgZnJvbSAnLi91dGlsL3Njcm9sbGJhcidcbmltcG9ydCBCYXNlQ29tcG9uZW50IGZyb20gJy4vYmFzZS1jb21wb25lbnQnXG5pbXBvcnQgQmFja2Ryb3AgZnJvbSAnLi91dGlsL2JhY2tkcm9wJ1xuaW1wb3J0IEZvY3VzVHJhcCBmcm9tICcuL3V0aWwvZm9jdXN0cmFwJ1xuaW1wb3J0IHsgZW5hYmxlRGlzbWlzc1RyaWdnZXIgfSBmcm9tICcuL3V0aWwvY29tcG9uZW50LWZ1bmN0aW9ucydcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvbnN0YW50c1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuY29uc3QgTkFNRSA9ICdtb2RhbCdcbmNvbnN0IERBVEFfS0VZID0gJ2JzLm1vZGFsJ1xuY29uc3QgRVZFTlRfS0VZID0gYC4ke0RBVEFfS0VZfWBcbmNvbnN0IERBVEFfQVBJX0tFWSA9ICcuZGF0YS1hcGknXG5jb25zdCBFU0NBUEVfS0VZID0gJ0VzY2FwZSdcblxuY29uc3QgRGVmYXVsdCA9IHtcbiAgYmFja2Ryb3A6IHRydWUsXG4gIGtleWJvYXJkOiB0cnVlLFxuICBmb2N1czogdHJ1ZVxufVxuXG5jb25zdCBEZWZhdWx0VHlwZSA9IHtcbiAgYmFja2Ryb3A6ICcoYm9vbGVhbnxzdHJpbmcpJyxcbiAga2V5Ym9hcmQ6ICdib29sZWFuJyxcbiAgZm9jdXM6ICdib29sZWFuJ1xufVxuXG5jb25zdCBFVkVOVF9ISURFID0gYGhpZGUke0VWRU5UX0tFWX1gXG5jb25zdCBFVkVOVF9ISURFX1BSRVZFTlRFRCA9IGBoaWRlUHJldmVudGVkJHtFVkVOVF9LRVl9YFxuY29uc3QgRVZFTlRfSElEREVOID0gYGhpZGRlbiR7RVZFTlRfS0VZfWBcbmNvbnN0IEVWRU5UX1NIT1cgPSBgc2hvdyR7RVZFTlRfS0VZfWBcbmNvbnN0IEVWRU5UX1NIT1dOID0gYHNob3duJHtFVkVOVF9LRVl9YFxuY29uc3QgRVZFTlRfUkVTSVpFID0gYHJlc2l6ZSR7RVZFTlRfS0VZfWBcbmNvbnN0IEVWRU5UX0NMSUNLX0RJU01JU1MgPSBgY2xpY2suZGlzbWlzcyR7RVZFTlRfS0VZfWBcbmNvbnN0IEVWRU5UX0tFWURPV05fRElTTUlTUyA9IGBrZXlkb3duLmRpc21pc3Mke0VWRU5UX0tFWX1gXG5jb25zdCBFVkVOVF9NT1VTRVVQX0RJU01JU1MgPSBgbW91c2V1cC5kaXNtaXNzJHtFVkVOVF9LRVl9YFxuY29uc3QgRVZFTlRfTU9VU0VET1dOX0RJU01JU1MgPSBgbW91c2Vkb3duLmRpc21pc3Mke0VWRU5UX0tFWX1gXG5jb25zdCBFVkVOVF9DTElDS19EQVRBX0FQSSA9IGBjbGljayR7RVZFTlRfS0VZfSR7REFUQV9BUElfS0VZfWBcblxuY29uc3QgQ0xBU1NfTkFNRV9PUEVOID0gJ21vZGFsLW9wZW4nXG5jb25zdCBDTEFTU19OQU1FX0ZBREUgPSAnZmFkZSdcbmNvbnN0IENMQVNTX05BTUVfU0hPVyA9ICdzaG93J1xuY29uc3QgQ0xBU1NfTkFNRV9TVEFUSUMgPSAnbW9kYWwtc3RhdGljJ1xuXG5jb25zdCBPUEVOX1NFTEVDVE9SID0gJy5tb2RhbC5zaG93J1xuY29uc3QgU0VMRUNUT1JfRElBTE9HID0gJy5tb2RhbC1kaWFsb2cnXG5jb25zdCBTRUxFQ1RPUl9NT0RBTF9CT0RZID0gJy5tb2RhbC1ib2R5J1xuY29uc3QgU0VMRUNUT1JfREFUQV9UT0dHTEUgPSAnW2RhdGEtYnMtdG9nZ2xlPVwibW9kYWxcIl0nXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBDbGFzcyBEZWZpbml0aW9uXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5jbGFzcyBNb2RhbCBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBjb25maWcpIHtcbiAgICBzdXBlcihlbGVtZW50KVxuXG4gICAgdGhpcy5fY29uZmlnID0gdGhpcy5fZ2V0Q29uZmlnKGNvbmZpZylcbiAgICB0aGlzLl9kaWFsb2cgPSBTZWxlY3RvckVuZ2luZS5maW5kT25lKFNFTEVDVE9SX0RJQUxPRywgdGhpcy5fZWxlbWVudClcbiAgICB0aGlzLl9iYWNrZHJvcCA9IHRoaXMuX2luaXRpYWxpemVCYWNrRHJvcCgpXG4gICAgdGhpcy5fZm9jdXN0cmFwID0gdGhpcy5faW5pdGlhbGl6ZUZvY3VzVHJhcCgpXG4gICAgdGhpcy5faXNTaG93biA9IGZhbHNlXG4gICAgdGhpcy5faWdub3JlQmFja2Ryb3BDbGljayA9IGZhbHNlXG4gICAgdGhpcy5faXNUcmFuc2l0aW9uaW5nID0gZmFsc2VcbiAgICB0aGlzLl9zY3JvbGxCYXIgPSBuZXcgU2Nyb2xsQmFySGVscGVyKClcbiAgfVxuXG4gIC8vIEdldHRlcnNcblxuICBzdGF0aWMgZ2V0IERlZmF1bHQoKSB7XG4gICAgcmV0dXJuIERlZmF1bHRcbiAgfVxuXG4gIHN0YXRpYyBnZXQgTkFNRSgpIHtcbiAgICByZXR1cm4gTkFNRVxuICB9XG5cbiAgLy8gUHVibGljXG5cbiAgdG9nZ2xlKHJlbGF0ZWRUYXJnZXQpIHtcbiAgICByZXR1cm4gdGhpcy5faXNTaG93biA/IHRoaXMuaGlkZSgpIDogdGhpcy5zaG93KHJlbGF0ZWRUYXJnZXQpXG4gIH1cblxuICBzaG93KHJlbGF0ZWRUYXJnZXQpIHtcbiAgICBpZiAodGhpcy5faXNTaG93biB8fCB0aGlzLl9pc1RyYW5zaXRpb25pbmcpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IHNob3dFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX1NIT1csIHtcbiAgICAgIHJlbGF0ZWRUYXJnZXRcbiAgICB9KVxuXG4gICAgaWYgKHNob3dFdmVudC5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLl9pc1Nob3duID0gdHJ1ZVxuXG4gICAgaWYgKHRoaXMuX2lzQW5pbWF0ZWQoKSkge1xuICAgICAgdGhpcy5faXNUcmFuc2l0aW9uaW5nID0gdHJ1ZVxuICAgIH1cblxuICAgIHRoaXMuX3Njcm9sbEJhci5oaWRlKClcblxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX09QRU4pXG5cbiAgICB0aGlzLl9hZGp1c3REaWFsb2coKVxuXG4gICAgdGhpcy5fc2V0RXNjYXBlRXZlbnQoKVxuICAgIHRoaXMuX3NldFJlc2l6ZUV2ZW50KClcblxuICAgIEV2ZW50SGFuZGxlci5vbih0aGlzLl9kaWFsb2csIEVWRU5UX01PVVNFRE9XTl9ESVNNSVNTLCAoKSA9PiB7XG4gICAgICBFdmVudEhhbmRsZXIub25lKHRoaXMuX2VsZW1lbnQsIEVWRU5UX01PVVNFVVBfRElTTUlTUywgZXZlbnQgPT4ge1xuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSB0aGlzLl9lbGVtZW50KSB7XG4gICAgICAgICAgdGhpcy5faWdub3JlQmFja2Ryb3BDbGljayA9IHRydWVcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5fc2hvd0JhY2tkcm9wKCgpID0+IHRoaXMuX3Nob3dFbGVtZW50KHJlbGF0ZWRUYXJnZXQpKVxuICB9XG5cbiAgaGlkZSgpIHtcbiAgICBpZiAoIXRoaXMuX2lzU2hvd24gfHwgdGhpcy5faXNUcmFuc2l0aW9uaW5nKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9ISURFKVxuXG4gICAgaWYgKGhpZGVFdmVudC5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLl9pc1Nob3duID0gZmFsc2VcbiAgICBjb25zdCBpc0FuaW1hdGVkID0gdGhpcy5faXNBbmltYXRlZCgpXG5cbiAgICBpZiAoaXNBbmltYXRlZCkge1xuICAgICAgdGhpcy5faXNUcmFuc2l0aW9uaW5nID0gdHJ1ZVxuICAgIH1cblxuICAgIHRoaXMuX3NldEVzY2FwZUV2ZW50KClcbiAgICB0aGlzLl9zZXRSZXNpemVFdmVudCgpXG5cbiAgICB0aGlzLl9mb2N1c3RyYXAuZGVhY3RpdmF0ZSgpXG5cbiAgICB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKVxuXG4gICAgRXZlbnRIYW5kbGVyLm9mZih0aGlzLl9lbGVtZW50LCBFVkVOVF9DTElDS19ESVNNSVNTKVxuICAgIEV2ZW50SGFuZGxlci5vZmYodGhpcy5fZGlhbG9nLCBFVkVOVF9NT1VTRURPV05fRElTTUlTUylcblxuICAgIHRoaXMuX3F1ZXVlQ2FsbGJhY2soKCkgPT4gdGhpcy5faGlkZU1vZGFsKCksIHRoaXMuX2VsZW1lbnQsIGlzQW5pbWF0ZWQpXG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIFt3aW5kb3csIHRoaXMuX2RpYWxvZ11cbiAgICAgIC5mb3JFYWNoKGh0bWxFbGVtZW50ID0+IEV2ZW50SGFuZGxlci5vZmYoaHRtbEVsZW1lbnQsIEVWRU5UX0tFWSkpXG5cbiAgICB0aGlzLl9iYWNrZHJvcC5kaXNwb3NlKClcbiAgICB0aGlzLl9mb2N1c3RyYXAuZGVhY3RpdmF0ZSgpXG4gICAgc3VwZXIuZGlzcG9zZSgpXG4gIH1cblxuICBoYW5kbGVVcGRhdGUoKSB7XG4gICAgdGhpcy5fYWRqdXN0RGlhbG9nKClcbiAgfVxuXG4gIC8vIFByaXZhdGVcblxuICBfaW5pdGlhbGl6ZUJhY2tEcm9wKCkge1xuICAgIHJldHVybiBuZXcgQmFja2Ryb3Aoe1xuICAgICAgaXNWaXNpYmxlOiBCb29sZWFuKHRoaXMuX2NvbmZpZy5iYWNrZHJvcCksIC8vICdzdGF0aWMnIG9wdGlvbiB3aWxsIGJlIHRyYW5zbGF0ZWQgdG8gdHJ1ZSwgYW5kIGJvb2xlYW5zIHdpbGwga2VlcCB0aGVpciB2YWx1ZVxuICAgICAgaXNBbmltYXRlZDogdGhpcy5faXNBbmltYXRlZCgpXG4gICAgfSlcbiAgfVxuXG4gIF9pbml0aWFsaXplRm9jdXNUcmFwKCkge1xuICAgIHJldHVybiBuZXcgRm9jdXNUcmFwKHtcbiAgICAgIHRyYXBFbGVtZW50OiB0aGlzLl9lbGVtZW50XG4gICAgfSlcbiAgfVxuXG4gIF9nZXRDb25maWcoY29uZmlnKSB7XG4gICAgY29uZmlnID0ge1xuICAgICAgLi4uRGVmYXVsdCxcbiAgICAgIC4uLk1hbmlwdWxhdG9yLmdldERhdGFBdHRyaWJ1dGVzKHRoaXMuX2VsZW1lbnQpLFxuICAgICAgLi4uKHR5cGVvZiBjb25maWcgPT09ICdvYmplY3QnID8gY29uZmlnIDoge30pXG4gICAgfVxuICAgIHR5cGVDaGVja0NvbmZpZyhOQU1FLCBjb25maWcsIERlZmF1bHRUeXBlKVxuICAgIHJldHVybiBjb25maWdcbiAgfVxuXG4gIF9zaG93RWxlbWVudChyZWxhdGVkVGFyZ2V0KSB7XG4gICAgY29uc3QgaXNBbmltYXRlZCA9IHRoaXMuX2lzQW5pbWF0ZWQoKVxuICAgIGNvbnN0IG1vZGFsQm9keSA9IFNlbGVjdG9yRW5naW5lLmZpbmRPbmUoU0VMRUNUT1JfTU9EQUxfQk9EWSwgdGhpcy5fZGlhbG9nKVxuXG4gICAgaWYgKCF0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUgfHwgdGhpcy5fZWxlbWVudC5wYXJlbnROb2RlLm5vZGVUeXBlICE9PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgICAgLy8gRG9uJ3QgbW92ZSBtb2RhbCdzIERPTSBwb3NpdGlvblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmQodGhpcy5fZWxlbWVudClcbiAgICB9XG5cbiAgICB0aGlzLl9lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgdGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJylcbiAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1tb2RhbCcsIHRydWUpXG4gICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnZGlhbG9nJylcbiAgICB0aGlzLl9lbGVtZW50LnNjcm9sbFRvcCA9IDBcblxuICAgIGlmIChtb2RhbEJvZHkpIHtcbiAgICAgIG1vZGFsQm9keS5zY3JvbGxUb3AgPSAwXG4gICAgfVxuXG4gICAgaWYgKGlzQW5pbWF0ZWQpIHtcbiAgICAgIHJlZmxvdyh0aGlzLl9lbGVtZW50KVxuICAgIH1cblxuICAgIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpXG5cbiAgICBjb25zdCB0cmFuc2l0aW9uQ29tcGxldGUgPSAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5fY29uZmlnLmZvY3VzKSB7XG4gICAgICAgIHRoaXMuX2ZvY3VzdHJhcC5hY3RpdmF0ZSgpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2lzVHJhbnNpdGlvbmluZyA9IGZhbHNlXG4gICAgICBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9TSE9XTiwge1xuICAgICAgICByZWxhdGVkVGFyZ2V0XG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuX3F1ZXVlQ2FsbGJhY2sodHJhbnNpdGlvbkNvbXBsZXRlLCB0aGlzLl9kaWFsb2csIGlzQW5pbWF0ZWQpXG4gIH1cblxuICBfc2V0RXNjYXBlRXZlbnQoKSB7XG4gICAgaWYgKHRoaXMuX2lzU2hvd24pIHtcbiAgICAgIEV2ZW50SGFuZGxlci5vbih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlET1dOX0RJU01JU1MsIGV2ZW50ID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX2NvbmZpZy5rZXlib2FyZCAmJiBldmVudC5rZXkgPT09IEVTQ0FQRV9LRVkpIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgdGhpcy5oaWRlKClcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5fY29uZmlnLmtleWJvYXJkICYmIGV2ZW50LmtleSA9PT0gRVNDQVBFX0tFWSkge1xuICAgICAgICAgIHRoaXMuX3RyaWdnZXJCYWNrZHJvcFRyYW5zaXRpb24oKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBFdmVudEhhbmRsZXIub2ZmKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0tFWURPV05fRElTTUlTUylcbiAgICB9XG4gIH1cblxuICBfc2V0UmVzaXplRXZlbnQoKSB7XG4gICAgaWYgKHRoaXMuX2lzU2hvd24pIHtcbiAgICAgIEV2ZW50SGFuZGxlci5vbih3aW5kb3csIEVWRU5UX1JFU0laRSwgKCkgPT4gdGhpcy5fYWRqdXN0RGlhbG9nKCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIEV2ZW50SGFuZGxlci5vZmYod2luZG93LCBFVkVOVF9SRVNJWkUpXG4gICAgfVxuICB9XG5cbiAgX2hpZGVNb2RhbCgpIHtcbiAgICB0aGlzLl9lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKVxuICAgIHRoaXMuX2VsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLW1vZGFsJylcbiAgICB0aGlzLl9lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgncm9sZScpXG4gICAgdGhpcy5faXNUcmFuc2l0aW9uaW5nID0gZmFsc2VcbiAgICB0aGlzLl9iYWNrZHJvcC5oaWRlKCgpID0+IHtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX09QRU4pXG4gICAgICB0aGlzLl9yZXNldEFkanVzdG1lbnRzKClcbiAgICAgIHRoaXMuX3Njcm9sbEJhci5yZXNldCgpXG4gICAgICBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9ISURERU4pXG4gICAgfSlcbiAgfVxuXG4gIF9zaG93QmFja2Ryb3AoY2FsbGJhY2spIHtcbiAgICBFdmVudEhhbmRsZXIub24odGhpcy5fZWxlbWVudCwgRVZFTlRfQ0xJQ0tfRElTTUlTUywgZXZlbnQgPT4ge1xuICAgICAgaWYgKHRoaXMuX2lnbm9yZUJhY2tkcm9wQ2xpY2spIHtcbiAgICAgICAgdGhpcy5faWdub3JlQmFja2Ryb3BDbGljayA9IGZhbHNlXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAoZXZlbnQudGFyZ2V0ICE9PSBldmVudC5jdXJyZW50VGFyZ2V0KSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fY29uZmlnLmJhY2tkcm9wID09PSB0cnVlKSB7XG4gICAgICAgIHRoaXMuaGlkZSgpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2NvbmZpZy5iYWNrZHJvcCA9PT0gJ3N0YXRpYycpIHtcbiAgICAgICAgdGhpcy5fdHJpZ2dlckJhY2tkcm9wVHJhbnNpdGlvbigpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuX2JhY2tkcm9wLnNob3coY2FsbGJhY2spXG4gIH1cblxuICBfaXNBbmltYXRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9GQURFKVxuICB9XG5cbiAgX3RyaWdnZXJCYWNrZHJvcFRyYW5zaXRpb24oKSB7XG4gICAgY29uc3QgaGlkZUV2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfSElERV9QUkVWRU5URUQpXG4gICAgaWYgKGhpZGVFdmVudC5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCB7IGNsYXNzTGlzdCwgc2Nyb2xsSGVpZ2h0LCBzdHlsZSB9ID0gdGhpcy5fZWxlbWVudFxuICAgIGNvbnN0IGlzTW9kYWxPdmVyZmxvd2luZyA9IHNjcm9sbEhlaWdodCA+IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHRcblxuICAgIC8vIHJldHVybiBpZiB0aGUgZm9sbG93aW5nIGJhY2tncm91bmQgdHJhbnNpdGlvbiBoYXNuJ3QgeWV0IGNvbXBsZXRlZFxuICAgIGlmICgoIWlzTW9kYWxPdmVyZmxvd2luZyAmJiBzdHlsZS5vdmVyZmxvd1kgPT09ICdoaWRkZW4nKSB8fCBjbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9TVEFUSUMpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoIWlzTW9kYWxPdmVyZmxvd2luZykge1xuICAgICAgc3R5bGUub3ZlcmZsb3dZID0gJ2hpZGRlbidcbiAgICB9XG5cbiAgICBjbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU1RBVElDKVxuICAgIHRoaXMuX3F1ZXVlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX1NUQVRJQylcbiAgICAgIGlmICghaXNNb2RhbE92ZXJmbG93aW5nKSB7XG4gICAgICAgIHRoaXMuX3F1ZXVlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgICAgIHN0eWxlLm92ZXJmbG93WSA9ICcnXG4gICAgICAgIH0sIHRoaXMuX2RpYWxvZylcbiAgICAgIH1cbiAgICB9LCB0aGlzLl9kaWFsb2cpXG5cbiAgICB0aGlzLl9lbGVtZW50LmZvY3VzKClcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gdGhlIGZvbGxvd2luZyBtZXRob2RzIGFyZSB1c2VkIHRvIGhhbmRsZSBvdmVyZmxvd2luZyBtb2RhbHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIF9hZGp1c3REaWFsb2coKSB7XG4gICAgY29uc3QgaXNNb2RhbE92ZXJmbG93aW5nID0gdGhpcy5fZWxlbWVudC5zY3JvbGxIZWlnaHQgPiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG4gICAgY29uc3Qgc2Nyb2xsYmFyV2lkdGggPSB0aGlzLl9zY3JvbGxCYXIuZ2V0V2lkdGgoKVxuICAgIGNvbnN0IGlzQm9keU92ZXJmbG93aW5nID0gc2Nyb2xsYmFyV2lkdGggPiAwXG5cbiAgICBpZiAoKCFpc0JvZHlPdmVyZmxvd2luZyAmJiBpc01vZGFsT3ZlcmZsb3dpbmcgJiYgIWlzUlRMKCkpIHx8IChpc0JvZHlPdmVyZmxvd2luZyAmJiAhaXNNb2RhbE92ZXJmbG93aW5nICYmIGlzUlRMKCkpKSB7XG4gICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmdMZWZ0ID0gYCR7c2Nyb2xsYmFyV2lkdGh9cHhgXG4gICAgfVxuXG4gICAgaWYgKChpc0JvZHlPdmVyZmxvd2luZyAmJiAhaXNNb2RhbE92ZXJmbG93aW5nICYmICFpc1JUTCgpKSB8fCAoIWlzQm9keU92ZXJmbG93aW5nICYmIGlzTW9kYWxPdmVyZmxvd2luZyAmJiBpc1JUTCgpKSkge1xuICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHQgPSBgJHtzY3JvbGxiYXJXaWR0aH1weGBcbiAgICB9XG4gIH1cblxuICBfcmVzZXRBZGp1c3RtZW50cygpIHtcbiAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmdMZWZ0ID0gJydcbiAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodCA9ICcnXG4gIH1cblxuICAvLyBTdGF0aWNcblxuICBzdGF0aWMgalF1ZXJ5SW50ZXJmYWNlKGNvbmZpZywgcmVsYXRlZFRhcmdldCkge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgZGF0YSA9IE1vZGFsLmdldE9yQ3JlYXRlSW5zdGFuY2UodGhpcywgY29uZmlnKVxuXG4gICAgICBpZiAodHlwZW9mIGNvbmZpZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgZGF0YVtjb25maWddID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBObyBtZXRob2QgbmFtZWQgXCIke2NvbmZpZ31cImApXG4gICAgICB9XG5cbiAgICAgIGRhdGFbY29uZmlnXShyZWxhdGVkVGFyZ2V0KVxuICAgIH0pXG4gIH1cbn1cblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIERhdGEgQXBpIGltcGxlbWVudGF0aW9uXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5FdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0NMSUNLX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gIGNvbnN0IHRhcmdldCA9IGdldEVsZW1lbnRGcm9tU2VsZWN0b3IodGhpcylcblxuICBpZiAoWydBJywgJ0FSRUEnXS5pbmNsdWRlcyh0aGlzLnRhZ05hbWUpKSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICB9XG5cbiAgRXZlbnRIYW5kbGVyLm9uZSh0YXJnZXQsIEVWRU5UX1NIT1csIHNob3dFdmVudCA9PiB7XG4gICAgaWYgKHNob3dFdmVudC5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICAvLyBvbmx5IHJlZ2lzdGVyIGZvY3VzIHJlc3RvcmVyIGlmIG1vZGFsIHdpbGwgYWN0dWFsbHkgZ2V0IHNob3duXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBFdmVudEhhbmRsZXIub25lKHRhcmdldCwgRVZFTlRfSElEREVOLCAoKSA9PiB7XG4gICAgICBpZiAoaXNWaXNpYmxlKHRoaXMpKSB7XG4gICAgICAgIHRoaXMuZm9jdXMoKVxuICAgICAgfVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gYXZvaWQgY29uZmxpY3Qgd2hlbiBjbGlja2luZyBtb2RkYWwgdG9nZ2xlciB3aGlsZSBhbm90aGVyIG9uZSBpcyBvcGVuXG4gIGNvbnN0IGFsbFJlYWR5T3BlbiA9IFNlbGVjdG9yRW5naW5lLmZpbmRPbmUoT1BFTl9TRUxFQ1RPUilcbiAgaWYgKGFsbFJlYWR5T3Blbikge1xuICAgIE1vZGFsLmdldEluc3RhbmNlKGFsbFJlYWR5T3BlbikuaGlkZSgpXG4gIH1cblxuICBjb25zdCBkYXRhID0gTW9kYWwuZ2V0T3JDcmVhdGVJbnN0YW5jZSh0YXJnZXQpXG5cbiAgZGF0YS50b2dnbGUodGhpcylcbn0pXG5cbmVuYWJsZURpc21pc3NUcmlnZ2VyKE1vZGFsKVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogalF1ZXJ5XG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIGFkZCAuTW9kYWwgdG8galF1ZXJ5IG9ubHkgaWYgalF1ZXJ5IGlzIHByZXNlbnRcbiAqL1xuXG5kZWZpbmVKUXVlcnlQbHVnaW4oTW9kYWwpXG5cbmV4cG9ydCBkZWZhdWx0IE1vZGFsXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBCb290c3RyYXAgKHY1LjEuMyk6IG9mZmNhbnZhcy5qc1xuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmltcG9ydCB7XG4gIGRlZmluZUpRdWVyeVBsdWdpbixcbiAgZ2V0RWxlbWVudEZyb21TZWxlY3RvcixcbiAgaXNEaXNhYmxlZCxcbiAgaXNWaXNpYmxlLFxuICB0eXBlQ2hlY2tDb25maWdcbn0gZnJvbSAnLi91dGlsL2luZGV4J1xuaW1wb3J0IFNjcm9sbEJhckhlbHBlciBmcm9tICcuL3V0aWwvc2Nyb2xsYmFyJ1xuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tICcuL2RvbS9ldmVudC1oYW5kbGVyJ1xuaW1wb3J0IEJhc2VDb21wb25lbnQgZnJvbSAnLi9iYXNlLWNvbXBvbmVudCdcbmltcG9ydCBTZWxlY3RvckVuZ2luZSBmcm9tICcuL2RvbS9zZWxlY3Rvci1lbmdpbmUnXG5pbXBvcnQgTWFuaXB1bGF0b3IgZnJvbSAnLi9kb20vbWFuaXB1bGF0b3InXG5pbXBvcnQgQmFja2Ryb3AgZnJvbSAnLi91dGlsL2JhY2tkcm9wJ1xuaW1wb3J0IEZvY3VzVHJhcCBmcm9tICcuL3V0aWwvZm9jdXN0cmFwJ1xuaW1wb3J0IHsgZW5hYmxlRGlzbWlzc1RyaWdnZXIgfSBmcm9tICcuL3V0aWwvY29tcG9uZW50LWZ1bmN0aW9ucydcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvbnN0YW50c1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuY29uc3QgTkFNRSA9ICdvZmZjYW52YXMnXG5jb25zdCBEQVRBX0tFWSA9ICdicy5vZmZjYW52YXMnXG5jb25zdCBFVkVOVF9LRVkgPSBgLiR7REFUQV9LRVl9YFxuY29uc3QgREFUQV9BUElfS0VZID0gJy5kYXRhLWFwaSdcbmNvbnN0IEVWRU5UX0xPQURfREFUQV9BUEkgPSBgbG9hZCR7RVZFTlRfS0VZfSR7REFUQV9BUElfS0VZfWBcbmNvbnN0IEVTQ0FQRV9LRVkgPSAnRXNjYXBlJ1xuXG5jb25zdCBEZWZhdWx0ID0ge1xuICBiYWNrZHJvcDogdHJ1ZSxcbiAga2V5Ym9hcmQ6IHRydWUsXG4gIHNjcm9sbDogZmFsc2Vcbn1cblxuY29uc3QgRGVmYXVsdFR5cGUgPSB7XG4gIGJhY2tkcm9wOiAnYm9vbGVhbicsXG4gIGtleWJvYXJkOiAnYm9vbGVhbicsXG4gIHNjcm9sbDogJ2Jvb2xlYW4nXG59XG5cbmNvbnN0IENMQVNTX05BTUVfU0hPVyA9ICdzaG93J1xuY29uc3QgQ0xBU1NfTkFNRV9CQUNLRFJPUCA9ICdvZmZjYW52YXMtYmFja2Ryb3AnXG5jb25zdCBPUEVOX1NFTEVDVE9SID0gJy5vZmZjYW52YXMuc2hvdydcblxuY29uc3QgRVZFTlRfU0hPVyA9IGBzaG93JHtFVkVOVF9LRVl9YFxuY29uc3QgRVZFTlRfU0hPV04gPSBgc2hvd24ke0VWRU5UX0tFWX1gXG5jb25zdCBFVkVOVF9ISURFID0gYGhpZGUke0VWRU5UX0tFWX1gXG5jb25zdCBFVkVOVF9ISURERU4gPSBgaGlkZGVuJHtFVkVOVF9LRVl9YFxuY29uc3QgRVZFTlRfQ0xJQ0tfREFUQV9BUEkgPSBgY2xpY2ske0VWRU5UX0tFWX0ke0RBVEFfQVBJX0tFWX1gXG5jb25zdCBFVkVOVF9LRVlET1dOX0RJU01JU1MgPSBga2V5ZG93bi5kaXNtaXNzJHtFVkVOVF9LRVl9YFxuXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSA9ICdbZGF0YS1icy10b2dnbGU9XCJvZmZjYW52YXNcIl0nXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBDbGFzcyBEZWZpbml0aW9uXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5jbGFzcyBPZmZjYW52YXMgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoZWxlbWVudCwgY29uZmlnKSB7XG4gICAgc3VwZXIoZWxlbWVudClcblxuICAgIHRoaXMuX2NvbmZpZyA9IHRoaXMuX2dldENvbmZpZyhjb25maWcpXG4gICAgdGhpcy5faXNTaG93biA9IGZhbHNlXG4gICAgdGhpcy5fYmFja2Ryb3AgPSB0aGlzLl9pbml0aWFsaXplQmFja0Ryb3AoKVxuICAgIHRoaXMuX2ZvY3VzdHJhcCA9IHRoaXMuX2luaXRpYWxpemVGb2N1c1RyYXAoKVxuICAgIHRoaXMuX2FkZEV2ZW50TGlzdGVuZXJzKClcbiAgfVxuXG4gIC8vIEdldHRlcnNcblxuICBzdGF0aWMgZ2V0IE5BTUUoKSB7XG4gICAgcmV0dXJuIE5BTUVcbiAgfVxuXG4gIHN0YXRpYyBnZXQgRGVmYXVsdCgpIHtcbiAgICByZXR1cm4gRGVmYXVsdFxuICB9XG5cbiAgLy8gUHVibGljXG5cbiAgdG9nZ2xlKHJlbGF0ZWRUYXJnZXQpIHtcbiAgICByZXR1cm4gdGhpcy5faXNTaG93biA/IHRoaXMuaGlkZSgpIDogdGhpcy5zaG93KHJlbGF0ZWRUYXJnZXQpXG4gIH1cblxuICBzaG93KHJlbGF0ZWRUYXJnZXQpIHtcbiAgICBpZiAodGhpcy5faXNTaG93bikge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3Qgc2hvd0V2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfU0hPVywgeyByZWxhdGVkVGFyZ2V0IH0pXG5cbiAgICBpZiAoc2hvd0V2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMuX2lzU2hvd24gPSB0cnVlXG4gICAgdGhpcy5fZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnXG5cbiAgICB0aGlzLl9iYWNrZHJvcC5zaG93KClcblxuICAgIGlmICghdGhpcy5fY29uZmlnLnNjcm9sbCkge1xuICAgICAgbmV3IFNjcm9sbEJhckhlbHBlcigpLmhpZGUoKVxuICAgIH1cblxuICAgIHRoaXMuX2VsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpXG4gICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbW9kYWwnLCB0cnVlKVxuICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2RpYWxvZycpXG4gICAgdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU0hPVylcblxuICAgIGNvbnN0IGNvbXBsZXRlQ2FsbEJhY2sgPSAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX2NvbmZpZy5zY3JvbGwpIHtcbiAgICAgICAgdGhpcy5fZm9jdXN0cmFwLmFjdGl2YXRlKClcbiAgICAgIH1cblxuICAgICAgRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfU0hPV04sIHsgcmVsYXRlZFRhcmdldCB9KVxuICAgIH1cblxuICAgIHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsQmFjaywgdGhpcy5fZWxlbWVudCwgdHJ1ZSlcbiAgfVxuXG4gIGhpZGUoKSB7XG4gICAgaWYgKCF0aGlzLl9pc1Nob3duKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBoaWRlRXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCBFVkVOVF9ISURFKVxuXG4gICAgaWYgKGhpZGVFdmVudC5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLl9mb2N1c3RyYXAuZGVhY3RpdmF0ZSgpXG4gICAgdGhpcy5fZWxlbWVudC5ibHVyKClcbiAgICB0aGlzLl9pc1Nob3duID0gZmFsc2VcbiAgICB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKVxuICAgIHRoaXMuX2JhY2tkcm9wLmhpZGUoKVxuXG4gICAgY29uc3QgY29tcGxldGVDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpXG4gICAgICB0aGlzLl9lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1tb2RhbCcpXG4gICAgICB0aGlzLl9lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgncm9sZScpXG4gICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJ1xuXG4gICAgICBpZiAoIXRoaXMuX2NvbmZpZy5zY3JvbGwpIHtcbiAgICAgICAgbmV3IFNjcm9sbEJhckhlbHBlcigpLnJlc2V0KClcbiAgICAgIH1cblxuICAgICAgRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfSElEREVOKVxuICAgIH1cblxuICAgIHRoaXMuX3F1ZXVlQ2FsbGJhY2soY29tcGxldGVDYWxsYmFjaywgdGhpcy5fZWxlbWVudCwgdHJ1ZSlcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5fYmFja2Ryb3AuZGlzcG9zZSgpXG4gICAgdGhpcy5fZm9jdXN0cmFwLmRlYWN0aXZhdGUoKVxuICAgIHN1cGVyLmRpc3Bvc2UoKVxuICB9XG5cbiAgLy8gUHJpdmF0ZVxuXG4gIF9nZXRDb25maWcoY29uZmlnKSB7XG4gICAgY29uZmlnID0ge1xuICAgICAgLi4uRGVmYXVsdCxcbiAgICAgIC4uLk1hbmlwdWxhdG9yLmdldERhdGFBdHRyaWJ1dGVzKHRoaXMuX2VsZW1lbnQpLFxuICAgICAgLi4uKHR5cGVvZiBjb25maWcgPT09ICdvYmplY3QnID8gY29uZmlnIDoge30pXG4gICAgfVxuICAgIHR5cGVDaGVja0NvbmZpZyhOQU1FLCBjb25maWcsIERlZmF1bHRUeXBlKVxuICAgIHJldHVybiBjb25maWdcbiAgfVxuXG4gIF9pbml0aWFsaXplQmFja0Ryb3AoKSB7XG4gICAgcmV0dXJuIG5ldyBCYWNrZHJvcCh7XG4gICAgICBjbGFzc05hbWU6IENMQVNTX05BTUVfQkFDS0RST1AsXG4gICAgICBpc1Zpc2libGU6IHRoaXMuX2NvbmZpZy5iYWNrZHJvcCxcbiAgICAgIGlzQW5pbWF0ZWQ6IHRydWUsXG4gICAgICByb290RWxlbWVudDogdGhpcy5fZWxlbWVudC5wYXJlbnROb2RlLFxuICAgICAgY2xpY2tDYWxsYmFjazogKCkgPT4gdGhpcy5oaWRlKClcbiAgICB9KVxuICB9XG5cbiAgX2luaXRpYWxpemVGb2N1c1RyYXAoKSB7XG4gICAgcmV0dXJuIG5ldyBGb2N1c1RyYXAoe1xuICAgICAgdHJhcEVsZW1lbnQ6IHRoaXMuX2VsZW1lbnRcbiAgICB9KVxuICB9XG5cbiAgX2FkZEV2ZW50TGlzdGVuZXJzKCkge1xuICAgIEV2ZW50SGFuZGxlci5vbih0aGlzLl9lbGVtZW50LCBFVkVOVF9LRVlET1dOX0RJU01JU1MsIGV2ZW50ID0+IHtcbiAgICAgIGlmICh0aGlzLl9jb25maWcua2V5Ym9hcmQgJiYgZXZlbnQua2V5ID09PSBFU0NBUEVfS0VZKSB7XG4gICAgICAgIHRoaXMuaGlkZSgpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8vIFN0YXRpY1xuXG4gIHN0YXRpYyBqUXVlcnlJbnRlcmZhY2UoY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBkYXRhID0gT2ZmY2FudmFzLmdldE9yQ3JlYXRlSW5zdGFuY2UodGhpcywgY29uZmlnKVxuXG4gICAgICBpZiAodHlwZW9mIGNvbmZpZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmIChkYXRhW2NvbmZpZ10gPT09IHVuZGVmaW5lZCB8fCBjb25maWcuc3RhcnRzV2l0aCgnXycpIHx8IGNvbmZpZyA9PT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBObyBtZXRob2QgbmFtZWQgXCIke2NvbmZpZ31cImApXG4gICAgICB9XG5cbiAgICAgIGRhdGFbY29uZmlnXSh0aGlzKVxuICAgIH0pXG4gIH1cbn1cblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIERhdGEgQXBpIGltcGxlbWVudGF0aW9uXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5FdmVudEhhbmRsZXIub24oZG9jdW1lbnQsIEVWRU5UX0NMSUNLX0RBVEFfQVBJLCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gIGNvbnN0IHRhcmdldCA9IGdldEVsZW1lbnRGcm9tU2VsZWN0b3IodGhpcylcblxuICBpZiAoWydBJywgJ0FSRUEnXS5pbmNsdWRlcyh0aGlzLnRhZ05hbWUpKSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICB9XG5cbiAgaWYgKGlzRGlzYWJsZWQodGhpcykpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIEV2ZW50SGFuZGxlci5vbmUodGFyZ2V0LCBFVkVOVF9ISURERU4sICgpID0+IHtcbiAgICAvLyBmb2N1cyBvbiB0cmlnZ2VyIHdoZW4gaXQgaXMgY2xvc2VkXG4gICAgaWYgKGlzVmlzaWJsZSh0aGlzKSkge1xuICAgICAgdGhpcy5mb2N1cygpXG4gICAgfVxuICB9KVxuXG4gIC8vIGF2b2lkIGNvbmZsaWN0IHdoZW4gY2xpY2tpbmcgYSB0b2dnbGVyIG9mIGFuIG9mZmNhbnZhcywgd2hpbGUgYW5vdGhlciBpcyBvcGVuXG4gIGNvbnN0IGFsbFJlYWR5T3BlbiA9IFNlbGVjdG9yRW5naW5lLmZpbmRPbmUoT1BFTl9TRUxFQ1RPUilcbiAgaWYgKGFsbFJlYWR5T3BlbiAmJiBhbGxSZWFkeU9wZW4gIT09IHRhcmdldCkge1xuICAgIE9mZmNhbnZhcy5nZXRJbnN0YW5jZShhbGxSZWFkeU9wZW4pLmhpZGUoKVxuICB9XG5cbiAgY29uc3QgZGF0YSA9IE9mZmNhbnZhcy5nZXRPckNyZWF0ZUluc3RhbmNlKHRhcmdldClcbiAgZGF0YS50b2dnbGUodGhpcylcbn0pXG5cbkV2ZW50SGFuZGxlci5vbih3aW5kb3csIEVWRU5UX0xPQURfREFUQV9BUEksICgpID0+XG4gIFNlbGVjdG9yRW5naW5lLmZpbmQoT1BFTl9TRUxFQ1RPUikuZm9yRWFjaChlbCA9PiBPZmZjYW52YXMuZ2V0T3JDcmVhdGVJbnN0YW5jZShlbCkuc2hvdygpKVxuKVxuXG5lbmFibGVEaXNtaXNzVHJpZ2dlcihPZmZjYW52YXMpXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogalF1ZXJ5XG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5kZWZpbmVKUXVlcnlQbHVnaW4oT2ZmY2FudmFzKVxuXG5leHBvcnQgZGVmYXVsdCBPZmZjYW52YXNcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEJvb3RzdHJhcCAodjUuMS4zKTogdXRpbC9zYW5pdGl6ZXIuanNcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFpbi9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5jb25zdCB1cmlBdHRyaWJ1dGVzID0gbmV3IFNldChbXG4gICdiYWNrZ3JvdW5kJyxcbiAgJ2NpdGUnLFxuICAnaHJlZicsXG4gICdpdGVtdHlwZScsXG4gICdsb25nZGVzYycsXG4gICdwb3N0ZXInLFxuICAnc3JjJyxcbiAgJ3hsaW5rOmhyZWYnXG5dKVxuXG5jb25zdCBBUklBX0FUVFJJQlVURV9QQVRURVJOID0gL15hcmlhLVtcXHctXSokL2lcblxuLyoqXG4gKiBBIHBhdHRlcm4gdGhhdCByZWNvZ25pemVzIGEgY29tbW9ubHkgdXNlZnVsIHN1YnNldCBvZiBVUkxzIHRoYXQgYXJlIHNhZmUuXG4gKlxuICogU2hvdXRvdXQgdG8gQW5ndWxhciBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2Jsb2IvMTIuMi54L3BhY2thZ2VzL2NvcmUvc3JjL3Nhbml0aXphdGlvbi91cmxfc2FuaXRpemVyLnRzXG4gKi9cbmNvbnN0IFNBRkVfVVJMX1BBVFRFUk4gPSAvXig/Oig/Omh0dHBzP3xtYWlsdG98ZnRwfHRlbHxmaWxlfHNtcyk6fFteIyYvOj9dKig/OlsjLz9dfCQpKS9pXG5cbi8qKlxuICogQSBwYXR0ZXJuIHRoYXQgbWF0Y2hlcyBzYWZlIGRhdGEgVVJMcy4gT25seSBtYXRjaGVzIGltYWdlLCB2aWRlbyBhbmQgYXVkaW8gdHlwZXMuXG4gKlxuICogU2hvdXRvdXQgdG8gQW5ndWxhciBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2Jsb2IvMTIuMi54L3BhY2thZ2VzL2NvcmUvc3JjL3Nhbml0aXphdGlvbi91cmxfc2FuaXRpemVyLnRzXG4gKi9cbmNvbnN0IERBVEFfVVJMX1BBVFRFUk4gPSAvXmRhdGE6KD86aW1hZ2VcXC8oPzpibXB8Z2lmfGpwZWd8anBnfHBuZ3x0aWZmfHdlYnApfHZpZGVvXFwvKD86bXBlZ3xtcDR8b2dnfHdlYm0pfGF1ZGlvXFwvKD86bXAzfG9nYXxvZ2d8b3B1cykpO2Jhc2U2NCxbXFxkKy9hLXpdKz0qJC9pXG5cbmNvbnN0IGFsbG93ZWRBdHRyaWJ1dGUgPSAoYXR0cmlidXRlLCBhbGxvd2VkQXR0cmlidXRlTGlzdCkgPT4ge1xuICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gYXR0cmlidXRlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKClcblxuICBpZiAoYWxsb3dlZEF0dHJpYnV0ZUxpc3QuaW5jbHVkZXMoYXR0cmlidXRlTmFtZSkpIHtcbiAgICBpZiAodXJpQXR0cmlidXRlcy5oYXMoYXR0cmlidXRlTmFtZSkpIHtcbiAgICAgIHJldHVybiBCb29sZWFuKFNBRkVfVVJMX1BBVFRFUk4udGVzdChhdHRyaWJ1dGUubm9kZVZhbHVlKSB8fCBEQVRBX1VSTF9QQVRURVJOLnRlc3QoYXR0cmlidXRlLm5vZGVWYWx1ZSkpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGNvbnN0IHJlZ0V4cCA9IGFsbG93ZWRBdHRyaWJ1dGVMaXN0LmZpbHRlcihhdHRyaWJ1dGVSZWdleCA9PiBhdHRyaWJ1dGVSZWdleCBpbnN0YW5jZW9mIFJlZ0V4cClcblxuICAvLyBDaGVjayBpZiBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB2YWxpZGF0ZXMgdGhlIGF0dHJpYnV0ZS5cbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHJlZ0V4cC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChyZWdFeHBbaV0udGVzdChhdHRyaWJ1dGVOYW1lKSkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2Vcbn1cblxuZXhwb3J0IGNvbnN0IERlZmF1bHRBbGxvd2xpc3QgPSB7XG4gIC8vIEdsb2JhbCBhdHRyaWJ1dGVzIGFsbG93ZWQgb24gYW55IHN1cHBsaWVkIGVsZW1lbnQgYmVsb3cuXG4gICcqJzogWydjbGFzcycsICdkaXInLCAnaWQnLCAnbGFuZycsICdyb2xlJywgQVJJQV9BVFRSSUJVVEVfUEFUVEVSTl0sXG4gIGE6IFsndGFyZ2V0JywgJ2hyZWYnLCAndGl0bGUnLCAncmVsJ10sXG4gIGFyZWE6IFtdLFxuICBiOiBbXSxcbiAgYnI6IFtdLFxuICBjb2w6IFtdLFxuICBjb2RlOiBbXSxcbiAgZGl2OiBbXSxcbiAgZW06IFtdLFxuICBocjogW10sXG4gIGgxOiBbXSxcbiAgaDI6IFtdLFxuICBoMzogW10sXG4gIGg0OiBbXSxcbiAgaDU6IFtdLFxuICBoNjogW10sXG4gIGk6IFtdLFxuICBpbWc6IFsnc3JjJywgJ3NyY3NldCcsICdhbHQnLCAndGl0bGUnLCAnd2lkdGgnLCAnaGVpZ2h0J10sXG4gIGxpOiBbXSxcbiAgb2w6IFtdLFxuICBwOiBbXSxcbiAgcHJlOiBbXSxcbiAgczogW10sXG4gIHNtYWxsOiBbXSxcbiAgc3BhbjogW10sXG4gIHN1YjogW10sXG4gIHN1cDogW10sXG4gIHN0cm9uZzogW10sXG4gIHU6IFtdLFxuICB1bDogW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplSHRtbCh1bnNhZmVIdG1sLCBhbGxvd0xpc3QsIHNhbml0aXplRm4pIHtcbiAgaWYgKCF1bnNhZmVIdG1sLmxlbmd0aCkge1xuICAgIHJldHVybiB1bnNhZmVIdG1sXG4gIH1cblxuICBpZiAoc2FuaXRpemVGbiAmJiB0eXBlb2Ygc2FuaXRpemVGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBzYW5pdGl6ZUZuKHVuc2FmZUh0bWwpXG4gIH1cblxuICBjb25zdCBkb21QYXJzZXIgPSBuZXcgd2luZG93LkRPTVBhcnNlcigpXG4gIGNvbnN0IGNyZWF0ZWREb2N1bWVudCA9IGRvbVBhcnNlci5wYXJzZUZyb21TdHJpbmcodW5zYWZlSHRtbCwgJ3RleHQvaHRtbCcpXG4gIGNvbnN0IGVsZW1lbnRzID0gW10uY29uY2F0KC4uLmNyZWF0ZWREb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3JBbGwoJyonKSlcblxuICBmb3IgKGxldCBpID0gMCwgbGVuID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBjb25zdCBlbGVtZW50ID0gZWxlbWVudHNbaV1cbiAgICBjb25zdCBlbGVtZW50TmFtZSA9IGVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKVxuXG4gICAgaWYgKCFPYmplY3Qua2V5cyhhbGxvd0xpc3QpLmluY2x1ZGVzKGVsZW1lbnROYW1lKSkge1xuICAgICAgZWxlbWVudC5yZW1vdmUoKVxuXG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIGNvbnN0IGF0dHJpYnV0ZUxpc3QgPSBbXS5jb25jYXQoLi4uZWxlbWVudC5hdHRyaWJ1dGVzKVxuICAgIGNvbnN0IGFsbG93ZWRBdHRyaWJ1dGVzID0gW10uY29uY2F0KGFsbG93TGlzdFsnKiddIHx8IFtdLCBhbGxvd0xpc3RbZWxlbWVudE5hbWVdIHx8IFtdKVxuXG4gICAgYXR0cmlidXRlTGlzdC5mb3JFYWNoKGF0dHJpYnV0ZSA9PiB7XG4gICAgICBpZiAoIWFsbG93ZWRBdHRyaWJ1dGUoYXR0cmlidXRlLCBhbGxvd2VkQXR0cmlidXRlcykpIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlLm5vZGVOYW1lKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gY3JlYXRlZERvY3VtZW50LmJvZHkuaW5uZXJIVE1MXG59XG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBCb290c3RyYXAgKHY1LjEuMyk6IHRvb2x0aXAuanNcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFpbi9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5pbXBvcnQgKiBhcyBQb3BwZXIgZnJvbSAnQHBvcHBlcmpzL2NvcmUnXG5cbmltcG9ydCB7XG4gIGRlZmluZUpRdWVyeVBsdWdpbixcbiAgZmluZFNoYWRvd1Jvb3QsXG4gIGdldEVsZW1lbnQsXG4gIGdldFVJRCxcbiAgaXNFbGVtZW50LFxuICBpc1JUTCxcbiAgbm9vcCxcbiAgdHlwZUNoZWNrQ29uZmlnXG59IGZyb20gJy4vdXRpbC9pbmRleCdcbmltcG9ydCB7IERlZmF1bHRBbGxvd2xpc3QsIHNhbml0aXplSHRtbCB9IGZyb20gJy4vdXRpbC9zYW5pdGl6ZXInXG5pbXBvcnQgRGF0YSBmcm9tICcuL2RvbS9kYXRhJ1xuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tICcuL2RvbS9ldmVudC1oYW5kbGVyJ1xuaW1wb3J0IE1hbmlwdWxhdG9yIGZyb20gJy4vZG9tL21hbmlwdWxhdG9yJ1xuaW1wb3J0IFNlbGVjdG9yRW5naW5lIGZyb20gJy4vZG9tL3NlbGVjdG9yLWVuZ2luZSdcbmltcG9ydCBCYXNlQ29tcG9uZW50IGZyb20gJy4vYmFzZS1jb21wb25lbnQnXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBDb25zdGFudHNcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmNvbnN0IE5BTUUgPSAndG9vbHRpcCdcbmNvbnN0IERBVEFfS0VZID0gJ2JzLnRvb2x0aXAnXG5jb25zdCBFVkVOVF9LRVkgPSBgLiR7REFUQV9LRVl9YFxuY29uc3QgQ0xBU1NfUFJFRklYID0gJ2JzLXRvb2x0aXAnXG5jb25zdCBESVNBTExPV0VEX0FUVFJJQlVURVMgPSBuZXcgU2V0KFsnc2FuaXRpemUnLCAnYWxsb3dMaXN0JywgJ3Nhbml0aXplRm4nXSlcblxuY29uc3QgRGVmYXVsdFR5cGUgPSB7XG4gIGFuaW1hdGlvbjogJ2Jvb2xlYW4nLFxuICB0ZW1wbGF0ZTogJ3N0cmluZycsXG4gIHRpdGxlOiAnKHN0cmluZ3xlbGVtZW50fGZ1bmN0aW9uKScsXG4gIHRyaWdnZXI6ICdzdHJpbmcnLFxuICBkZWxheTogJyhudW1iZXJ8b2JqZWN0KScsXG4gIGh0bWw6ICdib29sZWFuJyxcbiAgc2VsZWN0b3I6ICcoc3RyaW5nfGJvb2xlYW4pJyxcbiAgcGxhY2VtZW50OiAnKHN0cmluZ3xmdW5jdGlvbiknLFxuICBvZmZzZXQ6ICcoYXJyYXl8c3RyaW5nfGZ1bmN0aW9uKScsXG4gIGNvbnRhaW5lcjogJyhzdHJpbmd8ZWxlbWVudHxib29sZWFuKScsXG4gIGZhbGxiYWNrUGxhY2VtZW50czogJ2FycmF5JyxcbiAgYm91bmRhcnk6ICcoc3RyaW5nfGVsZW1lbnQpJyxcbiAgY3VzdG9tQ2xhc3M6ICcoc3RyaW5nfGZ1bmN0aW9uKScsXG4gIHNhbml0aXplOiAnYm9vbGVhbicsXG4gIHNhbml0aXplRm46ICcobnVsbHxmdW5jdGlvbiknLFxuICBhbGxvd0xpc3Q6ICdvYmplY3QnLFxuICBwb3BwZXJDb25maWc6ICcobnVsbHxvYmplY3R8ZnVuY3Rpb24pJ1xufVxuXG5jb25zdCBBdHRhY2htZW50TWFwID0ge1xuICBBVVRPOiAnYXV0bycsXG4gIFRPUDogJ3RvcCcsXG4gIFJJR0hUOiBpc1JUTCgpID8gJ2xlZnQnIDogJ3JpZ2h0JyxcbiAgQk9UVE9NOiAnYm90dG9tJyxcbiAgTEVGVDogaXNSVEwoKSA/ICdyaWdodCcgOiAnbGVmdCdcbn1cblxuY29uc3QgRGVmYXVsdCA9IHtcbiAgYW5pbWF0aW9uOiB0cnVlLFxuICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJ0b29sdGlwXCIgcm9sZT1cInRvb2x0aXBcIj4nICtcbiAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJ0b29sdGlwLWFycm93XCI+PC9kaXY+JyArXG4gICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwidG9vbHRpcC1pbm5lclwiPjwvZGl2PicgK1xuICAgICAgICAgICAgJzwvZGl2PicsXG4gIHRyaWdnZXI6ICdob3ZlciBmb2N1cycsXG4gIHRpdGxlOiAnJyxcbiAgZGVsYXk6IDAsXG4gIGh0bWw6IGZhbHNlLFxuICBzZWxlY3RvcjogZmFsc2UsXG4gIHBsYWNlbWVudDogJ3RvcCcsXG4gIG9mZnNldDogWzAsIDBdLFxuICBjb250YWluZXI6IGZhbHNlLFxuICBmYWxsYmFja1BsYWNlbWVudHM6IFsndG9wJywgJ3JpZ2h0JywgJ2JvdHRvbScsICdsZWZ0J10sXG4gIGJvdW5kYXJ5OiAnY2xpcHBpbmdQYXJlbnRzJyxcbiAgY3VzdG9tQ2xhc3M6ICcnLFxuICBzYW5pdGl6ZTogdHJ1ZSxcbiAgc2FuaXRpemVGbjogbnVsbCxcbiAgYWxsb3dMaXN0OiBEZWZhdWx0QWxsb3dsaXN0LFxuICBwb3BwZXJDb25maWc6IG51bGxcbn1cblxuY29uc3QgRXZlbnQgPSB7XG4gIEhJREU6IGBoaWRlJHtFVkVOVF9LRVl9YCxcbiAgSElEREVOOiBgaGlkZGVuJHtFVkVOVF9LRVl9YCxcbiAgU0hPVzogYHNob3cke0VWRU5UX0tFWX1gLFxuICBTSE9XTjogYHNob3duJHtFVkVOVF9LRVl9YCxcbiAgSU5TRVJURUQ6IGBpbnNlcnRlZCR7RVZFTlRfS0VZfWAsXG4gIENMSUNLOiBgY2xpY2ske0VWRU5UX0tFWX1gLFxuICBGT0NVU0lOOiBgZm9jdXNpbiR7RVZFTlRfS0VZfWAsXG4gIEZPQ1VTT1VUOiBgZm9jdXNvdXQke0VWRU5UX0tFWX1gLFxuICBNT1VTRUVOVEVSOiBgbW91c2VlbnRlciR7RVZFTlRfS0VZfWAsXG4gIE1PVVNFTEVBVkU6IGBtb3VzZWxlYXZlJHtFVkVOVF9LRVl9YFxufVxuXG5jb25zdCBDTEFTU19OQU1FX0ZBREUgPSAnZmFkZSdcbmNvbnN0IENMQVNTX05BTUVfTU9EQUwgPSAnbW9kYWwnXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgPSAnc2hvdydcblxuY29uc3QgSE9WRVJfU1RBVEVfU0hPVyA9ICdzaG93J1xuY29uc3QgSE9WRVJfU1RBVEVfT1VUID0gJ291dCdcblxuY29uc3QgU0VMRUNUT1JfVE9PTFRJUF9JTk5FUiA9ICcudG9vbHRpcC1pbm5lcidcbmNvbnN0IFNFTEVDVE9SX01PREFMID0gYC4ke0NMQVNTX05BTUVfTU9EQUx9YFxuXG5jb25zdCBFVkVOVF9NT0RBTF9ISURFID0gJ2hpZGUuYnMubW9kYWwnXG5cbmNvbnN0IFRSSUdHRVJfSE9WRVIgPSAnaG92ZXInXG5jb25zdCBUUklHR0VSX0ZPQ1VTID0gJ2ZvY3VzJ1xuY29uc3QgVFJJR0dFUl9DTElDSyA9ICdjbGljaydcbmNvbnN0IFRSSUdHRVJfTUFOVUFMID0gJ21hbnVhbCdcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENsYXNzIERlZmluaXRpb25cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmNsYXNzIFRvb2x0aXAgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoZWxlbWVudCwgY29uZmlnKSB7XG4gICAgaWYgKHR5cGVvZiBQb3BwZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCb290c3RyYXBcXCdzIHRvb2x0aXBzIHJlcXVpcmUgUG9wcGVyIChodHRwczovL3BvcHBlci5qcy5vcmcpJylcbiAgICB9XG5cbiAgICBzdXBlcihlbGVtZW50KVxuXG4gICAgLy8gcHJpdmF0ZVxuICAgIHRoaXMuX2lzRW5hYmxlZCA9IHRydWVcbiAgICB0aGlzLl90aW1lb3V0ID0gMFxuICAgIHRoaXMuX2hvdmVyU3RhdGUgPSAnJ1xuICAgIHRoaXMuX2FjdGl2ZVRyaWdnZXIgPSB7fVxuICAgIHRoaXMuX3BvcHBlciA9IG51bGxcblxuICAgIC8vIFByb3RlY3RlZFxuICAgIHRoaXMuX2NvbmZpZyA9IHRoaXMuX2dldENvbmZpZyhjb25maWcpXG4gICAgdGhpcy50aXAgPSBudWxsXG5cbiAgICB0aGlzLl9zZXRMaXN0ZW5lcnMoKVxuICB9XG5cbiAgLy8gR2V0dGVyc1xuXG4gIHN0YXRpYyBnZXQgRGVmYXVsdCgpIHtcbiAgICByZXR1cm4gRGVmYXVsdFxuICB9XG5cbiAgc3RhdGljIGdldCBOQU1FKCkge1xuICAgIHJldHVybiBOQU1FXG4gIH1cblxuICBzdGF0aWMgZ2V0IEV2ZW50KCkge1xuICAgIHJldHVybiBFdmVudFxuICB9XG5cbiAgc3RhdGljIGdldCBEZWZhdWx0VHlwZSgpIHtcbiAgICByZXR1cm4gRGVmYXVsdFR5cGVcbiAgfVxuXG4gIC8vIFB1YmxpY1xuXG4gIGVuYWJsZSgpIHtcbiAgICB0aGlzLl9pc0VuYWJsZWQgPSB0cnVlXG4gIH1cblxuICBkaXNhYmxlKCkge1xuICAgIHRoaXMuX2lzRW5hYmxlZCA9IGZhbHNlXG4gIH1cblxuICB0b2dnbGVFbmFibGVkKCkge1xuICAgIHRoaXMuX2lzRW5hYmxlZCA9ICF0aGlzLl9pc0VuYWJsZWRcbiAgfVxuXG4gIHRvZ2dsZShldmVudCkge1xuICAgIGlmICghdGhpcy5faXNFbmFibGVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLl9pbml0aWFsaXplT25EZWxlZ2F0ZWRUYXJnZXQoZXZlbnQpXG5cbiAgICAgIGNvbnRleHQuX2FjdGl2ZVRyaWdnZXIuY2xpY2sgPSAhY29udGV4dC5fYWN0aXZlVHJpZ2dlci5jbGlja1xuXG4gICAgICBpZiAoY29udGV4dC5faXNXaXRoQWN0aXZlVHJpZ2dlcigpKSB7XG4gICAgICAgIGNvbnRleHQuX2VudGVyKG51bGwsIGNvbnRleHQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250ZXh0Ll9sZWF2ZShudWxsLCBjb250ZXh0KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5nZXRUaXBFbGVtZW50KCkuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfU0hPVykpIHtcbiAgICAgICAgdGhpcy5fbGVhdmUobnVsbCwgdGhpcylcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2VudGVyKG51bGwsIHRoaXMpXG4gICAgfVxuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZW91dClcblxuICAgIEV2ZW50SGFuZGxlci5vZmYodGhpcy5fZWxlbWVudC5jbG9zZXN0KFNFTEVDVE9SX01PREFMKSwgRVZFTlRfTU9EQUxfSElERSwgdGhpcy5faGlkZU1vZGFsSGFuZGxlcilcblxuICAgIGlmICh0aGlzLnRpcCkge1xuICAgICAgdGhpcy50aXAucmVtb3ZlKClcbiAgICB9XG5cbiAgICB0aGlzLl9kaXNwb3NlUG9wcGVyKClcbiAgICBzdXBlci5kaXNwb3NlKClcbiAgfVxuXG4gIHNob3coKSB7XG4gICAgaWYgKHRoaXMuX2VsZW1lbnQuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSB1c2Ugc2hvdyBvbiB2aXNpYmxlIGVsZW1lbnRzJylcbiAgICB9XG5cbiAgICBpZiAoISh0aGlzLmlzV2l0aENvbnRlbnQoKSAmJiB0aGlzLl9pc0VuYWJsZWQpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBzaG93RXZlbnQgPSBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCB0aGlzLmNvbnN0cnVjdG9yLkV2ZW50LlNIT1cpXG4gICAgY29uc3Qgc2hhZG93Um9vdCA9IGZpbmRTaGFkb3dSb290KHRoaXMuX2VsZW1lbnQpXG4gICAgY29uc3QgaXNJblRoZURvbSA9IHNoYWRvd1Jvb3QgPT09IG51bGwgP1xuICAgICAgdGhpcy5fZWxlbWVudC5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jb250YWlucyh0aGlzLl9lbGVtZW50KSA6XG4gICAgICBzaGFkb3dSb290LmNvbnRhaW5zKHRoaXMuX2VsZW1lbnQpXG5cbiAgICBpZiAoc2hvd0V2ZW50LmRlZmF1bHRQcmV2ZW50ZWQgfHwgIWlzSW5UaGVEb20pIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIEEgdHJpY2sgdG8gcmVjcmVhdGUgYSB0b29sdGlwIGluIGNhc2UgYSBuZXcgdGl0bGUgaXMgZ2l2ZW4gYnkgdXNpbmcgdGhlIE5PVCBkb2N1bWVudGVkIGBkYXRhLWJzLW9yaWdpbmFsLXRpdGxlYFxuICAgIC8vIFRoaXMgd2lsbCBiZSByZW1vdmVkIGxhdGVyIGluIGZhdm9yIG9mIGEgYHNldENvbnRlbnRgIG1ldGhvZFxuICAgIGlmICh0aGlzLmNvbnN0cnVjdG9yLk5BTUUgPT09ICd0b29sdGlwJyAmJiB0aGlzLnRpcCAmJiB0aGlzLmdldFRpdGxlKCkgIT09IHRoaXMudGlwLnF1ZXJ5U2VsZWN0b3IoU0VMRUNUT1JfVE9PTFRJUF9JTk5FUikuaW5uZXJIVE1MKSB7XG4gICAgICB0aGlzLl9kaXNwb3NlUG9wcGVyKClcbiAgICAgIHRoaXMudGlwLnJlbW92ZSgpXG4gICAgICB0aGlzLnRpcCA9IG51bGxcbiAgICB9XG5cbiAgICBjb25zdCB0aXAgPSB0aGlzLmdldFRpcEVsZW1lbnQoKVxuICAgIGNvbnN0IHRpcElkID0gZ2V0VUlEKHRoaXMuY29uc3RydWN0b3IuTkFNRSlcblxuICAgIHRpcC5zZXRBdHRyaWJ1dGUoJ2lkJywgdGlwSWQpXG4gICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCB0aXBJZClcblxuICAgIGlmICh0aGlzLl9jb25maWcuYW5pbWF0aW9uKSB7XG4gICAgICB0aXAuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX0ZBREUpXG4gICAgfVxuXG4gICAgY29uc3QgcGxhY2VtZW50ID0gdHlwZW9mIHRoaXMuX2NvbmZpZy5wbGFjZW1lbnQgPT09ICdmdW5jdGlvbicgP1xuICAgICAgdGhpcy5fY29uZmlnLnBsYWNlbWVudC5jYWxsKHRoaXMsIHRpcCwgdGhpcy5fZWxlbWVudCkgOlxuICAgICAgdGhpcy5fY29uZmlnLnBsYWNlbWVudFxuXG4gICAgY29uc3QgYXR0YWNobWVudCA9IHRoaXMuX2dldEF0dGFjaG1lbnQocGxhY2VtZW50KVxuICAgIHRoaXMuX2FkZEF0dGFjaG1lbnRDbGFzcyhhdHRhY2htZW50KVxuXG4gICAgY29uc3QgeyBjb250YWluZXIgfSA9IHRoaXMuX2NvbmZpZ1xuICAgIERhdGEuc2V0KHRpcCwgdGhpcy5jb25zdHJ1Y3Rvci5EQVRBX0tFWSwgdGhpcylcblxuICAgIGlmICghdGhpcy5fZWxlbWVudC5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jb250YWlucyh0aGlzLnRpcCkpIHtcbiAgICAgIGNvbnRhaW5lci5hcHBlbmQodGlwKVxuICAgICAgRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgdGhpcy5jb25zdHJ1Y3Rvci5FdmVudC5JTlNFUlRFRClcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcG9wcGVyKSB7XG4gICAgICB0aGlzLl9wb3BwZXIudXBkYXRlKClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcG9wcGVyID0gUG9wcGVyLmNyZWF0ZVBvcHBlcih0aGlzLl9lbGVtZW50LCB0aXAsIHRoaXMuX2dldFBvcHBlckNvbmZpZyhhdHRhY2htZW50KSlcbiAgICB9XG5cbiAgICB0aXAuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1cpXG5cbiAgICBjb25zdCBjdXN0b21DbGFzcyA9IHRoaXMuX3Jlc29sdmVQb3NzaWJsZUZ1bmN0aW9uKHRoaXMuX2NvbmZpZy5jdXN0b21DbGFzcylcbiAgICBpZiAoY3VzdG9tQ2xhc3MpIHtcbiAgICAgIHRpcC5jbGFzc0xpc3QuYWRkKC4uLmN1c3RvbUNsYXNzLnNwbGl0KCcgJykpXG4gICAgfVxuXG4gICAgLy8gSWYgdGhpcyBpcyBhIHRvdWNoLWVuYWJsZWQgZGV2aWNlIHdlIGFkZCBleHRyYVxuICAgIC8vIGVtcHR5IG1vdXNlb3ZlciBsaXN0ZW5lcnMgdG8gdGhlIGJvZHkncyBpbW1lZGlhdGUgY2hpbGRyZW47XG4gICAgLy8gb25seSBuZWVkZWQgYmVjYXVzZSBvZiBicm9rZW4gZXZlbnQgZGVsZWdhdGlvbiBvbiBpT1NcbiAgICAvLyBodHRwczovL3d3dy5xdWlya3Ntb2RlLm9yZy9ibG9nL2FyY2hpdmVzLzIwMTQvMDIvbW91c2VfZXZlbnRfYnViLmh0bWxcbiAgICBpZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgICBbXS5jb25jYXQoLi4uZG9jdW1lbnQuYm9keS5jaGlsZHJlbikuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgRXZlbnRIYW5kbGVyLm9uKGVsZW1lbnQsICdtb3VzZW92ZXInLCBub29wKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBjb21wbGV0ZSA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHByZXZIb3ZlclN0YXRlID0gdGhpcy5faG92ZXJTdGF0ZVxuXG4gICAgICB0aGlzLl9ob3ZlclN0YXRlID0gbnVsbFxuICAgICAgRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgdGhpcy5jb25zdHJ1Y3Rvci5FdmVudC5TSE9XTilcblxuICAgICAgaWYgKHByZXZIb3ZlclN0YXRlID09PSBIT1ZFUl9TVEFURV9PVVQpIHtcbiAgICAgICAgdGhpcy5fbGVhdmUobnVsbCwgdGhpcylcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBpc0FuaW1hdGVkID0gdGhpcy50aXAuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfRkFERSlcbiAgICB0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlLCB0aGlzLnRpcCwgaXNBbmltYXRlZClcbiAgfVxuXG4gIGhpZGUoKSB7XG4gICAgaWYgKCF0aGlzLl9wb3BwZXIpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IHRpcCA9IHRoaXMuZ2V0VGlwRWxlbWVudCgpXG4gICAgY29uc3QgY29tcGxldGUgPSAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5faXNXaXRoQWN0aXZlVHJpZ2dlcigpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5faG92ZXJTdGF0ZSAhPT0gSE9WRVJfU1RBVEVfU0hPVykge1xuICAgICAgICB0aXAucmVtb3ZlKClcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY2xlYW5UaXBDbGFzcygpXG4gICAgICB0aGlzLl9lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpXG4gICAgICBFdmVudEhhbmRsZXIudHJpZ2dlcih0aGlzLl9lbGVtZW50LCB0aGlzLmNvbnN0cnVjdG9yLkV2ZW50LkhJRERFTilcblxuICAgICAgdGhpcy5fZGlzcG9zZVBvcHBlcigpXG4gICAgfVxuXG4gICAgY29uc3QgaGlkZUV2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgdGhpcy5jb25zdHJ1Y3Rvci5FdmVudC5ISURFKVxuICAgIGlmIChoaWRlRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGlwLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKVxuXG4gICAgLy8gSWYgdGhpcyBpcyBhIHRvdWNoLWVuYWJsZWQgZGV2aWNlIHdlIHJlbW92ZSB0aGUgZXh0cmFcbiAgICAvLyBlbXB0eSBtb3VzZW92ZXIgbGlzdGVuZXJzIHdlIGFkZGVkIGZvciBpT1Mgc3VwcG9ydFxuICAgIGlmICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcbiAgICAgIFtdLmNvbmNhdCguLi5kb2N1bWVudC5ib2R5LmNoaWxkcmVuKVxuICAgICAgICAuZm9yRWFjaChlbGVtZW50ID0+IEV2ZW50SGFuZGxlci5vZmYoZWxlbWVudCwgJ21vdXNlb3ZlcicsIG5vb3ApKVxuICAgIH1cblxuICAgIHRoaXMuX2FjdGl2ZVRyaWdnZXJbVFJJR0dFUl9DTElDS10gPSBmYWxzZVxuICAgIHRoaXMuX2FjdGl2ZVRyaWdnZXJbVFJJR0dFUl9GT0NVU10gPSBmYWxzZVxuICAgIHRoaXMuX2FjdGl2ZVRyaWdnZXJbVFJJR0dFUl9IT1ZFUl0gPSBmYWxzZVxuXG4gICAgY29uc3QgaXNBbmltYXRlZCA9IHRoaXMudGlwLmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX0ZBREUpXG4gICAgdGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZSwgdGhpcy50aXAsIGlzQW5pbWF0ZWQpXG4gICAgdGhpcy5faG92ZXJTdGF0ZSA9ICcnXG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgaWYgKHRoaXMuX3BvcHBlciAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fcG9wcGVyLnVwZGF0ZSgpXG4gICAgfVxuICB9XG5cbiAgLy8gUHJvdGVjdGVkXG5cbiAgaXNXaXRoQ29udGVudCgpIHtcbiAgICByZXR1cm4gQm9vbGVhbih0aGlzLmdldFRpdGxlKCkpXG4gIH1cblxuICBnZXRUaXBFbGVtZW50KCkge1xuICAgIGlmICh0aGlzLnRpcCkge1xuICAgICAgcmV0dXJuIHRoaXMudGlwXG4gICAgfVxuXG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgZWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLl9jb25maWcudGVtcGxhdGVcblxuICAgIGNvbnN0IHRpcCA9IGVsZW1lbnQuY2hpbGRyZW5bMF1cbiAgICB0aGlzLnNldENvbnRlbnQodGlwKVxuICAgIHRpcC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfRkFERSwgQ0xBU1NfTkFNRV9TSE9XKVxuXG4gICAgdGhpcy50aXAgPSB0aXBcbiAgICByZXR1cm4gdGhpcy50aXBcbiAgfVxuXG4gIHNldENvbnRlbnQodGlwKSB7XG4gICAgdGhpcy5fc2FuaXRpemVBbmRTZXRDb250ZW50KHRpcCwgdGhpcy5nZXRUaXRsZSgpLCBTRUxFQ1RPUl9UT09MVElQX0lOTkVSKVxuICB9XG5cbiAgX3Nhbml0aXplQW5kU2V0Q29udGVudCh0ZW1wbGF0ZSwgY29udGVudCwgc2VsZWN0b3IpIHtcbiAgICBjb25zdCB0ZW1wbGF0ZUVsZW1lbnQgPSBTZWxlY3RvckVuZ2luZS5maW5kT25lKHNlbGVjdG9yLCB0ZW1wbGF0ZSlcblxuICAgIGlmICghY29udGVudCAmJiB0ZW1wbGF0ZUVsZW1lbnQpIHtcbiAgICAgIHRlbXBsYXRlRWxlbWVudC5yZW1vdmUoKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gd2UgdXNlIGFwcGVuZCBmb3IgaHRtbCBvYmplY3RzIHRvIG1haW50YWluIGpzIGV2ZW50c1xuICAgIHRoaXMuc2V0RWxlbWVudENvbnRlbnQodGVtcGxhdGVFbGVtZW50LCBjb250ZW50KVxuICB9XG5cbiAgc2V0RWxlbWVudENvbnRlbnQoZWxlbWVudCwgY29udGVudCkge1xuICAgIGlmIChlbGVtZW50ID09PSBudWxsKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoaXNFbGVtZW50KGNvbnRlbnQpKSB7XG4gICAgICBjb250ZW50ID0gZ2V0RWxlbWVudChjb250ZW50KVxuXG4gICAgICAvLyBjb250ZW50IGlzIGEgRE9NIG5vZGUgb3IgYSBqUXVlcnlcbiAgICAgIGlmICh0aGlzLl9jb25maWcuaHRtbCkge1xuICAgICAgICBpZiAoY29udGVudC5wYXJlbnROb2RlICE9PSBlbGVtZW50KSB7XG4gICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSAnJ1xuICAgICAgICAgIGVsZW1lbnQuYXBwZW5kKGNvbnRlbnQpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBjb250ZW50LnRleHRDb250ZW50XG4gICAgICB9XG5cbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmICh0aGlzLl9jb25maWcuaHRtbCkge1xuICAgICAgaWYgKHRoaXMuX2NvbmZpZy5zYW5pdGl6ZSkge1xuICAgICAgICBjb250ZW50ID0gc2FuaXRpemVIdG1sKGNvbnRlbnQsIHRoaXMuX2NvbmZpZy5hbGxvd0xpc3QsIHRoaXMuX2NvbmZpZy5zYW5pdGl6ZUZuKVxuICAgICAgfVxuXG4gICAgICBlbGVtZW50LmlubmVySFRNTCA9IGNvbnRlbnRcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IGNvbnRlbnRcbiAgICB9XG4gIH1cblxuICBnZXRUaXRsZSgpIHtcbiAgICBjb25zdCB0aXRsZSA9IHRoaXMuX2VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWJzLW9yaWdpbmFsLXRpdGxlJykgfHwgdGhpcy5fY29uZmlnLnRpdGxlXG5cbiAgICByZXR1cm4gdGhpcy5fcmVzb2x2ZVBvc3NpYmxlRnVuY3Rpb24odGl0bGUpXG4gIH1cblxuICB1cGRhdGVBdHRhY2htZW50KGF0dGFjaG1lbnQpIHtcbiAgICBpZiAoYXR0YWNobWVudCA9PT0gJ3JpZ2h0Jykge1xuICAgICAgcmV0dXJuICdlbmQnXG4gICAgfVxuXG4gICAgaWYgKGF0dGFjaG1lbnQgPT09ICdsZWZ0Jykge1xuICAgICAgcmV0dXJuICdzdGFydCdcbiAgICB9XG5cbiAgICByZXR1cm4gYXR0YWNobWVudFxuICB9XG5cbiAgLy8gUHJpdmF0ZVxuXG4gIF9pbml0aWFsaXplT25EZWxlZ2F0ZWRUYXJnZXQoZXZlbnQsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gY29udGV4dCB8fCB0aGlzLmNvbnN0cnVjdG9yLmdldE9yQ3JlYXRlSW5zdGFuY2UoZXZlbnQuZGVsZWdhdGVUYXJnZXQsIHRoaXMuX2dldERlbGVnYXRlQ29uZmlnKCkpXG4gIH1cblxuICBfZ2V0T2Zmc2V0KCkge1xuICAgIGNvbnN0IHsgb2Zmc2V0IH0gPSB0aGlzLl9jb25maWdcblxuICAgIGlmICh0eXBlb2Ygb2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG9mZnNldC5zcGxpdCgnLCcpLm1hcCh2YWwgPT4gTnVtYmVyLnBhcnNlSW50KHZhbCwgMTApKVxuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb2Zmc2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gcG9wcGVyRGF0YSA9PiBvZmZzZXQocG9wcGVyRGF0YSwgdGhpcy5fZWxlbWVudClcbiAgICB9XG5cbiAgICByZXR1cm4gb2Zmc2V0XG4gIH1cblxuICBfcmVzb2x2ZVBvc3NpYmxlRnVuY3Rpb24oY29udGVudCkge1xuICAgIHJldHVybiB0eXBlb2YgY29udGVudCA9PT0gJ2Z1bmN0aW9uJyA/IGNvbnRlbnQuY2FsbCh0aGlzLl9lbGVtZW50KSA6IGNvbnRlbnRcbiAgfVxuXG4gIF9nZXRQb3BwZXJDb25maWcoYXR0YWNobWVudCkge1xuICAgIGNvbnN0IGRlZmF1bHRCc1BvcHBlckNvbmZpZyA9IHtcbiAgICAgIHBsYWNlbWVudDogYXR0YWNobWVudCxcbiAgICAgIG1vZGlmaWVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ2ZsaXAnLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGZhbGxiYWNrUGxhY2VtZW50czogdGhpcy5fY29uZmlnLmZhbGxiYWNrUGxhY2VtZW50c1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdvZmZzZXQnLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIG9mZnNldDogdGhpcy5fZ2V0T2Zmc2V0KClcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAncHJldmVudE92ZXJmbG93JyxcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBib3VuZGFyeTogdGhpcy5fY29uZmlnLmJvdW5kYXJ5XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ2Fycm93JyxcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBlbGVtZW50OiBgLiR7dGhpcy5jb25zdHJ1Y3Rvci5OQU1FfS1hcnJvd2BcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnb25DaGFuZ2UnLFxuICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgcGhhc2U6ICdhZnRlcldyaXRlJyxcbiAgICAgICAgICBmbjogZGF0YSA9PiB0aGlzLl9oYW5kbGVQb3BwZXJQbGFjZW1lbnRDaGFuZ2UoZGF0YSlcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIG9uRmlyc3RVcGRhdGU6IGRhdGEgPT4ge1xuICAgICAgICBpZiAoZGF0YS5vcHRpb25zLnBsYWNlbWVudCAhPT0gZGF0YS5wbGFjZW1lbnQpIHtcbiAgICAgICAgICB0aGlzLl9oYW5kbGVQb3BwZXJQbGFjZW1lbnRDaGFuZ2UoZGF0YSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAuLi5kZWZhdWx0QnNQb3BwZXJDb25maWcsXG4gICAgICAuLi4odHlwZW9mIHRoaXMuX2NvbmZpZy5wb3BwZXJDb25maWcgPT09ICdmdW5jdGlvbicgPyB0aGlzLl9jb25maWcucG9wcGVyQ29uZmlnKGRlZmF1bHRCc1BvcHBlckNvbmZpZykgOiB0aGlzLl9jb25maWcucG9wcGVyQ29uZmlnKVxuICAgIH1cbiAgfVxuXG4gIF9hZGRBdHRhY2htZW50Q2xhc3MoYXR0YWNobWVudCkge1xuICAgIHRoaXMuZ2V0VGlwRWxlbWVudCgpLmNsYXNzTGlzdC5hZGQoYCR7dGhpcy5fZ2V0QmFzaWNDbGFzc1ByZWZpeCgpfS0ke3RoaXMudXBkYXRlQXR0YWNobWVudChhdHRhY2htZW50KX1gKVxuICB9XG5cbiAgX2dldEF0dGFjaG1lbnQocGxhY2VtZW50KSB7XG4gICAgcmV0dXJuIEF0dGFjaG1lbnRNYXBbcGxhY2VtZW50LnRvVXBwZXJDYXNlKCldXG4gIH1cblxuICBfc2V0TGlzdGVuZXJzKCkge1xuICAgIGNvbnN0IHRyaWdnZXJzID0gdGhpcy5fY29uZmlnLnRyaWdnZXIuc3BsaXQoJyAnKVxuXG4gICAgdHJpZ2dlcnMuZm9yRWFjaCh0cmlnZ2VyID0+IHtcbiAgICAgIGlmICh0cmlnZ2VyID09PSAnY2xpY2snKSB7XG4gICAgICAgIEV2ZW50SGFuZGxlci5vbih0aGlzLl9lbGVtZW50LCB0aGlzLmNvbnN0cnVjdG9yLkV2ZW50LkNMSUNLLCB0aGlzLl9jb25maWcuc2VsZWN0b3IsIGV2ZW50ID0+IHRoaXMudG9nZ2xlKGV2ZW50KSlcbiAgICAgIH0gZWxzZSBpZiAodHJpZ2dlciAhPT0gVFJJR0dFUl9NQU5VQUwpIHtcbiAgICAgICAgY29uc3QgZXZlbnRJbiA9IHRyaWdnZXIgPT09IFRSSUdHRVJfSE9WRVIgP1xuICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IuRXZlbnQuTU9VU0VFTlRFUiA6XG4gICAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5FdmVudC5GT0NVU0lOXG4gICAgICAgIGNvbnN0IGV2ZW50T3V0ID0gdHJpZ2dlciA9PT0gVFJJR0dFUl9IT1ZFUiA/XG4gICAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5FdmVudC5NT1VTRUxFQVZFIDpcbiAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLkV2ZW50LkZPQ1VTT1VUXG5cbiAgICAgICAgRXZlbnRIYW5kbGVyLm9uKHRoaXMuX2VsZW1lbnQsIGV2ZW50SW4sIHRoaXMuX2NvbmZpZy5zZWxlY3RvciwgZXZlbnQgPT4gdGhpcy5fZW50ZXIoZXZlbnQpKVxuICAgICAgICBFdmVudEhhbmRsZXIub24odGhpcy5fZWxlbWVudCwgZXZlbnRPdXQsIHRoaXMuX2NvbmZpZy5zZWxlY3RvciwgZXZlbnQgPT4gdGhpcy5fbGVhdmUoZXZlbnQpKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLl9oaWRlTW9kYWxIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuX2VsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5oaWRlKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBFdmVudEhhbmRsZXIub24odGhpcy5fZWxlbWVudC5jbG9zZXN0KFNFTEVDVE9SX01PREFMKSwgRVZFTlRfTU9EQUxfSElERSwgdGhpcy5faGlkZU1vZGFsSGFuZGxlcilcblxuICAgIGlmICh0aGlzLl9jb25maWcuc2VsZWN0b3IpIHtcbiAgICAgIHRoaXMuX2NvbmZpZyA9IHtcbiAgICAgICAgLi4udGhpcy5fY29uZmlnLFxuICAgICAgICB0cmlnZ2VyOiAnbWFudWFsJyxcbiAgICAgICAgc2VsZWN0b3I6ICcnXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2ZpeFRpdGxlKClcbiAgICB9XG4gIH1cblxuICBfZml4VGl0bGUoKSB7XG4gICAgY29uc3QgdGl0bGUgPSB0aGlzLl9lbGVtZW50LmdldEF0dHJpYnV0ZSgndGl0bGUnKVxuICAgIGNvbnN0IG9yaWdpbmFsVGl0bGVUeXBlID0gdHlwZW9mIHRoaXMuX2VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWJzLW9yaWdpbmFsLXRpdGxlJylcblxuICAgIGlmICh0aXRsZSB8fCBvcmlnaW5hbFRpdGxlVHlwZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLWJzLW9yaWdpbmFsLXRpdGxlJywgdGl0bGUgfHwgJycpXG4gICAgICBpZiAodGl0bGUgJiYgIXRoaXMuX2VsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJykgJiYgIXRoaXMuX2VsZW1lbnQudGV4dENvbnRlbnQpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCB0aXRsZSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgJycpXG4gICAgfVxuICB9XG5cbiAgX2VudGVyKGV2ZW50LCBjb250ZXh0KSB7XG4gICAgY29udGV4dCA9IHRoaXMuX2luaXRpYWxpemVPbkRlbGVnYXRlZFRhcmdldChldmVudCwgY29udGV4dClcblxuICAgIGlmIChldmVudCkge1xuICAgICAgY29udGV4dC5fYWN0aXZlVHJpZ2dlcltcbiAgICAgICAgZXZlbnQudHlwZSA9PT0gJ2ZvY3VzaW4nID8gVFJJR0dFUl9GT0NVUyA6IFRSSUdHRVJfSE9WRVJcbiAgICAgIF0gPSB0cnVlXG4gICAgfVxuXG4gICAgaWYgKGNvbnRleHQuZ2V0VGlwRWxlbWVudCgpLmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX1NIT1cpIHx8IGNvbnRleHQuX2hvdmVyU3RhdGUgPT09IEhPVkVSX1NUQVRFX1NIT1cpIHtcbiAgICAgIGNvbnRleHQuX2hvdmVyU3RhdGUgPSBIT1ZFUl9TVEFURV9TSE9XXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjbGVhclRpbWVvdXQoY29udGV4dC5fdGltZW91dClcblxuICAgIGNvbnRleHQuX2hvdmVyU3RhdGUgPSBIT1ZFUl9TVEFURV9TSE9XXG5cbiAgICBpZiAoIWNvbnRleHQuX2NvbmZpZy5kZWxheSB8fCAhY29udGV4dC5fY29uZmlnLmRlbGF5LnNob3cpIHtcbiAgICAgIGNvbnRleHQuc2hvdygpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb250ZXh0Ll90aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoY29udGV4dC5faG92ZXJTdGF0ZSA9PT0gSE9WRVJfU1RBVEVfU0hPVykge1xuICAgICAgICBjb250ZXh0LnNob3coKVxuICAgICAgfVxuICAgIH0sIGNvbnRleHQuX2NvbmZpZy5kZWxheS5zaG93KVxuICB9XG5cbiAgX2xlYXZlKGV2ZW50LCBjb250ZXh0KSB7XG4gICAgY29udGV4dCA9IHRoaXMuX2luaXRpYWxpemVPbkRlbGVnYXRlZFRhcmdldChldmVudCwgY29udGV4dClcblxuICAgIGlmIChldmVudCkge1xuICAgICAgY29udGV4dC5fYWN0aXZlVHJpZ2dlcltcbiAgICAgICAgZXZlbnQudHlwZSA9PT0gJ2ZvY3Vzb3V0JyA/IFRSSUdHRVJfRk9DVVMgOiBUUklHR0VSX0hPVkVSXG4gICAgICBdID0gY29udGV4dC5fZWxlbWVudC5jb250YWlucyhldmVudC5yZWxhdGVkVGFyZ2V0KVxuICAgIH1cblxuICAgIGlmIChjb250ZXh0Ll9pc1dpdGhBY3RpdmVUcmlnZ2VyKCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNsZWFyVGltZW91dChjb250ZXh0Ll90aW1lb3V0KVxuXG4gICAgY29udGV4dC5faG92ZXJTdGF0ZSA9IEhPVkVSX1NUQVRFX09VVFxuXG4gICAgaWYgKCFjb250ZXh0Ll9jb25maWcuZGVsYXkgfHwgIWNvbnRleHQuX2NvbmZpZy5kZWxheS5oaWRlKSB7XG4gICAgICBjb250ZXh0LmhpZGUoKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29udGV4dC5fdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKGNvbnRleHQuX2hvdmVyU3RhdGUgPT09IEhPVkVSX1NUQVRFX09VVCkge1xuICAgICAgICBjb250ZXh0LmhpZGUoKVxuICAgICAgfVxuICAgIH0sIGNvbnRleHQuX2NvbmZpZy5kZWxheS5oaWRlKVxuICB9XG5cbiAgX2lzV2l0aEFjdGl2ZVRyaWdnZXIoKSB7XG4gICAgZm9yIChjb25zdCB0cmlnZ2VyIGluIHRoaXMuX2FjdGl2ZVRyaWdnZXIpIHtcbiAgICAgIGlmICh0aGlzLl9hY3RpdmVUcmlnZ2VyW3RyaWdnZXJdKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBfZ2V0Q29uZmlnKGNvbmZpZykge1xuICAgIGNvbnN0IGRhdGFBdHRyaWJ1dGVzID0gTWFuaXB1bGF0b3IuZ2V0RGF0YUF0dHJpYnV0ZXModGhpcy5fZWxlbWVudClcblxuICAgIE9iamVjdC5rZXlzKGRhdGFBdHRyaWJ1dGVzKS5mb3JFYWNoKGRhdGFBdHRyID0+IHtcbiAgICAgIGlmIChESVNBTExPV0VEX0FUVFJJQlVURVMuaGFzKGRhdGFBdHRyKSkge1xuICAgICAgICBkZWxldGUgZGF0YUF0dHJpYnV0ZXNbZGF0YUF0dHJdXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNvbmZpZyA9IHtcbiAgICAgIC4uLnRoaXMuY29uc3RydWN0b3IuRGVmYXVsdCxcbiAgICAgIC4uLmRhdGFBdHRyaWJ1dGVzLFxuICAgICAgLi4uKHR5cGVvZiBjb25maWcgPT09ICdvYmplY3QnICYmIGNvbmZpZyA/IGNvbmZpZyA6IHt9KVxuICAgIH1cblxuICAgIGNvbmZpZy5jb250YWluZXIgPSBjb25maWcuY29udGFpbmVyID09PSBmYWxzZSA/IGRvY3VtZW50LmJvZHkgOiBnZXRFbGVtZW50KGNvbmZpZy5jb250YWluZXIpXG5cbiAgICBpZiAodHlwZW9mIGNvbmZpZy5kZWxheSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGNvbmZpZy5kZWxheSA9IHtcbiAgICAgICAgc2hvdzogY29uZmlnLmRlbGF5LFxuICAgICAgICBoaWRlOiBjb25maWcuZGVsYXlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNvbmZpZy50aXRsZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGNvbmZpZy50aXRsZSA9IGNvbmZpZy50aXRsZS50b1N0cmluZygpXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjb25maWcuY29udGVudCA9PT0gJ251bWJlcicpIHtcbiAgICAgIGNvbmZpZy5jb250ZW50ID0gY29uZmlnLmNvbnRlbnQudG9TdHJpbmcoKVxuICAgIH1cblxuICAgIHR5cGVDaGVja0NvbmZpZyhOQU1FLCBjb25maWcsIHRoaXMuY29uc3RydWN0b3IuRGVmYXVsdFR5cGUpXG5cbiAgICBpZiAoY29uZmlnLnNhbml0aXplKSB7XG4gICAgICBjb25maWcudGVtcGxhdGUgPSBzYW5pdGl6ZUh0bWwoY29uZmlnLnRlbXBsYXRlLCBjb25maWcuYWxsb3dMaXN0LCBjb25maWcuc2FuaXRpemVGbilcbiAgICB9XG5cbiAgICByZXR1cm4gY29uZmlnXG4gIH1cblxuICBfZ2V0RGVsZWdhdGVDb25maWcoKSB7XG4gICAgY29uc3QgY29uZmlnID0ge31cblxuICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuX2NvbmZpZykge1xuICAgICAgaWYgKHRoaXMuY29uc3RydWN0b3IuRGVmYXVsdFtrZXldICE9PSB0aGlzLl9jb25maWdba2V5XSkge1xuICAgICAgICBjb25maWdba2V5XSA9IHRoaXMuX2NvbmZpZ1trZXldXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSW4gdGhlIGZ1dHVyZSBjYW4gYmUgcmVwbGFjZWQgd2l0aDpcbiAgICAvLyBjb25zdCBrZXlzV2l0aERpZmZlcmVudFZhbHVlcyA9IE9iamVjdC5lbnRyaWVzKHRoaXMuX2NvbmZpZykuZmlsdGVyKGVudHJ5ID0+IHRoaXMuY29uc3RydWN0b3IuRGVmYXVsdFtlbnRyeVswXV0gIT09IHRoaXMuX2NvbmZpZ1tlbnRyeVswXV0pXG4gICAgLy8gYE9iamVjdC5mcm9tRW50cmllcyhrZXlzV2l0aERpZmZlcmVudFZhbHVlcylgXG4gICAgcmV0dXJuIGNvbmZpZ1xuICB9XG5cbiAgX2NsZWFuVGlwQ2xhc3MoKSB7XG4gICAgY29uc3QgdGlwID0gdGhpcy5nZXRUaXBFbGVtZW50KClcbiAgICBjb25zdCBiYXNpY0NsYXNzUHJlZml4UmVnZXggPSBuZXcgUmVnRXhwKGAoXnxcXFxccykke3RoaXMuX2dldEJhc2ljQ2xhc3NQcmVmaXgoKX1cXFxcUytgLCAnZycpXG4gICAgY29uc3QgdGFiQ2xhc3MgPSB0aXAuZ2V0QXR0cmlidXRlKCdjbGFzcycpLm1hdGNoKGJhc2ljQ2xhc3NQcmVmaXhSZWdleClcbiAgICBpZiAodGFiQ2xhc3MgIT09IG51bGwgJiYgdGFiQ2xhc3MubGVuZ3RoID4gMCkge1xuICAgICAgdGFiQ2xhc3MubWFwKHRva2VuID0+IHRva2VuLnRyaW0oKSlcbiAgICAgICAgLmZvckVhY2godENsYXNzID0+IHRpcC5jbGFzc0xpc3QucmVtb3ZlKHRDbGFzcykpXG4gICAgfVxuICB9XG5cbiAgX2dldEJhc2ljQ2xhc3NQcmVmaXgoKSB7XG4gICAgcmV0dXJuIENMQVNTX1BSRUZJWFxuICB9XG5cbiAgX2hhbmRsZVBvcHBlclBsYWNlbWVudENoYW5nZShwb3BwZXJEYXRhKSB7XG4gICAgY29uc3QgeyBzdGF0ZSB9ID0gcG9wcGVyRGF0YVxuXG4gICAgaWYgKCFzdGF0ZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy50aXAgPSBzdGF0ZS5lbGVtZW50cy5wb3BwZXJcbiAgICB0aGlzLl9jbGVhblRpcENsYXNzKClcbiAgICB0aGlzLl9hZGRBdHRhY2htZW50Q2xhc3ModGhpcy5fZ2V0QXR0YWNobWVudChzdGF0ZS5wbGFjZW1lbnQpKVxuICB9XG5cbiAgX2Rpc3Bvc2VQb3BwZXIoKSB7XG4gICAgaWYgKHRoaXMuX3BvcHBlcikge1xuICAgICAgdGhpcy5fcG9wcGVyLmRlc3Ryb3koKVxuICAgICAgdGhpcy5fcG9wcGVyID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIC8vIFN0YXRpY1xuXG4gIHN0YXRpYyBqUXVlcnlJbnRlcmZhY2UoY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBkYXRhID0gVG9vbHRpcC5nZXRPckNyZWF0ZUluc3RhbmNlKHRoaXMsIGNvbmZpZylcblxuICAgICAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YVtjb25maWddID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYE5vIG1ldGhvZCBuYW1lZCBcIiR7Y29uZmlnfVwiYClcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGFbY29uZmlnXSgpXG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogalF1ZXJ5XG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIGFkZCAuVG9vbHRpcCB0byBqUXVlcnkgb25seSBpZiBqUXVlcnkgaXMgcHJlc2VudFxuICovXG5cbmRlZmluZUpRdWVyeVBsdWdpbihUb29sdGlwKVxuXG5leHBvcnQgZGVmYXVsdCBUb29sdGlwXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBCb290c3RyYXAgKHY1LjEuMyk6IHBvcG92ZXIuanNcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFpbi9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5pbXBvcnQgeyBkZWZpbmVKUXVlcnlQbHVnaW4gfSBmcm9tICcuL3V0aWwvaW5kZXgnXG5pbXBvcnQgVG9vbHRpcCBmcm9tICcuL3Rvb2x0aXAnXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBDb25zdGFudHNcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmNvbnN0IE5BTUUgPSAncG9wb3ZlcidcbmNvbnN0IERBVEFfS0VZID0gJ2JzLnBvcG92ZXInXG5jb25zdCBFVkVOVF9LRVkgPSBgLiR7REFUQV9LRVl9YFxuY29uc3QgQ0xBU1NfUFJFRklYID0gJ2JzLXBvcG92ZXInXG5cbmNvbnN0IERlZmF1bHQgPSB7XG4gIC4uLlRvb2x0aXAuRGVmYXVsdCxcbiAgcGxhY2VtZW50OiAncmlnaHQnLFxuICBvZmZzZXQ6IFswLCA4XSxcbiAgdHJpZ2dlcjogJ2NsaWNrJyxcbiAgY29udGVudDogJycsXG4gIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cInBvcG92ZXJcIiByb2xlPVwidG9vbHRpcFwiPicgK1xuICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInBvcG92ZXItYXJyb3dcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICAgJzxoMyBjbGFzcz1cInBvcG92ZXItaGVhZGVyXCI+PC9oMz4nICtcbiAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwb3BvdmVyLWJvZHlcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nXG59XG5cbmNvbnN0IERlZmF1bHRUeXBlID0ge1xuICAuLi5Ub29sdGlwLkRlZmF1bHRUeXBlLFxuICBjb250ZW50OiAnKHN0cmluZ3xlbGVtZW50fGZ1bmN0aW9uKSdcbn1cblxuY29uc3QgRXZlbnQgPSB7XG4gIEhJREU6IGBoaWRlJHtFVkVOVF9LRVl9YCxcbiAgSElEREVOOiBgaGlkZGVuJHtFVkVOVF9LRVl9YCxcbiAgU0hPVzogYHNob3cke0VWRU5UX0tFWX1gLFxuICBTSE9XTjogYHNob3duJHtFVkVOVF9LRVl9YCxcbiAgSU5TRVJURUQ6IGBpbnNlcnRlZCR7RVZFTlRfS0VZfWAsXG4gIENMSUNLOiBgY2xpY2ske0VWRU5UX0tFWX1gLFxuICBGT0NVU0lOOiBgZm9jdXNpbiR7RVZFTlRfS0VZfWAsXG4gIEZPQ1VTT1VUOiBgZm9jdXNvdXQke0VWRU5UX0tFWX1gLFxuICBNT1VTRUVOVEVSOiBgbW91c2VlbnRlciR7RVZFTlRfS0VZfWAsXG4gIE1PVVNFTEVBVkU6IGBtb3VzZWxlYXZlJHtFVkVOVF9LRVl9YFxufVxuXG5jb25zdCBTRUxFQ1RPUl9USVRMRSA9ICcucG9wb3Zlci1oZWFkZXInXG5jb25zdCBTRUxFQ1RPUl9DT05URU5UID0gJy5wb3BvdmVyLWJvZHknXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBDbGFzcyBEZWZpbml0aW9uXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5jbGFzcyBQb3BvdmVyIGV4dGVuZHMgVG9vbHRpcCB7XG4gIC8vIEdldHRlcnNcblxuICBzdGF0aWMgZ2V0IERlZmF1bHQoKSB7XG4gICAgcmV0dXJuIERlZmF1bHRcbiAgfVxuXG4gIHN0YXRpYyBnZXQgTkFNRSgpIHtcbiAgICByZXR1cm4gTkFNRVxuICB9XG5cbiAgc3RhdGljIGdldCBFdmVudCgpIHtcbiAgICByZXR1cm4gRXZlbnRcbiAgfVxuXG4gIHN0YXRpYyBnZXQgRGVmYXVsdFR5cGUoKSB7XG4gICAgcmV0dXJuIERlZmF1bHRUeXBlXG4gIH1cblxuICAvLyBPdmVycmlkZXNcblxuICBpc1dpdGhDb250ZW50KCkge1xuICAgIHJldHVybiB0aGlzLmdldFRpdGxlKCkgfHwgdGhpcy5fZ2V0Q29udGVudCgpXG4gIH1cblxuICBzZXRDb250ZW50KHRpcCkge1xuICAgIHRoaXMuX3Nhbml0aXplQW5kU2V0Q29udGVudCh0aXAsIHRoaXMuZ2V0VGl0bGUoKSwgU0VMRUNUT1JfVElUTEUpXG4gICAgdGhpcy5fc2FuaXRpemVBbmRTZXRDb250ZW50KHRpcCwgdGhpcy5fZ2V0Q29udGVudCgpLCBTRUxFQ1RPUl9DT05URU5UKVxuICB9XG5cbiAgLy8gUHJpdmF0ZVxuXG4gIF9nZXRDb250ZW50KCkge1xuICAgIHJldHVybiB0aGlzLl9yZXNvbHZlUG9zc2libGVGdW5jdGlvbih0aGlzLl9jb25maWcuY29udGVudClcbiAgfVxuXG4gIF9nZXRCYXNpY0NsYXNzUHJlZml4KCkge1xuICAgIHJldHVybiBDTEFTU19QUkVGSVhcbiAgfVxuXG4gIC8vIFN0YXRpY1xuXG4gIHN0YXRpYyBqUXVlcnlJbnRlcmZhY2UoY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBkYXRhID0gUG9wb3Zlci5nZXRPckNyZWF0ZUluc3RhbmNlKHRoaXMsIGNvbmZpZylcblxuICAgICAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YVtjb25maWddID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYE5vIG1ldGhvZCBuYW1lZCBcIiR7Y29uZmlnfVwiYClcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGFbY29uZmlnXSgpXG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogalF1ZXJ5XG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIGFkZCAuUG9wb3ZlciB0byBqUXVlcnkgb25seSBpZiBqUXVlcnkgaXMgcHJlc2VudFxuICovXG5cbmRlZmluZUpRdWVyeVBsdWdpbihQb3BvdmVyKVxuXG5leHBvcnQgZGVmYXVsdCBQb3BvdmVyXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBCb290c3RyYXAgKHY1LjEuMyk6IHNjcm9sbHNweS5qc1xuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmltcG9ydCB7XG4gIGRlZmluZUpRdWVyeVBsdWdpbixcbiAgZ2V0RWxlbWVudCxcbiAgZ2V0U2VsZWN0b3JGcm9tRWxlbWVudCxcbiAgdHlwZUNoZWNrQ29uZmlnXG59IGZyb20gJy4vdXRpbC9pbmRleCdcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSAnLi9kb20vZXZlbnQtaGFuZGxlcidcbmltcG9ydCBNYW5pcHVsYXRvciBmcm9tICcuL2RvbS9tYW5pcHVsYXRvcidcbmltcG9ydCBTZWxlY3RvckVuZ2luZSBmcm9tICcuL2RvbS9zZWxlY3Rvci1lbmdpbmUnXG5pbXBvcnQgQmFzZUNvbXBvbmVudCBmcm9tICcuL2Jhc2UtY29tcG9uZW50J1xuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQ29uc3RhbnRzXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5jb25zdCBOQU1FID0gJ3Njcm9sbHNweSdcbmNvbnN0IERBVEFfS0VZID0gJ2JzLnNjcm9sbHNweSdcbmNvbnN0IEVWRU5UX0tFWSA9IGAuJHtEQVRBX0tFWX1gXG5jb25zdCBEQVRBX0FQSV9LRVkgPSAnLmRhdGEtYXBpJ1xuXG5jb25zdCBEZWZhdWx0ID0ge1xuICBvZmZzZXQ6IDEwLFxuICBtZXRob2Q6ICdhdXRvJyxcbiAgdGFyZ2V0OiAnJ1xufVxuXG5jb25zdCBEZWZhdWx0VHlwZSA9IHtcbiAgb2Zmc2V0OiAnbnVtYmVyJyxcbiAgbWV0aG9kOiAnc3RyaW5nJyxcbiAgdGFyZ2V0OiAnKHN0cmluZ3xlbGVtZW50KSdcbn1cblxuY29uc3QgRVZFTlRfQUNUSVZBVEUgPSBgYWN0aXZhdGUke0VWRU5UX0tFWX1gXG5jb25zdCBFVkVOVF9TQ1JPTEwgPSBgc2Nyb2xsJHtFVkVOVF9LRVl9YFxuY29uc3QgRVZFTlRfTE9BRF9EQVRBX0FQSSA9IGBsb2FkJHtFVkVOVF9LRVl9JHtEQVRBX0FQSV9LRVl9YFxuXG5jb25zdCBDTEFTU19OQU1FX0RST1BET1dOX0lURU0gPSAnZHJvcGRvd24taXRlbSdcbmNvbnN0IENMQVNTX05BTUVfQUNUSVZFID0gJ2FjdGl2ZSdcblxuY29uc3QgU0VMRUNUT1JfREFUQV9TUFkgPSAnW2RhdGEtYnMtc3B5PVwic2Nyb2xsXCJdJ1xuY29uc3QgU0VMRUNUT1JfTkFWX0xJU1RfR1JPVVAgPSAnLm5hdiwgLmxpc3QtZ3JvdXAnXG5jb25zdCBTRUxFQ1RPUl9OQVZfTElOS1MgPSAnLm5hdi1saW5rJ1xuY29uc3QgU0VMRUNUT1JfTkFWX0lURU1TID0gJy5uYXYtaXRlbSdcbmNvbnN0IFNFTEVDVE9SX0xJU1RfSVRFTVMgPSAnLmxpc3QtZ3JvdXAtaXRlbSdcbmNvbnN0IFNFTEVDVE9SX0xJTktfSVRFTVMgPSBgJHtTRUxFQ1RPUl9OQVZfTElOS1N9LCAke1NFTEVDVE9SX0xJU1RfSVRFTVN9LCAuJHtDTEFTU19OQU1FX0RST1BET1dOX0lURU19YFxuY29uc3QgU0VMRUNUT1JfRFJPUERPV04gPSAnLmRyb3Bkb3duJ1xuY29uc3QgU0VMRUNUT1JfRFJPUERPV05fVE9HR0xFID0gJy5kcm9wZG93bi10b2dnbGUnXG5cbmNvbnN0IE1FVEhPRF9PRkZTRVQgPSAnb2Zmc2V0J1xuY29uc3QgTUVUSE9EX1BPU0lUSU9OID0gJ3Bvc2l0aW9uJ1xuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQ2xhc3MgRGVmaW5pdGlvblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuY2xhc3MgU2Nyb2xsU3B5IGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGNvbmZpZykge1xuICAgIHN1cGVyKGVsZW1lbnQpXG4gICAgdGhpcy5fc2Nyb2xsRWxlbWVudCA9IHRoaXMuX2VsZW1lbnQudGFnTmFtZSA9PT0gJ0JPRFknID8gd2luZG93IDogdGhpcy5fZWxlbWVudFxuICAgIHRoaXMuX2NvbmZpZyA9IHRoaXMuX2dldENvbmZpZyhjb25maWcpXG4gICAgdGhpcy5fb2Zmc2V0cyA9IFtdXG4gICAgdGhpcy5fdGFyZ2V0cyA9IFtdXG4gICAgdGhpcy5fYWN0aXZlVGFyZ2V0ID0gbnVsbFxuICAgIHRoaXMuX3Njcm9sbEhlaWdodCA9IDBcblxuICAgIEV2ZW50SGFuZGxlci5vbih0aGlzLl9zY3JvbGxFbGVtZW50LCBFVkVOVF9TQ1JPTEwsICgpID0+IHRoaXMuX3Byb2Nlc3MoKSlcblxuICAgIHRoaXMucmVmcmVzaCgpXG4gICAgdGhpcy5fcHJvY2VzcygpXG4gIH1cblxuICAvLyBHZXR0ZXJzXG5cbiAgc3RhdGljIGdldCBEZWZhdWx0KCkge1xuICAgIHJldHVybiBEZWZhdWx0XG4gIH1cblxuICBzdGF0aWMgZ2V0IE5BTUUoKSB7XG4gICAgcmV0dXJuIE5BTUVcbiAgfVxuXG4gIC8vIFB1YmxpY1xuXG4gIHJlZnJlc2goKSB7XG4gICAgY29uc3QgYXV0b01ldGhvZCA9IHRoaXMuX3Njcm9sbEVsZW1lbnQgPT09IHRoaXMuX3Njcm9sbEVsZW1lbnQud2luZG93ID9cbiAgICAgIE1FVEhPRF9PRkZTRVQgOlxuICAgICAgTUVUSE9EX1BPU0lUSU9OXG5cbiAgICBjb25zdCBvZmZzZXRNZXRob2QgPSB0aGlzLl9jb25maWcubWV0aG9kID09PSAnYXV0bycgP1xuICAgICAgYXV0b01ldGhvZCA6XG4gICAgICB0aGlzLl9jb25maWcubWV0aG9kXG5cbiAgICBjb25zdCBvZmZzZXRCYXNlID0gb2Zmc2V0TWV0aG9kID09PSBNRVRIT0RfUE9TSVRJT04gP1xuICAgICAgdGhpcy5fZ2V0U2Nyb2xsVG9wKCkgOlxuICAgICAgMFxuXG4gICAgdGhpcy5fb2Zmc2V0cyA9IFtdXG4gICAgdGhpcy5fdGFyZ2V0cyA9IFtdXG4gICAgdGhpcy5fc2Nyb2xsSGVpZ2h0ID0gdGhpcy5fZ2V0U2Nyb2xsSGVpZ2h0KClcblxuICAgIGNvbnN0IHRhcmdldHMgPSBTZWxlY3RvckVuZ2luZS5maW5kKFNFTEVDVE9SX0xJTktfSVRFTVMsIHRoaXMuX2NvbmZpZy50YXJnZXQpXG5cbiAgICB0YXJnZXRzLm1hcChlbGVtZW50ID0+IHtcbiAgICAgIGNvbnN0IHRhcmdldFNlbGVjdG9yID0gZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlbGVtZW50KVxuICAgICAgY29uc3QgdGFyZ2V0ID0gdGFyZ2V0U2VsZWN0b3IgPyBTZWxlY3RvckVuZ2luZS5maW5kT25lKHRhcmdldFNlbGVjdG9yKSA6IG51bGxcblxuICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICBjb25zdCB0YXJnZXRCQ1IgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgaWYgKHRhcmdldEJDUi53aWR0aCB8fCB0YXJnZXRCQ1IuaGVpZ2h0KSB7XG4gICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIE1hbmlwdWxhdG9yW29mZnNldE1ldGhvZF0odGFyZ2V0KS50b3AgKyBvZmZzZXRCYXNlLFxuICAgICAgICAgICAgdGFyZ2V0U2VsZWN0b3JcbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9KVxuICAgICAgLmZpbHRlcihpdGVtID0+IGl0ZW0pXG4gICAgICAuc29ydCgoYSwgYikgPT4gYVswXSAtIGJbMF0pXG4gICAgICAuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgdGhpcy5fb2Zmc2V0cy5wdXNoKGl0ZW1bMF0pXG4gICAgICAgIHRoaXMuX3RhcmdldHMucHVzaChpdGVtWzFdKVxuICAgICAgfSlcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgRXZlbnRIYW5kbGVyLm9mZih0aGlzLl9zY3JvbGxFbGVtZW50LCBFVkVOVF9LRVkpXG4gICAgc3VwZXIuZGlzcG9zZSgpXG4gIH1cblxuICAvLyBQcml2YXRlXG5cbiAgX2dldENvbmZpZyhjb25maWcpIHtcbiAgICBjb25maWcgPSB7XG4gICAgICAuLi5EZWZhdWx0LFxuICAgICAgLi4uTWFuaXB1bGF0b3IuZ2V0RGF0YUF0dHJpYnV0ZXModGhpcy5fZWxlbWVudCksXG4gICAgICAuLi4odHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcgJiYgY29uZmlnID8gY29uZmlnIDoge30pXG4gICAgfVxuXG4gICAgY29uZmlnLnRhcmdldCA9IGdldEVsZW1lbnQoY29uZmlnLnRhcmdldCkgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG5cbiAgICB0eXBlQ2hlY2tDb25maWcoTkFNRSwgY29uZmlnLCBEZWZhdWx0VHlwZSlcblxuICAgIHJldHVybiBjb25maWdcbiAgfVxuXG4gIF9nZXRTY3JvbGxUb3AoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Njcm9sbEVsZW1lbnQgPT09IHdpbmRvdyA/XG4gICAgICB0aGlzLl9zY3JvbGxFbGVtZW50LnBhZ2VZT2Zmc2V0IDpcbiAgICAgIHRoaXMuX3Njcm9sbEVsZW1lbnQuc2Nyb2xsVG9wXG4gIH1cblxuICBfZ2V0U2Nyb2xsSGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLl9zY3JvbGxFbGVtZW50LnNjcm9sbEhlaWdodCB8fCBNYXRoLm1heChcbiAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0LFxuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodFxuICAgIClcbiAgfVxuXG4gIF9nZXRPZmZzZXRIZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Njcm9sbEVsZW1lbnQgPT09IHdpbmRvdyA/XG4gICAgICB3aW5kb3cuaW5uZXJIZWlnaHQgOlxuICAgICAgdGhpcy5fc2Nyb2xsRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHRcbiAgfVxuXG4gIF9wcm9jZXNzKCkge1xuICAgIGNvbnN0IHNjcm9sbFRvcCA9IHRoaXMuX2dldFNjcm9sbFRvcCgpICsgdGhpcy5fY29uZmlnLm9mZnNldFxuICAgIGNvbnN0IHNjcm9sbEhlaWdodCA9IHRoaXMuX2dldFNjcm9sbEhlaWdodCgpXG4gICAgY29uc3QgbWF4U2Nyb2xsID0gdGhpcy5fY29uZmlnLm9mZnNldCArIHNjcm9sbEhlaWdodCAtIHRoaXMuX2dldE9mZnNldEhlaWdodCgpXG5cbiAgICBpZiAodGhpcy5fc2Nyb2xsSGVpZ2h0ICE9PSBzY3JvbGxIZWlnaHQpIHtcbiAgICAgIHRoaXMucmVmcmVzaCgpXG4gICAgfVxuXG4gICAgaWYgKHNjcm9sbFRvcCA+PSBtYXhTY3JvbGwpIHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuX3RhcmdldHNbdGhpcy5fdGFyZ2V0cy5sZW5ndGggLSAxXVxuXG4gICAgICBpZiAodGhpcy5fYWN0aXZlVGFyZ2V0ICE9PSB0YXJnZXQpIHtcbiAgICAgICAgdGhpcy5fYWN0aXZhdGUodGFyZ2V0KVxuICAgICAgfVxuXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fYWN0aXZlVGFyZ2V0ICYmIHNjcm9sbFRvcCA8IHRoaXMuX29mZnNldHNbMF0gJiYgdGhpcy5fb2Zmc2V0c1swXSA+IDApIHtcbiAgICAgIHRoaXMuX2FjdGl2ZVRhcmdldCA9IG51bGxcbiAgICAgIHRoaXMuX2NsZWFyKClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSB0aGlzLl9vZmZzZXRzLmxlbmd0aDsgaS0tOykge1xuICAgICAgY29uc3QgaXNBY3RpdmVUYXJnZXQgPSB0aGlzLl9hY3RpdmVUYXJnZXQgIT09IHRoaXMuX3RhcmdldHNbaV0gJiZcbiAgICAgICAgICBzY3JvbGxUb3AgPj0gdGhpcy5fb2Zmc2V0c1tpXSAmJlxuICAgICAgICAgICh0eXBlb2YgdGhpcy5fb2Zmc2V0c1tpICsgMV0gPT09ICd1bmRlZmluZWQnIHx8IHNjcm9sbFRvcCA8IHRoaXMuX29mZnNldHNbaSArIDFdKVxuXG4gICAgICBpZiAoaXNBY3RpdmVUYXJnZXQpIHtcbiAgICAgICAgdGhpcy5fYWN0aXZhdGUodGhpcy5fdGFyZ2V0c1tpXSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfYWN0aXZhdGUodGFyZ2V0KSB7XG4gICAgdGhpcy5fYWN0aXZlVGFyZ2V0ID0gdGFyZ2V0XG5cbiAgICB0aGlzLl9jbGVhcigpXG5cbiAgICBjb25zdCBxdWVyaWVzID0gU0VMRUNUT1JfTElOS19JVEVNUy5zcGxpdCgnLCcpXG4gICAgICAubWFwKHNlbGVjdG9yID0+IGAke3NlbGVjdG9yfVtkYXRhLWJzLXRhcmdldD1cIiR7dGFyZ2V0fVwiXSwke3NlbGVjdG9yfVtocmVmPVwiJHt0YXJnZXR9XCJdYClcblxuICAgIGNvbnN0IGxpbmsgPSBTZWxlY3RvckVuZ2luZS5maW5kT25lKHF1ZXJpZXMuam9pbignLCcpLCB0aGlzLl9jb25maWcudGFyZ2V0KVxuXG4gICAgbGluay5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfQUNUSVZFKVxuICAgIGlmIChsaW5rLmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX0RST1BET1dOX0lURU0pKSB7XG4gICAgICBTZWxlY3RvckVuZ2luZS5maW5kT25lKFNFTEVDVE9SX0RST1BET1dOX1RPR0dMRSwgbGluay5jbG9zZXN0KFNFTEVDVE9SX0RST1BET1dOKSlcbiAgICAgICAgLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9BQ1RJVkUpXG4gICAgfSBlbHNlIHtcbiAgICAgIFNlbGVjdG9yRW5naW5lLnBhcmVudHMobGluaywgU0VMRUNUT1JfTkFWX0xJU1RfR1JPVVApXG4gICAgICAgIC5mb3JFYWNoKGxpc3RHcm91cCA9PiB7XG4gICAgICAgICAgLy8gU2V0IHRyaWdnZXJlZCBsaW5rcyBwYXJlbnRzIGFzIGFjdGl2ZVxuICAgICAgICAgIC8vIFdpdGggYm90aCA8dWw+IGFuZCA8bmF2PiBtYXJrdXAgYSBwYXJlbnQgaXMgdGhlIHByZXZpb3VzIHNpYmxpbmcgb2YgYW55IG5hdiBhbmNlc3RvclxuICAgICAgICAgIFNlbGVjdG9yRW5naW5lLnByZXYobGlzdEdyb3VwLCBgJHtTRUxFQ1RPUl9OQVZfTElOS1N9LCAke1NFTEVDVE9SX0xJU1RfSVRFTVN9YClcbiAgICAgICAgICAgIC5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfQUNUSVZFKSlcblxuICAgICAgICAgIC8vIEhhbmRsZSBzcGVjaWFsIGNhc2Ugd2hlbiAubmF2LWxpbmsgaXMgaW5zaWRlIC5uYXYtaXRlbVxuICAgICAgICAgIFNlbGVjdG9yRW5naW5lLnByZXYobGlzdEdyb3VwLCBTRUxFQ1RPUl9OQVZfSVRFTVMpXG4gICAgICAgICAgICAuZm9yRWFjaChuYXZJdGVtID0+IHtcbiAgICAgICAgICAgICAgU2VsZWN0b3JFbmdpbmUuY2hpbGRyZW4obmF2SXRlbSwgU0VMRUNUT1JfTkFWX0xJTktTKVxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfQUNUSVZFKSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fc2Nyb2xsRWxlbWVudCwgRVZFTlRfQUNUSVZBVEUsIHtcbiAgICAgIHJlbGF0ZWRUYXJnZXQ6IHRhcmdldFxuICAgIH0pXG4gIH1cblxuICBfY2xlYXIoKSB7XG4gICAgU2VsZWN0b3JFbmdpbmUuZmluZChTRUxFQ1RPUl9MSU5LX0lURU1TLCB0aGlzLl9jb25maWcudGFyZ2V0KVxuICAgICAgLmZpbHRlcihub2RlID0+IG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfQUNUSVZFKSlcbiAgICAgIC5mb3JFYWNoKG5vZGUgPT4gbm9kZS5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfQUNUSVZFKSlcbiAgfVxuXG4gIC8vIFN0YXRpY1xuXG4gIHN0YXRpYyBqUXVlcnlJbnRlcmZhY2UoY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBkYXRhID0gU2Nyb2xsU3B5LmdldE9yQ3JlYXRlSW5zdGFuY2UodGhpcywgY29uZmlnKVxuXG4gICAgICBpZiAodHlwZW9mIGNvbmZpZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgZGF0YVtjb25maWddID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBObyBtZXRob2QgbmFtZWQgXCIke2NvbmZpZ31cImApXG4gICAgICB9XG5cbiAgICAgIGRhdGFbY29uZmlnXSgpXG4gICAgfSlcbiAgfVxufVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogRGF0YSBBcGkgaW1wbGVtZW50YXRpb25cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbkV2ZW50SGFuZGxlci5vbih3aW5kb3csIEVWRU5UX0xPQURfREFUQV9BUEksICgpID0+IHtcbiAgU2VsZWN0b3JFbmdpbmUuZmluZChTRUxFQ1RPUl9EQVRBX1NQWSlcbiAgICAuZm9yRWFjaChzcHkgPT4gbmV3IFNjcm9sbFNweShzcHkpKVxufSlcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIGpRdWVyeVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBhZGQgLlNjcm9sbFNweSB0byBqUXVlcnkgb25seSBpZiBqUXVlcnkgaXMgcHJlc2VudFxuICovXG5cbmRlZmluZUpRdWVyeVBsdWdpbihTY3JvbGxTcHkpXG5cbmV4cG9ydCBkZWZhdWx0IFNjcm9sbFNweVxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQm9vdHN0cmFwICh2NS4xLjMpOiB0YWIuanNcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFpbi9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5pbXBvcnQge1xuICBkZWZpbmVKUXVlcnlQbHVnaW4sXG4gIGdldEVsZW1lbnRGcm9tU2VsZWN0b3IsXG4gIGlzRGlzYWJsZWQsXG4gIHJlZmxvd1xufSBmcm9tICcuL3V0aWwvaW5kZXgnXG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gJy4vZG9tL2V2ZW50LWhhbmRsZXInXG5pbXBvcnQgU2VsZWN0b3JFbmdpbmUgZnJvbSAnLi9kb20vc2VsZWN0b3ItZW5naW5lJ1xuaW1wb3J0IEJhc2VDb21wb25lbnQgZnJvbSAnLi9iYXNlLWNvbXBvbmVudCdcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvbnN0YW50c1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuY29uc3QgTkFNRSA9ICd0YWInXG5jb25zdCBEQVRBX0tFWSA9ICdicy50YWInXG5jb25zdCBFVkVOVF9LRVkgPSBgLiR7REFUQV9LRVl9YFxuY29uc3QgREFUQV9BUElfS0VZID0gJy5kYXRhLWFwaSdcblxuY29uc3QgRVZFTlRfSElERSA9IGBoaWRlJHtFVkVOVF9LRVl9YFxuY29uc3QgRVZFTlRfSElEREVOID0gYGhpZGRlbiR7RVZFTlRfS0VZfWBcbmNvbnN0IEVWRU5UX1NIT1cgPSBgc2hvdyR7RVZFTlRfS0VZfWBcbmNvbnN0IEVWRU5UX1NIT1dOID0gYHNob3duJHtFVkVOVF9LRVl9YFxuY29uc3QgRVZFTlRfQ0xJQ0tfREFUQV9BUEkgPSBgY2xpY2ske0VWRU5UX0tFWX0ke0RBVEFfQVBJX0tFWX1gXG5cbmNvbnN0IENMQVNTX05BTUVfRFJPUERPV05fTUVOVSA9ICdkcm9wZG93bi1tZW51J1xuY29uc3QgQ0xBU1NfTkFNRV9BQ1RJVkUgPSAnYWN0aXZlJ1xuY29uc3QgQ0xBU1NfTkFNRV9GQURFID0gJ2ZhZGUnXG5jb25zdCBDTEFTU19OQU1FX1NIT1cgPSAnc2hvdydcblxuY29uc3QgU0VMRUNUT1JfRFJPUERPV04gPSAnLmRyb3Bkb3duJ1xuY29uc3QgU0VMRUNUT1JfTkFWX0xJU1RfR1JPVVAgPSAnLm5hdiwgLmxpc3QtZ3JvdXAnXG5jb25zdCBTRUxFQ1RPUl9BQ1RJVkUgPSAnLmFjdGl2ZSdcbmNvbnN0IFNFTEVDVE9SX0FDVElWRV9VTCA9ICc6c2NvcGUgPiBsaSA+IC5hY3RpdmUnXG5jb25zdCBTRUxFQ1RPUl9EQVRBX1RPR0dMRSA9ICdbZGF0YS1icy10b2dnbGU9XCJ0YWJcIl0sIFtkYXRhLWJzLXRvZ2dsZT1cInBpbGxcIl0sIFtkYXRhLWJzLXRvZ2dsZT1cImxpc3RcIl0nXG5jb25zdCBTRUxFQ1RPUl9EUk9QRE9XTl9UT0dHTEUgPSAnLmRyb3Bkb3duLXRvZ2dsZSdcbmNvbnN0IFNFTEVDVE9SX0RST1BET1dOX0FDVElWRV9DSElMRCA9ICc6c2NvcGUgPiAuZHJvcGRvd24tbWVudSAuYWN0aXZlJ1xuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQ2xhc3MgRGVmaW5pdGlvblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuY2xhc3MgVGFiIGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG4gIC8vIEdldHRlcnNcblxuICBzdGF0aWMgZ2V0IE5BTUUoKSB7XG4gICAgcmV0dXJuIE5BTUVcbiAgfVxuXG4gIC8vIFB1YmxpY1xuXG4gIHNob3coKSB7XG4gICAgaWYgKCh0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUgJiZcbiAgICAgIHRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgJiZcbiAgICAgIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfQUNUSVZFKSkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGxldCBwcmV2aW91c1xuICAgIGNvbnN0IHRhcmdldCA9IGdldEVsZW1lbnRGcm9tU2VsZWN0b3IodGhpcy5fZWxlbWVudClcbiAgICBjb25zdCBsaXN0RWxlbWVudCA9IHRoaXMuX2VsZW1lbnQuY2xvc2VzdChTRUxFQ1RPUl9OQVZfTElTVF9HUk9VUClcblxuICAgIGlmIChsaXN0RWxlbWVudCkge1xuICAgICAgY29uc3QgaXRlbVNlbGVjdG9yID0gbGlzdEVsZW1lbnQubm9kZU5hbWUgPT09ICdVTCcgfHwgbGlzdEVsZW1lbnQubm9kZU5hbWUgPT09ICdPTCcgPyBTRUxFQ1RPUl9BQ1RJVkVfVUwgOiBTRUxFQ1RPUl9BQ1RJVkVcbiAgICAgIHByZXZpb3VzID0gU2VsZWN0b3JFbmdpbmUuZmluZChpdGVtU2VsZWN0b3IsIGxpc3RFbGVtZW50KVxuICAgICAgcHJldmlvdXMgPSBwcmV2aW91c1twcmV2aW91cy5sZW5ndGggLSAxXVxuICAgIH1cblxuICAgIGNvbnN0IGhpZGVFdmVudCA9IHByZXZpb3VzID9cbiAgICAgIEV2ZW50SGFuZGxlci50cmlnZ2VyKHByZXZpb3VzLCBFVkVOVF9ISURFLCB7XG4gICAgICAgIHJlbGF0ZWRUYXJnZXQ6IHRoaXMuX2VsZW1lbnRcbiAgICAgIH0pIDpcbiAgICAgIG51bGxcblxuICAgIGNvbnN0IHNob3dFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX1NIT1csIHtcbiAgICAgIHJlbGF0ZWRUYXJnZXQ6IHByZXZpb3VzXG4gICAgfSlcblxuICAgIGlmIChzaG93RXZlbnQuZGVmYXVsdFByZXZlbnRlZCB8fCAoaGlkZUV2ZW50ICE9PSBudWxsICYmIGhpZGVFdmVudC5kZWZhdWx0UHJldmVudGVkKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5fYWN0aXZhdGUodGhpcy5fZWxlbWVudCwgbGlzdEVsZW1lbnQpXG5cbiAgICBjb25zdCBjb21wbGV0ZSA9ICgpID0+IHtcbiAgICAgIEV2ZW50SGFuZGxlci50cmlnZ2VyKHByZXZpb3VzLCBFVkVOVF9ISURERU4sIHtcbiAgICAgICAgcmVsYXRlZFRhcmdldDogdGhpcy5fZWxlbWVudFxuICAgICAgfSlcbiAgICAgIEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX1NIT1dOLCB7XG4gICAgICAgIHJlbGF0ZWRUYXJnZXQ6IHByZXZpb3VzXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHRoaXMuX2FjdGl2YXRlKHRhcmdldCwgdGFyZ2V0LnBhcmVudE5vZGUsIGNvbXBsZXRlKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb21wbGV0ZSgpXG4gICAgfVxuICB9XG5cbiAgLy8gUHJpdmF0ZVxuXG4gIF9hY3RpdmF0ZShlbGVtZW50LCBjb250YWluZXIsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgYWN0aXZlRWxlbWVudHMgPSBjb250YWluZXIgJiYgKGNvbnRhaW5lci5ub2RlTmFtZSA9PT0gJ1VMJyB8fCBjb250YWluZXIubm9kZU5hbWUgPT09ICdPTCcpID9cbiAgICAgIFNlbGVjdG9yRW5naW5lLmZpbmQoU0VMRUNUT1JfQUNUSVZFX1VMLCBjb250YWluZXIpIDpcbiAgICAgIFNlbGVjdG9yRW5naW5lLmNoaWxkcmVuKGNvbnRhaW5lciwgU0VMRUNUT1JfQUNUSVZFKVxuXG4gICAgY29uc3QgYWN0aXZlID0gYWN0aXZlRWxlbWVudHNbMF1cbiAgICBjb25zdCBpc1RyYW5zaXRpb25pbmcgPSBjYWxsYmFjayAmJiAoYWN0aXZlICYmIGFjdGl2ZS5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9GQURFKSlcblxuICAgIGNvbnN0IGNvbXBsZXRlID0gKCkgPT4gdGhpcy5fdHJhbnNpdGlvbkNvbXBsZXRlKGVsZW1lbnQsIGFjdGl2ZSwgY2FsbGJhY2spXG5cbiAgICBpZiAoYWN0aXZlICYmIGlzVHJhbnNpdGlvbmluZykge1xuICAgICAgYWN0aXZlLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKVxuICAgICAgdGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZSwgZWxlbWVudCwgdHJ1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgY29tcGxldGUoKVxuICAgIH1cbiAgfVxuXG4gIF90cmFuc2l0aW9uQ29tcGxldGUoZWxlbWVudCwgYWN0aXZlLCBjYWxsYmFjaykge1xuICAgIGlmIChhY3RpdmUpIHtcbiAgICAgIGFjdGl2ZS5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfQUNUSVZFKVxuXG4gICAgICBjb25zdCBkcm9wZG93bkNoaWxkID0gU2VsZWN0b3JFbmdpbmUuZmluZE9uZShTRUxFQ1RPUl9EUk9QRE9XTl9BQ1RJVkVfQ0hJTEQsIGFjdGl2ZS5wYXJlbnROb2RlKVxuXG4gICAgICBpZiAoZHJvcGRvd25DaGlsZCkge1xuICAgICAgICBkcm9wZG93bkNoaWxkLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9BQ1RJVkUpXG4gICAgICB9XG5cbiAgICAgIGlmIChhY3RpdmUuZ2V0QXR0cmlidXRlKCdyb2xlJykgPT09ICd0YWInKSB7XG4gICAgICAgIGFjdGl2ZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9BQ1RJVkUpXG4gICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdyb2xlJykgPT09ICd0YWInKSB7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIHRydWUpXG4gICAgfVxuXG4gICAgcmVmbG93KGVsZW1lbnQpXG5cbiAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NfTkFNRV9GQURFKSkge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfU0hPVylcbiAgICB9XG5cbiAgICBsZXQgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gICAgaWYgKHBhcmVudCAmJiBwYXJlbnQubm9kZU5hbWUgPT09ICdMSScpIHtcbiAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlXG4gICAgfVxuXG4gICAgaWYgKHBhcmVudCAmJiBwYXJlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfRFJPUERPV05fTUVOVSkpIHtcbiAgICAgIGNvbnN0IGRyb3Bkb3duRWxlbWVudCA9IGVsZW1lbnQuY2xvc2VzdChTRUxFQ1RPUl9EUk9QRE9XTilcblxuICAgICAgaWYgKGRyb3Bkb3duRWxlbWVudCkge1xuICAgICAgICBTZWxlY3RvckVuZ2luZS5maW5kKFNFTEVDVE9SX0RST1BET1dOX1RPR0dMRSwgZHJvcGRvd25FbGVtZW50KVxuICAgICAgICAgIC5mb3JFYWNoKGRyb3Bkb3duID0+IGRyb3Bkb3duLmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9BQ1RJVkUpKVxuICAgICAgfVxuXG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRydWUpXG4gICAgfVxuXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjaygpXG4gICAgfVxuICB9XG5cbiAgLy8gU3RhdGljXG5cbiAgc3RhdGljIGpRdWVyeUludGVyZmFjZShjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IGRhdGEgPSBUYWIuZ2V0T3JDcmVhdGVJbnN0YW5jZSh0aGlzKVxuXG4gICAgICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhW2NvbmZpZ10gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgTm8gbWV0aG9kIG5hbWVkIFwiJHtjb25maWd9XCJgKVxuICAgICAgICB9XG5cbiAgICAgICAgZGF0YVtjb25maWddKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBEYXRhIEFwaSBpbXBsZW1lbnRhdGlvblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuRXZlbnRIYW5kbGVyLm9uKGRvY3VtZW50LCBFVkVOVF9DTElDS19EQVRBX0FQSSwgU0VMRUNUT1JfREFUQV9UT0dHTEUsIGZ1bmN0aW9uIChldmVudCkge1xuICBpZiAoWydBJywgJ0FSRUEnXS5pbmNsdWRlcyh0aGlzLnRhZ05hbWUpKSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICB9XG5cbiAgaWYgKGlzRGlzYWJsZWQodGhpcykpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGNvbnN0IGRhdGEgPSBUYWIuZ2V0T3JDcmVhdGVJbnN0YW5jZSh0aGlzKVxuICBkYXRhLnNob3coKVxufSlcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIGpRdWVyeVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBhZGQgLlRhYiB0byBqUXVlcnkgb25seSBpZiBqUXVlcnkgaXMgcHJlc2VudFxuICovXG5cbmRlZmluZUpRdWVyeVBsdWdpbihUYWIpXG5cbmV4cG9ydCBkZWZhdWx0IFRhYlxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQm9vdHN0cmFwICh2NS4xLjMpOiB0b2FzdC5qc1xuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYWluL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmltcG9ydCB7XG4gIGRlZmluZUpRdWVyeVBsdWdpbixcbiAgcmVmbG93LFxuICB0eXBlQ2hlY2tDb25maWdcbn0gZnJvbSAnLi91dGlsL2luZGV4J1xuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tICcuL2RvbS9ldmVudC1oYW5kbGVyJ1xuaW1wb3J0IE1hbmlwdWxhdG9yIGZyb20gJy4vZG9tL21hbmlwdWxhdG9yJ1xuaW1wb3J0IEJhc2VDb21wb25lbnQgZnJvbSAnLi9iYXNlLWNvbXBvbmVudCdcbmltcG9ydCB7IGVuYWJsZURpc21pc3NUcmlnZ2VyIH0gZnJvbSAnLi91dGlsL2NvbXBvbmVudC1mdW5jdGlvbnMnXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBDb25zdGFudHNcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmNvbnN0IE5BTUUgPSAndG9hc3QnXG5jb25zdCBEQVRBX0tFWSA9ICdicy50b2FzdCdcbmNvbnN0IEVWRU5UX0tFWSA9IGAuJHtEQVRBX0tFWX1gXG5cbmNvbnN0IEVWRU5UX01PVVNFT1ZFUiA9IGBtb3VzZW92ZXIke0VWRU5UX0tFWX1gXG5jb25zdCBFVkVOVF9NT1VTRU9VVCA9IGBtb3VzZW91dCR7RVZFTlRfS0VZfWBcbmNvbnN0IEVWRU5UX0ZPQ1VTSU4gPSBgZm9jdXNpbiR7RVZFTlRfS0VZfWBcbmNvbnN0IEVWRU5UX0ZPQ1VTT1VUID0gYGZvY3Vzb3V0JHtFVkVOVF9LRVl9YFxuY29uc3QgRVZFTlRfSElERSA9IGBoaWRlJHtFVkVOVF9LRVl9YFxuY29uc3QgRVZFTlRfSElEREVOID0gYGhpZGRlbiR7RVZFTlRfS0VZfWBcbmNvbnN0IEVWRU5UX1NIT1cgPSBgc2hvdyR7RVZFTlRfS0VZfWBcbmNvbnN0IEVWRU5UX1NIT1dOID0gYHNob3duJHtFVkVOVF9LRVl9YFxuXG5jb25zdCBDTEFTU19OQU1FX0ZBREUgPSAnZmFkZSdcbmNvbnN0IENMQVNTX05BTUVfSElERSA9ICdoaWRlJyAvLyBAZGVwcmVjYXRlZCAtIGtlcHQgaGVyZSBvbmx5IGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuY29uc3QgQ0xBU1NfTkFNRV9TSE9XID0gJ3Nob3cnXG5jb25zdCBDTEFTU19OQU1FX1NIT1dJTkcgPSAnc2hvd2luZydcblxuY29uc3QgRGVmYXVsdFR5cGUgPSB7XG4gIGFuaW1hdGlvbjogJ2Jvb2xlYW4nLFxuICBhdXRvaGlkZTogJ2Jvb2xlYW4nLFxuICBkZWxheTogJ251bWJlcidcbn1cblxuY29uc3QgRGVmYXVsdCA9IHtcbiAgYW5pbWF0aW9uOiB0cnVlLFxuICBhdXRvaGlkZTogdHJ1ZSxcbiAgZGVsYXk6IDUwMDBcbn1cblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENsYXNzIERlZmluaXRpb25cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmNsYXNzIFRvYXN0IGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGNvbmZpZykge1xuICAgIHN1cGVyKGVsZW1lbnQpXG5cbiAgICB0aGlzLl9jb25maWcgPSB0aGlzLl9nZXRDb25maWcoY29uZmlnKVxuICAgIHRoaXMuX3RpbWVvdXQgPSBudWxsXG4gICAgdGhpcy5faGFzTW91c2VJbnRlcmFjdGlvbiA9IGZhbHNlXG4gICAgdGhpcy5faGFzS2V5Ym9hcmRJbnRlcmFjdGlvbiA9IGZhbHNlXG4gICAgdGhpcy5fc2V0TGlzdGVuZXJzKClcbiAgfVxuXG4gIC8vIEdldHRlcnNcblxuICBzdGF0aWMgZ2V0IERlZmF1bHRUeXBlKCkge1xuICAgIHJldHVybiBEZWZhdWx0VHlwZVxuICB9XG5cbiAgc3RhdGljIGdldCBEZWZhdWx0KCkge1xuICAgIHJldHVybiBEZWZhdWx0XG4gIH1cblxuICBzdGF0aWMgZ2V0IE5BTUUoKSB7XG4gICAgcmV0dXJuIE5BTUVcbiAgfVxuXG4gIC8vIFB1YmxpY1xuXG4gIHNob3coKSB7XG4gICAgY29uc3Qgc2hvd0V2ZW50ID0gRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfU0hPVylcblxuICAgIGlmIChzaG93RXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5fY2xlYXJUaW1lb3V0KClcblxuICAgIGlmICh0aGlzLl9jb25maWcuYW5pbWF0aW9uKSB7XG4gICAgICB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9GQURFKVxuICAgIH1cblxuICAgIGNvbnN0IGNvbXBsZXRlID0gKCkgPT4ge1xuICAgICAgdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfU0hPV0lORylcbiAgICAgIEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX1NIT1dOKVxuXG4gICAgICB0aGlzLl9tYXliZVNjaGVkdWxlSGlkZSgpXG4gICAgfVxuXG4gICAgdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKENMQVNTX05BTUVfSElERSkgLy8gQGRlcHJlY2F0ZWRcbiAgICByZWZsb3codGhpcy5fZWxlbWVudClcbiAgICB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NfTkFNRV9TSE9XKVxuICAgIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1dJTkcpXG5cbiAgICB0aGlzLl9xdWV1ZUNhbGxiYWNrKGNvbXBsZXRlLCB0aGlzLl9lbGVtZW50LCB0aGlzLl9jb25maWcuYW5pbWF0aW9uKVxuICB9XG5cbiAgaGlkZSgpIHtcbiAgICBpZiAoIXRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTX05BTUVfU0hPVykpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGhpZGVFdmVudCA9IEV2ZW50SGFuZGxlci50cmlnZ2VyKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0hJREUpXG5cbiAgICBpZiAoaGlkZUV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGNvbXBsZXRlID0gKCkgPT4ge1xuICAgICAgdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTX05BTUVfSElERSkgLy8gQGRlcHJlY2F0ZWRcbiAgICAgIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShDTEFTU19OQU1FX1NIT1dJTkcpXG4gICAgICB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKVxuICAgICAgRXZlbnRIYW5kbGVyLnRyaWdnZXIodGhpcy5fZWxlbWVudCwgRVZFTlRfSElEREVOKVxuICAgIH1cblxuICAgIHRoaXMuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU19OQU1FX1NIT1dJTkcpXG4gICAgdGhpcy5fcXVldWVDYWxsYmFjayhjb21wbGV0ZSwgdGhpcy5fZWxlbWVudCwgdGhpcy5fY29uZmlnLmFuaW1hdGlvbilcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5fY2xlYXJUaW1lb3V0KClcblxuICAgIGlmICh0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhDTEFTU19OQU1FX1NIT1cpKSB7XG4gICAgICB0aGlzLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NfTkFNRV9TSE9XKVxuICAgIH1cblxuICAgIHN1cGVyLmRpc3Bvc2UoKVxuICB9XG5cbiAgLy8gUHJpdmF0ZVxuXG4gIF9nZXRDb25maWcoY29uZmlnKSB7XG4gICAgY29uZmlnID0ge1xuICAgICAgLi4uRGVmYXVsdCxcbiAgICAgIC4uLk1hbmlwdWxhdG9yLmdldERhdGFBdHRyaWJ1dGVzKHRoaXMuX2VsZW1lbnQpLFxuICAgICAgLi4uKHR5cGVvZiBjb25maWcgPT09ICdvYmplY3QnICYmIGNvbmZpZyA/IGNvbmZpZyA6IHt9KVxuICAgIH1cblxuICAgIHR5cGVDaGVja0NvbmZpZyhOQU1FLCBjb25maWcsIHRoaXMuY29uc3RydWN0b3IuRGVmYXVsdFR5cGUpXG5cbiAgICByZXR1cm4gY29uZmlnXG4gIH1cblxuICBfbWF5YmVTY2hlZHVsZUhpZGUoKSB7XG4gICAgaWYgKCF0aGlzLl9jb25maWcuYXV0b2hpZGUpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmICh0aGlzLl9oYXNNb3VzZUludGVyYWN0aW9uIHx8IHRoaXMuX2hhc0tleWJvYXJkSW50ZXJhY3Rpb24pIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMuX3RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuaGlkZSgpXG4gICAgfSwgdGhpcy5fY29uZmlnLmRlbGF5KVxuICB9XG5cbiAgX29uSW50ZXJhY3Rpb24oZXZlbnQsIGlzSW50ZXJhY3RpbmcpIHtcbiAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlb3Zlcic6XG4gICAgICBjYXNlICdtb3VzZW91dCc6XG4gICAgICAgIHRoaXMuX2hhc01vdXNlSW50ZXJhY3Rpb24gPSBpc0ludGVyYWN0aW5nXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdmb2N1c2luJzpcbiAgICAgIGNhc2UgJ2ZvY3Vzb3V0JzpcbiAgICAgICAgdGhpcy5faGFzS2V5Ym9hcmRJbnRlcmFjdGlvbiA9IGlzSW50ZXJhY3RpbmdcbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgaWYgKGlzSW50ZXJhY3RpbmcpIHtcbiAgICAgIHRoaXMuX2NsZWFyVGltZW91dCgpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBuZXh0RWxlbWVudCA9IGV2ZW50LnJlbGF0ZWRUYXJnZXRcbiAgICBpZiAodGhpcy5fZWxlbWVudCA9PT0gbmV4dEVsZW1lbnQgfHwgdGhpcy5fZWxlbWVudC5jb250YWlucyhuZXh0RWxlbWVudCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMuX21heWJlU2NoZWR1bGVIaWRlKClcbiAgfVxuXG4gIF9zZXRMaXN0ZW5lcnMoKSB7XG4gICAgRXZlbnRIYW5kbGVyLm9uKHRoaXMuX2VsZW1lbnQsIEVWRU5UX01PVVNFT1ZFUiwgZXZlbnQgPT4gdGhpcy5fb25JbnRlcmFjdGlvbihldmVudCwgdHJ1ZSkpXG4gICAgRXZlbnRIYW5kbGVyLm9uKHRoaXMuX2VsZW1lbnQsIEVWRU5UX01PVVNFT1VULCBldmVudCA9PiB0aGlzLl9vbkludGVyYWN0aW9uKGV2ZW50LCBmYWxzZSkpXG4gICAgRXZlbnRIYW5kbGVyLm9uKHRoaXMuX2VsZW1lbnQsIEVWRU5UX0ZPQ1VTSU4sIGV2ZW50ID0+IHRoaXMuX29uSW50ZXJhY3Rpb24oZXZlbnQsIHRydWUpKVxuICAgIEV2ZW50SGFuZGxlci5vbih0aGlzLl9lbGVtZW50LCBFVkVOVF9GT0NVU09VVCwgZXZlbnQgPT4gdGhpcy5fb25JbnRlcmFjdGlvbihldmVudCwgZmFsc2UpKVxuICB9XG5cbiAgX2NsZWFyVGltZW91dCgpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZW91dClcbiAgICB0aGlzLl90aW1lb3V0ID0gbnVsbFxuICB9XG5cbiAgLy8gU3RhdGljXG5cbiAgc3RhdGljIGpRdWVyeUludGVyZmFjZShjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IGRhdGEgPSBUb2FzdC5nZXRPckNyZWF0ZUluc3RhbmNlKHRoaXMsIGNvbmZpZylcblxuICAgICAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YVtjb25maWddID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYE5vIG1ldGhvZCBuYW1lZCBcIiR7Y29uZmlnfVwiYClcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGFbY29uZmlnXSh0aGlzKVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cblxuZW5hYmxlRGlzbWlzc1RyaWdnZXIoVG9hc3QpXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBqUXVlcnlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogYWRkIC5Ub2FzdCB0byBqUXVlcnkgb25seSBpZiBqUXVlcnkgaXMgcHJlc2VudFxuICovXG5cbmRlZmluZUpRdWVyeVBsdWdpbihUb2FzdClcblxuZXhwb3J0IGRlZmF1bHQgVG9hc3RcbiIsImltcG9ydCB7IG5ld0VsZW1lbnQgfSBmcm9tICcuLi9tb2R1bGVzL2VsZW1lbnRCdWlsZGVyJztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGhlYWRlcigpIHtcbiAgICBjb25zdCBoZWFkZXJDb250YWluZXIgPSBuZXdFbGVtZW50KHtcbiAgICAgICAgZWxlbWVudDogJ2hlYWRlcicsXG4gICAgICAgIGNsYXNzTmFtZTogJ3Rlc3QgdGVzdDInLFxuICAgICAgICBlbGVtZW50SUQ6ICdoZWFkZXJDb250YWluZXInLFxuICAgIH0pO1xuICAgIGNvbnN0IGhlYWRlclRleHQgPSBuZXdFbGVtZW50KHtcbiAgICAgICAgZWxlbWVudDogJ2gxJyxcbiAgICAgICAgY2xhc3NOYW1lOiAndGVzdCcsXG4gICAgICAgIGVsZW1lbnRJRDogJ2hlYWRlcicsXG4gICAgICAgIHRleHQ6ICdCYXR0bGVzaGlwISEnLFxuICAgIH0pO1xuICAgIGhlYWRlckNvbnRhaW5lci5hcHBlbmRDaGlsZChoZWFkZXJUZXh0KTtcbiAgICByZXR1cm4gaGVhZGVyQ29udGFpbmVyO1xufVxuIiwiLyogZXNsaW50LWRpc2FibGUgb2JqZWN0LWN1cmx5LW5ld2xpbmUgKi9cbmZ1bmN0aW9uIG5ld0VsZW1lbnQoeyBlbGVtZW50ID0gJycsIGNsYXNzTmFtZSA9ICcnLCBlbGVtZW50SUQgPSAnJywgdGV4dCA9ICcnLCBocmVmID0gJycsIHNyYyA9ICcnLCBhbHQgPSAnJyB9KSB7XG4gICAgY29uc3QgRE9NZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudCk7XG4gICAgaWYgKGNsYXNzTmFtZSlcbiAgICAgICAgRE9NZWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgaWYgKGVsZW1lbnRJRClcbiAgICAgICAgRE9NZWxlbWVudC5pZCA9IGVsZW1lbnRJRDtcbiAgICBpZiAodGV4dClcbiAgICAgICAgRE9NZWxlbWVudC50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgaWYgKGVsZW1lbnQgPT09ICdhJyAmJiBocmVmKVxuICAgICAgICBET01lbGVtZW50LnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuICAgIGlmIChlbGVtZW50ID09PSAnaW1nJyAmJiBzcmMpXG4gICAgICAgIERPTWVsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCBzcmMpO1xuICAgIGlmIChlbGVtZW50ID09PSAnaW1nJyAmJiBhbHQpXG4gICAgICAgIERPTWVsZW1lbnQuc2V0QXR0cmlidXRlKCdhbHQnLCBhbHQpO1xuICAgIHJldHVybiBET01lbGVtZW50O1xufVxuZnVuY3Rpb24gc2VuZFRvQm9keShIVE1MKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoSFRNTCk7XG59XG5mdW5jdGlvbiByZW1vdmVBbGxDaGlsZE5vZGVzKHBhcmVudCkge1xuICAgIHdoaWxlIChwYXJlbnQuZmlyc3RDaGlsZCkge1xuICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQocGFyZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIG1vZHVsZVJlbmRlcihvYmosIHBhcmVudE5vZGUpIHtcbiAgICByZW1vdmVBbGxDaGlsZE5vZGVzKHBhcmVudE5vZGUpO1xuICAgIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaCgoeCkgPT4gcGFyZW50Tm9kZS5hcHBlbmRDaGlsZChvYmpbeF0pKTtcbn1cbmNvbnN0IGNsb3NlV2luZG93ID0gKGVsZW1lbnQpID0+IHtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xufTtcbmV4cG9ydCB7IG5ld0VsZW1lbnQsIHNlbmRUb0JvZHksIHJlbW92ZUFsbENoaWxkTm9kZXMsIG1vZHVsZVJlbmRlciwgY2xvc2VXaW5kb3cgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0ICdib290c3RyYXAnO1xuLy8gaW1wb3J0IFBsYXllciBmcm9tICcuL21vZHVsZXMvcGxheWVyJztcbmltcG9ydCAqIGFzIGVsZW1lbnRCdWlsZGVyIGZyb20gJy4vbW9kdWxlcy9lbGVtZW50QnVpbGRlcic7XG5pbXBvcnQgaGVhZGVyIGZyb20gJy4vY29tcG9uZW50cy9oZWFkZXInO1xuY29uc3QgbWFpbiA9IGVsZW1lbnRCdWlsZGVyLm5ld0VsZW1lbnQoe1xuICAgIGVsZW1lbnQ6ICdkaXYnLFxuICAgIGVsZW1lbnRJRDogJ21haW4nLFxufSk7XG5jb25zdCBoZWFkZXJNb2RlbCA9IGhlYWRlcigpO1xuY29uc3QgbW9kZWwgPSB7XG4gICAgaGVhZGVyTW9kZWwsXG59O1xuZWxlbWVudEJ1aWxkZXIubW9kdWxlUmVuZGVyKG1vZGVsLCBtYWluKTtcbmVsZW1lbnRCdWlsZGVyLnNlbmRUb0JvZHkobWFpbik7XG4iXSwibmFtZXMiOlsiTUFYX1VJRCIsIk1JTExJU0VDT05EU19NVUxUSVBMSUVSIiwiVFJBTlNJVElPTl9FTkQiLCJ0b1R5cGUiLCJvYmoiLCJ1bmRlZmluZWQiLCJ0b1N0cmluZyIsImNhbGwiLCJtYXRjaCIsInRvTG93ZXJDYXNlIiwiZ2V0VUlEIiwicHJlZml4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImdldFNlbGVjdG9yIiwiZWxlbWVudCIsInNlbGVjdG9yIiwiZ2V0QXR0cmlidXRlIiwiaHJlZkF0dHIiLCJpbmNsdWRlcyIsInN0YXJ0c1dpdGgiLCJzcGxpdCIsInRyaW0iLCJnZXRTZWxlY3RvckZyb21FbGVtZW50IiwicXVlcnlTZWxlY3RvciIsImdldEVsZW1lbnRGcm9tU2VsZWN0b3IiLCJnZXRUcmFuc2l0aW9uRHVyYXRpb25Gcm9tRWxlbWVudCIsInRyYW5zaXRpb25EdXJhdGlvbiIsInRyYW5zaXRpb25EZWxheSIsIndpbmRvdyIsImdldENvbXB1dGVkU3R5bGUiLCJmbG9hdFRyYW5zaXRpb25EdXJhdGlvbiIsIk51bWJlciIsInBhcnNlRmxvYXQiLCJmbG9hdFRyYW5zaXRpb25EZWxheSIsInRyaWdnZXJUcmFuc2l0aW9uRW5kIiwiZGlzcGF0Y2hFdmVudCIsIkV2ZW50IiwiaXNFbGVtZW50IiwianF1ZXJ5Iiwibm9kZVR5cGUiLCJnZXRFbGVtZW50IiwibGVuZ3RoIiwidHlwZUNoZWNrQ29uZmlnIiwiY29tcG9uZW50TmFtZSIsImNvbmZpZyIsImNvbmZpZ1R5cGVzIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJwcm9wZXJ0eSIsImV4cGVjdGVkVHlwZXMiLCJ2YWx1ZSIsInZhbHVlVHlwZSIsIlJlZ0V4cCIsInRlc3QiLCJUeXBlRXJyb3IiLCJ0b1VwcGVyQ2FzZSIsImlzVmlzaWJsZSIsImdldENsaWVudFJlY3RzIiwiZ2V0UHJvcGVydHlWYWx1ZSIsImlzRGlzYWJsZWQiLCJOb2RlIiwiRUxFTUVOVF9OT0RFIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJkaXNhYmxlZCIsImhhc0F0dHJpYnV0ZSIsImZpbmRTaGFkb3dSb290IiwiZG9jdW1lbnRFbGVtZW50IiwiYXR0YWNoU2hhZG93IiwiZ2V0Um9vdE5vZGUiLCJyb290IiwiU2hhZG93Um9vdCIsInBhcmVudE5vZGUiLCJub29wIiwicmVmbG93Iiwib2Zmc2V0SGVpZ2h0IiwiZ2V0alF1ZXJ5IiwialF1ZXJ5IiwiYm9keSIsIkRPTUNvbnRlbnRMb2FkZWRDYWxsYmFja3MiLCJvbkRPTUNvbnRlbnRMb2FkZWQiLCJjYWxsYmFjayIsInJlYWR5U3RhdGUiLCJhZGRFdmVudExpc3RlbmVyIiwicHVzaCIsImlzUlRMIiwiZGlyIiwiZGVmaW5lSlF1ZXJ5UGx1Z2luIiwicGx1Z2luIiwiJCIsIm5hbWUiLCJOQU1FIiwiSlFVRVJZX05PX0NPTkZMSUNUIiwiZm4iLCJqUXVlcnlJbnRlcmZhY2UiLCJDb25zdHJ1Y3RvciIsIm5vQ29uZmxpY3QiLCJleGVjdXRlIiwiZXhlY3V0ZUFmdGVyVHJhbnNpdGlvbiIsInRyYW5zaXRpb25FbGVtZW50Iiwid2FpdEZvclRyYW5zaXRpb24iLCJkdXJhdGlvblBhZGRpbmciLCJlbXVsYXRlZER1cmF0aW9uIiwiY2FsbGVkIiwiaGFuZGxlciIsInRhcmdldCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJzZXRUaW1lb3V0IiwiZ2V0TmV4dEFjdGl2ZUVsZW1lbnQiLCJsaXN0IiwiYWN0aXZlRWxlbWVudCIsInNob3VsZEdldE5leHQiLCJpc0N5Y2xlQWxsb3dlZCIsImluZGV4IiwiaW5kZXhPZiIsImxpc3RMZW5ndGgiLCJtYXgiLCJtaW4iLCJuYW1lc3BhY2VSZWdleCIsInN0cmlwTmFtZVJlZ2V4Iiwic3RyaXBVaWRSZWdleCIsImV2ZW50UmVnaXN0cnkiLCJ1aWRFdmVudCIsImN1c3RvbUV2ZW50cyIsIm1vdXNlZW50ZXIiLCJtb3VzZWxlYXZlIiwiY3VzdG9tRXZlbnRzUmVnZXgiLCJuYXRpdmVFdmVudHMiLCJTZXQiLCJnZXRVaWRFdmVudCIsInVpZCIsImdldEV2ZW50IiwiYm9vdHN0cmFwSGFuZGxlciIsImV2ZW50IiwiZGVsZWdhdGVUYXJnZXQiLCJvbmVPZmYiLCJFdmVudEhhbmRsZXIiLCJvZmYiLCJ0eXBlIiwiYXBwbHkiLCJib290c3RyYXBEZWxlZ2F0aW9uSGFuZGxlciIsImRvbUVsZW1lbnRzIiwicXVlcnlTZWxlY3RvckFsbCIsImkiLCJmaW5kSGFuZGxlciIsImV2ZW50cyIsImRlbGVnYXRpb25TZWxlY3RvciIsInVpZEV2ZW50TGlzdCIsImxlbiIsIm9yaWdpbmFsSGFuZGxlciIsIm5vcm1hbGl6ZVBhcmFtcyIsIm9yaWdpbmFsVHlwZUV2ZW50IiwiZGVsZWdhdGlvbkZuIiwiZGVsZWdhdGlvbiIsInR5cGVFdmVudCIsImdldFR5cGVFdmVudCIsImlzTmF0aXZlIiwiaGFzIiwiYWRkSGFuZGxlciIsIndyYXBGbiIsInJlbGF0ZWRUYXJnZXQiLCJoYW5kbGVycyIsInByZXZpb3VzRm4iLCJyZXBsYWNlIiwicmVtb3ZlSGFuZGxlciIsIkJvb2xlYW4iLCJyZW1vdmVOYW1lc3BhY2VkSGFuZGxlcnMiLCJuYW1lc3BhY2UiLCJzdG9yZUVsZW1lbnRFdmVudCIsImhhbmRsZXJLZXkiLCJvbiIsIm9uZSIsImluTmFtZXNwYWNlIiwiaXNOYW1lc3BhY2UiLCJlbGVtZW50RXZlbnQiLCJzbGljZSIsImtleUhhbmRsZXJzIiwidHJpZ2dlciIsImFyZ3MiLCJqUXVlcnlFdmVudCIsImJ1YmJsZXMiLCJuYXRpdmVEaXNwYXRjaCIsImRlZmF1bHRQcmV2ZW50ZWQiLCJldnQiLCJpc1Byb3BhZ2F0aW9uU3RvcHBlZCIsImlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkIiwiaXNEZWZhdWx0UHJldmVudGVkIiwiY3JlYXRlRXZlbnQiLCJpbml0RXZlbnQiLCJDdXN0b21FdmVudCIsImNhbmNlbGFibGUiLCJrZXkiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsInByZXZlbnREZWZhdWx0IiwiZWxlbWVudE1hcCIsIk1hcCIsInNldCIsImluc3RhbmNlIiwiaW5zdGFuY2VNYXAiLCJzaXplIiwiY29uc29sZSIsImVycm9yIiwiQXJyYXkiLCJmcm9tIiwicmVtb3ZlIiwiZGVsZXRlIiwiVkVSU0lPTiIsIkJhc2VDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsIl9lbGVtZW50IiwiRGF0YSIsIkRBVEFfS0VZIiwiZGlzcG9zZSIsIkVWRU5UX0tFWSIsImdldE93blByb3BlcnR5TmFtZXMiLCJwcm9wZXJ0eU5hbWUiLCJfcXVldWVDYWxsYmFjayIsImlzQW5pbWF0ZWQiLCJnZXRJbnN0YW5jZSIsImdldE9yQ3JlYXRlSW5zdGFuY2UiLCJFcnJvciIsImVuYWJsZURpc21pc3NUcmlnZ2VyIiwiY29tcG9uZW50IiwibWV0aG9kIiwiY2xpY2tFdmVudCIsInRhZ05hbWUiLCJjbG9zZXN0IiwiRVZFTlRfQ0xPU0UiLCJFVkVOVF9DTE9TRUQiLCJDTEFTU19OQU1FX0ZBREUiLCJDTEFTU19OQU1FX1NIT1ciLCJBbGVydCIsImNsb3NlIiwiY2xvc2VFdmVudCIsIl9kZXN0cm95RWxlbWVudCIsImVhY2giLCJkYXRhIiwiREFUQV9BUElfS0VZIiwiQ0xBU1NfTkFNRV9BQ1RJVkUiLCJTRUxFQ1RPUl9EQVRBX1RPR0dMRSIsIkVWRU5UX0NMSUNLX0RBVEFfQVBJIiwiQnV0dG9uIiwidG9nZ2xlIiwic2V0QXR0cmlidXRlIiwiYnV0dG9uIiwibm9ybWFsaXplRGF0YSIsInZhbCIsIm5vcm1hbGl6ZURhdGFLZXkiLCJjaHIiLCJNYW5pcHVsYXRvciIsInNldERhdGFBdHRyaWJ1dGUiLCJyZW1vdmVEYXRhQXR0cmlidXRlIiwicmVtb3ZlQXR0cmlidXRlIiwiZ2V0RGF0YUF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVzIiwiZGF0YXNldCIsImZpbHRlciIsInB1cmVLZXkiLCJjaGFyQXQiLCJnZXREYXRhQXR0cmlidXRlIiwib2Zmc2V0IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInRvcCIsInBhZ2VZT2Zmc2V0IiwibGVmdCIsInBhZ2VYT2Zmc2V0IiwicG9zaXRpb24iLCJvZmZzZXRUb3AiLCJvZmZzZXRMZWZ0IiwiTk9ERV9URVhUIiwiU2VsZWN0b3JFbmdpbmUiLCJmaW5kIiwiY29uY2F0IiwiRWxlbWVudCIsInByb3RvdHlwZSIsImZpbmRPbmUiLCJjaGlsZHJlbiIsImNoaWxkIiwibWF0Y2hlcyIsInBhcmVudHMiLCJhbmNlc3RvciIsInByZXYiLCJwcmV2aW91cyIsInByZXZpb3VzRWxlbWVudFNpYmxpbmciLCJuZXh0IiwibmV4dEVsZW1lbnRTaWJsaW5nIiwiZm9jdXNhYmxlQ2hpbGRyZW4iLCJmb2N1c2FibGVzIiwibWFwIiwiam9pbiIsImVsIiwiQVJST1dfTEVGVF9LRVkiLCJBUlJPV19SSUdIVF9LRVkiLCJUT1VDSEVWRU5UX0NPTVBBVF9XQUlUIiwiU1dJUEVfVEhSRVNIT0xEIiwiRGVmYXVsdCIsImludGVydmFsIiwia2V5Ym9hcmQiLCJzbGlkZSIsInBhdXNlIiwid3JhcCIsInRvdWNoIiwiRGVmYXVsdFR5cGUiLCJPUkRFUl9ORVhUIiwiT1JERVJfUFJFViIsIkRJUkVDVElPTl9MRUZUIiwiRElSRUNUSU9OX1JJR0hUIiwiS0VZX1RPX0RJUkVDVElPTiIsIkVWRU5UX1NMSURFIiwiRVZFTlRfU0xJRCIsIkVWRU5UX0tFWURPV04iLCJFVkVOVF9NT1VTRUVOVEVSIiwiRVZFTlRfTU9VU0VMRUFWRSIsIkVWRU5UX1RPVUNIU1RBUlQiLCJFVkVOVF9UT1VDSE1PVkUiLCJFVkVOVF9UT1VDSEVORCIsIkVWRU5UX1BPSU5URVJET1dOIiwiRVZFTlRfUE9JTlRFUlVQIiwiRVZFTlRfRFJBR19TVEFSVCIsIkVWRU5UX0xPQURfREFUQV9BUEkiLCJDTEFTU19OQU1FX0NBUk9VU0VMIiwiQ0xBU1NfTkFNRV9TTElERSIsIkNMQVNTX05BTUVfRU5EIiwiQ0xBU1NfTkFNRV9TVEFSVCIsIkNMQVNTX05BTUVfTkVYVCIsIkNMQVNTX05BTUVfUFJFViIsIkNMQVNTX05BTUVfUE9JTlRFUl9FVkVOVCIsIlNFTEVDVE9SX0FDVElWRSIsIlNFTEVDVE9SX0FDVElWRV9JVEVNIiwiU0VMRUNUT1JfSVRFTSIsIlNFTEVDVE9SX0lURU1fSU1HIiwiU0VMRUNUT1JfTkVYVF9QUkVWIiwiU0VMRUNUT1JfSU5ESUNBVE9SUyIsIlNFTEVDVE9SX0lORElDQVRPUiIsIlNFTEVDVE9SX0RBVEFfU0xJREUiLCJTRUxFQ1RPUl9EQVRBX1JJREUiLCJQT0lOVEVSX1RZUEVfVE9VQ0giLCJQT0lOVEVSX1RZUEVfUEVOIiwiQ2Fyb3VzZWwiLCJfaXRlbXMiLCJfaW50ZXJ2YWwiLCJfYWN0aXZlRWxlbWVudCIsIl9pc1BhdXNlZCIsIl9pc1NsaWRpbmciLCJ0b3VjaFRpbWVvdXQiLCJ0b3VjaFN0YXJ0WCIsInRvdWNoRGVsdGFYIiwiX2NvbmZpZyIsIl9nZXRDb25maWciLCJfaW5kaWNhdG9yc0VsZW1lbnQiLCJfdG91Y2hTdXBwb3J0ZWQiLCJuYXZpZ2F0b3IiLCJtYXhUb3VjaFBvaW50cyIsIl9wb2ludGVyRXZlbnQiLCJQb2ludGVyRXZlbnQiLCJfYWRkRXZlbnRMaXN0ZW5lcnMiLCJfc2xpZGUiLCJuZXh0V2hlblZpc2libGUiLCJoaWRkZW4iLCJjeWNsZSIsImNsZWFySW50ZXJ2YWwiLCJfdXBkYXRlSW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsInZpc2liaWxpdHlTdGF0ZSIsImJpbmQiLCJ0byIsImFjdGl2ZUluZGV4IiwiX2dldEl0ZW1JbmRleCIsIm9yZGVyIiwiX2hhbmRsZVN3aXBlIiwiYWJzRGVsdGF4IiwiYWJzIiwiZGlyZWN0aW9uIiwiX2tleWRvd24iLCJfYWRkVG91Y2hFdmVudExpc3RlbmVycyIsImhhc1BvaW50ZXJQZW5Ub3VjaCIsInBvaW50ZXJUeXBlIiwic3RhcnQiLCJjbGllbnRYIiwidG91Y2hlcyIsIm1vdmUiLCJlbmQiLCJjbGVhclRpbWVvdXQiLCJpdGVtSW1nIiwiYWRkIiwiX2dldEl0ZW1CeU9yZGVyIiwiaXNOZXh0IiwiX3RyaWdnZXJTbGlkZUV2ZW50IiwiZXZlbnREaXJlY3Rpb25OYW1lIiwidGFyZ2V0SW5kZXgiLCJmcm9tSW5kZXgiLCJfc2V0QWN0aXZlSW5kaWNhdG9yRWxlbWVudCIsImFjdGl2ZUluZGljYXRvciIsImluZGljYXRvcnMiLCJwYXJzZUludCIsImVsZW1lbnRJbnRlcnZhbCIsImRlZmF1bHRJbnRlcnZhbCIsImRpcmVjdGlvbk9yT3JkZXIiLCJfZGlyZWN0aW9uVG9PcmRlciIsImFjdGl2ZUVsZW1lbnRJbmRleCIsIm5leHRFbGVtZW50IiwibmV4dEVsZW1lbnRJbmRleCIsImlzQ3ljbGluZyIsImRpcmVjdGlvbmFsQ2xhc3NOYW1lIiwib3JkZXJDbGFzc05hbWUiLCJfb3JkZXJUb0RpcmVjdGlvbiIsInNsaWRlRXZlbnQiLCJ0cmlnZ2VyU2xpZEV2ZW50IiwiY29tcGxldGVDYWxsQmFjayIsImNhcm91c2VsSW50ZXJmYWNlIiwiYWN0aW9uIiwicmlkZSIsImRhdGFBcGlDbGlja0hhbmRsZXIiLCJzbGlkZUluZGV4IiwiY2Fyb3VzZWxzIiwicGFyZW50IiwiRVZFTlRfU0hPVyIsIkVWRU5UX1NIT1dOIiwiRVZFTlRfSElERSIsIkVWRU5UX0hJRERFTiIsIkNMQVNTX05BTUVfQ09MTEFQU0UiLCJDTEFTU19OQU1FX0NPTExBUFNJTkciLCJDTEFTU19OQU1FX0NPTExBUFNFRCIsIkNMQVNTX05BTUVfREVFUEVSX0NISUxEUkVOIiwiQ0xBU1NfTkFNRV9IT1JJWk9OVEFMIiwiV0lEVEgiLCJIRUlHSFQiLCJTRUxFQ1RPUl9BQ1RJVkVTIiwiQ29sbGFwc2UiLCJfaXNUcmFuc2l0aW9uaW5nIiwiX3RyaWdnZXJBcnJheSIsInRvZ2dsZUxpc3QiLCJlbGVtIiwiZmlsdGVyRWxlbWVudCIsImZvdW5kRWxlbSIsIl9zZWxlY3RvciIsIl9pbml0aWFsaXplQ2hpbGRyZW4iLCJfYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzIiwiX2lzU2hvd24iLCJoaWRlIiwic2hvdyIsImFjdGl2ZXMiLCJhY3RpdmVzRGF0YSIsImNvbnRhaW5lciIsInRlbXBBY3RpdmVEYXRhIiwic3RhcnRFdmVudCIsImVsZW1BY3RpdmUiLCJkaW1lbnNpb24iLCJfZ2V0RGltZW5zaW9uIiwic3R5bGUiLCJjb21wbGV0ZSIsImNhcGl0YWxpemVkRGltZW5zaW9uIiwic2Nyb2xsU2l6ZSIsInRyaWdnZXJBcnJheUxlbmd0aCIsInNlbGVjdGVkIiwidHJpZ2dlckFycmF5IiwiaXNPcGVuIiwic2VsZWN0b3JFbGVtZW50cyIsIkVTQ0FQRV9LRVkiLCJTUEFDRV9LRVkiLCJUQUJfS0VZIiwiQVJST1dfVVBfS0VZIiwiQVJST1dfRE9XTl9LRVkiLCJSSUdIVF9NT1VTRV9CVVRUT04iLCJSRUdFWFBfS0VZRE9XTiIsIkVWRU5UX0tFWURPV05fREFUQV9BUEkiLCJFVkVOVF9LRVlVUF9EQVRBX0FQSSIsIkNMQVNTX05BTUVfRFJPUFVQIiwiQ0xBU1NfTkFNRV9EUk9QRU5EIiwiQ0xBU1NfTkFNRV9EUk9QU1RBUlQiLCJDTEFTU19OQU1FX05BVkJBUiIsIlNFTEVDVE9SX01FTlUiLCJTRUxFQ1RPUl9OQVZCQVJfTkFWIiwiU0VMRUNUT1JfVklTSUJMRV9JVEVNUyIsIlBMQUNFTUVOVF9UT1AiLCJQTEFDRU1FTlRfVE9QRU5EIiwiUExBQ0VNRU5UX0JPVFRPTSIsIlBMQUNFTUVOVF9CT1RUT01FTkQiLCJQTEFDRU1FTlRfUklHSFQiLCJQTEFDRU1FTlRfTEVGVCIsImJvdW5kYXJ5IiwicmVmZXJlbmNlIiwiZGlzcGxheSIsInBvcHBlckNvbmZpZyIsImF1dG9DbG9zZSIsIkRyb3Bkb3duIiwiX3BvcHBlciIsIl9tZW51IiwiX2dldE1lbnVFbGVtZW50IiwiX2luTmF2YmFyIiwiX2RldGVjdE5hdmJhciIsInNob3dFdmVudCIsImdldFBhcmVudEZyb21FbGVtZW50IiwiX2NyZWF0ZVBvcHBlciIsImZvY3VzIiwiX2NvbXBsZXRlSGlkZSIsImRlc3Ryb3kiLCJ1cGRhdGUiLCJoaWRlRXZlbnQiLCJQb3BwZXIiLCJyZWZlcmVuY2VFbGVtZW50IiwiX2dldFBvcHBlckNvbmZpZyIsImlzRGlzcGxheVN0YXRpYyIsIm1vZGlmaWVycyIsIm1vZGlmaWVyIiwiZW5hYmxlZCIsImNyZWF0ZVBvcHBlciIsIl9nZXRQbGFjZW1lbnQiLCJwYXJlbnREcm9wZG93biIsImlzRW5kIiwiX2dldE9mZnNldCIsInBvcHBlckRhdGEiLCJkZWZhdWx0QnNQb3BwZXJDb25maWciLCJwbGFjZW1lbnQiLCJvcHRpb25zIiwiX3NlbGVjdE1lbnVJdGVtIiwiaXRlbXMiLCJjbGVhck1lbnVzIiwidG9nZ2xlcyIsImNvbnRleHQiLCJjb21wb3NlZFBhdGgiLCJpc01lbnVUYXJnZXQiLCJkYXRhQXBpS2V5ZG93bkhhbmRsZXIiLCJpc0FjdGl2ZSIsInN0b3BQcm9wYWdhdGlvbiIsImdldFRvZ2dsZUJ1dHRvbiIsIlNFTEVDVE9SX0ZJWEVEX0NPTlRFTlQiLCJTRUxFQ1RPUl9TVElDS1lfQ09OVEVOVCIsIlNjcm9sbEJhckhlbHBlciIsImdldFdpZHRoIiwiZG9jdW1lbnRXaWR0aCIsImNsaWVudFdpZHRoIiwiaW5uZXJXaWR0aCIsIndpZHRoIiwiX2Rpc2FibGVPdmVyRmxvdyIsIl9zZXRFbGVtZW50QXR0cmlidXRlcyIsImNhbGN1bGF0ZWRWYWx1ZSIsIl9zYXZlSW5pdGlhbEF0dHJpYnV0ZSIsIm92ZXJmbG93Iiwic3R5bGVQcm9wIiwic2Nyb2xsYmFyV2lkdGgiLCJtYW5pcHVsYXRpb25DYWxsQmFjayIsIl9hcHBseU1hbmlwdWxhdGlvbkNhbGxiYWNrIiwicmVzZXQiLCJfcmVzZXRFbGVtZW50QXR0cmlidXRlcyIsImFjdHVhbFZhbHVlIiwicmVtb3ZlUHJvcGVydHkiLCJjYWxsQmFjayIsImlzT3ZlcmZsb3dpbmciLCJjbGFzc05hbWUiLCJyb290RWxlbWVudCIsImNsaWNrQ2FsbGJhY2siLCJFVkVOVF9NT1VTRURPV04iLCJCYWNrZHJvcCIsIl9pc0FwcGVuZGVkIiwiX2FwcGVuZCIsIl9nZXRFbGVtZW50IiwiX2VtdWxhdGVBbmltYXRpb24iLCJiYWNrZHJvcCIsImNyZWF0ZUVsZW1lbnQiLCJhcHBlbmQiLCJ0cmFwRWxlbWVudCIsImF1dG9mb2N1cyIsIkVWRU5UX0ZPQ1VTSU4iLCJFVkVOVF9LRVlET1dOX1RBQiIsIlRBQl9OQVZfRk9SV0FSRCIsIlRBQl9OQVZfQkFDS1dBUkQiLCJGb2N1c1RyYXAiLCJfaXNBY3RpdmUiLCJfbGFzdFRhYk5hdkRpcmVjdGlvbiIsImFjdGl2YXRlIiwiX2hhbmRsZUZvY3VzaW4iLCJfaGFuZGxlS2V5ZG93biIsImRlYWN0aXZhdGUiLCJlbGVtZW50cyIsInNoaWZ0S2V5IiwiRVZFTlRfSElERV9QUkVWRU5URUQiLCJFVkVOVF9SRVNJWkUiLCJFVkVOVF9DTElDS19ESVNNSVNTIiwiRVZFTlRfS0VZRE9XTl9ESVNNSVNTIiwiRVZFTlRfTU9VU0VVUF9ESVNNSVNTIiwiRVZFTlRfTU9VU0VET1dOX0RJU01JU1MiLCJDTEFTU19OQU1FX09QRU4iLCJDTEFTU19OQU1FX1NUQVRJQyIsIk9QRU5fU0VMRUNUT1IiLCJTRUxFQ1RPUl9ESUFMT0ciLCJTRUxFQ1RPUl9NT0RBTF9CT0RZIiwiTW9kYWwiLCJfZGlhbG9nIiwiX2JhY2tkcm9wIiwiX2luaXRpYWxpemVCYWNrRHJvcCIsIl9mb2N1c3RyYXAiLCJfaW5pdGlhbGl6ZUZvY3VzVHJhcCIsIl9pZ25vcmVCYWNrZHJvcENsaWNrIiwiX3Njcm9sbEJhciIsIl9pc0FuaW1hdGVkIiwiX2FkanVzdERpYWxvZyIsIl9zZXRFc2NhcGVFdmVudCIsIl9zZXRSZXNpemVFdmVudCIsIl9zaG93QmFja2Ryb3AiLCJfc2hvd0VsZW1lbnQiLCJfaGlkZU1vZGFsIiwiaHRtbEVsZW1lbnQiLCJoYW5kbGVVcGRhdGUiLCJtb2RhbEJvZHkiLCJzY3JvbGxUb3AiLCJ0cmFuc2l0aW9uQ29tcGxldGUiLCJfdHJpZ2dlckJhY2tkcm9wVHJhbnNpdGlvbiIsIl9yZXNldEFkanVzdG1lbnRzIiwiY3VycmVudFRhcmdldCIsInNjcm9sbEhlaWdodCIsImlzTW9kYWxPdmVyZmxvd2luZyIsImNsaWVudEhlaWdodCIsIm92ZXJmbG93WSIsImlzQm9keU92ZXJmbG93aW5nIiwicGFkZGluZ0xlZnQiLCJwYWRkaW5nUmlnaHQiLCJhbGxSZWFkeU9wZW4iLCJzY3JvbGwiLCJDTEFTU19OQU1FX0JBQ0tEUk9QIiwiT2ZmY2FudmFzIiwidmlzaWJpbGl0eSIsImJsdXIiLCJjb21wbGV0ZUNhbGxiYWNrIiwidXJpQXR0cmlidXRlcyIsIkFSSUFfQVRUUklCVVRFX1BBVFRFUk4iLCJTQUZFX1VSTF9QQVRURVJOIiwiREFUQV9VUkxfUEFUVEVSTiIsImFsbG93ZWRBdHRyaWJ1dGUiLCJhdHRyaWJ1dGUiLCJhbGxvd2VkQXR0cmlidXRlTGlzdCIsImF0dHJpYnV0ZU5hbWUiLCJub2RlTmFtZSIsIm5vZGVWYWx1ZSIsInJlZ0V4cCIsImF0dHJpYnV0ZVJlZ2V4IiwiRGVmYXVsdEFsbG93bGlzdCIsImEiLCJhcmVhIiwiYiIsImJyIiwiY29sIiwiY29kZSIsImRpdiIsImVtIiwiaHIiLCJoMSIsImgyIiwiaDMiLCJoNCIsImg1IiwiaDYiLCJpbWciLCJsaSIsIm9sIiwicCIsInByZSIsInMiLCJzbWFsbCIsInNwYW4iLCJzdWIiLCJzdXAiLCJzdHJvbmciLCJ1IiwidWwiLCJzYW5pdGl6ZUh0bWwiLCJ1bnNhZmVIdG1sIiwiYWxsb3dMaXN0Iiwic2FuaXRpemVGbiIsImRvbVBhcnNlciIsIkRPTVBhcnNlciIsImNyZWF0ZWREb2N1bWVudCIsInBhcnNlRnJvbVN0cmluZyIsImVsZW1lbnROYW1lIiwiYXR0cmlidXRlTGlzdCIsImFsbG93ZWRBdHRyaWJ1dGVzIiwiaW5uZXJIVE1MIiwiQ0xBU1NfUFJFRklYIiwiRElTQUxMT1dFRF9BVFRSSUJVVEVTIiwiYW5pbWF0aW9uIiwidGVtcGxhdGUiLCJ0aXRsZSIsImRlbGF5IiwiaHRtbCIsImZhbGxiYWNrUGxhY2VtZW50cyIsImN1c3RvbUNsYXNzIiwic2FuaXRpemUiLCJBdHRhY2htZW50TWFwIiwiQVVUTyIsIlRPUCIsIlJJR0hUIiwiQk9UVE9NIiwiTEVGVCIsIkhJREUiLCJISURERU4iLCJTSE9XIiwiU0hPV04iLCJJTlNFUlRFRCIsIkNMSUNLIiwiRk9DVVNJTiIsIkZPQ1VTT1VUIiwiTU9VU0VFTlRFUiIsIk1PVVNFTEVBVkUiLCJDTEFTU19OQU1FX01PREFMIiwiSE9WRVJfU1RBVEVfU0hPVyIsIkhPVkVSX1NUQVRFX09VVCIsIlNFTEVDVE9SX1RPT0xUSVBfSU5ORVIiLCJTRUxFQ1RPUl9NT0RBTCIsIkVWRU5UX01PREFMX0hJREUiLCJUUklHR0VSX0hPVkVSIiwiVFJJR0dFUl9GT0NVUyIsIlRSSUdHRVJfQ0xJQ0siLCJUUklHR0VSX01BTlVBTCIsIlRvb2x0aXAiLCJfaXNFbmFibGVkIiwiX3RpbWVvdXQiLCJfaG92ZXJTdGF0ZSIsIl9hY3RpdmVUcmlnZ2VyIiwidGlwIiwiX3NldExpc3RlbmVycyIsImVuYWJsZSIsImRpc2FibGUiLCJ0b2dnbGVFbmFibGVkIiwiX2luaXRpYWxpemVPbkRlbGVnYXRlZFRhcmdldCIsImNsaWNrIiwiX2lzV2l0aEFjdGl2ZVRyaWdnZXIiLCJfZW50ZXIiLCJfbGVhdmUiLCJnZXRUaXBFbGVtZW50IiwiX2hpZGVNb2RhbEhhbmRsZXIiLCJfZGlzcG9zZVBvcHBlciIsImlzV2l0aENvbnRlbnQiLCJzaGFkb3dSb290IiwiaXNJblRoZURvbSIsIm93bmVyRG9jdW1lbnQiLCJnZXRUaXRsZSIsInRpcElkIiwiYXR0YWNobWVudCIsIl9nZXRBdHRhY2htZW50IiwiX2FkZEF0dGFjaG1lbnRDbGFzcyIsIl9yZXNvbHZlUG9zc2libGVGdW5jdGlvbiIsInByZXZIb3ZlclN0YXRlIiwiX2NsZWFuVGlwQ2xhc3MiLCJzZXRDb250ZW50IiwiX3Nhbml0aXplQW5kU2V0Q29udGVudCIsImNvbnRlbnQiLCJ0ZW1wbGF0ZUVsZW1lbnQiLCJzZXRFbGVtZW50Q29udGVudCIsInRleHRDb250ZW50IiwidXBkYXRlQXR0YWNobWVudCIsIl9nZXREZWxlZ2F0ZUNvbmZpZyIsInBoYXNlIiwiX2hhbmRsZVBvcHBlclBsYWNlbWVudENoYW5nZSIsIm9uRmlyc3RVcGRhdGUiLCJfZ2V0QmFzaWNDbGFzc1ByZWZpeCIsInRyaWdnZXJzIiwiZXZlbnRJbiIsImV2ZW50T3V0IiwiX2ZpeFRpdGxlIiwib3JpZ2luYWxUaXRsZVR5cGUiLCJkYXRhQXR0cmlidXRlcyIsImRhdGFBdHRyIiwiYmFzaWNDbGFzc1ByZWZpeFJlZ2V4IiwidGFiQ2xhc3MiLCJ0b2tlbiIsInRDbGFzcyIsInN0YXRlIiwicG9wcGVyIiwiU0VMRUNUT1JfVElUTEUiLCJTRUxFQ1RPUl9DT05URU5UIiwiUG9wb3ZlciIsIl9nZXRDb250ZW50IiwiRVZFTlRfQUNUSVZBVEUiLCJFVkVOVF9TQ1JPTEwiLCJDTEFTU19OQU1FX0RST1BET1dOX0lURU0iLCJTRUxFQ1RPUl9EQVRBX1NQWSIsIlNFTEVDVE9SX05BVl9MSVNUX0dST1VQIiwiU0VMRUNUT1JfTkFWX0xJTktTIiwiU0VMRUNUT1JfTkFWX0lURU1TIiwiU0VMRUNUT1JfTElTVF9JVEVNUyIsIlNFTEVDVE9SX0xJTktfSVRFTVMiLCJTRUxFQ1RPUl9EUk9QRE9XTiIsIlNFTEVDVE9SX0RST1BET1dOX1RPR0dMRSIsIk1FVEhPRF9PRkZTRVQiLCJNRVRIT0RfUE9TSVRJT04iLCJTY3JvbGxTcHkiLCJfc2Nyb2xsRWxlbWVudCIsIl9vZmZzZXRzIiwiX3RhcmdldHMiLCJfYWN0aXZlVGFyZ2V0IiwiX3Njcm9sbEhlaWdodCIsIl9wcm9jZXNzIiwicmVmcmVzaCIsImF1dG9NZXRob2QiLCJvZmZzZXRNZXRob2QiLCJvZmZzZXRCYXNlIiwiX2dldFNjcm9sbFRvcCIsIl9nZXRTY3JvbGxIZWlnaHQiLCJ0YXJnZXRzIiwidGFyZ2V0U2VsZWN0b3IiLCJ0YXJnZXRCQ1IiLCJoZWlnaHQiLCJpdGVtIiwic29ydCIsIl9nZXRPZmZzZXRIZWlnaHQiLCJpbm5lckhlaWdodCIsIm1heFNjcm9sbCIsIl9hY3RpdmF0ZSIsIl9jbGVhciIsImlzQWN0aXZlVGFyZ2V0IiwicXVlcmllcyIsImxpbmsiLCJsaXN0R3JvdXAiLCJuYXZJdGVtIiwibm9kZSIsInNweSIsIkNMQVNTX05BTUVfRFJPUERPV05fTUVOVSIsIlNFTEVDVE9SX0FDVElWRV9VTCIsIlNFTEVDVE9SX0RST1BET1dOX0FDVElWRV9DSElMRCIsIlRhYiIsImxpc3RFbGVtZW50IiwiaXRlbVNlbGVjdG9yIiwiYWN0aXZlRWxlbWVudHMiLCJhY3RpdmUiLCJpc1RyYW5zaXRpb25pbmciLCJfdHJhbnNpdGlvbkNvbXBsZXRlIiwiZHJvcGRvd25DaGlsZCIsImRyb3Bkb3duRWxlbWVudCIsImRyb3Bkb3duIiwiRVZFTlRfTU9VU0VPVkVSIiwiRVZFTlRfTU9VU0VPVVQiLCJFVkVOVF9GT0NVU09VVCIsIkNMQVNTX05BTUVfSElERSIsIkNMQVNTX05BTUVfU0hPV0lORyIsImF1dG9oaWRlIiwiVG9hc3QiLCJfaGFzTW91c2VJbnRlcmFjdGlvbiIsIl9oYXNLZXlib2FyZEludGVyYWN0aW9uIiwiX2NsZWFyVGltZW91dCIsIl9tYXliZVNjaGVkdWxlSGlkZSIsIl9vbkludGVyYWN0aW9uIiwiaXNJbnRlcmFjdGluZyJdLCJzb3VyY2VSb290IjoiIn0=