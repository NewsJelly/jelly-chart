import {sum, mean, variance, min, max, median, extent, scaleTime, scaleLinear, scalePow, scaleLog} from 'd3';
import {ZeroDenominatorException} from './error';

const summarize = {sum, mean, variance, min, max, median, extent};
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
    }
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
  const xBar = sum(target, d => d[xField]) * lengthRev;
  const yBar = sum(target, d => d[yField]) * lengthRev;
  const ssXX = sum(target.map(d => Math.pow(d[xField] - xBar, 2)));
  const ssYY = sum(target.map(d => Math.pow(d[yField] - yBar, 2)));
  const ssXY = sum(target.map(d => (d[xField] - xBar) * (d[yField]- yBar)))
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
    })
  });
  if (normalized) {
    let max = {};
    let lastVal = target[target.length-1].data.value; // need to be sorted.
    measures.forEach(m => {
      let prefix = m.valueName();
      max[prefix] = lastVal[prefix + '-end'];
    })
    target.forEach((d) => {
      measures.forEach(m => {
        let prefix = m.valueName();
        let thisMax = max[prefix];
        if(thisMax !== 0) {
          d.data.value[prefix + '-start'] = d.data.value[prefix + '-start'] / thisMax;
          d.data.value[prefix + '-end'] = d.data.value[prefix + '-end'] / thisMax;
        } else {
          throw new ZeroDenominatorException();
        }
      })
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
    scale = scaleTime();
    type = 'time'
  } else {
    if (type === 'pow') scale = scalePow();
    else if (type === 'log') scale = scaleLog();
    else {
      scale = scaleLinear();
      type = 'linear';
    }
  }
  scale._scaleType = type;
  scale._field = field;
  return scale.domain(domain);
}

export {
  comparator, 
  continousScale,
  dateComparator,
  leastSquare,
  summarize, 
  stack
};