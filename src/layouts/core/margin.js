function append(source, target, prop) {
  if (source[prop] && typeof source[prop] === 'number') target[prop] = source[prop]; 
}
/**
 * If margin is specified, sets margin of the container and returns the instance itself. The unit of margin is a pixel. If margin is not specified, returns the instance's current margin.
 * @memberOf Core#
 * @function
 * @example
 * core.margin({top:100, right: 100}); //sets the margin's top and right amount
 * core.margin();
 * @param {object} [margin]
 * @param {number} [margin.top=40] top
 * @param {number} [margin.right=40] right
 * @param {number} [margin.bottom=40] bottom
 * @param {number} [margin.left=40] left
 * @return {margin|Core}
 */
function margin(margin = {}) {
  const curMargin =this.__attrs__.margin;
  if (!arguments.length) return this.__attrs__.margin;
  if (typeof margin === 'object') {
    ['top', 'right', 'left', 'bottom'].forEach(prop => append(margin, curMargin, prop));
  }
  return this;
}
export default margin;