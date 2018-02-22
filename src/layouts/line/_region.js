function _region() {
  const aggregated = this.aggregated();
  const canvas = this.__execs__.canvas;
  const nested = this.isNested();
  const scale = this.__execs__.scale;
  const stacked = this.stacked();
  const facet = this.facet();
  const isFacet = this.isFacet();
  const color = this.color();
  let __regionLocal = d => {
    if (aggregated) return;
    let xy;
    if(!nested) {
      xy = [0,0];
    } else if(facet && !stacked) {
      xy = [scale.region(d.data.key), 0];
      if (facet.orient === 'vertical') {
        xy.reverse();
      }
    } else {
      xy = [0,0];
    }
    d.x = xy[0]; d.y = xy[1];
    d.color = nested ? scale.color(d.data.key) : color[0];
  };
  
  //create multiTooltip area
  if (!isFacet && this.multiTooltip()) {
    let multiTooltipG = canvas.select('.multi-tooltip-g');
    if (multiTooltipG.empty()) multiTooltipG = canvas.append('g').attr('class', 'multi-tooltip-g');
  }
  
  this.renderRegion(__regionLocal, d => {
      let target = stacked ? d.slice().reverse() : d;
      return target;
    }, isFacet);
}

export default _region;