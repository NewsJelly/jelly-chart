function bindOn(node, dispatch) {
  node.on('click.default', function() {
    dispatch.apply('selectClick', this, arguments); 
  }).on('mouseenter.default', function() {
    dispatch.apply('selectEnter', this, arguments);
  }).on('mouseleave.default', function() {
    dispatch.apply('selectLeave', this, arguments);
  })
  return node;
}

/**
 * renders the chart. At the end of settings for a chart, it should be called. If keep is true, it does not reset existing scales.
 * @memberOf Core#
 * @function
 * @param {boolean} [keep=false] If is true, not reset existing scales.
 * @return {Core}
 */
function render(keep = true) { 
  this.renderLayout(keep);
  if (!this.__execs__.canvas) return;

  const dispatch = this.__execs__.selectDispatch;
  const node = this.nodes();
  const legend = this.__execs__.legend;
  if (node && node.size() > 0) { 
    if (this.parent()) {
      return;
    }
    node.call(bindOn, dispatch)
      .on('mouseenter.default.legend', (d) => {
        if (legend && legend.mute && this.muteToLegend) this.muteToLegend(d);
      }).on('mouseleave.default.legend', (d) => {
        if (legend && legend.demute && this.demuteToLegend) this.demuteToLegend(d);
      })
  }

  if (this.isFacet && this.isFacet()) { //when is facet, get dispatch from regions.
    node.call(bindOn, dispatch);
  }
  return this;
}

export default render;