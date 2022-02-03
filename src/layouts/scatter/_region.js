function _region() {
  const aggregated = this.aggregated();
  const scale = this.__execs__.scale;
  const isFacet = this.isFacet();
  const facet = this.facet();
  this.renderRegion(d => {
    if (aggregated) return;
    let xy = [isFacet ? scale.region(d.key) : 0, 0];
    if (facet.orient === 'vertical') xy.reverse();
    d.x = xy[0]; d.y = xy[1];
  }, d => d, isFacet);
}

export default _region;