import {merge, nest, hierarchy} from 'd3';
import interval from '../../modules/interval';
import {dateComparator, comparator, summarize} from '../../modules/transform';

function dimension(dim, nested) {
  if (dim.interval) { // if has interval, transform key using d3Interval
    let intr = interval[dim.interval];
    nested.key(d => intr(d[dim.field])); 
  } else if (dim.format) { 
    let f = dim.format;
    nested.key(d => f(d[dim.field]));
  } else {
    nested.key(d => d[dim.field]) 
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
    let dim = reverse ? dimensions[dimensions.length - 1 - i] : dimensions[i] ;
    if (dim.interval) {
      currentLevel.forEach(d => {
        d.key = new Date(d.key)
      });
      currentLevel.sort(dateComparator(dim.order, 'key'));
      if (preFormat && dim.format) { //preformatting : treemap
        currentLevel.forEach(d => {
          d.key = dim.format(d.key);
        });
      }
    }
    if (i < dimensions.length -1) currentLevel = merge(result.map(d => d.values));
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
function aggregate (reverse = false, rollup = true, preFormat = false, useHierarchy = true, sum = true) {
  let data = this.data();
  let dimensions = this.dimensions();
  let measures = this.measures();
  let nested = nest();
  for (let i = 0 ; i < dimensions.length ; i++) {
    let dim = reverse ? dimensions[dimensions.length - 1 - i] : dimensions[i] ;
    dimension(dim, nested);
  }
  if(!rollup) {
    let result = dateKey.call(this, nested.entries(data), reverse, preFormat);
    return useHierarchy ? hierarchy({values:result}, function(d){return d.values;}).children : result;
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
    let root = hierarchy({values:result}, function(d){return d.values;});
    if (sum && measures.length === 1) {
      let m = measures[0];
      root.sum(d => d.value ? d.value[`${m.field}-${m.op}`] : 0);
    }
    return root.children;
  } else {
    return result;
  }
}

export default aggregate;