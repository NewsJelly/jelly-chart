function _range() {
  const scale = this.scale();
  const facet = this.facet();
  const xAt = this.axisX();
  const yAt = this.axisY();

  if (this.isFacet()) {
    scale.region.padding(this.regionPadding());
    if (facet.orient === 'horizontal' && xAt) {
      xAt.orient = 'top';
      xAt.showDomain = false;
      this.thickness(xAt, scale.region, true, true);
      if (yAt) yAt.thickness = 0;
    } else if (facet.orient === 'vertical' && yAt) {
      yAt.orient = 'right';
      yAt.showDomain = false;
      this.thickness(yAt, scale.region, false, true);
      if (xAt) xAt.thickness = 0;
    }
    const innerSize = this.innerSize();
    if (facet.orient === 'vertical') {
      scale.region.rangeRound([0, innerSize.height]);
    } else {
      scale.region.rangeRound([0, innerSize.width]);
    }
    return;
  }
  
  if (this.isSized()) {
    scale.r.range(this.size().range);
  }

  this.thickness(yAt, scale.y, false, false);
  if(!this.stream()) this.thickness(xAt, scale.x, true, false);
  
  const innerSize = this.innerSize();
  scale.x.rangeRound([0, innerSize.width]);
  scale.y.rangeRound([innerSize.height, 0]); //reverse
}

export default _range;
