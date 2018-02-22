(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('https://d3js.org/d3.v4.min')) :
	typeof define === 'function' && define.amd ? define(['https://d3js.org/d3.v4.min'], factory) :
	(global.jelly = factory(global.d3));
}(this, (function (d3) { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











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







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

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

var classPrefix = "jellychart";
var magicTableColorScheme = ['#50C3F7 ', '#7986CB ', '#BA68C8 ', '#F06292 ', '#FF8A65 ', '#FFD54F ', '#AED581 ', '#4CB6AC ', '#2C82A9 ', '#48528A ', '#803E8C ', '#A6365B ', '#CF6644 ', '#C1A039 ', '#749350 ', '#32827A '];
var labelFormat = function () {
  var integerFormat = d3.format(',');
  var plusIntegerFormat = d3.format('+,');
  var floatFormat = d3.format(',.2f');
  var plusFloatFormat = d3.format('+,.2f');
  return function (value) {
    var plus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (isNaN(value)) return value;else if (typeof value === 'string') value = +value;
    return (Number.isInteger(value) ? plus ? plusIntegerFormat : integerFormat : plus ? plusFloatFormat : floatFormat)(value);
  };
}();

function className(name) {
  var selectorMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : classPrefix;

  var names = name.split(' ').map(function (d) {
    return prefix + '-' + d;
  });
  if (selectorMode) return '.' + names.join('.');else return names.join(' ');
}

function rebindOnMethod(instance, listeners) {
  if (instance.on && typeof instance.on === 'function') {
    var oldOn = instance.on;
    instance.on = function () {
      var value = void 0;
      try {
        value = oldOn.apply(instance, arguments);
      } catch (e) {
        value = listeners.on.apply(listeners, arguments);
      }
      return value;
    };
  } else {
    instance.on = function () {
      var value = listeners.on.apply(listeners, arguments);
      return value === listeners ? instance : value;
    };
  }
  return instance;
}

function safari() {
  try {
    return (/constructor/i.test(window.HTMLElement) || function (p) {
        return p.toString() === "[object SafariRemoteNotification]";
      }(!window['safari'] || safari.pushNotification)
    );
  } catch (e) {
    return false;
  }
}

function attrFunc(attr) {
  return function (value) {
    if (!arguments.length) return this.__attrs__[attr];
    this.__attrs__[attr] = value;
    return this;
  };
}

function setAttrs(self, attrs) {
  if (!self.__attrs__) self.__attrs__ = {};
  attrs = JSON.parse(JSON.stringify(attrs));
  for (var attr in attrs) {
    if (attrs.hasOwnProperty(attr)) {
      self.__attrs__[attr] = attrs[attr];
    }
  }
}

function setMethodsFromAttrs(classFunc, attrs) {
  for (var attr in attrs) {
    if (attrs.hasOwnProperty(attr) && !classFunc.prototype[attr]) {
      classFunc.prototype[attr] = attrFunc(attr);
    }
  }
}

function setMethodFromDefaultObj(attr) {
  var defaultSetting = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return function (value) {
    if (!arguments.length) return this.__attrs__[attr];else if (typeof value === 'boolean') {
      if (value) value = defaultSetting;
    } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
      for (var k in defaultSetting) {
        if (defaultSetting.hasOwnProperty(k)) {
          if (!(k in value)) value[k] = defaultSetting[k];
        }
      }
    }
    this.__attrs__[attr] = value;
    return this;
  };
}

function uniqueId(_id) {
  return d3.select('body').selectAll('#' + _id).empty();
}

function getUniqueId(prefix) {
  var num = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var _id = prefix + num;
  while (!uniqueId(_id)) {
    num++;
    _id = prefix + num;
  }
  return _id;
}

function zeroPoint(domain) {
  return domain[0] * domain[domain.length - 1] < 0; //assume that domain is sorted
}

function mix(parent) {
  return new MixinBuilder(parent);
}

var MixinBuilder = function () {
  function MixinBuilder(parent) {
    classCallCheck(this, MixinBuilder);

    this.parent = parent;
  }

  createClass(MixinBuilder, [{
    key: 'with',
    value: function _with() {
      for (var _len = arguments.length, mixins = Array(_len), _key = 0; _key < _len; _key++) {
        mixins[_key] = arguments[_key];
      }

      return mixins.reduce(function (cur, mixin) {
        return mixin(cur);
      }, this.parent);
    }
  }]);
  return MixinBuilder;
}();

function genFunc(ClassFunc) {
  var func = function func() {
    return new ClassFunc();
  };
  func.__class__ = ClassFunc;
  return func;
}

var interval = {
  millisecond: d3.timeMillisecond,
  second: d3.timeSecond,
  minute: d3.timeMinute,
  hour: d3.timeHour,
  day: d3.timeDay,
  week: d3.timeWeek,
  sunday: d3.timeSunday,
  monday: d3.timeMonday,
  tuesday: d3.timeTuesday,
  wednesday: d3.timeWednesday,
  thursday: d3.timeThursday,
  friday: d3.timeFriday,
  saturday: d3.timeSaturday,
  month: d3.timeMonth,
  year: d3.timeYear,
  utcMillisecond: d3.utcMillisecond,
  utcSecond: d3.utcSecond,
  utcMinute: d3.utcMinute,
  utcHour: d3.utcHour,
  utcDay: d3.utcDay,
  utcWeek: d3.utcWeek,
  utcSunday: d3.utcSunday,
  utcMonday: d3.utcMonday,
  utcTuesday: d3.utcTuesday,
  utcWednesday: d3.utcWednesday,
  utcThursday: d3.utcThursday,
  utcFriday: d3.utcFriday,
  utcSaturday: d3.utcSaturday,
  utcMonth: d3.utcMonth,
  utcYear: d3.utcYear
};

function NotAvailableSelectorError(selector) {
  this.message = selector + 'is not availabele to select';
  this.name = 'NotAvailableSelectorError';
}

function ConditionException() {
  var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Unacceptable condtion';

  this.message = message;
  this.name = 'ConditionException';
}

function ZeroDenominatorException() {
  var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Zero in the Denominator of a Fraction';

  this.message = message;
  this.name = 'ZeroDenominator';
}

var summarize = { sum: d3.sum, mean: d3.mean, variance: d3.variance, min: d3.min, max: d3.max, median: d3.median, extent: d3.extent };
summarize.values = function (leaves) {
  return leaves;
};
summarize.count = function (leaves) {
  return leaves.length;
};

function dateComparator() {
  var order = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ascending';
  var field = arguments[1];

  return function (a, b) {
    if (field) {
      a = a[field];b = b[field];
    }
    if (order === 'natural') return 0;else if (order === 'ascending') return a.getTime() - b.getTime();else return b.getTime() - a.getTime();
  };
}

function comparator() {
  var order = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ascending';
  var orderList = arguments[1];
  var textToNum = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var accessor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (d) {
    return d;
  };

  var reg = /(\d+((-|\.)*\d*))/;
  function __compareNumbers(a, b) {
    if (order === 'natural') return 0;else if (order === 'ascending') return a - b;else return b - a;
  }
  function __compareStrings(a, b) {
    var onlyText = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (order === 'natural') return 0;
    if (textToNum && !onlyText) {
      var numA = a.match(reg),
          numB = b.match(reg);
      if (numA && numB) {
        return __compareNumbers(+numA[0], +numB[0]) || __compareStrings(a, b, true);
      }
    }
    if (order === 'ascending') return a.localeCompare(b);
    return b.localeCompare(a);
  }
  function __compareByList(a, b) {
    var findFunc = function findFunc(t) {
      return function (d) {
        if (t instanceof Date && d instanceof Date) return t - d === 0;else return d === t;
      };
    };
    var ai = orderList.findIndex(findFunc(a));
    var bi = orderList.findIndex(findFunc(b));
    if (order === 'descending') return bi - ai;else return ai - bi;
  }
  return function (a, b) {
    var compareFunc = void 0;
    if (!orderList || orderList.length === 0) {
      compareFunc = typeof a === 'string' && typeof b === 'string' ? __compareStrings : __compareNumbers;
    } else {
      compareFunc = __compareByList;
    }
    return compareFunc(accessor(a), accessor(b));
  };
}

function leastSquare(target) {
  var xField = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'x';
  var yField = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'y';

  var length = target.length;
  var lengthRev = 1.0 / length;
  var xBar = d3.sum(target, function (d) {
    return d[xField];
  }) * lengthRev;
  var yBar = d3.sum(target, function (d) {
    return d[yField];
  }) * lengthRev;
  var ssXX = d3.sum(target.map(function (d) {
    return Math.pow(d[xField] - xBar, 2);
  }));
  var ssYY = d3.sum(target.map(function (d) {
    return Math.pow(d[yField] - yBar, 2);
  }));
  var ssXY = d3.sum(target.map(function (d) {
    return (d[xField] - xBar) * (d[yField] - yBar);
  }));
  var slope = ssXY / ssXX;
  var intercept = yBar - xBar * slope;
  var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);
  return { slope: slope, intercept: intercept, rSquare: rSquare };
}

function stack(target, measures) {
  var normalized = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (!Array.isArray(measures)) measures = [measures];
  target.forEach(function (d, i, arr) {
    measures.forEach(function (m) {
      var prefix = m.valueName();
      if (i === 0) d.data.value[prefix + '-start'] = 0;else d.data.value[prefix + '-start'] = arr[i - 1].data.value[prefix + '-end'];
      d.data.value[prefix + '-end'] = d.data.value[prefix + '-start'] + d.data.value[prefix];
    });
  });
  if (normalized) {
    var _max = {};
    var lastVal = target[target.length - 1].data.value; // need to be sorted.
    measures.forEach(function (m) {
      var prefix = m.valueName();
      _max[prefix] = lastVal[prefix + '-end'];
    });
    target.forEach(function (d) {
      measures.forEach(function (m) {
        var prefix = m.valueName();
        var thisMax = _max[prefix];
        if (thisMax !== 0) {
          d.data.value[prefix + '-start'] = d.data.value[prefix + '-start'] / thisMax;
          d.data.value[prefix + '-end'] = d.data.value[prefix + '-end'] / thisMax;
        } else {
          throw new ZeroDenominatorException();
        }
      });
    });
  }
}

function continousScale(domain) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'linear';
  var field = arguments[2];

  var isTime = type === 'time' || false;
  if (!isTime) {
    isTime = true;
    for (var i = 0; i < domain.length; i++) {
      var d = domain[i];
      if (!(d instanceof Date)) {
        isTime = false;
        break;
      }
    }
  }
  var scale = void 0;
  if (isTime) {
    scale = d3.scaleTime();
    type = 'time';
  } else {
    if (type === 'pow') scale = d3.scalePow();else if (type === 'log') scale = d3.scaleLog();else {
      scale = d3.scaleLinear();
      type = 'linear';
    }
  }
  scale._scaleType = type;
  scale._field = field;
  return scale.domain(domain);
}

function dimension(dim, nested) {
  if (dim.interval) {
    // if has interval, transform key using d3Interval
    var intr = interval[dim.interval];
    nested.key(function (d) {
      return intr(d[dim.field]);
    });
  } else if (dim.format) {
    var f = dim.format;
    nested.key(function (d) {
      return f(d[dim.field]);
    });
  } else {
    nested.key(function (d) {
      return d[dim.field];
    });
  }
  if (dim.order === 'ascending' || dim.order === 'descending') {
    nested.sortKeys(comparator(dim.order, dim.orderList));
  }
  return nested;
}

function dateKey(result, reverse, preFormat) {
  var dimensions = this.dimensions();
  var currentLevel = result;

  var _loop = function _loop(i) {
    var dim = reverse ? dimensions[dimensions.length - 1 - i] : dimensions[i];
    if (dim.interval) {
      currentLevel.forEach(function (d) {
        d.key = new Date(d.key);
      });
      currentLevel.sort(dateComparator(dim.order, 'key'));
      if (preFormat && dim.format) {
        //preformatting : treemap
        currentLevel.forEach(function (d) {
          d.key = dim.format(d.key);
        });
      }
    }
    if (i < dimensions.length - 1) currentLevel = d3.merge(result.map(function (d) {
      return d.values;
    }));
  };

  for (var i = 0; i < dimensions.length; i++) {
    _loop(i);
  }
  return result;
}

/**
 * nest and hierarchy dataset
 * @private
 * @memberOf Core#
 * @param {boolean} reverse=false aggregates in reverse order of dimensions
 * @param {boolean} rollup=true summaraizes values of leaves
 * @param {boolean} preFormat=false formats keys.
 * @param {boolean} useHierarchy=true use d3.hierarchy before returning the result
 * @param {boolean} sum=true sums values of children
 * @return {hierarchy}
 */
function aggregate() {
  var reverse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var rollup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var preFormat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var useHierarchy = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var sum$$1 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

  var data = this.data();
  var dimensions = this.dimensions();
  var measures = this.measures();
  var nested = d3.nest();
  for (var i = 0; i < dimensions.length; i++) {
    var _dim = reverse ? dimensions[dimensions.length - 1 - i] : dimensions[i];
    dimension(_dim, nested);
  }
  if (!rollup) {
    var _result = dateKey.call(this, nested.entries(data), reverse, preFormat);
    return useHierarchy ? d3.hierarchy({ values: _result }, function (d) {
      return d.values;
    }).children : _result;
  }
  nested.rollup(function (values) {
    var result = {};
    measures.forEach(function (m) {
      result[m.field + '-' + m.op] = summarize[m.op](values, function (d) {
        return d[m.field];
      }); //name => field + op
    });
    return result;
  });
  var result = nested.entries(data);
  dateKey.call(this, result, reverse, preFormat);

  if (useHierarchy) {
    var root = d3.hierarchy({ values: result }, function (d) {
      return d.values;
    });
    if (sum$$1 && measures.length === 1) {
      var m = measures[0];
      root.sum(function (d) {
        return d.value ? d.value[m.field + '-' + m.op] : 0;
      });
    }
    return root.children;
  } else {
    return result;
  }
}

var attrs$1 = {
  customDomain: null,
  level: 0, //level in hierarchy
  munged: null, //nested data
  target: null, //x|y|region
  format: null, //string|number|date|mixed
  field: null //fieldname
};

var Field = function () {
  function Field(field) {
    classCallCheck(this, Field);

    setAttrs(this, attrs$1);
    this.__execs__ = {};
    this.setInit(field, ['field', 'format', 'customDomain']);
  }

  createClass(Field, [{
    key: 'setInit',
    value: function setInit(source) {
      var _this = this;

      var attrNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      if (source) {
        attrNames.forEach(function (n) {
          if (source[n]) _this[n](source[n]);
        });
      }
      return this;
    }
  }, {
    key: 'axis',
    value: function axis(at) {
      if (!arguments) return this.__execs__.axis;
      if (at && (typeof at === 'undefined' ? 'undefined' : _typeof(at)) === 'object') {
        if (at !== this.__execs__.axis) this.__execs__.axis = at;
        at.field = this.mixed ? this.concatFields() : this.field();
        at.tickFormat = this.format();
      }
      return this;
    }
  }, {
    key: 'toObject',
    value: function toObject() {
      return { field: this.field(), format: this.format(), customDomain: this.customDomain() };
    }
  }]);
  return Field;
}();

setMethodsFromAttrs(Field, attrs$1);

var countMeasureTitle = ' ';
var countMeasure = { field: '__--jelly_count_measure--__', op: 'count' };
var mixedMeasure = { field: '__--jelly_mixed_measure--__', op: 'mean' };

var attrs = {
  aggregated: false, //already aggregated
  op: 'mean',
  mixed: false,
  measures: [] //when mixed, get measures
};

var MeasureField = function (_Field) {
  inherits(MeasureField, _Field);

  function MeasureField(measure) {
    classCallCheck(this, MeasureField);

    var _this = possibleConstructorReturn(this, (MeasureField.__proto__ || Object.getPrototypeOf(MeasureField)).call(this, measure));

    setAttrs(_this, attrs);
    _this.setInit(measure, ['op']);
    return _this;
  }

  createClass(MeasureField, [{
    key: 'domain',
    value: function domain() {
      var padding = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var stacked = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var allowMono = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var level = this.level();
      var munged = this.munged();

      var curLevel = 0;
      var domain = [];
      var field = this.valueName();
      function _value(target, curLevel) {
        target.forEach(function (d) {
          if (curLevel < level) {
            _value(d.children, curLevel + 1);
          } else {
            if (stacked) {
              domain.push(d.data.value[field + '-start']);
              domain.push(d.data.value[field + '-end']);
            } else {
              domain.push(d.data.value[field]);
            }
          }
        });
      }
      _value(munged, curLevel);
      domain = d3.extent(domain);
      if (domain[0] === domain[1] && !allowMono) {
        //when min and mix is the same
        var offset = domain[0] * 0.2;
        domain[0] -= offset;
        domain[1] += offset;
      }

      if (padding <= 0) return domain;
      var dist = Math.abs(domain[0] - domain[1]);
      dist *= padding * 0.5;
      return [domain[0] - dist, domain[1] + dist];
    }
  }, {
    key: 'concatFields',
    value: function concatFields() {
      if (this.mixed()) {
        if (this.measures().length > 0) return this.measures().map(function (d) {
          return d.field;
        }).join('-');else return '';
      } else if (this.field() === mixedMeasure.field) return '';else return this.field();
    }
  }, {
    key: 'valueName',
    value: function valueName() {
      var fieldName = this.field();
      return fieldName + (this.mixed() || fieldName === mixedMeasure.field && this.aggregated() ? '' : '-' + this.op());
    }
  }, {
    key: 'toObject',
    value: function toObject() {
      var def = get(MeasureField.prototype.__proto__ || Object.getPrototypeOf(MeasureField.prototype), 'toObject', this).call(this);
      def.op = this.op();
      return def;
    }
  }]);
  return MeasureField;
}(Field);

function measureField(measure) {
  return new MeasureField(measure);
}

setMethodsFromAttrs(MeasureField, attrs);

/**
 * aggregate data which have N-measures (used in Bar and Line only)
 * @private
 * @memberOf Core#
 * @param {boolean} reverse=false
 * @param {boolean} useHierarchy=true
 * @param {boolean} sum=true
 * @return {hierarchy}
 */
function aggregateMixed() {
  var reverse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var useHierarchy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var sum$$1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var data = this.data();
  var dimensions = this.dimensions();
  var measures = this.measures();
  var results = void 0;
  if (dimensions.length === 0) {
    results = measures.map(function (m) {
      var value = summarize[m.op](data, function (d) {
        return d[m.field];
      });
      var result = {};
      result.key = m.field; //result[mixedDimension.field] = m.field;
      result.value = {};
      result.value[mixedMeasure.field] = value;
      return result;
    });
  } else {
    results = this.aggregate(data, true, false, false);
    if (reverse) {
      results = measures.map(function (m) {
        var result = {};
        result.key = m.field;
        result.values = results.map(function (d) {
          var result = {};
          result.key = d.key;
          result.value = {};
          result.value[mixedMeasure.field] = d.value[m.field + '-' + m.op];
          return result;
        });
        return result;
      });
    } else {
      results.forEach(function (d) {
        d.values = measures.map(function (m) {
          var result = {};
          result.key = m.field;
          result.value = {};
          result.value[mixedMeasure.field] = d.value[m.field + '-' + m.op];
          return result;
        });
        delete d.value;
      });
    }
  }

  if (useHierarchy) {
    var root = d3.hierarchy({ values: results }, function (d) {
      return d.values;
    });
    if (sum$$1) {
      root.sum(function (d) {
        return d.value ? d.value[mixedMeasure.field] : 0;
      });
    }
    return root.children;
  } else {
    return results;
  }
}

/**
 * If color is specified, sets color schemes in array and returns the instance itself. The color schemes is used for color marks of the chart and follows {@link https://developer.mozilla.org/en-US/docs/Web/CSS/color_value CSS color type}. If color is not specified, returns the instance's current color schemes.
 * @memberOf Core#
 * @function
 * @example
 * core.color('red');
 * core.color(['#fff', 'steelblue', 'rgb(128, 128, 128)']);
 * core.color();
 * @param {(string|string[])} color=defaultSchemes color schemes
 * @return {color|Core}
 */
function color(color) {
  if (!arguments.length) return this.__attrs__.color;
  if (Array.isArray(color)) {
    this.__attrs__.color = color;
  } else if (typeof color === 'string') {
    this.__attrs__.color = [color];
  }
  return this;
}

/**
 * If colorDomain is specified, match color domain and color schemes manually. If colorDomain is not specified, returns the instance's current colorDomain.
 * ColorDomain is an array of objects includes a key and a color(optional) property. If a color peroperty is not specified, uses a color in internal {@link Core#color color schemes} in order. Also, if an element of array is string type, it translates into an object with a key property.  
 * 
 * @memberOf Core#
 * @function
 * @example
 * bar.data([
 *    {name: 'A', value: 10},
 *    {name: 'B', value: 20},
 *    {name: 'C', value: 30},
 *    {name: 'D', value: 40}
 *  ]) //sets data
 *  .dimensions(['name'])
 *  .measures(['value'])
 *  .color(['red', 'green', 'blue', 'yellow'])
 *  .colorDomain(['B', {key: 'A', color: 'orange'}, {key: 'D'}]) 
 *  // sets bar A: orange / bar B: red / bar C: blue / bar D: green
 * @param {(string[]|object[])} [colorDomain]
 * @param {string|number} colorDomain[].key
 * @param {string} [colorDomain[].color]
 */
function colorDomain(colorDomain) {
  if (!arguments.length) return this.__attrs__.colorDomain;
  colorDomain = colorDomain.map(function (d) {
    if (typeof d === 'string' || typeof d === 'number') return { key: d };
    return d;
  });
  this.__attrs__.colorDomain = colorDomain;
  return this;
}

/**
 * determines a condition of the chart
 * @private
 * @param {*} conditionFunc 
 */
function condition(conditionFunc) {
  if (!arguments.length) return this.__execs__.condition;
  this.__execs__.condition = conditionFunc.call(this, this.__attrs__.dimensions, this.__attrs__.measures);
  return this;
}

var duration = 140;
/**
 * transparentize the selection's opacity by {@link Core#muteIntensity}
 * @memberOf Core#
 * @param {d3Selection} nodeOrRegion the selection of nodes and regions in the chart
 * @param {number} [intensity]
 * @return {Core}
 */
function mute(nodeOrRegion, intensity) {
  intensity = intensity || this.muteIntensity();
  nodeOrRegion.transition().duration(duration).attr('opacity', intensity);
  return this;
}

/**
 * recovers the selection's opacity from {@link Core#mute}
 * @memberOf Core#
 * @param {d3Selection} nodeOrRegion the selection of nodes and regions in the chart
 * @return {Core}
 */
function demute(nodeOrRegion) {
  nodeOrRegion.transition().duration(duration).attr('opacity', 1);
  return this;
}

/**
 * Fiters labels with a key different with exceptionFilter in the chart's legend, demute the selection.
 * @memberOf Core#
 * @example
 * core.demuteLegend('Sales'); // recover opacity of muted labels, whose key is not 'Sales', in the legend;
 * @param {string|function} [exceptionFilter] If the fiter is a string, select nodes which has different key with the filter. If the a function, it is evaluated for each selected element, in order, being passed the current datum (d), the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
 * @return {Core}
 */
function demuteLegend(excemptionFilter) {
  if (this.__execs__.legend) this.__execs__.legend.demute(excemptionFilter);
  return this;
}

function conditionForMute (filter) {
  var cond = void 0;
  if (typeof filter === 'function') {
    cond = filter;
  } else if (typeof filter === 'string') {
    cond = function cond(d) {
      return d.data.key !== filter;
    };
  } else if ((typeof filter === 'undefined' ? 'undefined' : _typeof(filter)) === 'object' && filter.data) {
    cond = function cond(d) {
      return d.data.key !== filter.data.key;
    };
  } else if ((typeof filter === 'undefined' ? 'undefined' : _typeof(filter)) === 'object') {
    cond = function cond(d) {
      return d.data.key instanceof Date ? d.data.key - filter !== 0 : false;
    };
    if (filter instanceof Date) return cond = function cond(d) {
      return d.data.key instanceof Date ? d.data.key - filter !== 0 : false;
    };else cond = function cond(d) {
      return d.data.key !== filter;
    };
  }
  return cond;
}

/**
 * Fiters nodes according to excemptionFilter in the chart and {@link Core#demute demutes} the nodes. If excemptionFilter is no specified, demutes all nodes.
 * @memberOf Core#
 * @example
 * core.demuteNodes('Sales'); // nodes whose key is not 'Sales' are demuted
 * core.demuteNodes(d => d.key !== 'Sales') // nodes whose key is not 'Sales' are demuted
 * @param {string|function} [excemptionFilter] If the fiter is a string, select nodes which has different key with the filter. If the a function, it is evaluated for each selected element, in order, being passed the current datum (d), the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
 * @return {Core}
 */
function demuteNodes(excemptionFilter) {
  var nodes = void 0;
  if (!arguments.length) {
    //모두 
    nodes = this.filterNodes().classed('mute', false).call(this.demute);
  } else {
    nodes = this.filterNodes(conditionForMute(excemptionFilter));
    if (nodes.size() > 0) {
      nodes.classed('mute', false).call(this.demute);
    }
  }
  return this;
}

function demute$2(regions) {
  var isSeries = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  regions.selectAll(isSeries ? this.seriesName() : this.nodeName()).classed('mute', false).call(this.demute);
}
/**
 * Fiters regions according to exceptionFilter in the chart and {@link Core#demute demutes} the nodes in the selected regions. If exceptionFilter is no specified, demutes all nodes in regions.
 * @memberOf Core#
 * @example
 * core.demuteRegions('Sales'); // regions whose key is not 'Sales' are demuted
 * core.demuteRegions(d => d.key !== 'Sales') // regions whose key is not 'Sales' are demuted
 * @param {string|function} [exceptionFilter] If the fiter is a string, select nodes which has different key with the filter. If the a function, it is evaluated for each selected element, in order, being passed the current datum (d), the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
 * @return {Core}
 */
function demuteRegions (exceptionFilter) {
  var regions = void 0;
  if (!arguments.length) {
    regions = this.filterRegions();
    demute$2.call(this, regions);
    if (this.seriesName) demute$2.call(this, regions, true);
  } else {
    regions = this.filterRegions(conditionForMute(exceptionFilter), true);
    demute$2.call(this, regions);
    if (this.seriesName) demute$2.call(this, regions, true);
  }
  return this;
}

var dimensionMax = 100;
function _dimensionType(dimension) {
  if (typeof dimension === 'string') {
    return { field: dimension, order: 'natural', max: dimensionMax };
  } else if ((typeof dimension === 'undefined' ? 'undefined' : _typeof(dimension)) === 'object') {
    dimension = Object.assign({}, dimension);
    if (!dimension.max) dimension.max = dimensionMax;
    if (!dimension.order) dimension.order = 'natural';
    if (dimension.format && typeof dimension.format === 'string') {
      try {
        dimension.format = d3.timeFormat(dimension.format);
      } catch (e) {
        try {
          dimension.format = d3.format(dimension.format);
        } catch (e) {
          throw e;
        }
      }
    }
    return dimension;
  }
}

/**
 * appends a dimension to {@link Core#dimensions dimensions} array. A dimenension(key) acts as an index that is used to look up measure(value). A synonym for dimension is independent attribute. Jelly-chart has {@link Core#data data} in an array to be grouped into a hierarchical tree structure with dimensions; multi-dimensions can make multiple levels of grouping. The combination of all dimensions would be unique for each item. Each dimension is converted into a mark(region or node) according to its chart type and level.
 * 
 * @memberOf Core#
 * @function
 * @example
 * core.dimension({field:'Sales', order:'ascending'});
 * core.dimension({field: 'Sales Date', format: '%y', interval: 'year'})
 * core.dimension('Profit');
 * @param {(string|object)} dimension
 * @param {string} dimension.field refers a key property in objects from the {@link Core#data data array}. The key property will be invoked for each element in the input array and must return a string identifier to assign the element to its group. 
 * @param {string} [dimension.order=natural] chooses comparator types among natural, ascending and descending, sorting nodes in selected order. 
 * @param {number} [dimension.max=100] maximum number of nodes
 * @param {string} [dimension.format=undefined] a time formatter for the given string {@link https://github.com/d3/d3-time-format#locale_format specifier}
 * @param {string} [dimension.interval=undefined] If the dimension has Date type values, set an {@link https://github.com/d3/d3-time#intervals interval} which is a conventional unit of time to grouped its value.
 * @return {Core}
 */
function dimension$1(dimension) {
  this.__attrs__.dimensions.push(_dimensionType(dimension));
  return this;
}

/**
 * If dimensions is specified, sets dimensions and returns the instance itself. If dimensions is an object or string, it would be turned into an array with a dimension. If dimensions is not specified, returns the instance's current dimensions. 
 * A dimenension(key) acts as an index that is used to look up measure(value). A synonym for dimension is independent attribute. Jelly-chart has {@link Core#data data} in an array to be grouped into a hierarchical tree structure with dimensions; multi-dimensions can make multiple levels of grouping. The combination of all dimensions would be unique for each item. Each dimension is converted into a region or a node according to its chart type and level.
 * @memberOf Core#
 * @function
 * @example
 * bar.data([
 *    {category:'Blue', name: 'A', value: 10},
 *    {category:'Blue', name: 'B', value: 20},
 *    {category:'Blue', name: 'C', value: 30},
 *    {category:'Blue', name: 'D', value: 40},
 *    {category:'Red', name: 'A', value: 20},
 *    {category:'Red', name: 'B', value: 10},
 *    {category:'Red', name: 'C', value: 40},
 *    {category:'Red', name: 'D', value: 10},
 *  ]) //sets data
 *  .dimensions(['category', {field:'name', order:'ascending'}])
 *  //generates a grouped bar chart which has 2 regions (Red, Blue) with 4 bars(A,B,C,D) each.
 * @param {(string|object|Object[])} [dimensions] sets a {@link Core#dimension dimension} array which are objects has properties for aggregation(grouping).
 * @return {(dimensions|Core)}
 */
function dimensions(dimensions) {
  if (!arguments.length) return this.__attrs__.dimensions;
  if (!Array.isArray(dimensions)) {
    dimensions = [dimensions];
  }
  this.__attrs__.dimensions = dimensions.map(function (v) {
    return _dimensionType(v);
  });
  return this;
}

/**
 * gets a domain of the scale with a specified name
 * @memberOf Core#
 * @function
 * @param {string} name 
 */
function domain(name) {
  var scale = this.__execs__.scale;
  if (name in scale && scale.hasOwnProperty(name)) {
    return scale[name].domain();
  } else {
    return null;
  }
}

/**
 * Fiters nodes in the chart, returning a new selection that contains only the elements for which the specified filter is true. 
 * @memberOf Core#
 * @example
 * core.filterNodes(function(d) {
 *    return d.key === key;
 * })
 * @param {(string|function)} filter The filter may be specified either as a selector stringfilter is  or a function. If the a function, it is evaluated for each selected element, in order, being passed the current datum (d), the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
 * @return {d3Selection}
 */
function filterNodes(filter) {
  var nodes = this.nodes();
  if (!filter || typeof filter !== 'function') return nodes;
  return nodes.filter(filter);
}

/**
 * Fiters regions in the chart, returning a new selection that contains only the elements for which the specified filter is true. 
 * @memberOf Core#
 * @example
 * core.filterRegions(function(d) {
 *    return d.key === key;
 * })
 * @param {(string|function)} filter The filter may be specified either as a selector stringfilter is  or a function. If the a function, it is evaluated for each selected element, in order, being passed the current datum (d), the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
 * @return {d3Selection}
 */
function filterRegions(callback) {
  var noFacet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var regions = this.regions();
  if (!callback || typeof callback !== 'function') return regions;
  if (noFacet) {
    regions = regions.filter(function () {
      return !d3.select(this).classed('facet'); //exclude .facet
    });
  }
  return regions.filter(callback);
}

/**
 * hides a tooltip
 * @memberOf Core#
 * @function
 * @return {Core}
 */
function hideTooltip () {
  if (this.multiTooltip && this.multiTooltip()) return this;
  this.__execs__.tooltip.hide();
  return this;
}

/**
 * returns an inner size of chart excepting offsets from the container's size
 * @memberOf Core#
 * @function
 * @param {boolean} needArray If needArray is true, retruns the size in array
 * @return {object|array} returns {width, height} or [width, height] according to needArray
 */
function innerSize() {
  var needArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  var offset = this.offset();
  var width = this.width() - offset.left - offset.right;
  var height = this.height() - offset.top - offset.bottom;
  if (needArray) return [width, height];else return { width: width, height: height };
}

var horizontalThickness = 54;
var verticalThickness = 162;

/**
 * If legend is specified, sets the legend object which includes an orient and a thickness of the legend. If legend is a boolean, it would be tured into an object with a bottom orient and a default thickness. Also, is a string, it would become a orient of an object. If legend is not specified, returns the instance's current legend.
 * @memberOf Core#
 * @function
 * @example
 * core.legend(true); //sets {orient: 'bottom', thickness: 54}
 * core.legend({orient:'right', thickness: 200}); 
 * core.legend();
 * @param {boolean|string|object} [legend] sets a legend type. If is a false, removes the legend.
 * @param {string} legend.orient=bottom sets a legend orient(top|right|bottom|left)
 * @param {number} [legend.thickness=(54|162)] sets a legend thickness. if the orient is top or bottom, the default thickness is 54 pixels. Otherwise, it would be 162 pixels.
 * @return {legend|Core}
 */
function legend(legend) {
  if (!arguments.length) return this.__attrs__.legend;
  if (legend === true) this.__attrs__.legend = { orient: 'bottom', thickness: horizontalThickness };else if (legend === false) this.__attrs__.legend = null;else if ((typeof legend === 'undefined' ? 'undefined' : _typeof(legend)) === 'object') {
    if (!legend.orient) legend.orient = 'bottom';
    if (!legend.thickness) legend.thickness = legend.orient === 'bottom' || legend.orient === 'top' ? horizontalThickness : verticalThickness;
    this.__attrs__.legend = legend;
  }
  return this;
}

/**
 * limits the number of nodes length as many as limitNumber.
 * @memberOf Core#
 * @function
 * @example
 * core.limitKeys(10);
 * @param {number} limitNumber
 * @return {Core}
 */
function limitKeys(limitNumber) {
  var _limit = function _limit(target, num, level, maxLevel) {
    target = target.slice(0, num);
    if (level < maxLevel) target.forEach(function (d) {
      return d.children = _limit(d.children, num, level + 1, maxLevel);
    });
    return target;
  };
  if (!arguments.length) {
    var num = this.__attrs__.limitKeys;
    if (num) {
      var munged = this.__execs__.munged;
      var nestedLevel = this.dimensions().length;
      var result = _limit(this.aggregated() ? munged.children : munged, num, 1, nestedLevel);
      if (this.aggregated()) {
        munged.children = result;
        result = munged;
      }
      this.__execs__.munged = result;
    }
  } else {
    this.__attrs__.limitRows = limitNumber;
  }
  return this;
}

/**
 * limits the number of elements length from the {@link data data}  as many as limitNumber, in order.
 * @memberOf Core#
 * @function
 * @example
 * core.limitRows(100);
 * @param {number} limitNumber
 * @return {Core}
 */
function limitRows(limitNumber) {
  if (!arguments.length) {
    var num = this.__attrs__.limitRows;
    if (num) {
      var data = this.data();
      if (this.aggregated()) {
        data.children = data.children.slice(0, num);
      } else {
        data = data.slice(0, num);
      }
      this.data(data);
    }
  } else {
    this.__attrs__.limitRows = limitNumber;
  }
}

function append(source, target, prop) {
  if (source[prop] && typeof source[prop] === 'number') target[prop] = source[prop];
}
/**
 * If margin is specified, sets margin of the container and returns the instance itself. The unit of margin is a pixel. If margin is not specified, returns the instance's current margin.
 * @memberOf Core#
 * @function
 * @example
 * core.margin({top:100, right: 100}); //sets the margin's top and right amount
 * core.margin();
 * @param {object} [margin]
 * @param {number} [margin.top=40] top
 * @param {number} [margin.right=40] right
 * @param {number} [margin.bottom=40] bottom
 * @param {number} [margin.left=40] left
 * @return {margin|Core}
 */
function margin() {
  var margin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var curMargin = this.__attrs__.margin;
  if (!arguments.length) return this.__attrs__.margin;
  if ((typeof margin === 'undefined' ? 'undefined' : _typeof(margin)) === 'object') {
    ['top', 'right', 'left', 'bottom'].forEach(function (prop) {
      return append(margin, curMargin, prop);
    });
  }
  return this;
}

/**
 * appends a measure to {@link Core#measures measures} array. A measure(value) acts as an value that is looked up by dimensions(key). A synonym for measure is dependent attribute. Jelly-chart has {@link Core#data data} in an array to be grouped into a hierarchical tree structure with dimensions. If measures are specified, leaves of the tree will be summarized by them. 
 * @memberOf Core#
 * @function
 * @example
 * core.measure({field:'Sales', 'op': 'mean'});
 * core.measure('Profit');
 * @param {(string|object)} measure
 * @param {string} [measure.field] refers a value property in objects from the {@link Core#data data array}. The value property will be invoked for leaf elements during aggregation and their values in the property will be summarized by the specified operator as an value.
 * @param {string} [measure.op=sum] an operator(sum, mean, variance, min, max, median) to summarize leaf elements.
 * @param {string} [measure.format] a time formatter for the given string {@link https://github.com/d3/d3-time-format#locale_format specifier}
 * @return {Core}
 */
function measure(measure) {
  if (typeof measure === 'string') {
    this.__attrs__.measures.push({ field: measure, op: 'sum' });
  } else if ((typeof measure === 'undefined' ? 'undefined' : _typeof(measure)) === 'object') {
    if ('format' in measure && typeof measure.format === 'string') measure.format = d3.timeFormat(measure.format);
    this.__attrs__.measures.push(measure);
  }
  return this;
}

/**
 * get a transformed field name of a measure
 * @memberOf Core#
 * @function
 * @private
 * @param {object} measure
 * @param {string} suffix 
 */
function measureName(measure, suffix) {
  measure = measure || this.measures()[0];
  var name = measure.field;
  if (!this.aggregated() || measure.field !== mixedMeasure.field) name += '-' + measure.op;
  return name + (suffix !== undefined ? '-' + suffix : '');
}

/**
 * If measures is specified, sets measures and returns the instance itself. If measures is an object or string, it would be turned into an array with a measure. If measures is not specified, returns the instance's current measures. 
 * A measure(value) acts as an value that is looked up by dimensions(key). A synonym for dimension is independent attribute. Jelly-chart has {@link Core#data data} in an array to be grouped into a hierarchical tree structure with dimensions. If measures are specified, leaves of the tree will be summarized by them. 
 * @memberOf Core#
 * @function
 * @example
 * bar.data([
 *    {name: 'A', sales: 10},
 *    {name: 'B', sales: 20},
 *    {name: 'C', sales: 30},
 *    {name: 'D', sales: 40},
 *    {name: 'A', sales: 20},
 *    {name: 'B', sales: 10},
 *    {name: 'C', sales: 40},
 *    {name: 'D', sales: 10},
 *  ]) //sets data
 *  .dimensions(['name'])
 *  .measures([{field:'sales', op: 'mean'}])
 *  //generates a mono bar chart with 4 bars(A,B,C,D).
 *  //each bar's length will be determined mean of 'sales' values from leaf elements.
 * @param {(string|object|Object[])} [measures] sets a {@link Core#measure measure} array which are objects has properties for aggregation(grouping).
 * @return {(measures|Core)}
 */

function measures(measures) {
  if (!arguments.length) return this.__attrs__.measures;
  var _type = function _type(v) {
    if (typeof v === 'string') {
      return { field: v, op: 'sum' };
    } else if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object') {
      if ('format' in v && typeof v.format === 'string') v.format = d3.timeFormat(v.format);
      return v;
    }
  };
  if (Array.isArray(measures)) {
    this.__attrs__.measures = measures.map(function (v) {
      return _type(v);
    });
  } else {
    this.__attrs__.measures = [_type(measures)];
  }
  return this;
}

/**
 * generate a pseudo dimension which concatenates measures.
 * @memberOf Core#
 * @function
 * @private
 * @return {mixedDimension}
 */
function mixedDimension() {
  var mixedDimension = { order: 'natural' };
  mixedDimension.field = this.measures().map(function (d) {
    return d.field;
  }).join('-');
  return mixedDimension;
}

/**
 * Fiters labels with a key different with exceptionFilter in the chart's legend, demute the selection.
 * @memberOf Core#
 * @example
 * core.demuteLegend('Sales'); // recover opacity of muted labels, whose key is not 'Sales', in the legend;
 * @param {string|function} [exceptionFilter] If the fiter is a string, select nodes which has different key with the filter. If the a function, it is evaluated for each selected element, in order, being passed the current datum (d), the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
 * @return {Core}
 */
function muteLegend(key) {
  if (this.__execs__.legend) this.__execs__.legend.mute(key);
  return this;
}

function muteNodes (exceptionFilter) {
  var nodes = void 0;
  if (!arguments.length) {
    nodes = this.filterNodes().classed('mute', true).call(this.mute, this.muteIntensity());
  } else if (exceptionFilter === null) {
    nodes = this.filterNodes().classed('mute', false).call(this.demute);
  } else {
    nodes = this.filterNodes(conditionForMute(exceptionFilter));
    if (nodes.size() > 0) {
      nodes.classed('mute', true).call(this.mute, this.muteIntensity());
    }
  }
  return this;
}

function mute$2(regions) {
  var ismute = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var isSeries = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  regions.selectAll(isSeries ? this.seriesName() : this.nodeName()).classed('mute', ismute).call(ismute ? this.mute : this.demute, this.muteIntensity());
}

function muteRegions(exceptionFilter) {
  var regions = void 0;
  if (!arguments.length) {
    regions = this.filterRegions();
    mute$2.call(this, regions, true);
    if (this.seriesName) mute$2.call(this, regions, true, true);
  } else if (exceptionFilter === null) {
    regions = this.filterRegions();
    mute$2.call(this, regions, false);
    if (this.seriesName) mute$2.call(this, regions, false, true);
  } else {
    regions = this.filterRegions(conditionForMute(exceptionFilter), true);
    if (regions.size() > 0) {
      mute$2.call(this, regions, true);
      if (this.seriesName) mute$2.call(this, regions, true, true);
    }
  }
  return this;
}

/**
 * @memberOf Core#
 * @function
 * @private
 * @param {*} nodeName 
 */
function nodeName(nodeName) {
  var splited = void 0;
  if (!arguments.length || nodeName === false) return this.__attrs__.nodeName;else if (typeof nodeName === 'boolean' && nodeName) {
    return splited ? splited : splited = this.__attrs__.nodeName.split('.').join(' ').trim();
  } else if (typeof nodeName === 'string') {
    this.__attrs__.nodeName = nodeName;
    splited = this.__attrs__.nodeName.split('.').join(' ').trim();
  }
  return this;
}

/**
 * returns all nodes
 * @memberOf Core#
 * @function
 * @return {d3Selection} nodes
 */
function nodes() {
  return this.regions().selectAll(this.nodeName());
}

var zeroMargin = { top: 0, right: 0, bottom: 0, left: 0 };
/**
 * returns offsets around the content area, that includes the {@link Core#margin margin}, {@link Core#legend legend} area
 * @memberOf Core#
 * @function
 * @return {object} {top, right, bottom, left} offset in pixels
 */
function offset() {
  if (this.zeroOffset()) return zeroMargin;
  var offset = Object.assign({}, this.zeroMargin() ? zeroMargin : this.margin());
  var legend = this.legend();
  if (legend) offset[legend.orient] += legend.thickness;
  return offset;
}

/**
 * @private
 * @param {Core} parent 
 */
function parent(parent) {
  if (!arguments.length) return this.__attrs__.parent;
  this.__attrs__.parent = parent;
  return this;
}

/**
 * @private
 * @param {d3Dispatch} listeners 
 */
function rebindOnMethod$1 (listeners) {
  return rebindOnMethod(this, listeners);
}

/**
 * returns all regions
 * @memberOf Core#
 * @function
 * @return {d3Selection} regions
 */
function regions() {
  return this.__execs__.canvas.selectAll(this.regionName());
}

/**
 * reset and remove the canvas in the chart area
 * @memberOf Core#
 * @function
 * @return {Core} 
 */
function remove () {
  this.reset();
  if (this.__execs__.canvas) {
    this.__execs__.canvas.node().parentNode.parentNode.remove();
    this.__execs__.canvas = null;
  }
  return this;
}

function bindOn(node, dispatch$$1) {
  node.on('click.default', function () {
    dispatch$$1.apply('selectClick', this, arguments);
  }).on('mouseenter.default', function () {
    dispatch$$1.apply('selectEnter', this, arguments);
  }).on('mouseleave.default', function () {
    dispatch$$1.apply('selectLeave', this, arguments);
  });
  return node;
}

/**
 * renders the chart. At the end of settings for a chart, it should be called. If keep is true, it does not reset existing scales.
 * @memberOf Core#
 * @function
 * @param {boolean} [keep=false] If is true, not reset existing scales.
 * @return {Core}
 */
function render() {
  var _this = this;

  var keep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

  this.renderLayout(keep);
  if (!this.__execs__.canvas) return;

  var dispatch$$1 = this.__execs__.selectDispatch;
  var node = this.nodes();
  var legend = this.__execs__.legend;
  if (node && node.size() > 0) {
    if (this.parent()) {
      return;
    }
    node.call(bindOn, dispatch$$1).on('mouseenter.default.legend', function (d) {
      if (legend && legend.mute && _this.muteToLegend) _this.muteToLegend(d);
    }).on('mouseleave.default.legend', function (d) {
      if (legend && legend.demute && _this.demuteToLegend) _this.demuteToLegend(d);
    });
  }

  if (this.isFacet && this.isFacet()) {
    //when is facet, get dispatch from regions.
    node.call(bindOn, dispatch$$1);
  }
  return this;
}

var background = 'none';
function appendClipPath(selection, innerSize) {
  var margin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var transition$$1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  var pos = function pos(rect) {
    rect.attr('x', -margin).attr('y', -margin).attr('width', innerSize.width + margin * 2).attr('height', innerSize.height + margin * 2);
  };
  var defs = selection.selectAll(function () {
    return this.childNodes;
  }).filter(function () {
    return d3.select(this).classed(className('canvas-g-defs'));
  });
  if (defs.empty()) {
    defs = selection.append('defs').attr('class', className('canvas-g-defs')).datum(innerSize);
    defs.append('clipPath').attr('id', function () {
      return getUniqueId('canvas-g-');
    }).attr('class', className('canvas-g-clip-path')).append('rect').attr('class', className('canvas-g-clip-path-rect')).call(pos);
  }

  var rect = defs.select(className('canvas-g-clip-path-rect', true));
  if (transition$$1) rect = rect.transition().duration(transition$$1.duration).delay(transition$$1.delay);
  rect.call(pos);
}

function appendStringContainer(selector, offset, self) {
  var markLocal = self.__execs__.mark;
  selector = d3.select(selector);
  if (selector.empty()) throw new NotAvailableSelectorError();
  if (selector.node().tagName === 'g' || selector.node().tagName === 'G') {
    if (selector.select(className('canvas-g', true)).empty()) {
      self.__execs__.canvas = selector.append('g').attr('class', className('canvas-g'));
      self.__execs__.canvas.append('g').attr('class', className('regions'));
    } else if (!this.__execs__.canvas) {
      self.__execs__.canvas = selector.select(className('canvas-g', true));
    }
    markLocal.set(self.__execs__.canvas.node(), { x: offset.left, y: offset.right });
    self.__execs__.canvas.attr('transform', 'translate(' + [offset.left, offset.right] + ')');
  }
}

/**
 * render a canvas area on which chart components are placed
 * @memberOf Core#
 * @function
 * @private
 * @param {number} margin custom margin for shrink the clip-path on the canvas
 * @return {Core}
 */
function renderCanvas() {
  var margin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  var selector = this.container();
  if (selector === null) return null;
  var offset = this.offset();
  var innerSize = this.innerSize();
  if (typeof selector !== 'string') {
    //if is DOM
    appendStringContainer(selector, offset, this);
    if (this.__execs__.canvas) {
      //if has a canvas, return 
      this.__execs__.canvas.datum(this.__execs__.munged);
      this.__execs__.canvas.call(appendClipPath, innerSize, margin, this.transition());
      return;
    }
  }

  var svg = void 0;
  if (this.__execs__.canvas) {
    //if has a canvas, find svg
    svg = d3.select(this.__execs__.canvas.node().parentNode);
  } else {
    //if has no canvas, generate svg and canvas.
    var container = d3.select(selector);
    if (container.empty()) {
      throw new NotAvailableSelectorError();
    }
    svg = container.select(className('frame', true)).select('svg');
    this.__execs__.canvas = svg.append('g').attr('class', className('canvas-g')).attr('transform', 'translate(' + [offset.left, offset.top] + ')');
    this.__execs__.canvas.append('rect').attr('class', className('background')).style('fill', background);
    this.__execs__.canvas.append('g').attr('class', className('regions'));
  }
  var trans = this.transition();
  var canvas = this.__execs__.canvas;
  canvas.style('pointer-events', 'none');
  if (trans) {
    //FIXME: enable pointer events after rendering
    canvas.transition().duration(trans.duration).delay(trans.delay).attr('transform', 'translate(' + [offset.left, offset.top] + ')').on('end', function () {
      d3.select(this).style('pointer-events', 'all');
    });
  } else {
    canvas.attr('transform', 'translate(' + [offset.left, offset.top] + ')').style('pointer-events', 'all');
  }
  canvas.select(className('background', true)).attr('width', innerSize.width).attr('height', innerSize.height);
  canvas.datum(this.__execs__.munged).call(appendClipPath, innerSize, margin, this.transition());

  return this;
}

function setSvg(svg, self) {
  svg.attr('width', self.width()).attr('height', self.height()).attr('viewBox', '0 0 ' + self.width() + ' ' + self.height());
  return svg;
}

function appendHidden(container, self) {
  self.__execs__.hidden = container.append('g').attr('class', className('hidden-g')).style('visibility', 'hidden');
  return container;
}

/**
 * render a svg and append a hidden area
 * @memberOf Core#
 * @function
 * @private
 * @return {Core}
 */
function renderFrame() {
  var selector = this.container();
  var container = d3.select(selector);
  if (container.empty()) throw new NotAvailableSelectorError();
  if (typeof selector !== 'string') {
    if (container.node().tagName === 'g' || container.node().tagName === 'G') {
      if (container.selectAll(className('hidden-g', true)).empty()) {
        container.call(appendHidden, this);
      } else if (!this.__execs__.hidden) {
        this.__execs__.hidden = container.select(className('hidden-g', true));
      }
      return;
    }
  }
  var svg = void 0;
  if (!this.__execs__.canvas) {
    svg = container.append('div').attr('class', className('frame'));
    if (this.name()) svg.attr('id', 'jelly-chart-id-' + this.name());
    svg = svg.append('svg');
    svg.call(appendHidden, this);
    svg.call(setSvg, this);
  } else {
    svg = d3.select(this.__execs__.canvas.node().parentNode);
  }
  container.select(className('frame', true)).style('width', this.width() + 'px').style('height', this.height() + 'px');
  if (this.transition()) svg = svg.transition().duration(this.transition().duration).delay(this.transition().delay);
  svg.call(setSvg, this);
  return this;
}

var defaultFont$1 = {
  'font-family': 'sans-serif',
  'font-size': 11,
  'font-weight': 'normal',
  'font-style': 'normal'
};
var areaClipPath = className('legend-area-clip-path');
var labelClipPath = className('legend-label-clip-path');
var orients$1 = ['top', 'bottom'];
var highlightDuration = 180;
var _attrs$4 = {
  color: '#485465',
  muteIntensity: 0.3,
  font: defaultFont$1,
  format: null,
  height: 0,
  orient: orients$1[1],
  scale: null,
  showTooltip: true,
  title: null,
  transition: null,
  width: 0,
  x: 0,
  y: 0
};

var Legend = function Legend() {
  classCallCheck(this, Legend);

  this.__attrs__ = JSON.parse(JSON.stringify(_attrs$4));
  this.__execs__ = { legend: null };
  this.__execs__.dispatch = d3.dispatch('selectClick', 'selectEnter', 'selectLeave');
  rebindOnMethod(this, this.__execs__.dispatch);
};

function _legend() {
  return new Legend();
}

function isHorizontal() {
  return this.orient() === 'bottom' || this.orient() === 'top';
}

function _style(selection) {
  var font = this.font();
  for (var k in font) {
    selection.style(k, k === 'font-size' ? font[k] + 'px' : font[k]);
  }
}

function _arrow(selection, that, rowNum) {
  var isHorizontal = that.isHorizontal();
  var width = that.width();
  var height = that.height();
  var labelHeight = that.labelHeight();
  var labelPadding = that.labelPadding();
  var rectW = labelHeight + labelPadding;
  var arrowColor = d3.schemeCategory10[0],
      rectColor = '#A3A3A3';
  var area$$1 = selection.select(className('label-area', true));
  var curRowNum = 0;
  var arrow = selection.selectAll(className('arrow', true)).data(['up', 'down']);
  var arrowEnter = arrow.enter().append('g').attr('class', function (d) {
    return className('arrow ' + d);
  }).style('cursor', 'pointer');
  arrowEnter.append('rect').attr('width', rectW).attr('height', rectW).attr('fill', '#fff').attr('stroke', rectColor).attr('stroke-width', '1px').attr('shape-rendering', 'crispEdges');
  arrowEnter.append('path').attr('d', d3.symbol().type(d3.symbolTriangle).size(labelHeight * 2.5)).attr('transform', function (d, i) {
    var translate = 'translate(' + [(rectW - 1) * 0.5, (rectW - 1) * 0.5] + ')';
    return translate + (i === 1 ? 'rotate(180)' : '');
  }).style('display', 'block').attr('fill', function (d) {
    return d === 'up' ? rectColor : arrowColor;
  });
  arrow = arrowEnter.merge(arrow).attr('transform', function (d, i) {
    if (isHorizontal) return 'translate(' + [width + labelPadding, i * (labelHeight + labelPadding)] + ')';else return 'translate(' + [0, height + labelPadding * 1.25 + i * (labelHeight + labelPadding)] + ')';
  });
  arrow.on('click', function (d) {
    if (d === 'up' && curRowNum > 0) {
      curRowNum -= 1;
    } else if (d === 'down' && curRowNum < rowNum) {
      curRowNum += 1;
    } else {
      return;
    }
    arrow.select('path').style('fill', arrowColor).style('cursor', 'pointer');
    if (curRowNum === 0) {
      arrow.select('path').filter(function (d) {
        return d === 'up';
      }).style('fill', rectColor).style('cursor', 'default');
    } else if (curRowNum === rowNum) {
      arrow.select('path').filter(function (d) {
        return d === 'down';
      }).style('fill', rectColor).style('cursor', 'default');
    }

    area$$1.attr('transform', 'translate(' + [0, -curRowNum * (labelHeight + labelPadding)] + ')');
    //areaClip.select('rect').attr('y', curRowNum * (labelHeight + labelPadding))
  });
}

function _clipPath(selection, that) {
  var width = that.width();
  var maxLabelW = that.isHorizontal() ? width / 2 : width;

  var defs = selection.selectAll('defs').data([[{ name: areaClipPath, width: width }, { name: labelClipPath, width: maxLabelW }]]);
  defs = defs.enter().append('defs').merge(defs);
  var clipPath = defs.selectAll('clipPath').data(function (d) {
    return d;
  }, function (d) {
    return d.name;
  });
  clipPath.exit().remove();
  clipPath = clipPath.enter().append('clipPath').attr('class', function (d) {
    return d.name;
  }).attr('id', function (d) {
    return getUniqueId(d.name + '-');
  }).merge(clipPath);
  var rect = clipPath.selectAll('rect').data(function (d) {
    return [d];
  });
  rect.exit().remove();
  rect = rect.enter().append('rect').merge(rect).attr('width', function (d) {
    return d.width;
  }).attr('height', that.height());
  selection.select(className('label-area-parent', true)).attr('clip-path', 'url(#' + clipPath.filter(function (d, i) {
    return i === 0;
  }).attr('id') + ')');
  selection.selectAll(className('label', true)).attr('clip-path', 'url(#' + clipPath.filter(function (d, i) {
    return i === 1;
  }).attr('id') + ')');
  return selection;
}
function _overflow(selection) {
  var isHorizontal = this.isHorizontal();
  var width = this.width();
  var maxLabelW = isHorizontal ? width / 2 : width;
  var labelHeight = this.labelHeight();
  var labelPadding = this.labelPadding();
  var rowNum = 0,
      curX = 0,
      curY = 0;
  selection.call(_clipPath, this);
  selection.selectAll(className('label', true)).each(function (d, i) {
    var selection = d3.select(this);
    var x = void 0,
        y = void 0;
    var w = Math.min(this.getBBox().width, maxLabelW);
    if (i === 0 || isHorizontal && curX + w + labelPadding * 2 <= width) {
      x = curX;
      y = curY;
    } else {
      rowNum += 1;
      x = curX = 0;
      y = curY = curY + labelHeight + labelPadding;
    }
    curX += w + labelPadding * 2;
    selection.attr('transform', 'translate(' + [x, y] + ')');
  });
  if ((rowNum + 1) * (labelHeight + labelPadding) > this.height()) {
    selection.call(_arrow, this, rowNum);
  } else {
    selection.selectAll(className('arrow', true)).remove();
  }
}

function _render(selection) {
  var _this = this;

  this.__execs__.legend = selection;

  var area$$1 = selection.select(className('label-area', true));
  if (this.transition() && !area$$1.empty()) {
    var trans = this.transition();
    selection.transition().duration(trans.duration).delay(trans.delay).attr('transform', 'translate(' + [this.x(), this.y()] + ')');
  } else {
    selection.attr('transform', 'translate(' + [this.x(), this.y()] + ')');
  }
  if (area$$1.empty()) {
    area$$1 = selection.append('g').attr('class', className('label-area-parent')).append('g').attr('class', className('label-area'));
  }

  var labelHeight = this.labelHeight();
  var labelHeightHalf = labelHeight / 2;
  var scale = this.scale();
  var label = area$$1.selectAll(className('label', true)).data(scale.domain().filter(function (d) {
    return d !== undefined && d !== null;
  }).map(function (d) {
    return { key: d, color: scale(d) };
  }));

  label.exit().remove();

  var labelEnter = label.enter().append('g').attr('class', className('label')).style('cursor', 'pointer');
  labelEnter.append('title');
  labelEnter.append('rect').style('fill', 'none');
  labelEnter.append('circle');
  labelEnter.append('text').style('letter-spacing', '-0.1px');

  label = labelEnter.merge(label).style('fill', function (d) {
    return d.color;
  });
  label.select('title').text(function (d) {
    return _this.format() ? _this.format()(d.key) : d.key;
  });
  label.select('circle').attr('cx', labelHeightHalf).attr('cy', labelHeightHalf).attr('r', 5);
  label.select('text').attr('x', labelHeight).attr('dx', '.35em').attr('dy', '.9em').style('fill', this.color()).text(function (d) {
    return _this.format() ? _this.format()(d.key) : d.key;
  });
  label.select('rect').attr('width', function () {
    return this.parentNode.getBBox().width;
  }).attr('height', function () {
    return this.parentNode.getBBox().height;
  });
  var dispatch$$1 = this.__execs__.dispatch;
  label.on('click', function (d) {
    dispatch$$1.call('selectClick', this, d);
  }).on('mouseenter', function (d) {
    dispatch$$1.call('selectEnter', this, d);
  }).on('mouseleave', function (d) {
    dispatch$$1.call('selectLeave', this, d);
  });
}

function _filter(selection, exceptionFilter) {
  if (typeof exceptionFilter === 'function') {
    return selection.filter(exceptionFilter);
  } else if (typeof exceptionFilter === 'string') {
    return selection.filter(function (d) {
      return d.key !== exceptionFilter;
    });
  } else if (exceptionFilter instanceof Date) {
    var keyTime = exceptionFilter.getTime();
    return selection.filter(function (d) {
      return d.key.getTime() !== keyTime;
    });
  } else if (exceptionFilter.tagName && exceptionFilter.tagName === 'g') {
    return selection.filter(function () {
      return this !== exceptionFilter;
    });
  }

  return selection.filter(function () {
    return true;
  });
}

function demute$3(exceptionFilter) {
  _filter(this.__execs__.legend.selectAll(className('label', true)), exceptionFilter).transition().duration(highlightDuration).attr('opacity', 1);
}

function mute$3(exceptionFilter) {
  var selection = _filter(this.__execs__.legend.selectAll(className('label', true)), exceptionFilter);

  if (selection) {
    selection.transition().duration(highlightDuration).attr('opacity', this.muteIntensity());
  }
  return this;
}

function labelHeight() {
  return this.font()['font-size'];
}

function labelPadding() {
  return this.isHorizontal() ? this.labelHeight() / 2 : this.labelHeight();
}

function update() {}
function render$2(selection) {
  _style.call(this, selection);
  _render.call(this, selection);
  _overflow.call(this, selection);
}
Legend.prototype.demute = demute$3;
Legend.prototype.mute = mute$3;
Legend.prototype.labelHeight = labelHeight;
Legend.prototype.labelPadding = labelPadding;
Legend.prototype.render = render$2;
Legend.prototype.update = update;
Legend.prototype.isHorizontal = isHorizontal;

setMethodsFromAttrs(Legend, _attrs$4);

/**
 * render a legend according to internal {@link Core#legend legend} settings
 * @memberOf Core#
 * @function
 * @private
 * @param {string} [field=region] specify a field name to select color scale.
 * @return {Core}
 */
function renderLegend() {
  var field = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'region';

  var that = this;
  var legendToggle = this.legend();
  var canvas = this.__execs__.canvas;
  if (!legendToggle) {
    canvas.selectAll(className('legend', true)).remove();
    return;
  }
  var fieldObj = this.__execs__.field;
  if (!legendToggle.format && fieldObj[field].isInterval()) legendToggle.format = fieldObj[field].format();
  var x = void 0,
      y = void 0,
      width = void 0,
      height = void 0;
  var offset = this.offset();
  var innerSize = this.innerSize();
  var margin = this.margin();
  var offsetThickness = legendToggle.font ? legendToggle.font['font-size'] : 20;
  if (legendToggle.orient === 'bottom' || legendToggle.orient === 'top') {
    x = 0;
    if (legendToggle.orient === 'bottom') y = innerSize.height + offset.bottom - margin.bottom - legendToggle.thickness + offsetThickness;else y = -offset.top + margin.top - offsetThickness;
    if (this.axisX && !this.axisX()) {
      y += offsetThickness * (legendToggle.orient === 'bottom' ? 1 : -1);
    }
    width = innerSize.width;
    height = legendToggle.thickness - offsetThickness;
  } else {
    if (legendToggle.orient === 'right') x = innerSize.width + offset.right - legendToggle.thickness;else x = -offset.left + margin.left - offsetThickness;
    y = offsetThickness / 2;
    width = legendToggle.thickness - offsetThickness;
    height = innerSize.height - offsetThickness / 2;
  }
  var colorScale = this.scale().color;
  var legendObj = _legend().scale(colorScale).x(x).y(y).width(width).height(height).orient(legendToggle.orient).format(legendToggle.format).transition(this.transition());
  this.__execs__.legend = legendObj;

  legendObj.on('selectEnter', function (d) {
    if (that.muteFromLegend) {
      that.muteFromLegend(d);
    }
    legendObj.mute(this); //FIXME: need to mute by the label
    that.__execs__.selectDispatch.call('legendEnter', this, d);
  }).on('selectLeave', function (d) {
    if (that.demuteFromLegend) {
      that.demuteFromLegend(d);
    }
    legendObj.demute(this);
    that.__execs__.selectDispatch.call('legendLeave', this, d);
  });

  var legendSel = canvas.selectAll(className('legend', true)).data([legendObj]);
  legendSel.exit().remove();
  legendSel.enter().append('g').attr('class', className('legend')).merge(legendSel).each(function (legend) {
    legend.render(d3.select(this));
  });
  return this;
}

/**
 * render regions
 * @memberOf Core#
 * @function
 * @private
 * @param {function} posFunc specifies positions of a region by set x and y value of the region data
 * @param {function} [dataFunc=d => d] specify a data accessor
 * @param {boolean} [isFacet=false] 
 * @param {string} [suffix='']
 * @return {Core}
 */
function renderRegion(posFunc) {
  var dataFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (d) {
    return d;
  };
  var isFacet = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var suffix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

  var region = this.__execs__.canvas.select(className('regions', true)).selectAll(this.regionName() + (isFacet ? '.facet' : '') + suffix).data(dataFunc, function (d, i) {
    return d.data && d.data.key ? d.data.key : i;
  });
  var regionName = this.regionName().split('.').join(' ').trim();
  var aggregated = this.aggregated();
  var regionClass = regionName + (isFacet ? ' facet' : '');
  var canvas = this.__execs__.canvas;
  var trans = d3.transition().duration(this.transition().duration).delay(this.transition().delay);
  var _id = canvas.selectAll(className('canvas-g-clip-path', true)).attr('id');
  var _regionInit = function _regionInit(selection) {
    selection.each(function (xy) {
      if (!aggregated) d3.select(this).attr('transform', 'translate(' + [xy.x, xy.y] + ')');else d3.select(this).attr('transform', 'translate(0,0)');
      if (_id && !isFacet) d3.select(this).attr('clip-path', 'url(#' + _id + ')');
    });
  };
  var _region = function _region(selection) {
    selection.each(function (xy) {
      if (!aggregated) d3.select(this).transition(trans).attr('transform', 'translate(' + [xy.x, xy.y] + ')');else d3.select(this).attr('transform', 'translate(0,0)');
    });
  };

  region.exit().remove();
  var regionEnter = region.enter().append('g').attr('class', regionClass).each(posFunc).call(_regionInit);
  region.each(posFunc);
  region = regionEnter.merge(region);
  region.call(_region);
  return region;
}

var defaultFont$2 = {
  'font-family': 'sans-serif',
  'font-size': 11,
  'font-weight': 'normal',
  'font-style': 'normal'
};
var gradientPrefix = 'legend-gradient-';
//const labelClipPath = 'legend-label-clip-path';
var orients$2 = ['top', 'bottom'];
var _attrs$5 = {
  color: '#6e6e6e',
  field: null,
  height: 0,
  orient: orients$2[0],
  gradientWidth: 150,
  gradientHeight: defaultFont$2['font-size'],
  scale: null,
  showTooltip: true,
  title: null,
  width: 0,
  x: 0,
  y: 0,
  font: defaultFont$2
};

var Spectrum = function Spectrum() {
  classCallCheck(this, Spectrum);

  this.__attrs__ = JSON.parse(JSON.stringify(_attrs$5));
  this.__execs__ = { spectrum: null, scale: null };
};

function _spectrum() {
  return new Spectrum();
}

function _style$1(selection) {
  var font = this.font();
  for (var k in font) {
    selection.style(k, k === 'font-size' ? font[k] + 'px' : font[k]);
  }
}

function _gradientAlternative(selection, width, height, colorRange) {
  var chipNum = width;
  var chipW = width / chipNum;
  var fill = d3.scaleLinear().domain([0, width]).range(colorRange);
  var chips = d3.range(0, chipNum).map(function (i) {
    return i * chipW + chipW;
  });
  selection.selectAll(className('gradient-chip', true)).data(chips).enter().append('rect').attr('class', className('gradient-chip')).attr('width', chipW).attr('height', height).attr('x', function (d) {
    return d - chipW;
  }).style('fill', function (d) {
    return fill(d);
  });
}

function _render$1(selection) {
  this.__execs__.spectrum = selection.attr('transform', 'translate(' + [this.x(), this.y()] + ')');
  var scale = this.scale();
  var colorRange = scale.range();
  var gradientWidth = this.gradientWidth();
  var gradientHeight = this.gradientHeight();
  this.__execs__.scale = d3.scaleLinear().domain(scale.domain()).rangeRound([0, gradientWidth]);

  var area$$1 = selection.select(className('gradient-area', true));
  if (area$$1.empty()) {
    var gradientId = getUniqueId(gradientPrefix);
    var triangleSymbol = d3.symbol().type(d3.symbolTriangle).size(40);
    area$$1 = selection.append('g').attr('class', className('gradient-area'));
    area$$1.append('path').attr('class', className('arrow')).attr('fill', '#777').attr('d', triangleSymbol).style('visibility', 'hidden');
    selection.append('defs').append('linearGradient').attr('id', gradientId);
  }
  area$$1.attr('transform', 'translate(' + [(this.width() - gradientWidth) / 2, 18] + ')');
  var gradient = selection.select('linearGradient');
  var stop = gradient.selectAll('stop').data(colorRange);
  stop.enter().append('stop').merge(stop).attr('offset', function (d, i) {
    return i * 100 + '%';
  }).attr('stop-color', function (d) {
    return d;
  });
  if (safari()) {
    area$$1.call(_gradientAlternative, gradientWidth, gradientHeight, colorRange);
  } else {
    var rect = area$$1.selectAll(className('gradient-rect', true)).data([scale]);
    rect.enter().append('rect').attr('class', className('gradient-rect')).merge(rect).attr('width', this.gradientWidth()).attr('height', this.gradientHeight()).attr('fill', 'url(#' + gradient.attr('id') + ')');
  }
  var label = area$$1.selectAll(className('label', true)).data(scale.domain());
  label.enter().append('text').attr('class', className('label')).merge(label).attr('x', function (d, i) {
    return i * gradientWidth;
  }).attr('y', gradientHeight).attr('dy', '1.25em').attr('text-anchor', 'middle').style('fill', '#999').text(function (d) {
    return labelFormat(d);
  });
  var titleText = this.title() || this.field();
  titleText = titleText.localeCompare(countMeasure.field) === 0 ? countMeasureTitle : titleText;
  var title = area$$1.selectAll('.title').data([titleText]);
  title.enter().append('text').merge(title).attr('class', className('title')).attr('x', gradientWidth + this.font()['font-size']).attr('y', gradientHeight * 0.5).attr('dy', '.35em').attr('text-anchor', 'start').text(function (d) {
    return d;
  });
}

function hide() {
  this.__execs__.spectrum.select(className('arrow', true)).style('visibility', 'hidden');
  return this;
}

function labelHeight$1() {
  return this.font()['font-size'];
}

function labelPadding$1() {
  return this.labelHeight() / 2;
}

function show(value) {
  var pos = this.__execs__.scale(value);
  this.__execs__.spectrum.select(className('arrow', true)).style('visibility', 'visible').attr('transform', 'translate(' + pos + ',-5)rotate(180)');
  return this;
}

function update$1() {}
function render$3(selection) {
  _style$1.call(this, selection);
  _render$1.call(this, selection);
}

Spectrum.prototype.hide = hide;
Spectrum.prototype.labelHeight = labelHeight$1;
Spectrum.prototype.labelPadding = labelPadding$1;
Spectrum.prototype.render = render$3;
Spectrum.prototype.show = show;
Spectrum.prototype.update = update$1;

setMethodsFromAttrs(Spectrum, _attrs$5);

/**
 * render a spectrum instead of a legend according to internal {@link Core#legend legend} settings. Charts such as treeemap and xy-heatmap, which use a contniuous color scale to present their measure level, use this method.
 * @memberOf Core#
 * @function
 * @private
 * @return {Core}
 */
function renderSpectrum() {
  var legendToggle = this.legend();
  if (!legendToggle) return;

  var field = this.__execs__.field;
  var x = void 0,
      y = void 0,
      width = void 0,
      height = void 0;
  var offset = this.offset();
  //FIXME: enable other directions
  if (legendToggle.orient === 'bottom') {
    x = 0;
    y = this.innerSize().height + offset.bottom - this.margin().bottom - legendToggle.thickness;
    width = this.innerSize().width;
    height = legendToggle.thickness;
  }

  var colorScale = this.scale().color;
  var legendObj = _spectrum().scale(colorScale).field(field.color.field()).x(x).y(y).width(width).height(height);
  this.__execs__.canvas.selectAll(this.nodeName() + '.point').on('mouseenter.spectrum', function (d) {
    legendObj.show(d.value);
  }).on('mouseleave.spectrum', function () {
    return legendObj.hide();
  });
  this.__execs__.legend = legendObj;

  var canvas = this.__execs__.canvas;
  var spectrumSel = canvas.selectAll(className('spectrum', true)).data([legendObj]);
  spectrumSel.exit().remove();
  spectrumSel.enter().append('g').attr('class', className('spectrum')).merge(spectrumSel).each(function (d) {
    d.render(d3.select(this));
  });
  return this;
}

var arrowWidth = 4;
var backgroundColor = '#001a32';
var whiteColor = '#fff';
var greyColor = '#7b92ae';
var IS_IE9 = (typeof navigator === 'undefined' ? 'undefined' : _typeof(navigator)) === 'object' ? /MSIE 9/i.test(navigator.userAgent) : false;
var defaultFont$3 = {
  'font-family': 'sans-serif',
  'font-size': 11,
  'font-weight': 'normal',
  'font-style': 'normal'
};

var _attrs$6 = {
  absolute: false,
  anchor: { x: 'left', y: 'top' },
  color: null,
  dx: 0,
  dy: 0,
  font: defaultFont$3,
  offsetFunc: null,
  keys: null, //{name, value}
  keyFunc: null, // function(d) { return {name, value}}
  nodeName: className('mark node', true),
  target: null,
  valueFormat: null,
  valueFunc: null,
  values: [], //[{name, value}, ...]
  x: 0,
  y: 0,
  fromMulti: false,
  showDiff: false
};

var Tooltip = function Tooltip() {
  classCallCheck(this, Tooltip);

  this.__attrs__ = JSON.parse(JSON.stringify(_attrs$6));
  this.__execs__ = { tooltip: null, mark: null, init: true };
  this.valueFormat(labelFormat);
};

function _tooltip() {
  return new Tooltip();
}

function _styleOpacity(selection) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  if (IS_IE9) return selection.style('filter', 'alpha(opacity=' + value * 100 + ')');else return selection.style('opacity', value);
}

function _event() {
  var that = this;
  var target = this.target();
  var points = target.__execs__.canvas.selectAll(this.nodeName());
  points.on('mouseleave.tooltip', function () {
    if (that.fromMulti()) return;
    that.hide();
  }).on('mouseenter.tooltip', function (d) {
    showFromPoint.call(that, this, d);
  });
}

function _position() {
  var target = this.target();
  var points = target.__execs__.canvas.selectAll(this.nodeName());
  var root = (target.parent() ? target.parent() : target).__execs__.canvas.node();
  var absLocal = d3.local();
  var offsetFunc = this.offsetFunc();
  var absolute = this.absolute();
  var initX = 0;
  var initY = 0;
  var offset = target.offset();
  initX += offset.left;initY += offset.top;
  if (target.parent()) {
    //add parent's offset
    offset = target.parent().offset();
    initX += offset.left;initY += offset.top;
  }
  //add frame and svg offset
  var svgRect = root.parentNode.getBoundingClientRect();
  var frameRect = root.parentNode.parentNode.getBoundingClientRect();
  initX += svgRect.left - frameRect.left;
  initY += svgRect.top - frameRect.top;
  initX += arrowWidth;

  var __pos = function __pos(cur, pos) {
    if (cur.x) pos.x += cur.x;
    if (cur.y) pos.y += cur.y;
  };
  var __absPos = function __absPos(d) {
    var pos = { x: initX, y: initY };
    if (offsetFunc && typeof offsetFunc === 'function') {
      var _offset = offsetFunc.apply(this, arguments);
      pos.x += _offset.x;pos.y += _offset.y;
    }
    var cur = d;
    if (absolute) {
      __pos(cur, pos);
    } else {
      while (cur) {
        __pos(cur, pos);
        cur = cur.parent;
      }
    }
    return pos;
  };
  points.each(function () {
    var pos = __absPos.apply(this, arguments);
    absLocal.set(this, pos);
  });
  this.__execs__.mark = absLocal;
}

function _render$2(selection) {
  //pre-render the tooltip 
  var tooltip = this.__execs__.tooltip; //selection.select('.tooltip'); //FIXME: can not generate tooltip area independently.
  if (selection.style('position') === 'static') selection.style('position', 'relative');
  if (!tooltip || tooltip.empty()) {
    tooltip = selection.append('div').attr('class', className('tooltip')).style('color', whiteColor).style('pointer-events', 'none').style('background-color', backgroundColor).style('padding', '9px').style('border-radius', '8px').style('position', 'absolute').style('z-index', '999').call(_styleOpacity, 0);

    tooltip.append('div').attr('class', className('keys')).style('padding-bottom', '1em').style('letter-spacing', '0.1px').call(_styleOpacity, 0.9);
    tooltip.append('table').attr('class', className('values')).style('border-collapse', 'collapse').call(_styleOpacity, 0.72);
    tooltip.append('div').attr('class', className('arrow')).style('position', 'absolute').style('top', 'calc(' + arrowWidth + 'px + 50%)').style('left', '0%').style('margin', -(arrowWidth * 2) + 'px').style('border-width', arrowWidth + 'px').style('border-style', 'solid').style('border-color', 'transparent ' + backgroundColor + ' transparent transparent').text(' ');
  }
  for (var fontKey in this.font()) {
    tooltip.style(fontKey, this.font()[fontKey] + (fontKey === 'font-size' ? 'px' : ''));
  }
  this.__execs__.tooltip = tooltip;
  _position.call(this);
  _event.call(this);
}

function hide$1() {
  var tooltip = this.__execs__.tooltip;
  tooltip.transition().duration(180).call(_styleOpacity, 0);
}

function render$4(selection) {
  selection = d3.select(selection);
  _render$2.call(this, selection);
}

function showFromPoint(point, d) {
  if (this.fromMulti()) return;
  var color = this.color();
  var key = this.keyFunc();
  var value = this.valueFunc();
  var pos = this.__execs__.mark.get(point);
  this.x(pos.x).y(pos.y).color(color ? color : d.color).key(key ? key.call(this, d, d.key) : null).value(value.call(this, d, d.text)).show();
  return this;
}

function show$1() {
  var valueFormat = this.valueFormat();
  var tooltip = this.__execs__.tooltip;

  if (this.keys()) {
    var _key = tooltip.select(className('keys', true)).selectAll(className('key', true)).data(this.keys());
    _key.exit().remove();
    _key = _key.enter().append('div').attr('class', className('key')).merge(_key);
    _key.text(function (d) {
      return d.value;
    });
  }
  var value = tooltip.select(className('values', true)).selectAll(className('value', true)).data(this.values());
  value.exit().remove();
  value = value.enter().append('tr').attr('class', className('value')).merge(value);
  if (this.showDiff() && value.size() > 1) {
    value.style('color', function (_, i) {
      return i === 0 ? greyColor : whiteColor;
    });
  } else {
    value.style('color', whiteColor);
  }

  var label = value.selectAll('td').data(function (d) {
    return [d.name, d.value];
  });
  label.exit().remove();
  label = label.enter().append('td').style('padding', 0).style('margin', 0).style('padding-bottom', '.35em').style('padding-right', function (_, i) {
    return i === 0 ? '2em' : 0;
  }).style('text-align', function (_, i) {
    return i === 0 ? 'left' : 'right';
  }).merge(label).text(function (d, i) {
    if (i === 0) {
      return d.localeCompare(countMeasure.field) === 0 ? countMeasureTitle : d;
    } else {
      return valueFormat(d);
    }
  });
  var tooltipH = tooltip.node().getBoundingClientRect().height / 2;
  tooltip.style('left', this.x() + this.dx() + 'px').style('top', this.y() + this.dy() - tooltipH + 'px').transition().duration(180).call(_styleOpacity, 1);
}

function key(_val) {
  if (!arguments.length || _val === null) return this;
  if ('name' in _val && 'value' in _val) this.__attrs__.keys = [_val];
  return this;
}

function value(_val) {
  if (!arguments.length) return this;
  if (Array.isArray(_val)) {
    this.__attrs__.values = _val;
  } else if ('name' in _val && 'value' in _val) {
    this.__attrs__.values = [_val];
  }
  return this;
}

Tooltip.prototype.hide = hide$1;
Tooltip.prototype.render = render$4;
Tooltip.prototype.show = show$1;
Tooltip.prototype.showFromPoint = showFromPoint;
Tooltip.prototype.key = key;
Tooltip.prototype.value = value;

setMethodsFromAttrs(Tooltip, _attrs$6);

/**
 * renders tooltip according to the internal {@link Core#tooltip tooltip} settings.
 * @memberOf Core#
 * @function
 * @private
 * @param {object} setting
 * @param {number} [setting.dx]
 * @param {number} [setting.dy]
 * @param {string} [setting.color ]
 * @param {function} [setting.key]
 * @param {function} [setting.value]
 * @param {function} [setting.offset]
 * @param {boolean} [setting.showDiff]
 * @param {boolean} fromMulti=false
 * @param {boolean} absolute=false
 * @return {Tooltip}
 */
function renderTooltip() {
  var setting = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var fromMulti = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var absolute = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var tooltipObj = _tooltip().dx(setting && setting.dx ? setting.dx : 0).dy(setting && setting.dy ? setting.dy : 0).target(this).absolute(absolute).fromMulti(fromMulti);
  var container = (this.parent() ? this.parent() : this).__execs__.canvas;
  if (setting.color) tooltipObj.color(setting.color);
  if (!fromMulti) {
    tooltipObj.keyFunc(setting.key).valueFunc(setting.value).offsetFunc(setting.offset).showDiff(setting.showDiff);
    this.__execs__.tooltip = tooltipObj;
  }
  tooltipObj.render(container.node().parentNode.parentNode);
  return tooltipObj;
}

/**
 * reset the chart
 * @memberOf Core#
 * @function
 * @param {boolean} [keep=false] If keep is true, not reset existing scales.
 * @return {Core} 
 */
function reset() {
  var keep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  this.__execs__.axis = {};
  this.__execs__.legend = null;
  if (!this.parent()) this.__execs__.mark = d3.local(); //when is facet, not reset
  this.__execs__.field = {};
  this.__execs__.regions = null;
  this.__execs__.nodes = null;
  if (!keep) this.__execs__.scale = {};
  if (!this.parent() && this.__execs__.canvas) d3.select(this.container()).selectAll(className('tooltip', true)).remove(); //reset, because .facet can generates multiple tooltips.
  return this;
}

/**
 * If size is specified, sets the size range and it direction and returns the instance itself. Each chart type apply size settings differently. If size is not specified, returns the instance's current transition and use the default size setting.
 * 
 * @memberOf Core#
 * @function
 * @example
 * line.size(20) // set point radius of a line chart to 20 pixel
 * scatter.size(10) // set point radius of a scatter chart to 10 pixel
 * scatter.size([10, 100]) // set the range of point radius of a scatter chart from 10 to 100 pixel
 * pie.size([20, 100]) // set the inner radius to 20 and the outer radius to 100 seperately
 * treemap.size({range: [600, 400]}) // set the width to 600 and the height to 400 pixel of a treemap
 * @param {number|object|Object[]} [size] 
 * @return {size|Core}
 */
function size(size) {
  if (!arguments.length) return this.__attrs__.size;
  if (Array.isArray(size)) {
    // only range [min, max]
    this.__attrs__.size = { range: size, reverse: false };
  } else if (typeof size === 'number') {
    // only number [num, num]
    this.__attrs__.size = { range: [size, size], reverse: false };
  } else if ((typeof size === 'undefined' ? 'undefined' : _typeof(size)) === 'object') {
    this.__attrs__.size = size;
  }
  return this;
}

/**
 * If name is specified, returns a scale with the name in existing scales. If name is not specified, returns an object includes all scales.
 * @memberOf Core#
 * @function
 * @example
 * core.scale('color'); //returns the color scale;
 * core.scale() // returns the scale object
 * @param {string} [name] 
 * @return {object|function} 
 */
function scale(name) {
  if (!arguments.length) return this.__execs__.scale;
  return this.__execs__.scale[name];
}

/**
 * @memberOf Core#
 * @function
 * @private
 * @param {*} attrs 
 */
function setAttrs$1(attrs) {
  setAttrs(this, attrs);
  return this;
}

function adjustDomain(scale, from, to) {
  var result = [];

  if (to[0] > from[0]) result[0] = from[0];else result[0] = to[0];

  if (to[1] < from[1]) result[1] = from[1];else result[1] = to[1];

  scale.domain(result);
  if (from[0] === result[0] && from[1] === result[1]) scale.nice();
}

/**
 * @memberOf Core#
 * @function
 * @private
 * @param {*} target 
 * @param {*} domain 
 * @param {*} fromScale 
 */
function setCustomDomain(target, domain) {
  var fromScale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var scale = fromScale ? target : this.__execs__.scale[target];
  var field = fromScale ? null : this.__execs__.field[target];
  scale._defaultDomain = domain;
  if (fromScale) {
    scale.domain(domain).nice();
  } else if (this.customDomain()) {
    adjustDomain(scale, domain, this.customDomain());
  } else if ((this.isMixed ? !this.isMixed() : true) && field.customDomain()) {
    //use field's customDomain
    adjustDomain(scale, domain, field.customDomain());
  } else {
    scale.domain(domain).nice();
  }
  return this;
}

/**
 * shows a tooltip on a node which has the same keys.
 * @todo not work for a multiTooltip
 * @memberOf Core#
 * @function
 * @param {...string} keys - Keys from the leaf to parents
 * @return {Core}
 */
function showTooltip() {
  for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
    keys[_key] = arguments[_key];
  }

  if (this.multiTooltip && this.multiTooltip()) return;
  var condition = function condition(d) {
    var cond = true;
    var target = d;
    keys.forEach(function (k) {
      cond = cond && target.data.key === k;
      if (target.parent) target = target.parent;else return cond;
    });
    return cond;
  };
  var nodes = this.filterNodes(condition);
  var tooltip = this.__execs__.tooltip;
  if (nodes.size() > 0) {
    nodes.each(function (d) {
      tooltip.showFromPoint(this, d);
    });
  }
  return this;
}

/**
 * @memberOf Core#
 * @function
 * @private
 * @param {*} selection 
 * @param {*} font 
 */
function styleFont(selection, font) {
  font = font || this.font();
  for (var fontKey in font) {
    if (!selection.selectAll) selection = d3.select(selection);
    selection.style(fontKey, font[fontKey] + (fontKey === 'font-size' ? 'px' : ''));
  }
}

/**
 * If tooltip is specified, decides to show a tooltip in the chart by it value. If is false, prevent showing the tooltip. If tooltip is not specified, returns the instance's current tooltip setting.
 * @memberOf Core#
 * @function
 * @example
 * core.tooltip(true); //set to show a tooltip
 * core.tooltip({sortByValue:'ascending'}); // set to show a tooltip and sort items in order of their measrue values.
 * @param {boolean|object} [tooltip=false]
 * @return {tooltip|Core}
 */

function tooltip$1(tooltip) {
  if (!arguments.length) return this.__attrs__.tooltip;
  if (typeof tooltip === 'boolean') {
    if (tooltip) {
      tooltip = { sortByValue: 'natural' };
    }
  }
  if ((typeof tooltip === 'undefined' ? 'undefined' : _typeof(tooltip)) === 'object') {
    if (!tooltip.sortByValue) tooltip.sortByValue = 'natural';
  }
  this.__attrs__.tooltip = tooltip;
  return this;
}

function fillUndefined(range$$1, colors) {
  var lastColorIndex = 0;
  range$$1 = range$$1.map(function (c) {
    if (c === undefined) {
      var _loop = function _loop() {
        var n = colors[lastColorIndex];
        lastColorIndex += 1;
        if (range$$1.findIndex(function (d) {
          return d == n;
        }) < 0) {
          return {
            v: n
          };
        }
      };

      while (lastColorIndex < colors.length) {
        var _ret = _loop();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }
    }
    return c;
  });
  return range$$1.filter(function (c) {
    return c !== undefined;
  });
}
/**
 * @memberOf Core#
 * @function
 * @private
 * @param {*} domain 
 * @param {*} keepLast 
 */
function updateColorScale(domain) {
  var keepLast = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var lastScale = this.scale().color;
  if (this.colorDomain() && this.colorDomain().length > 0) {
    var order = this.colorDomain();
    var originColors = this.color();
    var newRange = domain.map(function (d) {
      var i = order.findIndex(function (o) {
        return d == o.key;
      });
      if (i >= 0) {
        return order[i].color ? order[i].color : originColors[i];
      } else {
        return undefined;
      }
    });
    newRange = fillUndefined(newRange, originColors);
    var _scale = d3.scaleOrdinal().domain(domain).range(newRange);
    _scale._defaultRange = this.color();
    return _scale;
  } else if (keepLast && lastScale && lastScale.unknown && this.color() === lastScale._defaultRange) {
    var _originColors = this.color();
    var lastDomain = this.scale().color.domain();
    var lastRange = this.scale().color.range();
    var exist = false;
    var lastIndex = domain.map(function (d) {
      var i = lastDomain.findIndex(function (l) {
        return l === d;
      });
      if (!exist && i >= 0) exist = true;
      return i;
    });

    if (exist) {
      var _newRange = lastIndex.map(function (i) {
        if (i >= 0 && i < lastRange.length) {
          return lastRange[i];
        } else {
          return undefined;
        }
      });
      _newRange = fillUndefined(_newRange, _originColors);
      return lastScale.domain(domain).range(_newRange);
    }
  }
  var scale = d3.scaleOrdinal().domain(domain).range(this.color());
  scale._defaultRange = this.color();
  return scale;
}

var defaultFont = {
  'font-family': 'sans-serif',
  'font-size': 12,
  'font-weight': 'lighter',
  'font-style': 'normal'
};

var continousColorScheme = ['#ece7f2', '#50C3F7'];
var categoryColorScheme = magicTableColorScheme;

var _attrs$3 = {
  aggregated: false,
  color: categoryColorScheme,
  colorDomain: null,
  container: null,
  customDomain: null,
  data: [],
  dimensions: [],
  font: defaultFont,
  height: 480,
  label: null,
  legend: null,
  limitKeys: 200,
  limitRows: 1000,
  name: null,
  nodeName: className('mark node', true),
  margin: { top: 40, right: 40, bottom: 40, left: 40 },
  measures: [],
  muteIntensity: 0.3,
  parent: null,
  regionName: className('mark region', true),
  size: null,
  tooltip: true,
  transition: { duration: 600, delay: 20 },
  width: 640,
  zeroOffset: false,
  zeroMargin: false

  /** 
   * Core of jelly-chart 
   * @class Core
   * */
};
var Core = function Core() {
  classCallCheck(this, Core);

  this.setAttrs(_attrs$3);
  this.__execs__ = {
    axis: {}, //axis settings
    condition: null,
    canvas: null,
    hidden: null,
    field: {}, // {x,y,color,raidus}
    legend: null,
    mark: d3.local(),
    scale: {},
    tooltip: null,
    regions: null,
    nodes: null
  };
  this.on = undefined;
  this.__execs__.selectDispatch = d3.dispatch('selectClick', 'selectEnter', 'selectLeave', 'legendEnter', 'legendLeave');
  this.rebindOnMethod(this.__execs__.selectDispatch);
};

/**
 * If fontStyle is specified, sets the font styles to the specified object and returns the instance itself. If fontStyle is not specified, returns the instance's current fontStyle.
 * @function
 * @example
 * core.font({'font-size': 16}); //sets th font size to 16px, then returns core itself;
 * core.font(); //returns the current fontStyle object;
 * @param {object} [fontStyle]
 * @param {string} fontStyle.font-family=sans-serif
 * @param {number} fontStyle.font-size=12
 * @param {string} fontStyle.font-weight=lighter
 * @param {string} fontStyle.font-style=normal
 * @return {(fontStyle|Core)}
 */


Core.prototype.font = setMethodFromDefaultObj('font', defaultFont);

/**
 * If transition is specified, sets the transition duration and delay to the specified object and returns the instance itself. If transition is not specified, returns the instance's current transition.
 * @function
 * @example
 * core.transition({duration: 1000}); //sets the transition duration to 1000 milliseconds, then returns core itself;
 * core.transition(); //returns the current transition object;
 * @param {object} [transition]
 * @param {number} transition.duration=600 transition duration in milliseconds
 * @param {number} transition.delay=20 trnasition delay in millisecends
 * @return {(transition|Core)}
 */
Core.prototype.transition = setMethodFromDefaultObj('transition', _attrs$3.transition);

/**
 * @function
 * @private
 * @param {boolean} [aggregated=false]
 * @return {(aggregated|Core)}
 */
Core.prototype.aggregated = attrFunc('aggregated');

/**
 * The Core method `.container` sets a selector of a chart holder element or an element itself as its container. Core finds the holder element and renders a chart on it.
 * If container is specified, sets a selector or a element and returns the instance itself. If container is not specified, returns the instance's current container.
 * @function
 * @example
 * core.container('#chart-container'); //sets a selector of a chart holder element as its container
 * core.container(document.getElementById('chart-container')); //sets an element as its container
 * core.container(); //returns the current container;
 * @param {(string|Element)} [container] a selector or an element
 * @return {((string|Element)|Core)}
 */
Core.prototype.container = attrFunc('container');

/**
 * The Core method `.customDomain` sets a user-defined domain of a measrure variable. It's reflection differs based on the char type.
 * If customDomain is specified, sets a selector or a element and returns the instance itself. If customDomain is not specified, returns the instance's current customDomain.
 * @function
 * @example
 * core.customDomain([0, 100]); //sets a custom domain;
 * core.container(); //returns the current custom domain;
 * @param {Number[]} [customDomain] a user-defined domain of a measrure variable
 * @return {(customDomain|Core)}
 */
Core.prototype.customDomain = attrFunc('customDomain');

/**
 * If data is specified, sets data and returns the instance itself. The data shoud be an array of objects, and the object includes the properties used as dimensions and measures. If data is not specified, returns the instance's current data.
 * @function
 * @example
 * core.data([
 *    {name: 'a', value: 10},
 *    {name: 'a', value: 100},
 *    {name: 'b', value: 20}
 *  ]) //sets data
 *  .dimensions(['name'])
 *  .measures(['value']); 
 * 
 * core.data(); //returns the current data;
 * @param {Object[]} [data] 
 * @return {(data|Core)}
 */
Core.prototype.data = attrFunc('data');

/**
 * If height is specified, sets height of the container and returns the instance itself. The unit of height is a pixel. If height is not specified, returns the instance's current height.
 * @function
 * @example
 * core.height(600); //sets a custom height;
 * core.height(); //returns the current height;
 * @param {number} [height=480] height of the container
 * @return {(height|Core)}
 */
Core.prototype.height = attrFunc('height');

/**
 * If label is specified as true, sets the chart to show labels on its marks and returns the instance itself. If label is not specified, returns the instance's current height.
 * @function
 * @example
 * core.label(true); //shows labels
 * core.label(); //returns the current height;
 * @param {boolean} [label=false] whether to show labels on marks
 * @return {(label|Core)}
 */
Core.prototype.label = attrFunc('label');
Core.prototype.name = attrFunc('name');

/**
 * If muteIntensity is specified, sets muteIntensity of the chart and returns the instance itself. MuteIntensity determines opacity of marks which is muted by {@link Core#mute .mute} method. If muteIntensity is not specified, returns the instance's current width.
 * @function
 * @example
 * core.muteIntensity(0.5); //sets a custom width;
 * core.muteIntensity(); //returns the current width;
 * @param {number} [muteIntensity=0.3] opacity of muted marks
 * @return {(muteIntensity|Core)}
 */
Core.prototype.muteIntensity = attrFunc('muteIntensity');
Core.prototype.regionName = attrFunc('regionName');

/**
 * If width is specified, sets width of the container and returns the instance itself. The unit of width is a pixel. If width is not specified, returns the instance's current width.
 * @function
 * @example
 * core.width(600); //sets a custom width;
 * core.width(); //returns the current width;
 * @param {number} [width=640] width of the container
 * @return {(width|Core)}
 */
Core.prototype.width = attrFunc('width');
Core.prototype.zeroOffset = attrFunc('zeroOffset');
Core.prototype.zeroMargin = attrFunc('zeroMargin');

Core.prototype.aggregate = aggregate;
Core.prototype.aggregateMixed = aggregateMixed;
Core.prototype.color = color;
Core.prototype.colorDomain = colorDomain;
Core.prototype.condition = condition;
Core.prototype.demute = demute;
Core.prototype.demuteLegend = demuteLegend;
Core.prototype.demuteNodes = demuteNodes;
Core.prototype.demuteRegions = demuteRegions;
Core.prototype.dimension = dimension$1;
Core.prototype.dimensions = dimensions;
Core.prototype.domain = domain;
Core.prototype.filterNodes = filterNodes;
Core.prototype.filterRegions = filterRegions;
Core.prototype.hideTooltip = hideTooltip;
Core.prototype.innerSize = innerSize;
Core.prototype.legend = legend;
Core.prototype.limitKeys = limitKeys;
Core.prototype.limitRows = limitRows;
Core.prototype.margin = margin;
Core.prototype.mixedDimension = mixedDimension;
Core.prototype.measure = measure;
Core.prototype.measureName = measureName;
Core.prototype.measures = measures;
Core.prototype.mute = mute;
Core.prototype.muteLegend = muteLegend;
Core.prototype.muteNodes = muteNodes;
Core.prototype.muteRegions = muteRegions;
Core.prototype.nodeName = nodeName;
Core.prototype.nodes = nodes;
Core.prototype.offset = offset;
Core.prototype.parent = parent;
Core.prototype.tooltip = tooltip$1;
Core.prototype.scale = scale;
Core.prototype.styleFont = styleFont;
Core.prototype.rebindOnMethod = rebindOnMethod$1;
Core.prototype.regions = regions;
Core.prototype.remove = remove;
Core.prototype.render = render;
Core.prototype.renderCanvas = renderCanvas;
Core.prototype.renderFrame = renderFrame;
Core.prototype.renderLegend = renderLegend;
Core.prototype.renderRegion = renderRegion;
Core.prototype.renderSpectrum = renderSpectrum;
Core.prototype.renderTooltip = renderTooltip;
Core.prototype.reset = reset;
Core.prototype.size = size;
Core.prototype.setAttrs = setAttrs$1;
Core.prototype.setCustomDomain = setCustomDomain;
Core.prototype.showTooltip = showTooltip;
Core.prototype.updateColorScale = updateColorScale;

var offsetThickness = 14;
var verticalAxisThickness = 18;
var horizontalAxisThickness = 18;
var tickFormatForOrdinal = labelFormat;
var targets = ['x', 'y'];
var orients$3 = ['top', 'right', 'bottom', 'left'];
var SIPrefixFormat = d3.format('.2s');
var commaFormat = d3.format(',');
var defaultFont$4 = {
  'font-family': 'sans-serif',
  'font-size': 10,
  'font-weight': 'normal',
  'font-style': 'normal',
  'letter-spacing': '0.1px'
};
var titleSize = 13;
var domainColor = '#c0ccda';
var titleColor = '#485465';
var gridColor = '#e7ebef';
var zerocolor = '#aaa';
var defaultTickRotate = 45;
var smallModeThreshold = 300;
var _attrs$7 = {
  autoTickFormat: true,
  autoRotate: true,
  color: '#7b92ae',
  field: null,
  facet: null,
  font: defaultFont$4,
  format: null,
  grid: false,
  gridSize: 0,
  interval: null,
  orient: orients$3[2],
  scale: null,
  showTitle: true,
  showDomain: true,
  showTicks: true,
  thickness: 40,
  target: targets[0],
  tickFormat: null,
  title: '',
  titleOrient: null,
  ticks: null,
  tickRotate: 0,
  tickSize: 0,
  tickPadding: 4,
  transition: null,
  x: 0,
  y: 0
};

var Axis = function Axis() {
  classCallCheck(this, Axis);

  this.__attrs__ = JSON.parse(JSON.stringify(_attrs$7));
  this.__execs__ = { axis: null, canvas: null, rotated: false };
};

function _axis() {
  return new Axis();
}

function isHorizontal$1() {
  return this.orient() === 'bottom' || this.orient() === 'top';
}

function _generator() {
  var orient = this.orient();
  var scale = this.scale();
  var axis = void 0;

  if (orient === orients$3[0]) axis = d3.axisTop();else if (orient === orients$3[1]) axis = d3.axisRight();else if (orient === orients$3[3]) axis = d3.axisLeft();else axis = d3.axisBottom();
  this.__execs__.axis = axis;

  if (scale) axis.scale(scale);
  if (this.transition()) {
    var trans = this.transition();
    this.__execs__.transition = d3.transition().duration(trans.duration).delay(trans.delay);
  }
}

function _grid(selection, zoomed) {
  if (this.grid() && this.gridSize() > 0) {
    var axis = this.__execs__.axis;
    var gridSize = this.gridSize();
    var _isHorizontal = this.isHorizontal();
    var orient = this.orient();
    var target = _isHorizontal ? 'y2' : 'x2';
    var sign = orient === 'left' || orient === 'top' ? 1 : -1;
    var scale = this.scale();
    var gridLine = selection.selectAll('.grid').data(scale.ticks(axis._tickNumber).map(function (d) {
      return scale(d);
    }));
    gridLine.exit().remove();
    var gridLineEnter = gridLine.enter().append('g').attr('class', 'grid');
    gridLineEnter.append('line').style('stroke', gridColor);
    gridLine = gridLineEnter.merge(gridLine);
    if (this.transition() && !zoomed) {
      gridLine = gridLine.transition(this.__execs__.transition);
    }
    gridLine.attr('transform', function (d) {
      return 'translate(' + (_isHorizontal ? [d + 0.5, 0] : [0, d - 0.5]) + ')';
    }).select('line').attr(target, sign * gridSize);
  } else {
    selection.selectAll('.grid').remove();
  }
}

function _overflow$1(selection) {
  var _this = this;

  /* overflow 시나리오
  ordinal 한 경우 -> 
    -> 일단 클리핑
    -> 가장 긴 녀석을 기준으로 5도 단위로 각도 변화 시키기-> 90도 까지 
   continous 한 경우 -> 
    -> 5도 단위로 각도 변화 시키기-> 90도 까지
  */

  var scale = this.scale();
  var orient = this.orient();
  var tickStepSize = function () {
    if (scale.bandwidth) {
      var bandwidth = scale.bandwidth();
      if (bandwidth === 0) return scale.step();
      return scale.bandwidth();
    } else {
      var ticks = scale.ticks();
      if (ticks.length > 1) {
        return Math.abs(scale(ticks[1]) - scale(ticks[0]));
      } else {
        return Math.abs(scale.range[scale.range().length - 1] - scale.range()[0]);
      }
    }
  }();
  var _generateId = function _generateId() {
    var prefix = 'axis-' + _this.target() + '-' + _this.orient() + '-';
    return getUniqueId(prefix);
  };
  var _tooltip = function _tooltip() {
    selection.selectAll('.tick').each(function () {
      var sel = d3.select(this);
      var t = sel.select('title');
      if (t.empty()) t = sel.insert('title', ':first-child');
      var text = sel.select('text').text();
      t.text(text);
    });
  };
  var _clipPath = function _clipPath() {
    var defs = selection.select('defs');
    if (defs.empty()) {
      var _id = _generateId();
      defs = selection.append('defs');
      defs.append('clipPath').attr('id', _id).append('rect');
      selection.selectAll('.tick').attr('clip-path', 'url(#' + _id + ')');
    }
    var rectPos = {};
    var scaleDist = Math.abs(scale.range()[1] - scale.range()[0]);
    if (scaleDist === 0) scaleDist = scale.range()[0] * 2;
    if (_this.isHorizontal()) {
      rectPos.width = scaleDist;
      rectPos.height = _this.thickness() - (_this.showTitle() ? _this.font()['font-size'] * 1.71 : 0);
      rectPos.x = -rectPos.width / 2;
      rectPos.y = orient === 'bottom' ? 0 : -rectPos.height;
    } else {
      rectPos.width = _this.thickness();
      rectPos.height = scaleDist;
      rectPos.x = orient === 'left' ? -rectPos.width : 0;
      rectPos.y = -rectPos.height / 2;
    }
    defs.select('clipPath').select('rect').datum(rectPos).attr('x', function (d) {
      return d.x;
    }).attr('y', function (d) {
      return d.y;
    }).attr('width', function (d) {
      return d.width;
    }).attr('height', function (d) {
      return d.height;
    });
  };
  var _hidden = function _hidden() {
    var showTicks = _this.showTicks();
    var isSmall = tickStepSize < _this.font()['font-size'] * (_this.isHorizontal() ? 1 : 0.72);
    selection.selectAll('.tick').style('visibility', isSmall && scale.bandwidth ? 'hidden' : showTicks ? 'inherit' : 'hidden');
  };
  var _rotate = function _rotate() {
    var tickPadding = _this.tickPadding();
    var tickRotate = _this.tickRotate();
    var isHorizontal = _this.isHorizontal();
    var isPositive = _this.orient() === 'right' || _this.orient() === 'top';
    var _rotateFunc = function _rotateFunc(_selection) {
      var _tickRotate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : tickRotate;

      var padding = void 0;
      if (isHorizontal) padding = [0, tickPadding / 2];else padding = [_selection.attr('x') * .71, 0];
      if (_this.transition()) _selection = _selection.transition().duration(180);
      _selection.attr('transform', 'translate(' + padding + ') rotate(' + _tickRotate * -1 + ')').attr('text-anchor', isHorizontal ? 'start' : 'end').attr('text-anchor', isPositive ? 'start' : 'end');
    };

    if (tickRotate !== 0) {
      selection.selectAll('.tick > text').call(_rotateFunc);
      _this.__execs__.rotate = true;
      return;
    } else if (_this.autoRotate()) {
      var tick = selection.selectAll('.tick');
      var totalW = 0;
      tick.each(function () {
        var w = this.getBBox().width;
        if (d3.select(this).selectAll('text').classed(className('rotated'))) w *= 1.25;
        totalW += w;
      });
      var isOver = totalW >= Math.abs(scale.range()[1] - scale.range()[0]);
      if (isHorizontal) {
        if (isOver) {
          tick.selectAll('text').classed(className('rotated'), true).call(_rotateFunc, defaultTickRotate);
        } else {
          var rotated = tick.selectAll('text' + className('rotated', true)).classed(className('rotated'), false);
          if (_this.transition()) rotated = rotated.transition().duration(180);
          rotated.attr('transform', '').attr('text-anchor', 'middle');
        }
      }
    }
  };
  _tooltip();
  _clipPath();
  _rotate();
  _hidden();
}

function tickFormatForContinious(domain) {
  if (typeof domain[0] === 'number' && domain[1] >= 100000 && Math.abs(domain[1] - domain[0]) >= 1000) return SIPrefixFormat; //axis.tickFormat(SIPrefixFormat);
  else return commaFormat;
}

function _format() {
  //apply before rendering
  var axis = this.__execs__.axis;
  var tickFormat = this.tickFormat();
  var scale = this.scale();
  if (tickFormat) {
    if (typeof tickFormat === 'function') axis.tickFormat(function (d) {
      if (typeof d === 'string' && isNaN(d)) return d;
      return tickFormat(d);
    });else if (scale._scaleType === 'time') axis.tickFormat(d3.timeFormat(tickFormat));else axis.tickFormat(d3.format(tickFormat));
  } else if (this.autoTickFormat()) {
    if (scale.invert && scale.domain()[0] instanceof Date) {
      return;
    }
    var domain = scale.domain();
    if (scale.invert && !scale.padding) {
      //apply auto-formatting
      axis.tickFormat(tickFormatForContinious(domain));
    } else {
      axis.tickFormat(function (d) {
        return labelFormat(d);
      });
    }
  }
}
function tickNumber(scale, dist) {
  var range$$1 = scale.range();
  dist = dist || Math.abs(range$$1[1] - range$$1[0]);
  var tNumber = scale.ticks().length;
  if (dist <= smallModeThreshold / 2) {
    tNumber = 2;
  } else if (dist <= smallModeThreshold) {
    tNumber = 5;
  } else {
    tNumber = Math.round(tNumber / 2);
  }
  return tNumber;
}
function _preStyle(selection) {
  //TODO : tickSize and font-style
  var axis = this.__execs__.axis;
  var font = this.font();
  var scale = this.scale();
  axis.tickSize(this.tickSize()).tickPadding(this.tickPadding() + (this.isHorizontal() ? 4 : 2));
  if (this.ticks()) {
    axis.ticks(this.ticks());
    axis._tickNumber = this.ticks();
  } else if (scale.invert) {
    if (scale._scaleType === 'time') {
      //scale's type is time
      var intervalType = interval[this.interval()];
      if (intervalType && !this.autoTickFormat() && this.tickFormat()) {
        //user interval
        axis.ticks(intervalType);
        axis._tickNumber = scale.ticks(intervalType).length;
      } else {
        //when has no interval use scale ticks length;
        var tickFormat = this.tickFormat();
        if (tickFormat) {
          axis._tickNumber = d3.set(scale.ticks().map(tickFormat)).values().length;
          axis.ticks(axis._tickNumber);
        } else {
          axis._tickNumber = scale.ticks().length;
        }
      }
    } else {
      var tNumber = tickNumber(scale);
      axis.ticks(tNumber);
      axis._tickNumber = tNumber;
    }
  } else {
    axis._tickNumber = scale.domain().length;
  }
  for (var k in font) {
    selection.style(k, k === 'font-size' ? font[k] + 'px' : font[k]);
  }
}

function _render$3(selection, zoomed) {
  var _this2 = this;

  var axis = this.__execs__.axis;
  if (selection.selectAll('.domain').size() === 0) {
    selection.attr('transform', 'translate(' + [this.x(), this.y()] + ')');
  }

  if (this.transition() && !zoomed) {
    selection.transition(this.__execs__.transition).attr('transform', 'translate(' + [this.x(), this.y()] + ')').call(axis).on('end', function () {
      _overflow$1.call(_this2, selection);
    });
  } else {
    selection.attr('transform', 'translate(' + [this.x(), this.y()] + ')').call(axis);
    _overflow$1.call(this, selection);
  }
}

function _style$2(selection) {
  var tick = selection.selectAll('.tick');
  tick.select('line').style('stroke', this.color());
  tick.select('text').style('fill', this.color());
  selection.select('.domain').style('stroke', domainColor).style('shape-rendering', 'crispEdges').style('stroke-width', '1px').style('visibility', this.showDomain() ? 'visible' : 'hidden'); //showDomain
}

function _title(selection) {
  var that = this;
  var _textTransform = function _textTransform(selection) {
    if (that.isHorizontal()) {
      selection.attr('dy', orient === 'bottom' ? '-1em' : '.71em');
    } else {
      if (titleOrient === 'bottom' || titleOrient === 'top') {
        selection.attr('dy', titleOrient === 'bottom' ? '2em' : '-1em');
      }
    }
  };
  var _transform = function _transform(selection) {
    if (that.isHorizontal()) {
      var padding = 0;
      selection.attr('transform', 'translate(' + [halfPos, orient === 'bottom' ? that.thickness() - padding : -that.thickness() + padding] + ')');
    } else {
      if (titleOrient === 'bottom' || titleOrient === 'top') {
        selection.attr('transform', 'translate(' + [0, titleOrient === 'bottom' ? d3.max(scale.range()) : d3.min(scale.range())] + ')');
      } else {
        selection.attr('transform', 'translate(' + [that.thickness() * (orient === 'left' ? -1 : 1), halfPos] + ') ' + (orient === 'left' ? 'rotate(90)' : 'rotate(-90)'));
      }
    }
  };
  var title = this.title() || this.field();
  if (!title) return;
  title = title.localeCompare(countMeasure.field) === 0 ? countMeasureTitle : title;
  if (!this.showTitle()) {
    selection.selectAll('.title').remove();
    return;
  }
  var orient = this.orient();
  var titleOrient = this.titleOrient() || orient;
  var scale = this.scale();
  var halfPos = (scale.range()[0] + scale.range()[1]) / 2;

  var titleSel = selection.selectAll('.title').data([title]);
  titleSel.exit().remove();
  var titleSelEnter = titleSel.enter().append('g').attr('class', 'title').call(_transform);
  titleSelEnter.append('text').attr('text-anchor', 'middle').style('font-size', titleSize + 'px').style('fill', titleColor).call(_textTransform);

  titleSel = titleSelEnter.merge(titleSel);
  titleSel.select('text').text(title);
  if (this.transition()) {
    titleSel.transition(this.__execs__.transition).call(_transform);
  }
}

function _zero(selection, zoomed) {
  var scale = this.scale();
  if (scale.invert && zeroPoint(scale.domain())) {
    var gridSize = this.gridSize();
    var _isHorizontal2 = this.isHorizontal();
    var orient = this.orient();
    var target = _isHorizontal2 ? 'y2' : 'x2';
    var sign = orient === 'left' || orient === 'top' ? 1 : -1;
    var _scale = this.scale();
    var gridLineTransforms = [];
    selection.selectAll('.tick').filter(function (d) {
      return d === 0;
    }).each(function (d) {
      gridLineTransforms.push(_scale(d));
    });
    var gridLine = selection.selectAll('.zero.grid').data(gridLineTransforms);
    gridLine.exit().remove();
    var gridLineEnter = gridLine.enter().append('g').attr('class', 'grid zero');
    gridLineEnter.append('line').style('stroke', zerocolor);
    gridLine = gridLineEnter.merge(gridLine);
    if (this.transition() && !zoomed) {
      gridLine = gridLine.transition(this.__execs__.transition);
    }
    gridLine.attr('transform', function (d) {
      return 'translate(' + (_isHorizontal2 ? [d + 0.5, 0] : [0, d - 0.5]) + ')';
    }).select('line').attr(target, sign * gridSize);
  }
}

function facet(orient) {
  if (!arguments.length) return this.__attrs__.facet;
  if (orients$3.includes(orient)) this.__attrs__.facet = { orient: orient };else this.__attrs__.facet = { orient: orients$3[0] };
  return this;
}

function update$2() {}
function render$5(selection) {
  var zoomed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (selection) {
    this.__execs__.canvas = selection;
  } else if (this.__execs__.canvas) {
    selection = this.__execs__.canvas;
  } else {
    return;
  }
  _generator.call(this);
  _format.call(this);
  _preStyle.call(this, selection);
  _render$3.call(this, selection, zoomed);
  _style$2.call(this, selection);
  _grid.call(this, selection, zoomed);
  _zero.call(this, selection, zoomed);
  _title.call(this, selection);
}
Axis.prototype.facet = facet;
Axis.prototype.render = render$5;
Axis.prototype.update = update$2;
Axis.prototype.isHorizontal = isHorizontal$1;

setMethodsFromAttrs(Axis, _attrs$7);

function setVal(axis) {
  var val = Object.assign({}, axis);
  if (val.orient && val.orient === 'x') {
    //legacy : 기존에는 orient에 값 넘기는 경우 있었음
    val.target = val.orient;
    val.orient = 'bottom';
  } else if (val.orient && val.orient === 'y') {
    val.target = val.orient;
    val.orient = 'left';
  }

  var isHorizontal = val.target === 'x';
  if (!('showDomain' in val)) val.showDomain = true;
  if (!('showTicks' in val)) val.showTicks = true;
  if (!('showTitle' in val)) val.showTitle = true;
  if (!('orient' in val)) val.orient = isHorizontal ? 'bottom' : 'left'; // x축일 경우 기본 bottom;
  if (!('thickness' in val)) {
    val.thickness = isHorizontal ? horizontalAxisThickness : verticalAxisThickness;
    val.thickness += val.tickPadding ? val.tickPadding : 0;
    val.thickness += val.showTitle ? offsetThickness * 2 : 0;
    val.thickness += val.showTicks ? offsetThickness : 0;
    val.defaultThickness = val.thickness;
  }

  return val;
}

/**
 * If axis is specified, append it to axis settings and returns the instance itself. If axis is a string, it refers axis's target(x or y) and will be converted to an object. If axis is an array of objects, replaces existing axis settings. If axis is not specified, returns the current axis settings. 
 *  If axis exists and adding is false, it removes the existing axis settign which has the same target of axis.
 * @memberOf RectLinear#
 * @function
 * @example
 * rectLinear.axis('x') // sets X-axis on the bottom side
 *  .axis({target: 'y', orient: 'right', showTicks: false, title: 'Custom Axis Y'}) // sets Y-axis on the right side
 * rectLinear.axis('y', false) // removes existing Y-axis
 * @param {string|object|Object[]} [axis] 
 * @param {string} axis.target=x target scale's name
 * @param {string} [axis.orient=bottom] top|right|bottom|left
 * @param {number} [axis.thickness=18]
 * @param {boolean} [axis.showDomain=true]
 * @param {boolean} [axis.showticks=true]
 * @param {boolean} [axis.showTitle=true]
 * @param {string} [axis.title]
 * @param {string} [axis.titleOrient] top|right|bottom|left
 * @param {boolean} [axis.autoTickFormat] if is true, not apply dimension and measure's format.
 * @param {boolean} [adding=true] if adding is false, removes existing the axis specified target.
 * @return {axis|RectLinear}
 */
function axis(axis) {
  var _this = this;

  var adding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  //__attrs__.axis{target, orient, thickness} array includes axis settings
  //__execs__.axis object inclues axis orient
  var val = void 0;
  if (!arguments.length) return this.__attrs__.axis; //only used in facet charts
  if (Array.isArray(axis)) {
    //only used in facet charts
    this.__attrs__.axis = axis.map(setVal);
    axis.forEach(function (d) {
      return _this.__execs__.axis[d.target] = {};
    });
    return this;
  } else if (typeof axis === 'string') {
    val = { target: axis };
    val = setVal(val);
  } else if ((typeof axis === 'undefined' ? 'undefined' : _typeof(axis)) === 'object') {
    val = Object.assign({}, axis);
    val = setVal(val);
  }
  var findIndex = this.__attrs__.axis.findIndex(function (d) {
    return d.target === val.target && d.orient === val.orient;
  }); //find the axis that has the same target and orient
  if (adding) {
    if (findIndex >= 0) {
      this.__attrs__.axis.splice(findIndex, 1, val);
    } else {
      this.__attrs__.axis.push(val);
    }
    if (!this.__execs__.axis[val.target]) this.__execs__.axis[val.target] = {}; //enroll axis holder for the target
  } else {
    if (findIndex >= 0) {
      this.__attrs__.axis.splice(findIndex, 1);
    }
  }

  return this;
}

function _axisExec(target, field, axis) {
  if (!arguments.length) return this.__execs__.axis;
  this.__execs__.axis[target] = this.__execs__.axis[target] || {};
  this.__execs__.axis[target][field] = axis; // => axis.x.field 
  return this;
}

function _set(source, target, key) {
  if (source[key] !== undefined) target[key](source[key]);
}
/**
 * generates new Axis instance according from an {@link RectLinear.#axis axis} setting
 * @memberOf Core#
 * @function
 * @private
 * @param {d3Scale} scale 
 * @param {object} axisSetting
 * @return {Axis}
 */
function axisDefault(scale, axisSetting) {
  var axisTitle = this.axisTitles().filter(function (d) {
    return d.target === axisSetting.target && (!d.field || d.field === axisSetting.field) && (!d.shape || d.shape === axisSetting.shape);
  });
  if (axisTitle.length > 0) axisTitle = axisTitle[0];else axisTitle = null;
  var curAxis = _axis();
  curAxis.scale(scale).target(axisSetting.target).field(axisSetting.field).orient(axisSetting.orient).tickFormat(axisSetting.tickFormat).title(axisTitle ? axisTitle.title : axisSetting.title).titleOrient(axisSetting.titleOrient).autoTickFormat(axisSetting.autoTickFormat).transition(this.transition());
  if (scale._field) {
    var field = scale._field;
    if (field.interval && field.interval()) curAxis.interval(field.interval());
    if (field.format && field.format() && !axisSetting.autoTickFormat) curAxis.tickFormat(field.format());else if (axisSetting.autoTickFormat) curAxis.tickFormat(null);
  } else curAxis.interval(null);
  ['tickPadding', 'thickness', 'showTitle', 'showDomain', 'showTicks'].forEach(function (k) {
    return _set(axisSetting, curAxis, k);
  });
  _axisExec.call(this, axisSetting.target, axisSetting.field, curAxis);
  return curAxis;
}

/**
 * @memberOf RectLinear#
 * @private
 */
function axisX () {
  return this.axis().find(function (d) {
    return d.target === 'x';
  });
}

/**
 * @memberOf RectLinear#
 * @private
 */
function axisY () {
  return this.axis().find(function (d) {
    return d.target === 'y';
  });
}

/**
 * sets a custom title of an axis. Filters axes, returning the axis that has the same target and field whith targetAndField, then sets or remove it's title. If title is false the selected axis's custom title will be removed. Actually, .axisTitle method manipulates {@link RectLinear#axisTitles axisTitles}.
 * @memberOf RectLinear#
 * @function
 * @example
 * rectLinear.axisTitle('x', 'custom Axis X')
 * rectLinear.axisTitle('y.Sales', 'custom Axis Y')
 * rectLinear.axisTitle({target:'y', field: 'Sales'}, 'custom Axis X')
 * rectLinear.axisTitle('x', false);
 * @param {string|object} targetAndField
 * @param {string} targetAndField.target
 * @param {string} [targetAndField.field]
 * @param {string} title
 * @return {RectLinear}
 */
function axisTitle(targetAndField, title) {
  var target = void 0;
  if (typeof targetAndField === 'string') {
    var splited = targetAndField.split('.');
    target = { target: splited[0], field: splited.length >= 2 ? splited.slice(1).join('.') : null };
  } else if ((typeof targetAndField === 'undefined' ? 'undefined' : _typeof(targetAndField)) === 'object') {
    target = targetAndField;
  } else {
    throw new Error('.axisTitle: ' + targetAndField + ' is not unavailable');
  }

  var titles = this.axisTitles();
  var exist = -1;

  for (var i = 0; i < titles.length; i++) {
    var t = titles[i];
    if (t.field === target.field && t.target === target.target) {
      exist = i;
      break;
    }
  }
  if (title) {
    var result = Object.assign({}, target);
    result.title = title;
    if (exist >= 0) titles.splice(exist, 1, result);else titles.push(result);
  } else {
    titles.splice(exist, 1);
  }
  return this;
}

/**
 * @memberOf RectLinear#
 * @private
 */
function renderAxis() {
  var _this = this;

  var canvas = this.__execs__.canvas;
  var axisObj = this.__execs__.axis;
  var _appendAxis = function _appendAxis(selection, axis, targetNum) {
    var cName = 'axis target-' + axis.target() + ' orient-' + axis.orient() + ' targetNum-' + targetNum;
    var axisSel = selection.selectAll(className(cName, true)).data([targetNum]);
    axisSel.exit().remove();
    axisSel = axisSel.enter().insert('g', ':first-child').attr('class', className(cName)).merge(axisSel).classed(className('active'), true);
    axis.render(axisSel);
  };
  var axisG = canvas.selectAll(className('axis', true));
  axisG.classed(className('active'), false);
  for (var target in axisObj) {
    if (axisObj.hasOwnProperty(target)) {
      (function () {
        var targetNum = 0;
        for (var field in axisObj[target]) {
          if (axisObj[target].hasOwnProperty(field)) {
            var axis = axisObj[target][field];
            if (axis.facet()) {
              canvas.selectAll(_this.regionName()).call(_appendAxis, axis, targetNum);
            } else {
              canvas.call(_appendAxis, axis, targetNum);
            }
          }
          targetNum += 1;
        }
        canvas.selectAll(className('axis target-' + target, true)).filter(function (d) {
          return d >= targetNum;
        }).remove(); //remove > targetNum
      })();
    }
  }
  axisG.filter(function () {
    return !d3.select(this).classed(className('active'));
  }).remove();

  return this;
}

/**
 * @memberOf RectLinear#
 * @private
 */
function thickness(axisSetting, scale) {
  var isHorizontal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var isOrdinal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  var hidden = this.__execs__.hidden;
  if (!(axisSetting && axisSetting.showTicks) || axisSetting && axisSetting.autoTickFormat) return;

  var font = axisSetting.font || defaultFont$4;
  var tickFormat = axisSetting.tickFormat || (isOrdinal ? tickFormatForOrdinal : tickFormatForContinious(scale.domain()));
  var ticks = isOrdinal ? scale.domain() : scale.ticks();
  if (scale._field) {
    var field = scale._field;
    if (field.format() && !axisSetting.autoTickFormat) tickFormat = field.format();
    if (field.interval && field.interval()) ticks = scale.ticks(interval[scale._field.interval()]);
  }
  var max$$1 = -1;
  var isOver = false;
  var innerSize = this.innerSize();
  var step = isHorizontal ? innerSize.width / ticks.length * 0.9 : 0;
  var tick = hidden.selectAll(className('tick', true)).data(tickFormat ? ticks.map(tickFormat) : ticks);
  tick = tick.enter().append('text').attr('class', className('tick')).merge(tick).text(function (d) {
    return d;
  });
  this.styleFont(tick, font);
  tick.each(function () {
    var w = this.getBBox().width;
    if (w > max$$1) max$$1 = w;
    if (w > step) isOver = true;
  });
  max$$1 = max$$1 * (isHorizontal ? 0.8 : 1) + offsetThickness * (isHorizontal ? 1.5 : 1);

  if (axisSetting.tickPadding) max$$1 += axisSetting.tickPadding;
  if (axisSetting.showTitle) max$$1 += offsetThickness;
  if (axisSetting.thickness) max$$1 += offsetThickness;

  if (axisSetting.defaultThickness) {
    if (isOver && max$$1 > axisSetting.defaultThickness) {
      axisSetting.thickness = max$$1;
    } else if (axisSetting.defaultThickness < axisSetting.thickness) {
      axisSetting.thickness = axisSetting.defaultThickness;
    }
  }

  if (axisSetting.target === 'x') {
    axisSetting.thickness = Math.min(axisSetting.thickness, this.height() * 0.5);
  } else {
    axisSetting.thickness = Math.min(axisSetting.thickness, this.width() * 0.8);
  }
  tick.remove();
  axisSetting.thickness = Math.round(axisSetting.thickness);
  return axisSetting.thickness;
}

var _attrs$2 = {
  axis: [],
  axisTitles: [],
  grid: false,
  noAxisOffset: false //assume that no axis offset

  /**
   * @class RectLinear
   * @augments Core
   */
};
var RectLinear = function (_Core) {
  inherits(RectLinear, _Core);

  function RectLinear() {
    classCallCheck(this, RectLinear);

    var _this = possibleConstructorReturn(this, (RectLinear.__proto__ || Object.getPrototypeOf(RectLinear)).call(this));

    _this.setAttrs(_attrs$2);
    return _this;
  }
  /**
   * @override
   */


  createClass(RectLinear, [{
    key: 'offset',
    value: function offset() {
      var offset = get(RectLinear.prototype.__proto__ || Object.getPrototypeOf(RectLinear.prototype), 'offset', this).call(this);
      offset = Object.assign({}, offset);
      var axisSetting = this.axis();
      if (!this.noAxisOffset()) {
        axisSetting.forEach(function (at) {
          offset[at.orient] += at.thickness;
        });
      }
      return offset;
    }
  }]);
  return RectLinear;
}(Core);

/**
 * set axis titles directly.
 * @function
 * @example
 * rectLinear.axisTitles({target:'x', title: 'custom title X'});
 * @param {Object[]} [axisTitles] 
 * @param {string} axisTitles[].target target scale name of the axis(x|y)
 * @param {string} axisTitles[].title  title to show
 * @param {string} [axisTitles[].field] target field name of the axis
 * @return {(axisTitles|RectLinear)}
 */


RectLinear.prototype.axisTitles = attrFunc('axisTitles');

/**
 * set and get all axis settings
 * @function
 * @private 
 * @return {axisToggle[]}
 */
RectLinear.prototype.axisToggle = attrFunc('axisToggle');

/**
 * If grid is specified, sets grid setting and returns the instance itself. If grid is true, shows grids of axes. If grid is not specified, it returns the current grid setting.
 * @function
 * @param {boolean} [grid=false] 
 * @return {grid|RectLinear}
 */
RectLinear.prototype.grid = attrFunc('grid');

/**
 * If noAxisOffset is specified, sets noAxisOffset setting and returns the instance itself. If noAxisOffset is true, it doens not consider axes during calculating {@link RectLinear#offset offset}. If noAxisOffset is not specified, it returns the current noAxisOffset setting.
 * @function
 * @private
 * @param {boolean} noAxisOffset=fasle
 * @return {boolean|RectLinear}
 */
RectLinear.prototype.noAxisOffset = attrFunc('noAxisOffset');

RectLinear.prototype.axis = axis;
RectLinear.prototype.axisX = axisX;
RectLinear.prototype.axisY = axisY;
RectLinear.prototype.axisDefault = axisDefault;
RectLinear.prototype.axisTitle = axisTitle;
RectLinear.prototype.renderAxis = renderAxis;
RectLinear.prototype.thickness = thickness;

/**
 * sets axes of facet area
 * @memberOf Facet#
 * @function
 * @private
 * 
 */
function axisFacet() {
  var useRegion = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

  var facet = this.facet();
  var field = this.__execs__.field;
  var xAt = this.axisX();
  var yAt = this.axisY();
  var scale = this.__execs__.scale;
  var innerSize = this.innerSize();
  //horizontal => top d1
  //vertical => right d1
  if (facet.orient === 'horizontal' && xAt) {
    field[useRegion ? 'region' : 'x'].axis(xAt);
    xAt.orient = 'top';
    xAt.showDomain = false;
    this.axisDefault(scale.region, xAt);
  } else if (facet.orient === 'vertical' && yAt) {
    field[useRegion ? 'region' : 'x'].axis(yAt);
    yAt.orient = 'right';
    yAt.showDomain = false;
    this.axisDefault(scale.region, yAt).x(innerSize.width);
  }

  return this;
}

var orients$4 = ['vertical', 'horizontal'];
/**
 * If facet is specified, sets the facet settings and returns the instance itself. If is true, renders vertical oriented partitions. If is a string or object, it changes the orient of partitions. If is false, renders in the default way. If facet is not specified, returns the instance's current facet setting.
 * @memberOf Facet#
 * @function
 * @example
 * facet.facet(true) // renders vertical partitions
 * facet.facet('horizontal')
 * facet.facet({orient: 'vertical'})
 * facet.facet() // returns the current setting
 * @param {boolean|string|object} [facet=false] (false|true|vertical|horizontal) 
 * @param {string} [facet.orient=vertical]
 * @return {facet|Facet}
 */
function facet$1() {
  var facet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  if (!arguments.length) return this.__attrs__.facet;
  if (!facet) this.__attrs__.facet = false;else if (orients$4.includes(facet)) this.__attrs__.facet = { orient: facet };else this.__attrs__.facet = { orient: orients$4[0] };
  return this;
}

var _attrs$1 = {
  facet: false
  /**
   * adds Facet features to RectLinear
   * @class Facet
   * @augments RectLinear
   */
};
var Facet = function (_RectLinear) {
  inherits(Facet, _RectLinear);

  function Facet() {
    classCallCheck(this, Facet);

    var _this = possibleConstructorReturn(this, (Facet.__proto__ || Object.getPrototypeOf(Facet)).call(this));

    _this.setAttrs(_attrs$1);
    return _this;
  }

  return Facet;
}(RectLinear);

Facet.prototype.axisFacet = axisFacet;
Facet.prototype.facet = facet$1;

var _attrs$8 = {
  padding: 0,
  regionPadding: 0
};

var paddingMixin = function paddingMixin(Base) {
  /**
   * @mixin PaddingMixin
   */
  var PaddingMixin = function (_Base) {
    inherits(PaddingMixin, _Base);

    function PaddingMixin() {
      classCallCheck(this, PaddingMixin);

      var _this = possibleConstructorReturn(this, (PaddingMixin.__proto__ || Object.getPrototypeOf(PaddingMixin)).call(this));

      _this.setAttrs(_attrs$8);
      return _this;
    }

    return PaddingMixin;
  }(Base);
  /**
   * sets the padding to the same padding value. Depending on the chart type and its scale type, padding will be applied differently. If padding is not specified, returns the instance's current padding value.
   * @memberOf PaddingMixin
   * @function
   * @example
   * paddingMixin.padding(0.5)
   * paddingMixin.padding()
   * @param {number} [padding=0]
   * @return {padding|PaddingMixin}
   */
  PaddingMixin.prototype.padding = attrFunc('padding');
  /**
  * sets the regionPadding to the same padding value. Depending on the chart type and its scale type, it will be applied differently. If regionPadding is not specified, returns the instance's current regionPadding value.
  * @memberOf PaddingMixin
  * @function
  * @example
  * paddingMixin.regionPadding(0.5)
  * paddingMixin.regionPadding()
  * @param {number} [regionPadding=0]
  * @return {regionPadding|PaddingMixin}
  */
  PaddingMixin.prototype.regionPadding = attrFunc('regionPadding');
  setMethodsFromAttrs(PaddingMixin, _attrs$8);
  return PaddingMixin;
};

/**
 * If is true or a comparator string(natural, ascending, descending), sort nodes according to their values. If sortByValue is not specified, returns the current sortByValue setting.
 * @memberOf SortMixin#
 * @function
 * @example 
 * bar.sort('ascending') //sort bars in ascending order.
 * @param {boolean|string} [sortByValue=false] (false|natural|ascending|descending)
 * @return {sortByValue|SortMixin}
 */
function sortByValue(sortByValue) {
  if (!arguments.length) return this.__attrs__.sortByValue;
  if (sortByValue && (typeof sortByValue !== 'string' || !orders.find(function (o) {
    return o === sortByValue;
  }))) {
    sortByValue = 'natural';
  }
  this.__attrs__.sortByValue = sortByValue;
  return this;
}

var orders = ['natural', 'ascending', 'descending'];
var _attrs$9 = {
  sortByValue: orders[0]
};

var sortMixin = function sortMixin(Base) {
  /**
   * @mixin SortMixin
   */
  var SortMixin = function (_Base) {
    inherits(SortMixin, _Base);

    function SortMixin() {
      classCallCheck(this, SortMixin);

      var _this = possibleConstructorReturn(this, (SortMixin.__proto__ || Object.getPrototypeOf(SortMixin)).call(this));

      _this.setAttrs(_attrs$9);
      return _this;
    }

    return SortMixin;
  }(Base);
  SortMixin.prototype.sortByValue = sortByValue;
  return SortMixin;
};

var _attrs$10 = {
  stacked: false,
  normalized: false
};

var stackMixin = function stackMixin(Base) {
  /**
   * @mixin StackMixin
   */
  var StackMixin = function (_Base) {
    inherits(StackMixin, _Base);

    function StackMixin() {
      classCallCheck(this, StackMixin);

      var _this = possibleConstructorReturn(this, (StackMixin.__proto__ || Object.getPrototypeOf(StackMixin)).call(this));

      _this.setAttrs(_attrs$10);
      return _this;
    }

    return StackMixin;
  }(Base);
  /**
   * If stacked is true, renders stacked marks, such as stacked bar and stacked area chart. If stacked is not specified, returns the current stacked setting.
   * @memberOf StackMixin
   * @function
   * @example
   * stackMixin.stacked(true)
   * @param {boolean} [stacked=false]
   * @return {stacked|StackMixin}
   */
  StackMixin.prototype.stacked = attrFunc('stacked');
  /**
   * If stacked and normalized are true, renders normalized stacked marks, such as normalized stacked bar and normalized stacked area chart. If normalized is not specified, returns the current normalized setting.
   * @memberOf StackMixin
   * @function
   * @example
   * stackMixin.normalized(true)
   * @param {boolean} [normalized=false]
   * @return {normalized|StackMixin}
   */
  StackMixin.prototype.normalized = attrFunc('normalized');

  return StackMixin;
};

var attrs$2 = {
  interval: null,
  max: 100,
  order: 'natural' //natural|ascending|descending
};

var DimensionField = function (_Field) {
  inherits(DimensionField, _Field);

  function DimensionField(dimension) {
    classCallCheck(this, DimensionField);

    var _this = possibleConstructorReturn(this, (DimensionField.__proto__ || Object.getPrototypeOf(DimensionField)).call(this, dimension));

    setAttrs(_this, attrs$2);
    _this.setInit(dimension, ['interval', 'max', 'order']);
    return _this;
  }

  createClass(DimensionField, [{
    key: 'domain',
    value: function domain() {
      var sortByValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var accessor = arguments[1];

      var munged = this.munged();
      var level = this.level();
      var order = this.order();
      var domain = [];
      var curLevel = 0;
      function _keys(values, curLevel) {
        if (curLevel === level) {
          return values.map(accessor ? accessor : function (d) {
            return { key: d.data.key, value: d.value };
          });
        } else {
          return d3.merge(values.map(function (d) {
            return _keys(d.children, curLevel + 1);
          }));
        }
      }
      domain = _keys(munged, curLevel);
      var newDomain = [];
      domain.forEach(function (d) {
        if (newDomain.findIndex(function (n) {
          return n === d;
        }) < 0) {
          newDomain.push(d);
        }
      });
      domain = newDomain;
      if ((!sortByValue || sortByValue === 'natural') && order && order !== 'natural') domain.sort(comparator(order, [], true, function (d) {
        return d.key;
      }));
      if (sortByValue && sortByValue !== 'natural') domain.sort(comparator(sortByValue, [], true, function (d) {
        return d.value;
      }));
      return domain.map(function (d) {
        return d.key;
      });
    }
  }, {
    key: 'isInterval',
    value: function isInterval() {
      return this.interval() && this.format();
    }
  }, {
    key: 'toObject',
    value: function toObject() {
      var def = get(DimensionField.prototype.__proto__ || Object.getPrototypeOf(DimensionField.prototype), 'toObject', this).call(this);
      def.interval = this.interval();
      def.max = this.max();
      def.order = this.order();
      return def;
    }
  }]);
  return DimensionField;
}(Field);

function dimensionField(dimension) {
  return new DimensionField(dimension);
}

setMethodsFromAttrs(DimensionField, attrs$2);

function conditionFunc(dimensions, measures) {
  var field = this.__execs__.field;
  if (dimensions.length <= 2 && measures.length <= 1) {
    if (dimensions.length === 2) {
      field.region = dimensionField(dimensions[0]);
      field.x = dimensionField(dimensions[1]);
    } else {
      field.x = dimensionField(dimensions[0]);
    }
    if (measures.length === 0) {
      this.measure(countMeasure);
    }
    field.y = measureField(measures[0]);
    return conditions[measures.length === 0 ? 1 : 0];
  } else if (dimensions.length <= 1 && measures.length >= 2) {
    if (dimensions.length === 1) {
      //mixed
      field.region = dimensionField(dimensions[0]);
    }
    field.x = dimensionField(this.mixedDimension());
    field.y = measureField(mixedMeasure).mixed(true).measures(measures);
    return conditions[2];
  } else throw new ConditionException();
}

function _munge() {
  var _this = this;

  this.condition(conditionFunc);
  var field = this.__execs__.field;
  var mixed = this.isMixed();

  if (this.aggregated()) {
    this.__execs__.munged = [this.data()];
  } else {
    if (mixed) {
      this.__execs__.munged = this.aggregateMixed(this.facet() && !this.stacked()); //use pseudo dimension and measure
    } else {
      this.__execs__.munged = this.aggregate(this.facet() && !this.stacked());
    }
    if (!this.isNested()) this.__execs__.munged = [this.__execs__.munged[0].parent];
  }

  if (this.stacked()) {
    if (!field.region) {
      stack(this.__execs__.munged, field.y, this.normalized());
    } else {
      var domain = void 0;
      this.__execs__.munged.forEach(function (d, i) {
        if (field.x.order() === 'natural') {
          if (i === 0) domain = d.children.map(function (d) {
            return d.data.key;
          });else d.children.sort(comparator('ascending', domain, true, function (d) {
            return d.data.key;
          }));
        }
        stack(d.children, field.y, _this.normalized());
      });
    }
  }
}

function _scale(keep) {
  var scale = this.scale();
  var munged = this.__execs__.munged;
  var nested = this.isNested();
  var stacked = this.stacked();
  var facet = this.facet();
  var aggregated = this.aggregated();
  var field = this.__execs__.field;
  var xAt = this.axisX();
  var yAt = this.axisY();
  var yDomain = void 0,
      xDomain = void 0;
  var regionDomain = void 0;

  scale.x = d3.scaleBand().padding(this.padding());
  scale.y = d3.scaleLinear();

  if (nested) {
    regionDomain = field.region.level(0).munged(munged).domain();
    scale.region = d3.scaleBand().domain(regionDomain).padding(this.regionPadding());
  }

  if (this.isFacet()) {
    scale.region = d3.scaleBand().domain(regionDomain).padding(this.regionPadding());
    scale.color = this.updateColorScale(regionDomain, keep);

    if (facet.orient === 'horizontal' && xAt) {
      xAt.orient = 'top';
      xAt.showDomain = false;
      this.thickness(xAt, scale.region, true, true);
      if (yAt) yAt.thickness = 0;
    } else if (facet.orient === 'vertical' && yAt) {
      yAt.orient = 'right';
      yAt.showDomain = false;
      this.thickness(yAt, scale.region, false, true);
      if (xAt) xAt.thickness = 0;
    }

    var _innerSize = this.innerSize();
    if (facet.orient === 'vertical') {
      scale.region.rangeRound([0, _innerSize.height]);
    } else {
      scale.region.rangeRound([0, _innerSize.width]);
    }
    return;
  }
  var level = 1;

  xDomain = field.x.level(level).munged(munged).domain(this.sortByValue());
  yDomain = field.y.level(level).munged(munged).aggregated(aggregated).domain(0, stacked);
  if (nested || !nested && (this.mono() === false || stacked)) {
    //nested
    scale.color = this.updateColorScale(xDomain, keep);
  }

  // bar-chart 의 경우 시작점을 0으로 맞춤
  if (yDomain[0] > 0) yDomain[0] = 0;else if (yDomain[1] < 0) yDomain[1] = 0;

  if (this.showDiff() && !nested) {
    if (yDomain[0] === 0) yDomain[1] *= 1.25;else if (yDomain[1] === 0) yDomain[0] *= 1.25;
  }
  if (stacked) {
    if (!nested) {
      scale.x.domain([field.x.field()]);
    }
  } else {
    //not stacked
    scale.x.domain(xDomain);
  }
  this.setCustomDomain('y', yDomain);
  //scale.x에 대한 customDomain 처리

  var targetXField = nested ? field.region : field.x;

  if (this.isVertical()) {
    //vertical
    targetXField.axis(xAt);
    this.thickness(yAt, scale.y, false, false);
    this.thickness(xAt, nested ? scale.region : scale.x, true, true);
  } else {
    targetXField.axis(yAt);
    this.thickness(yAt, nested ? scale.region : scale.x, false, true);
    this.thickness(xAt, scale.y, true, false);
  }

  var innerSize = this.innerSize();
  //range 설정
  if (this.isVertical()) {
    //vertical 
    if (nested) {
      scale.region.range([0, innerSize.width]);
      scale.x.range([0, scale.region.bandwidth()]);
    } else {
      scale.x.range([0, innerSize.width]);
    }
    scale.y.range([innerSize.height, 0]); //reverse
  } else {
    //horizontal
    if (nested) {
      scale.region.range([0, innerSize.height]);
      scale.x.range([0, scale.region.bandwidth()]);
    } else {
      scale.x.range([0, innerSize.height]); //original
    }
    scale.y.range([0, innerSize.width]);
  }
}

function _mark() {
  var that = this;
  var canvas = this.__execs__.canvas;
  var nested = this.isNested.call(this);
  var scale = this.__execs__.scale;
  var stacked = this.stacked();
  var vertical = this.isVertical();
  var color = this.color();
  var trans = d3.transition().duration(this.transition().duration).delay(this.transition().delay);
  var yField = this.measureName();
  var hasZeroPoint = zeroPoint(scale.y.domain());
  var label = this.label();
  var field = this.__execs__.field;
  var diffColor = this.showDiff();
  var isShowDiff = !nested && diffColor;

  var __local = function __local(selection) {
    var monoColor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var _fill = function _fill(d) {
      if (monoColor) return color[0];else return scale.color(d.data.key);
    };
    var tFormat = function tFormat(key) {
      var f = field.x.interval() && field.x.format() ? d3.timeFormat(field.x.format()) : null;
      return f ? f(key) : key;
    };
    selection.each(function (d) {
      //local에 저장
      var x = void 0,
          y = void 0,
          w = void 0,
          h = void 0;
      var yValue = d.value; //d.data.value[yField];
      var upward = yValue >= 0;
      if (stacked) {
        x = 0;
        y = (vertical ? upward : !upward) ? scale.y(d.data.value[yField + '-end']) : scale.y(d.data.value[yField + '-start']);
        w = nested ? scale.region.bandwidth() : scale.x.width;
        h = Math.abs(scale.y(d.data.value[yField + '-start']) - scale.y(d.data.value[yField + '-end']));
      } else {
        x = scale.x(d.data.key);
        y = (vertical ? upward : !upward) ? scale.y(yValue) : hasZeroPoint ? scale.y(0) : scale.y.range()[0];
        w = scale.x.bandwidth();
        h = Math.abs((hasZeroPoint ? scale.y(0) : scale.y.range()[0]) - scale.y(yValue));
      }
      var result = vertical ? { x: x, y: y + (upward ? 0 : 0.5), w: w, h: h, upward: upward } : { x: y + (upward ? 0.5 : 0), y: x, w: h, h: w, upward: upward };
      result.key = tFormat(d.data.key);
      result.color = _fill(d);
      result.text = labelFormat(yValue);
      //result.value = yValue;
      for (var k in result) {
        if (result.hasOwnProperty(k)) d[k] = result[k];
      }
    });
  };
  var __barInit = function __barInit(selection) {
    var vertical = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    selection.each(function (d) {
      var selection = d3.select(this);
      selection.style('cursor', 'pointer').style('fill', function (d) {
        if (d3.select(this).classed(className('diff'))) return 'none';else return d.color;
      });
      if (vertical) {
        selection.attr('x', d.x).attr('y', d.upward ? d.y + d.h : d.y).attr('width', d.w).attr('height', 0);
      } else {
        selection.attr('x', d.upward ? d.x : d.x + d.w).attr('y', d.y).attr('width', 0).attr('height', d.h);
      }
    });
  };
  var __labelInit = function __labelInit(selection) {
    var vertical = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    selection.each(function (d) {
      var selection = d3.select(this);
      selection.style('pointer-events', 'none').text(d.text);
      if (vertical) {
        selection.attr('x', d.x + d.w / 2).style('text-anchor', 'middle');
        if (stacked) selection.attr('y', d.y + d.h).attr('dy', '1em');else if (d.upward) selection.attr('y', d.y + d.h).attr('dy', '-.25em');else selection.attr('y', d.y).attr('dy', '1em');
      } else {
        selection.attr('y', d.y + d.h / 2).attr('dy', '.35em');
        if (stacked) selection.attr('x', d.x + d.w / 2).attr('text-anchor', 'middle');else if (d.upward) selection.attr('x', d.x).attr('dx', '.5em');else selection.attr('x', d.x + d.w).attr('text-anchor', 'end').attr('dx', '-.1em');
      }
      that.styleFont(selection);
    });
  };
  var __bar = function __bar(selection) {
    selection.transition(trans).attr('x', function (d) {
      return d.x;
    }).attr('y', function (d) {
      return d.y;
    }).attr('width', function (d) {
      return d.w;
    }).attr('height', function (d) {
      return d.h;
    }).style('fill', function (d) {
      if (d3.select(this).classed(className('diff'))) return 'none';else return d.color;
    });
  };
  var __label = function __label(selection) {
    var vertical = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    selection.each(function (d) {
      var selection = d3.select(this);
      if (vertical) {
        selection.transition(trans).attr('y', d.upward ? d.y : d.y + d.h);
      } else {
        if (stacked) selection.transition(trans).attr('x', d.x + d.w / 2).attr('text-anchor', 'middle');else selection.transition(trans).attr('x', d.upward ? d.x + d.w : d.x);
      }
      selection.text(d.text).style('fill', stacked ? '#fff' : d.color).style('visibility', label && (!diffColor || diffColor && selection.classed(className('diff'))) ? 'visible' : 'hidden');
    });
  };

  var bar = void 0;
  var region = canvas.selectAll(this.regionName());
  bar = region.selectAll(this.nodeName()).data(function (d) {
    var target = d.children;
    return stacked ? target.slice().reverse() : target;
  }, function (d) {
    return d.data.key;
  });
  bar.exit().remove();
  var barEnter = bar.enter().append('g').attr('class', this.nodeName(true)).call(__local, nested ? false : this.mono());
  barEnter.append('rect').attr('class', className('bar')).call(__barInit, vertical);
  barEnter.append('text').attr('class', className('bar')).call(__labelInit, vertical);
  if (nested && stacked) {
    barEnter.append('path').style('fill', function (d) {
      return d.color;
    }).style('visibility', 'hidden').attr('opacity', '0.5');
  }
  bar.call(__local, nested ? false : this.mono());
  bar = barEnter.merge(bar);
  bar.select('rect' + className('bar', true)).call(__bar, vertical);
  bar.select('text' + className('bar', true)).call(__label, vertical);

  if (isShowDiff) {
    var last = void 0;
    var strokeWidth = 1;
    var halfStrokeWidth = strokeWidth / 2;
    barEnter.append('rect').attr('class', className('diff')).attr('stroke-dasharray', '5, 3').attr('stroke-width', strokeWidth);
    barEnter.append('text').attr('class', className('diff'));
    bar.each(function (d, i, arr) {
      if (i > 0) {
        d.neighbor = last;
        var diff = { value: d.value - last.value, upward: d.upward };
        if (vertical) {
          diff.x = d.x;diff.w = d.w;
          if (diff.value > 0) {
            diff.y = d.y;
            diff.h = last.y - d.y;
          } else {
            diff.y = last.y;
            diff.h = d.y - last.y;
          }
        } else {
          diff.y = d.y;diff.h = d.h;
          if (diff.value > 0) {
            diff.x = last.w;
            diff.w = d.w - last.w;
          } else {
            diff.x = d.w;
            diff.w = last.w - d.w;
          }
        }
        diff.x += halfStrokeWidth;diff.y += halfStrokeWidth;
        diff.h -= strokeWidth;diff.w -= strokeWidth;
        diff.w = Math.max(strokeWidth * 2, diff.w);
        diff.h = Math.max(strokeWidth * 2, diff.h);
        diff.text = labelFormat(diff.value, true);
        d3.select(this).select('text' + className('bar', true)).each(function (d) {
          var selection = d3.select(this).transition(trans);
          if (diff.value < 0) {
            if (vertical) {
              selection.attr('y', (d.upward ? d.y : d.y + d.h) - diff.h);
            } else {
              selection.attr('x', (d.upward ? d.x + d.w : d.x) + diff.w);
            }
          }
        });
        d3.select(this).select('rect' + className('bar', true)).transition(trans).style('fill', function (d) {
          return d.color = diffColor[(diff.value > 0 ? 'inc' : 'dec') + 'Fill'];
        });
        d3.select(this).select('rect' + className('diff', true)).datum(diff).attr('x', vertical ? diff.x + halfStrokeWidth : 0).attr('y', vertical ? d.upward ? d.y + d.h : d.y : diff.y + halfStrokeWidth).attr('width', vertical ? d.w - strokeWidth : 0).attr('height', vertical ? 0 : d.h - strokeWidth).call(__bar).style('stroke', diffColor[(diff.value > 0 ? 'inc' : 'dec') + 'Stroke']);
        d3.select(this).select('text' + className('diff', true)).datum(diff).call(__labelInit, vertical).call(__label, vertical).style('fill', diffColor[(diff.value > 0 ? 'inc' : 'dec') + 'Fill']);
        d.diff = diff;
      } else {
        d.neighbor = d3.select(arr[i + 1]).datum();
        d3.select(this).select('rect' + className('bar', true)).transition(trans).style(diffColor.neuFill);
        d3.select(this).select('rect' + className('diff', true)).remove();
      }
      last = d;
    });
  }

  if (nested && stacked) {
    //show diff of stacked
    var pathLocal = d3.local();
    region.each(function (r, i, arr) {
      var neighbor = d3.select(i < arr.length - 1 ? arr[i + 1] : arr[i - 1]).datum();
      var nds = neighbor.children;
      d3.select(this).selectAll(that.nodeName()).each(function (d) {
        var nd = nds.find(function (nd) {
          return nd.data.key === d.data.key;
        });
        d.neighbor = nd; //save neighbor data
      });
    });
    region.filter(function (d, i, arr) {
      return i < arr.length - 1;
    }).selectAll(that.nodeName()).select('path').style('fill', function (d) {
      return d.color;
    }).each(function (d) {
      d.diff = { value: d.neighbor.value - d.value };
      var parent = d.parent;
      var neighbor = d.neighbor;
      var neighborParent = neighbor.parent;
      var points = [];
      if (vertical) {
        //push in clockwise order
        points.push([d.x + d.w, d.y]);
        points.push([neighborParent.x + neighbor.x - parent.x, neighborParent.y - parent.y + neighbor.y]);
        points.push([points[1][0], points[1][1] + neighbor.h]);
        points.push([points[0][0], points[0][1] + d.h]);
      } else {
        points.push([d.x, d.y + d.h]);
        points.push([points[0][0] + d.w, points[0][1]]);
        points.push([neighborParent.x + neighbor.x + neighbor.w - parent.x, points[0][1] + neighborParent.y + neighbor.y - parent.y - d.y - d.h]);
        points.push([points[2][0] - neighbor.w, points[2][1]]);
      }
      var source = vertical ? [points[0], points[3]] : [points[0], points[1]];
      source = 'M' + source[0] + 'L' + (vertical ? source[0] : source[1]) + 'L' + source[1] + 'L' + (vertical ? source[1] : source[0]) + 'z';
      var target = points.map(function (point, i) {
        return (i === 0 ? 'M' : 'L') + point;
      }).join('') + 'z';
      pathLocal.set(this, { source: source, target: target });
    });

    bar.on('mouseenter.stacked', function (d) {
      bar.filter(function (t) {
        return t.data.key !== d.data.key;
      }).selectAll('rect' + className('bar', true)).transition().style('fill', '#b2c0d1');
      var neighbor = region.selectAll(that.nodeName()).filter(function (t) {
        return t.data.key === d.data.key;
      });
      if (!label) {
        d3.select(this).select('text' + className('bar', true)).style('visibility', 'visible');
        neighbor.select('text' + className('bar', true)).style('visibility', 'visible');
      }
      neighbor.select('path').style('visibility', 'visible').attr('d', function () {
        var path = pathLocal.get(this);
        if (path) return path.source;
      }).interrupt().transition(trans).attr('d', function () {
        var path = pathLocal.get(this);
        if (path) return path.target;
      });
    }).on('mouseleave.stacked', function (d) {
      bar.filter(function (t) {
        return t.data.key !== d.data.key;
      }).selectAll('rect' + className('bar', true)).transition().style('fill', function (d) {
        return d.color;
      });
      var neighbor = region.selectAll(that.nodeName()).filter(function (t) {
        return t.data.key === d.data.key;
      });
      if (!label) {
        d3.select(this).select('text' + className('bar', true)).style('visibility', 'hidden');
        neighbor.select('text' + className('bar', true)).style('visibility', 'hidden');
      }
      neighbor.select('path').interrupt().transition(trans).attr('d', function () {
        var path = pathLocal.get(this);
        if (path) return path.source;
      }).on('end', function () {
        d3.select(this).style('visibility', 'hidden');
      });
    });
  }
}

function _axis$1() {
  var that = this;
  var scale = this.__execs__.scale;
  var nested = this.isNested();
  var grid = this.grid();
  var innerSize = this.innerSize();
  var fieldObj = this.__execs__.field;
  var isVertical = this.isVertical();

  var _axisScaleX = function _axisScaleX(axisToggle) {
    var targetField = nested ? fieldObj.region : isVertical ? fieldObj.x : fieldObj.y;
    var targetScale = nested ? scale.region : isVertical ? scale.x : scale.y;
    targetField.axis(axisToggle);
    var curAxis = that.axisDefault(targetScale, axisToggle);
    if (axisToggle.orient === 'bottom') {
      curAxis.y(isVertical ? scale.y.range()[0] : scale.x.range()[1]);
    }
    return curAxis;
  };

  var _axisScaleY = function _axisScaleY(axisToggle) {
    var targetField = isVertical ? fieldObj.y : fieldObj.x;
    var targetScale = isVertical ? scale.y : scale.x;
    targetField.axis(axisToggle);
    var curAxis = that.axisDefault(targetScale, axisToggle);
    curAxis.grid(grid).gridSize(axisToggle.orient === 'bottom' || axisToggle.orient === 'top' ? innerSize.height : innerSize.width);
    if (axisToggle.orient === 'right') curAxis.x((nested ? scale.region : scale.x).range()[1]);
    return curAxis;
  };

  var xAt = this.axisX();
  var yAt = this.axisY();
  if (this.isFacet()) {
    this.axisFacet(false);
  } else {
    if (xAt) _axisScaleX(xAt);
    if (yAt) _axisScaleY(yAt);
  }

  this.renderAxis();
}

function _legend$1() {
  var field = this.__execs__.field;
  if (this.mono() && (!field.region || this.isFacet())) {
    //mono + dimensions  => no legend
    return;
  }
  this.renderLegend('x');
}

function _region() {
  var aggregated = this.aggregated();
  var nested = this.isNested.call(this);
  var scale = this.__execs__.scale;
  var stacked = this.stacked();
  var facet = this.facet();
  var vertical = this.isVertical();
  var isFacet = this.isFacet();
  var __regionLocal = function __regionLocal(d) {
    if (aggregated) return;
    var xy = nested ? [scale.region(d.data.key), 0] : [0, 0];
    if (facet && !stacked && facet.orient === 'vertical') {
      xy.reverse();
    } else if (!vertical && facet.orient !== 'horizontal') {
      xy.reverse();
    }
    var x = xy[0];
    var y = xy[1];
    d.x = x;d.y = y;
  };

  this.renderRegion(__regionLocal, function (d) {
    return d;
  }, isFacet);
}

function _facet() {
  var _this = this;

  var parent = this;
  var scale = this.__execs__.scale;
  var facet = this.facet();
  var canvas = this.__execs__.canvas;
  var mono = this.mono();
  var innerSize = this.innerSize();
  var dimensions = [this.dimensions()[0]];
  var measures = this.isMixed() ? [mixedMeasure] : this.measures();
  var width = void 0,
      height = void 0;
  var settings = ['axisTitles', 'normalized', 'padding', 'orient', 'font', 'label', 'grid', 'tooltip'].map(function (d) {
    return { key: d, value: _this[d]() };
  });
  var hasX = this.axisX();
  var hasY = this.axisY();
  var _smallbar = function _smallbar(d) {
    var smallBar = bar().container(this).data(d).dimensions(dimensions).measures(measures).width(width).height(height).legend(false).zeroMargin(true) //remove margin
    .aggregated(true).parent(parent);
    settings.forEach(function (d) {
      smallBar[d.key](d.value);
    });

    if (!mono) smallBar.color(scale.color(d.data.key));
    if (facet.orient === 'vertical') {
      if (hasX) smallBar.axis({ target: 'x', orient: 'bottom' }); //, showTitle: i === arr.length-1});
      if (hasY) smallBar.axis({ target: 'y', orient: 'left' });
    } else {
      if (hasX) smallBar.axis({ target: 'x', orient: 'bottom' });
      if (hasY) smallBar.axis({ target: 'y', orient: 'left' }); //showTitle: i === 0});
    }
    smallBar.render();
  };
  if (facet.orient === 'horizontal') {
    width = scale.region.bandwidth();
    height = innerSize.height;
  } else {
    width = innerSize.width;
    height = scale.region.bandwidth();
  }

  canvas.selectAll(this.regionName() + '.facet').each(_smallbar);
}

function _tooltip$1() {
  if (!this.tooltip() || this.isFacet()) return;
  var parent = this.parent();
  var mixed = this.isMixed();
  var field = this.__execs__.field;
  var isStacked = this.stacked() && this.isNested() && !this.isFacet();
  var isVertical = this.isVertical();
  var isShowDiff = this.showDiff() && !this.isNested();
  var key = function key(d, text) {
    return { name: 'key', value: text };
  };
  var value = function value(d, text) {
    var name = void 0;
    if (mixed) {
      name = d.key;
    } else if (parent && parent.isMixed()) {
      name = d.key;
    } else {
      name = field.y.field();
    }
    return { name: name, value: text };
  };

  var valueDiff = function valueDiff(d) {
    var nd = d.neighbor;
    var result = [{ name: (isShowDiff ? d : d.parent).data.key, value: d.text }, { name: (isShowDiff ? nd : nd.parent).data.key, value: nd.text }];
    if (isShowDiff) result.reverse();
    var diff = d.diff ? d.diff.value : nd.diff.value;
    result.push({ name: '(+/-)', value: diff });
    return result;
  };
  var offset = function offset(d) {
    var x = 0,
        y = 0;
    if (isStacked) {
      x = Math.max(-d.x + d.neighbor.x + d.neighbor.w, d.w);
      if (isVertical) {
        if (d.neighbor.parent.x > d.parent.x) x += Math.abs(d.neighbor.parent.x - d.parent.x) - d.w;
      } else {
        var yDiff = d.neighbor.parent.y - d.parent.y;
        if (yDiff < 0) {
          //when it is last
          x = d.w;
        } else {
          y += d.h + (yDiff - d.h) / 2;
        }
      }
    } else {
      x += d.w;
    }
    return { x: x, y: y };
  };
  var toggle = { key: key, offset: offset };
  if (isStacked || isShowDiff) {
    toggle.value = valueDiff;
    toggle.showDiff = true;
  } else {
    toggle.value = value;
  }
  this.renderTooltip(toggle);
}

function translate(selection, innerSize) {
  var isVertical = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var isInit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  selection.attr('transform', function (d) {
    if (isVertical) {
      if (isInit) return 'translate(' + [innerSize.width, innerSize.height] + ')';
      return 'translate(' + [innerSize.width, d.y - 0.5] + ')';
    } else {
      if (isInit) return 'translate(' + [0, 0] + ')';
      return 'translate(' + [d.w + 0.5, 0] + ')';
    }
  });
}
function line$1(selection, innerSize) {
  var isVertical = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (isVertical) {
    selection.attr('x1', -innerSize.width);
  } else {
    selection.attr('y2', innerSize.height);
  }
}

function _annotation() {
  if (!this.annotation() || this.isFacet() || this.stacked()) return;
  var annotation = this.annotation();
  var that = this;
  var canvas = this.__execs__.canvas;
  var trans = d3.transition().duration(this.transition().duration).delay(this.transition().delay);
  var innerSize = this.innerSize();
  var isVertical = this.isVertical();
  var isShowDiff = this.showDiff() && !this.isNested();

  if (canvas.select('.annotation-g').empty()) canvas.append('g').attr('class', 'annotation-g');
  var g = canvas.select('.annotation-g');
  var anno = g.selectAll('.annotation').data(this.nodes().data());
  anno.exit().remove();
  var annoEnter = anno.enter().append('g').attr('class', 'annotation').call(translate, innerSize, isVertical, true).style('pointer-events', 'none');
  annoEnter.append('text').style('fill', annotation.color);
  annoEnter.append('line').style('stroke', annotation.color).style('shape-rendering', 'crispEdges').call(line$1, innerSize, isVertical);
  anno = annoEnter.merge(anno).transition(trans).call(translate, innerSize, isVertical);
  if (isShowDiff) {
    anno.style('visibility', function (d, i, arr) {
      if (d.diff) {
        if (d.diff.value < 0) return 'visible';else if (i < anno.size() - 1 && d3.select(arr[i + 1]).datum().diff.value > 0) return 'visible'; //when not last one, but next one is  diff > 0
        if (d.neighbor.diff.value > 0) return 'visible';
      }
      return 'hidden';
    });
  }

  anno.select('text').text(function (d) {
    return d.key;
  }).style('visibility', annotation.showLabel ? 'visible' : 'hidden').style('fill', annotation.color).each(function () {
    that.styleFont(this);
  });
  anno.select('line').transition(trans).style('stroke', annotation.color).call(line$1, innerSize, isVertical);
}

var orients = ['vertical', 'horizontal'];
var conditions = ['normal', 'count', 'mixed'];
var _attrs = {
  annotation: false,
  mono: true,
  orient: orients[0],
  padding: 0.05,
  showDiff: false,
  regionPadding: 0.1
};

/**
 * renders a bar chart
 * @class Bar
 * @augments Core
 * @augments RectLinear
 * @augments Facet
 * @augments SortMixin
 * @augments PaddingMixin
 * @todo write examples
 */

var Bar = function (_mix$with) {
  inherits(Bar, _mix$with);

  function Bar() {
    classCallCheck(this, Bar);

    var _this = possibleConstructorReturn(this, (Bar.__proto__ || Object.getPrototypeOf(Bar)).call(this));

    _this.setAttrs(_attrs);
    return _this;
  }

  createClass(Bar, [{
    key: 'measureName',
    value: function measureName() {
      var measures = this.measures();
      var yField = void 0;
      if (this.condition() === conditions[2]) yField = mixedMeasure.field;else if (this.aggregated() && measures[0].field === mixedMeasure.field) yField = measures[0].field;else yField = measures[0].field + '-' + measures[0].op;
      return yField;
    }
  }, {
    key: 'renderLayout',
    value: function renderLayout(keep) {
      this.reset(keep);
      this.renderFrame();
      _munge.call(this);
      _scale.call(this, keep);
      this.renderCanvas();
      _axis$1.call(this);
      _region.call(this);
      if (this.isFacet()) {
        _facet.call(this);
      } else {
        _mark.call(this);
      }
      _legend$1.call(this);
      _tooltip$1.call(this);
      _annotation.call(this);
    }
  }, {
    key: 'muteToLegend',
    value: function muteToLegend(d) {
      this.muteLegend(this.isFacet() ? d.parent.data.key : d.data.key);
    }
  }, {
    key: 'muteFromLegend',
    value: function muteFromLegend(legend) {
      if (this.isFacet()) this.muteRegions(legend.key);else this.muteNodes(legend.key);
    }
  }, {
    key: 'demuteToLegend',
    value: function demuteToLegend(d) {
      this.demuteLegend(this.isFacet() ? d.parent.data.key : d.data.key);
    }
  }, {
    key: 'demuteFromLegend',
    value: function demuteFromLegend(legend) {
      if (this.isFacet()) this.demuteRegions(legend.key);
      this.demuteNodes(legend.key);
    }
  }, {
    key: 'isCount',
    value: function isCount() {
      return this.condition() === conditions[1];
    }
  }, {
    key: 'isFacet',
    value: function isFacet() {
      return this.facet() && this.isNested() && !this.stacked();
    }
  }, {
    key: 'isMixed',
    value: function isMixed() {
      return this.condition() === conditions[2];
    }
  }, {
    key: 'isNested',
    value: function isNested() {
      var dimensions = this.dimensions();
      var condition = this.condition();
      return dimensions.length === 2 || condition == conditions[2] && dimensions.length === 1;
    }
  }, {
    key: 'isVertical',
    value: function isVertical() {
      return this.orient() === orients[0];
    }
  }]);
  return Bar;
}(mix(Facet).with(sortMixin, paddingMixin, stackMixin));

/**
 * If annotation is specified, sets the annotation settings and returns the instance itself. This annotation feature only works in the mono-bar condition and shows differences between bars. If annotation value is true or the it's showLable property is true, shows the label. If annotation is not specified, returns the instance's current annotation setting.
 * @function
 * @example
 * bar.annotation(true); //shows the annotation which shows the difference between bars
 * @param {boolean|object} [annotation=false] It is true or showLabel is true shows annotation label.
 * @param {boolean} annotation.showLabel=true 
 * @param {string} [annotation.color=#477cd2] sets the annotation label color
 * @return {annotation|Bar}
 */


Bar.prototype.annotation = setMethodFromDefaultObj('annotation', { showLabel: true, color: '#477cd2' });

/**
 * If showDiff is specified, sets the showDiff settings and returns the instance itself. This showDiff feature only works in the grouped stacked-bar condition and shows differences between bars. If showDiff value is true or object, shows the differences. If showDiff is not specified, returns the instance's current showDiff setting.
 * @function
 * @example
 * bar.showDiff(true); //shows the diffrences between stacked bars
 * @param {boolean|object} [showDiff=false] It is true or showLabel is true shows annotation label.
 * @param {string} showDiff.neuFill=#c0ccda 
 * @param {string} showDiff.incStroke=#477cd2 
 * @param {string} showDiff.incFill=#40bbfb 
 * @param {string} showDiff.decStroke=#f06292 
 * @param {string} showDiff.decFill=#f06292 
 * @return {showDiff|Bar}
 */
Bar.prototype.showDiff = setMethodFromDefaultObj('showDiff', { neuFill: '#c0ccda', incStroke: '#477cd2', incFill: '#40bbfb', decStroke: '#f06292', decFill: '#f06292' });

/**
 * If annotation is specified, sets the mono settings and returns the instance itself. This mono feature only works in the mono-bar condition. It render bars with different colors when it is false.  If mono is not specified, returns the instance's current annotation setting.
 * @function
 * @example
 * bar.mono(false); // renders bars with different colors according to its color pattern
 * @param {boolean} [mono=true]
 * @return {mono|Bar}
 */
Bar.prototype.mono = attrFunc('mono');

/**
 * If orient is specified, sets theorientmono settings and returns the instance itself. It transforms the bar chart's orient according to the value. If orient is not specified, returns the instance's current orient setting.
 * @function
 * @example
 * bar.orient('horizontal'); // renders the horizontal bar chart
 * @param {string} [orient='vertical'] (vertical|horizontal)
 * @return {orient|Bar}
 */
Bar.prototype.orient = attrFunc('orient');

var bar = genFunc(Bar);

function brushGen(brushGen) {
  if (!arguments.length) return this.__attrs__.brushGen;
  this.__attrs__.brushGen = brushGen;
  var dispatch$$1 = this.__execs__.brushDispatch;
  brushGen.on('start.brushable', function () {
    dispatch$$1.apply('brushStart', this, arguments);
  }).on('brush.brushable', function () {
    dispatch$$1.apply('brushed', this, arguments);
  }).on('end.brushable', function () {
    dispatch$$1.apply('brushEnd', this, arguments);
  });
  return this;
}

function brushMove(group, selection) {
  var brush$$1 = this.brushGen();
  group.call(brush$$1.move, selection);
  return this;
}

var _attrs$12 = {
  brush: false,
  brushGen: null
};
var brushMixin = function brushMixin(Base) {
  /**
   * Adds Brush Features
   * @mixin BrushMixin
   */
  var BrushMixin = function (_Base) {
    inherits(BrushMixin, _Base);

    function BrushMixin() {
      classCallCheck(this, BrushMixin);

      var _this = possibleConstructorReturn(this, (BrushMixin.__proto__ || Object.getPrototypeOf(BrushMixin)).call(this));

      _this.setAttrs(_attrs$12);
      _this.__execs__.brush = null;
      _this.__execs__.brushDispatch = d3.dispatch('brushStart', 'brushed', 'brushEnd');
      _this.rebindOnMethod(_this.__execs__.brushDispatch);
      return _this;
    }

    return BrushMixin;
  }(Base);
  /**
   * If brush is specified, sets the brush settings and returns the instance itself. If brush is true, renders its brush. If brush is not specified, returns the instance's current brush setting.
   * @memberOf BrushMixin
   * @function
   * @example
   * brush.brush(true); //shows brush
   * @param {boolean} [brush=false]
   * @return {brush|BrushMixin}
   */
  BrushMixin.prototype.brush = attrFunc('brush');
  /**
   * @private
   */
  BrushMixin.prototype.brushGen = brushGen;
  /**
   * @private
   */
  BrushMixin.prototype.brushMove = brushMove;
  return BrushMixin;
};

var _attrs$13 = {
  fitLine: false
};

var fitLineMixin = function fitLineMixin(Base) {
  /**
   * adds FitLine features
   * @mixin FitLineMixin
   */
  var FitLineMixin = function (_Base) {
    inherits(FitLineMixin, _Base);

    function FitLineMixin() {
      classCallCheck(this, FitLineMixin);

      var _this = possibleConstructorReturn(this, (FitLineMixin.__proto__ || Object.getPrototypeOf(FitLineMixin)).call(this));

      _this.setAttrs(_attrs$13);
      return _this;
    }

    return FitLineMixin;
  }(Base);
  /**
   * If is true, renders a mean line of serieses or points. If is not specified, returns the current fitLine setting.
   * @memberOf FitLineMixin
   * @function
   * @example
   * fitLineMixin.fitLine(true)
   * @param {boolean} [fitLine=false]
   * @return {fitLine|FitLineMixin}
   */
  FitLineMixin.prototype.fitLine = attrFunc('fitLine');
  return FitLineMixin;
};

function seriesName(_val) {
  if (!arguments.length || _val === false) return this.__attrs__.seriesName;else if (typeof _val === 'boolean' && _val) {
    return this.__attrs__.seriesName.split('.').join(' ').trim();
  } else if (typeof _val === 'string') {
    this.__attrs__.seriesName = _val;
    //this.__attrs__.seriesName.split('.').join(' ').trim();
  }
  return this;
}

var curves = ['linear', 'stepped', 'curved'];
var _attrs$14 = {
  curve: curves[0],
  point: false,
  pointRatio: 3,
  seriesName: className('mark series', true)
};

var seriesMixin = function seriesMixin(Base) {
  /**
   * @mixin SeriesMixin
   */
  var SeriesMixin = function (_Base) {
    inherits(SeriesMixin, _Base);

    function SeriesMixin() {
      classCallCheck(this, SeriesMixin);

      var _this = possibleConstructorReturn(this, (SeriesMixin.__proto__ || Object.getPrototypeOf(SeriesMixin)).call(this));

      _this.setAttrs(_attrs$14);
      return _this;
    }

    return SeriesMixin;
  }(Base);
  SeriesMixin.prototype.seriesName = seriesName;

  /**
   * sets a curve type. If is not specified, returns the current curve setting.
   * @memberOf SeriesMixin
   * @function
   * @example
   * series.curve('curved') //renders Catmull-Rom spline curve
   * series.curve();
   * @param {string} [curve=linear] (linear|stepped|curved)
   * @return {curve|SeriesMixin}
   */
  SeriesMixin.prototype.curve = attrFunc('curve');
  /**
   * If is true, renders a point mark on each data point. If is not specified, returns the current point setting.
   * @memberOf SeriesMixin
   * @function
   * @example
   * series.point(true)
   * @param {boolean} [point=false]
   * @return {point|SeriesMixin}
   */
  SeriesMixin.prototype.point = attrFunc('point');
  /**
   * sets point radius relative to the line width. If is not specified, returns the current pointRatio setting.
   * @memberOf SeriesMixin
   * @function
   * @example
   * series.pointRatio(5) // the point radius will be 5 times as large as the line width.
   * @param {number} [pointRatio=3]
   * @return {pointRatio|SeriesMixin}
   */
  SeriesMixin.prototype.pointRatio = attrFunc('pointRatio');
  return SeriesMixin;
};

function pointNum() {
  var nested = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  if (nested) {
    return d3.max(this.__execs__.munged, function (d) {
      return d.children.length;
    });
  } else {
    return this.__execs__.munged.length;
  }
}

/**
 * If zoom is string, selects a zoom type. If zoom is true, use the normal zoom type. If zoom is not specified, renders the current zoom Setting.
 * @memberOf ZoomMixin#
 * @function
 * @example
 * zoomMixin.zoom(true) // selects normal zoom type
 * zoomMixin.zoom(false) // disable the zoom feature.
 * zoomMixin.zoom('brush') // selects brushable zoom type.
 * @param {boolean|string} [zoom=false] 
 * @return {zoom|ZoomMixin}
 */
function zoom$1(zoom$$1) {
  var types = ['normal', 'brush'];
  if (!arguments.length) return this.__attrs__.zoom;
  if (typeof zoom$$1 === 'boolean') {
    if (zoom$$1) this.__attrs__.zoom = 'normal';else this.__attrs__.zoom = false;
  } else if (typeof zoom$$1 === 'string') {
    if (types.findIndex(function (d) {
      return d.localeCompare(zoom$$1) === 0;
    }) >= 0) {
      this.__attrs__.zoom = zoom$$1;
    }
  }
  return this;
}

function zoomExtent() {
  var nested = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var isDual = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var unit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;

  var pointNum = this.pointNum(nested);
  var scale = this.__execs__.scale;
  var range$$1 = scale.x.range();
  var rangeDist = Math.abs(range$$1[1] - range$$1[0]);
  if (isDual) {
    var yRange = scale.y.range();
    var yRangeDist = Math.abs(yRange[1] - yRange[0]);
    if (rangeDist > yRangeDist) rangeDist = yRangeDist;
  }
  var max$$1 = pointNum * pointNum / rangeDist;
  return [1, Math.ceil(max$$1 * unit)];
}

function zoomed(renderFunc) {
  var isDual = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var zoom$$1 = this.zoomGen();
  var that = this;
  var field = this.__execs__.field;
  var axisObj = this.__execs__.axis;
  var axisX = axisObj && axisObj.x ? axisObj.x[field.x.field()] : null;
  var scaleObj = this.__execs__.scale;
  var scaleX = scaleObj.x; //stroe original scale
  var axisY = isDual && axisObj && axisObj.y ? axisObj.y[field.y.field()] : null;
  var scaleY = isDual ? scaleObj.y : null;

  var _axis = function _axis(transform) {
    var newScaleX = transform.rescaleX(scaleX);
    scaleObj.x = newScaleX;
    if (axisX) {
      axisX.scale(newScaleX);
      axisX.render(null, true);
    }
    if (isDual) {
      var newScaleY = transform.rescaleX(scaleY);
      scaleObj.y = newScaleY;
      if (axisY) {
        axisY.scale(newScaleY);
        axisY.render(null, true);
      }
    }
  };

  zoom$$1.on('zoom.zoomable.zoomed', function () {
    var transform = d3.event.transform;
    if (!transform) return;
    _axis(transform);
    if (that.__execs__.tooltip) that.__execs__.tooltip.hide(); //reset tooltip
    renderFunc();
  });
  return this;
}

function zoomGen(_val) {
  if (!arguments.length) return this.__attrs__.zoomGen;
  this.__attrs__.zoomGen = _val;
  var that = this;
  var dispatch$$1 = that.__execs__.zoomDispatch;
  _val.on('zoom.zoomable', function () {
    dispatch$$1.apply('zoom', this, arguments);
  });
  return this;
}

function zoomTransform(group, transform) {
  group.call(this.zoomGen().transform, transform);
  return this;
}

var _attrs$15 = {
  zoom: false,
  zoomGen: null
};

var zoomMixin = function zoomMixin(Base) {
  /**
   * @mixin ZoomMixin
   */
  var ZoomMixin = function (_Base) {
    inherits(ZoomMixin, _Base);

    function ZoomMixin() {
      classCallCheck(this, ZoomMixin);

      var _this = possibleConstructorReturn(this, (ZoomMixin.__proto__ || Object.getPrototypeOf(ZoomMixin)).call(this));

      _this.setAttrs(_attrs$15);
      _this.__execs__.zoom = null;
      _this.__execs__.zoomDispatch = d3.dispatch('zoom');
      _this.rebindOnMethod(_this.__execs__.zoomDispatch);
      return _this;
    }

    return ZoomMixin;
  }(Base);
  ZoomMixin.prototype.pointNum = pointNum;
  ZoomMixin.prototype.zoom = zoom$1;
  ZoomMixin.prototype.zoomed = zoomed;
  ZoomMixin.prototype.zoomExtent = zoomExtent;
  ZoomMixin.prototype.zoomGen = zoomGen;
  ZoomMixin.prototype.zoomTransform = zoomTransform;
  ZoomMixin.prototype.isBrushZoom = isBrushZoom;
  setMethodsFromAttrs(ZoomMixin, _attrs$15);
  return ZoomMixin;
};

function isBrushZoom() {
  return this.__attrs__.zoom && this.__attrs__.zoom === 'brush';
}

var _attrs$16 = {
  shape: null
};

var shapeMixin = function shapeMixin(Base) {
  /**
   * @mixin ShapeMixin
   */
  var ShapeMixin = function (_Base) {
    inherits(ShapeMixin, _Base);

    function ShapeMixin() {
      classCallCheck(this, ShapeMixin);

      var _this = possibleConstructorReturn(this, (ShapeMixin.__proto__ || Object.getPrototypeOf(ShapeMixin)).call(this));

      _this.setAttrs(_attrs$16);
      return _this;
    }

    return ShapeMixin;
  }(Base);
  /**
   * selects a shape type. Available shapes depends on the chart type. If shape is not specified, returns the current shape setting.
   * @memberOf ShapeMixin
   * @function
   * @example
   * line.shape('area')
   * parCoords.shape('scatter-matrix')
   * treemap.shape('pack')
   * @param {string} [shape]
   * @return {shape|ShapeMixin}
   */
  ShapeMixin.prototype.shape = attrFunc('shape');
  return ShapeMixin;
};

function _brush() {
  if (!this.brush()) return;
  var canvas = this.__execs__.canvas;
  var innerSize = this.innerSize();
  var brushGen = d3.brushX().extent([[0, 0], [innerSize.width, innerSize.height]]);
  var brushG = canvas.selectAll('.brush.x').data([innerSize]);
  brushG.exit().remove();
  brushG.enter().append('g').attr('class', 'brush x').merge(brushG).attr('transform', 'translate(' + [0, 0] + ')').call(brushGen);

  this.brushGen(brushGen);
}

function _legend$3() {
  var field = this.__execs__.field;
  if (!field.region) {
    return;
  }
  this.renderLegend();
}

function _brushZoom() {
  var _this = this;

  var ratio = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.75;

  var that = this;
  var innerSize = this.innerSize();
  var bigHeight = Math.round(innerSize.height * ratio);
  var smallHeight = innerSize.height - bigHeight;
  var settings = ['axis', 'axisTitles', 'color', 'curve', 'multiTooltip', 'normalized', 'padding', 'point', 'pointRatio', 'regionPadding', 'shape', 'size', 'stacked', 'grid', 'font', 'label', 'tooltip'].map(function (d) {
    return { key: d, value: _this[d]() };
  });
  var lines = [];
  var __regionLocal = function __regionLocal(d, i) {
    d.x = 0;
    d.y = i === 0 ? 0 : bigHeight;
  };
  var region = this.renderRegion(__regionLocal, [{ h: bigHeight }, { h: smallHeight }], true);
  region.each(function (d, i) {
    var l = line$2().container(this).data(that.data()).dimensions(that.dimensions()).measures(that.measures()).width(innerSize.width).height(d.h).legend(false).zeroMargin(true).parent(that);
    settings.forEach(function (d) {
      return l[d.key](d.value);
    });
    if (i == 0) {
      //big
      var xAt = l.axis().find(function (d) {
        return d.target === 'x';
      });
      if (xAt) xAt.showTitle = false;
      l.brush(false).zoom('normal');
    } else {
      l.multiTooltip(false).tooltip(false).brush(true).point(false);
    }
    l.render();
    lines.push(l);
  });
  //legend
  if (this.isNested()) {
    var regionDomain = this.__execs__.field.region.munged(this.__execs__.munged).level(0).domain();
    this.scale().color = d3.scaleOrdinal().domain(regionDomain).range(this.color());
    _legend$3.call(this);
  }

  //control brush+zoom
  var brushScale = lines[1].__execs__.scale.x;
  var brushGroup = lines[1].__execs__.canvas.select('.brush.x');
  var zoomScale = lines[0].__execs__.scale.x; //maintain inital scale
  var zoomGroup = this.__execs__.canvas;
  lines[0].on('zoom.line', function () {
    if (d3.event.sourceEvent && (d3.event.sourceEvent.type === 'zoom' || d3.event.sourceEvent.type === "end" || d3.event.sourceEvent.type === "brush")) return; // ignore brush-by-zoom
    var newDomain = d3.event.transform.rescaleX(brushScale).domain();
    lines[1].brushMove(brushGroup, newDomain.map(brushScale));
  });
  lines[1].on('brushed.line brushEnd.line', function () {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return; // ignore brush-by-zoom
    var range$$1 = d3.event.selection || brushScale.range();
    var domain = range$$1.map(brushScale.invert);
    range$$1 = domain.map(zoomScale);
    lines[0].zoomTransform(zoomGroup, d3.zoomIdentity.scale((zoomScale.range()[1] - zoomScale.range()[0]) / (range$$1[1] - range$$1[0])).translate(-range$$1[0], 0));
  });
}

function _mark$2() {
  var zoomed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  var that = this;
  var canvas = this.__execs__.canvas;
  var field = this.__execs__.field;
  var nested = this.isNested.call(this);
  var scale = this.__execs__.scale;
  var stacked = this.isStacked();
  var color = this.color();
  var label = this.label();
  var individualScale = this.isIndividualScale();
  var size = this.size();
  var showPoint = this.point();
  var pointRatio = this.pointRatio();
  var trans = zoomed ? d3.transition().duration(0).delay(0) : d3.transition().duration(this.transition().duration).delay(this.transition().delay);
  var isArea = this.shape() === shapes[1];
  var yField = this.measureName();
  var curve = this.curve() === curves[0] ? d3.curveLinear : this.curve() === curves[1] ? d3.curveStep : d3.curveCatmullRom;
  var scaleBandMode = this.scaleBandMode();
  var multiTooltip = this.multiTooltip();
  var xValue = function xValue(d) {
    return scale.x(field.x.interval() ? new Date(d.data.key) : d.data.key) + (scaleBandMode ? scale.x.bandwidth() / 2 : 0);
  };
  var yValueFunc = function yValueFunc(s) {
    return function (d) {
      return stacked ? s(d.data.value[yField + '-end']) : s(d.data.value[yField]);
    };
  };
  var lineInitGen = d3.line().x(xValue).y(d3.max(scale.y.range())).curve(curve);
  var lineGenFunc = function lineGenFunc(ys) {
    return d3.line().x(xValue).y(yValueFunc(ys)).curve(curve);
  };
  var areaInitGen = d3.area().x(xValue).y(d3.max(scale.y.range())).curve(curve);
  var areaGenFunc = function areaGenFunc(ys) {
    return d3.area().x(xValue).y0(function (d) {
      return stacked ? scale.y(d.data.value[yField + '-start']) : d3.max(scale.y.range());
    }).y1(yValueFunc(ys)).curve(curve);
  };
  var __local = function __local(selection) {
    var tFormat = function tFormat(key) {
      var f = field.x.isInterval() ? d3.timeFormat(field.x.format()) : null;
      return f ? f(key) : key;
    };
    selection.each(function (d, i, arr) {
      d.value = stacked ? d.data.value[yField + '-end'] : d.data.value[yField];
      d.x = xValue(d);
      d.y = yValueFunc(individualScale ? d.parent.scale : scale.y)(d);
      d.anchor = i === 0 ? 'start' : i === arr.length - 1 ? 'end' : 'middle';
      d.text = labelFormat(d.value);
      d.color = d.parent.color;
      d.key = tFormat(d.data.key);
    });
  };

  var __upward = function __upward(selection) {
    selection.each(function (d, i, arr) {
      var upward = true;
      //let result = mark.get(this);
      if (i < arr.length - 1 && arr[i + 1]) {
        var nextResult = arr[i + 1];
        upward = nextResult.y <= d.y;
      }
      d.upward = upward;
    });
  };

  var __seriesInit = function __seriesInit(selection) {
    var area$$1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (area$$1) {
      selection.each(function (d) {
        var target = d.children;
        d3.select(this).attr('d', areaInitGen(target)).attr('fill-opacity', 0.4).style('stroke', 'none');
      });
    } else {
      selection.each(function (d) {
        var target = d.children;
        d3.select(this).attr('d', lineInitGen(target)).style('fill', 'none');
      });
    }
  };
  var __series = function __series(selection) {
    var area$$1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var c = function c(d) {
      return nested ? scale.color(d.data.key) : color[0];
    };
    if (area$$1) {
      selection.each(function (d) {
        var target = d.children;
        d3.select(this).transition(trans).attr('d', areaGenFunc(individualScale ? d.scale : scale.y)(target));
      }).attr('fill', c).attr('stroke', 'none');
    } else {
      selection.each(function (d) {
        var target = d.children;
        d3.select(this).transition(trans).attr('d', lineGenFunc(individualScale ? d.scale : scale.y)(target));
      }).attr('stroke', c).attr('stroke-width', size.range[0] + 'px');
    }
  };
  var __pointInit = function __pointInit(selection) {
    selection.attr('r', (size.range[0] - size.range[0] / 4) * pointRatio).attr('stroke-width', size.range[0] / 4 * pointRatio).style('fill', '#fff').attr('opacity', showPoint ? 1 : 0).style('cursor', 'pointer').attr('cx', function (d) {
      return d.x;
    }).attr('cy', d3.max(scale.y.range()));
  };
  var __point = function __point(selection) {
    selection.transition(trans).attr('r', (size.range[0] - size.range[0] / 4) * pointRatio).attr('stroke-width', size.range[0] / 4 * pointRatio).attr('opacity', showPoint ? 1 : 0).attr('cx', function (d) {
      return d.x;
    }).attr('cy', function (d) {
      return d.y;
    });
  };
  var __labelInit = function __labelInit(selection) {
    selection.each(function (d) {
      var selection = d3.select(this);
      selection.attr('x', d.x).attr('y', d3.max(scale.y.range())).attr('stroke', 'none').text(d.text);
      that.styleFont(selection);
    });
  };
  var __label = function __label(selection) {
    selection.each(function (d) {
      var selection = d3.select(this);
      selection.attr('text-anchor', d.anchor).style('pointer-events', multiTooltip ? 'none' : 'all').transition(trans).attr('y', d.y + (size.range[0] / 2 * pointRatio + 1) * (d.upward ? 1 : -1)).attr('x', d.x).attr('dy', d.upward ? '.71em' : 0).style('visibility', label ? 'visible' : 'hidden').text(d.text);
      that.styleFont(selection);
    });
  };

  var __appendSeries = function __appendSeries(selection) {
    var series = selection.select(that.seriesName());
    if (series.empty()) {
      series = selection.append('g').attr('class', that.seriesName(true));
    }
    var ___append = function ___append(selection, area$$1) {
      var path = selection.selectAll('path' + className(area$$1 ? 'area' : 'line', true)).data(function (d) {
        return [d];
      });
      path.exit().remove();
      path.enter().append('path').attr('class', className(area$$1 ? 'area' : 'line')).call(__seriesInit, area$$1).merge(path, area$$1).call(__series, area$$1).style('pointer-events', 'none');
    };
    if (isArea) {
      series.call(___append, true);
    } else {
      // remove area
      series.selectAll('path' + className('area', true)).remove();
    }
    series.call(___append, false);
  };

  var __appendPoints = function __appendPoints(selection) {
    selection.attr('fill', function (d) {
      return d.color;
    }).attr('stroke', function (d) {
      return d.color;
    });
    var point = selection.selectAll(that.nodeName()).data(function (d) {
      return d.children;
    }, function (d) {
      return d.data.key;
    });
    point.exit().remove();
    var pointEnter = point.enter().append('g').attr('class', that.nodeName(true)).call(__local);
    pointEnter.append('circle').call(__pointInit);
    pointEnter.append('text').call(__labelInit);
    point.call(__local);
    point = pointEnter.merge(point).call(__upward);
    point.select('circle').call(__point);
    point.select('text').call(__label);
  };
  var region = canvas.selectAll(this.regionName());
  region.each(function () {
    d3.select(this).each(function (d) {
      d.children.sort(function (a, b) {
        return xValue(a) - xValue(b);
      });
    }).call(__appendSeries).call(__appendPoints);
  });
}

function _munge$2() {
  var _this = this;

  var conditionFunc = function conditionFunc(dimensions, measures) {
    var field = this.__execs__.field;
    if (dimensions.length <= 2 && measures.length < 2) {
      if (dimensions[1]) field.region = dimensionField(dimensions[1]);
      field.x = dimensionField(dimensions[0]);
      if (measures.length === 0) this.measure(countMeasure); //use fake-measure for counting
      field.y = measureField(measures[0]);
      if (measures.length === 0) return conditions$1[1];else if (measures.length === 1) return conditions$1[0];
    } else if (dimensions.length === 1 && measures.length >= 2) {
      field.region = dimensionField(this.mixedDimension());
      field.x = dimensionField(dimensions[0]);
      field.y = measureField(mixedMeasure).mixed(true).measures(measures);
      return conditions$1[2];
    } else throw new ConditionException();
  };
  this.condition(conditionFunc);
  var field = this.__execs__.field;
  var mixed = this.isMixed();

  if (this.aggregated()) {
    this.__execs__.munged = [this.data()];
  } else if (mixed) {
    this.__execs__.munged = this.aggregateMixed(true);
  } else {
    this.__execs__.munged = this.aggregate(true);
    if (!this.isNested()) {
      this.__execs__.munged = [this.__execs__.munged[0].parent];
    }
  }
  if (this.isStacked()) {
    var munged = this.__execs__.munged;
    var orderList = munged[0].children.map(function (d) {
      return d.data.key;
    });
    //use temporary structure using zip
    munged.forEach(function (m, i) {
      if (i > 0) {
        m.children.sort(comparator('ascending', orderList, true, function (d) {
          return d.data.key;
        }));
      }
    }); //sort zipped
    var valuesZipped = munged.map(function (d) {
      return d.children;
    });
    valuesZipped = d3.zip.apply(null, valuesZipped);
    valuesZipped.forEach(function (d) {
      stack(d, field.y, _this.normalized());
    });
  }
}

function individualDomain(target, measureField) {
  var padding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var field = measureField.field();
  var domain = target.children.map(function (d) {
    return d.data.value[field];
  });
  domain = d3.extent(domain);
  if (padding <= 0) return domain;
  var dist = Math.abs(domain[0] - domain[1]);
  dist *= padding * 0.5;
  return [domain[0] - dist, domain[1] + dist];
}

function _scale$2(keep) {
  var _this = this;

  var scale = this.scale();
  var munged = this.__execs__.munged;
  var individualScale = this.isIndividualScale();
  var nested = this.isNested();
  var stacked = this.isStacked();
  var facet = this.facet();
  var aggregated = this.aggregated();
  var field = this.__execs__.field;
  var isMixed = this.isMixed();
  var level = 1;
  var xAt = this.axisX();
  var yAt = this.axisY();
  var yDomain = void 0,
      xDomain = void 0;
  var regionDomain = void 0;

  scale.y = d3.scaleLinear();
  if (nested) {
    regionDomain = field.region.level(0).munged(munged).domain();
    scale.color = this.updateColorScale(regionDomain, keep);
  }

  if (this.isFacet()) {
    scale.region = d3.scaleBand().domain(regionDomain).padding(this.regionPadding());
    if (facet.orient === 'horizontal' && xAt) {
      xAt.orient = 'top';
      xAt.showDomain = false;
      this.thickness(xAt, scale.region, true, true);
      if (yAt) yAt.thickness = 0;
    } else if (facet.orient === 'vertical' && yAt) {
      yAt.orient = 'right';
      yAt.showDomain = false;
      this.thickness(yAt, scale.region, false, true);
      if (xAt) xAt.thickness = 0;
    }
    var _innerSize = this.innerSize();
    if (facet.orient === 'vertical') {
      scale.region.rangeRound([0, _innerSize.height]);
    } else {
      scale.region.rangeRound([0, _innerSize.width]);
    }
    return;
  }

  xDomain = field.x.munged(munged).level(level).domain();
  yDomain = field.y.munged(munged).level(level).aggregated(aggregated).domain(0, stacked);

  //use scaleLinear when domain is number
  var isNumberDomain = true;
  for (var i = 0; i < xDomain.length; i++) {
    var d = xDomain[i];
    if (isNaN(d)) {
      isNumberDomain = false;
      break;
    }
  }
  var isOrdinal = false;
  if (this.scaleBandMode()) {
    scale.x = d3.scaleBand().padding(this.padding());
    isOrdinal = true;
  } else if (field.x.interval() || isNumberDomain) {
    if (field.x.order() === 'natural') {
      if (xDomain[0] instanceof Date) xDomain = d3.extent(xDomain);else xDomain = d3.extent(xDomain.map(function (d) {
        return +d;
      }));
    } else {
      xDomain = [xDomain[0], xDomain[xDomain.length - 1]];
    }
    scale.x = continousScale(xDomain, null, field.x);
  } else {
    scale.x = d3.scalePoint().padding(this.padding());
    isOrdinal = true;
  }
  scale.x.domain(xDomain);
  this.setCustomDomain('y', yDomain);
  if (isMixed && individualScale && yAt) {
    yAt.orient = 'left';
    munged.forEach(function (m) {
      var domain = individualDomain(m, field.y, _this.padding());
      m.scale = d3.scaleLinear().domain(domain).nice();
      m.scale._defaultDomain = domain;
      if (_this.isMixed()) {
        var measure = _this.measures().find(function (d) {
          return d.field === m.data.key;
        });
        if (measure && measure.customDomain) {
          m.scale._defaultDomain = domain;
          m.scale.domain(measure.customDomain);
        }
      }
    });
    this.thickness(yAt, munged[0].scale, false, false);
    var tempAt = Object.assign({}, yAt);
    tempAt.orient = 'right';
    this.axis(tempAt);
    this.thickness(tempAt, munged[munged.length - 1].scale, false, false);
  } else if (yAt) {
    var right = this.axis().find(function (d) {
      return d.target === 'y' && d.orient !== yAt.orient;
    });
    if (right) this.axis(right, false);
    this.thickness(yAt, scale.y, false, false);
  }

  this.thickness(xAt, scale.x, true, isOrdinal);

  var innerSize = this.innerSize();
  scale.x.range([0, innerSize.width]);
  if (isNumberDomain && !this.scaleBandMode()) {
    var d0 = this.padding();
    d0 = innerSize.height * d0 / 2;
    var d1 = innerSize.width - d0;
    if (xDomain[0] === xDomain[1] || xDomain[1] - xDomain[0] === 0) {
      // if no domain, using center
      var center = (d0 + d1) / 2;
      scale.x.range([center, center]);
    } else {
      scale.x.range([d0, d1]);
    }
  }
  scale.y.range([innerSize.height, 0]); //reverse

  if (individualScale) {
    //individual scale 
    munged.forEach(function (m) {
      m.scale.range([innerSize.height, 0]);
    });
  }
}

function _axis$3() {
  var that = this;
  var munged = this.__execs__.munged;
  var scale = this.__execs__.scale;
  var grid = this.grid();
  var individualScale = this.isIndividualScale();
  var innerSize = this.innerSize();
  var fieldObj = this.__execs__.field;

  var _axisScaleX = function _axisScaleX(axisToggle) {
    fieldObj.x.axis(axisToggle);
    var curAxis = that.axisDefault(scale.x, axisToggle);
    if (scale.x.invert) curAxis.grid(grid).gridSize(innerSize.height);
    if (axisToggle.orient === 'bottom') curAxis.y(scale.y.range()[0]);
    return curAxis;
  };

  var _axisScaleY = function _axisScaleY(axisToggle) {
    var scaleY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : scale.y;
    var field = arguments[2];

    if (!field) {
      fieldObj.y.axis(axisToggle);
    } else {
      axisToggle.field = field;
    }
    var curAxis = that.axisDefault(scaleY, axisToggle);
    curAxis.grid(grid).gridSize(innerSize.width);
    if (axisToggle.orient === 'right') curAxis.x(scale.x.range()[1]);
    return curAxis;
  };

  var xAt = this.axisX();
  var yAt = this.axisY();
  if (this.isFacet()) {
    this.axisFacet();
  } else {
    if (xAt) {
      _axisScaleX(xAt);
    }
    if (yAt) {
      if (individualScale) {
        var ats = this.axis().filter(function (d) {
          return d.target === 'y';
        });
        if (munged.length <= 2) {
          ats.forEach(function (d, i) {
            return _axisScaleY(d, munged[i].scale, munged[i].data.key);
          });
        }
      } else {
        _axisScaleY(yAt);
      }
    }
  }
  this.renderAxis();
}

var stroke = '#aaa';

function _meanLine() {
  var canvas = this.__execs__.canvas;
  var meanLineG = canvas.select('.mean-line-g');
  if (!(typeof this.meanLine() === 'number') && (!this.meanLine() || this.isFacet())) {
    meanLineG.remove();
    return;
  }
  var meanLineVal = this.meanLine();
  var ms = [];
  var scale = this.__execs__.scale;
  var trans = d3.transition().duration(this.transition().duration).delay(this.transition().delay);
  if (typeof meanLineVal === 'number') {
    var domain = scale.y.domain();
    if (meanLineVal >= domain[0] && meanLineVal <= domain[1]) {
      ms.push({ value: meanLineVal, y: scale.y(meanLineVal) });
    }
  } else {
    this.regions().filter(function (d) {
      if (typeof meanLineVal === 'string') {
        return d.data.key === meanLineVal;
      } else {
        return true;
      }
    }).each(function (d) {
      var result = { value: d3.mean(d.children, function (d) {
          return d.value;
        }) };
      result.y = scale.y(result.value);
      ms.push(result);
    });
  }

  if (meanLineG.empty) {
    meanLineG = canvas.append('g').attr('class', 'mean-line-g');
  }
  var meanLine = meanLineG.selectAll('.mean-line').data(ms);
  meanLine.exit().remove();

  var meanLineEnter = meanLine.enter().append('g').attr('class', 'mean-line').attr('transform', 'translate(' + [0, scale.y.range()[0]] + ')').style('pointer-events', 'none');
  meanLineEnter.append('line').attr('stroke', stroke).attr('shape-rendering', 'crispEdges').attr('stroke-width', '2px').attr('x2', scale.x.range()[1]);

  meanLine = meanLineEnter.merge(meanLine).transition(trans).attr('transform', function (d) {
    return 'translate(' + [0, d.y] + ')';
  });
  meanLine.select('line').transition(trans).attr('x2', scale.x.range()[1]);
}

function _region$2() {
  var aggregated = this.aggregated();
  var canvas = this.__execs__.canvas;
  var nested = this.isNested();
  var scale = this.__execs__.scale;
  var stacked = this.stacked();
  var facet = this.facet();
  var isFacet = this.isFacet();
  var color = this.color();
  var __regionLocal = function __regionLocal(d) {
    if (aggregated) return;
    var xy = void 0;
    if (!nested) {
      xy = [0, 0];
    } else if (facet && !stacked) {
      xy = [scale.region(d.data.key), 0];
      if (facet.orient === 'vertical') {
        xy.reverse();
      }
    } else {
      xy = [0, 0];
    }
    d.x = xy[0];d.y = xy[1];
    d.color = nested ? scale.color(d.data.key) : color[0];
  };

  //create multiTooltip area
  if (!isFacet && this.multiTooltip()) {
    var multiTooltipG = canvas.select('.multi-tooltip-g');
    if (multiTooltipG.empty()) multiTooltipG = canvas.append('g').attr('class', 'multi-tooltip-g');
  }

  this.renderRegion(__regionLocal, function (d) {
    var target = stacked ? d.slice().reverse() : d;
    return target;
  }, isFacet);
}

function _facet$2() {
  var _this = this;

  var parent = this;
  var scale = this.__execs__.scale;
  var facet = this.facet();
  var canvas = this.__execs__.canvas;
  var innerSize = this.innerSize();
  var dimensions = [this.dimensions()[0]];
  var measures = this.isMixed() ? [mixedMeasure] : this.measures();
  var width = void 0,
      height = void 0;
  var settings = ['axisTitles', 'curve', 'meanLine', 'multiTooltip', 'normalized', 'padding', 'point', 'pointRatio', 'regionPadding', 'shape', 'size', 'grid', 'font', 'label'].map(function (d) {
    return { key: d, value: _this[d]() };
  });
  var hasX = this.axisX();
  var hasY = this.axisY();
  var smallLines = []; //stroe sub-charts
  var _smallLine = function _smallLine(d) {
    var smallLine = line$2().container(this).data(d).dimensions(dimensions).measures(measures).width(width).height(height).legend(false).tooltip(false).parent(parent).zeroMargin(true).aggregated(true).color(scale.color(d.data.key));
    settings.forEach(function (d) {
      return smallLine[d.key](d.value);
    });
    if (hasY) smallLine.axis({ target: 'y', orient: 'left' }); //showTitle: facet.orient === 'horizontal' ? i === 0 : true});
    if (hasX) smallLine.axis({ target: 'x', orient: 'bottom' }); //showTitle: facet.orient === 'horizontal' ? true : i === arr.length-1});
    smallLine.render();
    smallLines.push(smallLine);
  };
  if (facet.orient === 'horizontal') {
    width = scale.region.bandwidth();
    height = innerSize.height;
  } else {
    width = innerSize.width;
    height = scale.region.bandwidth();
  }

  canvas.selectAll('.facet').each(_smallLine);
  smallLines.forEach(function (sm) {
    //deal sub-chart's event
    sm.on('selectStart.facet selectMove.facet selectEnd.facet', function (tick) {
      //propgate events to other sub-chart
      //let start = event.type === 'mouseenter';
      smallLines.forEach(function (osm) {
        if (osm !== sm) {
          osm.showMultiTooltip(tick);
        }
      });
    });
  });
}

var fitLineColor = '#c0ccda';
function _fitLine () {
  var canvas = this.__execs__.canvas;
  var scale = this.__execs__.scale;
  var trans = d3.transition().duration(this.transition().duration).delay(this.transition().delay);
  var fitLineVal = this.fitLine();
  var fitLineG = canvas.selectAll(className('fit-line-g', true));
  if (!fitLineVal || !scale.x.invert) {
    if (!fitLineG.empty()) canvas.select(className('fit-line-g', true)).remove();
    return;
  }
  var leastSquares = this.leastSquare(fitLineVal);
  var xValues = scale.x.domain();
  var yValues = leastSquares.map(function (l) {
    return xValues.map(function (d) {
      return l.slope * d + l.intercept;
    });
  });

  if (fitLineG.empty()) {
    fitLineG = canvas.append('g').attr('class', className('fit-line-g')).attr('clip-path', 'url(#' + canvas.selectAll(className('canvas-g-clip-path', true)).attr('id'));
  }
  fitLineG.datum(yValues);

  var fitLine = fitLineG.selectAll(className('fit-line', true)).data(function (d) {
    return d;
  });
  fitLine.exit().remove();
  var fitLineEnter = fitLine.enter().append('line').attr('class', className('fit-line')).style('fill', 'none').style('stroke', fitLineColor).style('stroke-width', 1).attr('x1', scale.x(xValues[0])).attr('x2', scale.x(xValues[1])).attr('y1', function (d) {
    return (d.scale ? d.scale : scale.y).range()[0];
  }).attr('y2', function (d) {
    return (d.scale ? d.scale : scale.y).range()[0];
  });
  fitLine = fitLineEnter.merge(fitLine);
  fitLine.transition(trans).attr('x1', scale.x.range()[0], scale.x(xValues[0])).attr('x2', scale.x(xValues[1])).attr('y1', function (d) {
    return (d.scale ? d.scale : scale.y)(d[0]);
  }).attr('y2', function (d) {
    return (d.scale ? d.scale : scale.y)(d[1]);
  });
}

var defaultFont$5 = {
  'font-family': 'sans-serif',
  'font-size': 12,
  'font-weight': 'normal',
  'font-style': 'normal'
};
var pointOriginColor = '#fff';
var baseColor = '#b0bec5';
var _attrs$17 = {
  anchor: { x: 'left', y: 'top' },
  color: baseColor,
  dx: 0,
  dy: 0,
  height: null,
  font: defaultFont$5,
  nodeName: className('mark node', true),
  tooltip: null,
  target: null,
  valueFormat: null,
  width: null,
  sortByValue: { type: 'natural' },
  x: 0,
  y: 0
};

var MultiTooltip = function MultiTooltip() {
  classCallCheck(this, MultiTooltip);

  this.__attrs__ = JSON.parse(JSON.stringify(_attrs$17));
  this.__execs__ = { tooltip: null, domain: null, dispatch: d3.dispatch('start', 'move', 'end') };
  this.valueFormat(labelFormat);
  rebindOnMethod(this, this.__execs__.dispatch);
};

function _multiTooltip() {
  return new MultiTooltip();
}

function _event$1(selection) {
  var that = this;
  var domain = this.__execs__.domain;
  var dispatch$$1 = this.__execs__.dispatch;
  var bisectDomain = d3.bisector(function (d) {
    return d.x;
  }).right;
  var lastTick = null;

  var _tick = function _tick() {
    var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    var clientRectLeft = selection.node().getBoundingClientRect().left;
    var x = d3.event.x - clientRectLeft;
    var i = bisectDomain(domain, x);
    if (i > 0 && i < domain.length) {
      var d1 = Math.abs(x - domain[i - 1].x);
      var d2 = Math.abs(domain[i].x - x);
      if (d1 < d2) i = i - 1;
    }
    i = Math.max(0, Math.min(domain.length - 1, i));
    var tick = domain[i];
    if (!lastTick || tick.x !== lastTick.x || start) {
      _show.call(that, selection, tick);
      dispatch$$1.call(start ? 'start' : 'move', this, tick);
      lastTick = tick;
    }
  };

  selection.on('mouseenter.multi-tooltip', function () {
    _tick(true);
  }).on('mousemove.multi-tooltip', function () {
    _tick(false);
  }).on('mouseleave.multi-tooltip', function () {
    _hide.call(that, selection);
    dispatch$$1.call('end', this);
    lastTick = null;
  });
}

function _domain() {
  var target = this.target();
  var points = target.__execs__.canvas.selectAll(this.nodeName());
  var domain = [];
  points.each(function (d) {
    //const result = mark.get(this);
    var find = domain.find(function (dd) {
      return dd.x === d.x;
    });
    if (find) {
      find.points.push(this);
    } else {
      domain.push({ x: d.x, points: [this], value: d.key });
    }
  });
  this.__execs__.domain = domain.sort(function (a, b) {
    return a.x - b.x;
  });
}

function _hide(selection) {
  var trans = d3.transition().duration(180);
  selection.select(className('baseline', true)).transition(trans).attr('opacity', 0);

  var target = this.target();
  var circle = target.nodes().filter(function () {
    return d3.select(this).classed(className('show'));
  }).classed(className('show'), false).selectAll('circle');
  if (!target.point()) circle.attr('opacity', 0);else circle.style('fill', pointOriginColor);
  if (this.tooltip()) this.tooltip().hide();
}

function _render$4(selection) {
  var innerSize = this.target().innerSize();
  selection.style('fill', 'none');
  var overlay = selection.select(className('overlay', true));
  if (overlay.empty()) {
    overlay = selection.append('rect').attr('class', className('overlay')).style('cursor', 'crosshair');
    selection.append('line').attr('class', className('baseline')).attr('opacity', 0).attr('shape-rendering', 'crispEdges').attr('pointer-events', 'none');
  }
  selection.select(className('baseline', true)).attr('y1', 0).attr('y2', this.height() ? this.height() : innerSize.height).attr('stroke', baseColor);
  overlay.attr('width', this.width() ? this.width() : innerSize.width).attr('height', this.height() ? this.height() : innerSize.height);
  _domain.call(this);
  _event$1.call(this, selection);
  this.__execs__.tooltip = selection;
}

function _show(selection, tick) {
  var showTrans = d3.transition().duration(140);
  var target = this.target();
  var filtered = [];
  if (!target.point()) {
    //remove existing points
    target.__execs__.canvas.selectAll(this.nodeName()).selectAll('circle').transition(showTrans).attr('opacity', 0);
  } else {
    target.__execs__.canvas.selectAll(this.nodeName()).selectAll('circle').transition(showTrans).style('fill', pointOriginColor);
  }
  var points = d3.selectAll(tick.points).each(function (d) {
    var x = d.x;
    if (x === tick.x) {
      filtered.push({ key: d.key, x: d.x, y: d.y, text: d.text });
    }
  });

  points.classed(className('show'), true).selectAll('circle').transition(showTrans).attr('opacity', 1).style('fill', function (d) {
    return d.color;
  });

  var baseline = selection.select(className('baseline', true));
  baseline.transition(showTrans).attr('opacity', 1).attr('x1', tick.x + 0.5).attr('x2', tick.x + 0.5);
  var tooltip = this.tooltip();
  var x = void 0,
      y = [];
  var values = [];
  d3.selectAll(tick.points).each(function (d) {
    var pos = tooltip.__execs__.mark.get(this);
    x = pos.x;
    y.push(pos.y);
    values.push(d);
  });
  _sortByValue(values, this.sortByValue());
  values = values.map(function (d) {
    return { name: d.parent.data.key || d.data.key, value: d.text };
  });
  y = d3.mean(y);
  y = Math.round(y);
  if (x && y) {
    tooltip.x(x).y(y).key({ name: 'key', value: tick.value }).value(values).show();
  } else {
    tooltip.hide();
  }
}

function hide$2() {
  _hide.call(this, this.__execs__.tooltip);
  d3.dispatch.call('end', this);
}

function render$6(selection) {
  selection = d3.select(selection);
  _render$4.call(this, selection);
}

function tick(tick) {
  //react to external dispatches
  var selection = this.__execs__.tooltip;
  var domain = this.__execs__.domain;
  if (tick !== undefined && tick !== null) {
    var find = domain.find(function (d) {
      return d.value == tick.value;
    });
    _show.call(this, selection, { x: find ? find.x : tick.x, points: find ? find.points : null, value: find ? find.value : null });
  } else {
    _hide.call(this, selection);
  }
}

function _sortByValue(values) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'natural';

  var types = ['natural', 'ascending', 'descending'];
  if (types.find(function (d) {
    return d === type;
  })) {
    if (values.length > 0) {
      if (type === types[1]) {
        values.sort(function (a, b) {
          return d3.ascending(a.value, b.value);
        });
      } else if (type === types[2]) {
        values.sort(function (a, b) {
          return d3.descending(a.value, b.value);
        });
      }
    }
  }
}

MultiTooltip.prototype.hide = hide$2;
MultiTooltip.prototype.render = render$6;
MultiTooltip.prototype.tick = tick;

setMethodsFromAttrs(MultiTooltip, _attrs$17);

function _single() {
  var fromMulti = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  var parent = this.parent();
  var field = this.__execs__.field;
  var mixed = this.isMixed();
  var key = function key(d, text) {
    return { name: 'key', value: text };
  };
  var value = function value(d, text) {
    var name = void 0;
    if (mixed) {
      name = d.key;
    } else if (parent && parent.isMixed()) {
      name = d.key;
    } else {
      name = field.y.field();
    }
    return { name: name, value: text };
  };
  return this.renderTooltip({ dx: this.size().range[0] + 4, value: value, key: key }, fromMulti);
}

function _multi() {
  //multi-tooltip 
  var canvas = this.__execs__.canvas;
  var multiTooltipG = canvas.select(className('multi-tooltip-g', true));
  if (multiTooltipG.empty()) multiTooltipG = canvas.append('g').attr('class', className('multi-tooltip-g'));
  var tooltipObj = _single.call(this, true);
  var multiTooltipObj = _multiTooltip().target(this).dx(this.size().range[0]).dy(this.size().range[0]).color(this.color()[0]).tooltip(tooltipObj).sortByValue(this.multiTooltip().sortByValue);

  multiTooltipObj.render(multiTooltipG.node());
  this.__execs__.tooltip = multiTooltipObj;

  var dispatch$$1 = this.__execs__.multiTooltipDispatch;
  multiTooltipObj.on('start', function (tick) {
    // dispatch events to commute with sub-charts
    dispatch$$1.call('selectStart', this, tick);
    dispatch$$1.call('multiTooltip', this, tick);
  }).on('move', function (tick) {
    dispatch$$1.call('selectMove', this, tick);
    dispatch$$1.call('multiTooltip', this, tick);
  }).on('end', function () {
    dispatch$$1.call('selectEnd', this);
    dispatch$$1.call('multiTooltip', this);
  });

  return multiTooltipObj;
}
function _tooltip$3() {
  if (!this.isFacet() && this.multiTooltip()) _multi.call(this);else if (this.tooltip() && !this.multiTooltip()) _single.call(this, false);
}

function normal() {
  var _this = this;

  var scaleX = this.__execs__.scale.x;
  if (!scaleX.invert) return;
  var canvas = this.__execs__.canvas;
  var zoomExtent = this.zoomExtent(this.isNested());
  var parent = this.parent();
  var zoomGen = d3.zoom().scaleExtent(zoomExtent).translateExtent([[0, 0], [(parent ? parent : this).width(), (parent ? parent : this).height()]]);
  canvas.call(zoomGen);
  this.zoomGen(zoomGen).zoomed(function () {
    _mark$2.call(_this, true); //reset marks
    d3.select((parent ? parent : _this).__execs__.canvas.node().parentNode.parentNode).selectAll(className('tooltip', true)).remove(); //remove existing tooltip
    _tooltip$3.call(_this); //reset tooltips
  });
}

function _zoom() {
  if (!this.zoom()) return;
  if (this.zoom() === 'normal') normal.call(this);
}

var size$2 = { range: [2, 2], scale: 'linear', reverse: false };
var shapes = ['line', 'area'];
var conditions$1 = ['normal', 'count', 'mixed'];
var _attrs$11 = {
  meanLine: false,
  multiTooltip: false,
  padding: 0,
  pointRatio: 2,
  regionPadding: 0.1,
  shape: shapes[0],
  scaleBandMode: false,
  size: size$2,
  individualScale: false
};

/**
 * renders a line chart
 * @class Line
 * @augments Core
 * @augments RectLinear
 * @augments Facet
 * @augments FitLineMixin
 * @augments SeriesMixin
 * @augments BrushMixin
 * @augments ZoomMixin
 * @augments PaddingMixin
 * @augments ShapeMixin
 */

var Line = function (_mix$with) {
  inherits(Line, _mix$with);

  function Line() {
    classCallCheck(this, Line);

    var _this = possibleConstructorReturn(this, (Line.__proto__ || Object.getPrototypeOf(Line)).call(this));

    _this.setAttrs(_attrs$11);
    _this.__execs__.multiTooltipDispatch = d3.dispatch('selectStart', 'selectMove', 'selectEnd', 'multiTooltip');
    _this.rebindOnMethod(_this.__execs__.multiTooltipDispatch);
    return _this;
  }

  /**
   * If is true, renders the tooltip showing multiple points on the same horizontal position. If is a string or object, sets sorting order of items by each value. If multiTooltip is not specified, returns the instance's multiTooltip setting.
   * @example
   * line.multiTooltip(true) // show multiple points on the same horizontal position on a tooltip
   * line.multiTooltip('ascending') //sort items in ascending order by their each value
   * line.multiTooltip(false) 
   * line.multiTooltip() 
   * @param {boolean|string|object} [multiTooltip=false]
   * @param {string} [multiTooltip.sortByValue=natural] (natural|ascending|descending)
   * @return {multiTooltip|Line}
   */


  createClass(Line, [{
    key: 'multiTooltip',
    value: function multiTooltip(_multiTooltip) {
      if (!arguments.length) return this.__attrs__.multiTooltip;
      if (typeof _multiTooltip === 'boolean') {
        if (_multiTooltip) {
          _multiTooltip = { sortByValue: 'natural' };
        }
      }
      if ((typeof _multiTooltip === 'undefined' ? 'undefined' : _typeof(_multiTooltip)) === 'object') {
        if (!_multiTooltip.sortByValue) _multiTooltip.sortByValue = 'natural';
      }
      this.__attrs__.multiTooltip = _multiTooltip;
      return this;
    }

    /**
     * gets a result of linear least squres from serieses. If key is specified, returns the value only froma specific series. It is used for draw fit-lines.
     * @param {string} [key] a name of a series 
     * @example
     * let l = line.data([
     *  {name: 'A', sales: 10, profit: 5},
     *  {name: 'B', sales: 20, profit: 10},
     *  {name: 'C', sales: 30, profit: 3},
     *  ...
     *  ]) //sets data
     *  .dimensions(['name'])
     *  .measures(['sales', 'profit'])
     *  .render();
     * l.leastSquare('A') // returns a result of the series A
     * l.leastSquare() // returns from all serieses
     * @return {object[]} returns [{key: fitLineVal, slope, intercept, rSquare}...] 
     */

  }, {
    key: 'leastSquare',
    value: function leastSquare$$1(key) {
      var measureName = this.measureName();
      var individualScale = this.isIndividualScale();
      return this.__execs__.munged.filter(function (series) {
        if (typeof key === 'string') {
          return series.data.key === key;
        } else {
          return true;
        }
      }).map(function (series) {
        var targets = series.children.map(function (d) {
          return { x: d.data.key, y: d.data.value[measureName] };
        });
        var ls = leastSquare(targets);
        if (individualScale && series.scale) {
          ls.scale = series.scale;
        }
        ls.key = series.data.key;
        return ls;
      });
    }
  }, {
    key: 'measureName',
    value: function measureName() {
      var measures = this.measures();
      var yField = void 0;
      if (this.condition() === conditions$1[2]) yField = mixedMeasure.field;else if (this.aggregated() && measures[0].field === mixedMeasure.field) yField = measures[0].field;else yField = measures[0].field + '-' + measures[0].op;
      return yField;
    }
  }, {
    key: 'isCount',
    value: function isCount() {
      return this.condition() === conditions$1[1];
    }
  }, {
    key: 'isFacet',
    value: function isFacet() {
      return this.facet() && this.isNested() && !this.stacked();
    }
  }, {
    key: 'isIndividualScale',
    value: function isIndividualScale() {
      return this.individualScale() && this.isNested() && !this.stacked();
    }
  }, {
    key: 'isMixed',
    value: function isMixed() {
      return this.condition() == conditions$1[2];
    }
  }, {
    key: 'isNested',
    value: function isNested() {
      var dimensions = this.dimensions();
      var condition = this.condition();
      return dimensions.length === 2 || condition == conditions$1[2] && dimensions.length === 1;
    }
  }, {
    key: 'isStacked',
    value: function isStacked() {
      return this.stacked() && this.isNested();
    }
  }, {
    key: 'muteFromLegend',
    value: function muteFromLegend(legend) {
      this.muteRegions(legend.key);
    }
  }, {
    key: 'muteToLegend',
    value: function muteToLegend(d) {
      this.muteLegend(d.parent.data.key);
    }
  }, {
    key: 'demuteFromLegend',
    value: function demuteFromLegend(legend) {
      this.demuteRegions(legend.key);
    }
  }, {
    key: 'demuteToLegend',
    value: function demuteToLegend(d) {
      this.demuteLegend(d.parent.data.key);
    }
  }, {
    key: 'showMultiTooltip',
    value: function showMultiTooltip(tick, start) {
      //for the facet condition
      if (this.multiTooltip()) {
        var mt = this.__execs__.tooltip;
        mt.tick(tick, start);
      }
    }
  }, {
    key: 'renderLayout',
    value: function renderLayout(keep) {
      this.reset(keep);
      this.renderFrame();
      _munge$2.call(this);
      if (this.isBrushZoom()) {
        this.noAxisOffset(true);
        this.renderCanvas();
        _brushZoom.call(this);
        return;
      }
      _scale$2.call(this, keep);
      this.renderCanvas(this.point() ? this.size().range[0] * 2 : 0);
      _axis$3.call(this);
      _region$2.call(this);
      if (this.isFacet()) {
        _facet$2.call(this);
      } else {
        _mark$2.call(this);
      }
      _meanLine.call(this);
      _fitLine.call(this);
      _tooltip$3.call(this);
      _zoom.call(this);
      _brush.call(this);
      _legend$3.call(this);
    }
  }]);
  return Line;
}(mix(Facet).with(fitLineMixin, seriesMixin, brushMixin, zoomMixin, paddingMixin, shapeMixin, stackMixin));
/**
 * If meanLine is specified sets the meanLine setting and returns the Line instance itself. If meanLine is true renders a mean-line on each series. If meanLine is not specified, returns the current meanLine setting.
 * @function
 * @example
 * line.meanLine(true)
 * @param {boolean} [meanLine=false] If is true, renders a mean-line.
 * @return {meanLine|Line}
 */


Line.prototype.meanLine = attrFunc('meanLine');
Line.prototype.scaleBandMode = attrFunc('scaleBandMode');
/**
 * If individualScale is specified sets the individualScale setting and returns the Line instance itself. When a line chart has multiple measures, each measure will be a series. If individualScale is true, when has multiple measures, each series will be drawn based on an individual scale of itself.
 * @function
 * @example
 * line.individualScale(true)
 * @param {boolean} [individualScale=false] If is true, renders a mean-line.
 * @return {individualScale|Line}
 */
Line.prototype.individualScale = attrFunc('individualScale');

var line$2 = genFunc(Line);

function _munge$4() {
  var conditionFunc = function conditionFunc(dimensions, measures) {
    var field = this.__execs__.field;
    if (measures.length < 2) throw new ConditionException();
    field.x = measureField(measures[0]);
    field.y = measureField(measures[1]);
    if (dimensions.length === 0 && measures.length === 2) return conditions$2[0];else if (dimensions.length === 1 && measures.length === 2) {
      field.region = dimensionField(dimensions[0]);
      return conditions$2[1];
    } else if (dimensions.length === 0 && measures.length === 3) {
      field.radius = measureField(measures[2]);
      return conditions$2[2];
    } else if (dimensions.length == 1 && measures.length === 3) {
      field.radius = measureField(measures[2]);
      field.region = dimensionField(dimensions[0]);
      return conditions$2[3];
    } else throw new ConditionException();
  };
  this.condition(conditionFunc);
  this.limitRows();
  if (this.aggregated()) {
    this.__execs__.munged = [this.data()];
  } else if (this.isColor()) {
    this.__execs__.munged = this.aggregate(false, false).map(function (d) {
      d.key = d.data.key;
      return d;
    });
  } else {
    this.__execs__.munged = [this.data().map(function (d) {
      return { data: d };
    })];
  }
}

function _scale$4(keep) {
  var scale = this.scale();
  var munged = this.__execs__.munged;
  var facet = this.facet();
  var field = this.__execs__.field;
  var aggregated = this.aggregated();
  var xAt = this.axisX();
  var yAt = this.axisY();

  var regionDomain = void 0,
      rDomain = void 0;

  if (this.isColor()) {
    regionDomain = field.region.munged(munged).domain();
    scale.color = this.updateColorScale(regionDomain, keep);
  }

  if (this.isFacet()) {
    scale.region = d3.scaleBand().domain(regionDomain).padding(this.regionPadding());
    if (facet.orient === 'horizontal' && xAt) {
      xAt.orient = 'top';
      xAt.showDomain = false;
      this.thickness(xAt, scale.region, true, true);
      if (yAt) yAt.thickness = 0;
    } else if (facet.orient === 'vertical' && yAt) {
      yAt.orient = 'right';
      yAt.showDomain = false;
      this.thickness(yAt, scale.region, false, true);
      if (xAt) xAt.thickness = 0;
    }
    var _innerSize = this.innerSize();
    if (facet.orient === 'vertical') {
      scale.region.rangeRound([0, _innerSize.height]);
    } else {
      scale.region.rangeRound([0, _innerSize.width]);
    }
    return;
  }
  var data = aggregated ? this.data().children : this.data();
  var xDomain = d3.extent(data, function (d) {
    return (aggregated ? d.data : d)[field.x.field()];
  });
  var yDomain = d3.extent(data, function (d) {
    return (aggregated ? d.data : d)[field.y.field()];
  });

  scale.x = continousScale(xDomain, undefined, field.x);
  scale.y = continousScale(yDomain, undefined, field.y);

  if (this.isSized()) {
    rDomain = d3.extent(data, function (d) {
      return d[field.radius.field()];
    });
    scale.r = d3.scaleLinear().domain(rDomain).range(this.size().range);
  }

  this.setCustomDomain('x', xDomain);
  this.setCustomDomain('y', yDomain);

  this.thickness(yAt, scale.y, false, false);
  this.thickness(xAt, scale.x, true, false);

  var innerSize = this.innerSize();
  scale.x.rangeRound([0, innerSize.width]);
  scale.y.rangeRound([innerSize.height, 0]); //reverse
}

function _mark$4() {
  var _this = this;

  var zoomed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  var that = this;
  var canvas = this.__execs__.canvas;
  var scale = this.__execs__.scale;
  var color = this.color();
  var size = this.size();
  var label = this.label();
  var trans = d3.transition().duration(this.transition().duration).delay(this.transition().delay);
  var field = this.__execs__.field;
  var aggregated = this.aggregated();
  var nested = this.isColor();

  var xValue = function xValue(d) {
    return scale.x(d.data[field.x.field()]);
  };
  var yValue = function yValue(d) {
    return scale.y(d.data[field.y.field()]);
  };
  var rValue = function rValue(d) {
    return _this.isSized() ? scale.r(d.data[field.radius.field()]) : size.range[0];
  };
  var colorValue = function colorValue() {
    var d = d3.select(this.parentNode).datum();
    return nested ? scale.color(d.data.key) : color[0];
  };
  var __local = function __local(selection) {
    selection.each(function (d) {
      d.x = xValue(d);
      d.y = yValue(d);
      d.color = colorValue.call(this);
      d.r = rValue(d);
      d.text = labelFormat(d.x) + ', ' + labelFormat(d.y);
    });
  };

  var __pointInit = function __pointInit(selection) {
    selection.attr('r', 0).attr('stroke', function (d) {
      return d.color;
    }).attr('stroke-width', '1px').attr('fill-opacity', 0.5).style('cursor', 'pointer');
  };
  var __point = function __point(selection) {
    selection.transition(trans).attr('r', function (d) {
      return d.r;
    }).attr('stroke', function (d) {
      return d.color;
    });
  };
  var __labelInit = function __labelInit(selection) {
    selection.each(function (d) {
      var selection = d3.select(this);
      selection.style('pointer-events', 'none').text(d.text);
      that.styleFont(selection);
    });
  };
  var __label = function __label(selection) {
    selection.each(function (d) {
      var selection = d3.select(this);
      selection.attr('text-anchor', d.anchor).style('visibility', label ? 'visible' : 'hidden').transition(trans).attr('y', size.range[0]).text(d.text);
      that.styleFont(selection);
    });
  };

  var __appendPoints = function __appendPoints(selection) {
    var point = selection.selectAll(that.nodeName()).data(function (d) {
      return nested || aggregated ? d.children : d;
    });
    point.exit().remove();
    var pointEnter = point.enter().append('g').attr('class', that.nodeName(true) + ' point').call(__local);
    pointEnter.append('circle').call(__pointInit);
    pointEnter.append('text').call(__labelInit);
    point = pointEnter.merge(point).call(__local);

    point.selectAll('circle').call(__point);
    point.selectAll('text').call(__label);
    point.each(function (d) {
      var selection = d3.select(this);
      if (!zoomed) selection = selection.transition(trans);
      selection.attr('transform', 'translate(' + [d.x, d.y] + ')').style('fill', d.color);
    });
    that.__execs__.nodes = point;
  };

  canvas.selectAll(this.regionName()).call(__appendPoints);
}

function _axis$5() {
  var that = this;
  var scale = this.__execs__.scale;
  var grid = this.grid();
  var innerSize = this.innerSize();
  var field = this.__execs__.field;

  var _axisScaleX = function _axisScaleX(axisToggle) {
    field.x.axis(axisToggle);
    var curAxis = that.axisDefault(scale.x, axisToggle);
    if (axisToggle.orient === 'bottom') curAxis.y(scale.y.range()[0]);
    curAxis.grid(grid).gridSize(innerSize.height);
    return curAxis;
  };

  var _axisScaleY = function _axisScaleY(axisToggle) {
    field.y.axis(axisToggle);
    var curAxis = that.axisDefault(scale.y, axisToggle);
    if (axisToggle.orient === 'right') curAxis.x(scale.x.range()[1]);
    curAxis.grid(grid).gridSize(innerSize.width);
    return curAxis;
  };

  var xAt = this.axisX();
  var yAt = this.axisY();
  if (this.isFacet()) {
    this.axisFacet();
  } else {
    if (xAt) {
      _axisScaleX(xAt);
    }
    if (yAt) {
      _axisScaleY(yAt);
    }
  }

  this.renderAxis();
}

function _legend$5() {
  var legendToggle = this.legend();
  if (!legendToggle) return;
  if (!this.isColor()) {
    return;
  }
  this.renderLegend();
}

function _region$4() {
  var aggregated = this.aggregated();
  var scale = this.__execs__.scale;
  var isFacet = this.isFacet();
  var facet = this.facet();
  this.renderRegion(function (d) {
    if (aggregated) return;
    var xy = [isFacet ? scale.region(d.key) : 0, 0];
    if (facet.orient === 'vertical') xy.reverse();
    d.x = xy[0];d.y = xy[1];
  }, function (d) {
    return d;
  }, isFacet);
}

function _facet$4() {
  var _this = this;

  var parent = this;
  var scale = this.__execs__.scale;
  var facet = this.facet();
  var canvas = this.__execs__.canvas;
  var innerSize = this.innerSize();
  var measures = this.measures();
  var width = void 0,
      height = void 0;
  var settings = ['axisTitles', 'size', 'grid', 'font', 'label', 'tooltip'].map(function (d) {
    return { key: d, value: _this[d]() };
  });
  var hasX = this.axisX();
  var hasY = this.axisY();
  var _small = function _small(d) {
    var small = scatter().container(this).data(d).measures(measures).width(width).height(height).legend(false).zeroMargin(true).aggregated(true).parent(parent).color(scale.color(d.data.key));
    settings.forEach(function (d) {
      return small[d.key](d.value);
    });
    if (hasY) small.axis({ target: 'y', orient: 'left' });
    if (hasX) small.axis({ target: 'x', orient: 'bottom' }); //, showTitle: i === arr.length-1});
    small.render();
  };
  if (facet.orient === 'horizontal') {
    width = scale.region.bandwidth();
    height = innerSize.height;
  } else {
    width = innerSize.width;
    height = scale.region.bandwidth();
  }

  canvas.selectAll('.facet').each(_small);
}

var fitLineColor$1 = '#c0ccda';
function _fitLine$1() {
  var canvas = this.__execs__.canvas;
  var fitLineG = canvas.select(className('fit-line-g', true));

  if (!this.fitLine()) {
    if (!fitLineG.empty()) canvas.select(className('fit-line-g', true)).remove();
    return;
  }
  var field = this.__execs__.field;

  var _leastSquare = leastSquare(this.data(), field.x.field(), field.y.field()),
      slope = _leastSquare.slope,
      intercept = _leastSquare.intercept;

  var scale = this.scale();
  var trans = d3.transition().duration(this.transition().duration).delay(this.transition().delay);
  var xValues = scale.x.domain();
  var yValues = xValues.map(function (d) {
    return slope * d + intercept;
  });

  if (fitLineG.empty()) {
    fitLineG = canvas.append('g').attr('class', className('fit-line-g')).attr('clip-path', 'url(#' + canvas.selectAll(className('canvas-g-clip-path', true)).attr('id'));
    fitLineG.append('line').attr('class', className('fit-line')).style('fill', 'none').style('stroke', fitLineColor$1).style('stroke-width', 1).attr('x1', scale.x(xValues[0])).attr('y1', scale.y.range()[0]).attr('x2', scale.x(xValues[1])).attr('y2', scale.y.range()[0]);
  }
  fitLineG.select('line').transition(trans).attr('x1', scale.x(xValues[0])).attr('y1', scale.y(yValues[0])).attr('x2', scale.x(xValues[1])).attr('y2', scale.y(yValues[1]));
}

function _tooltip$5() {
  if (!this.tooltip() || this.isFacet()) return;

  var measures = this.measures();
  var value = function value(d) {
    return measures.map(function (m) {
      return { name: m.field, value: m.format ? m.format(d.data[m.field]) : d.data[m.field] };
    });
  };
  this.renderTooltip({ dx: this.size().range[0] + 4, value: value, key: null });
}

function _brushZoom$2() {
  var _this = this;

  var canvas = this.__execs__.canvas;
  var field = this.__execs__.field;
  var innerSize = this.innerSize();
  var scale = this.__execs__.scale;
  var axis = this.__execs__.axis;
  var axisX = axis && axis.x ? axis.x[field.x.field()] : null;
  var axisY = axis && axis.y ? axis.y[field.y.field()] : null;

  var brushGen = d3.brush().extent([[0, 0], [innerSize.width, innerSize.height]]);
  var brushG = canvas.selectAll('.brush.x').data([innerSize]);
  brushG.exit().remove();
  brushG = brushG.enter().append('g').attr('class', 'brush x').merge(brushG).attr('transform', 'translate(' + [0, 0] + ')').call(brushGen);
  this.brushGen(brushGen);
  var zoomExtent = this.zoomExtent(this.isColor(), true);
  var zoomGen = d3.zoom().scaleExtent(zoomExtent).translateExtent([[0, 0], [this.width(), this.height()]]);
  canvas.call(zoomGen);
  this.zoomGen(zoomGen);
  var xDomainOrigin = scale.x.domain();
  var yDomainOrigin = scale.y.domain();
  var idleTimeout = void 0;
  brushGen.on('end.scatter', function () {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'end') return;
    var selection = d3.event.selection;
    if (!selection) {
      //init
      if (!idleTimeout) return idleTimeout = setTimeout(function () {
        idleTimeout = null;
      }, 300);
      scale.x.domain(xDomainOrigin);
      scale.y.domain(yDomainOrigin);
    } else {
      scale.x.domain([selection[0][0], selection[1][0]].map(scale.x.invert, scale.x));
      scale.y.domain([selection[1][1], selection[0][1]].map(scale.y.invert, scale.y));
    }

    if (axisX) {
      axisX.render(null);
    }
    if (axisY) {
      axisY.render(null);
    }
    _mark$4.call(_this);
    _this.brushMove(brushG, null);
  });
}

function normal$1() {
  var _this = this;

  var parent = this.parent();
  var zoomExtent = this.zoomExtent(this.isColor(), true);
  var zoomGen = d3.zoom().scaleExtent(zoomExtent).translateExtent([[0, 0], [this.width(), this.height()]]);
  this.__execs__.canvas.call(zoomGen);

  this.zoomGen(zoomGen).zoomed(function () {
    _mark$4.call(_this, true); //re-render mark
    d3.select((parent ? parent : _this).__execs__.canvas.node().parentNode.parentNode).selectAll(className('tooltip', true)).remove(); //FIXME: currently, remove existing tooltip
    _tooltip$5.call(_this); //re-render tooltip
  }, true);
}

function _zoom$2() {
  if (!this.zoom()) return;
  if (this.zoom() === 'normal') normal$1.call(this);else if (this.zoom() === 'brush') _brushZoom$2.call(this);
}

var size$3 = { range: [3, 12], scale: 'linear', reverse: false };
var conditions$2 = ['normal', 'color', 'bubble', 'mixed'];
var _attrs$18 = {
  regionPadding: 0.1,
  size: size$3
};

/**
 * rendes a scatter chart
 * @class Scatter
 * @augments Facet
 * @augments FintLineMixin
 * @augments BrushMixin
 * @augments ZoomMixin
 * @augments PaddingMixin
 */

var Scatter = function (_mix$with) {
  inherits(Scatter, _mix$with);

  function Scatter() {
    classCallCheck(this, Scatter);

    var _this = possibleConstructorReturn(this, (Scatter.__proto__ || Object.getPrototypeOf(Scatter)).call(this));

    _this.setAttrs(_attrs$18);
    return _this;
  }

  createClass(Scatter, [{
    key: 'isColor',
    value: function isColor() {
      return this.condition() === conditions$2[1] || this.condition() === conditions$2[3];
    }
  }, {
    key: 'isSized',
    value: function isSized() {
      return this.condition() === conditions$2[2] || this.condition() === conditions$2[3];
    }
  }, {
    key: 'isFacet',
    value: function isFacet() {
      return this.facet() && this.isColor();
    }
  }, {
    key: 'muteFromLegend',
    value: function muteFromLegend(legion) {
      this.muteRegions(legion.key);
    }
  }, {
    key: 'demuteFromLegend',
    value: function demuteFromLegend(legion) {
      this.demuteRegions(legion.key);
    }
  }, {
    key: 'muteToLegend',
    value: function muteToLegend(d) {
      this.muteLegend(d.parent.data.key);
    }
  }, {
    key: 'demuteToLegend',
    value: function demuteToLegend(d) {
      this.demuteLegend(d.parent.data.key);
    }
  }, {
    key: 'renderLayout',
    value: function renderLayout(keep) {
      this.reset(keep);
      this.renderFrame();
      _munge$4.call(this);
      _scale$4.call(this, keep);
      this.renderCanvas(this.size().range[this.isSized() ? 1 : 0] * 1.25);
      _axis$5.call(this);
      _fitLine$1.call(this);
      _region$4.call(this);
      if (this.isFacet()) {
        _facet$4.call(this);
      } else {
        _mark$4.call(this);
      }
      _legend$5.call(this);
      _tooltip$5.call(this);
      _zoom$2.call(this);
    }
  }]);
  return Scatter;
}(mix(Facet).with(fitLineMixin, brushMixin, zoomMixin, paddingMixin));

var scatter = genFunc(Scatter);

function _munge$6() {
  var conditionFunc = function conditionFunc(dimensions, measures) {
    var field = this.__execs__.field;
    if (dimensions.length !== 2) throw new ConditionException();
    var d0 = dimensionField(dimensions[0]);
    var d1 = dimensionField(dimensions[1]);
    if (this.reverse()) {
      field.x = d1;
      field.y = d0;
    } else {
      field.x = d0;
      field.y = d1;
    }
    if (dimensions.length === 2) {
      if (measures.length === 0) this.measure(countMeasure);
      field.color = measureField(measures[0]);
      if (measures.length === 0) return conditions$3[1];else if (measures.length === 1) return conditions$3[0];
    } else throw new ConditionException();
  };
  this.condition(conditionFunc);
  this.__execs__.munged = this.aggregate(this.reverse(), true);
  this.limitKeys();
}

function _scale$6() {
  var scale = this.scale();
  var munged = this.__execs__.munged;
  var field = this.__execs__.field;
  var xAt = this.axisX();
  var yAt = this.axisY();
  var yDomain = void 0,
      xDomain = void 0,
      colorDomain = void 0;

  scale.x = d3.scaleBand();
  scale.y = d3.scaleBand();
  scale.color = d3.scaleLinear();

  xDomain = field.x.munged(munged).level(0).domain();
  yDomain = field.y.munged(munged).level(1).domain();
  colorDomain = field.color.munged(munged).level(1).domain();

  field.x.axis(xAt);
  field.y.axis(yAt);
  scale.x.domain(xDomain);
  scale.y.domain(yDomain);
  this.thickness(yAt, scale.y, false, true);
  this.thickness(xAt, scale.x, true, true);

  var innerSize = this.innerSize();
  scale.x.rangeRound([0, innerSize.width]).padding(this.padding());
  scale.y.rangeRound([0, innerSize.height]).padding(this.padding());

  if (zeroPoint(colorDomain)) {
    scale.color.domain([colorDomain[0], 0, colorDomain[colorDomain.length - 1]]);
  }
  scale.color.domain(colorDomain).range(this.color());
}

function _mark$6() {
  var that = this;
  var canvas = this.__execs__.canvas;
  var scale = this.__execs__.scale;
  var label = this.label();
  var trans = d3.transition().duration(this.transition().duration).delay(this.transition().delay);
  var yValue = function yValue(d) {
    return scale.y(d.data.key);
  };
  var colorValue = function colorValue(d) {
    return scale.color(d.value);
  };
  var textValue = function textValue(d) {
    return labelFormat(d.value);
  };
  var __local = function __local(selection) {
    var width = scale.x.bandwidth();
    var height = scale.y.bandwidth();
    selection.each(function (d) {
      d.x = 0;
      d.y = yValue(d);
      d.value = d.value;
      d.color = colorValue(d);
      d.text = textValue(d);
      d.w = width;
      d.h = height;
    });
  };

  var __pointInit = function __pointInit(selection) {
    selection.attr('width', function (d) {
      return d.w;
    }).attr('height', function (d) {
      return d.h;
    }).style('stroke', 'none').style('fill', function (d) {
      return d.color;
    }).style('cursor', 'pointer');
  };
  var __point = function __point(selection) {
    selection.transition(trans).attr('width', function (d) {
      return d.w;
    }).attr('height', function (d) {
      return d.h;
    }).style('fill', function (d) {
      return d.color;
    });
  };
  var __labelInit = function __labelInit(selection) {
    selection.each(function (d) {
      var selection = d3.select(this);
      selection.attr('x', 0).attr('y', 0).attr('dx', '0.29em').attr('dy', '1em').style('pointer-events', 'none').style('fill', '#111').text(d.text);
      that.styleFont(selection);
    });
  };
  var __label = function __label(selection) {
    selection.each(function (d) {
      var selection = d3.select(this);
      selection.attr('text-anchor', d.anchor).style('visibility', label ? 'visible' : 'hidden').transition(trans).text(d.text);
      that.styleFont(selection);
    });
  };

  var __appendPoints = function __appendPoints(selection) {
    var point = selection.selectAll(that.nodeName()).data(function (d) {
      return d.children;
    }, function (d) {
      return d.data.key;
    });
    point.exit().remove();
    var pointEnter = point.enter().append('g').attr('class', that.nodeName(true) + ' point').call(__local);
    pointEnter.append('rect').call(__pointInit);
    pointEnter.append('text').call(__labelInit);
    point = pointEnter.merge(point).call(__local);
    point.selectAll('rect').call(__point);
    point.selectAll('text').call(__label);
    point.attr('transform', function (d) {
      return 'translate(' + [d.x, d.y] + ')';
    }).style('fill', function (d) {
      return d.color;
    });
    that.__execs__.nodes = point;
  };

  var region = canvas.selectAll(this.regionName());
  region.call(__appendPoints);
}

function _axis$7() {
  var that = this;
  var scale = this.__execs__.scale;
  var field = this.__execs__.field;

  var _axisScaleX = function _axisScaleX(axisToggle) {
    field.x.axis(axisToggle);
    var curAxis = that.axisDefault(scale.x, axisToggle);
    if (axisToggle.orient === 'bottom') curAxis.y(scale.y.range()[1]);

    return curAxis;
  };

  var _axisScaleY = function _axisScaleY(axisToggle) {
    field.y.axis(axisToggle);
    var curAxis = that.axisDefault(scale.y, axisToggle);
    if (axisToggle.orient === 'right') curAxis.x(scale.x.range()[1]);
    return curAxis;
  };

  var xAt = this.axisX();
  var yAt = this.axisY();
  if (xAt) {
    _axisScaleX(xAt);
  }
  if (yAt) {
    _axisScaleY(yAt);
  }

  this.renderAxis();
}

function _legend$7() {
  this.renderSpectrum();
}

function _region$6() {
  var scale = this.__execs__.scale;
  var __regionLocal = function __regionLocal(d) {
    d.x = scale.x(d.data.key);
    d.y = 0;
  };

  this.renderRegion(__regionLocal);
}

function _tooltip$7() {
  if (!this.tooltip()) return;
  var field = this.__execs__.field;

  var value = function value(d, text) {
    return { name: field.color.field(), value: text };
  };
  var offset = function offset(d) {
    return { x: d.w, y: 0 };
  };
  this.renderTooltip({ offset: offset, value: value, color: '#111' });
}

var conditions$3 = ['normal', 'count'];
var _attrs$19 = {
  color: continousColorScheme,
  padding: 0.05,
  reverse: false
};

/**
 * @class XYHeatmap
 * @augments RectLinear
 * @augments PaddingMixin
 */

var XYHeatmap = function (_mix$with) {
  inherits(XYHeatmap, _mix$with);

  function XYHeatmap() {
    classCallCheck(this, XYHeatmap);

    var _this = possibleConstructorReturn(this, (XYHeatmap.__proto__ || Object.getPrototypeOf(XYHeatmap)).call(this));

    _this.setAttrs(_attrs$19);
    return _this;
  }

  createClass(XYHeatmap, [{
    key: 'isCount',
    value: function isCount() {
      return this.condition() === conditions$3[1];
    }
  }, {
    key: 'renderLayout',
    value: function renderLayout() {
      this.reset();
      this.renderFrame();
      _munge$6.call(this);
      _scale$6.call(this);
      this.renderCanvas();
      _region$6.call(this);
      _axis$7.call(this);
      _mark$6.call(this);
      _legend$7.call(this);
      _tooltip$7.call(this);
    }
  }]);
  return XYHeatmap;
}(mix(RectLinear).with(paddingMixin));

XYHeatmap.prototype.reverse = attrFunc('reverse');

var xyHeatmap = genFunc(XYHeatmap);

function _munge$8() {
  var _this = this;

  var conditionFunc = function conditionFunc(dimensions, measures) {
    var field = this.__execs__.field;
    if (dimensions.length === 0) throw new ConditionException();
    if (this.shape() === 'word' && dimensions.length > 1) throw new ConditionException();
    field.root = dimensionField(dimensions[0]);
    field.leaf = dimensionField(dimensions[dimensions.length - 1]);
    if (measures.length === 1) {
      field.color = measureField(measures[0]);
      return conditions$4[0];
    } else if (measures.length === 0) {
      this.measure(countMeasure);
      field.color = measureField(measures[0]);
      return conditions$4[1];
    } else throw new ConditionException();
  };
  this.condition(conditionFunc);
  this.__execs__.munged = this.aggregate(false, true, true, false);
  var root = d3.hierarchy({ key: 'root', values: this.__execs__.munged }, function (d) {
    return d.values;
  }).sum(function (d) {
    return d.value ? d.value[_this.measureName()] : 0;
  });

  if (this.sortByValue() === 'ascending') {
    root.sort(function (a, b) {
      return a.value - b.value;
    });
  } else if (this.sortByValue() === 'descending') {
    root.sort(function (a, b) {
      return b.value - a.value;
    });
  }
  var size = this.size() ? this.size().range : this.innerSize(true);
  if (this.shape() === 'pack') {
    var packGen = d3.pack().size(size);
    root = packGen(root);
  } else {
    var treemapGen = d3.treemap().size(size).paddingTop(this.font()['font-size'] + 4);
    root = treemapGen(root);
  }
  this.__execs__.munged = root;
}

function _scale$8() {
  var scale = this.scale();
  var munged = this.__execs__.munged;
  var colorDomain = d3.extent(munged.leaves(), function (d) {
    return d.value;
  });
  scale.color = d3.scaleLinear().domain(colorDomain);

  if (zeroPoint(colorDomain)) {
    scale.color.domain([colorDomain[0], 0, colorDomain[colorDomain.length - 1]]);
  }
  scale.color.domain(colorDomain).range(this.color());
}

var stemColor = '#eee';
function _mark$8() {
  var clipIdPrefix = 'treemap-node-clip-path-';
  var that = this;
  var mark = this.__execs__.mark;
  var scale = this.__execs__.scale;
  var label = this.label();
  var trans = d3.transition().duration(this.transition().duration).delay(this.transition().delay);
  var size = this.size();
  var shape = this.shape();
  var innerSize = this.innerSize();
  var nodeType = shape === 'pack' ? 'circle' : 'rect';
  var nodeAttr = function nodeAttr(selection) {
    if (nodeType === 'rect') {
      selection.attr('width', function (d) {
        return d.w;
      }).attr('height', function (d) {
        return d.h;
      });
    } else {
      selection.attr('r', function (d) {
        return d.r;
      });
    }
  };
  var nameAttr = function nameAttr(selection) {
    if (shape === 'treemap') {
      selection.attr('dx', '0.29em').attr('dy', '1em');
    } else if (shape === 'word') {
      var result = selection.datum();
      var vertical = result.w < result.h;
      selection.attr('dy', vertical ? '-.35em' : '.8em').attr('textLength', vertical ? result.h : result.w).attr('lengthAdjust', 'spacingAndGlyphs').attr('transform', vertical ? 'rotate(90)' : '').style('font-size', (vertical ? result.w : result.h) - 1 + 'px').style('fill', result.color).style('pointer-events', 'all').style('cursor', 'pointer');
    } else {
      var _result = selection.datum();
      selection.attr('visibility', _result.children ? 'hidden' : 'visible').attr('text-anchor', 'middle').attr('dy', '.35em');
    }
  };
  var colorValue = function colorValue(d) {
    return d.children ? stemColor : scale.color(d.value);
  };
  var textValue = function textValue(d) {
    return labelFormat(d.value);
  };
  var __local = function __local(selection) {
    var dx = 0;
    var dy = 0;
    if (size || shape === 'pack') {
      dx = (innerSize.width - size.range[0]) / 2;
      dy = (innerSize.height - size.range[1]) / 2;
    }
    selection.each(function (d) {
      d.color = colorValue(d);
      d.text = textValue(d);
      if (shape !== 'pack') {
        d.x = d.x0 + dx;
        d.y = d.y0 + dy;
        d.w = d.x1 - d.x0;
        d.h = d.y1 - d.y0;
      } else {
        d.x += dx / 2;
        d.y += dy / 2;
      }
    });
  };
  var __clipInit = function __clipInit(selection) {
    selection.each(function (d) {
      d3.select(this).attr('id', getUniqueId(clipIdPrefix)).append(nodeType).call(nodeAttr, d);
    });
  };
  var __clip = function __clip(selection) {
    selection.each(function (d) {
      d3.select(this).select(nodeType).transition(trans).call(nodeAttr, d);
    });
  };
  var __nodeInit = function __nodeInit(selection) {
    selection.style('visibility', shape === 'word' ? 'hidden' : 'visible').style('stroke', 'none').style('fill', function (d) {
      return d.color;
    }).style('cursor', 'pointer').call(nodeAttr);
  };
  var __node = function __node(selection) {
    selection.style('visibility', shape === 'word' ? 'hidden' : 'visible').transition(trans).style('fill', function (d) {
      return d.color;
    }).style('stroke', function (d) {
      return d.children ? '#ddd' : 'none';
    }).call(nodeAttr);
  };
  var __nameInit = function __nameInit(selection) {
    selection.each(function () {
      var result = mark.get(this);
      var selection = d3.select(this);
      selection.attr('x', 0).attr('y', 0).style('pointer-events', 'none').style('fill', '#000').text(function (d) {
        return d.data.key;
      });
      that.styleFont(selection);
      selection.call(nameAttr, result);

      selection.style('font-weight', 'bold');
    });
  };
  var __name = function __name(selection) {
    selection.each(function () {
      var selection = d3.select(this);
      selection.text(function (d) {
        return d.data.key;
      });
      that.styleFont(selection);
      selection.style('font-weight', 'bold');
      selection.call(nameAttr, mark.get(this));
    });
  };
  var __labelInit = function __labelInit(selection) {
    selection.each(function (d) {
      var selection = d3.select(this);
      var label = selection.attr('x', 0).attr('y', 0).style('pointer-events', 'none').style('fill', '#111').text(d.text);
      if (nodeType === 'rect') {
        label.attr('dx', '0.29em').attr('dy', '2em');
      } else {
        label.attr('visibility', d.children ? 'hidden' : 'visible').attr('text-anchor', 'middle').attr('dy', '1.35em');
      }
      that.styleFont(selection);
    });
  };
  var __label = function __label(selection) {
    selection.each(function (d) {
      var selection = d3.select(this);
      selection.style('visibility', label && shape !== 'word' ? 'visible' : 'hidden').transition(trans).text(d.text);
      that.styleFont(selection);
    });
  };

  var __appendNodes = function __appendNodes(selection) {
    var node = selection.selectAll(that.nodeName()).data(function (d) {
      return d.descendants().slice(1);
    }, function (d) {
      return d.data.key;
    }); //exclude the root
    node.exit().remove();
    var nodeEnter = node.enter().append('g').attr('class', function (d) {
      return that.nodeName(true) + ' ' + className(d.children ? 'stem' : 'leaf');
    }).call(__local);

    nodeEnter.append('defs').append('clipPath').call(__clipInit);
    nodeEnter.append(nodeType).attr('class', 'shape').call(__nodeInit);
    nodeEnter.append('text').attr('class', 'name').call(__nameInit);
    nodeEnter.filter(function (d) {
      return !d.children;
    }).append('text').attr('class', 'label').call(__labelInit);
    nodeEnter.attr('clip-path', function () {
      return 'url(#' + d3.select(this).select('clipPath').attr('id') + ')';
    });

    node = nodeEnter.merge(node).call(__local);
    node.select('defs').select('clipPath').call(__clip);
    node.selectAll('.shape').call(__node);
    node.selectAll('.name').call(__name);
    node.selectAll('.label').call(__label);

    node.attr('transform', function (d) {
      return 'translate(' + [d.x, d.y] + ')';
    });
    that.__execs__.nodes = node;
  };

  this.renderRegion(function (d) {
    d.x = 0;d.y = 0;
  }, function (d) {
    return [d];
  }).call(__appendNodes);
}

function _legend$8() {
  this.renderSpectrum();
}

function _tooltip$9() {
  if (!this.tooltip()) return;
  var field = this.__execs__.field;
  var count = this.isCount();
  var shape = this.shape();
  var key = function key(d) {
    return { name: 'key', value: d.data.key };
  };
  var value = function value(d, text) {
    var name = void 0;
    if (count) {
      name = countMeasureTitle;
    } else {
      name = field.color.field();
    }
    return { name: name, value: text };
  };
  var offset = function offset(d) {
    return { x: shape === 'pack' ? d.r : d.w, y: 0 };
  };
  this.renderTooltip({ offset: offset, value: value, key: key, color: '#111' }, false, true);
}

var shapes$1 = ['treemap', 'pack', 'word'];
var conditions$4 = ['normal', 'count'];
var _attrs$20 = {
  color: continousColorScheme,
  reverse: false,
  shape: shapes$1[0],
  size: null,
  sortByValue: 'natural'
};

/**
 * @class Treemap
 * @augments Default
 * @augments ShapeMixin
 * @augments SortMixin
 */

var Treemap = function (_mix$with) {
  inherits(Treemap, _mix$with);

  function Treemap() {
    classCallCheck(this, Treemap);

    var _this = possibleConstructorReturn(this, (Treemap.__proto__ || Object.getPrototypeOf(Treemap)).call(this));

    _this.setAttrs(_attrs$20);
    return _this;
  }

  createClass(Treemap, [{
    key: 'axis',
    value: function axis() {
      if (!arguments.length) return [];
      return this;
    }
  }, {
    key: 'isCount',
    value: function isCount() {
      return this.condition() === conditions$4[1];
    }
  }, {
    key: 'renderLayout',
    value: function renderLayout() {
      this.reset();
      this.renderFrame();
      _munge$8.call(this);
      _scale$8.call(this);
      this.renderCanvas();
      _mark$8.call(this);
      _legend$8.call(this);
      _tooltip$9.call(this);
    }
  }]);
  return Treemap;
}(mix(Core).with(shapeMixin, sortMixin));

Treemap.prototype.reverse = attrFunc('reverse');

var treemap$1 = genFunc(Treemap);

function _series(target, measures) {
  var isColor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  return target.map(function (d) {
    return measures.map(function (m) {
      return { data: { x: m.field, y: (isColor ? d.data : d)[m.field] } };
    });
  });
}
function _munge$10() {
  var _this2 = this;

  var conditionFunc = function conditionFunc(dimensions, measures) {
    var _this = this;

    var field = this.__execs__.field;
    if (measures.length < 2) throw new ConditionException();
    field.x = dimensionField(this.mixedDimension());
    measures.forEach(function (m) {
      field[yMeasureName(m)] = measureField(m);
      if (_this.shape() === shapes$2[1]) field[xMeasureName(m)] = measureField(m);
    });
    if (dimensions.length === 0) return conditions$5[0];else if (dimensions.length === 1) {
      field.region = dimensionField(dimensions[0]);
      return conditions$5[1];
    } else throw new ConditionException();
  };
  this.condition(conditionFunc);

  var result = void 0;
  var measures = this.measures();

  this.limitRows();

  if (this.shape() === shapes$2[0]) {
    if (this.isColor()) {
      //nest
      result = this.aggregate(false, false);
      result.forEach(function (d) {
        //series structure
        d.key = d.data.key;
        d.children = _series(d.children, measures, true);
      });
    } else {
      result = [{ parent: null, children: _series(this.data(), measures) }];
    }
  } else {
    result = [];
    measures.forEach(function (x) {
      measures.forEach(function (y) {
        result.push({ xField: x, yField: y, children: _this2.data() });
      });
    });
  }

  this.__execs__.munged = result;
}

function ordinalDomainFlatten(target, dimensionField) {
  var domain = [];
  target.forEach(function (d) {
    d = d[dimensionField.field()];
    if (dimensionField.interval()) {
      //using interval
      d = interval[dimensionField.interval()](d);
    }
    if (d instanceof Date && domain.findIndex(function (m) {
      return m - d === 0;
    }) < 0) domain.push(d);else if (!domain.includes(d)) domain.push(d);
  });
  domain.sort(comparator(dimensionField.order()));
  return domain;
}

function _parCoords(keep) {
  var _this = this;

  var scale = this.scale();
  var measures = this.measures();
  var munged = this.__execs__.munged;
  var innerSize = this.innerSize();
  var field = this.__execs__.field;
  if (this.isColor()) {
    var colorDomain = field.region.munged(munged).domain();
    scale.color = this.updateColorScale(colorDomain, keep);
  }

  scale.x = d3.scalePoint().domain(measures.map(function (d) {
    return d.field;
  })).rangeRound([0, innerSize.width]);
  measures.forEach(function (m) {
    var domain = d3.extent(_this.data(), function (d) {
      return d[m.field];
    });
    var scaleName = yMeasureName(m);
    scale[scaleName] = continousScale(domain, null, field[scaleName]).rangeRound([innerSize.height, 0]);
    _this.setCustomDomain(scaleName, domain);
  });
}

function _matrix(keep) {
  var _this2 = this;

  var scale = this.scale();
  var measures = this.measures();
  var innerSize = this.innerSize();
  var field = this.__execs__.field;
  if (this.isColor()) {
    var colorDomain = ordinalDomainFlatten(this.data(), field.region);
    scale.color = this.updateColorScale(colorDomain, keep);
  }
  var regionWidth = Math.min(innerSize.width, innerSize.height);
  scale.region = d3.scaleBand().domain(measures.map(function (d) {
    return d.field;
  })).rangeRound([0, regionWidth]).padding(this.regionPadding());
  measures.forEach(function (m) {
    var domain = d3.extent(_this2.data(), function (d) {
      return d[m.field];
    });
    var yScaleName = yMeasureName(m);
    scale[yScaleName] = continousScale(domain).rangeRound([scale.region.bandwidth(), 0]);
    _this2.setCustomDomain(yScaleName, domain);
    var xScaleName = xMeasureName(m);
    scale[xScaleName] = continousScale(domain).rangeRound([0, scale.region.bandwidth()]);
    _this2.setCustomDomain(xScaleName, domain);
  });
}

function _scale$10(keep) {
  if (this.shape() === shapes$2[0]) _parCoords.call(this, keep);else _matrix.call(this, keep);
}

function _mark$10() {
  var that = this;
  var canvas = this.__execs__.canvas;
  var scale = this.__execs__.scale;
  var size = this.size();
  var innserSize = this.innerSize();
  var trans = d3.transition().duration(this.transition().duration).delay(this.transition().delay);
  var lineGenInit = d3.line().x(function (d) {
    return scale.x(d.data.x);
  }).y(innserSize.height);
  var lineGen = d3.line().x(function (d) {
    return scale.x(d.data.x);
  }).y(function (d) {
    return scale[yMeasureName(d.data.x)](d.data.y);
  });

  var __seriesInit = function __seriesInit(selection) {
    selection.attr('d', lineGenInit).attr('fill', 'none').attr('stroke-width', size.range[0]);
  };

  var __series = function __series(selection) {
    selection.transition(trans).attr('d', lineGen).attr('stroke-width', size.range[0]);
  };

  var __appendSeries = function __appendSeries(selection) {
    var series = selection.selectAll(that.seriesName()).data(function (d) {
      return d.children;
    }, function (d, i) {
      return d.key ? d.key : i;
    });

    series = series.enter().append('g').attr('class', that.seriesName(true)).merge(series);

    var path = series.selectAll('path' + className('line', true)).data(function (d) {
      return [d];
    });

    path.enter().append('path').attr('class', className('line')).call(__seriesInit).merge(path).call(__series);
  };

  var region = canvas.selectAll(this.regionName());
  region.call(__appendSeries);
}

function _parCoords$1() {
  var that = this;
  var measures = this.measures();
  var scale = this.__execs__.scale;

  var _axisScaleY = function _axisScaleY(yScale, axisToggle) {
    var curAxis = that.axisDefault(yScale, axisToggle);
    if (axisToggle.orient === 'right') curAxis.x(scale.x.range()[1]);
    curAxis.x(scale.x(axisToggle.field));
    return curAxis;
  };

  var yAt = this.axisY();
  if (yAt) {
    measures.forEach(function (m) {
      var name = yMeasureName(m);
      var yScale = scale[name];
      var at = { target: yAt.target, field: m.field, orient: yAt.orient, showDomain: true, titleOrient: 'bottom', showTitle: true };
      _axisScaleY(yScale, at);
    });
  }
}

function _axis$9() {
  if (this.shape() === shapes$2[0]) {
    _parCoords$1.call(this);
  }
  this.renderAxis();
}

function _legend$9() {
  if (!this.isColor()) {
    return;
  }
  this.renderLegend();
}

function _region$8() {
  var isColor = this.isColor();
  var color = this.color();
  var shape = this.shape();
  var scale = this.__execs__.scale;

  var __regionLocal = function __regionLocal(d) {
    if (shape === shapes$2[0]) {
      d.x = 0;d.y = 0;
      d.color = isColor ? scale.color(d.data.key) : color[0];
    } else {
      d.x = scale.region(d.xField.field);
      d.y = scale.region.range()[1] - scale.region(d.yField.field) - scale.region.bandwidth();
    }
  };

  this.renderRegion(__regionLocal, function (d) {
    return d;
  }, shape === shapes$2[1], shape === shapes$2[1] ? '.matrix' : '').style('stroke', function (d) {
    return d.color;
  });
}

function _facet$6() {
  var _this = this;

  var parent = this;
  var scale = this.__execs__.scale;
  var canvas = this.__execs__.canvas;
  var measures = this.measures();
  var dimensions = this.dimensions();
  var width = scale.region.bandwidth();
  var settings = ['axisTitles', 'color', 'size', 'grid', 'font', 'label'].map(function (d) {
    return { key: d, value: _this[d]() };
  });

  var _small = function _small(d, i) {
    var small = scatter().container(this).data(d.children).dimensions(dimensions).measures([d.xField, d.yField]).width(width).height(width).legend(false).tooltip(false).parent(parent).zeroOffset(true).noAxisOffset(true);

    var showX = i % measures.length === 0;
    var showY = i < measures.length;
    settings.forEach(function (d) {
      return small[d.key](d.value);
    });
    small.axis({ target: 'y', orient: 'left', showTitle: showY, showTicks: showY });
    small.axis({ target: 'x', orient: 'bottom', showTitle: showX, showTicks: showX });
    small.render();
  };

  canvas.selectAll('.facet').each(_small);
}

function _parcoords() {
  var canvas = this.__execs__.canvas;
  var scale = this.__execs__.scale;
  var innerSize = this.innerSize();
  var measures = this.measures();
  var conditions = {};
  var brushW = this.font()['font-size'];
  var brushGen = d3.brushY().extent([[-brushW, 0], [brushW, innerSize.height]]);
  var series = canvas.selectAll(this.seriesName());
  var hide = function hide() {
    series.attr('opacity', '1').filter(function (d) {
      var _loop = function _loop(k) {
        //hide excluded
        var domain = conditions[k];
        var target = d.filter(function (dd) {
          return dd.data.x === k;
        })[0];
        var result = target.data.y < domain[1] || target.data.y > domain[0];
        if (result) return {
            v: true
          };
      };

      for (var k in conditions) {
        var _ret = _loop(k);

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }
      return false;
    }).attr('opacity', 0.1);
  };
  var brushG = canvas.selectAll('.brush.y').data(measures, function (d) {
    return d.field;
  });
  brushG.exit().remove();
  brushG.enter().append('g').attr('class', 'brush y').merge(brushG).attr('transform', function (d) {
    return 'translate(' + [scale.x(d.field), 0] + ')';
  }).call(brushGen);
  brushGen.on('brush.parCoords', function (d) {
    conditions[d.field] = d3.event.selection.map(scale[yMeasureName(d.field)].invert);
    hide();
  }).on('end.parCoords', function (d) {
    if (d3.event.selection === null) {
      delete conditions[d.field];
      hide();
    }
  });

  this.brushGen(brushGen);
}

function _matrix$1() {
  var canvas = this.__execs__.canvas;
  var scale = this.__execs__.scale;
  var brushW = scale.region.bandwidth();
  var brushGen = d3.brush().extent([[0, 0], [brushW, brushW]]);
  var nodes = canvas.selectAll(this.nodeName());
  var brushCell = void 0;
  var brushG = canvas.selectAll('.brush.matrix').data(function (d) {
    return d;
  });
  brushG.exit().remove();
  brushG.enter().append('g').attr('class', 'brush matrix').merge(brushG).attr('transform', function (d) {
    return 'translate(' + [scale.region(d.xField.field), scale.region.range()[1] - scale.region(d.yField.field) - scale.region.bandwidth()] + ')';
  }).call(brushGen);

  brushGen.on('start.matrix', function () {
    if (brushCell !== this) {
      d3.select(brushCell).call(brushGen.move, null);
      brushCell = this;
    }
  }).on('brush.matrix', function (d) {
    if (d3.event.selection === null) return;
    var xName = d.xField.field;
    var yName = d.yField.field;
    var scaleX = scale[xMeasureName(xName)];
    var scaleY = scale[yMeasureName(yName)];
    var domain = d3.event.selection.map(function (d) {
      return [scaleX.invert(d[0]), scaleY.invert(d[1])];
    });
    nodes.attr('opacity', 1).filter(function (d) {
      d = d.data;
      return d[xName] < domain[0][0] || d[xName] > domain[1][0] || d[yName] > domain[0][1] || d[yName] < domain[1][1];
    }).attr('opacity', 0.1);
  }).on('end.matrix', function () {
    if (d3.event.selection === null) {
      // if no selection, recover
      nodes.attr('opacity', 1);
    }
  });
  this.brushGen(brushGen);
}

function _brush$2() {
  if (this.shape() === shapes$2[0]) {
    _parcoords.call(this);
  } else {
    _matrix$1.call(this);
  }
}

var size$4 = { range: [1, 1], scale: 'linear', reverse: false };
var shapes$2 = ['par-coords', 'scatter-matrix'];
var conditions$5 = ['normal', 'color'];
var _attrs$21 = {
  regionPadding: 0.1,
  size: size$4,
  shape: shapes$2[0]
};

/**
 * renders a parallel coordinates
 * @class ParCoords
 * @augments Core
 * @augments RectLinear
 * @augments SeriesMixin
 * @augments BrushMixin
 * @augments PaddingMixin
 * @augments ShapeMixin
 */

var ParCoords = function (_mix$with) {
  inherits(ParCoords, _mix$with);

  function ParCoords() {
    classCallCheck(this, ParCoords);

    var _this = possibleConstructorReturn(this, (ParCoords.__proto__ || Object.getPrototypeOf(ParCoords)).call(this));

    _this.setAttrs(_attrs$21);
    _this.brush(true);
    return _this;
  }

  createClass(ParCoords, [{
    key: 'isColor',
    value: function isColor() {
      return this.condition() === conditions$5[1];
    }
  }, {
    key: 'muteRegions',
    value: function muteRegions(callback) {
      var _this2 = this;

      var _parCoords = function _parCoords(region) {
        _this2.mute(region, _this2.muteIntensity());
      };
      var _matrix = function _matrix(region) {
        var nodes = region.selectAll(_this2.nodeName()).classed('mute', true);
        _this2.mute(nodes, _this2.muteIntensity());
      };
      if (!arguments.length) {
        if (this.shape() === shapes$2[0]) {
          return this.filterRegions().call(_parCoords);
        } else {
          return this.regions().selectAll(this.regionName()).call(_matrix);
        }
      }
      if (this.shape() === shapes$2[0]) {
        return this.filterRegions(conditionForMute(callback), true).call(_parCoords);
      } else {
        return this.regions().selectAll(this.regionName()).filter(conditionForMute(callback)).call(_matrix);
      }
    }
  }, {
    key: 'demuteRegions',
    value: function demuteRegions(callback) {
      var _this3 = this;

      var _parCoords = function _parCoords(region) {
        _this3.demute(region);
      };
      var _matrix = function _matrix(region) {
        var nodes = region.selectAll(_this3.nodeName());
        _this3.demute(nodes);
      };
      if (!arguments.length) {
        if (this.shape() === shapes$2[0]) {
          return this.filterRegions().call(_parCoords);
        } else {
          return this.regions().selectAll(this.regionName()).call(_matrix);
        }
      }
      if (this.shape() === shapes$2[0]) {
        return this.filterRegions(conditionForMute(callback), true).call(_parCoords);
      } else {
        return this.regions().selectAll(this.regionName()).filter(conditionForMute(callback)).call(_matrix);
      }
    }
  }, {
    key: 'muteFromLegend',
    value: function muteFromLegend(legend) {
      this.muteRegions(legend.key);
    }
  }, {
    key: 'demuteFromLegend',
    value: function demuteFromLegend(legend) {
      this.demuteRegions(legend.key);
    }
  }, {
    key: 'renderLayout',
    value: function renderLayout(keep) {
      if (this.shape() === shapes$2[0] && this.axisX()) {
        var findIndex = this.axis().findIndex(function (d) {
          return d.target === 'x';
        });
        if (findIndex >= 0) {
          this.axis().splice(findIndex, 1);
        }
      }
      this.reset(keep);
      this.renderFrame();
      _munge$10.call(this);
      _scale$10.call(this, keep);
      this.renderCanvas();
      _axis$9.call(this);
      if (this.shape !== shapes$2[0] || this.isColor()) _region$8.call(this);
      if (this.shape() === shapes$2[0]) {
        _mark$10.call(this);
      } else {
        _facet$6.call(this);
      }

      _legend$9.call(this);
      _brush$2.call(this);
    }
  }]);
  return ParCoords;
}(mix(RectLinear).with(seriesMixin, brushMixin, paddingMixin, shapeMixin));

function xMeasureName(measure) {
  return 'x-' + (measure.field ? measure.field : measure);
}

function yMeasureName(measure) {
  return 'y-' + (measure.field ? measure.field : measure);
}

var parCoords = genFunc(ParCoords);

function _munge$12() {
  var conditionFunc = function conditionFunc(dimensions, measures) {
    var field = this.__execs__.field;
    if (dimensions.length === 1) {
      if (measures.length === 0) this.measure(countMeasure);
      field.r = measureField(measures[0]);
      field.region = dimensionField(dimensions[0]);
      if (measures.length === 0) return conditions$6[0];else if (measures.length === 1) return conditions$6[1];
    } else throw new ConditionException();
  };
  this.condition(conditionFunc);
  this.__execs__.munged = this.aggregate(false, true, false, false);
  this.limitKeys();
  var field = this.__execs__.field;
  var pieGen = d3.pie().value(function (d) {
    return d.value[field.r.valueName()];
  }).padAngle(this.padding()).sortValues(null);
  var result = pieGen(this.__execs__.munged);
  result.forEach(function (d) {
    return d.key = d.data.key;
  });
  if (field.region.interval()) {
    result.forEach(function (d) {
      d.data.key = new Date(d.data.key);
    });
  }
  this.__execs__.munged = result;
}

function _scale$12(keep) {
  var scale = this.scale();
  var munged = this.__execs__.munged;
  var field = this.__execs__.field;
  var regionDomain = field.region.munged(munged).domain();
  scale.color = this.updateColorScale(regionDomain, keep);
}

function _mark$12() {
  var that = this;
  var scale = this.__execs__.scale;
  var label = this.label();
  var trans = d3.transition().duration(this.transition().duration).delay(this.transition().delay);
  var innerSize = this.innerSize();
  var size = this.size();
  var arcGen = d3.arc().innerRadius(size.range[0]).outerRadius(size.range[1]).startAngle(function (d) {
    return d.startAngle;
  }).endAngle(function (d) {
    return d.endAngle;
  }).padAngle(function (d) {
    return d.padAngle;
  });
  var tweenArc = function tweenArc(d) {
    var i = d3.interpolate({ endAngle: 0 }, d);
    return function (t) {
      return arcGen(i(t));
    };
  };

  var __local = function __local(selection) {
    var sizeMean = d3.mean(size.range);
    selection.each(function (d) {
      d.mid = (d.endAngle + d.startAngle) / 2;
      d.dx = Math.sin(d.mid) * sizeMean;
      d.dy = -Math.cos(d.mid) * sizeMean;
      d.x = innerSize.width / 2 + d.dx;
      d.y = innerSize.height / 2 + d.dy;
      d.color = scale.color(d.key);
      d.text = labelFormat(d.value);
    });
  };

  var __nodeInit = function __nodeInit(selection) {
    selection.style('fill', function (d) {
      return d.color;
    }).style('cursor', 'pointer');
  };
  var __node = function __node(selection) {
    selection.style('fill', function (d) {
      return d.color;
    }).transition(trans).attrTween('d', tweenArc);
  };

  var __labelInit = function __labelInit(selection) {
    selection.each(function (d) {
      d3.select(this).attr('x', d.dx).attr('dy', '.35em').attr('y', d.dy).attr('text-anchor', 'middle').style('pointer-events', 'none').text(d.text);
      that.styleFont(d3.select(this));
    });
  };

  var __label = function __label(selection) {
    selection.each(function (d) {
      d3.select(this).style('visibility', label ? 'visible' : 'hidden').text(d.text).transition(trans).attr('x', d.dx).attr('y', d.dy);
      that.styleFont(d3.select(this));
    });
  };

  var __appendNodes = function __appendNodes(selection) {
    var node = selection.selectAll(that.nodeName()).data(function (d) {
      return d;
    }, function (d) {
      return d.data.key;
    });
    node.exit().remove();
    var nodeEnter = node.enter().append('g').attr('class', that.nodeName(true) + ' pie').call(__local);
    nodeEnter.append('path').call(__nodeInit);
    nodeEnter.append('text').call(__labelInit);
    node.call(__local);
    node = nodeEnter.merge(node).attr('transform', 'translate(' + [innerSize.width / 2, innerSize.height / 2] + ')');
    node.select('path').call(__node);
    node.select('text').call(__label);
    that.__execs__.nodes = node;
  };

  this.renderRegion(function (d) {
    d.x = 0;d.y = 0;
  }, function (d) {
    return [d];
  }).call(__appendNodes);
}

function _legend$11() {
  if (!this.legend()) return;
  this.renderLegend();
}

function _tooltip$11() {
  if (!this.tooltip()) return;
  var count = this.isCount();
  var field = this.__execs__.field;
  var tFormat = function tFormat(d) {
    var f = field.region.isInterval() ? field.region.format() : null;
    return f ? f(d) : d;
  };

  var key = function key(d) {
    return { name: 'key', value: tFormat(d.data.key) };
  };
  var value = function value(d, text) {
    var name = void 0;
    if (count) {
      name = countMeasureTitle;
    } else {
      name = field.region.field();
    }
    return { name: name, value: text };
  };

  this.renderTooltip({ value: value, key: key });
}

var size$5 = { range: [0, 150], scale: 'linear', reverse: false };
var conditions$6 = ['normal', 'count'];
var _attrs$22 = {
  limitKeys: 20,
  padding: 0,
  size: size$5
};

/**
 * renders a pie chart.
 * @class Pie
 * @augments Core
 * @augments PaddingMixin
 */

var Pie = function (_mix$with) {
  inherits(Pie, _mix$with);

  function Pie() {
    classCallCheck(this, Pie);

    var _this = possibleConstructorReturn(this, (Pie.__proto__ || Object.getPrototypeOf(Pie)).call(this));

    _this.setAttrs(_attrs$22);
    return _this;
  }

  createClass(Pie, [{
    key: 'axis',
    value: function axis() {
      if (!arguments.length) return [];
      return this;
    }
  }, {
    key: 'muteFromLegend',
    value: function muteFromLegend(legend) {
      this.muteNodes(legend.key);
    }
  }, {
    key: 'demuteFromLegend',
    value: function demuteFromLegend(legend) {
      this.demuteNodes(legend.key);
    }
  }, {
    key: 'muteToLegend',
    value: function muteToLegend(d) {
      this.muteLegend(d.data.key);
    }
  }, {
    key: 'demuteToLegend',
    value: function demuteToLegend(d) {
      this.demuteLegend(d.data.key);
    }
  }, {
    key: 'isCount',
    value: function isCount() {
      return this.condition() === conditions$6[1];
    }
  }, {
    key: 'renderLayout',
    value: function renderLayout(keep) {
      this.reset(keep);
      this.renderFrame();
      _munge$12.call(this);
      _scale$12.call(this, keep);
      this.renderCanvas();
      _mark$12.call(this);
      _legend$11.call(this);
      _tooltip$11.call(this);
    }
  }]);
  return Pie;
}(mix(Core).with(paddingMixin));

var pie$1 = genFunc(Pie);

function _munge$14() {
  var conditionFunc = function conditionFunc(dimensions, measures) {
    var field = this.__execs__.field;
    if (this.addr()) {
      if (measures.length < 1) throw new ConditionException();
      field.addr = measures[0];
      field.lat = latMeasure;
      field.lng = lngMeasure;
      if (measures.length === 2) {
        field.radius = measures[1];
        return conditions$7[0];
      } else if (measures.length === 1) {
        return conditions$7[1];
      }
    } else {
      if (measures.length < 2) throw new ConditionException();
      if (measures.length === 3) {
        field.lat = measures[0];
        field.lng = measures[1];
        field.radius = measures[2];
        return conditions$7[0];
      } else if (measures.length === 2) {
        field.lat = measures[0];
        field.lng = measures[1];
        return conditions$7[1];
      }
    }
    if (dimensions.length === 1) {
      field.name = dimensions[0];
    }
    throw new ConditionException();
  };
  this.condition(conditionFunc);
  this.limitRows();
  var field = this.__execs__.field;
  if (this.isSized()) this.data().sort(function (a, b) {
    return b[field.radius.field] - a[field.radius.field];
  });
  this.__execs__.munged = this.data();
}

function _map(selection) {
  selection = d3.select(selection);
  var frame = selection.select('.frame.layer');
  if (frame.empty()) {
    frame = selection.append('div').attr('class', 'frame layer');
  }
  frame.style('width', this.width() + 'px').style('height', this.height() + 'px');
  var options = {
    center: new daum.maps.LatLng(33.450701, 126.570667),
    level: 3
  }; // defaut zoom option
  var map = new daum.maps.Map(frame.node(), options);
  map.setMapTypeId(daum.maps.MapTypeId[this.mapBaseType()]);
  if (this.overlayMapType()) map.addOverlayMapTypeId(daum.maps.MapTypeId[this.overlayMapType()]);
  var zoomControl = new daum.maps.ZoomControl();
  map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);
  map.setZoomable(false);
  this.__execs__.map = map;
}

function _scale$14() {
  var scale = this.scale();
  var field = this.__execs__.field;

  if (this.isSized()) {
    var rDomain = d3.extent(this.data(), function (d) {
      return d[field.radius.field];
    });
    scale.r = d3.scaleLinear().domain(rDomain.map(function (d) {
      return Math.sqrt(d);
    }));
  }
}

function _addr2coord(addr, geocoder, callback) {
  geocoder.addr2coord(addr, function (status, result) {
    if (status === daum.maps.services.Status.OK) {
      return callback(null, result.addr[0]);
    } else {
      return callback(status);
    }
  });
}

function _rScaleRange(scale, level, size) {
  var magVal = Math.pow(2, level);
  scale.range([size.range[0] * magVal, size.range[1] * magVal]);
}
function _mark$14() {
  var map = this.__execs__.map;
  var field = this.__execs__.field;
  var scale = this.__execs__.scale;
  var dispatch$$1 = this.__execs__.dispatch;
  var isAddr = this.addr();
  var label = this.label();
  var target = this.data();
  var isSized = this.isSized();
  var size = this.size();
  var color = this.color();
  var geocoder = new daum.maps.services.Geocoder();
  var circles = [];

  var __set = function __set() {
    var latlng = target.map(function (d) {
      return new daum.maps.LatLng(d[field.lat.field], d[field.lng.field]);
    });
    var bounds = new daum.maps.LatLngBounds();
    latlng.forEach(function (d) {
      bounds.extend(d);
    });
    map.setBounds(bounds);
    var level = map.getLevel();
    if (isSized) _rScaleRange(scale.r, level, size);
  };
  var __nodes = function __nodes() {
    var level = map.getLevel();
    var earthR = 111111; // earth radius
    target.forEach(function (d) {
      var latLng = new daum.maps.LatLng(d[field.lat.field], d[field.lng.field]);
      var radius = isSized ? scale.r(Math.sqrt(d[field.radius.field])) : size.range[0] * Math.pow(2, level);
      var option = {
        clickable: true,
        zIndex: 10,
        center: latLng,
        radius: radius,
        strokeColor: color[0],
        strokeWeight: 1.5,
        strokeOpacity: 1,
        strokeStyle: 'solid',
        fillColor: color[0],
        fillOpacity: 0.5
      };
      var circle = new daum.maps.Circle(option);
      circle.setMap(map);
      circles.push(circle);

      var keyVal = field.name ? d[field.name.field] : isAddr ? d[field.addr.field] : 'Y: ' + labelFormat(d[field.lat.field]) + '</br> X: ' + labelFormat(d[field.lng.field]);
      var tooltipText = '<div class="jelly-chart-tooltip" style="padding:4px;font-size:12px;font-family:sans-serif;">' + '<div class="jelly-chart-key" style="font-weight:bold;">' + keyVal + '</div>' + (isSized ? '<div class="jelly-chart-value">' + field.radius.field + ': ' + labelFormat(d[field.radius.field]) + '</div>' : '') + '</div>';
      var tooltip = new daum.maps.InfoWindow({
        position: new daum.maps.LatLng(d[field.lat.field] + radius / earthR, d[field.lng.field]),
        content: tooltipText
      });

      daum.maps.event.addListener(circle, 'mouseover', function () {
        tooltip.open(map);
      });
      daum.maps.event.addListener(circle, 'mouseout', function () {
        tooltip.close();
      });

      if (isSized && label) {
        var value = labelFormat(d[field.radius.field]);
        var _label = new daum.maps.CustomOverlay({
          position: latLng,
          clickable: true,
          zIndex: -1,
          content: '<div class="label" style="pointer-events:none;padding:4px;font-size:12px;font-family:sans-serif;">' + value + '</div>'
        });
        _label.setMap(map);
      }
    });
  };

  if (isAddr) {
    var count = 0;

    target.forEach(function (d) {
      var addr = d[field.addr.field];
      var callback = function callback(err, coord) {
        if (!err) {
          d[latMeasure.field] = coord.lat;
          d[lngMeasure.field] = coord.lng;
        }
        count += 1;
        dispatch$$1.call('loading', this, count);
        if (count === target.length) {
          __set();
          __nodes();
          dispatch$$1.call('end');
        }
      };
      try {
        _addr2coord(addr, geocoder, callback);
      } catch (e) {
        callback(e);
      }
    });
  } else {
    __set();
    __nodes();
  }
  if (!isSized) {
    daum.maps.event.addListener(map, 'zoom_changed', function () {
      var radius = size.range[0] * Math.pow(2, map.getLevel());
      circles.forEach(function (circle) {
        circle.setRadius(radius);
      });
    });
  }
}

var latMeasure = { field: '__--jelly-lat--__' };
var lngMeasure = { field: '__--jelly-lng--__' };

var size$6 = { range: [0.5, 4], scale: 'linear', reverse: false };
var conditions$7 = ['normal', 'point'];
var _attrs$23 = {
  addr: false,
  mapBaseType: 'ROADMAP', // ROADMAP SKYVIEW HYBRID
  overlayMapType: null, // OVERLAY TERRAIN TRAFFIC BICYCLE BICYCLE_HYBRID USE_DISTRICT
  size: size$6
};

/**
 * @class MarkerMap
 * @augments Default
 */

var MarkerMap = function (_Default) {
  inherits(MarkerMap, _Default);

  function MarkerMap() {
    classCallCheck(this, MarkerMap);

    var _this = possibleConstructorReturn(this, (MarkerMap.__proto__ || Object.getPrototypeOf(MarkerMap)).call(this));

    _this.setAttrs(_attrs$23);
    _this.__execs__.dispatch = d3.dispatch('loading', 'end');
    rebindOnMethod(_this, _this.__execs__.dispatch);
    return _this;
  }

  createClass(MarkerMap, [{
    key: 'isSized',
    value: function isSized() {
      return this.condition() === conditions$7[0];
    }
  }, {
    key: 'renderLayout',
    value: function renderLayout() {
      this.reset();
      _munge$14.call(this);
      _scale$14.call(this);
      _map.call(this, this.container());
      _mark$14.call(this);
    }
  }]);
  return MarkerMap;
}(Core);

/**
 * If addr is specified sets the addr setting and returns the MarkerMap instance itself. If addr is true, use addresses to find coordinates from data. The field possessing address type data, should be the first arguments of .measures method. If is not specified, returns the current addr setting.
 * @function
 * @example
 * markerMap.addr(true)
 * @param {boolean} [addr=false]
 * @return {addr|MarkerMap}
 */


MarkerMap.prototype.addr = attrFunc('addr');
MarkerMap.prototype.mapBaseType = attrFunc('mapBaseType');
MarkerMap.prototype.overlayMapType = attrFunc('overlayMapType');

var markerMap = genFunc(MarkerMap);

function _axis$11() {
  var _this = this;

  var scale = this.__execs__.scale;
  var xAt = this.axisX();
  var yAt = this.axisY();
  var fieldObj = this.__execs__.field;

  var _axisScaleX = function _axisScaleX(axisToggle) {
    axisToggle.field = fieldObj.x.field();
    var curAxis = _this.axisDefault(scale['x-bar'], axisToggle);
    if (axisToggle.orient === 'bottom') curAxis.y(scale['y-bar'].range()[0]);
    return curAxis;
  };
  var _axisScaleY = function _axisScaleY(yScale, axisToggle) {
    var curAxis = _this.axisDefault(yScale, axisToggle);
    if (axisToggle.orient === 'right') curAxis.x(scale['x-bar'].range()[1]);
    return curAxis;
  };
  if (xAt) {
    _axisScaleX(xAt);
  }
  if (yAt) {
    _axisScaleY(scale['y-bar'], { target: yAt.target, field: fieldObj.yBar.field(), orient: 'left' });
    _axisScaleY(scale['y-line'], { target: yAt.target, field: fieldObj.yLine.field(), orient: 'right' });
  }
  this.renderAxis();
}

function _munge$16() {
  var conditionFunc = function conditionFunc(dimensions, measures) {
    var field = this.__execs__.field;
    if (dimensions.length === 1 && measures.length === 2) {
      field.x = dimensionField(dimensions[0]);
      field.yBar = measureField(measures[0]);
      field.yLine = measureField(measures[1]);
      field.region = dimensionField(this.mixedDimension());
      return conditions$8[0];
    } else throw new ConditionException();
  };
  this.condition(conditionFunc);
  this.__execs__.munged = this.data();
}

function _scale$16(keep) {
  var yAt = this.axisY();
  if (yAt) {
    //add the right axis directly
    this.axis({ target: 'y', orient: 'right' });
  }
  var scale = this.scale();
  scale.color = this.updateColorScale(this.measures().map(function (d) {
    return d.field;
  }), keep);
}

function _region$10() {
  var scale = this.__execs__.scale;
  this.renderRegion(function (d) {
    return d.x = d.y = 0;
  }, scale.color.domain().map(function (d) {
    return { key: d };
  }));
}

function _legend$13() {
  var legendToggle = this.legend();
  if (!legendToggle) return;

  this.renderLegend();
}

function _facet$8() {
  var _this = this;

  var parent = this;
  var data = this.data();
  var scale = this.__execs__.scale;
  var field = this.__execs__.field;
  var color = this.color();
  var innerSize = this.innerSize();
  var width = innerSize.width,
      height = innerSize.height;
  var padding = this.padding();
  var dimensions = this.dimensions();
  var barMeasures = [field.yBar.toObject()];
  var barSettings = ['axisTitles', 'padding', 'font', 'label', 'grid'].map(function (d) {
    return { key: d, value: _this[d]() };
  });
  var lineMeasures = [field.yLine.toObject()];
  var lineSettings = ['axisTitles', 'curve', 'point', 'pointRatio', 'regionPadding', 'size', 'grid', 'font', 'label'].map(function (d) {
    return { key: d, value: parent[d]() };
  });
  var _smallLine = function _smallLine() {
    var smallLine = line$2().container(this).data(data).dimensions(dimensions).measures(lineMeasures).width(width).height(height).legend(false).tooltip(false).padding(padding).parent(parent).zeroOffset(true).color(color[1]).scaleBandMode(true);
    lineSettings.forEach(function (d) {
      return smallLine[d.key](d.value);
    });
    smallLine.render();
    scale['x-line'] = smallLine.scale('x');
    scale['y-line'] = smallLine.scale('y');
  };
  var _smallbar = function _smallbar() {
    var smallBar = bar().container(this).data(data).dimensions(dimensions).measures(barMeasures).width(width).height(height).padding(padding).legend(false).tooltip(false).zeroOffset(true).parent(parent).color(color[0]);
    barSettings.forEach(function (d) {
      smallBar[d.key](d.value);
    });
    smallBar.render();
    scale['x-bar'] = smallBar.scale('x');
    scale['y-bar'] = smallBar.scale('y');
  };

  this.regions().each(function (_, i) {
    if (i === 0) d3.select(this).each(_smallbar);else d3.select(this).each(_smallLine);
  });
}

function _tooltip$13() {
  if (!this.tooltip()) return;
  var field = this.__execs__.field;
  var key = function key(d) {
    return { name: 'key', value: d.data.key };
  };
  var value = function value(d, text) {
    var name = d.anchor ? field.yLine.field() : field.yBar.field();
    return { name: name, value: text };
  };
  this.renderTooltip({ value: value, key: key });
}

var size$7 = { range: [2, 2], scale: 'linear', reverse: false };
var conditions$8 = ['normal'];
var _attrs$24 = {
  padding: 0.05,
  point: false,
  pointRatio: 3,
  regionPadding: 0.1,
  size: size$7
};

/**
 * renders a combo chart, having both a bar and a line chart.
 * @class Combo
 * @augments Core
 * @augments RectLinear 
 * @augments PaddingMixin
 */

var Combo = function (_mix$with) {
  inherits(Combo, _mix$with);

  function Combo() {
    classCallCheck(this, Combo);

    var _this = possibleConstructorReturn(this, (Combo.__proto__ || Object.getPrototypeOf(Combo)).call(this));

    _this.setAttrs(_attrs$24);
    return _this;
  }
  /**
   * @override
   */


  createClass(Combo, [{
    key: 'measureName',
    value: function measureName() {
      var measures = this.measures();
      var yField = void 0;
      if (this.condition() === conditions$8[2]) yField = mixedMeasure.field;else if (this.aggregated() && measures[0].field === mixedMeasure.field) yField = measures[0].field;else yField = measures[0].field + '-' + measures[0].op;
      return yField;
    }
  }, {
    key: 'isCount',
    value: function isCount() {
      return this.condition() === conditions$8[1];
    }
  }, {
    key: 'renderLayout',
    value: function renderLayout(keep) {
      this.reset(keep);
      this.renderFrame();
      _munge$16.call(this);
      _scale$16.call(this, keep);
      this.renderCanvas();
      _region$10.call(this);
      _facet$8.call(this);
      _axis$11.call(this);
      _legend$13.call(this);
      _tooltip$13.call(this);
    }
  }]);
  return Combo;
}(mix(RectLinear).with(paddingMixin, seriesMixin));

var combo = genFunc(Combo);

/**
 * @namespace jelly
 * @type {object}
 */
var _layout = {
  /**
   * Generator returns a {@link Bar} instance
   * @type {function} 
   * @see {@link Bar} 
   * @memberOf jelly
   */
  bar: bar,
  /**
   * Generator returns a {@link Line} instance
   * @type {function} 
   * @see {@link Line} 
   * @memberOf jelly
   */
  line: line$2,
  /**
   * Generator returns a {@link Scatter} instance
   * @type {function} 
   * @see {@link Scatter} 
   * @memberOf jelly
   */
  scatter: scatter,
  /**
   * Generator returns a {@link XYHeatmap} instance
   * @type {function} 
   * @see {@link XYHeatmap} 
   * @memberOf jelly
   */
  xyHeatmap: xyHeatmap,
  /**
   * Generator returns a {@link Treemap} instance
   * @type {function} 
   * @see {@link Treemap} 
   * @memberOf jelly
   */
  treemap: treemap$1,
  /**
   * Generator returns a {@link ParCoords} instance
   * @type {function} 
   * @see {@link ParCoords} 
   * @memberOf jelly
   */
  parCoords: parCoords,
  /**
   * Generator returns a {@link Pie} instance
   * @type {function} 
   * @see {@link Pie} 
   * @memberOf jelly
   */
  pie: pie$1,
  /**
   * Generator returns a {@link MarkerMap} instance
   * @type {function} 
   * @see {@link MarkerMap} 
   * @memberOf jelly
   */
  markerMap: markerMap,
  /**
   * Generator returns a {@link Combo} instance
   * @type {function} 
   * @see {@link Combo} 
   * @memberOf jelly
   */
  combo: combo
};
_layout.type = function (type) {
  if (_layout.hasOwnProperty(type)) return _layout[type];
  throw new Error('Undefined type: ' + type + ' is not available');
};

return _layout;

})));
//# sourceMappingURL=jelly.js.map
