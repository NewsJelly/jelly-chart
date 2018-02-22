import {extent, scaleBand, scaleLinear} from 'd3';
import {continousScale} from '../../modules/transform';

function _scale(keep) {
  const scale = this.scale();
  const munged = this.__execs__.munged;
  const facet = this.facet();
  const field = this.__execs__.field;
  const aggregated = this.aggregated();
  let xAt = this.axisX();
  let yAt = this.axisY();

  let regionDomain, rDomain;
  
  if (this.isColor()) {
    regionDomain = field.region.munged(munged).domain();
    scale.color = this.updateColorScale(regionDomain, keep);
  }

  if (this.isFacet()) {
    scale.region  = scaleBand().domain(regionDomain).padding(this.regionPadding());
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
  const data = aggregated ? this.data().children : this.data();
  let xDomain = extent(data, d => (aggregated ? d.data : d)[field.x.field()]);
  let yDomain = extent(data, d => (aggregated ? d.data : d)[field.y.field()]);
  
  scale.x = continousScale(xDomain, undefined, field.x);
  scale.y = continousScale(yDomain, undefined, field.y);

  if (this.isSized()) {
    rDomain = extent(data, d => d[field.radius.field()]);
    scale.r = scaleLinear().domain(rDomain).range(this.size().range);
  }
  
  this.setCustomDomain('x', xDomain);
  this.setCustomDomain('y', yDomain);
  
  this.thickness(yAt, scale.y, false, false);
  this.thickness(xAt, scale.x, true, false);
  
  const innerSize = this.innerSize();
  scale.x.rangeRound([0, innerSize.width]);
  scale.y.rangeRound([innerSize.height, 0]); //reverse
}

export default _scale;