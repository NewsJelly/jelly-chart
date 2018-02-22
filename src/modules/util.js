import {format, select} from 'd3';

const classPrefix = "jellychart";
const magicTableColorScheme = [ '#50C3F7 ','#7986CB ','#BA68C8 ','#F06292 ','#FF8A65 ','#FFD54F ','#AED581 ','#4CB6AC ','#2C82A9 ','#48528A ','#803E8C ','#A6365B ','#CF6644 ','#C1A039 ','#749350 ','#32827A '];
let labelFormat = (function() {
  let integerFormat = format(',');
  let plusIntegerFormat = format('+,');
  let floatFormat = format(',.2f');
  let plusFloatFormat = format('+,.2f');
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
    }
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
  return select('body').selectAll('#' + _id).empty();
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
  }
  func.__class__ = ClassFunc;
  return func;
}

export {
  attrFunc,
  className, 
  classPrefix, 
  genFunc,
  getUniqueId, 
  labelFormat, 
  magicTableColorScheme, 
  mix,
  rebindOnMethod,
  safari, 
  setAttrs,
  setMethodsFromAttrs, 
  setMethodFromDefaultObj, 
  uniqueId, 
  zeroPoint
};