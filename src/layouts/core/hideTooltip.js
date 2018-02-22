/**
 * hides a tooltip
 * @memberOf Core#
 * @function
 * @return {Core}
 */
export default function() {
  if (this.multiTooltip && this.multiTooltip()) return this;
  this.__execs__.tooltip.hide();
  return this;
}