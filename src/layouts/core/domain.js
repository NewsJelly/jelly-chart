/**
 * gets a domain of the scale with a specified name
 * @memberOf Core#
 * @function
 * @param {string} name 
 */
function domain(name) {
  const scale = this.__execs__.scale;
  if (name in scale && scale.hasOwnProperty(name)) {
    return scale[name].domain();
  } else {
    return null;
  }
}

export default domain;