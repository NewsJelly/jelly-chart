import {scaleBand, scaleLinear} from 'd3';

function _domain(keep) { //set scales and domains
  const scale = this.scale();
  const munged = this.__execs__.munged;
  const nested = this.isNested();
  const stacked = this.stacked();
  const aggregated = this.aggregated();
  const field = this.__execs__.field;
  
  let yDomain, xDomain;
  let regionDomain;
  if (!(keep && scale.x && scale.y)) {
    scale.x = scaleBand().padding(this.padding());
    scale.y = scaleLinear();
  }
  
  if (nested) {
    regionDomain = field.region.level(0).munged(munged).domain();
    scale.region = scaleBand().domain(regionDomain).padding(this.regionPadding());
    
  }
  if (this.isFacet()) {
    scale.color = this.updateColorScale(regionDomain, keep);
    return this;
  } 
  
  const level = 1;
  xDomain = field.x.level(level).munged(munged).domain(this.sortByValue());
  yDomain = field.y.level(level).munged(munged).aggregated(aggregated).domain(0, stacked);

  if (nested || (!nested && (this.mono() === false || stacked))) { //nested
    scale.color = this.updateColorScale(xDomain, keep); //FIXME: need to update current colors
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
  return this;
}

export default _domain;