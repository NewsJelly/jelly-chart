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

export default color;