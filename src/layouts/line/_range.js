function _range() {
  const scale = this.scale();
  const munged = this.__execs__.munged;
  const individualScale = this.isIndividualScale();
  const facet = this.facet();
  const isMixed = this.isMixed();
  const xAt = this.axisX();
  const yAt = this.axisY();
  const diffWithArrow = this.diffWithArrow();

  if (this.isFacet()) {
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

  if (isMixed && individualScale && yAt) {
    yAt.orient = 'left';
    this.thickness(yAt, munged[0].scale, false, false);
    let tempAt = Object.assign({}, yAt)
    tempAt.orient = 'right';
    this.axis(tempAt);
    this.thickness(tempAt, munged[munged.length-1].scale, false, false);
   } else if (yAt) {
    let right = this.axis().find(d => d.target === 'y' && d.orient !== yAt.orient)
    if (right) this.axis(right, false);
    this.thickness(yAt, scale.y, false, false);
  }

  this.thickness(xAt, scale.x, true, scale.x.invert ? false : true);
  const innerSize = this.innerSize();
  scale.x.range([0, innerSize.width]);
  if (scale.x.invert && !this.scaleBandMode()) {
    const xDomain = scale.x.domain();
    let d0 = this.padding();
    d0 = innerSize.height * d0 /2;
    let d1 = innerSize.width - d0;
    if (xDomain[0] === xDomain[1] || xDomain[1] - xDomain[0] === 0) { // if no domain, using center
      let center = (d0+d1)/2;
      scale.x.range([center, center]) ;
    } else {
      scale.x.range([d0, d1]);
    }
  }
  if (diffWithArrow) {
      let d0 = 0;
      let d1 = innerSize.width - d0;
      scale.x.range([d0 + 100, d1 - 200])
  }
  scale.y.range([innerSize.height, 0]); //reverse

  if (individualScale) { //individual scale
    munged.forEach(m => {
      m.scale.range([innerSize.height, 0])
    });
  }
  return this;
}

export default _range;
