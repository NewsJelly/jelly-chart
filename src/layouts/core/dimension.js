import _dimensionType from './_dimensionType';

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
function dimension(dimension) {
  this.__attrs__.dimensions.push(_dimensionType(dimension));
  return this;
}

export default dimension;