function _region() {
  const aggregated = this.aggregated();
  const nested = this.isNested.call(this);
  const scale = this.__execs__.scale;
  const stacked = this.stacked();
  const facet = this.facet();
  const vertical = this.isVertical();
  const isFacet = this.isFacet();
  let __regionLocal = function(d) {
    if (aggregated) return;
    let xy = nested ? [scale.region(d.data.key), 0] : [0,0];
    if((facet && !stacked && facet.orient === 'vertical') ) {
      xy.reverse();
    } else if (!vertical && facet.orient !== 'horizontal') {
      xy.reverse();
    }
    let x = xy[0];
    let y = xy[1];
    d.x = x; d.y = y;
  };
  
  this.renderRegion(__regionLocal, d => d, isFacet);
}

export default _region;