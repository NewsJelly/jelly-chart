/**
 * @memberOf RectLinear#
 * @private
 */
export default function() {
  return this.axis().find(d => d.target === 'y');
}