/**
 * If name is specified, returns a scale with the name in existing scales. If name is not specified, returns an object includes all scales.
 * @memberOf Core#
 * @function
 * @example
 * core.scale('color'); //returns the color scale;
 * core.scale() // returns the scale object
 * @param {string} [name] 
 * @return {object|function} 
 */
function scale(name) {
  if(!arguments.length) return this.__execs__.scale;
  return this.__execs__.scale[name];
}

export default scale;