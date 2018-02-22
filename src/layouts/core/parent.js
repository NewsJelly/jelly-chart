/**
 * @private
 * @param {Core} parent 
 */
function parent(parent) {
  if(!arguments.length) return this.__attrs__.parent;
  this.__attrs__.parent = parent;
  return this;
}

export default parent;