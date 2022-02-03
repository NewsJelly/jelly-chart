const orients = ['vertical', 'horizontal'];
/**
 * If facet is specified, sets the facet settings and returns the instance itself. If is true, renders vertical oriented partitions. If is a string or object, it changes the orient of partitions. If is false, renders in the default way. If facet is not specified, returns the instance's current facet setting.
 * @memberOf Facet#
 * @function
 * @example
 * facet.facet(true) // renders vertical partitions
 * facet.facet('horizontal')
 * facet.facet({orient: 'vertical'})
 * facet.facet() // returns the current setting
 * @param {boolean|string|object} [facet=false] (false|true|vertical|horizontal) 
 * @param {string} [facet.orient=vertical]
 * @return {facet|Facet}
 */
function facet(facet=false) {
  if (!arguments.length) return this.__attrs__.facet;
  if (!facet) this.__attrs__.facet = false;
  else if (orients.includes(facet)) this.__attrs__.facet = {orient: facet};
  else this.__attrs__.facet = {orient: orients[0]};
  return this;
}

export default facet;