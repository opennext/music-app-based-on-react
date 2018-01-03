'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));

var Constant$1 = {
  DIRECTION: {
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down'
  },
  DEFAULT: {
    DISTANCE_CALCULATION_STRATEGY: 'default'
  }
};

var instance = null;
var getNearestFocusableFinderInstance = function getNearestFocusableFinderInstance() {
  if (instance === null) {
    instance = createNearestFocusableFinder();
  }
  return instance;
};

var strategies = {};

var currentDistanceCalculationStrategy = Constant$1.DEFAULT.DISTANCE_CALCULATION_STRATEGY;

strategies[Constant$1.DEFAULT.DISTANCE_CALCULATION_STRATEGY] = function () {
  var OPPOSITE_DIRECTION = {
    left: 'right',
    right: 'left',
    up: 'down',
    down: 'up'
  };

  function getMiddlePointOnTheEdge(position, direction) {
    var point = {
      x: position.left,
      y: position.top
    };

    switch (direction) {
      case Constant$1.DIRECTION.RIGHT:
        // when direction is right or left
        point.x += position.width;
      case Constant$1.DIRECTION.LEFT:
        point.y += position.height / 2;
        break;
      case Constant$1.DIRECTION.DOWN:
        // when direction is down or up
        point.y += position.height;
      case Constant$1.DIRECTION.UP:
        point.x += position.width / 2;
        break;
    }
    return point;
  }

  function isCorrespondingDirection(fromPoint, toPoint, direction) {
    switch (direction) {
      case Constant$1.DIRECTION.LEFT:
        return fromPoint.x >= toPoint.x;
      case Constant$1.DIRECTION.RIGHT:
        return fromPoint.x <= toPoint.x;
      case Constant$1.DIRECTION.UP:
        return fromPoint.y >= toPoint.y;
      case Constant$1.DIRECTION.DOWN:
        return fromPoint.y <= toPoint.y;
    }

    return false;
  }

  return function (from, to, direction) {
    var fromPoint = getMiddlePointOnTheEdge(from, direction);
    var toPoint = getMiddlePointOnTheEdge(to, OPPOSITE_DIRECTION[direction]);

    if (isCorrespondingDirection(fromPoint, toPoint, direction)) {
      return Math.sqrt(Math.pow(fromPoint.x - toPoint.x, 2) + Math.pow(fromPoint.y - toPoint.y, 2));
    }

    return Infinity;
  };
}();

var createNearestFocusableFinder = function createNearestFocusableFinder() {
  var focusableElements = {};
  var nearestFocusableFinder = {
    getInitial: function getInitial(depth, group) {
      var initial = void 0;
      return initial;
    },
    getNearest: function getNearest(target, direction) {
      var distance,
          bestMatch,
          bestDistance = Infinity;
      var targetPosition, neighborPosition;
      targetPosition = getPosition(target);

      Object.keys(focusableElements).forEach(function (name) {
        var focusable = focusableElements[name];
        neighborPosition = getPosition(focusable);
        distance = strategies[currentDistanceCalculationStrategy](targetPosition, neighborPosition, direction);

        if (distance < bestDistance) {
          bestMatch = focusable;
          bestDistance = distance;
        }
      });
      return bestMatch;
    },
    $$put: function $$put(element, name) {
      focusableElements[name] = element;
    },
    $$get: function $$get(name) {
      return focusableElements[name];
    },
    $$remove: function $$remove(target) {}
  };
  return nearestFocusableFinder;
};

function getWindow(elem) {
  return elem != null && elem === elem.window ? elem : elem.nodeType === 9 && elem.defaultView;
}

var offsetPosition = function offsetPosition(elem) {
  var docElem,
      win,
      box = { top: 0, left: 0 },
      doc = elem && elem.ownerDocument;
  if (!doc) {
    return;
  }
  docElem = doc.documentElement;
  box = elem.getBoundingClientRect();
  win = getWindow(doc);
  return {
    top: box.top + win.pageYOffset - docElem.clientTop,
    left: box.left + win.pageXOffset - docElem.clientLeft
  };
};

var getPosition = function getPosition(target) {
  var focusableDOM = target.focusableDOM; //ReactDOM.findDOMNode(target);
  var offset = offsetPosition(focusableDOM);
  return {
    left: offset.left,
    top: offset.top,
    width: focusableDOM.offsetWidth,
    height: focusableDOM.offsetHeight
  };
};

var nearestFocusableFinder = getNearestFocusableFinderInstance();

var Constant = {
  DIRECTION: {
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down'
  },
  DEFAULT: {
    DEPTH: 0,
    GROUP: 'default',
    KEY_MAP: {
      LEFT: 37,
      RIGHT: 39,
      UP: 38,
      DOWN: 40,
      ENTER: 13 //,
      //DISTANCE_CALCULATION_STRATEGY: 'default'
    } },
  FOCUS_STATE: {
    BLURRED: 0,
    FOCUSED: 1,
    SELECTED: 2,
    DISABLED: 3
  },
  CLASS_NAMES: ['blurred', 'focused', 'selected', 'disabled']
};

var currentKeyMap = Constant.DEFAULT.KEY_MAP;
var currentFocusItem = void 0;

var controllerInstance = null;

var getControllerInstance = function getControllerInstance() {
  if (controllerInstance === null) {
    controllerInstance = createController();
  }
  return controllerInstance;
};

var createController = function createController() {
  var controller = {
    getCurrentDepth: function getCurrentDepth() {
      return;
    },
    getCurrentFocusItem: function getCurrentFocusItem() {
      return;
    },
    focus: function focus(item, originalEvent) {
      focusItem(item, originalEvent);
    },
    blur: function blur(item, originalEvent) {
      blurItem(item, originalEvent);
    },
    select: function select(item, originalEvent) {},
    enable: function enable(item) {},
    disable: function disable(item) {}
  };

  document.onkeydown = function (event) {
    var keyCode = event.keyCode || event.which || event.charCode;
    var nextFocusItem;
    switch (keyCode) {
      case currentKeyMap.LEFT:
        nextFocusItem = getNextFocusItem(Constant.DIRECTION.LEFT);
        break;
      case currentKeyMap.RIGHT:
        nextFocusItem = getNextFocusItem(Constant.DIRECTION.RIGHT);
        break;
      case currentKeyMap.UP:
        nextFocusItem = getNextFocusItem(Constant.DIRECTION.UP);
        break;
      case currentKeyMap.DOWN:
        nextFocusItem = getNextFocusItem(Constant.DIRECTION.DOWN);
        break;
      case currentKeyMap.ENTER:
        selectItem(currentFocusItem, event);
        break;
    }

    if (nextFocusItem) {
      blurItem(currentFocusItem, event);
      setCurrentFocusItem(nextFocusItem, event);
    }
  };
  return controller;
};

function blurItem(item, originalEvent) {
  if (item) {
    item.setState({
      focusState: Constant.FOCUS_STATE.BLURRED
    });
    item.props.onBlurred && item.props.onBlurred();
    
  }
}

function focusItem(item, originalEvent) {
  if (item) {
    item.setState({
      focusState: Constant.FOCUS_STATE.FOCUSED
    });
    item.props.onFocused && item.props.onFocused();
    
  }
}

function selectItem(item, originalEvent) {
  if (item) {
    item.setState({
      focusState: Constant.FOCUS_STATE.SELECTED
    });
    item.props.onSelected && item.props.onSelected();
    item.setState({
      focusState: Constant.FOCUS_STATE.FOCUSED
    });
  }
}

var setCurrentFocusItem = function setCurrentFocusItem(item, event) {
  focusItem(currentFocusItem = item, event);
};

var getNextFocusItem = function getNextFocusItem(direction) {
  var nextFocusItemName;

  if (currentFocusItem) {
    nextFocusItemName = undefined; //TODO Util.getData(currentFocusItem).nextFocus[direction];
    if (nextFocusItemName === undefined) {
      return nearestFocusableFinder.getNearest(currentFocusItem, direction);
    }
  }
};

var controller = getControllerInstance();

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Focusable = function (_Component) {
  inherits(Focusable, _Component);

  function Focusable(props) {
    classCallCheck(this, Focusable);

    var _this = possibleConstructorReturn(this, (Focusable.__proto__ || Object.getPrototypeOf(Focusable)).call(this, props));

    _this.state = {
      focusState: Constant.FOCUS_STATE.BLURRED
    };
    return _this;
  }

  createClass(Focusable, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      //if (!nearestFocusableFinder.$$get(Util.getData(this).name)) {
      nearestFocusableFinder.$$put(this, this.props.name);
      //}
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.initialFocus === true && setCurrentFocusItem(this);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return React__default.createElement(
        'div',
        { ref: function ref(div) {
            _this2.focusableDOM = div;
          },
          className: this.props.className + ' ' + Constant.CLASS_NAMES[this.state.focusState] },
        this.props.contentEditable ? null : this.props.children
      );
    }
  }]);
  return Focusable;
}(React.Component);

Focusable.defaultProps = {
  initialFocus: false
};

Focusable.propTypes = {
  initialFocus: PropTypes.bool,
  onBlurred: PropTypes.func,
  onFocused: PropTypes.func,
  onSelected: PropTypes.func,
  className: PropTypes.string
};

/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}

//import focus from './focus/focus'
/*
 * This is a dummy function to check if the function name has been altered by minification.
 * If the function has been minified and NODE_ENV !== 'production', warn the user.
 */
function isCrushed() {}

if ("development" !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  warning('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of react-tv. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}

exports.Focusable = Focusable;
