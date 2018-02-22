import {timeFormat} from 'd3';

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
    if ('format' in measure && typeof measure.format === 'string') measure.format = timeFormat(measure.format);
    this.__attrs__.measures.push(measure);
  }
  return this;
}

export default measure;