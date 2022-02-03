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

export default size;