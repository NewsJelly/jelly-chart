import {timeFormat} from 'd3';

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
      if ('format' in v && typeof v.format === 'string') v.format = timeFormat(v.format);
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

export default measures;