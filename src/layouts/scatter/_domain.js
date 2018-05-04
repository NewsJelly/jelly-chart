import {extent, scaleBand, scaleLinear} from 'd3';
import {continousScale} from '../../modules/transform';

function _domain() {
  const keep = this.keep();
  const scale = this.scale();
  const munged = this.__execs__.munged;
  const field = this.__execs__.field;
  const aggregated = this.aggregated();
  const viewInterval = this.viewInterval();

  let regionDomain, rDomain;
  
  if (this.isColor()) {
    regionDomain = field.region.munged(munged).domain();
    scale.color = this.updateColorScale(regionDomain, keep);
  }
  if (this.isFacet()) {
    scale.region = scaleBand().domain(regionDomain).padding(this.regionPadding());
    return;
  }

  const data = aggregated ? this.data().children : this.data();
  let xDomain = extent(data, d => (aggregated ? d.data : d)[field.x.field()]);
  let yDomain = extent(data, d => (aggregated ? d.data : d)[field.y.field()]);
  
  scale.x = continousScale(xDomain, undefined, field.x);
  scale.y = continousScale(yDomain, undefined, field.y);

  if (this.isSized()) {
    rDomain = extent(data, d => d[field.radius.field()]);
    scale.r = scaleLinear().domain(rDomain);
  }
  if (!keep && viewInterval) {
    xDomain = this.limitViewInterval(scale.x, xDomain);
  } else if (keep && this.stream()) {
    xDomain = this.limitViewInterval(scale.x, xDomain, true);
  }

  this.setCustomDomain('x', xDomain);
  this.setCustomDomain('y', yDomain);

  return this;
}

export default _domain;