/**
 * If stream is an object or an array of objects, appends the stream to existing data. If stream is specified, during re-rendering, it will keeps the domain interval limited by {@link StreamMixin#viewInterval viewInterval}. 
 * If stream is not specified, returns the existing stream.
 * @memberOf StreamMixin#
 * @function
 * @example
 * stream.stream({category:'A', sales: 100})
 *  .render(true);
 * stream.stream([
 *  {category: 'D', sales: 100}, 
 *  {category: 'E', sales: 200}
 * ]).render(true);
 * @param {object|Object[]} [stream=null] 
 * @return {zoom|ZoomMixin}
 */
function stream(stream) {
  if (!arguments.length) return this.__execs__.stream;
  if (stream) {
    if (!Array.isArray(stream)) stream = [stream];
    this.data(this.data().concat(stream));
  }
  this.__execs__.stream = stream;
  return this;
}

export default stream;