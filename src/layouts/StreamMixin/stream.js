/**
 * stream
 * @memberOf StreamMixin#
 * @function
 * @example
 * stream.stream({category:'A', sales: 100})
 * stream.stream([
 *  {category: 'D', sales: 100}, 
 *  {category: 'E', sales: 200}
 * ]);
 * @param {object|Object[]} [stream=null] 
 * @return {zoom|ZoomMixin}
 */
function stream(stream) {
  if (!arguments.length) return this.__execs__.stream;
  if (!Array.isArray(stream)) stream = [stream];
  this.__execs__.stream = stream;
  this.data(this.data().concat(stream));
  return this;
}

export default stream;