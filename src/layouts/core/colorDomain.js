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

export default colorDomain;