/**
 * shows a tooltip on a node which has the same keys.
 * @todo not work for a multiTooltip
 * @memberOf Core#
 * @function
 * @param {...string} keys - Keys from the leaf to parents
 * @return {Core}
 */
function showTooltip (...keys) {
  if (this.multiTooltip && this.multiTooltip()) return;
  let condition = d => {
    let cond = true
    let target = d;
    keys.forEach(k => {
      cond = cond && target.data.key === k;
      if (target.parent) target = target.parent;
      else return cond;
    })
    return cond;
  }
  let nodes = this.filterNodes(condition); 
  let tooltip = this.__execs__.tooltip;
  if (nodes.size() > 0) { 
    nodes.each(function(d) {
      tooltip.showFromPoint(this, d);
    });
  }
  return this;
}

export default showTooltip;