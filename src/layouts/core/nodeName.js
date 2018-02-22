/**
 * @memberOf Core#
 * @function
 * @private
 * @param {*} nodeName 
 */
function nodeName(nodeName) {
  let splited;
  if (!arguments.length || nodeName === false) return this.__attrs__.nodeName;
  else if (typeof nodeName === 'boolean' && nodeName) {
    return splited ? splited :  (splited = this.__attrs__.nodeName.split('.').join(' ').trim())
  }
  else if (typeof nodeName === 'string') {
    this.__attrs__.nodeName = nodeName;
    splited = this.__attrs__.nodeName.split('.').join(' ').trim();
  }
  return this;
}

export default nodeName;