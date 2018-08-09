function _region() {
  const aggregated = this.aggregated();
  const canvas = this.__execs__.canvas;
  const nested = this.isNested();
  const scale = this.__execs__.scale;
  const stacked = this.stacked();
  const facet = this.facet();
  const isFacet = this.isFacet();
	const color = this.color();
	const areaGradient = this.areaGradient();
  let __regionLocal = (d, index ) => {
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
		
		if(areaGradient){
			let defs = canvas.append("defs")
			var gradient = defs.append("linearGradient")
				.attr("id", "areaGradient-"+d.data.key)
				.attr("x1", "30%").attr("x2", "50%")
				.attr("y1", "80%").attr("y2", "0%");
			gradient.append("stop")
				.attr("offset", "0%")
				.attr("stop-color", d.color)
				.attr("stop-opacity", 0);
			gradient.append("stop")
				.attr("offset", "100%")
				.attr("stop-color", d.color)
				.attr("stop-opacity", 1);
		}
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
