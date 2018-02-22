import {scaleBand, scaleLinear} from 'd3';

function _scale(keep) {
  const scale = this.scale();
  const munged = this.__execs__.munged;
  const nested = this.isNested();
  const stacked = this.stacked();
  const facet = this.facet();
  const aggregated = this.aggregated();
  const field = this.__execs__.field;
  let xAt = this.axisX();
  let yAt = this.axisY();
  let yDomain, xDomain;
  let regionDomain;
  
  scale.x = scaleBand().padding(this.padding());
  scale.y = scaleLinear();

  if (nested) {
    regionDomain = field.region.level(0).munged(munged).domain();
    scale.region = scaleBand().domain(regionDomain).padding(this.regionPadding());
  }
  
  if (this.isFacet()) {
    scale.region = scaleBand().domain(regionDomain).padding(this.regionPadding());
    scale.color = this.updateColorScale(regionDomain, keep);

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
  const level = 1;

  xDomain = field.x.level(level).munged(munged).domain(this.sortByValue());
  yDomain = field.y.level(level).munged(munged).aggregated(aggregated).domain(0, stacked);
  if (nested || (!nested && (this.mono() === false || stacked))) { //nested
    scale.color = this.updateColorScale(xDomain, keep);
  }
  
  // bar-chart 의 경우 시작점을 0으로 맞춤
  if (yDomain[0] > 0) yDomain[0] = 0;
  else if (yDomain[1] < 0) yDomain[1] = 0;

  if (this.showDiff() && !nested) {
    if (yDomain[0] === 0) yDomain[1] *= 1.25;
    else if (yDomain[1] === 0) yDomain[0] *= 1.25;
  }
  if(stacked) {
    if (!nested) {
      scale.x.domain([field.x.field()]);
    }
  } else { //not stacked
    scale.x.domain(xDomain);
  }
  this.setCustomDomain('y', yDomain);
  //scale.x에 대한 customDomain 처리
  
  let targetXField = nested ? field.region : field.x;
  
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
}

export default _scale;