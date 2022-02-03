/**
 * generate a pseudo dimension which concatenates measures.
 * @memberOf Core#
 * @function
 * @private
 * @return {mixedDimension}
 */
function mixedDimension() {
  const mixedDimension = {order: 'natural'};
  mixedDimension.field = this.measures().map(d => d.field).join('-');
  return mixedDimension;
}

export default mixedDimension;