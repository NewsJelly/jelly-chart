function _range() {
  const scale = this.scale();
  const nested = this.isNested();
  const field = this.__execs__.field;
  const xAt = this.axisX();
  const yAt = this.axisY();
  const targetXField = nested ? field.region : field.x;
  const facet = this.facet();

  if (this.isFacet()) {
    const innerSize = this.innerSize();
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

    if (facet.orient === 'vertical') {
      scale.region.rangeRound([0, innerSize.height]);
    } else {
      scale.region.rangeRound([0, innerSize.width]);
    }
    return this;
  }
  if (this.isVertical()) { //vertical
    targetXField.axis(xAt);
    this.thickness(yAt, scale.y, false, false);
    this.thickness(xAt, nested ? scale.region : scale.x, true, true);
  } else {
    targetXField.axis(yAt);
    this.thickness(yAt, nested ? scale.region : scale.x, false, true);
    this.thickness(xAt, scale.y, true, false);
  }

  const innerSize = this.innerSize();
  //range 설정
  if (this.isVertical()) { //vertical 
    if (nested) {
      scale.region.range([0, innerSize.width]);
      scale.x.range([0, scale.region.bandwidth()]);
    } else {
      scale.x.range([0, innerSize.width]);
    }
    scale.y.range([innerSize.height, 0]); //reverse
  } else { //horizontal
    if (nested) {
      scale.region.range([0, innerSize.height]);
      scale.x.range([0, scale.region.bandwidth()]);
    } else {
      scale.x.range([0, innerSize.height]); //original
    }
    scale.y.range([0, innerSize.width]);  
  }
  return this;
}

export default _range;