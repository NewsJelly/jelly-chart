'use strict';

var d3 = require('d3');

const classPrefix = "jellychart";
const magicTableColorScheme = [ '#50C3F7 ','#7986CB ','#BA68C8 ','#F06292 ','#FF8A65 ','#FFD54F ','#AED581 ','#4CB6AC ','#2C82A9 ','#48528A ','#803E8C ','#A6365B ','#CF6644 ','#C1A039 ','#749350 ','#32827A '];
let labelFormat = (function() {
  let integerFormat = d3.format(',');
  let plusIntegerFormat = d3.format('+,');
  let floatFormat = d3.format(',.2f');
  let plusFloatFormat = d3.format('+,.2f');
  return function(value, plus = false) {
   if(isNaN(value)) return value;
   else if(typeof value === 'string') value = +value;
   return (Number.isInteger(value) ? (plus ? plusIntegerFormat: integerFormat) : (plus? plusFloatFormat : floatFormat))(value);
  }
})();

function className(name, selectorMode = false, prefix = classPrefix) {
  let names = name.split(' ').map(d => prefix + '-' + d);
  if (selectorMode) return '.' + names.join('.');
  else return names.join(' ');
}

function rebindOnMethod(instance, listeners) {
  if (instance.on && typeof instance.on === 'function') { 
    let oldOn = instance.on;
    instance.on = function() { 
      let value;
      try {
        value = oldOn.apply(instance, arguments);
      } catch (e) {
        value = listeners.on.apply(listeners, arguments);
      }
      return value;
    };
  } else {
    instance.on = function () {
      let value = listeners.on.apply(listeners, arguments);
      return value === listeners ? instance : value;
    };
  }
  return instance;
}

function safari () {
  try {
    return  /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);
  } catch(e) {
    return false;
  }
}

function attrFunc(attr) {
  return function(value) {
    if (!arguments.length) return this.__attrs__[attr];
    this.__attrs__[attr] = value;
    return this;
  };
}

function setAttrs(self, attrs) {
  if (!self.__attrs__) self.__attrs__ = {};
  attrs = JSON.parse(JSON.stringify(attrs));
  for (let attr in attrs) {
    if (attrs.hasOwnProperty(attr)) {
      self.__attrs__[attr] = attrs[attr];
    }
  }
}

function setMethodsFromAttrs (classFunc, attrs) {
  for (let attr in attrs) {
    if(attrs.hasOwnProperty(attr) && !classFunc.prototype[attr]) {
      classFunc.prototype[attr] = attrFunc(attr);
    }
  }
}

function setMethodFromDefaultObj (attr, defaultSetting = {}) {
  return function(value) {
    if (!arguments.length) return this.__attrs__[attr];
    else if (typeof value === 'boolean') {
      if (value) value = defaultSetting;
    } else if (typeof value === 'object') {
      for (let k in defaultSetting) {
        if (defaultSetting.hasOwnProperty(k)) {
          if (!(k in value)) value[k] = defaultSetting[k];
        }
      }
    }
    this.__attrs__[attr] = value;
    return this;
  }
}

function uniqueId (_id) {
  return d3.select('body').selectAll('#' + _id).empty();
}

function getUniqueId(prefix, num = 0) {
  let _id = prefix + num;
  while(!uniqueId(_id)) {
    num ++;
    _id = prefix + num;
  }
  return _id;
}

function zeroPoint (domain) {
  return (domain[0] * domain[domain.length-1]) < 0 //assume that domain is sorted
}

function mix (parent) {
  return new MixinBuilder(parent);
}

class MixinBuilder {  
  constructor(parent) {
    this.parent = parent;
  }

  with(...mixins) { 
    return mixins.reduce((cur, mixin) => mixin(cur), this.parent);
  }
}

function genFunc(ClassFunc) {
  let func = function() {
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

function NotAvailableSelectorError (selector) {
  this.message = selector + 'is not availabele to select';
  this.name = 'NotAvailableSelectorError';
}

function ConditionException (message = 'Unacceptable condtion') {
  this.message = message; 
  this.name = 'ConditionException';
}

function ZeroDenominatorException (message = 'Zero in the Denominator of a Fraction') {
  this.message = message ;
  this.name = 'ZeroDenominator';
}

const summarize = {sum: d3.sum, mean: d3.mean, variance: d3.variance, min: d3.min, max: d3.max, median: d3.median, extent: d3.extent};
summarize.values = function (leaves) {
  return leaves;
};
summarize.count = function (leaves) {
  return leaves.length;
};

function dateComparator (order = 'ascending', field) {
  return function(a,b) {
    if (field) {
      a = a[field]; b = b[field];
    }
    if (order === 'natural') return 0;
    else if (order === 'ascending') return a.getTime() - b.getTime();
    else return b.getTime() - a.getTime();
  }
}

function comparator (order = 'ascending', orderList, textToNum = true, accessor = (d => d)) { 
  let reg = /(\d+((-|\.)*\d*))/;
  function __compareNumbers (a, b) {
    if (order === 'natural') return 0;
    else if (order === 'ascending') return a - b;
    else return b - a;
  }
  function __compareStrings (a, b, onlyText = false) {
    if (order === 'natural') return 0;
    if(textToNum && !onlyText) {
      let numA = a.match(reg), numB = b.match(reg);
      if (numA && numB) {
        return __compareNumbers (+numA[0], +numB[0]) || __compareStrings(a,b,true);
      } 
    }
    if (order === 'ascending') return a.localeCompare(b);
    return b.localeCompare(a);
  }
  function __compareByList (a, b) {
    let findFunc = t => {
      return d => {
        if (t instanceof Date && d instanceof Date) return t-d === 0
        else return d === t;
      }
    };
    let ai = orderList.findIndex(findFunc(a)); 
    let bi = orderList.findIndex(findFunc(b));
    if (order === 'descending') return bi-ai;
    else return ai - bi;
  }
  return function(a,b) {
    let compareFunc;
    if (!orderList || orderList.length === 0) {
      compareFunc = (typeof a === 'string' && typeof b === 'string' ? __compareStrings : __compareNumbers);
    } else {
      compareFunc = __compareByList;
    }
    return compareFunc(accessor(a),accessor(b));
  }
}

function leastSquare(target, xField='x', yField='y') {
  const length = target.length;
  const lengthRev = 1.0 / length;
  const xBar = d3.sum(target, d => d[xField]) * lengthRev;
  const yBar = d3.sum(target, d => d[yField]) * lengthRev;
  const ssXX = d3.sum(target.map(d => Math.pow(d[xField] - xBar, 2)));
  const ssYY = d3.sum(target.map(d => Math.pow(d[yField] - yBar, 2)));
  const ssXY = d3.sum(target.map(d => (d[xField] - xBar) * (d[yField]- yBar)));
  const slope = ssXY /ssXX;
  const intercept = yBar - (xBar * slope);
  const rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);
  return {slope, intercept, rSquare};
}


function stack (target, measures, normalized = false) {
  if(!Array.isArray(measures)) measures = [measures];
  target.forEach((d, i, arr) => {
    measures.forEach(m => {
      let prefix = m.valueName();
      if (i === 0) d.data.value[prefix + '-start'] = 0;
      else d.data.value[prefix + '-start'] = arr[i-1].data.value[prefix + '-end'];
      d.data.value[prefix + '-end'] = d.data.value[prefix + '-start'] + d.data.value[prefix];
    });
  });
  if (normalized) {
    let max$$1 = {};
    let lastVal = target[target.length-1].data.value; // need to be sorted.
    measures.forEach(m => {
      let prefix = m.valueName();
      max$$1[prefix] = lastVal[prefix + '-end'];
    });
    target.forEach((d) => {
      measures.forEach(m => {
        let prefix = m.valueName();
        let thisMax = max$$1[prefix];
        if(thisMax !== 0) {
          d.data.value[prefix + '-start'] = d.data.value[prefix + '-start'] / thisMax;
          d.data.value[prefix + '-end'] = d.data.value[prefix + '-end'] / thisMax;
        } else {
          throw new ZeroDenominatorException();
        }
      });
    });
  }}  


function continousScale(domain, type = 'linear', field) {
  let isTime = type === 'time' || false;
  if (!isTime) {
    isTime = true;
    for (let i = 0; i < domain.length; i++) {
      let d = domain[i];
      if (!(d instanceof Date)) {
        isTime = false;
        break;
      }
    }
  }
  let scale;
  if (isTime) {
    scale = d3.scaleTime();
    type = 'time';
  } else {
    if (type === 'pow') scale = d3.scalePow();
    else if (type === 'log') scale = d3.scaleLog();
    else {
      scale = d3.scaleLinear();
      type = 'linear';
    }
  }
  scale._scaleType = type;
  scale._field = field;
  return scale;
}

function dimension(dim, nested) {
  if (dim.interval) { // if has interval, transform key using d3Interval
    let intr = interval[dim.interval];
    nested.key(d => intr(d[dim.field])); 
  } else if (dim.format) { 
    let f = dim.format;
    nested.key(d => f(d[dim.field]));
  } else {
    nested.key(d => d[dim.field]); 
  }
  if( (dim.order === 'ascending'  || dim.order === 'descending')) {
    nested.sortKeys(comparator(dim.order, dim.orderList));
  }
  return nested;
}

function dateKey (result, reverse, preFormat) { 
  let dimensions = this.dimensions();
  let currentLevel = result;
  for (let i = 0 ; i < dimensions.length ; i++) {
    let dim = reverse ? dimensions[dimensions.length - 1 - i] : dimensions[i];
    if (dim.interval) {
      currentLevel.forEach(d => {
        d.key = new Date(d.key);
      });
      currentLevel.sort(dateComparator(dim.order, 'key'));
      if (preFormat && dim.format) { //preformatting : treemap
        currentLevel.forEach(d => {
          d.key = dim.format(d.key);
        });
      }
    }
    if (i < dimensions.length -1) currentLevel = d3.merge(result.map(d => d.values));
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
function aggregate (reverse = false, rollup = true, preFormat = false, useHierarchy = true, sum$$1 = true, dimensions, measures) {
  let data = this.data();
  dimensions = dimensions || this.dimensions();
  measures = measures || this.measures();
  let nested = d3.nest();
  for (let i = 0 ; i < dimensions.length ; i++) {
    let dim = reverse ? dimensions[dimensions.length - 1 - i] : dimensions[i];
    dimension(dim, nested);
  }
  if(!rollup) {
    let result = dateKey.call(this, nested.entries(data), reverse, preFormat);
    return useHierarchy ? d3.hierarchy({values:result}, function(d){return d.values;}).children : result;
  }
  nested.rollup(values => {
    let result = {};
    measures.forEach(m => {
      result[`${m.field}-${m.op}`] = summarize[m.op](values, d => d[m.field]); //name => field + op
    });
    return result;
  });
  let result = nested.entries(data);
  dateKey.call(this, result, reverse, preFormat);
  
  if (useHierarchy) {
    let root = d3.hierarchy({values:result}, function(d){return d.values;});
    if (sum$$1 && measures.length === 1) {
      let m = measures[0];
      root.sum(d => d.value ? d.value[`${m.field}-${m.op}`] : 0);
    }
    return root.children;
  } else {
    return result;
  }
}

const attrs$1 = {
  customDomain: null,
  level: 0, //level in hierarchy
  munged: null, //nested data
  target: null, //x|y|region
  format: null, //string|number|date|mixed
  formatSub: null, //string|number|date|mixed
  field: null, //fieldname
};

class Field {
  constructor(field) {
    setAttrs(this, attrs$1);
    this.__execs__ = {};
    this.setInit(field, ['field', 'format', 'formatSub', 'customDomain']);
  }
  setInit(source, attrNames = []) {
    if (source) {
      attrNames.forEach(n => {
        if (source[n]) this[n](source[n]);
      });
    }
    return this;
  }
  axis(at) {
    if (!arguments) return this.__execs__.axis;
    if (at && typeof at === 'object') {
      if (at !== this.__execs__.axis) this.__execs__.axis = at;
      at.field = this.mixed ? this.concatFields() : this.field();
      at.tickFormat = this.format();
      at.tickFormatSub = this.formatSub();
    }
    return this;
  }
  toObject() {
    return {field: this.field(), format: this.format(), formatSub: this.formatSub(), customDomain: this.customDomain()}
  }
}
setMethodsFromAttrs(Field, attrs$1);

const countMeasureTitle = ' ';
const countMeasure = {field: '__--jelly_count_measure--__', op: 'count'}; 
const mixedMeasure = {field: '__--jelly_mixed_measure--__', op: 'mean'}; 

const attrs = {
  aggregated: false, //already aggregated
  op: 'mean',
  mixed: false,
  measures: [] //when mixed, get measures
};

class MeasureField extends Field {
  constructor(measure) {
    super(measure);
    setAttrs(this, attrs);
    this.setInit(measure, ['op']);
  }
  domain(padding = 0, stacked = false, allowMono = false) {
    const level = this.level();
    const munged = this.munged();

    let curLevel = 0;
    let domain = [];
    let field = this.valueName();
    function _value(target, curLevel) {
      target.forEach(function(d) {
        if(curLevel < level) {
          _value(d.children, curLevel+1);
        } else {
          if (stacked) {
            domain.push(d.data.value[field + '-start'] );
            domain.push(d.data.value[field + '-end'] );
          } else {
            domain.push(d.data.value[field]);
          }
        }
      });
    }
    _value(munged, curLevel);
    domain = d3.extent(domain);
    if (domain[0] === domain[1] && !allowMono) { //when min and mix is the same
      const offset = domain[0] * 0.2;
      domain[0] -= offset;
      domain[1] += offset;
    }

    if(padding <= 0) return domain;
    let dist = Math.abs(domain[0] - domain[1]);
    dist *= padding * 0.5;
    return [domain[0] - dist, domain[1] + dist];
  }

  concatFields() {
    if (this.mixed()) {
      if (this.measures().length > 0) return this.measures().map(d => d.field).join('-');
      else return '';
    }
    else if (this.field() === mixedMeasure.field) return '';
    else return this.field();
  }

  valueName() {
    let fieldName = this.field();
    return fieldName + (this.mixed() || (fieldName === mixedMeasure.field && this.aggregated())? '' : '-' + this.op()); 
  }

  toObject() {
    let def = super.toObject();
    def.op = this.op();
    return def;
  }
}

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
function aggregateMixed (reverse = false, useHierarchy = true, sum$$1 = true) {
  let data = this.data();
  let dimensions = this.dimensions();
  let measures = this.measures();
  let results;
  if(dimensions.length === 0) {
    results = measures.map(m => {
      let value = summarize[m.op](data, d => d[m.field]);
      let result = {};
      result.key = m.field; //result[mixedDimension.field] = m.field;
      result.value = {};
      result.value[mixedMeasure.field] = value;
      return result;
    });   
  } else { 
    results = this.aggregate(data, true, false, false);
    if (reverse) {
      results = measures.map(function(m) {
        let result = {};
        result.key = m.field;
        result.values = results.map(function (d) { 
          let result = {};
          result.key = d.key;
          result.value = {};
          result.value[mixedMeasure.field] = d.value[m.field + '-' + m.op];
          return result;
        });
        return result;
      });
    } else {
      results.forEach(function(d) {
        d.values = measures.map(function(m) {
          let result = {};
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
    let root = d3.hierarchy({values:results}, function(d){return d.values;});
    if (sum$$1) {
      root.sum(d => d.value ? d.value[mixedMeasure.field] : 0);
    }
    return root.children;
  } else {
    return results;
  }
}

const allowThreshold = 20;
/**
 * @memberOf Core#
 * If autoResize is true, it will ignore current width setting and change the chart's width according to the containers's width. If autoResize is not specified, returns the current autoResize setting. 
 * @return {autoResize|Core}
 * @param {boolean} [autoResize=false] If is true, resizes the chart's width according to the containers's width
 * @return {autoResize|Core}
 */
function autoResize(autoResize) {
  if (!arguments.length) return this.__attrs__.autoResize;
  if (autoResize) {
    if (!this.__execs__.autoResize) {
      const that = this;
      let allowResize = true; 
      let lastWidth;
      this.__execs__.autoResize = function() {
        if (allowResize && that.__execs__.canvas) {
          const rect = that.__execs__.container.node().getBoundingClientRect();
          if ((!lastWidth || lastWidth !== rect.width))  {
            const transition$$1 = that.transition();
            that.width(rect.width)
              .transition({duration: 0, delay:0})
              .render(true, that.autoResizeSkip())
              .transition(transition$$1);
            lastWidth = rect.width;
          }
          allowResize = false;
          setTimeout(() => {
            allowResize = true;
          }, allowThreshold);
        }
      };
    }
    window.addEventListener('resize', this.__execs__.autoResize);
  } else {
    if (this.__execs__autoResize) {
      window.removeEventListener('resize', this.__execs__.autoResize);
      this.__execs__.autoResize = null;
    }
  }
  this.__attrs__.autoResize = autoResize;
  return this;
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
function color (color) {
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
  colorDomain = colorDomain.map(d => {
    if (typeof d === 'string' || typeof d === 'number') return {key: d};
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
function condition (conditionFunc) {
  if (!arguments.length) return this.__execs__.condition;
  this.__execs__.condition = conditionFunc.call(this, this.__attrs__.dimensions, this.__attrs__.measures);
  return this;
}

const duration = 140;
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
  if(this.__execs__.legend) this.__execs__.legend.demute(excemptionFilter);
  return this;
}

function conditionForMute (filter) {
  let cond;
  if (typeof filter === 'function') {
    cond = filter;
  } else if (typeof filter === 'string') { 
    cond = d => d.data.key !== filter;
  } else if (typeof filter === 'object' && filter.data) {
    cond = d => d.data.key !== filter.data.key;
  } else if (typeof filter === 'object') {
    cond = d => d.data.key instanceof Date ? d.data.key - filter !== 0 : false;
    if (filter instanceof Date) return cond = d => d.data.key instanceof Date ? d.data.key - filter !== 0 : false;
    else cond = d => d.data.key !== filter;
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
function demuteNodes (excemptionFilter) {
  let nodes;
  if (!arguments.length) { //모두 
    nodes = this.filterNodes().classed('mute', false).call(this.demute);
  } else {
    nodes = this.filterNodes(conditionForMute(excemptionFilter));
    if (nodes.size() > 0) {
      nodes.classed('mute', false).call(this.demute);
    }
  }
  return this;
}

function demute$2(regions, isSeries = false) {
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
  let regions;
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

const dimensionMax = 100;
function setFormat(f) {
  if (f && typeof f === 'string') {
    try {
      return d3.timeFormat(f);
    } catch (e) {
      try {
        return d3.format(f);
      } catch (e) {
        throw e;
      }
    } 
  } else if (typeof f === 'function') {
    return f;
  } else {
    return null;
  }
}
function _dimensionType(dimension) {
  if (typeof dimension === 'string') {
    return {field: dimension, order: 'natural', max: dimensionMax};
  } else if (typeof dimension === 'object') {
    dimension = Object.assign({}, dimension);
    if (!dimension.max) dimension.max = dimensionMax;
    if (!dimension.order) dimension.order = 'natural';
    dimension.format = setFormat(dimension.format);
    dimension.formatSub = setFormat(dimension.formatSub);
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
 * @param {string|function} [dimension.format=undefined] a time formatter for the given string {@link https://github.com/d3/d3-time-format#locale_format specifier}
 * @param {string|function} [dimension.formatSub=undefined] a sub-time formatter for the given string {@link https://github.com/d3/d3-time-format#locale_format specifier}, which used sub-ticks on it's axis.
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
function dimensions (dimensions) {
  if (!arguments.length) return this.__attrs__.dimensions;
  if (!Array.isArray(dimensions)) {
    dimensions = [dimensions];
  }
  this.__attrs__.dimensions = dimensions.map(function (v) { return _dimensionType(v); });
  return this;
}

/**
 * gets a domain of the scale with a specified name
 * @memberOf Core#
 * @function
 * @param {string} name 
 */
function domain(name) {
  const scale = this.__execs__.scale;
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
  let nodes = this.nodes();
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
function filterRegions(callback, noFacet = false) {
  let regions = this.regions();
  if (!callback || typeof callback !== 'function') return regions;
  if (noFacet) {
    regions =  regions.filter(function() {
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
function hideTooltip() {
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
function innerSize(needArray = false) {
  let offset = this.offset();
  let width = this.width() - offset.left - offset.right;
  let height = this.height() - offset.top - offset.bottom;
  if (needArray) return [width, height];
  else return {width, height};
}

const horizontalThickness = 54;
const verticalThickness = 162;

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
 * @param {string} [legend.align=start] sets a legend align(start|middle|end)
 * @param {number} [legend.thickness=(54|162)] sets a legend thickness. if the orient is top or bottom, the default thickness is 54 pixels. Otherwise, it would be 162 pixels.
 * @return {legend|Core}
 */
function legend (legend) { 
  if (!arguments.length) return this.__attrs__.legend;
  if (legend === true) this.__attrs__.legend = {orient: 'bottom', align: 'start', thickness: horizontalThickness  };
  else if (legend === false) this.__attrs__.legend = null;
  else if (typeof legend === 'object') {
    if(!legend.orient) legend.orient = 'bottom';
    if(!legend.thickness) legend.thickness = (legend.orient === 'bottom' || legend.orient === 'top') ? horizontalThickness : verticalThickness;
    if(!legend.align) legend.align = 'start';
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
  let _limit = function (target, num, level, maxLevel) {
    target = target.slice(0, num);
    if (level < maxLevel) target.forEach(d => d.children = _limit(d.children, num, level+1, maxLevel));
    return target;
  };
  if(!arguments.length) {
    let num = this.__attrs__.limitKeys;
    if (num) {
      let munged = this.__execs__.munged;
      let nestedLevel = this.dimensions().length;
      let result = _limit(this.aggregated() ? munged.children : munged, num, 1 , nestedLevel);
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
  if(!arguments.length) {
    let num = this.__attrs__.limitRows;
    if (num) {
      let data = this.data();
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
function margin(margin = {}) {
  const curMargin =this.__attrs__.margin;
  if (!arguments.length) return this.__attrs__.margin;
  if (typeof margin === 'object') {
    ['top', 'right', 'left', 'bottom'].forEach(prop => append(margin, curMargin, prop));
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
function measure (measure) {
  if (typeof measure === 'string') {
    this.__attrs__.measures.push({field: measure, op: 'sum'});
  } else if (typeof measure === 'object') {
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
function measureName  (measure, suffix) {
  measure = measure  || this.measures()[0];
  let name = measure.field;
  if (!this.aggregated() || measure.field !== mixedMeasure.field) name += '-' + measure.op;
  return name + (suffix !== undefined ?  ('-' + suffix) : '');
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

function measures (measures) {
  if (!arguments.length) return this.__attrs__.measures;
  var _type = function (v) {
    if (typeof v === 'string') {
      return {field: v, op: 'sum'};
    } else if (typeof v === 'object') {
      if ('format' in v && typeof v.format === 'string') v.format = d3.timeFormat(v.format);
      return v;
    }
  };
  if (Array.isArray(measures)) {
    this.__attrs__.measures = measures.map(function (v) { return _type(v); });
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
  const mixedDimension = {order: 'natural'};
  mixedDimension.field = this.measures().map(d => d.field).join('-');
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
  let nodes;
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

function mute$2(regions, ismute = true, isSeries = false) {
  regions.selectAll(isSeries ? this.seriesName() : this.nodeName()).classed('mute', ismute).call(ismute ? this.mute : this.demute, this.muteIntensity());
}

function muteRegions(exceptionFilter) {
  let regions;
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
  let splited;
  if (!arguments.length || nodeName === false) return this.__attrs__.nodeName;
  else if (typeof nodeName === 'boolean' && nodeName) {
    return splited ? splited :  (splited = this.__attrs__.nodeName.split('.').join(' ').trim())
  }
  else if (typeof nodeName === 'string') {
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

const zeroMargin = {top:0, right:0, bottom:0, left:0};
/**
 * returns offsets around the content area, that includes the {@link Core#margin margin}, {@link Core#legend legend} area
 * @memberOf Core#
 * @function
 * @return {object} {top, right, bottom, left} offset in pixels
 */
function offset() {  
  if (this.zeroOffset()) return zeroMargin;
  let offset = Object.assign({}, this.zeroMargin() ? zeroMargin : this.margin());
  let legend = this.legend();
  if(legend) offset[legend.orient] += legend.thickness;
  return offset;
}

/**
 * @private
 * @param {Core} parent 
 */
function parent(parent) {
  if(!arguments.length) return this.__attrs__.parent;
  this.__attrs__.parent = parent;
  return this;
}

function gen(type, call, option) {
  return {type, call, allow: option.allow, isPre: option.isPre};  
}
/**
 * sets and gets rendering procedures.
 * @memberOf Core#
 * @function
 * @param {string} [type] 
 * @param {function} [call] 
 * @param {object} [option]
 * @param {string} option.after
 * @param {function} option.allow
 * @return {process|process[]|Core}
 */
function process(type, call, option={}) {
  if (!this.__process__) this.__process__ = [];
  if (!arguments.length) return this.__process__;
  const process = this.__process__;
  if (call && typeof call === 'function') {
    const existing = process.findIndex(p => p.type === type);
    if (existing >=0) { //renew existing
      process[existing] = gen(type, call, option);
    } else {
      process.splice(process.length, 0, gen(type, call, option)); //insert new proc
    }
    return this;
  } else {
    return process.find(p => p.type === type);
  }
}

/**
 * @private
 * @param {d3Dispatch} listeners 
 */
function rebindOnMethod$1(listeners) {
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
function remove() {
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
function run(process) {
  process.forEach(p => {
    if (p.allow) {
      if (p.allow.call(this)) p.call.call(this);
    } else {
      p.call.call(this);
    }
  });
}
/**
 * renders the chart. At the end of settings for a chart, it should be called. If keep is true, it does not reset existing scales.
 * @memberOf Core#
 * @function
 * @param {boolean} [keep=false] If is true, not reset existing scales.
 * @param {String[]} [skip=[]] If skip includes an process, the process will be ignored.
 * @return {Core}
 */
function render(keep = false, skip = []) {
  const process = {
    pre: [],
    post: []
  };
  this.process().forEach(p => {
    if (skip.indexOf(p.type) < 0) {
      if (p.isPre) process.pre.push(p);
      else process.post.push(p);
    }
  });

  this.reset(keep);
  this.keep(keep);
  if (this.needCanvas()) this.renderFrame();
  run.call(this, process.pre);
  if (this.needCanvas()) this.renderCanvas();
  run.call(this, process.post);

  if (!this.__execs__.canvas) return;

  const dispatch$$1 = this.__execs__.selectDispatch;
  const node = this.nodes();
  const legend = this.__execs__.legend;
  if (node && node.size() > 0) {
    if (this.parent()) {
      return;
    }
    node.call(bindOn, dispatch$$1)
      .on('mouseenter.default.legend', (d) => {
        if (legend && legend.mute && this.muteToLegend) this.muteToLegend(d);
      }).on('mouseleave.default.legend', (d) => {
        if (legend && legend.demute && this.demuteToLegend) this.demuteToLegend(d);
      });
  }

  if (this.isFacet && this.isFacet()) { //when is facet, get dispatch from regions.
    node.call(bindOn, dispatch$$1);
  }

  if (this.stream && this.stream() && keep) {
    this.stream(null);
  }

  return this;
}

const background = 'none';
function appendClipPath(selection, innerSize, margin = 0, transition$$1 = null) {
  let pos = rect => {
    rect.attr('x', -margin)
      .attr('y', -margin)
      .attr('width', innerSize.width + margin*2)
      .attr('height', innerSize.height + margin*2);
  };
  let defs = selection.selectAll(function() {
      return this.childNodes;
    }).filter(function() {
      return d3.select(this).classed(className('canvas-g-defs'))
    });
  if (defs.empty()) {
    defs = selection.append('defs')
      .attr('class', className('canvas-g-defs'))
      .datum(innerSize);  
    defs.append('clipPath')
      .attr('id', () => getUniqueId('canvas-g-'))
      .attr('class', className('canvas-g-clip-path'))
    .append('rect')
      .attr('class', className('canvas-g-clip-path-rect'))
      .call(pos);
  }
  
  let rect = defs.select(className('canvas-g-clip-path-rect', true));
  if (transition$$1) rect = rect.transition().duration(transition$$1.duration).delay(transition$$1.delay);
  rect.call(pos);
}

function appendStringContainer(selector, offset, self) {
  const markLocal = self.__execs__.mark;
  selector = d3.select(selector);
  if (selector.empty()) throw new NotAvailableSelectorError();
  if (selector.node().tagName === 'g' || selector.node().tagName === 'G') {
    if (selector.select(className('canvas-g', true)).empty() ) {
      self.__execs__.canvas = selector.append('g').attr('class', className('canvas-g'));
      self.__execs__.canvas.append('g').attr('class', className('regions'));
    } else if(!this.__execs__.canvas) {
      self.__execs__.canvas = selector.select(className('canvas-g', true));
    }
    markLocal.set(self.__execs__.canvas.node(), {x:offset.left, y:offset.right});
    self.__execs__.canvas
      .attr('transform', 'translate(' + [offset.left, offset.right] +')');
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
function renderCanvas (margin = 0) {
  let selector = this.container();
  if(selector === null) return null;
  let offset = this.offset();
  let innerSize= this.innerSize();
  if(typeof selector !== 'string') { //if is DOM
    appendStringContainer(selector, offset, this);
    if (this.__execs__.canvas) { //if has a canvas, return 
      this.__execs__.canvas.datum(this.__execs__.munged);
      this.__execs__.canvas.call(appendClipPath, innerSize, margin, this.transition());
      return;
    } 
  }

  let svg;
  if (this.__execs__.canvas) { //if has a canvas, find svg
    svg = d3.select(this.__execs__.canvas.node().parentNode);
  } else { //if has no canvas, generate svg and canvas.
    let container =  d3.select(selector);
    if (container.empty()) {
      throw new NotAvailableSelectorError();
    }
    svg = container.select(className('frame', true)).select('svg');
    this.__execs__.canvas = svg.append('g').attr('class', className('canvas-g'))
      .attr('transform', 'translate(' + [offset.left, offset.top] +')');
    this.__execs__.canvas.append('rect')
      .attr('class', className('background'))
      .style('fill', background);
    this.__execs__.canvas.append('g').attr('class', className('regions'));
  }
  let trans = this.transition();
  let canvas = this.__execs__.canvas;
  canvas.style('pointer-events', 'none');
  if (trans) { //FIXME: enable pointer events after rendering
   canvas.transition().duration(trans.duration).delay(trans.delay)
    .attr('transform', 'translate(' + [offset.left, offset.top] +')')
    .on('end', function() {
      d3.select(this).style('pointer-events', 'all');
    });
  } else {
    canvas.attr('transform', 'translate(' + [offset.left, offset.top] +')')
      .style('pointer-events', 'all');
  }
  canvas.select(className('background', true))
    .attr('width', innerSize.width).attr('height', innerSize.height);
  canvas.datum(this.__execs__.munged)
    .call(appendClipPath, innerSize, margin, this.transition());
  
  return this;
}

function setSvg(svg, self) {
  svg.attr('width', self.width())
    .attr('height', self.height())
    .attr('viewBox', '0 0 ' + self.width() + ' ' + self.height());
  return svg;
}

function appendHidden(container, self) {
  self.__execs__.hidden = container.append('g')
    .attr('class', className('hidden-g'))
    .style('visibility', 'hidden');
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
  let selector = this.container();
  let container = d3.select(selector);
  if (container.empty()) throw new NotAvailableSelectorError();
  this.__execs__.container = container;
  if (typeof selector !== 'string') {
    if (container.node().tagName === 'g' || container.node().tagName === 'G') {
      if (container.selectAll(className('hidden-g', true)).empty()) {
        container.call(appendHidden, this);
      } else if (!this.__execs__.hidden) {
        this.__execs__.hidden = container.select(className('hidden-g', true));
      }
      return ;  
    }
  }
  let svg;
  if (!this.__execs__.canvas) {
    svg = container.append('div')
     .attr('class',  className('frame'));
    if(this.name()) svg.attr('id', 'jelly-chart-id-' + this.name());
    svg = svg.append('svg');
    svg.call(appendHidden, this);
    svg.call(setSvg, this);
  } else {
    svg = d3.select(this.__execs__.canvas.node().parentNode);
  }
  if (this.autoResize()) {
    this.width(this.__execs__.container.node().getBoundingClientRect().width);
  }
  container.select(className('frame', true))
    .style('width', this.width() + 'px')
    .style('height', this.height() + 'px');
  if (this.transition()) svg = svg.transition().duration(this.transition().duration).delay(this.transition().delay);
  svg.call(setSvg, this);
  return this;
}

const defaultFont$1 = {
  'font-family': 'sans-serif',
  'font-size': 11,
  'font-weight': 'normal',
  'font-style': 'normal'
};
const areaClipPath = className('legend-area-clip-path');
const labelClipPath = className('legend-label-clip-path');
const aligns = ['start', 'middle', 'bottom'];
const orients$1 = ['top', 'bottom'];
const highlightDuration = 180;
const _attrs$4 = {
  align: aligns[0],
  color: '#485465',
  muteIntensity: 0.3,
  font: defaultFont$1,
  format: null,
  height: 0,
  orient: orients$1[1],
  scale: null,
  showTooltip: true,
  title: null,
  transition : null,
  width: 0,
  x: 0,
  y: 0
};
class Legend {
  constructor() {
    this.__attrs__ = JSON.parse(JSON.stringify(_attrs$4));
    this.__execs__ = {legend:null};
    this.__execs__.dispatch = d3.dispatch('selectClick', 'selectEnter', 'selectLeave');
    rebindOnMethod(this, this.__execs__.dispatch);
  }
}

function _legend() {
  return new Legend();
}

function isHorizontal() {
  return this.orient() === 'bottom' || this.orient() === 'top';
}

function _style(selection) {
  let font = this.font();
  for (var k in font) {
    selection.style(k, (k === 'font-size' ? font[k] + 'px' : font[k]));
  }
}

function _align(selection) {
  const area$$1 = selection.select(className('label-area', true));
  const width = this.width();
  const align = this.align();
  const areaWidth = area$$1.node().getBBox().width;
  let alignPos = 0;
  
  if (align === aligns[1]) { //middle
    alignPos = Math.round((width - areaWidth) /2); 
  } else if (align === aligns[2]) { //end
    alignPos = width - areaWidth;
  }
  area$$1.attr('transform', `translate(${alignPos},0)`);
  return selection;
}

function _arrow(selection, that, rowNum) {
  const isHorizontal = that.isHorizontal();
  const width = that.width();
  const height = that.height();
  const labelHeight = that.labelHeight();
  const labelPadding = that.labelPadding();
  const rectW = labelHeight + labelPadding;
  const arrowColor = d3.schemeCategory10[0], rectColor = '#A3A3A3';
  const area$$1 = selection.select(className('label-area', true));
  let curRowNum = 0;
  let arrow = selection.selectAll(className('arrow', true))
    .data(['up', 'down']);
  let arrowEnter = arrow.enter().append('g')
    .attr('class', d => className('arrow ' + d))
    .style('cursor', 'pointer');
  arrowEnter.append('rect')
      .attr('width', rectW)
      .attr('height', rectW)
      .attr('fill', '#fff')
      .attr('stroke', rectColor)
      .attr('stroke-width', '1px')
      .attr('shape-rendering', 'crispEdges');
  arrowEnter.append('path')
    .attr('d', d3.symbol().type(d3.symbolTriangle).size(labelHeight * 2.5))
    .attr('transform', function (d, i) {
      var translate = 'translate(' + [(rectW - 1) * 0.5, (rectW - 1) * 0.5] + ')';
      return translate + (i === 1 ? 'rotate(180)' : '');
    })
    .style('display', 'block')
    .attr('fill', d => d === 'up' ? rectColor : arrowColor);
  arrow = arrowEnter.merge(arrow)
    .attr('transform', function (d,i) {
      if (isHorizontal) return 'translate(' + [ width + labelPadding, i * (labelHeight + labelPadding) ] + ')';
      else return 'translate(' + [0, height + labelPadding*1.25 + i * (labelHeight + labelPadding)] +')'
    });
  arrow.on('click', function(d) {
    if (d === 'up' && curRowNum > 0) {
      curRowNum -=1;
    } else if (d === 'down' && curRowNum < rowNum ) {
      curRowNum += 1; 
    } else {  
      return;
    }
    arrow.select('path').style('fill', arrowColor).style('cursor', 'pointer');
    if (curRowNum === 0) {
      arrow.select('path').filter(d => d === 'up').style('fill', rectColor).style('cursor', 'default');
    } else if (curRowNum === rowNum) {
      arrow.select('path').filter(d => d === 'down').style('fill', rectColor).style('cursor', 'default');
    }

    area$$1.attr('transform', 'translate(' + [0, -curRowNum * (labelHeight + labelPadding)] + ')');
    //areaClip.select('rect').attr('y', curRowNum * (labelHeight + labelPadding))
  });
}

function _clipPath (selection, that) {
  const width = that.width();
  const maxLabelW = that.isHorizontal() ? width /2 : width;
  
  let defs = selection.selectAll('defs')
    .data([[{name: areaClipPath, width: width}, {name: labelClipPath, width: maxLabelW}]]);
  defs = defs.enter().append('defs').merge(defs);
  let clipPath = defs.selectAll('clipPath')
    .data(d => d, d => d.name);
  clipPath.exit().remove();
  clipPath = clipPath.enter().append('clipPath')
    .attr('class', d => d.name)
    .attr('id', d => getUniqueId(d.name + '-'))
    .merge(clipPath);
  let rect = clipPath.selectAll('rect')
    .data(d => [d]);
  rect.exit().remove();
  rect = rect.enter().append('rect')
    .merge(rect)
    .attr('width', d => d.width)
    .attr('height', that.height());
  selection.select(className('label-area-parent', true))
    .attr('clip-path', 'url(#' + clipPath.filter((d,i) => i === 0).attr('id') + ')');
  selection.selectAll(className('label', true))
    .attr('clip-path', 'url(#' +clipPath.filter((d,i) => i === 1).attr('id') + ')');
  return selection;
}
function _overflow(selection) {
  const isHorizontal = this.isHorizontal();
  const width = this.width();
  const maxLabelW = isHorizontal ? width /2 : width;
  const labelHeight = this.labelHeight();
  const labelPadding = this.labelPadding();
  let rowNum = 0, curX = 0, curY = 0;
  selection.call(_clipPath, this);
  selection.selectAll(className('label', true))
    .each( function(d,i) {
      let selection = d3.select(this);
      let x,y;
      let w = Math.min(this.getBBox().width, maxLabelW);
      if(i === 0  || (isHorizontal && curX + w + labelPadding * 2 <= width)) {
        x = curX;
        y = curY;
      } else {
        rowNum += 1;
        x = curX = 0;
        y = curY = curY + labelHeight +  labelPadding;
      }
      curX += w + labelPadding * 2;
      selection.attr('transform', 'translate(' + [x,y] +')');
    });
  if ((rowNum +1) * (labelHeight + labelPadding) > this.height()) { 
    selection.call(_arrow, this, rowNum);
  } else {
    selection.selectAll(className('arrow', true)).remove();
  }
}

function _render(selection) {
  this.__execs__.legend = selection;
  
  let area$$1 = selection.select(className('label-area', true));
  if(this.transition() && !area$$1.empty()) {
    let trans = this.transition();
    selection.transition().duration(trans.duration).delay(trans.delay)
      .attr('transform', 'translate(' +[this.x(), this.y()] + ')');
  } else {
    selection.attr('transform', 'translate(' +[this.x(), this.y()] + ')');
  }
  if (area$$1.empty()) {
    area$$1 = selection.append('g').attr('class', className('label-area-parent'))
     .append('g').attr('class', className('label-area'));
  }
  
  const labelHeight = this.labelHeight();
  const labelHeightHalf = labelHeight/2;
  let scale = this.scale();
  let label = area$$1.selectAll(className('label', true))
    .data(scale.domain().filter(d => d !== undefined && d !== null).map(d => {
      return {key: d, color: scale(d)}
    }));
  
  label.exit().remove();
  
  let labelEnter = label.enter().append('g')
    .attr('class', className('label'))
    .style('cursor', 'pointer');
  labelEnter.append('title');
  labelEnter.append('rect').style('fill', 'none');
  labelEnter.append('circle');
  labelEnter.append('text')
    .style('letter-spacing', '-0.1px');

  label = labelEnter.merge(label)
    .style('fill', d => d.color);
  label.select('title')
    .text(d => this.format() ? this.format()(d.key) : d.key);
  label.select('circle')
    .attr('cx', labelHeightHalf).attr('cy', labelHeightHalf)
    .attr('r', 5);
  label.select('text')
    .attr('x', labelHeight)
    .attr('dx', '.35em')
    .attr('dy', '.9em')
    .style('fill', this.color())
    .text(d => this.format() ? this.format()(d.key) : d.key);
  label.select('rect')
    .attr('width', function() {
      return this.parentNode.getBBox().width;
    }).attr('height', function() {
      return this.parentNode.getBBox().height;
    });
  const dispatch$$1 = this.__execs__.dispatch;
  label.on('click', function(d) {
    dispatch$$1.call('selectClick', this, d);
  }).on('mouseenter', function(d) {
    dispatch$$1.call('selectEnter', this, d);
  }).on('mouseleave', function(d) {
    dispatch$$1.call('selectLeave', this, d);
  });
}

function _filter(selection, exceptionFilter) {
  if (typeof exceptionFilter === 'function') {
    return selection.filter(exceptionFilter)
  } else if (typeof exceptionFilter === 'string') {
    return selection.filter(d => d.key !== exceptionFilter);
  } else if (exceptionFilter instanceof Date) {
    let keyTime = exceptionFilter.getTime();
    return selection.filter(d => d.key.getTime() !== keyTime);
  } else if (exceptionFilter.tagName && exceptionFilter.tagName === 'g') {
    return selection.filter(function() {
      return this !== exceptionFilter;
    })
  } 

  return selection.filter(() => true);
}

function demute$3(exceptionFilter) {
  _filter(this.__execs__.legend.selectAll(className('label', true)), exceptionFilter)
    .transition().duration(highlightDuration)
    .attr('opacity', 1);
}

function mute$3(exceptionFilter) {
  let selection = _filter(this.__execs__.legend.selectAll(className('label', true)), exceptionFilter);

  if (selection) {
    selection.transition().duration(highlightDuration)
      .attr('opacity', this.muteIntensity());
  } 
  return this;
}

function labelHeight() {
  return this.font()['font-size'];
}

function labelPadding() {
  return this.isHorizontal() ? this.labelHeight() /2 : this.labelHeight();
}

function update() {

}
function render$2(selection) {
  _style.call(this, selection);
  _render.call(this, selection);
  _overflow.call(this, selection);
  _align.call(this, selection);
}
Legend.prototype.demute = demute$3;
Legend.prototype.mute = mute$3;
Legend.prototype.labelHeight =  labelHeight;
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
function renderLegend(field = 'region') {
  const that = this;
  let legendToggle = this.legend();
  let canvas = this.__execs__.canvas;  
  if (!legendToggle) {
    canvas.selectAll(className('legend', true)).remove();
    return;
  }
  const fieldObj = this.__execs__.field;
  if (!legendToggle.format && fieldObj[field].isInterval()) legendToggle.format = fieldObj[field].format();
  let x,y,width, height;
  let offset =  this.offset();
  let innerSize = this.innerSize();
  let margin = this.margin();
  let offsetThickness = legendToggle.font ? legendToggle.font['font-size'] : 20;
  if (legendToggle.orient === 'bottom' || legendToggle.orient === 'top') {
    x = 0;
    if (legendToggle.orient === 'bottom') y = innerSize.height  + offset.bottom - margin.bottom - legendToggle.thickness + offsetThickness;
    else y = - offset.top + margin.top - offsetThickness;
    if (this.axisX && !this.axisX()) {
      y += offsetThickness * (legendToggle.orient === 'bottom' ? 1 : -1);
    }
    width = innerSize.width;
    height = legendToggle.thickness - offsetThickness;
  } else {
    if (legendToggle.orient === 'right') x = innerSize.width + offset.right - legendToggle.thickness;
    else x = - offset.left + margin.left - offsetThickness;
    y = offsetThickness / 2;
    width = legendToggle.thickness - offsetThickness;
    height = innerSize.height - offsetThickness/2;
  }
  let colorScale = this.scale().color;
  let legendObj = _legend().scale(colorScale)
    .x(x).y(y)
    .align(legendToggle.align)
    .width(width).height(height)
    .orient(legendToggle.orient)
    .format(legendToggle.format)
    .transition(this.transition());
  this.__execs__.legend = legendObj;

  legendObj.on('selectEnter', function(d) {
    if (that.muteFromLegend) {
      that.muteFromLegend(d);
    }
    legendObj.mute(this); //FIXME: need to mute by the label
    that.__execs__.selectDispatch.call('legendEnter', this, d);
  }).on('selectLeave', function(d) {
    if (that.demuteFromLegend) {
      that.demuteFromLegend(d);
    }
    legendObj.demute(this);
    that.__execs__.selectDispatch.call('legendLeave', this, d);
  });
  
  let legendSel = canvas.selectAll(className('legend', true))
    .data([legendObj]);
  legendSel.exit().remove();
  legendSel.enter().append('g')
    .attr('class', className('legend'))
    .merge(legendSel)
    .each(function(legend) {
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
function renderRegion(posFunc, dataFunc = d => d, isFacet = false, suffix = '') {
  let region = this.__execs__.canvas.select(className('regions', true))
    .selectAll(this.regionName() + (isFacet ? '.facet' : '') + suffix)
    .data(dataFunc, (d,i) => (d.data && d.data.key) ? d.data.key : i);
  const regionName = this.regionName().split('.').join(' ').trim();
  const aggregated = this.aggregated();
  const regionClass = regionName + (isFacet ? ' facet' : '');
  const canvas = this.__execs__.canvas;
  const trans = d3.transition().duration(this.transition().duration).delay(this.transition().delay); 
  const _id = canvas.selectAll(className('canvas-g-clip-path', true)).attr('id');
  let _regionInit = function (selection) {
    selection.each(function(xy) {
      if (!aggregated) d3.select(this).attr('transform', 'translate(' + [xy.x, xy.y] + ')');
      else d3.select(this).attr('transform', 'translate(0,0)');
      if (_id && !isFacet) d3.select(this).attr('clip-path', 'url(#' + _id+')');
    });
  };
  let _region = function (selection) {
    selection.each(function(xy) {
      if (!aggregated) d3.select(this).transition(trans).attr('transform', 'translate(' + [xy.x, xy.y] + ')');
      else d3.select(this).attr('transform', 'translate(0,0)');
    });
  };
  
  region.exit().remove();
  let regionEnter = region.enter().append('g')
      .attr('class', regionClass)
      .each(posFunc)
      .call(_regionInit);
  region.each(posFunc);
  region = regionEnter.merge(region);
  region.call(_region);
  return region;
}

const defaultFont$2 = {
  'font-family': 'sans-serif',
  'font-size': 11,
  'font-weight': 'normal',
  'font-style': 'normal'
};
const gradientPrefix = 'legend-gradient-';
//const labelClipPath = 'legend-label-clip-path';
const orients$2 = ['top', 'bottom'];
const _attrs$5 = {
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
class Spectrum {
  constructor() {
    this.__attrs__ = JSON.parse(JSON.stringify(_attrs$5));
    this.__execs__ = {spectrum:null, scale:null};
  }
}

function _spectrum() {
  return new Spectrum();
}

function _style$1(selection) {
  let font = this.font();
  for (var k in font) {
    selection.style(k, (k === 'font-size' ? font[k] + 'px' : font[k]));
  }
}

function _gradientAlternative(selection, width, height, colorRange) {
  const chipNum = width;
  const chipW = width / chipNum;
  let fill = d3.scaleLinear().domain([0, width]).range(colorRange);
  let chips = d3.range(0, chipNum).map(function (i) {
    return i * chipW + chipW;
  });
  selection.selectAll(className('gradient-chip', true))
    .data(chips)
    .enter().append('rect')
    .attr('class', className('gradient-chip'))
    .attr('width', chipW)
    .attr('height', height)
    .attr('x', function (d) {
      return d - chipW;
    }).style('fill', d => fill(d));
}

function _render$1(selection) {
  this.__execs__.spectrum = selection.attr('transform', 'translate(' +[this.x(), this.y()] + ')');
  const scale = this.scale();
  const colorRange = scale.range();
  const gradientWidth = this.gradientWidth();
  const gradientHeight = this.gradientHeight();
  this.__execs__.scale = d3.scaleLinear().domain(scale.domain()).rangeRound([0, gradientWidth]);

  let area$$1 = selection.select(className('gradient-area', true));
  if (area$$1.empty()) {
    let gradientId = getUniqueId(gradientPrefix);
    let triangleSymbol = d3.symbol().type(d3.symbolTriangle).size(40);
    area$$1 = selection.append('g').attr('class', className('gradient-area'));
    area$$1.append('path').attr('class', className('arrow'))
      .attr('fill', '#777')
      .attr('d', triangleSymbol)
      .style('visibility', 'hidden');
    selection.append('defs').append('linearGradient')
      .attr('id', gradientId);
  }
  area$$1.attr('transform', 'translate(' + [(this.width() - gradientWidth) /2, 18] + ')');
  let gradient = selection.select('linearGradient');
  let stop = gradient.selectAll('stop')
    .data(colorRange);
  stop.enter().append('stop')
    .merge(stop).attr('offset', (d,i) => i*100 + '%')
    .attr('stop-color', d => d);
  if(safari()) {
    area$$1.call(_gradientAlternative, gradientWidth, gradientHeight, colorRange);
  } else {
    let rect = area$$1.selectAll(className('gradient-rect', true))
    .data([scale]);
    rect.enter().append('rect')
      .attr('class', className('gradient-rect'))
      .merge(rect)
      .attr('width', this.gradientWidth())
      .attr('height', this.gradientHeight())
      .attr('fill', 'url(#' +gradient.attr('id') + ')');
  }
  let label = area$$1.selectAll(className('label', true))
    .data(scale.domain());
  label.enter().append('text')
    .attr('class', className('label'))
    .merge(label)
    .attr('x', (d,i) => i * gradientWidth)
    .attr('y', gradientHeight)
    .attr('dy', '1.25em')
    .attr('text-anchor', 'middle')
    .style('fill', '#999')
    .text(d => labelFormat(d));
  let titleText = this.title() || this.field();
  titleText = titleText.localeCompare(countMeasure.field) === 0 ? countMeasureTitle : titleText;
  let title = area$$1.selectAll(className('title', true))
    .data([titleText]);
  title.exit().remove();
  title.enter().append('text')
    .merge(title)
    .attr('class', className('title'))
    .attr('x', gradientWidth + this.font()['font-size'])
    .attr('y', gradientHeight * 0.5)
    .attr('dy', '.35em')
    .attr('text-anchor', 'start')
    .text(d => d);
}

function hide() {
  this.__execs__.spectrum.select(className('arrow', true))
    .style('visibility', 'hidden');
  return this;
}

function labelHeight$1() {
  return this.font()['font-size'];
}

function labelPadding$1() {
  return this.labelHeight() /2;
}

function show(value) {
  let pos = this.__execs__.scale(value);
  this.__execs__.spectrum.select(className('arrow', true))
    .style('visibility', 'visible')
    .attr('transform', 'translate(' + pos + ',-5)rotate(180)');
  return this;
}


function update$1() {

}
function render$3(selection) {
  _style$1.call(this, selection);
  _render$1.call(this, selection);
}

Spectrum.prototype.hide =  hide;
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
  let legendToggle = this.legend();
  if (!legendToggle) return;
  
  let field = this.__execs__.field;
  let x,y,width, height;
  let offset =  this.offset();
  //FIXME: enable other directions
  if (legendToggle.orient === 'bottom') {
    x = 0;
    y = this.innerSize().height  + offset.bottom - this.margin().bottom - legendToggle.thickness;
    width = this.innerSize().width;
    height = legendToggle.thickness;
  }
  
  let colorScale = this.scale().color;
  let legendObj = _spectrum().scale(colorScale)
    .field(field.color.field())
    .x(x).y(y)
    .width(width).height(height);
  this.__execs__.canvas.selectAll(this.nodeName() + '.point')
    .on('mouseenter.spectrum', d => {
      legendObj.show(d.value);
    })
    .on('mouseleave.spectrum', () => legendObj.hide());
  this.__execs__.legend = legendObj;

  let canvas = this.__execs__.canvas;
  let spectrumSel = canvas.selectAll(className('spectrum', true))
    .data([legendObj]);
  spectrumSel.exit().remove();
  spectrumSel.enter().append('g')
    .attr('class', className('spectrum'))
    .merge(spectrumSel)
    .each(function(d) {
      d.render(d3.select(this));
    });
  return this;
}

const arrowWidth = 4;
const backgroundColor = '#001a32';
const whiteColor = '#fff';
const greyColor = '#7b92ae';
const IS_IE9 = typeof navigator === 'object' ? (/MSIE 9/i.test(navigator.userAgent)) : false;
const defaultFont$3 = {
  'font-family': 'sans-serif',
  'font-size': 11,
  'font-weight': 'normal',
  'font-style': 'normal'
};

const _attrs$6 = {
  absolute: false,
  anchor: {x:'left', y:'top'}, 
  color: null,
  dx: 0,
  dy: 0,
  font: defaultFont$3,
  offsetFunc: null,
  keys : null, //{name, value}
  keyFunc: null, // function(d) { return {name, value}}
  nodeName : className('mark node', true),
  target: null,
  valueFormat : null,
  valueFunc: null,
  values : [], //[{name, value}, ...]
  x: 0,
  y: 0,
  fromMulti: false,
  showDiff : false
};

class Tooltip {
  constructor() {
    this.__attrs__ = JSON.parse(JSON.stringify(_attrs$6));
    this.__execs__ = {tooltip:null, mark:null, init: true};
    this.valueFormat(labelFormat);
  }
}

function _tooltip () {
  return new Tooltip();
}

function _styleOpacity(selection, value = 1) {
  if (IS_IE9) return selection.style('filter', 'alpha(opacity=' + (value * 100) + ')');
  else return selection.style('opacity', value);
}

function _event() {
  const that = this;
  const target = this.target();
  const points = target.__execs__.canvas.selectAll(this.nodeName());
  points.on('mouseleave.tooltip', function() {
    if (that.fromMulti()) return;
    that.hide();
  }).on('mouseenter.tooltip', function(d) {
    showFromPoint.call(that, this, d);
  });
}

function _position() {
  const target = this.target();
  const points = target.__execs__.canvas.selectAll(this.nodeName());
  const root = (target.parent() ? target.parent() : target).__execs__.canvas.node();
  const absLocal = d3.local();
  const offsetFunc = this.offsetFunc();
  const absolute = this.absolute();
  let initX = 0; 
  let initY = 0;
  let offset = target.offset();
  initX += offset.left; initY += offset.top;
  if (target.parent()) { //add parent's offset
    offset = target.parent().offset();
    initX += offset.left; initY += offset.top;
  }
  //add frame and svg offset
  let svgRect = root.parentNode.getBoundingClientRect();    
  let frameRect = root.parentNode.parentNode.getBoundingClientRect();
  initX += svgRect.left - frameRect.left;
  initY += svgRect.top - frameRect.top; 
  initX += arrowWidth;
  
  let __pos = function (cur,pos) {
    if (cur.x) pos.x += cur.x;
    if (cur.y) pos.y += cur.y;
  };
  let __absPos = function(d) {
    let pos = {x:initX, y:initY};
    if (offsetFunc && typeof offsetFunc === 'function') {
      let offset = offsetFunc.apply(this, arguments);
      pos.x += offset.x; pos.y += offset.y;
    }
    let cur = d;
    if (absolute) {
      __pos(cur, pos);
    } else {
      while(cur) {
        __pos(cur, pos);
        cur = cur.parent;
      }
    }
    return pos;
  };
  points.each(function() {
    let pos = __absPos.apply(this, arguments);
    absLocal.set(this, pos);
  });
  this.__execs__.mark = absLocal;
}

function _render$2(selection) { //pre-render the tooltip 
  let tooltip = this.__execs__.tooltip; //selection.select('.tooltip'); //FIXME: can not generate tooltip area independently.
  if (selection.style('position') === 'static') selection.style('position', 'relative');
  if (!tooltip || tooltip.empty()) {
    tooltip = selection.append('div').attr('class', className('tooltip'))
      .style('color', whiteColor)
      .style('pointer-events', 'none')
      .style('background-color', backgroundColor)
      .style('padding', '9px')
      .style('border-radius', '8px')
      .style('position', 'absolute')
      .style('z-index', '999')
      .call(_styleOpacity, 0);
    
    tooltip.append('div')
      .attr('class', className('keys'))
      .style('padding-bottom', '1em')
      .style('letter-spacing', '0.1px')
      .call(_styleOpacity, 0.9);
    tooltip.append('table')
      .attr('class', className('values'))
      .style('border-collapse', 'collapse')
      .call(_styleOpacity, 0.72);
    tooltip.append('div')
      .attr('class', className('arrow'))
      .style('position', 'absolute')
      .style('top', 'calc(' + arrowWidth + 'px + 50%)')
      .style('left', '0%')
      .style('margin', -(arrowWidth*2) + 'px')
      .style('border-width', arrowWidth + 'px')
      .style('border-style', 'solid')
      .style('border-color', 'transparent ' + backgroundColor + ' transparent transparent')
      .text(' ');
  }
  for (let fontKey in this.font()) {
    tooltip.style(fontKey, this.font()[fontKey] + (fontKey === 'font-size' ? 'px' : ''));
  }
  this.__execs__.tooltip = tooltip;
  _position.call(this);
  _event.call(this);
}

function hide$1() {
  let tooltip = this.__execs__.tooltip;
  tooltip.transition().duration(180).call(_styleOpacity, 0);

}

function render$4(selection) {
  selection = d3.select(selection);
  _render$2.call(this, selection);
}

function showFromPoint(point, d) {
  if (this.fromMulti()) return;
  const color = this.color();
  const key = this.keyFunc();
  const value = this.valueFunc();
  let pos = this.__execs__.mark.get(point);
  this.x(pos.x).y(pos.y)
    .color(color ? color : d.color)
    .key(key ? key.call(this, d, d.key): null)
    .value(value.call(this, d, d.text))
    .show();
  return this;
}

function show$1() {
  let valueFormat = this.valueFormat();
  let tooltip = this.__execs__.tooltip;
  
  if(this.keys()) {
    let key = tooltip.select(className('keys', true)).selectAll(className('key', true))
    .data(this.keys());
    key.exit().remove();
    key = key.enter().append('div')
      .attr('class', className('key'))
      .merge(key);
    key.text(d => d.value);
  }
  let value = tooltip.select(className('values', true)).selectAll(className('value', true))
    .data(this.values());
  value.exit().remove();
  value = value.enter().append('tr')
    .attr('class', className('value'))
    .merge(value);
  if (this.showDiff() && value.size() > 1) {
    value.style('color', (_,i) => (i ===0 ? greyColor : whiteColor));
  } else {
    value.style('color', whiteColor);
  }
  
  let label = value.selectAll('td')
    .data(d => [d.name, d.value]);
  label.exit().remove();
  label = label.enter().append('td')
    .style('padding', 0)
    .style('margin', 0)
    .style('padding-bottom', '.35em')
    .style('padding-right', (_,i) => (i===0 ? '2em' : 0))
    .style('text-align', (_,i) => (i===0 ? 'left' : 'right'))
    .merge(label)
    .text((d,i) => {
      if (i === 0) {
        return d.localeCompare(countMeasure.field) === 0 ? countMeasureTitle : d;
      } else {
        return valueFormat(d);
      }
    });
  let tooltipH = tooltip.node().getBoundingClientRect().height/2;
  tooltip
    .style('left', (this.x() + this.dx()) + 'px')
    .style('top', this.y() + this.dy() - tooltipH + 'px')
  .transition().duration(180)
    .call(_styleOpacity, 1);
  
}

function key(_val) {
  if(!arguments.length || _val === null) return this;
  if('name' in _val && 'value' in _val) this.__attrs__.keys = [_val];
  return this;
}

function value(_val) {
  if(!arguments.length) return this;
  if(Array.isArray(_val)) {
    this.__attrs__.values = _val;
  } else if('name' in _val && 'value' in _val) {
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
function renderTooltip(setting = {}, fromMulti = false, absolute = false) {
  const tooltipObj = _tooltip().dx( (setting && setting.dx ? setting.dx : 0))
    .dy((setting && setting.dy ? setting.dy : 0))
    .target(this)
    .absolute(absolute)
    .fromMulti(fromMulti);
  const container = (this.parent() ? this.parent() : this).__execs__.canvas;
  if(setting.color) tooltipObj.color(setting.color);
  if (!fromMulti) {
    tooltipObj.keyFunc(setting.key)
      .valueFunc(setting.value)
      .offsetFunc(setting.offset)
      .showDiff(setting.showDiff);
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
function reset (keep=false) {
  this.__execs__.axis = {};
  this.__execs__.legend = null;
  if (!this.parent()) this.__execs__.mark = d3.local(); //when is facet, not reset
  this.__execs__.regions = null;
  this.__execs__.nodes = null;
  if (!keep) {
    this.__execs__.scale = {};
    this.__execs__.field = {};
  }
  if (!this.parent() && this.__execs__.canvas) d3.select(this.container()).selectAll(className('tooltip', true)).remove(); //reset, because .facet can generates multiple tooltips.
  return this;
}

function resetTooltip() {
  const parent = this.parent();
  d3.select((parent ? parent : this).__execs__.canvas.node().parentNode.parentNode)
    .selectAll(className('tooltip', true)).remove(); //remove existing tooltip
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
  if (Array.isArray(size)) { // only range [min, max]
    this.__attrs__.size = {range: size, reverse: false};
  } else if (typeof size === 'number') { // only number [num, num]
    this.__attrs__.size = {range: [size, size], reverse: false};
  } else if (typeof size === 'object') {
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
  if(!arguments.length) return this.__execs__.scale;
  return this.__execs__.scale[name];
}

/**
 * @memberOf Core#
 * @function
 * @private
 * @param {*} attrs 
 */
function setAttrs$1 (attrs) {
  setAttrs(this, attrs);
  return this;
}

function adjustDomain(scale, from, to) {
  let result = [];

  if (to[0] > from[0]) result[0] = from[0];
  else result[0] = to[0];

  if (to[1] < from [1]) result[1] = from[1];
  else result[1] = to[1];
  
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
function setCustomDomain(target, domain, fromScale = false) {
  let scale = fromScale ? target : this.__execs__.scale[target];
  let field = fromScale ? null : this.__execs__.field[target];
  scale._defaultDomain = domain;
  if (fromScale) {
    scale.domain(domain).nice();
  } else if (this.customDomain()) {
    adjustDomain(scale, domain, this.customDomain());
  } else if ((this.isMixed ? !this.isMixed() : true) && field.customDomain()) { //use field's customDomain
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
function showTooltip (...keys) {
  if (this.multiTooltip && this.multiTooltip()) return;
  let condition = d => {
    let cond = true;
    let target = d;
    keys.forEach(k => {
      cond = cond && target.data.key === k;
      if (target.parent) target = target.parent;
      else return cond;
    });
    return cond;
  };
  let nodes = this.filterNodes(condition); 
  let tooltip = this.__execs__.tooltip;
  if (nodes.size() > 0) { 
    nodes.each(function(d) {
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
  for (let fontKey in font) {
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
      tooltip = {sortByValue: 'natural'};
    } 
  } 
  if (typeof tooltip === 'object') {
    if (!tooltip.sortByValue) tooltip.sortByValue = 'natural';
  }
  this.__attrs__.tooltip = tooltip;
  return this;
}

function fillUndefined (range$$1, colors) {
  let lastColorIndex = 0;
  range$$1 = range$$1.map(c => {
    if (c === undefined) {
      while (lastColorIndex < colors.length) {
        let n = colors[lastColorIndex];
        lastColorIndex +=1;
        if (range$$1.findIndex( d => d == n) < 0) {
          return n;
        }
      }
    } 
    return c;
  });
  return range$$1.filter(c => c !== undefined);  
}
/**
 * @memberOf Core#
 * @function
 * @private
 * @param {*} domain 
 * @param {*} keepLast 
 */
function updateColorScale(domain, keepLast = true) { //FIXME: update without domain
  const lastScale = this.scale().color;
  if (this.colorDomain() && this.colorDomain().length > 0) {
    let order = this.colorDomain();
    let originColors = this.color();
    let newRange = domain.map(d => {
      let i = order.findIndex(o => d == o.key);
      if (i >= 0) {
        return order[i].color ? order[i].color : originColors[i];
      } else {
        return undefined;
      }
    });
    newRange = fillUndefined(newRange, originColors);
    let scale = d3.scaleOrdinal().domain(domain).range(newRange);
    scale._defaultRange = this.color();
    return scale;
  } else if (keepLast && lastScale && this.color() === lastScale._defaultRange) {
    let originColors = this.color();
    let lastDomain = this.scale().color.domain();
    let lastRange = this.scale().color.range();
    let exist = false;
    let lastIndex = domain.map(d => {
      const i = lastDomain.findIndex(l => l === d);
      if (!exist && i >= 0) exist = true;
      return i;
    });

    if (exist) {
      let newRange = lastIndex.map(i => {
        if (i >= 0 && i < lastRange.length) { 
          return lastRange[i];
        } else {
          return undefined;
        }
      });
      newRange = fillUndefined(newRange, originColors);
      return lastScale.domain(domain).range(newRange);
    }
  }
  let scale = d3.scaleOrdinal().domain(domain).range(this.color());
  scale._defaultRange = this.color();
  return scale;
}

const defaultFont = {
  'font-family': 'sans-serif',
  'font-size': 12,
  'font-weight': 'lighter',
  'font-style': 'normal'
};

const continousColorScheme = ['#ece7f2','#50C3F7'];
const categoryColorScheme = magicTableColorScheme;

const _attrs$3 = {
  autoResize: false,
  autoResizeSkip: ['munge', 'domain'],
  aggregated: false,
  color : categoryColorScheme,
  colorDomain: null,
  container: null,
  customDomain: null,
  data: [],
  dimensions: [],
  font: defaultFont,
  height: 480,
  keep: false,
  label: null,
  legend: null,
  limitKeys : 200,
  limitRows: 1000,
  name: null,
  nodeName: className('mark node', true),
  needCanvas: true,
  margin: {top: 40, right: 40, bottom: 40, left: 40},
  measures: [],
  muteIntensity: 0.3,
  parent : null,
  regionName: className('mark region', true),
  size: null,
  tooltip: true,
  transition: {duration: 600, delay: 20},
  width: 640,
  zeroOffset: false,
  zeroMargin: false
};

/** 
 * Core of jelly-chart 
 * @class Core
 * */
class Core {
  constructor() {
    this.setAttrs(_attrs$3);
    this.__execs__ = {
      autoResize: false,
      axis: {}, //axis settings
      condition: null, 
      canvas: null, 
      hidden: null,
      field: {}, // {x,y,color,raidus}
      legend:null, 
      mark: d3.local(),
      scale: {},
      tooltip: null,
      regions: null,
      nodes: null
    }; 
    this.on = undefined; 
    this.__execs__.selectDispatch = d3.dispatch('selectClick', 'selectEnter', 'selectLeave', 'legendEnter', 'legendLeave');
    this.rebindOnMethod(this.__execs__.selectDispatch);
  }
  
}

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
Core.prototype.aggregated = attrFunc('aggregated');
Core.prototype.autoResizeSkip = attrFunc('autoResizeSkip');
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
Core.prototype.keep = attrFunc('keep');
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
Core.prototype.needCanvas = attrFunc('needCanvas');

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
Core.prototype.autoResize = autoResize;
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
Core.prototype.process = process;
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
Core.prototype.resetTooltip = resetTooltip;
Core.prototype.size = size;
Core.prototype.setAttrs = setAttrs$1;
Core.prototype.setCustomDomain = setCustomDomain;
Core.prototype.showTooltip = showTooltip;
Core.prototype.updateColorScale = updateColorScale;

const offsetThickness = 14;
const verticalAxisThickness = 18; 
const horizontalAxisThickness = 18;
const tickFormatForOrdinal = labelFormat;
const targets = ['x', 'y'];
const orients$3 = ['top', 'right', 'bottom', 'left'];
const SIPrefixFormat = d3.format('.2s');
const commaFormat = d3.format(',');
const defaultFont$4 = {
  'font-family': 'sans-serif',
  'font-size': 10,
  'font-weight': 'normal',
  'font-style': 'normal',
  'letter-spacing': '0.1px'
};
const titleSize = 13;
const domainColor = '#c0ccda';
const titleColor = '#485465';
const gridColor = '#e7ebef';
const zerocolor = '#aaa';
const defaultTickRotate = 45;
const smallModeThreshold = 300;
const _attrs$7 = {
  autoTickFormat: true,
  autoRotate: true,
  color: '#7b92ae',
  field: null,
  facet : null,
  font: defaultFont$4,
  format: null,
  grid: false,
  gridSize : 0,
  interval: null,
  orient: orients$3[2],
  scale: null,
  showTitle: true,
  showDomain: true,
  showTicks: true,
  thickness: 40,
  target: targets[0],
  tickFormat: null,
  tickFormatSub: null,
  title: '',
  titleOrient: null,
  ticks: null,
  tickRotate: 0,
  tickSize: 0,
  tickPadding: 4,
  transition: null,
  x: 0,
  y: 0,
};

class Axis {
  constructor() {
    this.__attrs__ = JSON.parse(JSON.stringify(_attrs$7));
    this.__execs__ = {axis:null, canvas: null, rotated: false};
  }
}

function _axis() {
  return new Axis();
}

function isHorizontal$1() {
  return this.orient() === 'bottom' || this.orient() === 'top';
}

function _generator () {
  let orient = this.orient();
  let scale = this.scale();
  let axis;
  
  if (orient === orients$3[0]) axis = d3.axisTop();
  else if (orient === orients$3[1]) axis = d3.axisRight();
  else if (orient === orients$3[3]) axis = d3.axisLeft();
  else axis = d3.axisBottom();
  this.__execs__.axis = axis;

  if (scale) axis.scale(scale);
  if (this.transition()) {
    let trans = this.transition();
    this.__execs__.transition = d3.transition().duration(trans.duration).delay(trans.delay);
  }
}

function _grid (selection, zoomed) {
  if(this.grid() && this.gridSize() > 0) {
    let axis = this.__execs__.axis;
    let gridSize = this.gridSize();
    let isHorizontal = this.isHorizontal();
    let orient = this.orient();
    let target = (isHorizontal ? 'y2' : 'x2');
    let sign = (orient === 'left' || orient === 'top') ? 1 : -1;
    let scale = this.scale();
    let gridLine = selection.selectAll('.grid')
      .data(scale.ticks(axis._tickNumber).map(d => scale(d)));
    gridLine.exit().remove();
    let gridLineEnter = gridLine.enter().append('g')
      .attr('class', 'grid');
    gridLineEnter.append('line')
      .style('stroke', gridColor);
    gridLine = gridLineEnter.merge(gridLine);
    if(this.transition() && !zoomed) {
      gridLine = gridLine.transition(this.__execs__.transition);
    }
    gridLine.attr('transform', d => 'translate(' + (isHorizontal? [d+0.5, 0]: [0, d-0.5]) + ')')
      .select('line')
      .attr(target, sign * gridSize);
  } else {
    selection.selectAll('.grid').remove();
  }
}

function _overflow$1 (selection) {
  const scale = this.scale();
  const orient = this.orient();
  let tickStepSize = (() => {
    if (scale.bandwidth) {
      let bandwidth = scale.bandwidth();
      if (bandwidth === 0) return scale.step();
      return scale.bandwidth();
    } else {
      let ticks = scale.ticks();
      if (ticks.length > 1) {
        return Math.abs(scale(ticks[1]) - scale(ticks[0]));
      } else {
        return Math.abs(scale.range[scale.range().length-1] - scale.range()[0]);
      }
    }
  })();
  let _generateId = () => {
    let prefix = 'axis-' + this.target() + '-' + this.orient() + '-';
    return getUniqueId(prefix);
  };
  let _tooltip = () => {
    selection.selectAll('.tick')
      .each(function() {
        let sel = d3.select(this); 
        let t = sel.select('title');
        if (t.empty()) t = sel.insert('title', ':first-child');
        let text = sel.select('text').text();
        t.text(text);
      });
  };
  let _clipPath = () => {
    let defs = selection.select('defs');
    if (defs.empty()) {
      let _id = _generateId(); 
      defs = selection.append('defs');
      defs.append('clipPath')
        .attr('id', _id)
        .append('rect');
      selection.selectAll('.tick')
        .attr('clip-path', 'url(#' + _id +')');
    }
    const rectPos = {};
    let scaleDist = Math.abs(scale.range()[1] - scale.range()[0]);
    if (scaleDist === 0) scaleDist = scale.range()[0] * 2;
    if (this.isHorizontal()) {
      rectPos.width = scaleDist;
      rectPos.height = this.thickness() - (this.showTitle() ? this.font()['font-size'] * 1.71 : 0);
      rectPos.x = -rectPos.width/2;
      rectPos.y = orient === 'bottom' ? 0 : -rectPos.height;
    } else {
      rectPos.width = this.thickness() ;
      rectPos.height = scaleDist;
      rectPos.x = orient === 'left' ? -rectPos.width : 0;
      rectPos.y = -rectPos.height/2;
    }
    defs.select('clipPath').select('rect').datum(rectPos)
      .attr('x', d => d.x).attr('y', d => d.y)
      .attr('width', d => d.width).attr('height', d => d.height);
  };
  let _hidden = () => {
    let showTicks = this.showTicks();
    let isSmall = tickStepSize < this.font()['font-size'] * (this.isHorizontal() ? 1 : 0.72);
    selection.selectAll('.tick')
      .style('visibility', isSmall && scale.bandwidth ? 'hidden': (showTicks ? 'inherit' : 'hidden'));
  };
  let _rotate = () => {
    let tickPadding = this.tickPadding();
    let tickRotate = this.tickRotate();
    let isHorizontal = this.isHorizontal();
    let isPositive = this.orient() === 'right' || this.orient() === 'top';
    let _rotateFunc =  (_selection, _tickRotate = tickRotate) => {
      let padding;
      if(isHorizontal) padding = [0, tickPadding/2];
      else padding = [_selection.attr('x') * .71, 0];
      if (this.transition()) _selection = _selection.transition().duration(180);
      _selection
        .attr('transform', 'translate(' + padding+') rotate('+ (_tickRotate * -1)+')').attr('text-anchor', isHorizontal ? 'start': 'end')
        .attr('text-anchor', isPositive ? 'start' : 'end');
    };
    
    if (tickRotate !== 0) {
      selection.selectAll('.tick > text')
        .call(_rotateFunc);
      this.__execs__.rotate = true;
      return;
    } else if (this.autoRotate()) {
      let tick = selection.selectAll('.tick');
      let totalW = 0;
      tick.each(function() {
        let w = this.getBBox().width;
        if (d3.select(this).selectAll('text').classed(className('rotated'))) w *= 1.25;
        totalW += w;
      });
      let isOver = totalW >= Math.abs(scale.range()[1] - scale.range()[0]);
      if (isHorizontal) {
        if (isOver) {
          tick.selectAll('text')
            .classed(className('rotated'), true)
            .call(_rotateFunc, defaultTickRotate);
        } else {
          let rotated = tick.selectAll('text' + className('rotated', true))
            .classed(className('rotated'), false);
          if(this.transition()) rotated = rotated.transition().duration(180);
          rotated.attr('transform', null).attr('text-anchor', 'middle');
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

function _format() { //apply before rendering
  const axis = this.__execs__.axis;
  const tickFormat = this.tickFormat();
  const scale = this.scale();
  if (tickFormat) { 
    if (typeof tickFormat === 'function')  axis.tickFormat(function(d){
      if (typeof d === 'string' && isNaN(d)) return d;
      return tickFormat(d);
    });
    else if (scale.domain()[0] instanceof Date || scale._scaleType === 'time') axis.tickFormat(d3.timeFormat(tickFormat));
    else axis.tickFormat(d3.format(tickFormat));
  } else if (this.autoTickFormat()) {
    if (scale.invert && scale.domain()[0] instanceof Date) { return; }
    let domain = scale.domain();
    if (scale.invert && !scale.padding) { //apply auto-formatting
      axis.tickFormat(tickFormatForContinious(domain));
    } else {
      axis.tickFormat(d => labelFormat(d));
    }
  } 
}
function tickNumber(scale, dist) {
  let range$$1 = scale.range();
  dist = dist || Math.abs(range$$1[1]- range$$1[0]);
  let tNumber = scale.ticks().length;
  if (dist<= smallModeThreshold /2 ) {
    tNumber = 2;
  } else if (dist <= smallModeThreshold) {
    tNumber = 5;
  } else {
    tNumber = Math.round(tNumber / 2);
  }
  return tNumber;
}
function _preStyle(selection) { //TODO : tickSize and font-style
  let axis = this.__execs__.axis;
  let font = this.font();
  let scale = this.scale();
  axis.tickSize(this.tickSize())
    .tickPadding(this.tickPadding() + (this.isHorizontal() ? 4 : 2));
  if (this.ticks()) {
    axis.ticks(this.ticks());
    axis._tickNumber = this.ticks();
  } else if (scale.invert) { 
    if (scale._scaleType === 'time' || scale.domain()[0] instanceof Date) { //scale's type is time 
      let intervalType = interval[this.interval()];
      if (intervalType && !this.autoTickFormat() && this.tickFormat()) { //user interval
        axis.ticks(intervalType);
        axis._tickNumber = scale.ticks(intervalType).length;
      } else { //when has no interval use scale ticks length;
        let tickFormat = this.tickFormat();
        if (tickFormat) {
          axis._tickNumber = d3.set(scale.ticks().map(tickFormat)).values().length;
          axis.ticks(axis._tickNumber);
        } else {
          axis._tickNumber = scale.ticks().length;
        }
      }
    } else {
      let tNumber = tickNumber(scale);
      axis.ticks(tNumber);
      axis._tickNumber = tNumber;
    }
  } else {
    axis._tickNumber = scale.domain().length;
  }
  for (var k in font) {
    selection.style(k, (k === 'font-size' ? font[k] + 'px' : font[k]));
  }
}

function _render$3(selection, zoomed) {
  let axis = this.__execs__.axis;
  if (selection.selectAll('.domain').size() ===0) {
    selection.attr('transform', 'translate(' +[this.x(), this.y()] + ')');
  }
    
  if(this.transition() && !zoomed) {
    selection.transition(this.__execs__.transition).attr('transform', 'translate(' +[this.x(), this.y()] + ')')
      .call((selection) => {
        axis(selection);
      })
      .on('end', () => {
        _overflow$1.call(this, selection);
      });
  } else {
    selection.attr('transform', 'translate(' +[this.x(), this.y()] + ')')
      .call(axis);
    _overflow$1.call(this, selection);
  }
}

function _renderSubFormat(selection) {
  const scale = this.scale();
  if (this.showTicks() && this.tickFormatSub() && scale.invert) {
    const sf = this.tickFormatSub();
    const transition$$1 = this.__execs__.transition;
    const updateFunc = (selection) => selection.attr('x', d => scale(d[0]))
      .attr('y', this.thickness())
      .attr('dy', '-3em');

    const existing = [];
    const ticks = scale.ticks(scale._tickNumber);
    const tickFormats = ticks.map(scale.tickFormat(scale._tickNumber, sf))
      .map(d => {
        if (existing.indexOf(d) < 0 ) {
          existing.push(d);
          return d;
        } else {
          return '';
        }
      });
    const tickData = d3.zip(ticks, tickFormats).filter(d => d[1] !== '');
    let subTick = selection.selectAll('.tick-sub-text')
      .data(tickData, d => d[1]);
    subTick.exit().transition(transition$$1)
      .attr('opacity', 0)
      .remove();

    subTick = subTick.enter().append('text')
      .attr('class', 'tick-sub-text')
      .text(d => d[1])
      .attr('opacity', 0)
      .call(updateFunc)
      .merge(subTick);
    
    subTick.transition(transition$$1)
      .call(updateFunc)
      .attr('opacity', 1);
    
  } else {
    selection.selectAll('.tick-sub-text').remove();
  }
}
function _style$2(selection) {
  const tick = selection.selectAll('.tick');
  tick.select('line').style('stroke', this.color());
  tick.select('text').style('fill', this.color());
  selection.select('.domain').style('stroke', domainColor)
    .style('shape-rendering', 'crispEdges')
    .style('stroke-width', '1px')
    .style('visibility', this.showDomain() ? 'visible' : 'hidden'); //showDomain
  selection.selectAll('.tick-sub-text')
    .style('fill', this.color());
}

function _title(selection) {
  let that = this;
  let _textTransform = function(selection) {
    if (that.isHorizontal()) {
      selection.attr('dy', orient === 'bottom' ? '-1em' : '.71em');
    } else {
      if (titleOrient === 'bottom' || titleOrient === 'top') {
        selection
          .attr('dy', titleOrient === 'bottom' ? '2em' : '-1em');
      } 
    }
  };
  let _transform = function(selection) {
    if (that.isHorizontal()) {
      let padding = 0;
      selection.attr('transform', 'translate(' +[halfPos, orient === 'bottom' ? that.thickness() - padding : -that.thickness() + padding]+')');
    } else {
      if (titleOrient === 'bottom' || titleOrient === 'top') {
        selection.attr('transform', 'translate(' + [0, titleOrient === 'bottom' ? d3.max(scale.range()) : d3.min(scale.range())] +')');
      } else {
        selection.attr('transform', 'translate(' + [that.thickness() * (orient === 'left' ? -1: 1), halfPos] +') ' + (orient === 'left' ? 'rotate(90)' : 'rotate(-90)'));
      }
    }
  };
  let title =  this.title() || this.field();
  if (!title) return ;
  title = title.localeCompare(countMeasure.field) === 0 ? countMeasureTitle : title;
  if (!this.showTitle()){
    selection.selectAll('.title').remove();
    return;
  } 
  let orient = this.orient();
  let titleOrient = this.titleOrient() || orient;
  let scale = this.scale();
  let halfPos = (scale.range()[0] + scale.range()[1]) /2;
  
  let titleSel = selection.selectAll('.title')
    .data([title]);
  titleSel.exit().remove();
  let titleSelEnter = titleSel.enter().append('g')
    .attr('class', 'title')
    .call(_transform);
  titleSelEnter.append('text')
    .attr('text-anchor', 'middle')
    .style('font-size', titleSize + 'px')
    .style('fill', titleColor)
    .call(_textTransform);
    
  titleSel = titleSelEnter.merge(titleSel);
  titleSel.select('text')
    .text(title);
  if (this.transition()) {
    titleSel.transition(this.__execs__.transition)
      .call(_transform);
  }
}

function _zero (selection, zoomed) {
  let scale = this.scale();
  if (scale.invert && zeroPoint(scale.domain())) {
    let gridSize = this.gridSize();
    let isHorizontal = this.isHorizontal();
    let orient = this.orient();
    let target = (isHorizontal ? 'y2' : 'x2');
    let sign = (orient === 'left' || orient === 'top') ? 1 : -1;
    let scale = this.scale();
    let gridLineTransforms = [];
    selection.selectAll('.tick').filter(d => d === 0)
      .each(function(d) {
        gridLineTransforms.push(scale(d));
      });
    let gridLine = selection.selectAll('.zero.grid')
      .data(gridLineTransforms);
    gridLine.exit().remove();
    let gridLineEnter = gridLine.enter().append('g')
      .attr('class', 'grid zero');
    gridLineEnter.append('line')
      .style('stroke', zerocolor);
    gridLine = gridLineEnter.merge(gridLine);
    if(this.transition() && !zoomed) {
      gridLine = gridLine.transition(this.__execs__.transition);
    }
    gridLine.attr('transform', d => 'translate(' + (isHorizontal? [d+0.5, 0]: [0, d-0.5]) + ')')
      .select('line')
      .attr(target, sign * gridSize);
  }
}

function facet (orient) {
  if (!arguments.length) return this.__attrs__.facet;
  if (orients$3.includes(orient)) this.__attrs__.facet = {orient: orient};
  else this.__attrs__.facet = {orient: orients$3[0]};
  return this;
}

function update$2() {

}
function render$5(selection, zoomed = false) {
  if (selection) {
    this.__execs__.canvas = selection;
  } else if(this.__execs__.canvas) {
    selection = this.__execs__.canvas;
  } else {
    return ;
  }
  _generator.call(this);
  _format.call(this);
  _preStyle.call(this, selection);
  _render$3.call(this, selection, zoomed);
  _renderSubFormat.call(this, selection);
  _style$2.call(this, selection);
  _grid.call(this, selection, zoomed);
  _zero.call(this,selection, zoomed);
  _title.call(this, selection);
}
Axis.prototype.facet = facet;
Axis.prototype.render = render$5;
Axis.prototype.update = update$2;
Axis.prototype.isHorizontal = isHorizontal$1;

setMethodsFromAttrs(Axis, _attrs$7);

function setVal(axis) {
  let val = Object.assign({},axis);
  if (val.orient && val.orient === 'x') { //legacy : 기존에는 orient에 값 넘기는 경우 있었음
    val.target = val.orient;
    val.orient = 'bottom';
  } else if (val.orient && val.orient === 'y') {
    val.target = val.orient;
    val.orient = 'left';
  } 

  let isHorizontal = val.target === 'x';
  if (!('showDomain' in val)) val.showDomain = true;
  if (!('showTicks' in val)) val.showTicks = true;
  if (!('showTitle' in val)) val.showTitle = true;
  if (!('orient' in val)) val.orient = (isHorizontal ? 'bottom' : 'left'); // x축일 경우 기본 bottom;
  if (!('thickness' in val)) {
    val.thickness = (isHorizontal ? horizontalAxisThickness : verticalAxisThickness);
    val.thickness += val.tickPadding ? val.tickPadding : 0;
    val.thickness += val.showTitle ? offsetThickness * 2: 0;
    val.thickness += val.showTicks ? offsetThickness : 0;
    val.defaultThickness = val.thickness;
  }
  if (!('autoTickFormat' in val) && !('format' in val)) val.autoTickFormat = false;
  
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
function axis (axis, adding = true) { 
  //__attrs__.axis{target, orient, thickness} array includes axis settings
  //__execs__.axis object inclues axis orient
  let val;
  if (!arguments.length) return this.__attrs__.axis; //only used in facet charts
  if (Array.isArray(axis)) { //only used in facet charts
    this.__attrs__.axis = axis.map(setVal);
    axis.forEach(d=> this.__execs__.axis[d.target] = {});
    return this;
  } else if (typeof axis === 'string') {
    val = {target: axis};
    val = setVal(val);
  } else if (typeof axis === 'object') {
    val = Object.assign({},axis);
    val = setVal(val);
  }
  let findIndex = this.__attrs__.axis.findIndex(d => d.target === val.target && d.orient === val.orient); //find the axis that has the same target and orient
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

function _axisExec (target, field, axis) {
  if(!arguments.length) return this.__execs__.axis;
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
  let axisTitle = this.axisTitles().filter(
    d => d.target === axisSetting.target && (!d.field || d.field === axisSetting.field) && (!d.shape || d.shape === axisSetting.shape)
  );
  if (axisTitle.length > 0) axisTitle = axisTitle[0];
  else axisTitle = null;
  let curAxis = _axis();
  curAxis.scale(scale)
    .target(axisSetting.target)
    .field(axisSetting.field)
    .orient(axisSetting.orient)
    .tickFormatSub(axisSetting.tickFormatSub)
    .tickFormat(axisSetting.tickFormat)
    .title(axisTitle ? axisTitle.title : axisSetting.title)
    .titleOrient(axisSetting.titleOrient)
    .autoTickFormat(axisSetting.autoTickFormat)
    .transition(this.transition());
  if ( scale._field) {
    let field = scale._field;
    if (field.interval && field.interval()) curAxis.interval(field.interval());
    if (field.format && field.format() && !axisSetting.autoTickFormat) curAxis.tickFormat(field.format());
    else if (axisSetting.autoTickFormat) curAxis.tickFormat(null);
  }
  else curAxis.interval(null);
  ['tickPadding', 'thickness', 'showTitle', 'showDomain', 'showTicks'].forEach(k => _set(axisSetting, curAxis, k));
  _axisExec.call(this, axisSetting.target, axisSetting.field, curAxis);
  return curAxis;
}

/**
 * @memberOf RectLinear#
 * @private
 */
function axisX() {
  return this.axis().find(d => d.target === 'x');
}

/**
 * @memberOf RectLinear#
 * @private
 */
function axisY() {
  return this.axis().find(d => d.target === 'y');
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
  let target;
  if (typeof targetAndField === 'string') {
    let splited = targetAndField.split('.');
    target = {target: splited[0], field: splited.length >= 2 ? splited.slice(1).join('.'): null};
  } else if (typeof targetAndField === 'object') {
    target = targetAndField;
  } else {
    throw new Error(`.axisTitle: ${targetAndField} is not unavailable`);
  }
  
  let titles = this.axisTitles();
  let exist = -1;
  
  for (let i= 0; i < titles.length; i++) {
    let t = titles[i];
    if (t.field === target.field && t.target === target.target) {
      exist = i;
      break;
    }
  }
  if (title) {
    let result = Object.assign({}, target);
    result.title = title;
    if (exist >= 0) titles.splice(exist, 1, result);
    else titles.push(result);
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
  let canvas = this.__execs__.canvas;
  let axisObj = this.__execs__.axis;
  let _appendAxis = function(selection, axis, targetNum) {
    let cName = 'axis target-' + axis.target() + ' orient-' + axis.orient() + ' targetNum-' + targetNum; 
    let axisSel = selection.selectAll(className(cName, true)) 
      .data([targetNum]);
    axisSel.exit().remove();
    axisSel = axisSel.enter().insert('g', ':first-child')
      .attr('class', className(cName)) 
      .merge(axisSel)
      .classed(className('active'), true);
    axis.render(axisSel);
  };
  let axisG = canvas.selectAll(className('axis', true));
  axisG.classed(className('active'), false);
  for (let target in axisObj) {
    if (axisObj.hasOwnProperty(target)) {
      let targetNum = 0;
      for (let field in axisObj[target]) {
        if(axisObj[target].hasOwnProperty(field)) {
          let axis = axisObj[target][field];
          if (axis.facet()) {
            canvas.selectAll(this.regionName()).call(_appendAxis, axis, targetNum);
          } else {
            canvas.call(_appendAxis, axis, targetNum);
          }
        }
        targetNum +=1;
      }
      canvas.selectAll(className('axis target-' + target, true))
        .filter(function(d){
          return d >= targetNum;
        }).remove(); //remove > targetNum
    }
  }
  axisG.filter(function() {
    return !d3.select(this).classed(className('active'));
  }).remove();
  
  return this;
}

/**
 * @memberOf RectLinear#
 * @private
 */
function thickness(axisSetting, scale, isHorizontal = true, isOrdinal = true) {
  let hidden = this.__execs__.hidden;
  if (!(axisSetting && axisSetting.showTicks) || (axisSetting && axisSetting.autoTickFormat)) return;
  
  let font = axisSetting.font || defaultFont$4;
  let tickFormat = axisSetting.tickFormat || (isOrdinal ? tickFormatForOrdinal : (axisSetting.autoTickFormat && tickFormatForContinious(scale.domain())));
  let ticks = isOrdinal ? scale.domain() : scale.ticks();
  if (scale._field) {
    let field = scale._field;
    if(field.format() && !axisSetting.autoTickFormat) tickFormat = field.format();
    if(field.interval && field.interval()) ticks = scale.ticks(interval[scale._field.interval()]);
  }
  let max$$1 = -1;
  let isOver = false;
  let innerSize = this.innerSize();
  let step = isHorizontal ? (innerSize.width / ticks.length ) : 0;
  let tick = hidden.selectAll(className('tick', true))
      .data(tickFormat ? ticks.map(tickFormat) : ticks);
  tick = tick.enter().append('text')
      .attr('class', className('tick'))
      .merge(tick)
      .text(d => d);
  this.styleFont(tick, font);
  tick.each(function() {
    let w = this.getBBox().width;
    if (w > max$$1) max$$1 = w;
    if (w > step) isOver = true;
  });
  max$$1 = max$$1+ offsetThickness;
  
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

const _attrs$2 = {
  axis: [], 
  axisTitles: [],
  grid: false,
  noAxisOffset: false, //assume that no axis offset
};
/**
 * @class RectLinear
 * @augments Core
 */
class RectLinear extends Core {
  constructor() {
    super();
    this.setAttrs(_attrs$2);
  }
  /**
   * @override
   */
  offset() {  
    let offset = super.offset();
    offset = Object.assign({}, offset);
    let axisSetting = this.axis();
    if (!this.noAxisOffset()) {
      axisSetting.forEach(function(at) {
        offset[at.orient] += at.thickness;
      });
    }
    return offset;
  }
}

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
function axisFacet(useRegion = true) {
  const facet = this.facet();
  const field = this.__execs__.field;
  const xAt = this.axisX();
  const yAt = this.axisY();
  const scale = this.__execs__.scale;
  const innerSize = this.innerSize();
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

const orients$4 = ['vertical', 'horizontal'];
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
function facet$1(facet=false) {
  if (!arguments.length) return this.__attrs__.facet;
  if (!facet) this.__attrs__.facet = false;
  else if (orients$4.includes(facet)) this.__attrs__.facet = {orient: facet};
  else this.__attrs__.facet = {orient: orients$4[0]};
  return this;
}

const _attrs$1 = {
  facet: false
};
/**
 * adds Facet features to RectLinear
 * @class Facet
 * @augments RectLinear
 */
class Facet extends RectLinear {
  constructor() {
    super();
    this.setAttrs(_attrs$1);
  }
}
Facet.prototype.axisFacet = axisFacet;
Facet.prototype.facet = facet$1;

const _attrs$8 = {
  padding: 0,
  regionPadding: 0
};

const paddingMixin = Base => {
  /**
   * @mixin PaddingMixin
   */
  let PaddingMixin = class extends Base {
    constructor() {
      super();
      this.setAttrs(_attrs$8);
    }
  };
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
 * bar.sortByValue('ascending') //sort bars in ascending order.
 * @param {boolean|string} [sortByValue=false] (false|natural|ascending|descending)
 * @return {sortByValue|SortMixin}
 */
function sortByValue (sortByValue) {
  if (!arguments.length) return this.__attrs__.sortByValue;
  if (sortByValue && (typeof sortByValue !== 'string' || !orders.find(o => o === sortByValue))) {
    sortByValue = 'natural';
  }
  this.__attrs__.sortByValue = sortByValue;
  return this;
}

const orders = ['natural', 'ascending', 'descending'];
const _attrs$9 = {
  sortByValue: orders[0]
};

const sortMixin = Base => {
  /**
   * @mixin SortMixin
   */
  let SortMixin = class extends Base {
    constructor() {
      super();
      this.setAttrs(_attrs$9);
    }
  };
  SortMixin.prototype.sortByValue = sortByValue;
  return SortMixin;
};

const _attrs$10 = {
  stacked: false,
  normalized: false
};

const stackMixin = Base => {
  /**
   * @mixin StackMixin
   */
  let StackMixin = class extends Base {
    constructor() {
      super();
      this.setAttrs(_attrs$10);
    }
  };
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

function distDomain(scale) {
  return scale(scale.domain()[0]) - scale(scale._lastDomain[0]);
}

function limitViewInterval(scale, domain, isKeep=false) {
  const viewInterval = this.viewInterval();
  const intervalUnit = viewInterval ? viewInterval.unit : domain.length;
  const intervalMultiple = viewInterval ? viewInterval.multiple : 1;
  const intervalType = typeof intervalUnit;
  scale._defaultDomain = domain;
  if (isKeep) scale._lastDomain = scale.domain();
  if (scale.invert) {
    if (intervalType === 'string' && domain[0] instanceof Date) {
      if (isKeep) {
        domain = [
          interval[intervalUnit].offset(domain[domain.length-1], -1 * intervalMultiple), 
          domain[domain.length-1]
        ];
      } else {
        domain = [
          domain[0], 
          interval[intervalUnit].offset(domain[0], 1 * intervalMultiple)
        ];
      }
    } else if (intervalType === 'number') {
      if (isKeep) {
        domain = [domain[domain.length-1] - intervalUnit * intervalMultiple, domain[domain.length-1]];
      } else {
        domain = [domain[0], domain[0] + intervalUnit * intervalMultiple];
      }
    }
  } else {
    if (intervalType === 'number') {
      if (isKeep) {
        const dist = domain.length - intervalUnit* intervalMultiple;
        domain = domain.slice(dist, dist + intervalUnit * intervalMultiple);
      } else {
        domain =  domain.slice(0,intervalUnit * intervalMultiple);
      }
    }
  }
  return domain;
}

/**
 * If stream is an object or an array of objects, appends the stream to existing data. If stream is specified, during re-rendering, it will keeps the domain interval limited by {@link StreamMixin#viewInterval viewInterval}. When re-renders chart, should use .render(true).
 * If stream is not specified, returns the existing stream.
 * @memberOf StreamMixin#
 * @function
 * @example
 * stream.stream({category:'A', sales: 100})
 *  .render(true);
 * 
 * stream.stream([
 *  {category: 'D', sales: 100}, 
 *  {category: 'E', sales: 200}
 * ]).render(true);
 * @param {object|Object[]} [stream=null] 
 * @return {zoom|ZoomMixin}
 */
function stream(stream) {
  if (!arguments.length) return this.__execs__.stream;
  if (stream) {
    if (!Array.isArray(stream)) stream = [stream];
    this.data(this.data().concat(stream));
  }
  this.__execs__.stream = stream;
  return this;
}

function getDistPerPixel(scale) {
  const to =  + scale.invert(scale.range()[0] + 1);
  const from =  + scale.invert(scale.range()[0]);
  return to - from;
}

function streamPanning(scale, renderFunc){
  let streamPanning = this.__execs__.streamPanning;
  if (!streamPanning) {
    streamPanning = d3.drag();
    const field = this.__execs__.field;
    const axisObj = this.__execs__.axis;
    const axisX = axisObj && axisObj.x ? axisObj.x[field.x.field()] : null;
    const canvas = this.__execs__.canvas;
    const markProcCall = this.process().find(p => p.type === 'mark').call;
    const tooltipProcCall = this.process().find(p => p.type === 'tooltip').call;
    const isContinous = 'invert' in scale;
    const renderFuncDefault = (domain, duration = 0) => {
      scale._lastDomain = domain;
      scale.domain(domain);
      const transition$$1 = this.transition();
      this.transition({duration: duration, delay: 0});
      if (renderFunc) renderFunc();
      markProcCall.call(this);
      this.resetTooltip();
      tooltipProcCall.call(this);
      axisX.render(null, true);
      this.transition(transition$$1);
    };
    this.__execs__.streamPanning = streamPanning;
    if (isContinous) {
      const isTime = scale.domain()[0] instanceof Date;
      streamPanning.on('drag.streamPanning', function() {
        const curDomain = scale.domain();
        const distPerPixel = getDistPerPixel(scale);
        const defaultDomain = scale._defaultDomain;
        const dx = d3.event.dx * -1;
        const dist = distPerPixel * dx;
        const updateCondition = (dx > 0 && +curDomain[curDomain.length-1] + dist <= +defaultDomain[defaultDomain.length-1]) ||  (dx < 0 && +curDomain[0] + dist >= +defaultDomain[0]);
        if (updateCondition) {
          renderFuncDefault(curDomain.map(d => isTime? new Date(+d + dist): d + dist));
        }
      });
    } else {
      let accumDx = 0;
      streamPanning.on('start.streamPanning end.streamPanning', function() {
        accumDx = 0;
      }).on('drag.streamPanning', function() {
        const step = scale.step();
        accumDx += d3.event.dx;
        const absAccumDx = Math.abs(accumDx);
        if (absAccumDx >= scale.step()) {
          const curDomain = scale.domain();
          const defaultDomain = scale._defaultDomain;
          const initIndex = defaultDomain.findIndex(d => d === curDomain[0]);
          let dist = Math.floor(absAccumDx / step);
          dist *= (accumDx > 0 ? -1 : 1);
          const updateCondition = (dist > 0 && initIndex + curDomain.length + dist < defaultDomain.length) || (dist < 0 && initIndex + dist >= 0);
          if (updateCondition) {
            renderFuncDefault(defaultDomain.slice(initIndex + dist, initIndex + curDomain.length + dist), 400);
          }
          accumDx = 0;
        } 
      });
    }
    
    canvas.call(streamPanning);
  }
  return this;
}

function tempPosForOrdinalScale(key, scale) {
  const initIndex = scale._defaultDomain.findIndex(x => x === scale.domain()[0]);
  const curIndex = scale._defaultDomain.findIndex(x => x === key);
  let dist = curIndex - initIndex;
  if (dist >= 0) {
    dist = dist - scale.domain().length;
    return scale.range()[1] + dist * scale.step();
  } else {
    return scale.range()[0] + dist * scale.step();
  }
}

/**
 * If unit is number or string, limit the key domain's length or distance within the interval. If the key domain's scale is ordnial, the length of domain will be the same to unit. Also, if the scale is continous, the distance of domain will be fixed as much as unit. If unit is string, it must be a time interval. When multiple exists, it will multiply the unit.
 * If unit is not specified, returns the existing viewInterval. 
 * @memberOf StreamMixin#
 * @function
 * @example
 * stream.viewInterval(1000)
 * stream.viewInterval('month', 3)
 * @param {number|string} [unit=null] 
 * @param {number} [multiple=1]
 * @return {zoom|ZoomMixin}
 */
function viewInterval(unit, multiple=1) {  
  if (!arguments.length) return this.__execs__.viewInterval;
  const type = typeof unit;
  if (type === 'number') {
    if (viewInterval <= 0) unit = null;
  } else if (type === 'string') { //d3-time interval
    if (!Object.keys(interval).includes(unit)) {
      unit = null;
    }
  }
  if (unit) this.__execs__.viewInterval = {unit, multiple};
  else this.__execs__.viewInterval = null;
  return this;
}

const _attrs$11 = {
  viewInterval : null,
  stream: null
};

const streamMixin = Base => {
  /**
   * @mixin StreamMixin
   */
  let StreamMixin = class extends Base {
    constructor() {
      super();
      this.setAttrs(_attrs$11);
      this.__execs__.viewInterval = null;
      this.__execs__.stream = null;
      this.__execs__.streamPanning = null;
      this.__execs__.streamPanningDispatch = d3.dispatch('streamPanning');
      this.rebindOnMethod(this.__execs__.streamPanningDispatch);
    }
  };
  StreamMixin.prototype.distDomain = distDomain;
  StreamMixin.prototype.limitViewInterval = limitViewInterval;
  StreamMixin.prototype.stream = stream;
  StreamMixin.prototype.streamPanning = streamPanning;
  StreamMixin.prototype.tempPosForOrdinalScale = tempPosForOrdinalScale;
  StreamMixin.prototype.viewInterval = viewInterval;

  return StreamMixin;
};

function translate(selection, innerSize, isVertical = true, isInit = false) {
  selection.attr('transform', d => {
    if (isVertical) {
      if (isInit) return 'translate(' + [innerSize.width, innerSize.height]+ ')';
      return 'translate(' + [innerSize.width, d.y-0.5]+')';
    } else {
      if (isInit) return 'translate(' + [0, 0]+ ')';
      return 'translate(' + [d.w + 0.5, 0]+')';
    }
  });
}
function line$1(selection, innerSize, isVertical = true) {
  if (isVertical) {
    selection.attr('x1', -innerSize.width);
  } else {
    selection.attr('y2', innerSize.height);
  }
}

function _annotation() {
  if (!this.annotation() || this.isFacet() || this.stacked()) return;
  const annotation = this.annotation();
  const that = this;
  const canvas = this.__execs__.canvas;
  const trans = d3.transition().duration(this.transition().duration).delay(this.transition().delay);
  const innerSize = this.innerSize();
  const isVertical = this.isVertical();
  const isShowDiff = this.showDiff() && !this.isNested();

  if (canvas.select('.annotation-g').empty()) canvas.append('g').attr('class', 'annotation-g');
  let g = canvas.select('.annotation-g');
  let anno = g.selectAll('.annotation')
    .data(this.nodes().data());
  anno.exit().remove();
  let annoEnter = anno.enter().append('g')
    .attr('class', 'annotation')
    .call(translate, innerSize, isVertical, true)
    .style('pointer-events', 'none');
  annoEnter.append('text')
    .style('fill', annotation.color);
  annoEnter.append('line')
    .style('stroke', annotation.color)
    .style('shape-rendering', 'crispEdges')
    .call(line$1, innerSize, isVertical);
  anno = annoEnter.merge(anno)
    .transition(trans)
    .call(translate, innerSize, isVertical);
  if (isShowDiff) {
    anno.style('visibility', function(d,i, arr) {
      if (d.diff) {
        if (d.diff.value < 0) return 'visible';
        else if (i < anno.size()-1 && d3.select(arr[i+1]).datum().diff.value > 0) return 'visible'; //when not last one, but next one is  diff > 0
        if (d.neighbor.diff.value > 0) return 'visible';
      }
      return 'hidden';
    });
  }
    
  anno.select('text')
    .text(d => d.key)
    .style('visibility', annotation.showLabel ? 'visible' : 'hidden')
    .style('fill', annotation.color)
    .each(function() {
      that.styleFont(this);
    });
  anno.select('line')
    .transition(trans)
    .style('stroke', annotation.color)
    .call(line$1, innerSize, isVertical);
    
}

function _axis$1() {
  let that = this;
  let scale = this.__execs__.scale;
  let nested = this.isNested();
  let grid = this.grid();
  let innerSize = this.innerSize();
  let fieldObj = this.__execs__.field;
  let isVertical = this.isVertical();

  let _axisScaleX = function (axisToggle) {
    let targetField = nested ? fieldObj.region : (isVertical ? fieldObj.x : fieldObj.y);
    let targetScale = nested ? scale.region : (isVertical ? scale.x : scale.y);
    targetField.axis(axisToggle);
    let curAxis = that.axisDefault(targetScale, axisToggle);
    if (axisToggle.orient === 'bottom') {
      curAxis.y(isVertical? scale.y.range()[0] : scale.x.range()[1]);
    }
    return curAxis;
  };

  let _axisScaleY = function (axisToggle) {
    let targetField = isVertical ? fieldObj.y : fieldObj.x;
    let targetScale = isVertical ? scale.y : scale.x;
    targetField.axis(axisToggle);
    let curAxis = that.axisDefault(targetScale, axisToggle);
    curAxis.grid(grid).gridSize(axisToggle.orient === 'bottom' || axisToggle.orient === 'top' ? innerSize.height : innerSize.width);
    if (axisToggle.orient === 'right') curAxis.x( (nested ? scale.region : scale.x).range()[1]);
    return curAxis;
  };

  let xAt = this.axisX();
  let yAt = this.axisY();
  if (this.isFacet()) {
    this.axisFacet(false);
  } else {
    if (xAt) _axisScaleX(xAt);
    if (yAt) _axisScaleY(yAt);
  }

  this.renderAxis();
}

function _domain() { //set scales and domains
  const keep = this.keep();
  const scale = this.scale();
  const munged = this.__execs__.munged;
  const nested = this.isNested();
  const stacked = this.stacked();
  const aggregated = this.aggregated();
  const field = this.__execs__.field;
  const isNestedAndSortByValue = this.isNestedAndSortByValue();
  const viewInterval = this.viewInterval();
  let yDomain, xDomain;
  let regionDomain;
  if (!(keep && scale.x && scale.y)) {
    scale.x = d3.scaleBand().padding(this.padding());
    scale.y = d3.scaleLinear();
  }
  
  if (nested) {
    regionDomain = field.region.level(0).munged(munged).domain();
    scale.region = d3.scaleBand().domain(regionDomain).padding(this.regionPadding());
  }
  if (this.isFacet()) {
    scale.color = this.updateColorScale(regionDomain, keep);
    return this;
  } 
  
  const level = 1;
  xDomain = field.x.level(level)
    .munged(munged)
    .domain(!isNestedAndSortByValue && this.sortByValue());
  
  if (nested || (!nested && (this.mono() === false || stacked))) { //nested
    scale.color = this.updateColorScale(xDomain, keep); //FIXME: need to update current colors
  }
  yDomain = domainY(field.y, munged, level, nested, aggregated, stacked, this.showDiff());
  
  if (isNestedAndSortByValue) {
    xDomain = field.x.domain(this.sortByValue(), null, isNestedAndSortByValue);
    munged.forEach(d => d.domain = xDomain.find(x => x.key === d.data.key).values);
  } else if (stacked) {
    if (!nested) {
      scale.x.domain([field.x.field()]);
    } 
  } else { //not stacked
    if (!keep && viewInterval) {
      xDomain = this.limitViewInterval(scale.x, xDomain);
    } else if (keep && this.stream()) { // if uses stream  and keeps the existing scale;
      xDomain = this.limitViewInterval(scale.x, xDomain, true);
    }
    scale.x.domain(xDomain);
  }
  this.setCustomDomain('y', yDomain);
  return this;
}

function _facet () {
  let parent = this;
  let scale = this.__execs__.scale;
  let facet = this.facet();
  let canvas = this.__execs__.canvas;
  let mono = this.mono();
  let innerSize = this.innerSize();
  let dimensions = [this.dimensions()[0]];
  let measures = this.isMixed() ? [mixedMeasure] : this.measures();
  let width, height;
  let settings = ['axisTitles','normalized', 'padding', 'orient', 'font', 'label', 'grid', 'tooltip']
    .map(d => { return {key: d, value:this[d]()};});
  let hasX = this.axisX();
  let hasY = this.axisY();
  let _smallbar = function(d) {
    let smallBar = bar()
        .container(this)
        .data(d)
        .dimensions(dimensions).measures(measures)
        .width(width).height(height)
        .legend(false)
        .zeroMargin(true) //remove margin
        .aggregated(true) 
        .parent(parent); 
    settings.forEach(d => {smallBar[d.key](d.value);});

    if (!mono) smallBar.color(scale.color(d.data.key));
    if (facet.orient === 'vertical') {
      if (hasX) smallBar.axis({target:'x', orient:'bottom'});//, showTitle: i === arr.length-1});
      if (hasY) smallBar.axis({target:'y', orient:'left'});
    } else {
      if (hasX) smallBar.axis({target:'x', orient:'bottom'});
      if (hasY) smallBar.axis({target:'y', orient:'left'});//showTitle: i === 0});
    }
    smallBar.render();
  };
  if (facet.orient === 'horizontal') {
    width =  scale.region.bandwidth();
    height = innerSize.height;
  } else {
    width = innerSize.width;
    height = scale.region.bandwidth();
  }

  canvas.selectAll(this.regionName() + '.facet')
    .each(_smallbar);
}

function _legend$1() { 
  let field = this.__execs__.field;
  if (this.mono() && (!field.region || this.isFacet())) { //mono + dimensions  => no legend
    return; 
  }
  this.renderLegend('x');
}

function _mark() {
  const that = this;
  const canvas = this.__execs__.canvas;
  const nested = this.isNested.call(this);
  const scale = this.__execs__.scale;
  const stacked = this.stacked();
  const vertical = this.isVertical();
  const color = this.color();
  const trans = d3.transition().duration(this.transition().duration).delay(this.transition().delay);
  const yField = this.measureName();
  const hasZeroPoint = zeroPoint(scale.y.domain());
  const label = this.label();
  const field = this.__execs__.field;
  const diffColor = this.showDiff();
  const isShowDiff = !nested && diffColor;
  const isNestedAndSortByValue = this.isNestedAndSortByValue();
  
  let __local = function (selection, monoColor = false, stream = false) {
    let _fill = d => {
      if(monoColor) return color[0];
      else return scale.color(d.data.key);
    };
    let tFormat = (key) => {
      let f = field.x.interval() && field.x.format() ? d3.timeFormat(field.x.format()) : null; 
      return f ? f(key) : key;
    };
    
    selection.each(function(d) { //local에 저장
      let x,y,w,h;
      let yValue = d.value;//d.data.value[yField];
      let upward = yValue >=0;
      if (stacked) {
        x = 0;
        y = (vertical ? upward: !upward) ? scale.y(d.data.value[yField + '-end']) : scale.y(d.data.value[yField + '-start']);
        w = nested ? scale.region.bandwidth() : scale.x.width;
        h = Math.abs(scale.y(d.data.value[yField + '-start']  ) - scale.y(d.data.value[yField + '-end']));
      } else {
        if (isNestedAndSortByValue) {
          scale.x.domain(d.parent.domain);
        }
        x =  scale.x(d.data.key);
        if (isNaN(x) && scale.x._defaultDomain) {
          x = that.tempPosForOrdinalScale(d.data.key, scale.x);
        } 
        if (stream) {
          d.x0 = that.tempPosForOrdinalScale(d.data.key, scale.x);
        }
        y =  (vertical ? upward: !upward) ? scale.y(yValue) : (hasZeroPoint ? scale.y(0) : scale.y.range()[0]);
        w = scale.x.bandwidth();
        h = Math.abs((hasZeroPoint ?  scale.y(0): scale.y.range()[0]) - scale.y(yValue));
      }
      let result = vertical ? {x,y : y + (upward ? 0 : 0.5),w,h,upward} : {x:y + (upward ? 0.5 : 0), y:x, w:h, h: w,upward};
      result.key = tFormat(d.data.key);
      result.color = _fill(d);
      result.text = labelFormat(yValue);
      //result.value = yValue;
      for (let k in result) {
        if (result.hasOwnProperty(k)) d[k] = result[k];
      }
    });
  };
  let __barInit = function(selection, vertical=true) {
    selection.each(function(d) {
      let selection = d3.select(this);
      selection.style('cursor', 'pointer')
        .style('fill', function(d) {
          if (d3.select(this).classed(className('diff'))) return 'none';
          else return d.color;
        }); 
      if(vertical) { 
        selection.attr('x', d.x0 || d.x)
          .attr('y', d.upward ? d.y + d.h : d.y)
          .attr('width', d.w )
          .attr('height', 0);
      } else {
        selection.attr('x', d.upward ? d.x : d.x + d.w)
          .attr('y', d.x0 || d.y)
          .attr('width', 0)
          .attr('height', d.h);
      }
    });
  };
  let __labelInit = function (selection, vertical=true) {
    selection.each(function(d) {
      let selection = d3.select(this);
      selection.style('pointer-events', 'none').text(d.text);
      if (vertical) {
        selection.attr('x', (d.x0 || d.x) + d.w/2).style('text-anchor', 'middle');
        if (stacked) selection.attr('y', d.y + d.h).attr('dy', '1em');
        else if(d.upward) selection.attr('y', d.y + d.h).attr('dy', '-.25em');
        else selection.attr('y', d.y).attr('dy', '1em');
      } else {
        selection.attr('y', (d.x0 || d.y) + d.h/2).attr('dy', '.35em');
        if (stacked) selection.attr('x', d.x + d.w/2).attr('text-anchor', 'middle');
        else if(d.upward) selection.attr('x', d.x).attr('dx', '.5em');
        else selection.attr('x', d.x + d.w).attr('text-anchor', 'end').attr('dx', '-.1em');
      }
      that.styleFont(selection);
    });
  };
  let __bar = function(selection) {
    selection.transition(trans).attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.w)
      .attr('height',d => d.h) 
      .style('fill', function(d) {
        if (d3.select(this).classed(className('diff'))) return 'none'
        else return d.color;
      }); 
  };
  let __label = function(selection, vertical=true) {
    selection.each(function(d) {
      let selection = d3.select(this);
      if (vertical) {
        selection.transition(trans).attr('y', d.upward ? d.y : d.y + d.h);
      } else {
        if (stacked) selection.transition(trans).attr('x', d.x + d.w/2).attr('text-anchor', 'middle');        
        else selection.transition(trans).attr('x', d.upward ? d.x + d.w : d.x);
      }
      selection.text(d.text)
        .style('fill', stacked ? '#fff' : d.color)
        .style('visibility', label && (!diffColor || (diffColor && selection.classed(className('diff')))) ? 'visible' : 'hidden');
    });
  };
 
  let bar;
  let region = canvas.selectAll(this.regionName());
  bar = region
    .selectAll(this.nodeName()) 
    .data(d => {
      let target = d.children;
      return stacked ? target.slice().reverse() : target;
    }, d => d.data.key);
  bar.exit().remove();
  let barEnter = bar.enter().append('g')
    .attr('class', this.nodeName(true))
    .call(__local, nested ? false : this.mono(), this.stream()); 
  barEnter.append('rect')
    .attr('class', className('bar'))
    .call(__barInit, vertical); 
  barEnter.append('text')
    .attr('class', className('bar'))
    .call(__labelInit, vertical);
  if (nested && stacked) {
    barEnter.append('path')
      .style('fill', d => d.color)
      .style('visibility', 'hidden')
      .attr('opacity', '0.5');
  }
  bar.call(__local, nested ? false : this.mono());    
  bar = barEnter.merge(bar);
  bar.select('rect' + className('bar', true)).call(__bar, vertical);
  bar.select('text' + className('bar', true)).call(__label, vertical);

  if (isShowDiff) { 
    let last;
    let strokeWidth = 1;
    let halfStrokeWidth = strokeWidth /2;
    barEnter.append('rect')
      .attr('class', className('diff'))
      .attr('stroke-dasharray', '5, 3')
      .attr('stroke-width', strokeWidth);
    barEnter.append('text')
      .attr('class', className('diff'));
    bar.each(function(d,i,arr) {
      if (i > 0) {
        d.neighbor = last;
        let diff = {value: d.value - last.value, upward: d.upward};
        if (vertical) {
          diff.x = d.x; diff.w = d.w; 
          if (diff.value > 0) {
            diff.y = d.y;
            diff.h = last.y - d.y;
          } else {
            diff.y = last.y;
            diff.h = d.y - last.y;
          }
        } else {
          diff.y = d.y; diff.h = d.h;
          if (diff.value > 0) {
            diff.x = last.w;
            diff.w = d.w - last.w;
          } else {
            diff.x = d.w;
            diff.w = last.w - d.w;
          }
        }
        diff.x += halfStrokeWidth; diff.y += halfStrokeWidth;
        diff.h -= strokeWidth; diff.w -= strokeWidth;
        diff.w = Math.max(strokeWidth*2, diff.w);
        diff.h = Math.max(strokeWidth*2, diff.h);
        diff.text = labelFormat(diff.value, true);
        d3.select(this).select('text' + className('bar', true))
          .each(function(d) {
            let selection = d3.select(this).transition(trans);
            if (diff.value < 0) {
              if (vertical) {
                selection.attr('y', (d.upward ? d.y : d.y + d.h) - diff.h);
              } else {
                selection.attr('x', (d.upward ? d.x + d.w : d.x) + diff.w);
              }
            }  
          });
        d3.select(this).select('rect' +  className('bar', true))
          .transition(trans)
          .style('fill', d => d.color = diffColor[(diff.value > 0 ? 'inc': 'dec') + 'Fill']);
        d3.select(this).select('rect'+ className('diff', true))
          .datum(diff)
          .attr('x', vertical? diff.x+halfStrokeWidth : 0)
          .attr('y', vertical? (d.upward ? d.y + d.h : d.y): diff.y + halfStrokeWidth)
          .attr('width', vertical? d.w - strokeWidth : 0)
          .attr('height', vertical? 0 : d.h -strokeWidth)
          .call(__bar)
          .style('stroke', diffColor[(diff.value > 0 ? 'inc': 'dec') + 'Stroke']);
        d3.select(this).select('text' +  className('diff', true))
          .datum(diff)
          .call(__labelInit, vertical)
          .call(__label, vertical)
          .style('fill', diffColor[(diff.value > 0 ? 'inc': 'dec') + 'Fill']);
        d.diff = diff;
      } else {
        d.neighbor = d3.select(arr[i+1]).datum();
        d3.select(this).select('rect' + className('bar', true))
          .transition(trans).style(diffColor.neuFill);
        d3.select(this).select('rect' + className('diff', true)).remove();
      }
      last = d;
    });
  }

  if (nested && stacked) { //show diff of stacked
    let pathLocal = d3.local();
    region.each(function(r,i,arr) {
      let neighbor = d3.select(i < arr.length-1 ? arr[i+1] : arr[i-1]).datum();
      let nds = neighbor.children;
      d3.select(this).selectAll(that.nodeName())
        .each(function(d) {
          let nd = nds.find(nd => nd.data.key === d.data.key);
          d.neighbor = nd; //save neighbor data
        });
    });
    region.filter((d,i,arr) =>  i < arr.length-1)
      .selectAll(that.nodeName()).select('path')
      .style('fill', d => d.color)
      .each(function(d) {
        d.diff = {value: d.neighbor.value - d.value};
        let parent = d.parent;
        let neighbor = d.neighbor;
        let neighborParent = neighbor.parent;
        let points = [];
        if (vertical) { //push in clockwise order
          points.push([d.x + d.w , d.y]);
          points.push([neighborParent.x + neighbor.x - parent.x, neighborParent.y - parent.y + neighbor.y]);
          points.push([points[1][0], points[1][1] + neighbor.h]);
          points.push([points[0][0], points[0][1] + d.h]);
        } else { 
          points.push([d.x, d.y + d.h]);
          points.push([points[0][0] + d.w, points[0][1]]);
          points.push([neighborParent.x + neighbor.x + neighbor.w - parent.x , points[0][1] + neighborParent.y + neighbor.y - parent.y - d.y - d.h]);
          points.push([points[2][0] - neighbor.w, points[2][1]]);
        }
        let source = (vertical ? [points[0], points[3]] : [points[0], points[1]]);
        source =  'M' + source[0] + 'L' + (vertical? source[0] : source[1]) + 'L' + source[1] + 'L' + (vertical? source[1] : source[0])  + 'z';
        let target = points.map((point,i) => (i === 0 ? 'M' : 'L') + point).join('') + 'z';
        pathLocal.set(this, {source, target});  
      });
  
    bar.on('mouseenter.stacked',function(d) {
      bar.filter(t => t.data.key !== d.data.key)
        .selectAll('rect' + className('bar', true))
        .transition()
        .style('fill', '#b2c0d1');
      let neighbor = region.selectAll(that.nodeName()).filter(t => t.data.key === d.data.key);
      if (!label) {
        d3.select(this).select('text' + className('bar', true)).style('visibility', 'visible');
        neighbor.select('text' + className('bar', true)).style('visibility', 'visible');
      }
      neighbor.select('path').style('visibility', 'visible')
        .attr('d', function() { 
          let path = pathLocal.get(this);
          if (path) return path.source;
        })
        .interrupt()
        .transition(trans)
        .attr('d', function() { 
          let path = pathLocal.get(this);
          if (path) return path.target;
        });
    }).on('mouseleave.stacked',function(d) {
      bar.filter(t => t.data.key !== d.data.key)
        .selectAll('rect' + className('bar', true))
        .transition()
        .style('fill', d => d.color);
      let neighbor = region.selectAll(that.nodeName()).filter(t => t.data.key === d.data.key);
      if (!label) {
        d3.select(this).select('text' + className('bar', true)).style('visibility', 'hidden');
        neighbor.select('text' + className('bar', true)).style('visibility', 'hidden');        
      }
      neighbor.select('path')
        .interrupt()
        .transition(trans)
        .attr('d', function() { 
          let path = pathLocal.get(this);
          if (path) return path.source;
        }).on('end', function(){
          d3.select(this).style('visibility', 'hidden');
        });
    });
  }
}

const attrs$2 = {
  interval: null,
  max: 100,
  order: 'natural' //natural|ascending|descending
};

class DimensionField extends Field {
  constructor(dimension) {
    super(dimension);
    setAttrs(this, attrs$2);
    this.setInit(dimension, ['interval', 'max', 'order']);
  }
  domain(sortByValue = false, accessor = null, multipleDomain = false) {
    const munged = this.munged();
    const level = this.level();
    const order = this.order();
    const needMultipleDomain = sortByValue !== 'natural' && multipleDomain;
    let curLevel = 0;
    let duplicateDomain = [];
    function _fill(nodes, setDomain, curLevel) {
      if (curLevel === level) {
        const residual = setDomain.filter(d => !nodes.find(n => n === d));
        return nodes.concat(residual);
      } else {
        return nodes.map(d => { 
          d.values = _fill(d.values, setDomain, curLevel + 1);
          return d;
        })
      }
    }
    function _keys(nodes, curLevel) {
      if (curLevel === level) {
        const domain = nodes.map(accessor ? accessor : d => {return {key: d.data.key, value: d.value};});
        if (needMultipleDomain) {
          duplicateDomain = duplicateDomain.concat(domain);
          return _domain(domain, false);
        } else {
          return domain;
        }
      } else {
        if (needMultipleDomain) {
          return nodes.map(d => {
           return {key: d.data.key, values: _keys(d.children, curLevel + 1)}
          })
        } else {
          return d3.merge(nodes.map(d => _keys(d.children, curLevel + 1)));
        }
      }
    }
    function _domain(domain, duplicate = true) {
      if (duplicate) domain = _set(domain);
      if ((!sortByValue || sortByValue === 'natural') && order && order !== 'natural') domain.sort(comparator(order, [], true, d => d.key)); 
      if (sortByValue && sortByValue !== 'natural') domain.sort(comparator(sortByValue, [], true, d => d.value)); 
      return domain.map(d => d.key);
    }

    function _set(domain) {
      let newDomain = [];
      domain.forEach(d => {
        if (!newDomain.find(n => n.key === d.key)) newDomain.push(d);
      });
      return newDomain;
    }
    let domain = _keys(munged, curLevel);
    if (needMultipleDomain) {
      const domainSet = _set(duplicateDomain).map(d => d.key);
      curLevel = 0;
      _fill(domain, domainSet, curLevel);
    } else {
      domain = _domain(domain);
    }
    return domain;
  }

  isInterval() {
    return this.interval() && this.format();
  }

  toObject() {
    let def = super.toObject();
    def.interval = this.interval();
    def.max =  this.max();
    def.order = this.order();
    return def;
  }
}

function dimensionField(dimension) {
  return new DimensionField(dimension);
}

setMethodsFromAttrs(DimensionField, attrs$2);

function conditionFunc (dimensions, measures) {
  let field = this.__execs__.field;
  if (dimensions.length <= 2 && measures.length <= 1) {
    if(dimensions.length === 2) {
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
  } else if (dimensions.length <=1 && measures.length >= 2) {
    if(dimensions.length === 1) { //mixed
      field.region = dimensionField(dimensions[0]);
    } 
    field.x = dimensionField(this.mixedDimension());
    field.y = measureField(mixedMeasure).mixed(true).measures(measures);
    return conditions[2];
  } 
  else throw new ConditionException();
}

function _munge() {
  this.condition(conditionFunc);
  const field = this.__execs__.field;
  const mixed = this.isMixed();
  
  if (this.aggregated()) {
    this.__execs__.munged = [this.data()];
  } else {
    if (mixed) {
      this.__execs__.munged = this.aggregateMixed(this.facet() && !this.stacked());//use pseudo dimension and measure
    } else {
      this.__execs__.munged = this.aggregate(this.facet() && !this.stacked());
    }
    if (!this.isNested()) this.__execs__.munged = [this.__execs__.munged[0].parent];
  } 

  if (this.stacked()) { 
    if (!field.region) {
      stack(this.__execs__.munged, field.y, this.normalized());
    } else { 
      let domain; 
      this.__execs__.munged.forEach((d,i) => {
        if (field.x.order() === 'natural') {
          if (i === 0) domain = d.children.map(d => d.data.key);
          else d.children.sort(comparator('ascending', domain, true, d => d.data.key));
        }
        stack(d.children, field.y, this.normalized());
      });
    }
  }
}

function _panning() {
  if (this.stream()) {
    this.streamPanning(this.__execs__.scale.x);
  }
}

function _range() {
  const scale = this.scale();
  const nested = this.isNested();
  const field = this.__execs__.field;
  const xAt = this.axisX();
  const yAt = this.axisY();
  const targetXField = nested ? field.region : field.x;
  const facet = this.facet();

  if (this.isFacet()) {
    const innerSize = this.innerSize();
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

    if (facet.orient === 'vertical') {
      scale.region.rangeRound([0, innerSize.height]);
    } else {
      scale.region.rangeRound([0, innerSize.width]);
    }
    return this;
  }
  if (this.isVertical()) { //vertical
    targetXField.axis(xAt);
    this.thickness(yAt, scale.y, false, false);
    this.thickness(xAt, nested ? scale.region : scale.x, true, true);
  } else {
    targetXField.axis(yAt);
    this.thickness(yAt, nested ? scale.region : scale.x, false, true);
    this.thickness(xAt, scale.y, true, false);
  }

  const innerSize = this.innerSize();
  //range 설정
  if (this.isVertical()) { //vertical 
    if (nested) {
      scale.region.range([0, innerSize.width]);
      scale.x.range([0, scale.region.bandwidth()]);
    } else {
      scale.x.range([0, innerSize.width]);
    }
    scale.y.range([innerSize.height, 0]); //reverse
  } else { //horizontal
    if (nested) {
      scale.region.range([0, innerSize.height]);
      scale.x.range([0, scale.region.bandwidth()]);
    } else {
      scale.x.range([0, innerSize.height]); //original
    }
    scale.y.range([0, innerSize.width]);  
  }
  return this;
}

function _region() {
  const aggregated = this.aggregated();
  const nested = this.isNested.call(this);
  const scale = this.__execs__.scale;
  const stacked = this.stacked();
  const facet = this.facet();
  const vertical = this.isVertical();
  const isFacet = this.isFacet();
  let __regionLocal = function(d) {
    if (aggregated) return;
    let xy = nested ? [scale.region(d.data.key), 0] : [0,0];
    if((facet && !stacked && facet.orient === 'vertical') ) {
      xy.reverse();
    } else if (!vertical && facet.orient !== 'horizontal') {
      xy.reverse();
    }
    let x = xy[0];
    let y = xy[1];
    d.x = x; d.y = y;
  };
  
  this.renderRegion(__regionLocal, d => d, isFacet);
}

function _tooltip$1() {
  if(!this.tooltip() || this.isFacet()) return;
  const parent = this.parent();
  const mixed = this.isMixed();
  const field = this.__execs__.field;
  const isStacked = this.stacked() && this.isNested() && !this.isFacet();
  const isVertical = this.isVertical();
  const isShowDiff = this.showDiff() && !this.isNested();
  let key = function(d, text) {
    return {name: 'key', value:text};
  };
  let value = function(d, text) {
    let name;
    if (mixed) {
      name = d.key;
    } else if (parent && parent.isMixed()) {
      name = d.key;
    } else {
      name = field.y.field();
    }
    return {name, value:text}
  };

  let valueDiff = function(d) {
    let nd = d.neighbor;
    let result = [{name: (isShowDiff ? d : d.parent).data.key, value: d.text} , {name: (isShowDiff ? nd : nd.parent).data.key, value: nd.text}];
    if (isShowDiff) result.reverse();
    let diff = d.diff ? d.diff.value : nd.diff.value;
    result.push({name: '(+/-)', value: diff});
    return result;
  };
  let offset = function(d) {
    let x = 0, y = 0;
    if (isStacked) {
      x = Math.max(-d.x + d.neighbor.x + d.neighbor.w, d.w);
      if (isVertical) { 
        if (d.neighbor.parent.x > d.parent.x) x += Math.abs(d.neighbor.parent.x - d.parent.x) - d.w;
      } else {
        let yDiff = d.neighbor.parent.y - d.parent.y;
        if (yDiff < 0) { //when it is last
          x = d.w;
        } else {
          y += d.h + (yDiff - d.h) /2;
        }
      }
    } else {
      x += d.w;
    }
    return {x,y}
  };
  let toggle = {key, offset};
  if (isStacked || isShowDiff) {
    toggle.value = valueDiff;
    toggle.showDiff = true;
  } else {
    toggle.value = value;
  }
  this.renderTooltip(toggle);
}

const orients  = ['vertical', 'horizontal'];
const conditions = ['normal', 'count', 'mixed'];
const _attrs = {
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
 * @augments StreamMixin
 * @todo write examples
 */
class Bar extends mix(Facet).with(sortMixin, paddingMixin, stackMixin, streamMixin) {
  constructor() {
    super();
    this.setAttrs(_attrs);
    this.process('munge', _munge, {isPre:true})
      .process('domain', _domain,  {isPre:true})
      .process('range', _range,  {isPre:true})
      .process('axis', _axis$1)
      .process('region', _region)
      .process('facet', _facet, {allow: function() {return this.isFacet()}})
      .process('mark', _mark, {allow: function() {return !this.isFacet()}})
      .process('legend', _legend$1)
      .process('tooltip', _tooltip$1)
      .process('padding', _panning)
      .process('annotation', _annotation);
  }
  measureName() {
    let measures = this.measures();
    let yField;
    if (this.condition() === conditions[2]) yField = mixedMeasure.field; 
    else if (this.aggregated() && measures[0].field === mixedMeasure.field) yField = measures[0].field;
    else yField = measures[0].field + '-' + measures[0].op;
    return yField;
  }

  muteToLegend(d) {
    this.muteLegend(this.isFacet() ? d.parent.data.key : d.data.key);
  }
  muteFromLegend(legend) {
    if (this.isFacet()) this.muteRegions(legend.key);
    else this.muteNodes(legend.key);
  }

  demuteToLegend(d) {
    this.demuteLegend(this.isFacet() ? d.parent.data.key : d.data.key);
  }

  demuteFromLegend(legend) {
    if (this.isFacet()) this.demuteRegions(legend.key);
    this.demuteNodes(legend.key);
  }

  isCount() {
    return this.condition() === conditions[1];
  }

  isFacet() {
    return this.facet() && this.isNested() && !this.stacked();
  }
  
  isMixed() {
    return this.condition() === conditions[2] ;
  }
  
  isNested() {
    let dimensions = this.dimensions();
    let condition = this.condition();
    return dimensions.length === 2 || (condition == conditions[2] && dimensions.length === 1);
  }
  
  isVertical() {
    return this.orient() === orients[0];
  }

  isNestedAndSortByValue() {
    return this.isNested() && this.sortByValue() !== 'natural';
  }
} 

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
Bar.prototype.annotation = setMethodFromDefaultObj('annotation', {showLabel: true, color: '#477cd2'});

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
Bar.prototype.showDiff = setMethodFromDefaultObj('showDiff', {neuFill: '#c0ccda', incStroke:'#477cd2', incFill: '#40bbfb', decStroke: '#f06292', decFill: '#f06292'});

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

function domainY(yField, munged, level = 0, nested = false, aggregated = false, stacked = false, showDiff = false) {
  const yDomain = yField.level(level)
  .munged(munged)
  .aggregated(aggregated)
  .domain(0, stacked);
  
  if (yDomain[0] > 0) yDomain[0] = 0;
  else if (yDomain[1] < 0) yDomain[1] = 0;

  if (showDiff && !nested) {
    if (yDomain[0] === 0) yDomain[1] *= 1.25;
    else if (yDomain[1] === 0) yDomain[0] *= 1.25;
  }
 return yDomain;
}
var bar = genFunc(Bar);

function brushGen(brushGen) {
  if (!arguments.length) return this.__attrs__.brushGen;
  this.__attrs__.brushGen = brushGen;
  let dispatch$$1 = this.__execs__.brushDispatch;
  brushGen.on('start.brushable', function() {
    dispatch$$1.apply('brushStart', this, arguments);
  }).on('brush.brushable', function() {
    dispatch$$1.apply('brushed', this, arguments);
  }).on('end.brushable', function() {
    dispatch$$1.apply('brushEnd', this, arguments);
  });
  return this;
}

function brushMove(group, selection) {
  let brush$$1 = this.brushGen();
  group.call(brush$$1.move, selection);
  return this;
}

const _attrs$13 = {
  brush : false,
  brushGen: null
};
const brushMixin = Base => {
  /**
   * Adds Brush Features
   * @mixin BrushMixin
   */
  let BrushMixin = class extends Base {
    constructor() {
      super();
      this.setAttrs(_attrs$13);
      this.__execs__.brush = null;
      this.__execs__.brushDispatch = d3.dispatch('brushStart', 'brushed', 'brushEnd');
      this.rebindOnMethod(this.__execs__.brushDispatch);
    }
  };
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
  BrushMixin.prototype.brushGen= brushGen;
  /**
   * @private
   */
  BrushMixin.prototype.brushMove= brushMove;
  return BrushMixin;
};

const _attrs$14 = {
  fitLine: false
};

const fitLineMixin = Base => {
  /**
   * adds FitLine features
   * @mixin FitLineMixin
   */
  let FitLineMixin = class extends Base {
    constructor() {
      super();
      this.setAttrs(_attrs$14);
    }
  };
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
  if (!arguments.length || _val === false) return this.__attrs__.seriesName;
  else if (typeof _val === 'boolean' && _val) {
    return this.__attrs__.seriesName.split('.').join(' ').trim();
  }
  else if (typeof _val === 'string') {
    this.__attrs__.seriesName = _val;
    //this.__attrs__.seriesName.split('.').join(' ').trim();
  }
  return this;
}

const curves = ['linear', 'stepped', 'curved'];
const _attrs$15 = {
  curve: curves[0],
  point: false,
  pointRatio : 3,
  seriesName: className('mark series', true)
};

const seriesMixin = Base => {
  /**
   * @mixin SeriesMixin
   */
  let SeriesMixin = class extends Base {
    constructor() {
      super();
      this.setAttrs(_attrs$15);
    }
  };
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

function pointNum(nested = false) {
  if (nested) {
    return d3.max(this.__execs__.munged, d=> d.children.length);
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
  const types = ['normal', 'brush'];
  if (!arguments.length) return this.__attrs__.zoom;
  if (typeof zoom$$1 === 'boolean') {
    if (zoom$$1) this.__attrs__.zoom = 'normal';
    else this.__attrs__.zoom = false;
  } else if (typeof zoom$$1 === 'string') {
    if (types.findIndex(d => d.localeCompare(zoom$$1) === 0) >= 0) {
      this.__attrs__.zoom = zoom$$1;
    }
  } 
  return this;
}

function zoomExtent(nested = false, isDual = false, unit = 2) {
  let pointNum = this.pointNum(nested);
  let scale = this.__execs__.scale;
  let range$$1 = scale.x.range();
  let rangeDist = Math.abs(range$$1[1] - range$$1[0]);
  if (isDual) {
    let yRange = scale.y.range();
    let yRangeDist = Math.abs(yRange[1] - yRange[0]);
    if (rangeDist > yRangeDist) rangeDist = yRangeDist;
  }
  let max$$1 = pointNum*pointNum/rangeDist;
  return [1, Math.ceil(max$$1 * unit)];
}

function zoomed(renderFunc, isDual = false) {
  const zoom$$1 = this.zoomGen();
  const that = this;
  const field = this.__execs__.field;
  const axisObj = this.__execs__.axis;
  const axisX = axisObj && axisObj.x ? axisObj.x[field.x.field()] : null;
  const scaleObj = this.__execs__.scale;
  const scaleX = scaleObj.x; //stroe original scale
  const axisY = isDual && axisObj && axisObj.y ? axisObj.y[field.y.field()] : null;
  const scaleY = isDual ? scaleObj.y : null;

  let _axis = function(transform) {
    const newScaleX = transform.rescaleX(scaleX);
    scaleObj.x = newScaleX;
    if (axisX) {
      axisX.scale(newScaleX);
      axisX.render(null, true);
    }
    if (isDual) {
      const newScaleY = transform.rescaleX(scaleY);
      scaleObj.y = newScaleY;
      if (axisY) {
        axisY.scale(newScaleY);
        axisY.render(null, true);
      }
    }
  };

  zoom$$1.on('zoom.zoomable.zoomed', function() {
    const transform = d3.event.transform;
    if(!transform) return;
    _axis(transform);
    if (that.__execs__.tooltip) that.__execs__.tooltip.hide(); //reset tooltip
    renderFunc();
  });
  return this;
}

function zoomGen(_val) {
  if (!arguments.length) return this.__attrs__.zoomGen;
  this.__attrs__.zoomGen = _val;
  const that = this;
  const dispatch$$1 = that.__execs__.zoomDispatch;
  _val.on('zoom.zoomable', function() {
    dispatch$$1.apply('zoom', this, arguments);
  });
  return this;
}

function zoomTransform(group, transform) {
  group.call(this.zoomGen().transform, transform);
  return this;
}

const _attrs$16 = {
  zoom : false,
  zoomGen: null
};

const zoomMixin = Base => {
  /**
   * @mixin ZoomMixin
   */
  let ZoomMixin = class extends Base {
    constructor() {
      super();
      this.setAttrs(_attrs$16);
      this.__execs__.zoom = null;
      this.__execs__.zoomDispatch = d3.dispatch('zoom');
      this.rebindOnMethod(this.__execs__.zoomDispatch);
    }
  };
  ZoomMixin.prototype.pointNum = pointNum;
  ZoomMixin.prototype.zoom = zoom$1;
  ZoomMixin.prototype.zoomed = zoomed;
  ZoomMixin.prototype.zoomExtent = zoomExtent;
  ZoomMixin.prototype.zoomGen = zoomGen;
  ZoomMixin.prototype.zoomTransform = zoomTransform;
  ZoomMixin.prototype.isBrushZoom = isBrushZoom;
  setMethodsFromAttrs(ZoomMixin, _attrs$16);
  return ZoomMixin;
};

function isBrushZoom() {
  return this.__attrs__.zoom && this.__attrs__.zoom === 'brush';
}

const _attrs$17 = {
  shape: null
};

const shapeMixin = Base => {
  /**
   * @mixin ShapeMixin
   */
  let ShapeMixin = class extends Base {
    constructor() {
      super();
      this.setAttrs(_attrs$17);
    }
  };
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
  const canvas = this.__execs__.canvas;
  const innerSize = this.innerSize();
  const brushGen = d3.brushX().extent([[0,0], [innerSize.width, innerSize.height]]);
  let brushG = canvas.selectAll('.brush.x')
    .data([innerSize]);
  brushG.exit().remove();
  brushG.enter().append('g')
    .attr('class', 'brush x')
    .merge(brushG)
    .attr('transform', 'translate(' + [0, 0] +')')
    .call(brushGen);

  this.brushGen(brushGen);
}

function _legend$3() { 
  let field = this.__execs__.field;
  if (!field.region) { 
    return; 
  }
  this.renderLegend();
}

function _brushZoom(ratio = 0.75) {
  this.noAxisOffset(true); 
  this.renderCanvas();
  const that = this;
  const innerSize = this.innerSize();
  const bigHeight = Math.round(innerSize.height * ratio);
  const smallHeight = innerSize.height - bigHeight;
  const settings = ['axis', 'axisTitles', 'color', 'curve', 'multiTooltip', 'normalized', 'padding' ,'point', 'pointRatio', 'regionPadding', 'shape', 'size', 'stacked', 'grid', 'font', 'label', 'tooltip']
    .map(d => { return {key: d, value:this[d]()};});
  const lines = [];
  let __regionLocal = (d,i) => {
    d.x = 0; 
    d.y =  i === 0 ? 0 : bigHeight;
  };
  let region = this.renderRegion(__regionLocal, [{h: bigHeight}, {h: smallHeight}], true);
  region.each(function(d,i) {
    let l = line$2().container(this)  
      .data(that.data())
      .dimensions(that.dimensions()).measures(that.measures())
      .width(innerSize.width).height(d.h)
      .legend(false)
      .zeroMargin(true)
      .parent(that);
    settings.forEach(d => l[d.key](d.value));
    if (i == 0) { //big
      let xAt = l.axis().find(d=>d.target==='x');
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
    let regionDomain = this.__execs__.field.region.munged(this.__execs__.munged).level(0).domain();
    this.scale().color = d3.scaleOrdinal().domain(regionDomain).range(this.color());
    _legend$3.call(this);
  }
  
  //control brush+zoom
  const brushScale = lines[1].__execs__.scale.x;
  const brushGroup = lines[1].__execs__.canvas.select('.brush.x');
  const zoomScale = lines[0].__execs__.scale.x; //maintain inital scale
  const zoomGroup = this.__execs__.canvas;
  lines[0].on('zoom.line', function() {
    if (d3.event.sourceEvent && (d3.event.sourceEvent.type === 'zoom' || d3.event.sourceEvent.type === "end" || d3.event.sourceEvent.type === "brush")) return; // ignore brush-by-zoom
    let newDomain = d3.event.transform.rescaleX(brushScale).domain();
    lines[1].brushMove(brushGroup, newDomain.map(brushScale));
  });
  lines[1].on('brushed.line brushEnd.line', function() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return; // ignore brush-by-zoom
    let range$$1 = d3.event.selection|| brushScale.range();
    let domain = range$$1.map(brushScale.invert);
    range$$1 = domain.map(zoomScale);
    lines[0].zoomTransform(zoomGroup, d3.zoomIdentity
      .scale((zoomScale.range()[1] - zoomScale.range()[0]) / (range$$1[1] - range$$1[0]))
      .translate(-range$$1[0], 0)); 
  });
}

function _mark$2(zoomed = false) {
  const that = this;
  const canvas = this.__execs__.canvas;
  const field = this.__execs__.field;
  const nested = this.isNested.call(this);
  const scale = this.__execs__.scale;
  const stacked = this.isStacked();
  const color = this.color();
  const label = this.label();
  const individualScale = this.isIndividualScale();
  const size = this.size();
  const showPoint = this.point();
  const pointRatio = this.pointRatio();
  const trans = zoomed ? d3.transition().duration(0).delay(0) : d3.transition().duration(this.transition().duration).delay(this.transition().delay);  
	const isArea = this.shape() === shapes[1];
	const areaGradient = isArea && this.areaGradient();
  const yField = this.measureName();
  const curve = this.curve() === curves[0] ? d3.curveLinear : (this.curve() === curves[1] ? d3.curveStep : d3.curveCatmullRom);
  const scaleBandMode = this.scaleBandMode();
  const multiTooltip = this.multiTooltip();
  const stream = this.stream();
  const xKey = d => field.x.interval() ? new Date(d.data.key) : d.data.key;
  const xValue = d => scale.x( xKey(d)) + (scaleBandMode ? scale.x.bandwidth()/2 : 0);
  const yValueFunc = (s) => {
    return d => {
      return stacked ? s(d.data.value[yField + '-end']) : s(d.data.value[yField])
    }
  };
  const lineInitGen = d3.line().x(xValue).y(d3.max(scale.y.range())).curve(curve);
  const lineGenFunc = (ys) => {
    return d3.line().x(xValue).y(yValueFunc(ys)).curve(curve);
  };
  const areaInitGen = d3.area().x(xValue)
    .y(d3.max(scale.y.range())).curve(curve);
  const areaGenFunc = (ys) =>  {
    return d3.area().x(xValue)
    .y0(d => stacked ? scale.y(d.data.value[yField + '-start' ]): d3.max(scale.y.range()))
    .y1(yValueFunc(ys)).curve(curve);
  };
  let __local = function (selection) {
    let tFormat = (key) => {
      let f = field.x.isInterval() ? d3.timeFormat(field.x.format()) : null; 
      return f ? f(key) : key;
    };

    selection.each(function(d, i, arr) {
      d.value = stacked ? d.data.value[yField + '-end'] : d.data.value[yField];
      d.x = xValue(d);
      if (isNaN(d.x) && scale.x._defaultDomain) {
        d.x = that.tempPosForOrdinalScale(xKey(d), scale.x);
      }
      if (stream) {
        const curX = xKey(d);
        if (scale.x.invert) {
          const dist = that.distDomain(scale.x);
          if (curX > scale.x._lastDomain[scale.x._lastDomain.length-1]) {
            d.x0 = d.x + dist;
          }
        } else {
          d.x0 = that.tempPosForOrdinalScale(xKey(d), scale.x);
        }
      }
      d.y = yValueFunc(individualScale ? d.parent.scale : scale.y)(d);
      d.anchor = i === 0 ? 'start' : (i === arr.length-1 ? 'end' : 'middle'); 
      d.text = labelFormat(d.value);
      d.color = d.parent.color;
      d.key = tFormat(d.data.key);
    });
  };

  let __upward = function (selection) {
    selection.each(function(d,i,arr) {
      let upward = true;
      //let result = mark.get(this);
      if(i < arr.length -1 && arr[i+1]) {
        let nextResult = arr[i+1];
        upward = (nextResult.y <= d.y);
      }
      d.upward = upward;
    });
  };

  let __seriesInit = function (selection, area$$1 = false) {
    if(area$$1) {
      selection.each(function(d) {
        let target = d.children;
        d3.select(this).attr('d', areaInitGen(target)).attr('fill-opacity', 0.4)
          .style('stroke', 'none');
      });
    }
    else {
      selection.each(function(d) {
        let target = d.children;
        d3.select(this).attr('d', lineInitGen(target))
          .style('fill', 'none');
      });
    }
  };
  let __series = function (selection, area$$1 = false, stream = false) {
    const c = d => nested ? scale.color(d.data.key) : color[0];
    const dist = stream && that.distDomain(scale.x);
    selection.each(function(d) {
      let target =  d.children;
      let thisSelect = d3.select(this);
      if (stream) {
        thisSelect
          .attr('d', (area$$1 ? areaGenFunc : lineGenFunc)(individualScale ? d.scale : scale.y)(target))
          .attr('transform', `translate(${dist},0)`)
          .transition(trans)
            .attr('transform', `translate(0,0)`);
      } else {
        thisSelect.transition(trans)
          .attr('d', (area$$1 ? areaGenFunc : lineGenFunc)(individualScale ? d.scale : scale.y)(target));
      }
      
    });
    if (areaGradient) {
			let url = d => `url(#areaGradient-${d.data.key})`; 
			selection
				.attr('stroke', 'none')
				.attr("fill", url);
			console.log('c', c);
    }else if (area$$1) {
			selection.attr('fill', c);
		}else {
      selection.attr('stroke', c)
        .attr('stroke-width', size.range[0] + 'px');
    }
  };
  let __pointInit = function (selection) {
    selection
      .attr('r', (size.range[0] - size.range[0] / 4) * pointRatio)
      .attr('stroke-width', size.range[0] / 4 * pointRatio)
      .style('fill', '#fff')
      .attr('opacity',  showPoint ? 1 : 0)
      .style('cursor', 'pointer')
      .attr('cx', d => d.x0 || d.x)
      .attr('cy', d => stream ? d.y : d3.max(scale.y.range()));
  };
  let __point = function (selection) {
    selection
      .transition(trans)
      .attr('r', (size.range[0] - size.range[0] / 4) * pointRatio)
      .attr('stroke-width', size.range[0] / 4 * pointRatio)
      .attr('opacity',  showPoint ? 1 : 0)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  };
  let __labelInit = function (selection) {
    selection.each(function(d) {
      let selection = d3.select(this);
      selection.attr('x', d => d.x0 || d.x)
        .attr('y', d => stream ? d.y : d3.max(scale.y.range()))
        .attr('stroke', 'none')
        .style('visibility', label ? 'visible' : 'hidden')
        .text(d.text);
      that.styleFont(selection);
    });
  };
  let __label = function(selection) {
    selection.each(function(d) {
      let selection = d3.select(this);
      selection.attr('text-anchor', d.anchor)
        .style('pointer-events', multiTooltip ? 'none' : 'all')
        .transition(trans)
        .attr('y', d.y  + (size.range[0] / 2 * pointRatio + 1) * (d.upward ? 1 : -1))
        .attr('x', d.x)
        .attr('dy', d.upward ? '.71em' : 0)
        .style('visibility', label ? 'visible' : 'hidden')
        .text(d.text);
      that.styleFont(selection);
    });
  };

  let __appendSeries = function (selection) {
    let series = selection.select(that.seriesName());
    if (series.empty()) {
      series = selection.append('g').attr('class', that.seriesName(true));
    }
    let ___append = function(selection, area$$1) {
      let path = selection.selectAll('path' + className((area$$1 ? 'area' : 'line'), true))
      .data(d => [d], (d,i) => d.data ? d.data.key : i);
      path.exit().remove();
      path.enter().append('path')
        .attr('class', className((area$$1 ? 'area' : 'line')))
        .call(__seriesInit, area$$1)
        .merge(path)
        .call(__series, area$$1, stream)
        .style('pointer-events', 'none');
    };
    if(isArea) {
      series.call(___append, true);
    } else { // remove area
      series.selectAll('path' + className('area', true)).remove();
    }
    series.call(___append, false);
  };

  let __appendPoints = function (selection) {
    selection.attr('fill', d => d.color)
      .attr('stroke', d => d.color);
    let point = selection.selectAll(that.nodeName())
      .data(d =>  d.children , d => d.data.key);
    point.exit().remove();
    let pointEnter = point.enter().append('g')
      .attr('class', that.nodeName(true))
      .call(__local);
    pointEnter.append('circle')
      .call(__pointInit);
    pointEnter.append('text')
     .call(__labelInit);
    point.call(__local);
    point = pointEnter.merge(point)
      .call(__upward);
    point.select('circle')
     .call(__point);
    point.select('text')
      .call(__label);
  };
  let region = canvas.selectAll(this.regionName());
  region.each(function() {
    d3.select(this).each(function(d) {
      d.children.sort((a,b) => xValue(a) - xValue(b));
    }).call(__appendSeries)
      .call(__appendPoints);
  });
}

function _munge$2() { 
  let conditionFunc = function (dimensions, measures) {
    const field = this.__execs__.field;
    if (dimensions.length <= 2 && measures.length < 2) {
      if(dimensions[1]) field.region = dimensionField(dimensions[1]);
      field.x = dimensionField(dimensions[0]);
      if (measures.length === 0) this.measure(countMeasure); //use fake-measure for counting
      field.y = measureField(measures[0]);
      if (measures.length === 0) return conditions$1[1];
      else if (measures.length === 1) return conditions$1[0];
    } else if (dimensions.length === 1 && measures.length >= 2) {
      field.region = dimensionField(this.mixedDimension());
      field.x = dimensionField(dimensions[0]);
      field.y = measureField(mixedMeasure).mixed(true).measures(measures);
      return conditions$1[2];
    }
    else throw new ConditionException();
  };
  this.condition(conditionFunc); 
  const field = this.__execs__.field;
  const mixed = this.isMixed();
  
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
    let munged = this.__execs__.munged;
    let orderList = munged[0].children.map(d => d.data.key);
    //use temporary structure using zip
    munged.forEach( (m,i) => {
      if (i > 0) {
        m.children.sort(comparator('ascending', orderList, true, d => d.data.key));
      }
    }); //sort zipped
    let valuesZipped = munged.map(d => d.children);
    valuesZipped = d3.zip.apply(null, valuesZipped);
    valuesZipped.forEach(d => {
      stack(d, field.y, this.normalized());
    });
  }
}

function _panning$1() {
  if (this.stream()) {
    this.streamPanning(this.__execs__.scale.x);
  }
}

function individualDomain (target, measureField, padding = 0) {
  let field = measureField.field();
  let domain = target.children.map(function(d) {
    return d.data.value[field];
  });
  domain = d3.extent(domain);
  if (padding <= 0) return domain;
  let dist = Math.abs(domain[0] - domain[1]);
  dist *= padding * 0.5;
  return [domain[0] - dist, domain[1] + dist];
}


function _domain$2() {
  const keep = this.keep();
  const scale = this.scale();
  const munged = this.__execs__.munged;
  const nested = this.isNested();
  const stacked = this.isStacked();
  const aggregated = this.aggregated();
  const field = this.__execs__.field;
  const level = 1;
  const isMixed = this.isMixed();
  const individualScale = this.isIndividualScale();
  const viewInterval = this.viewInterval();
  let yDomain, xDomain;
  let regionDomain;
  
  scale.y = d3.scaleLinear();
  if (nested) {
    regionDomain = field.region.level(0).munged(munged).domain(); 
    scale.color = this.updateColorScale(regionDomain, keep);
  }

  if (this.isFacet()) { 
    scale.region  = d3.scaleBand().domain(regionDomain).padding(this.regionPadding());
    return;
  } 
  
  xDomain = field.x.munged(munged).level(level).domain();
  yDomain = domainY$1(field.y, munged, level, aggregated, stacked);
  //use scaleLinear when domain is number
  let isNumberDomain = true;
  for (let i = 0; i < xDomain.length; i++) {
    let d = xDomain[i];
    if(isNaN(d)) {
      isNumberDomain = false;
      break;
    } else if (typeof d === 'string') {
      xDomain[i] = +d;
    }
  }
  
  if (this.scaleBandMode()) {
    if (!keep) scale.x = d3.scaleBand().padding(this.padding());
  } else if (field.x.interval() || isNumberDomain) { 
    if (field.x.order() === 'natural') {
      if (xDomain[0] instanceof Date) xDomain = d3.extent(xDomain); 
      else xDomain = d3.extent(xDomain.map(d => +d)); 
    } else {
      xDomain = [xDomain[0], xDomain[xDomain.length-1]];
    }
    if (!keep) scale.x = continousScale(xDomain, null, field.x);
  } else {
    if (!keep) scale.x = d3.scalePoint().padding(this.padding());
  }
  
  
  if (!keep && viewInterval) {
    xDomain = this.limitViewInterval(scale.x, xDomain);
  } else if (keep && this.stream()) {
    xDomain = this.limitViewInterval(scale.x, xDomain, true);
  }
  scale.x.domain(xDomain);
  this.setCustomDomain('y', yDomain);

  if (isMixed && individualScale) {
    munged.forEach(m => {
      let domain = individualDomain(m, field.y, this.padding());
      m.scale = d3.scaleLinear().domain(domain).nice();
      m.scale._defaultDomain = domain;
      if (this.isMixed()) {
        let measure = this.measures().find(d => d.field === m.data.key);
        if (measure && measure.customDomain) {
          m.scale._defaultDomain = domain;
          m.scale.domain(measure.customDomain);
        }
      }
    });
  }
  return this;
}

function _range$2() {
  const scale = this.scale();
  const munged = this.__execs__.munged;
  const individualScale = this.isIndividualScale();
  const facet = this.facet();
  const isMixed = this.isMixed();
  const xAt = this.axisX();
  const yAt = this.axisY();
  
  if (this.isFacet()) { 
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
    const innerSize = this.innerSize();
    if (facet.orient === 'vertical') {
      scale.region.rangeRound([0, innerSize.height]);
    } else {
      scale.region.rangeRound([0, innerSize.width]);
    }
    return;
  } 

  if (isMixed && individualScale && yAt) {
    yAt.orient = 'left';
    this.thickness(yAt, munged[0].scale, false, false);
    let tempAt = Object.assign({}, yAt);
    tempAt.orient = 'right';
    this.axis(tempAt);
    this.thickness(tempAt, munged[munged.length-1].scale, false, false);
   } else if (yAt) {
    let right = this.axis().find(d => d.target === 'y' && d.orient !== yAt.orient); 
    if (right) this.axis(right, false);
    this.thickness(yAt, scale.y, false, false);
  }
 
  this.thickness(xAt, scale.x, true, scale.x.invert ? false : true);
  const innerSize = this.innerSize();
  scale.x.range([0, innerSize.width]); 
  if (scale.x.invert && !this.scaleBandMode()) {
    const xDomain = scale.x.domain();
    let d0 = this.padding();
    d0 = innerSize.height * d0 /2;
    let d1 = innerSize.width - d0;
    if (xDomain[0] === xDomain[1] || xDomain[1] - xDomain[0] === 0) { // if no domain, using center
      let center = (d0+d1)/2;
      scale.x.range([center, center]) ;
    } else {
      scale.x.range([d0, d1]); 
    }
  } 
  scale.y.range([innerSize.height, 0]); //reverse
  
  if (individualScale) { //individual scale 
    munged.forEach(m => {
      m.scale.range([innerSize.height, 0]);
    });
  }
  return this;
}

function _axis$3() {
  const that = this;
  const munged = this.__execs__.munged;
  const scale = this.__execs__.scale;
  const grid = this.grid();
  const individualScale = this.isIndividualScale();
  const innerSize = this.innerSize();
  const fieldObj = this.__execs__.field;
 
  let _axisScaleX = function (axisToggle) {
    fieldObj.x.axis(axisToggle);
    let curAxis = that.axisDefault(scale.x, axisToggle);
    if (scale.x.invert) curAxis.grid(grid).gridSize(innerSize.height);
    if (axisToggle.orient === 'bottom') curAxis.y(scale.y.range()[0]);
    return curAxis;
  };

  let _axisScaleY = function (axisToggle, scaleY = scale.y, field) {
    if (!field) {
      fieldObj.y.axis(axisToggle);
    } else {
      axisToggle.field = field;
    }
    let curAxis = that.axisDefault(scaleY, axisToggle);
    curAxis.grid(grid).gridSize(innerSize.width);
    if (axisToggle.orient === 'right') curAxis.x(scale.x.range()[1]);
    return curAxis;
  };

  let xAt = this.axisX();
  let yAt = this.axisY();
  if (this.isFacet()) {
    this.axisFacet();
  } else {
    if (xAt) {
      _axisScaleX(xAt);
    } 
    if (yAt) { 
      if (individualScale) { 
        let ats = this.axis().filter(d => d.target === 'y');
        if (munged.length <= 2) {
          ats.forEach((d,i) => _axisScaleY(d, munged[i].scale, munged[i].data.key));
        } 
      } else {
        _axisScaleY(yAt);
      }
    }
  }
  this.renderAxis();
}

const stroke = '#aaa';

function _meanLine() {
  const canvas = this.__execs__.canvas;  
  let meanLineG = canvas.select('.mean-line-g');
  if (!(typeof this.meanLine() === 'number') && (!this.meanLine() || this.isFacet())) {
    meanLineG.remove();
    return;
  }
  const meanLineVal = this.meanLine();
  const ms = [];
  const scale = this.__execs__.scale;
  const trans = d3.transition().duration(this.transition().duration).delay(this.transition().delay); 
  if (typeof meanLineVal === 'number' ) {
    let domain = scale.y.domain();
    if (meanLineVal >= domain[0] && meanLineVal <= domain[1]) {
      ms.push({value: meanLineVal, y: scale.y(meanLineVal)});
    }
  } else {
    this.regions().filter(d => {
      if (typeof meanLineVal === 'string') {
        return d.data.key === meanLineVal;
      } else {
        return true;
      }
    }).each(d => {
      let result = {value: d3.mean(d.children, d => d.value)};
      result.y = scale.y(result.value);
      ms.push(result);
    });
  }
  
  if (meanLineG.empty) {
    meanLineG = canvas.append('g').attr('class', 'mean-line-g');
  }
  let meanLine =meanLineG.selectAll('.mean-line')
    .data(ms);
  meanLine.exit().remove();

  let meanLineEnter = meanLine.enter().append('g')
    .attr('class', 'mean-line')
    .attr('transform', 'translate(' + [0, scale.y.range()[0]]+')')
    .style('pointer-events', 'none');
  meanLineEnter.append('line')
    .attr('stroke', stroke)
    .attr('shape-rendering', 'crispEdges')
    .attr('stroke-width', '2px')
    .attr('x2', scale.x.range()[1]);
    
  meanLine = meanLineEnter.merge(meanLine)
    .transition(trans)
    .attr('transform', d => 'translate(' + [0, d.y]+')');
  meanLine.select('line')
    .transition(trans)
    .attr('x2', scale.x.range()[1]);
}

function _region$2() {
  const aggregated = this.aggregated();
  const canvas = this.__execs__.canvas;
  const nested = this.isNested();
  const scale = this.__execs__.scale;
  const stacked = this.stacked();
  const facet = this.facet();
  const isFacet = this.isFacet();
	const color = this.color();
	const areaGradient = this.areaGradient();
  let __regionLocal = (d, index ) => {
    if (aggregated) return;
    let xy;
    if(!nested) {
      xy = [0,0];
    } else if(facet && !stacked) {
      xy = [scale.region(d.data.key), 0];
      if (facet.orient === 'vertical') {
        xy.reverse();
      }
    } else {
      xy = [0,0];
    }
    d.x = xy[0]; d.y = xy[1];
		d.color = nested ? scale.color(d.data.key) : color[0];
		
		if(areaGradient){
			let defs = canvas.append("defs");
			var gradient = defs.append("linearGradient")
				.attr("id", "areaGradient-"+d.data.key)
				.attr("x1", "30%").attr("x2", "50%")
				.attr("y1", "80%").attr("y2", "0%");
			gradient.append("stop")
				.attr("offset", "0%")
				.attr("stop-color", d.color)
				.attr("stop-opacity", 0);
			gradient.append("stop")
				.attr("offset", "100%")
				.attr("stop-color", d.color)
				.attr("stop-opacity", 1);
		}
  };
  
  //create multiTooltip area
  if (!isFacet && this.multiTooltip()) {
    let multiTooltipG = canvas.select('.multi-tooltip-g');
    if (multiTooltipG.empty()) multiTooltipG = canvas.append('g').attr('class', 'multi-tooltip-g');
	}
	
	
  
  this.renderRegion(__regionLocal, d => {
      let target = stacked ? d.slice().reverse() : d;
      return target;
    }, isFacet);
}

function _facet$2 () {
  const parent = this;
  const scale = this.__execs__.scale;
  const facet = this.facet();
  const canvas = this.__execs__.canvas;
  const innerSize = this.innerSize();
  const dimensions = [this.dimensions()[0]];
  const measures = this.isMixed() ? [mixedMeasure] : this.measures();
  let width, height;
  let settings = ['axisTitles', 'curve', 'meanLine', 'multiTooltip', 'normalized', 'padding' ,'point', 'pointRatio', 'regionPadding', 'shape', 'size', 'grid', 'font', 'label']
    .map(d => { return {key: d, value:this[d]()};});
  let hasX = this.axisX();
  let hasY = this.axisY();
  let smallLines = []; //stroe sub-charts
  let _smallLine = function(d) {
    let smallLine = line$2()
        .container(this)
        .data(d)
        .dimensions(dimensions).measures(measures)
        .width(width).height(height)
        .legend(false)
        .tooltip(false)
        .parent(parent) 
        .zeroMargin(true) 
        .aggregated(true) 
        .color(scale.color(d.data.key));
    settings.forEach(d => smallLine[d.key](d.value));
    if (hasY) smallLine.axis({target:'y', orient:'left'});//showTitle: facet.orient === 'horizontal' ? i === 0 : true});
    if (hasX) smallLine.axis({target:'x', orient:'bottom'});//showTitle: facet.orient === 'horizontal' ? true : i === arr.length-1});
    smallLine.render();
    smallLines.push(smallLine);
  };
  if (facet.orient === 'horizontal') {
    width =  scale.region.bandwidth();
    height = innerSize.height;
  } else {
    width = innerSize.width;
    height = scale.region.bandwidth();
  }

  canvas.selectAll('.facet')
    .each(_smallLine);
  smallLines.forEach(sm => { //deal sub-chart's event
    sm.on('selectStart.facet selectMove.facet selectEnd.facet', function(tick) { //propgate events to other sub-chart
      //let start = event.type === 'mouseenter';
      smallLines.forEach(osm => {
        if(osm !== sm) {
          osm.showMultiTooltip(tick);
        }
      });
    });
  });
}

const fitLineColor = '#c0ccda';
function _fitLine() {
  const canvas = this.__execs__.canvas;  
  const scale = this.__execs__.scale;
  const trans = d3.transition().duration(this.transition().duration).delay(this.transition().delay);
  const fitLineVal = this.fitLine();
  let fitLineG = canvas.selectAll(className('fit-line-g', true));
  if (!fitLineVal || !scale.x.invert) {
    if (!fitLineG.empty()) canvas.select(className('fit-line-g', true)).remove();
    return;
  } 
  let leastSquares = this.leastSquare(fitLineVal);
  let xValues = scale.x.domain();
  let yValues = leastSquares.map(l => {
    return xValues.map(d => l.slope * d + l.intercept);
  });
  
  if (fitLineG.empty()) {
    fitLineG = canvas.append('g').attr('class',  className('fit-line-g'))
      .attr('clip-path', `url(#${canvas.selectAll(className('canvas-g-clip-path', true)).attr('id')}`);
  }
  fitLineG.datum(yValues);

  let fitLine = fitLineG.selectAll(className('fit-line', true))
    .data(d => d);
  fitLine.exit().remove();
  let fitLineEnter = fitLine.enter().append('line')
    .attr('class', className('fit-line'))
    .style('fill', 'none').style('stroke', fitLineColor)
    .style('stroke-width', 1)
    .attr('x1', scale.x(xValues[0]))
    .attr('x2', scale.x(xValues[1]))
    .attr('y1', d => (d.scale ? d.scale : scale.y).range()[0])
    .attr('y2', d => (d.scale ? d.scale : scale.y).range()[0]);
  fitLine = fitLineEnter.merge(fitLine);
  fitLine.transition(trans)
    .attr('x1', scale.x.range()[0], scale.x(xValues[0]))
    .attr('x2', scale.x(xValues[1]))
    .attr('y1', d => (d.scale ? d.scale : scale.y)(d[0])) 
    .attr('y2', d => (d.scale ? d.scale : scale.y)(d[1]));
}

const defaultFont$5 = {
  'font-family': 'sans-serif',
  'font-size': 12,
  'font-weight': 'normal',
  'font-style': 'normal'
};
const pointOriginColor = '#fff';
const baseColor = '#b0bec5';
const _attrs$18 = {
  anchor: {x:'left', y:'top'}, 
  color: baseColor,
  dx: 0,
  dy: 0,
  height: null,
  font: defaultFont$5,
  nodeName: className('mark node', true), 
  tooltip: null,
  target: null,
  keyFormat: null,
  valueFormat: null,
  width: null,
  sortByValue: {type:'natural'},
  x: 0, 
  y: 0
};

class MultiTooltip {
  constructor() {
    this.__attrs__ = JSON.parse(JSON.stringify(_attrs$18));
    this.__execs__ = {tooltip:null, domain:null, dispatch: d3.dispatch('start', 'move', 'end')};
    this.valueFormat(labelFormat);
    rebindOnMethod(this, this.__execs__.dispatch); 
  }
}

function _multiTooltip () {
  return new MultiTooltip();
}

function _event$1(selection) {
  const that = this;
  const domain = this.__execs__.domain;
  const dispatch$$1 = this.__execs__.dispatch;
  let bisectDomain = d3.bisector(d => d.x).right;
  let lastTick = null;

  let _tick = function(start = false) {
    const clientRectLeft = selection.node().getBoundingClientRect().left;    
    let x = d3.event.x - clientRectLeft;
    let i = bisectDomain(domain, x); 
    if (i > 0 && i < domain.length) {
      let d1 = Math.abs(x - domain[i-1].x);
      let d2 = Math.abs(domain[i].x - x);
      if (d1 < d2) i = i-1;
    } 
    i = Math.max(0, Math.min(domain.length-1, i));
    let tick = domain[i];
    if (!lastTick || tick.x !== lastTick.x || start) {
      _show.call(that, selection, tick);
      dispatch$$1.call(start ? 'start': 'move', this, tick);
      lastTick = tick;
    }
  };

  selection.on('mouseenter.multi-tooltip', function() {
    _tick(true);
  }).on('mousemove.multi-tooltip', function() {
    _tick(false);
  }).on('mouseleave.multi-tooltip', function() {
    _hide.call(that, selection);
    dispatch$$1.call('end', this);
    lastTick = null;
  });
  
}

function _domain$4() {
  const target = this.target();
  const points = target.__execs__.canvas.selectAll(this.nodeName());
  const domain = [];
  points.each(function(d) {
    let find = domain.find(dd => dd.x === d.x);
    if (find) {
      find.points.push(this);
    } else {
      domain.push({x:d.x, points:[this], value: d.key});
    }
  });
  this.__execs__.domain = domain.sort((a,b) => a.x-b.x);
}

function _hide(selection) {
  const trans = d3.transition().duration(180);
  selection.select(className('baseline', true)).transition(trans).attr('opacity', 0);

  let target = this.target();
  let circle = target.nodes().filter(function() {
    return d3.select(this).classed(className('show'));
  }).classed(className('show'), false).selectAll('circle');
  if (!target.point()) circle.attr('opacity', 0);
  else circle.style('fill', pointOriginColor);
  if (this.tooltip()) this.tooltip().hide();
}

function _render$4(selection) {
  const innerSize = this.target().innerSize();
  selection.style('fill', 'none');
  let overlay = selection.select(className('overlay', true));
  if(overlay.empty()) {
    overlay = selection.append('rect').attr('class', className('overlay'))
      .style('cursor', 'crosshair');
    selection.append('line')
      .attr('class', className('baseline'))
      .attr('opacity', 0)
      .attr('shape-rendering', 'crispEdges')
      .attr('pointer-events', 'none');
  }
  selection.select(className('baseline', true))
    .attr('y1', 0).attr('y2', this.height() ? this.height() : innerSize.height)
    .attr('stroke', baseColor);
  overlay.attr('width', this.width() ? this.width() : innerSize.width)
    .attr('height', this.height() ? this.height() : innerSize.height);
  _domain$4.call(this);
  _event$1.call(this, selection);
  this.__execs__.tooltip = selection;
}

function _show(selection, tick) {
  const showTrans = d3.transition().duration(140);
  const target = this.target();
  const filtered = [];
  if (!target.point()) { //remove existing points
    target.__execs__.canvas.selectAll(this.nodeName()).selectAll('circle').transition(showTrans).attr('opacity', 0);
  } else {
    target.__execs__.canvas.selectAll(this.nodeName()).selectAll('circle').transition(showTrans).style('fill', pointOriginColor);
  }
  let points = d3.selectAll(tick.points)
    .each(function(d) {
      let x = d.x;
      if (x === tick.x) {
        filtered.push({key:d.key, x:d.x, y: d.y, text: d.text});
      }
    });
  points.classed(className('show'), true).selectAll('circle').transition(showTrans)
    .attr('opacity', 1)
    .style('fill', function(d){
      return d.color;
    });
  
  let baseline = selection.select(className('baseline', true));
  baseline.transition(showTrans).attr('opacity', 1)
    .attr('x1', tick.x + 0.5).attr('x2', tick.x + 0.5);  
  let tooltip = this.tooltip();
  let x, y= [];
  let values = [];
  d3.selectAll(tick.points).each(function(d) {
    let pos = tooltip.__execs__.mark.get(this);
    x = pos.x;
    y.push(pos.y);
    values.push(d);
  });
  _sortByValue(values, this.sortByValue());
  values = values.map(d => {return {name: d.parent.data.key || d.data.key, value: d.text}});
  
  if (this.keyFormat()) {
    const f = this.keyFormat();
    values.forEach(d => {
      if (d.name instanceof Date || typeof d.name === 'number') d.name = f(d.name);
    });
  }
  y = d3.mean(y);
  y = Math.round(y);
  if (x && y) {
    let keyValue = tick.value;
    if (this.keyFormat() && (keyValue instanceof Date || typeof keyValue === 'number') ) keyValue = this.keyFormat()(keyValue);
    tooltip.x(x).y(y)
    .key({name:'key', value:keyValue})
    .value(values)
    .show();
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

function tick(tick) { //react to external dispatches
  const selection = this.__execs__.tooltip;
  const domain = this.__execs__.domain;
  if(tick !== undefined && tick !== null) {
    let find = domain.find(d => d.value == tick.value);
    _show.call(this, selection, {x: find ? find.x : tick.x, points: find ? find.points : null, value: find? find.value : null}); 
  } else { 
    _hide.call(this, selection);
  }
}

function _sortByValue(values, type = 'natural') {
  const types = ['natural', 'ascending', 'descending'];
  if (types.find(d => d === type)) {
    if (values.length > 0) {
      if (type === types[1]) {
        values.sort((a,b) => d3.ascending(a.value,b.value));
      } else if (type === types[2]) {
        values.sort((a,b) => d3.descending(a.value,b.value));
      }
    }
  }
}

MultiTooltip.prototype.hide = hide$2;
MultiTooltip.prototype.render = render$6;
MultiTooltip.prototype.tick = tick;

setMethodsFromAttrs(MultiTooltip, _attrs$18);

function _single(fromMulti = false) {
  const parent = this.parent();
  const field = this.__execs__.field;
  const mixed = this.isMixed();
  let key = (d, text) => {
    return {name: 'key', value:text};
  };
  let value = (d, text) => {
    let name;
    if (mixed) {
      name = d.key;
    } else if (parent && parent.isMixed()) {
      name = d.key;
    } else {
      name = field.y.field();
    }
    return {name, value:text}
  };
  return this.renderTooltip({dx: (this.size().range[0] + 4), value, key}, fromMulti);
}

function _multi() { //multi-tooltip 
  const canvas = this.__execs__.canvas;
  const field = this.__execs__.field;
  let multiTooltipG = canvas.select(className('multi-tooltip-g', true));
  if (multiTooltipG.empty()) multiTooltipG = canvas.append('g').attr('class', className('multi-tooltip-g'));
  let tooltipObj = _single.call(this, true);
  let multiTooltipObj = _multiTooltip()
    .target(this)
    .dx(this.size().range[0])
    .dy(this.size().range[0])
    .color(this.color()[0])
    .tooltip(tooltipObj)
    .sortByValue(this.multiTooltip().sortByValue)
    .keyFormat(field.x.format());
  
  multiTooltipObj.render(multiTooltipG.node());
  this.__execs__.tooltip = multiTooltipObj;

  const dispatch$$1 = this.__execs__.multiTooltipDispatch;
  multiTooltipObj.on('start', function(tick) { // dispatch events to commute with sub-charts
    dispatch$$1.call('selectStart', this, tick);
    dispatch$$1.call('multiTooltip', this, tick);
  }).on('move', function(tick) {
    dispatch$$1.call('selectMove', this, tick);
    dispatch$$1.call('multiTooltip', this, tick);
  }).on('end', function() {
    dispatch$$1.call('selectEnd', this);
    dispatch$$1.call('multiTooltip', this);
  });
  
  return multiTooltipObj;
}
function _tooltip$3() {
  if (!this.isFacet() && this.multiTooltip()) _multi.call(this);
  else if(this.tooltip() && !this.multiTooltip()) _single.call(this, false);
}

function normal() {
  const scaleX = this.__execs__.scale.x;
  if (!scaleX.invert) return;
  const canvas = this.__execs__.canvas;
  const zoomExtent = this.zoomExtent(this.isNested());
  const parent = this.parent();
  const zoomGen = d3.zoom()
    .scaleExtent(zoomExtent)
    .translateExtent([[0, 0], [(parent ? parent : this).width(), (parent ? parent : this).height()]]);
  canvas.call(zoomGen);   
  this.zoomGen(zoomGen)
    .zoomed(() => {
      _mark$2.call(this, true); //reset marks
      this.resetTooltip();
      _tooltip$3.call(this); //reset tooltips
    });
}

function _zoom() {
  if (this.stream()) {
    this.streamPanning(this.__execs__.scale.x);
  }
  if (!this.zoom()) return;
  if (this.zoom() === 'normal') normal.call(this);
}

const size$2 = {range: [2, 2], scale: 'linear', reverse: false};
const shapes = ['line', 'area'];
const conditions$1 = ['normal', 'count', 'mixed'];
const _attrs$12 = {
  meanLine : false,
  multiTooltip: false,
  padding: 0,
  pointRatio : 2,
  regionPadding: 0.1,
	shape: shapes[0],
	areaGradient: false,
  scaleBandMode : false,
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
 * @augments StreamMixin
 */
class Line extends mix(Facet).with(fitLineMixin, seriesMixin, brushMixin, zoomMixin, paddingMixin, shapeMixin, stackMixin, streamMixin) {
  constructor() {
    super();
    this.setAttrs(_attrs$12);
    this.__execs__.multiTooltipDispatch = d3.dispatch('selectStart', 'selectMove', 'selectEnd', 'multiTooltip');
    this.rebindOnMethod(this.__execs__.multiTooltipDispatch);
    this.process('munge', _munge$2, {isPre: true})
      .process('brushZoom', _brushZoom, {isPre: true, allow: function() {return this.isBrushZoom()}})
      .process('domain', _domain$2, {isPre: true, allow: function() {return !this.isBrushZoom()}})
      .process('range', _range$2, {isPre: true, allow: function() {return !this.isBrushZoom()}})
      .process('axis', _axis$3, {allow: function() {return !this.isBrushZoom()}})
      .process('region', _region$2, {allow: function() {return !this.isBrushZoom()}})
      .process('facet', _facet$2, {allow: function() {return !this.isBrushZoom() && this.isFacet()}})
      .process('mark', _mark$2, {allow: function() {return !this.isBrushZoom() && !this.isFacet()}})
      .process('meanLine', _meanLine, {allow: function() {return !this.isBrushZoom()}})
      .process('fitLine', _fitLine, {allow: function() {return !this.isBrushZoom()}})
      .process('tooltip', _tooltip$3, {allow: function() {return !this.isBrushZoom()}})
      .process('panning', _panning$1, {allow: function() {return !this.isBrushZoom()}})
      .process('zoom', _zoom, {allow: function() {return !this.isBrushZoom()}})
      .process('brush', _brush, {allow: function() {return !this.isBrushZoom()}})
      .process('legend', _legend$3, {allow: function() {return !this.isBrushZoom()}});
  }
  /**
   * @override
   */
  renderCanvas() {
		console.log('renderCanvas', this.__attrs__);
    return super.renderCanvas(this.point() ? this.size().range[0]*2 : 0);
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
  multiTooltip(multiTooltip) {
    if (!arguments.length) return this.__attrs__.multiTooltip;
    if (typeof multiTooltip === 'boolean') {
      if (multiTooltip) {
        multiTooltip = {sortByValue: 'natural'};
      } 
    } 
    if (typeof multiTooltip === 'object') {
      if (!multiTooltip.sortByValue) multiTooltip.sortByValue = 'natural';
    }
    this.__attrs__.multiTooltip = multiTooltip;
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
  leastSquare(key) {
    const measureName = this.measureName();
    const individualScale = this.isIndividualScale();
    return this.__execs__.munged.filter(series => {
      if (typeof key === 'string') {
        return series.data.key === key;
      } else {
        return true;
      }
    }).map(series => {
      let targets = series.children.map(d => {return {x: d.data.key, y:d.data.value[measureName]}});
      let ls = leastSquare(targets);
      if (individualScale && series.scale) {
        ls.scale = series.scale;
      }
      ls.key = series.data.key;
      return ls;
    });
  }

  measureName() {
    let measures = this.measures();
    let yField;
    if (this.condition() === conditions$1[2]) yField = mixedMeasure.field; 
    else if (this.aggregated() && measures[0].field === mixedMeasure.field) yField = measures[0].field;
    else yField = measures[0].field + '-' + measures[0].op;
    return yField;
  }

  isCount() {
    return this.condition() === conditions$1[1];
  }

  isFacet() {
    return this.facet() && this.isNested() && !this.stacked();
  }

  isIndividualScale() {
    return this.individualScale() && this.isNested() && !this.stacked();
  }

  isMixed() {
    return this.condition() == conditions$1[2] ;
  }

  isNested() {
    let dimensions = this.dimensions();
    let condition = this.condition();
    return dimensions.length === 2 || (condition == conditions$1[2] && dimensions.length === 1);
  }

  isStacked() {
    return this.stacked() && this.isNested();
  }

  muteFromLegend(legend) {
    this.muteRegions(legend.key);
  }
  
  muteToLegend(d) {
    this.muteLegend(d.parent.data.key);
  }
  
  demuteFromLegend(legend) {
    this.demuteRegions(legend.key);
  }
  
  demuteToLegend(d) {
    this.demuteLegend(d.parent.data.key);
  }
  
  showMultiTooltip(tick, start) { //for the facet condition
    if (this.multiTooltip()) {
      let mt = this.__execs__.tooltip;
      mt.tick(tick, start);
    }
  }
} 
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

/**
 * If areaGradient is specified sets the areaGradient setting and returns the Line instance itself. If areaGradient is true, when a line chart shape area, each area filled gradient.
 * @function
 * @example
 * line.areaGradient(true)
 * @param {boolean} [areaGradient=false] If is true, each area filled gradient.
 * @return {areaGradient|Line}
 */
Line.prototype.areaGradient = attrFunc('areaGradient');

function domainY$1(fieldY, munged, level=0, aggregated=false, stacked=false) {
  return fieldY.munged(munged).level(level).aggregated(aggregated).domain(0, stacked);
}
var line$2 = genFunc(Line);

function _axis$5() {
  let that = this;
  let scale = this.__execs__.scale;
  let grid = this.grid();
  let innerSize = this.innerSize();
  let field = this.__execs__.field;

  let _axisScaleX = function (axisToggle) {
    field.x.axis(axisToggle);
    let curAxis = that.axisDefault(scale.x, axisToggle);
    if (axisToggle.orient === 'bottom') curAxis.y(scale.y.range()[0]);
    curAxis.grid(grid).gridSize(innerSize.height);
    return curAxis;
  };

  let _axisScaleY = function (axisToggle) {
    field.y.axis(axisToggle);
    let curAxis = that.axisDefault(scale.y, axisToggle);
    if (axisToggle.orient === 'right') curAxis.x(scale.x.range()[1]);
    curAxis.grid(grid).gridSize(innerSize.width);
    return curAxis;
  };

  let xAt = this.axisX();
  let yAt = this.axisY();
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

function _domain$5() {
  const keep = this.keep();
  const scale = this.scale();
  const munged = this.__execs__.munged;
  const field = this.__execs__.field;
  const aggregated = this.aggregated();
  const viewInterval = this.viewInterval();

  let regionDomain, rDomain;
  
  if (this.isColor()) {
    regionDomain = field.region.munged(munged).domain();
    scale.color = this.updateColorScale(regionDomain, keep);
  }
  if (this.isFacet()) {
    scale.region = d3.scaleBand().domain(regionDomain).padding(this.regionPadding());
    return;
  }

  const data = aggregated ? this.data().children : this.data();
  let xDomain = d3.extent(data, d => (aggregated ? d.data : d)[field.x.field()]);
  let yDomain = d3.extent(data, d => (aggregated ? d.data : d)[field.y.field()]);
  if (!keep) {
    scale.x = continousScale(xDomain, undefined, field.x);
    scale.y = continousScale(yDomain, undefined, field.y);
  }

  if (this.isSized()) {
    rDomain = d3.extent(data, d => d[field.radius.field()]);
    scale.r = d3.scaleLinear().domain(rDomain);
  }
  if (!keep && viewInterval) {
    xDomain = this.limitViewInterval(scale.x, xDomain);
    scale.x.domain(xDomain);
  } else if (keep && this.stream()) {
    xDomain = this.limitViewInterval(scale.x, xDomain, true);
    scale.x.domain(xDomain);
  } else {
    this.setCustomDomain('x', xDomain);
  }

  this.setCustomDomain('y', yDomain);

  return this;
}

function _facet$4 () {
  const parent = this;
  const scale = this.__execs__.scale;
  const facet = this.facet();
  const canvas = this.__execs__.canvas;
  const innerSize = this.innerSize();
  const measures =  this.measures();
  let width, height;
  let settings = ['axisTitles', 'size', 'grid', 'font', 'label', 'tooltip']
    .map(d => { return {key: d, value:this[d]()};});
  let hasX = this.axisX();
  let hasY = this.axisY();
  let _small = function(d) {
    let small = scatter()
        .container(this)
        .data(d)
        .measures(measures)
        .width(width).height(height)
        .legend(false)
        .zeroMargin(true) 
        .aggregated(true) 
        .parent(parent) 
        .color(scale.color(d.data.key));
    settings.forEach(d => small[d.key](d.value));
    if (hasY) small.axis({target:'y', orient:'left'});
    if (hasX) small.axis({target:'x', orient:'bottom'});//, showTitle: i === arr.length-1});
    small.render();
  };
  if (facet.orient === 'horizontal') {
    width =  scale.region.bandwidth();
    height = innerSize.height;
  } else {
    width = innerSize.width;
    height = scale.region.bandwidth();
  }

  canvas.selectAll('.facet')
    .each(_small);
}

const fitLineColor$1 = '#c0ccda';
function _fitLine$1() {
  const canvas = this.__execs__.canvas;
  let fitLineG = canvas.select(className('fit-line-g', true));
  
  if (!this.fitLine()) {
    if (!fitLineG.empty()) canvas.select(className('fit-line-g', true)).remove();
    return;
  }
  const field = this.__execs__.field;
  const {slope, intercept} = leastSquare(this.data(), field.x.field(), field.y.field());
  const scale = this.scale();
  const trans = d3.transition().duration(this.transition().duration).delay(this.transition().delay);
  let xValues = scale.x.domain();
  let yValues = xValues.map(d => slope * d + intercept);
  
  if (fitLineG.empty()) {
    fitLineG = canvas.append('g').attr('class', className('fit-line-g'))
      .attr('clip-path', `url(#${canvas.selectAll(className('canvas-g-clip-path', true)).attr('id')}`);
    fitLineG.append('line')
      .attr('class', className('fit-line'))
      .style('fill', 'none').style('stroke', fitLineColor$1)
      .style('stroke-width', 1)
      .attr('x1', scale.x(xValues[0]))
      .attr('y1', scale.y.range()[0])
      .attr('x2', scale.x(xValues[1]))
      .attr('y2', scale.y.range()[0]);  
  }
  fitLineG.select('line')
    .transition(trans)
    .attr('x1', scale.x(xValues[0]))
    .attr('y1', scale.y(yValues[0]))
    .attr('x2', scale.x(xValues[1]))
    .attr('y2', scale.y(yValues[1]));
}

function _legend$5() { 
  let legendToggle = this.legend();
  if (!legendToggle) return;
  if (!this.isColor()) {
    return; 
  }
  this.renderLegend();
}

function _range$4() {
  const scale = this.scale();
  const facet = this.facet();
  const xAt = this.axisX();
  const yAt = this.axisY();

  if (this.isFacet()) {
    scale.region.padding(this.regionPadding());
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
    const innerSize = this.innerSize();
    if (facet.orient === 'vertical') {
      scale.region.rangeRound([0, innerSize.height]);
    } else {
      scale.region.rangeRound([0, innerSize.width]);
    }
    return;
  }
  
  if (this.isSized()) {
    scale.r.range(this.size().range);
  }

  this.thickness(yAt, scale.y, false, false);
  if(!this.stream()) this.thickness(xAt, scale.x, true, false);
  
  const innerSize = this.innerSize();
  scale.x.rangeRound([0, innerSize.width]);
  scale.y.rangeRound([innerSize.height, 0]); //reverse
}

function _mark$4(zoomed = false) {
  const that = this;
  const canvas = this.__execs__.canvas;
  const scale = this.__execs__.scale;
  const color = this.color();
  const size = this.size();
  const label = this.label();
  const trans = d3.transition().duration(this.transition().duration).delay(this.transition().delay); 
  const field = this.__execs__.field;
  const aggregated = this.aggregated();
  const nested = this.isColor();
  const stream = this.stream();
  
  const xValue = d => scale.x(d.data[field.x.field()]);
  const yValue = d => scale.y(d.data[field.y.field()]);
  const rValue = d => this.isSized() ? scale.r(d.data[field.radius.field()]) : size.range[0];
  const colorValue =  function() {
    let d = d3.select(this.parentNode).datum();
    return nested ? scale.color(d.data.key) : color[0];
  };
  let __local = function (selection) {
    selection.each(function(d) {
      d.x = xValue(d);
      if (stream) {
        const curX = d.data[field.x.field()];
        const dist = that.distDomain(scale.x);
          if (curX > scale.x._lastDomain[scale.x._lastDomain.length-1]) {
            d.x0 = d.x + dist;
          }
      }
      d.y = yValue(d);
      d.color = colorValue.call(this);
      d.r = rValue(d);
      d.text = labelFormat(d.x) + ', '+ labelFormat(d.y); 
    });
  };

  let __pointInit = function (selection) {
    selection.attr('r', 0)
      .attr('stroke', d => d.color)
      .attr('stroke-width', '1px')
      .attr('fill-opacity',  0.5)
      .style('cursor', 'pointer');
  };
  let __point = function (selection) {
    selection
      .transition(trans)
      .attr('r', d => d.r)
      .attr('stroke', d => d.color);
  };
  let __labelInit = function (selection) {
    selection.each(function(d) {
      let selection = d3.select(this);
      selection
        .style('pointer-events', 'none')
        .text(d.text);
      that.styleFont(selection);
    });
  };
  let __label = function(selection) {
    selection.each(function(d) {
      let selection = d3.select(this);
      selection.attr('text-anchor', d.anchor)
        .style('visibility', label ? 'visible' : 'hidden')
        .transition(trans)
        .attr('y', size.range[0])
        .text(d.text);
      that.styleFont(selection);
    });
  };

  let __appendPoints = function (selection) {
    let point = selection.selectAll(that.nodeName())
      .data(d => nested || aggregated ? d.children : d);
    point.exit().remove();
    let pointEnter = point.enter().append('g')
      .attr('class', that.nodeName(true) + ' point')
      .call(__local)
      .attr('transform', d => `translate(${[d.x0 || d.x, d.y]})`);
    pointEnter.append('circle')
      .call(__pointInit);
    pointEnter.append('text')
      .call(__labelInit);
    point = pointEnter.merge(point)
      .call(__local);
    
    point.selectAll('circle')
      .call(__point);
    point.selectAll('text')
      .call(__label);
    point.each(function(d) {
      let selection =  d3.select(this);
      if (!zoomed) selection = selection.transition(trans);
      selection.attr('transform', `translate(${[d.x, d.y]})`)
        .style('fill',  d.color);
    });
    that.__execs__.nodes = point;
  };

  canvas.selectAll(this.regionName())
    .call(__appendPoints);
}

function _munge$4() { 
  let conditionFunc = function (dimensions, measures) {
    const field = this.__execs__.field;
    if (measures.length < 2) throw new ConditionException();
    field.x = measureField(measures[0]);
    field.y = measureField(measures[1]);
    if (dimensions.length === 0 && measures.length === 2) return conditions$2[0];
    else if (dimensions.length === 1 && measures.length === 2) {
      field.region = dimensionField(dimensions[0]);
      return conditions$2[1];
    } else if (dimensions.length === 0 && measures.length === 3) {
      field.radius = measureField(measures[2]);
      return conditions$2[2];
    } else if (dimensions.length == 1 && measures.length === 3) {
      field.radius = measureField(measures[2]);
      field.region = dimensionField(dimensions[0]);
      return conditions$2[3];
    }
    else throw new ConditionException();
  };
  this.condition(conditionFunc);
  this.limitRows();
  if (this.aggregated()) {
    this.__execs__.munged = [this.data()];
  } else if (this.isColor()) {
    this.__execs__.munged = this.aggregate(false, false)
    .map(d => {
      d.key = d.data.key;
      return d;
    });
  } else {
    this.__execs__.munged = [this.data().map(d => {return {data:d}})];
  }
}

function _panning$3() {
  if (this.stream()) {
    this.streamPanning(this.__execs__.scale.x);
  }
}

function _region$4() {
  const aggregated = this.aggregated();
  const scale = this.__execs__.scale;
  const isFacet = this.isFacet();
  const facet = this.facet();
  this.renderRegion(d => {
    if (aggregated) return;
    let xy = [isFacet ? scale.region(d.key) : 0, 0];
    if (facet.orient === 'vertical') xy.reverse();
    d.x = xy[0]; d.y = xy[1];
  }, d => d, isFacet);
}

function _tooltip$5() {
  if(!this.tooltip() || this.isFacet()) return;

  const measures = this.measures();
  let value = function(d) {
    return measures.map(m => {
      return {name:m.field, value: m.format ? m.format(d.data[m.field]) : d.data[m.field]}
    })
  };
  this.renderTooltip({dx: this.size().range[0] + 4, value, key:null});
}

function _brushZoom$2() {

  const canvas = this.__execs__.canvas;
  const field = this.__execs__.field;
  const innerSize = this.innerSize();
  const scale = this.__execs__.scale;
  const axis = this.__execs__.axis;
  const axisX = axis && axis.x ? axis.x[field.x.field()] : null;
  const axisY = axis && axis.y ? axis.y[field.y.field()] : null;

  const brushGen = d3.brush().extent([[0,0], [innerSize.width, innerSize.height]]);
  let brushG = canvas.selectAll('.brush.x')
    .data([innerSize]);
  brushG.exit().remove();
  brushG = brushG.enter().append('g')
    .attr('class', 'brush x')
    .merge(brushG)
    .attr('transform', 'translate(' + [0, 0] +')')
    .call(brushGen);
  this.brushGen(brushGen);
  const zoomExtent = this.zoomExtent(this.isColor(), true);
  const zoomGen = d3.zoom()
    .scaleExtent(zoomExtent)
    .translateExtent([[0, 0], [this.width(), this.height()]]);
  canvas.call(zoomGen); 
  this.zoomGen(zoomGen);
  const xDomainOrigin = scale.x.domain();
  const yDomainOrigin = scale.y.domain();
  let idleTimeout;
  brushGen.on('end.scatter', () => {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'end') return;
    let selection = d3.event.selection;
    if (!selection) { //init
      if (!idleTimeout) return idleTimeout = setTimeout(()=> {idleTimeout=null;}, 300);
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
    _mark$4.call(this);
    this.brushMove(brushG, null);    
  });
}

function normal$1() {
  const zoomExtent = this.zoomExtent(this.isColor(), true);
  const zoomGen = d3.zoom()
    .scaleExtent(zoomExtent)
    .translateExtent([[0, 0], [this.width(), this.height()]]);
  this.__execs__.canvas.call(zoomGen); 

  this.zoomGen(zoomGen).zoomed(() => {
    _mark$4.call(this, true); //re-render mark
    this.resetTooltip();
    _tooltip$5.call(this); //re-render tooltip
  }, true);
}

function _zoom$2() {
  if (!this.zoom()) return;
  if (this.zoom() === 'normal') normal$1.call(this);
  else if (this.zoom() === 'brush') _brushZoom$2.call(this);
}

const size$3 = {range: [3, 12], scale: 'linear', reverse: false};
const conditions$2 = ['normal', 'color', 'bubble', 'mixed'];
const _attrs$19 = {
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
 * @augments StreamMixin
 */
class Scatter extends mix(Facet).with(fitLineMixin, brushMixin, zoomMixin, paddingMixin, streamMixin) {
  constructor() {
    super();
    this.setAttrs(_attrs$19);
    this.process('munge', _munge$4, {isPre: true})
      .process('domain', _domain$5, {isPre: true})
      .process('range', _range$4, {isPre: true})
      .process('axis', _axis$5)
      .process('fitLine', _fitLine$1)
      .process('region', _region$4)
      .process('facet', _facet$4, {allow: function() {return this.isFacet();}})
      .process('mark', _mark$4, {allow: function() {return !this.isFacet();}})
      .process('legend', _legend$5)
      .process('tooltip', _tooltip$5)
      .process('panning', _panning$3)
      .process('zoom', _zoom$2);
  }

  /**
   * @override
   */
  renderCanvas() {
    return super.renderCanvas(this.size().range[this.isSized() ? 1 : 0]*1.25)
  }

  isColor() {
    return this.condition() === conditions$2[1] || this.condition() === conditions$2[3];
  }
  
  isSized() {
    return this.condition() === conditions$2[2] || this.condition() === conditions$2[3];
  }
  
  isFacet() {
    return this.facet() && this.isColor();
  }
  
  muteFromLegend(legion) {
    this.muteRegions(legion.key);
  }
  
  
  demuteFromLegend(legion) {
    this.demuteRegions(legion.key);
  }
  
  muteToLegend(d) {
    this.muteLegend(d.parent.data.key);
  }
  
  demuteToLegend(d) {
    this.demuteLegend(d.parent.data.key);
  }
  
  
}

var scatter = genFunc(Scatter);

function _munge$6() {
  let conditionFunc = function (dimensions, measures) {
    const field = this.__execs__.field;
    if (dimensions.length !== 2) throw new ConditionException();
    let d0 = dimensionField(dimensions[0]);
    let d1 = dimensionField(dimensions[1]);
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
      if (measures.length === 0) return conditions$3[1];
      else if (measures.length === 1) return conditions$3[0];
    } else throw new ConditionException();
  };
  this.condition(conditionFunc); 
  this.__execs__.munged = this.aggregate(this.reverse(), true);
  this.limitKeys();
}

function _domain$7() {
  const scale = this.scale();
  const munged = this.__execs__.munged;
  const field = this.__execs__.field;
  
  const xDomain = field.x.munged(munged).level(0).domain(this.sortByValue());
  const yDomain = field.y.munged(munged).level(1).domain(this.sortByValue());
  const colorDomain = field.color.munged(munged).level(1).domain();

  scale.x = d3.scaleBand().domain(xDomain);
  scale.y = d3.scaleBand().domain(yDomain);
  scale.color = d3.scaleLinear();
  if (zeroPoint(colorDomain)) {
    scale.color.domain([colorDomain[0], 0, colorDomain[colorDomain.length-1]]);
  } else {
    scale.color.domain(colorDomain);
  }
  return this;
}

function _range$6() {
  const scale = this.scale();
  const field = this.__execs__.field;
  const xAt = this.axisX();
  const yAt = this.axisY();

  field.x.axis(xAt);
  field.y.axis(yAt);
  this.thickness(yAt, scale.y, false, true);
  this.thickness(xAt, scale.x, true, true);

  const innerSize = this.innerSize();  
  scale.x.rangeRound([0, innerSize.width]).padding(this.padding());
  scale.y.rangeRound([0, innerSize.height]).padding(this.padding());

  scale.color.range(this.color());
  return this;
}

function _mark$6() {
  const that = this;
  const canvas = this.__execs__.canvas;
  const scale = this.__execs__.scale;
  const label = this.label();
  const trans = d3.transition().duration(this.transition().duration).delay(this.transition().delay); 
  const yValue = d => scale.y(d.data.key);
  const colorValue =  d => scale.color(d.value);
  const textValue = d => labelFormat(d.value);
  let __local = function (selection) {
    let width = scale.x.bandwidth();
    let height = scale.y.bandwidth();
    selection.each(function(d) {    
      d.x = 0;  
      d.y = yValue(d);
      d.value = d.value;
      d.color = colorValue(d);
      d.text = textValue(d);
      d.w = width;
      d.h = height;
    });
  };

  let __pointInit = function (selection) {
    selection.attr('width', d => d.w)
      .attr('height', d => d.h)
      .style('stroke', 'none')
      .style('fill', d => d.color)
      .style('cursor', 'pointer');
  };
  let __point = function (selection) {
    selection.transition(trans)
      .attr('width', d => d.w)
      .attr('height', d => d.h)
      .style('fill', d => d.color);
  };
  let __labelInit = function (selection) {
    selection.each(function(d) {
      let selection = d3.select(this);
      selection
        .attr('x', 0)
        .attr('y', 0)
        .attr('dx', '0.29em')
        .attr('dy', '1em')
        .style('pointer-events', 'none')
        .style('fill', '#111')
        .text(d.text);
      that.styleFont(selection);
    });
  };
  let __label = function(selection) {
    selection.each(function(d) {
      let selection = d3.select(this);
      selection.attr('text-anchor', d.anchor)
        .style('visibility', label ? 'visible' : 'hidden')
        .transition(trans)
        .text(d.text);
      that.styleFont(selection);
    });
  };

  let __appendPoints = function (selection) {
    let point = selection.selectAll(that.nodeName())
      .data(d => d.children, d => d.data.key);
    point.exit().remove();
    let pointEnter = point.enter().append('g')
      .attr('class', that.nodeName(true) + ' point')
      .call(__local);
    pointEnter.append('rect')
      .call(__pointInit);
    pointEnter.append('text')
      .call(__labelInit);
    point = pointEnter.merge(point)
      .call(__local);
    point.selectAll('rect')
      .call(__point);
    point.selectAll('text')
      .call(__label);
    point.attr('transform', d => 'translate(' + [d.x, d.y] +')')
        .style('fill', d => d.color);
    that.__execs__.nodes = point;
  };
  
  let region = canvas.selectAll(this.regionName());
  region.call(__appendPoints);
}

function _axis$7() {
  let that = this;
  let scale = this.__execs__.scale;
  let field = this.__execs__.field;

  let _axisScaleX = function (axisToggle) {
    field.x.axis(axisToggle);
    let curAxis = that.axisDefault(scale.x, axisToggle);
    if (axisToggle.orient === 'bottom') curAxis.y(scale.y.range()[1]);
    
    return curAxis;
  };

  let _axisScaleY = function (axisToggle) {
    field.y.axis(axisToggle);
    let curAxis = that.axisDefault(scale.y, axisToggle);
    if (axisToggle.orient === 'right') curAxis.x(scale.x.range()[1]);
    return curAxis;
  };

  let xAt = this.axisX();
  let yAt = this.axisY();
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
  const scale = this.__execs__.scale;
  let __regionLocal = d => {
      d.x = scale.x(d.data.key); 
      d.y = 0;
  };

  this.renderRegion(__regionLocal);
}

function _tooltip$7() {
  if(!this.tooltip()) return;
  const field = this.__execs__.field;
  
  let value = function(d, text) {
    return {name: field.color.field(), value: text};
  };
  let offset = function(d) {
    return {x:d.w, y:0};
  };
  this.renderTooltip({offset, value, color: '#111'});
}

const conditions$3 = ['normal', 'count'];
const _attrs$20 = {
  color: continousColorScheme,
  padding: 0.05,
  reverse: false
};

/**
 * @class XYHeatmap
 * @augments RectLinear
 * @augments PaddingMixin
 */
class XYHeatmap extends mix(RectLinear).with(paddingMixin, sortMixin) {
  constructor() {
    super();
    this.setAttrs(_attrs$20);
    this.process('munge', _munge$6, {isPre:true})
      .process('domain', _domain$7, {isPre: true})
      .process('range', _range$6, {isPre: true})
      .process('region', _region$6)
      .process('axis', _axis$7)
      .process('mark', _mark$6)
      .process('spectrum', _legend$7)
      .process('tooltip', _tooltip$7);
  }

  isCount() {
    return this.condition() === conditions$3[1];
  }
}

XYHeatmap.prototype.reverse = attrFunc('reverse');

var xyHeatmap = genFunc(XYHeatmap);

function _munge$8() {
  let conditionFunc = function (dimensions, measures) {
    const field = this.__execs__.field;
    if (dimensions.length === 0) throw new ConditionException();
    if (this.shape() === 'word' && dimensions.length > 1) throw new ConditionException();
    field.root = dimensionField(dimensions[0]);
    field.leaf = dimensionField(dimensions[dimensions.length-1]);
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
  let root = d3.hierarchy({key:'root', values:this.__execs__.munged}, d => d.values)
    .sum(d => {
      return d.value ? d.value[this.measureName()] : 0;
    });

  if (this.sortByValue() === 'ascending') {
    root.sort(function(a, b) { return a.value - b.value; });
  } else if (this.sortByValue() === 'descending') {
    root.sort(function(a, b) { return b.value - a.value; });
  }
  let size = this.size() ? this.size().range : this.innerSize(true);
  if (this.shape() === 'pack') {
    let packGen = d3.pack().size(size);
    root = packGen(root);
  } else {
    let treemapGen = d3.treemap().size(size)
      .paddingTop(this.font()['font-size'] + 4);
    root = treemapGen(root);
  }
  this.__execs__.munged = root;
}

function _domain$9() {
  const scale = this.scale();
  const munged = this.__execs__.munged;
  let colorDomain = d3.extent(munged.leaves(), d => d.value);
  scale.color = d3.scaleLinear();

  if (zeroPoint(colorDomain)) {
    scale.color.domain([colorDomain[0], 0, colorDomain[colorDomain.length-1]]);
  } else {
    scale.color.domain(colorDomain);
  }
  return this;
}

function _range$8() {
  const scale = this.scale();
  scale.color.range(this.color());
  return this;
}

const stemColor = '#eee';
function _mark$8() {
  const clipIdPrefix = 'treemap-node-clip-path-';
  const that = this;
  const mark = this.__execs__.mark;
  const scale = this.__execs__.scale;
  const label = this.label();
  const trans = d3.transition().duration(this.transition().duration).delay(this.transition().delay); 
  const size = this.size();
  const shape = this.shape();
  const innerSize = this.innerSize();
  const nodeType = shape === 'pack' ? 'circle' : 'rect';
  let nodeAttr = function(selection) {
    if(nodeType === 'rect') {
      selection.attr('width', d => d.w)
        .attr('height', d => d.h);
    } else {
      selection.attr('r', d => d.r);
    }
  };
  let nameAttr = function(selection) {
      if(shape === 'treemap') {
        selection.attr('dx', '0.29em')
          .attr('dy', '1em');
      } else if (shape === 'word'){
        let result = selection.datum();
        let vertical = result.w < result.h;
        selection.attr('dy', vertical ? '-.35em' : '.8em')
          .attr('textLength', vertical? result.h : result.w)
          .attr('lengthAdjust', 'spacingAndGlyphs')
          .attr('transform', vertical ? 'rotate(90)' : '')
          .style('font-size', (vertical ? result.w : result.h) -1 + 'px')
          .style('fill', result.color)
          .style('pointer-events', 'all')
          .style('cursor', 'pointer');
      } else {
        let result = selection.datum();
        selection.attr('visibility', result.children ? 'hidden' : 'visible')
          .attr('text-anchor', 'middle')
          .attr('dy', '.35em');
      }
  };
  let colorValue =  d => d.children ? stemColor : scale.color(d.value);
  let textValue = d => labelFormat(d.value);
  let __local = function (selection) {
    let dx = 0;
    let dy = 0;
    if (size || shape === 'pack') {
      dx = (innerSize.width - size.range[0])/2;
      dy = (innerSize.height - size.range[1])/2;
    }
    selection.each(function(d) {
      d.color = colorValue(d);
      d.text = textValue(d);
      if (shape !== 'pack') {
        d.x = d.x0 + dx;
        d.y = d.y0 + dy;
        d.w = d.x1 - d.x0;
        d.h = d.y1 - d.y0;
      } else {
        d.x += dx/2;
        d.y += dy/2;
      }
    });
  };
  let __clipInit = function (selection) {
    selection.each(function(d) {
       d3.select(this)
        .attr('id', getUniqueId(clipIdPrefix))
        .append(nodeType)
        .call(nodeAttr, d);
      });
  };
  let __clip = function (selection) {
    selection.each(function(d) {
      d3.select(this).select(nodeType)
        .transition(trans)
        .call(nodeAttr, d);
    });
  };
  let __nodeInit = function (selection) {
    selection.style('visibility', shape === 'word' ? 'hidden' : 'visible')
      .style('stroke', 'none')
      .style('fill', d => d.color)
      .style('cursor', 'pointer')
      .call(nodeAttr);
  };
  let __node = function (selection) {
    selection
        .style('visibility', shape === 'word' ? 'hidden' : 'visible')
        .transition(trans)
        .style('fill', d => d.color)
        .style('stroke', d => d.children ? '#ddd' : 'none')
        .call(nodeAttr);
  };
  let __nameInit = function (selection) {
    selection.each(function() {
      let result = mark.get(this);
      let selection = d3.select(this);
     selection
        .attr('x', 0)
        .attr('y', 0)
        .style('pointer-events', 'none')
        .style('fill', '#000')
        .text(d => d.data.key);
      that.styleFont(selection);
      selection.call(nameAttr, result);
      
      selection.style('font-weight', 'bold');
    });
  };
  let __name = function (selection) {
    selection.each(function() {
      let selection = d3.select(this);
      selection.text(d => d.data.key);
      that.styleFont(selection);
      selection.style('font-weight', 'bold');
      selection.call(nameAttr, mark.get(this));
    });
  };
  let __labelInit = function (selection) {
    selection.each(function(d) {
      let selection = d3.select(this);
      let label = selection
        .attr('x', 0)
        .attr('y', 0)
        .style('pointer-events', 'none')
        .style('fill', '#111')
        .text(d.text);
      if(nodeType === 'rect') {
        label.attr('dx', '0.29em')
          .attr('dy', '2em');
      } else {
        label.attr('visibility', d.children ? 'hidden' : 'visible')
          .attr('text-anchor', 'middle')
          .attr('dy', '1.35em');
      }
      that.styleFont(selection);
    });
  };
  let __label = function(selection) {
    selection.each(function(d) {
      let selection = d3.select(this);
      selection
        .style('visibility', label && shape !== 'word' ? 'visible' : 'hidden')
        .transition(trans)
        .text(d.text);
      that.styleFont(selection);
    });
  };

  let __appendNodes = function (selection) {
    let node = selection.selectAll(that.nodeName())
      .data(d => d.descendants().slice(1), d => d.data.key); //exclude the root
    node.exit().remove();
    let nodeEnter = node.enter().append('g')
      .attr('class', d => that.nodeName(true) + ' ' + className(d.children ? 'stem' : 'leaf' ))
      .call(__local);
    
    nodeEnter.append('defs')
      .append('clipPath')
      .call(__clipInit);
    nodeEnter.append(nodeType)
      .attr('class', 'shape')
      .call(__nodeInit);
    nodeEnter.append('text')
      .attr('class', 'name')
      .call(__nameInit);
    nodeEnter.filter(d => !d.children).append('text')
      .attr('class', 'label')
      .call(__labelInit);
    nodeEnter.attr('clip-path', function() {
      return 'url(#' + d3.select(this).select('clipPath').attr('id') + ')';
    });
    
    node = nodeEnter.merge(node)
      .call(__local);
    node.select('defs')
      .select('clipPath')
      .call(__clip);
    node.selectAll('.shape')
      .call(__node);
    node.selectAll('.name')
      .call(__name);
    node.selectAll('.label')
      .call(__label);
    
    node.attr('transform', function(d) {
      return 'translate(' + [d.x, d.y] + ')';
    });
    that.__execs__.nodes = node;
  };
  
  this.renderRegion( d => {
    d.x = 0; d.y=0;
  }, d => [d]).call(__appendNodes);
}

function _legend$8() { 
  this.renderSpectrum();
}

function _tooltip$9() {
  if(!this.tooltip()) return;
  const field = this.__execs__.field;
  const count = this.isCount();
  const shape = this.shape();
  let key = d => {
    return {name: 'key', value: d.data.key};
  };
  let value = (d, text) => {
    let name;
     if (count) {
      name = countMeasureTitle;
    } else {
      name = field.color.field();
    }
    return {name, value:text}
  };
  let offset = d => {
    return {x: (shape === 'pack') ? d.r : d.w, y:0}
  };
  this.renderTooltip({offset, value, key, color: '#111'}, false, true);
}

const shapes$1 = ['treemap', 'pack', 'word'];
const conditions$4 = ['normal', 'count'];
const _attrs$21 = {
  autoResizeSkip: ['domain'], //treemap needs to re-munge beacuase of using .treemap method
  color: continousColorScheme,
  reverse: false,
  shape: shapes$1[0],
  size : null,
  sortByValue: 'natural'
};

/**
 * @class Treemap
 * @augments Default
 * @augments ShapeMixin
 * @augments SortMixin
 */
class Treemap extends mix(Core).with(shapeMixin, sortMixin) {
  constructor() {
    super();
    this.setAttrs(_attrs$21);
    this.process('munge', _munge$8, {isPre:true})
      .process('domain', _domain$9, {isPre: true})
      .process('range', _range$8, {isPre: true})
      .process('mark', _mark$8)
      .process('spectrum', _legend$8)
      .process('tooltip', _tooltip$9);
  }
  axis() {
    if(!arguments.length) return [];
    return this;
  }
  
  isCount() {
    return this.condition() === conditions$4[1];
  }
}

Treemap.prototype.reverse = attrFunc('reverse');

var treemap$1 = genFunc(Treemap);

function _series(target, measures, isColor = false) {
  return target.map(d => measures.map(m => {
   return {data: {x:m.field, y: (isColor ? d.data: d)[m.field]}}
  }));
}
function _munge$10() {
  let conditionFunc = function (dimensions, measures) {
    const field = this.__execs__.field;
    if (measures.length < 2) throw new ConditionException();
    field.x = dimensionField(this.mixedDimension());
    measures.forEach(m => {
      field[yMeasureName(m)] = measureField(m);
      if(this.shape() === shapes$2[1]) field[xMeasureName(m)] = measureField(m);
    });
    if (dimensions.length === 0 ) return conditions$5[0];
    else if (dimensions.length === 1 ) {
      field.region = dimensionField(dimensions[0]);
      return conditions$5[1];
    } 
    else throw new ConditionException();
  };
  this.condition(conditionFunc); 
  
  let result;
  let measures = this.measures();
  
  this.limitRows();

  if (this.shape() === shapes$2[0]) {
    if (this.isColor()) { //nest
      result = this.aggregate(false, false);
      result.forEach(d => { //series structure
        d.key = d.data.key;
        d.children = _series(d.children, measures, true);
      });
    } else {
      result = [{parent: null, children: _series(this.data(), measures)}];
    }
  } else {
    result = [];
    measures.forEach(x => {
      measures.forEach(y => {
        result.push({xField:x,yField:y,children:this.data()});
      });
    });
  }
  
  this.__execs__.munged = result;
}

function ordinalDomainFlatten (target, dimensionField) {
  let domain = [];
  target.forEach(d => { 
    d = d[dimensionField.field()];
    if (dimensionField.interval()) { //using interval
      d = interval[dimensionField.interval()](d);
    } 
    if (d instanceof Date && domain.findIndex(m => (m - d) === 0) < 0) domain.push(d);
    else if(!domain.includes(d)) domain.push(d);
  });
  domain.sort(comparator(dimensionField.order()));
  return domain;
}

function parCoords$1(keep) {
  this.axis('x', false);
  const scale = this.scale();
  const measures = this.measures();
  const munged = this.__execs__.munged;
  const field = this.__execs__.field;
  if (this.isColor()) {
    let colorDomain = field.region.munged(munged).domain(); 
    scale.color = this.updateColorScale(colorDomain, keep);
  }
  scale.x = d3.scalePoint().domain(measures.map(d => d.field));
  measures.forEach(m => {
    let domain = d3.extent(this.data(), d => d[m.field]);
    let scaleName = yMeasureName(m);
    scale[scaleName] = continousScale(domain, null, field[scaleName]);
    this.setCustomDomain(scaleName, domain);
  });
  return this;
}

function matrix(keep) {
  const scale = this.scale();
  const measures = this.measures();
  const field = this.__execs__.field;
  if (this.isColor()) {
    let colorDomain = ordinalDomainFlatten(this.data(), field.region);
    scale.color = this.updateColorScale(colorDomain, keep);
  }
  scale.region = d3.scaleBand().domain(measures.map(d=> d.field));
  measures.forEach(m => {
    let domain = d3.extent(this.data(), d => d[m.field]);
    let yScaleName = yMeasureName(m);
    scale[yScaleName] = continousScale(domain);
    this.setCustomDomain(yScaleName, domain);
    let xScaleName = xMeasureName(m);
    scale[xScaleName] = continousScale(domain);
    this.setCustomDomain(xScaleName, domain);
  });
}

function _domain$11(keep) {
  if (this.isParcoords()) parCoords$1.call(this, keep);
  else matrix.call(this, keep);
}

function parCoords$2() {
  const scale = this.scale();
  const innerSize = this.innerSize();
  const measures = this.measures();
  scale.x.rangeRound([0,innerSize.width]);
  measures.forEach(m => {
    let scaleName = yMeasureName(m);
    scale[scaleName].rangeRound([innerSize.height, 0]);
  });
}

function matrix$1() {
  const scale = this.scale();
  const innerSize = this.innerSize();
  const measures = this.measures();
  let regionWidth = Math.min(innerSize.width, innerSize.height);
  scale.region.rangeRound([0, regionWidth]).padding(this.regionPadding());
  measures.forEach(m => {
    let yScaleName = yMeasureName(m);
    scale[yScaleName].rangeRound([scale.region.bandwidth(), 0]);
    let xScaleName = xMeasureName(m);
    scale[xScaleName].rangeRound([0, scale.region.bandwidth()]);
  });
}


function _range$10(keep) {
  if (this.isParcoords()) parCoords$2.call(this, keep);
  else matrix$1.call(this, keep);
}

function _mark$10() {
  const that = this;
  const canvas = this.__execs__.canvas;
  const scale = this.__execs__.scale;
  const size = this.size();
  const innserSize = this.innerSize();
  const trans = d3.transition().duration(this.transition().duration).delay(this.transition().delay);
  const lineGenInit = d3.line().x(d => scale.x(d.data.x)).y(innserSize.height);
  const lineGen = d3.line().x(d => scale.x(d.data.x))
    .y(d => scale[yMeasureName(d.data.x)](d.data.y));
  
  let __seriesInit = function(selection) {
    selection.attr('d', lineGenInit)
      .attr('fill', 'none')
      .attr('stroke-width', size.range[0]);
  };

  let __series = function(selection) {
    selection.transition(trans)
      .attr('d', lineGen)
      .attr('stroke-width', size.range[0]);
  };  

  let __appendSeries = function (selection) {
    let series = selection.selectAll(that.seriesName())
      .data(d => d.children, (d,i) => d.key ? d.key : i);
    
    series = series.enter().append('g')
      .attr('class', that.seriesName(true))
      .merge(series);
    
    let path = series.selectAll('path' + className('line', true))
      .data(d => [d]);
    
    path.enter().append('path')
      .attr('class', className('line'))
      .call(__seriesInit)
      .merge(path)
      .call(__series);
  };

  let region = canvas.selectAll(this.regionName());
  region.call(__appendSeries);
}

function _parCoords() {
  let that = this;
  let measures = this.measures();
  let scale = this.__execs__.scale;

  let _axisScaleY = function (yScale, axisToggle) {
    let curAxis = that.axisDefault(yScale, axisToggle);
    if (axisToggle.orient === 'right') curAxis.x(scale.x.range()[1]);
    curAxis.x(scale.x(axisToggle.field));
    return curAxis;
  };

  let yAt = this.axisY();
  if (yAt) {
    measures.forEach(m => {
      let name = yMeasureName(m);
      let yScale = scale[name];
      let at = {target: yAt.target, field: m.field, orient: yAt.orient, showDomain: true, titleOrient: 'bottom', showTitle: true};
      _axisScaleY(yScale, at);
    });
  }
}


function _axis$9() {
  if (this.shape() === shapes$2[0]) {
    _parCoords.call(this);
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
  const isColor = this.isColor();
  const color = this.color();
  const shape = this.shape();
  const scale = this.__execs__.scale;

  let __regionLocal = d => {
    if (shape === shapes$2[0]) {
      d.x = 0; d.y = 0;
      d.color = isColor ? scale.color(d.data.key) : color[0];
    } else {
      d.x = scale.region(d.xField.field);
      d.y = scale.region.range()[1] - scale.region(d.yField.field) - scale.region.bandwidth();
    }
  };

  this.renderRegion(__regionLocal, d => d, shape === shapes$2[1], (shape === shapes$2[1] ? '.matrix': '' ))
    .style('stroke', d => d.color);
}

function _facet$6 () {
  let parent = this;
  let scale = this.__execs__.scale;
  let canvas = this.__execs__.canvas;
  let measures = this.measures();
  let dimensions = this.dimensions();
  let width = scale.region.bandwidth();
  let settings = ['axisTitles','color', 'size', 'grid', 'font', 'label']
    .map(d => { return {key: d, value:this[d]()};});

  let _small = function(d,i) {
    let small = scatter()
        .container(this)
        .data(d.children)
        .dimensions(dimensions).measures([d.xField, d.yField])
        .width(width).height(width)
        .legend(false)
        .tooltip(false)
        .parent(parent) 
        .zeroOffset(true)
        .noAxisOffset(true); 

    let showX = (i % measures.length === 0);
    let showY = i < measures.length;
    settings.forEach(d => small[d.key](d.value));
    small.axis({target:'y', orient:'left', showTitle: showY, showTicks: showY});
    small.axis({target:'x', orient:'bottom', showTitle: showX, showTicks: showX});
    small.render();
  };
 
  canvas.selectAll('.facet')
    .each(_small);
}

function _parcoords() {
  const canvas = this.__execs__.canvas;
  const scale = this.__execs__.scale;
  const innerSize = this.innerSize();
  const measures = this.measures();
  const conditions = {};
  const brushW = this.font()['font-size'];
  const brushGen = d3.brushY().extent([[-brushW,0], [brushW, innerSize.height]]);
  const series = canvas.selectAll(this.seriesName());
  let hide = function() {
    series.attr('opacity', '1')
      .filter(d => {
        for (let k in conditions) { //hide excluded
          let domain = conditions[k];
          let target = d.filter(dd => dd.data.x === k)[0];
          let result = (target.data.y < domain[1]  || target.data.y > domain[0]);
          if (result) return true;
        }
        return false;
      }).attr('opacity', 0.1);
  };
  let brushG = canvas.selectAll('.brush.y')
    .data(measures, d => d.field);
  brushG.exit().remove();
  brushG.enter().append('g')
    .attr('class', 'brush y')
    .merge(brushG)
    .attr('transform', d => 'translate(' + [scale.x(d.field), 0] +')')
    .call(brushGen);
  brushGen.on('brush.parCoords', function(d) {
    conditions[d.field] = d3.event.selection.map(scale[yMeasureName(d.field)].invert);
    hide();
  }).on('end.parCoords', function(d) {
    if(d3.event.selection === null) {
      delete conditions[d.field];
      hide();
    }
  });

  this.brushGen(brushGen);
}

function _matrix () {
  const canvas = this.__execs__.canvas;
  const scale = this.__execs__.scale;
  const brushW = scale.region.bandwidth();
  const brushGen = d3.brush().extent([[0,0], [brushW, brushW]]);  
  const nodes = canvas.selectAll(this.nodeName());
  let brushCell;
  let brushG = canvas.selectAll('.brush.matrix')
    .data(d => d);
  brushG.exit().remove();
  brushG.enter().append('g')
    .attr('class', 'brush matrix')
    .merge(brushG)
    .attr('transform', d => 'translate(' + [scale.region(d.xField.field), scale.region.range()[1] - scale.region(d.yField.field) - scale.region.bandwidth()] + ')')
    .call(brushGen);
  
  brushGen.on('start.matrix', function() {
    if(brushCell !== this) {
      d3.select(brushCell).call(brushGen.move, null);
      brushCell = this;
    }
  }).on('brush.matrix', function(d) {
     if(d3.event.selection === null) return;
     const xName = d.xField.field;
     const yName = d.yField.field;
     const scaleX = scale[xMeasureName(xName)];
     const scaleY = scale[yMeasureName(yName)];
     const domain = d3.event.selection.map(d => [scaleX.invert(d[0]), scaleY.invert(d[1])]);
     nodes.attr('opacity', 1).filter(function(d) {
       d = d.data;
       return d[xName] < domain[0][0] || d[xName] > domain[1][0] || d[yName] > domain[0][1] || d[yName] < domain[1][1];
     }).attr('opacity', 0.1);
  }).on('end.matrix', function() {
    if(d3.event.selection === null) { // if no selection, recover
     nodes.attr('opacity', 1);
    }
  });
  this.brushGen(brushGen);
}

function _brush$2 () {
  if (this.shape() === shapes$2[0]) {
    _parcoords.call(this);
  } else {
    _matrix.call(this);
  }
}

const size$4 = {range: [1,1], scale: 'linear', reverse: false};
const shapes$2 = ['par-coords', 'scatter-matrix'];
const conditions$5 = ['normal', 'color'];
const _attrs$22 = {
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
class ParCoords extends mix(RectLinear).with(seriesMixin, brushMixin, paddingMixin, shapeMixin) {
  constructor() {
    super();
    this.setAttrs(_attrs$22);
    this.brush(true);
    this.process('munge', _munge$10, {isPre: true})
      .process('domain', _domain$11, {isPre: true})
      .process('range', _range$10, {isPre: true})
      .process('axis', _axis$9)
      .process('region', _region$8) 
      .process('mark', _mark$10, {allow: function() {return this.isParcoords()}})
      .process('facet', _facet$6, {allow: function() {return !this.isParcoords()}})
      .process('legend', _legend$9)
      .process('brush', _brush$2);
  }

  isColor() {
    return this.condition() === conditions$5[1];
  }

  isParcoords() {
    return this.shape() === shapes$2[0];
  }
  
  muteRegions(callback) { 
    let _parCoords = region => {
      this.mute(region, this.muteIntensity());
    };
    let _matrix = region => {
      let nodes = region.selectAll(this.nodeName()).classed('mute', true);
      this.mute(nodes, this.muteIntensity());
    };
    if (!arguments.length) {
      if (this.isParcoords()) {
        return this.filterRegions().call(_parCoords);
      } else {  
        return this.regions().selectAll(this.regionName())  
          .call(_matrix);
      }
    } 
    if (this.isParcoords()) {
      return this.filterRegions(conditionForMute(callback), true).call(_parCoords);
    } else {
      return this.regions().selectAll(this.regionName()).filter(conditionForMute(callback)).call(_matrix);
    }
  }
  
  demuteRegions(callback) {
    let _parCoords = region => {
      this.demute(region);
    };
    let _matrix = region => {
      let nodes = region.selectAll(this.nodeName());
      this.demute(nodes);
    };
    if (!arguments.length) {
      if (this.shape() === shapes$2[0]) {
        return this.filterRegions().call(_parCoords);
      } else {  
        return this.regions().selectAll(this.regionName())  
          .call(_matrix);
      }
    }
    if (this.isParcoords()) {
      return this.filterRegions(conditionForMute(callback), true).call(_parCoords);
    } else {
      return this.regions().selectAll(this.regionName()).filter(conditionForMute(callback)).call(_matrix);
    }
  }
  
  muteFromLegend(legend) {
    this.muteRegions(legend.key);
  }
  
  demuteFromLegend(legend) {
    this.demuteRegions(legend.key);
  }
}

function xMeasureName (measure) {
  return 'x-' + (measure.field ? measure.field : measure);
}

function yMeasureName (measure) {
  return 'y-' + (measure.field ? measure.field : measure);
}

var parCoords = genFunc(ParCoords);

function _munge$12() {
  let conditionFunc = function (dimensions, measures) {
    const field = this.__execs__.field;
    if (dimensions.length === 1) {
      if (measures.length === 0) this.measure(countMeasure);
      field.r = measureField(measures[0]);
      field.region = dimensionField(dimensions[0]);
      if (measures.length === 0) return conditions$6[0];
      else if (measures.length === 1) return conditions$6[1];
    }
    else throw new ConditionException();
  };
  this.condition(conditionFunc);
  this.__execs__.munged = this.aggregate(false, true, false, false);
  this.limitKeys();
  const field = this.__execs__.field;
  const pieGen = d3.pie().value(d => d.value[field.r.valueName()])
    .padAngle(this.padding());
  if (this.sortByValue()) {
    pieGen.sortValues(this.sortByValue() === 'ascending' ? (a,b) => a-b : (a,b) => b-a);
  }
  const result = pieGen(this.__execs__.munged);
  result.forEach(d => d.key = d.data.key);
  if (field.region.interval()) { 
    result.forEach(d => { d.data.key = new Date(d.data.key);});
  }
  this.__execs__.munged = result;
}

function _domain$13(keep) {
  const scale = this.scale();
  const munged = this.__execs__.munged;
  const field = this.__execs__.field;
  let regionDomain = field.region.munged(munged).domain();
  scale.color = this.updateColorScale(regionDomain, keep);
}

function _mark$12() {
  const that = this;
  const scale = this.__execs__.scale;
  const label = this.label();
  const trans = d3.transition().duration(this.transition().duration).delay(this.transition().delay);
  const innerSize = this.innerSize();
  const size = this.size();
  const arcGen = d3.arc().innerRadius(size.range[0])
    .outerRadius(size.range[1])
    .startAngle(d => d.startAngle)
    .endAngle(d => d.endAngle)
    .padAngle(d => d.padAngle);
  const tweenArc = function(d) {
    let i = d3.interpolate({endAngle:0}, d);
    return function(t) {return arcGen(i(t));};
  };

  let __local = function (selection) {
    let sizeMean = d3.mean(size.range);
    selection.each(function(d) {
      d.mid = (d.endAngle + d.startAngle) /2;
      d.dx = Math.sin(d.mid) * sizeMean;
      d.dy =  - Math.cos(d.mid) * sizeMean;
      d.x = innerSize.width/2 + d.dx;
      d.y = innerSize.height/2 + d.dy;
      d.color = scale.color(d.key);
      d.text = labelFormat(d.value);
    });
  };

  let __nodeInit = function (selection) {
    selection
      .style('fill', d => d.color)
      .style('cursor', 'pointer');
  }; 
  let __node = function (selection) {
    selection.style('fill', d => d.color)
      .transition(trans)
      .attrTween('d', tweenArc);
  };
  
  let __labelInit = function (selection) {
    selection.each(function(d) {
      d3.select(this).attr('x', d.dx)
        .attr('dy', '.35em')
        .attr('y', d.dy)
        .attr('text-anchor', 'middle')
        .style('pointer-events', 'none')
        .text(d.text);
      that.styleFont(d3.select(this));
    });
  };

  let __label = function (selection) {
    selection.each(function(d) {
      d3.select(this).style('visibility',label ? 'visible' : 'hidden')
        .text(d.text)
        .transition(trans).attr('x', d.dx)
        .attr('y', d.dy);
      that.styleFont(d3.select(this));
    });
  };

  let __appendNodes = function (selection) {
    let node = selection.selectAll(that.nodeName())
      .data(d => d, d => d.data.key);
    node.exit().remove();
    let nodeEnter = node.enter().append('g')
      .attr('class', that.nodeName(true)  + ' pie')
      .call(__local);
    nodeEnter.append('path')
      .call(__nodeInit);
    nodeEnter.append('text')
      .call(__labelInit);
    node.call(__local);
    node = nodeEnter.merge(node)
      .attr('transform', 'translate(' + [innerSize.width/2, innerSize.height/2] +')');
    node.select('path')
      .call(__node);
    node.select('text')
      .call(__label);
    that.__execs__.nodes = node;
  };
  
  this.renderRegion(d => {
    d.x = 0; d.y = 0;
  }, d => [d])
  .call(__appendNodes);
}

function _legend$11() { 
  if (!this.legend()) return ;
  this.renderLegend();
}

function _tooltip$11() {
  if(!this.tooltip()) return;
  const count = this.isCount();
  const field = this.__execs__.field;
  const tFormat = d => {
    let f = field.region.isInterval() ? field.region.format(): null;
    return f ? f(d) : d;
  };

  let key = d => {
    return {name: 'key', value: tFormat(d.data.key)};
  };
  let value = (d, text) => {
    let name;
     if (count) {
      name = countMeasureTitle;
    } else {
      name = field.region.field();
    }
    return {name, value:text}
  };

  this.renderTooltip({value, key});
}

const size$5 = {range: [0, 150], scale: 'linear', reverse: false}; 
const conditions$6 = ['normal', 'count'];
const _attrs$23 = {
  limitKeys: 20,
  padding: 0,
  size: size$5
};

/**
 * renders a pie chart.
 * @class Pie
 * @augments Core
 * @augments PaddingMixin
 * @augments SortMixin
 */
class Pie extends mix(Core).with(paddingMixin, sortMixin) {
  constructor() {
    super();
    this.setAttrs(_attrs$23);
    this.process('munge', _munge$12, {isPre:true})
      .process('domain', _domain$13, {isPre: true})
      .process('mark', _mark$12)
      .process('legend', _legend$11)
      .process('tooltip', _tooltip$11);
  }
  
  axis() {
    if(!arguments.length) return [];
    return this;
  }
  
  muteFromLegend(legend) {
    this.muteNodes(legend.key);
  }
  
  demuteFromLegend(legend) {
    this.demuteNodes(legend.key);
  }
  
  muteToLegend(d) {
    this.muteLegend(d.data.key);
  }
  
  demuteToLegend(d) {
    this.demuteLegend(d.data.key);
  }
  
  isCount() {
    return this.condition() === conditions$6[1];
  }
}

var pie$1 = genFunc(Pie);

function _munge$14() {
  let conditionFunc = function (dimensions, measures) {
    const field = this.__execs__.field;
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
      if (measures.length < 2) throw new ConditionException()
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
  const field = this.__execs__.field;
  if (this.isSized()) this.data().sort(function (a, b) { return b[field.radius.field] - a[field.radius.field]; });
  this.__execs__.munged = this.data();
}

function _map() {
  const selection = d3.select(this.container());
  let frame = selection.select('.frame.layer');
  if (frame.empty()) {
    frame = selection.append('div')
      .attr('class', 'frame layer');
  }
  frame.style('width', this.width() + 'px')
    .style('height', this.height()  + 'px');
  const options = {
      center: new daum.maps.LatLng(33.450701, 126.570667),
      level: 3
    }; // defaut zoom option
  let map = new daum.maps.Map(frame.node(), options);
  map.setMapTypeId(daum.maps.MapTypeId[this.mapBaseType()]);
  if (this.overlayMapType()) map.addOverlayMapTypeId(daum.maps.MapTypeId[this.overlayMapType()]);
  let zoomControl = new daum.maps.ZoomControl();
  map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);
  map.setZoomable(false);
  this.__execs__.map = map;
}

function _domain$15() {
  const scale = this.scale();
  const field = this.__execs__.field;

  if (this.isSized()) {
    let rDomain = d3.extent(this.data(), d => d[field.radius.field]);
    scale.r = d3.scaleLinear().domain(rDomain.map(d => Math.sqrt(d)));
  }
}

function _addr2coord (addr, geocoder, callback) { 
  geocoder.addr2coord(addr, function (status, result) {
    if (status === daum.maps.services.Status.OK) {
      return callback(null, result.addr[0]);
    } else {
      return callback(status); 
    }
  });
}

function _rScaleRange (scale, level, size) {
  let magVal = Math.pow(2, level); 
  scale.range([size.range[0] * magVal, size.range[1] * magVal]); 
}
function _mark$14() {
  const map = this.__execs__.map;
  const field = this.__execs__.field;
  const scale = this.__execs__.scale;
  const dispatch$$1 = this.__execs__.dispatch;
  const isAddr = this.addr();
  const label = this.label();
  const target = this.data();
  const isSized = this.isSized();
  const size = this.size();
  const color = this.color();
  const geocoder = new daum.maps.services.Geocoder();
  const circles = [];
  
  let __set = function() {
    const latlng = target.map(d => new daum.maps.LatLng(d[field.lat.field], d[field.lng.field]));
    const bounds = new daum.maps.LatLngBounds();
    latlng.forEach(function (d) {
      bounds.extend(d);
    });
    map.setBounds(bounds);
    const level = map.getLevel();
    if(isSized) _rScaleRange(scale.r, level, size);
  };
  let __nodes = function() {
    const level = map.getLevel();
    const earthR = 111111; // earth radius
    target.forEach(d => {
      const latLng = new daum.maps.LatLng(d[field.lat.field], d[field.lng.field]);
      const radius = isSized ? scale.r(Math.sqrt(d[field.radius.field])) : size.range[0] * Math.pow(2, level);
      const option = {
        clickable: true,
        zIndex: 10,
        center: latLng,  
        radius: radius,
        strokeColor: color[0],
        strokeWeight: 1.5,
        strokeOpacity: 1,
        strokeStyle: 'solid',
        fillColor :  color[0],
        fillOpacity: 0.5
      };
      const circle = new daum.maps.Circle(option);
      circle.setMap(map);
      circles.push(circle);

      const keyVal = field.name ? d[field.name.field] : isAddr ? d[field.addr.field] : 'Y: ' + labelFormat(d[field.lat.field]) + '</br> X: ' + labelFormat(d[field.lng.field]);
      const tooltipText = '<div class="jelly-chart-tooltip" style="padding:4px;font-size:12px;font-family:sans-serif;">' +
      '<div class="jelly-chart-key" style="font-weight:bold;">' + keyVal + '</div>' +
      (isSized  ? '<div class="jelly-chart-value">' + field.radius.field + ': ' + labelFormat(d[field.radius.field]) + '</div>' : '') +
      '</div>';
      const tooltip = new daum.maps.InfoWindow({
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
        const value = labelFormat(d[field.radius.field]);
        const label = new daum.maps.CustomOverlay({
          position: latLng,
          clickable: true,
          zIndex: -1,
          content: '<div class="label" style="pointer-events:none;padding:4px;font-size:12px;font-family:sans-serif;">' + value + '</div>'
        });
        label.setMap(map);
      }
    });
  };

  if(isAddr) {
    let count = 0;
    
    target.forEach(function(d) {
      let addr = d[field.addr.field];
      let callback = function(err, coord) {
        if(!err) {
          d[latMeasure.field] = coord.lat;
          d[lngMeasure.field] = coord.lng;
        }
        count += 1;
        dispatch$$1.call('loading', this, count);
        if(count === target.length) {
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
  if(!isSized) {
    daum.maps.event.addListener(map, 'zoom_changed', function() {
      const radius = size.range[0] * Math.pow(2, map.getLevel());
      circles.forEach(function(circle) {
        circle.setRadius(radius);
      });
    });
  }
}

const latMeasure = {field: '__--jelly-lat--__'};
const lngMeasure = {field: '__--jelly-lng--__'};

const size$6 = {range: [0.5, 4], scale: 'linear', reverse: false};
const conditions$7 = ['normal', 'point'];
const _attrs$24 = {
  addr: false,
  mapBaseType: 'ROADMAP',// ROADMAP SKYVIEW HYBRID
  needCanvas: false,
  overlayMapType: null, // OVERLAY TERRAIN TRAFFIC BICYCLE BICYCLE_HYBRID USE_DISTRICT
  size: size$6,
};

/**
 * @class MarkerMap
 * @augments Default
 */
class MarkerMap extends Core {
  constructor() {
    super();
    this.setAttrs(_attrs$24);
    this.__execs__.dispatch = d3.dispatch('loading', 'end');
    rebindOnMethod(this, this.__execs__.dispatch);
    this.process('munge', _munge$14, {isPre: true})
      .process('domain', _domain$15, {isPre: true})
      .process('map', _map)
      .process('mark', _mark$14);
  }
  isSized() {
    return this.condition() === conditions$7[0];
  }
}

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
  const scale = this.__execs__.scale;
  const {yBar, yLine} = this.__execs__.field;
  const xAt = this.axisX();
  const yAtLeft = this.axis().find(a => a.target === 'y' && a.orient === 'left');
  const yAtRight = this.axis().find(a => a.target === 'y' && a.orient === 'right');
  const fieldObj = this.__execs__.field;
  
  let _axisScaleX = (axisToggle) => {
    axisToggle.field = fieldObj.x.field();
    let curAxis = this.axisDefault(scale.x, axisToggle);
    if (axisToggle.orient === 'bottom') curAxis.y(scale.yBar.range()[0]);
    return curAxis;
  };
  let _axisScaleY =  (yScale, axisToggle) => {
    let curAxis = this.axisDefault(yScale, axisToggle);
    if (axisToggle.orient === 'right') curAxis.x(scale.x.range()[1]);
    return curAxis;
  };
  if (xAt) {
    _axisScaleX(xAt);
  }
  if (yAtLeft) {
    yAtLeft.field = yBar.field();
    yAtRight.field = yLine.field();
    _axisScaleY(scale.yBar, yAtLeft);
    _axisScaleY(scale.yLine, yAtRight);
  }
  
  this.renderAxis();
}

function _munge$16() { 
  let conditionFunc = function (dimensions, measures) {
    const field = this.__execs__.field;
    if (dimensions.length === 1 && measures.length === 2) {
      field.x = dimensionField(dimensions[0]);
      field.yBar = measureField(measures[0]);
      field.yLine = measureField(measures[1]);
      field.region = dimensionField(this.mixedDimension());
      return conditions$8[0];
    } else throw new ConditionException();
  };
  this.condition(conditionFunc);
  //TODO: yBar munged, yLine munged;
  /*
  this.__execs__.munged = this.aggregate(this.facet() && !this.stacked());
    }
    if (!this.isNested()) this.__execs__.munged = [this.__execs__.munged[0].parent];

  aggregate (reverse = false, rollup = true, preFormat = false, useHierarchy = true, sum = true, dimensions, measures) {
  */
  
  this.__execs__.munged = this.aggregate();
}

function _domain$17(keep) {
  const munged = this.__execs__.munged;
  const {x, yBar, yLine} = this.__execs__.field;
  const yAt = this.axisY();
  
  if (yAt && yAt.orient === 'left') { //add the right axis directly
    const yAtRight = Object.assign({}, yAt);
    yAtRight.orient = 'right';
    this.axis(yAtRight);
  }
  const xDomain = x.level(0).munged(munged).domain(this.sortByValue());
  const scale = this.scale();
  scale.x = d3.scaleBand().padding(this.padding()).domain(xDomain);
  scale.yBar = d3.scaleLinear();
  scale.yLine = d3.scaleLinear();

  this.setCustomDomain('yBar', domainY(yBar, munged));
  this.setCustomDomain('yLine', domainY$1(yLine, munged));
  scale.color = this.updateColorScale(this.measures().map(d => d.field), keep);
}

function _range$12() {
  const { x, yBar, yLine} = this.scale();
  const xAt = this.axisX();
  const yAtLeft = this.axis().find(a => a.target === 'y' && a.orient === 'left');
  const yAtRight = this.axis().find(a => a.target === 'y' && a.orient === 'right');
  
  if (yAtLeft) {
    this.thickness(yAtLeft, yBar, false, false);
    this.thickness(yAtRight, yLine, false, false);
  }
  if (xAt) {
    this.thickness(xAt, x, true, true);
  }
  const {width, height} = this.innerSize();
  yBar.range([height, 0]);
  yLine.range([height, 0]);
  x.range([0, width]);
  return this;
}

/**
 * thickness -> margin에 반영 하기
 */
function _region$10() {
  const scale = this.__execs__.scale;
  
  this.renderRegion(d => d.x = d.y = 0, scale.color.domain().map(d => {return {key: d}})); 
}

function _legend$13() { 
  let legendToggle = this.legend();
  if (!legendToggle) return;

  this.renderLegend();
}

function _facet$8 () {
  let parent = this;
  let data = this.data();
  let field = this.__execs__.field;
  let color = this.color();
  let innerSize = this.innerSize();
  let width = innerSize.width, height = innerSize.height;
  let padding = this.padding();
  let dimensions =  this.dimensions();
  let barMeasures = [field.yBar.toObject()];
  let barSettings =   ['axisTitles', 'padding', 'font', 'label', 'grid']
    .map(d => { return {key: d, value:this[d]()};});
  let lineMeasures = [field.yLine.toObject()];
  let lineSettings = ['axisTitles', 'curve', 'point', 'pointRatio', 'regionPadding', 'size', 'grid', 'font', 'label']
    .map(d => { return {key: d, value:parent[d]()};});
  let _smallLine = function() {
    let smallLine = line$2()
        .container(this)
        .data(data)
        .dimensions(dimensions).measures(lineMeasures)
        .width(width).height(height)
        .legend(false)
        .tooltip(false)
        .padding(padding)
        .parent(parent) 
        .zeroOffset(true) 
        .color(color[1])
        .scaleBandMode(true);
    lineSettings.forEach(d => smallLine[d.key](d.value));
    smallLine.render();
  };
  let _smallbar = function() {
    let smallBar = bar()
        .container(this)
        .data(data)
        .dimensions(dimensions).measures(barMeasures)
        .width(width).height(height)
        .padding(padding)        
        .legend(false)
        .tooltip(false)
        .zeroOffset(true) 
        .parent(parent)
        .color(color[0]);
    barSettings.forEach(d => {smallBar[d.key](d.value);});
    smallBar.render();
  };
  
  this.regions()
    .each(function(_,i) {
      if (i===0) d3.select(this).each(_smallbar);
      else d3.select(this).each(_smallLine);
    });
}

function _tooltip$13() {
  if(!this.tooltip()) return;
  const field = this.__execs__.field;
  let key = (d) => {
    return {name: 'key', value:d.data.key};
  };
  let value = (d, text) => {
    let name = d.anchor ? field.yLine.field() : field.yBar.field();
    return {name, value:text};
  };
  this.renderTooltip({value, key});
}

const size$7 = {range: [2, 2], scale: 'linear', reverse: false};
const conditions$8 = ['normal'];
const _attrs$25 = {
  padding: 0.05,
  point: false,
  pointRatio : 3,
  regionPadding: 0.1,
  size: size$7,
};

/**
 * renders a combo chart, having both a bar and a line chart.
 * @class Combo
 * @augments Core
 * @augments RectLinear 
 * @augments PaddingMixin
 * @augments SortMixin
 */
class Combo extends mix(RectLinear).with(paddingMixin, seriesMixin, sortMixin) {
  constructor() {
    super();
    this.setAttrs(_attrs$25);
    this.process('munge', _munge$16, {isPre:true})
      .process('domain', _domain$17, {isPre:true})
      .process('range', _range$12, {isPre:true})
      .process('region', _region$10)
      .process('facet', _facet$8)
      .process('axis', _axis$11)
      .process('legend', _legend$13)
      .process('tooltip', _tooltip$13);
  }
  /**
   * @override
   */
  measureName() {
    let measures = this.measures();
    let yField;
    if (this.condition() === conditions$8[2]) yField = mixedMeasure.field; 
    else if (this.aggregated() && measures[0].field === mixedMeasure.field) yField = measures[0].field;
    else yField = measures[0].field + '-' + measures[0].op;
    return yField;
  }

  isCount() {
    return this.condition() === conditions$8[1];
  }
}

var combo = genFunc(Combo);

/**
 * @namespace jelly
 * @type {object}
 */
const _layout = {
  /**
   * Generator returns a {@link Bar} instance
   * @type {function} 
   * @see {@link Bar} 
   * @memberOf jelly
   */
  bar,
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
  scatter, 
  /**
   * Generator returns a {@link XYHeatmap} instance
   * @type {function} 
   * @see {@link XYHeatmap} 
   * @memberOf jelly
   */
  xyHeatmap,
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
  parCoords,
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
  markerMap, 
  /**
   * Generator returns a {@link Combo} instance
   * @type {function} 
   * @see {@link Combo} 
   * @memberOf jelly
   */
  combo
};
_layout.type = function(type) {
  if (_layout.hasOwnProperty(type))  return _layout[type];
  throw new Error(`Undefined type: ${type} is not available`);
};

module.exports = _layout;
