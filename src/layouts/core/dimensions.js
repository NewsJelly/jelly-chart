import _dimensionType from './_dimensionType';

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

export default dimensions;