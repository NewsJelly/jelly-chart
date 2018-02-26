import {extent, scaleBand, scalePoint, scaleLinear} from 'd3';
import {continousScale} from '../../modules/transform';

function individualDomain (target, measureField, padding = 0) {
  let field = measureField.field();
  let domain = target.children.map(function(d) {
    return d.data.value[field];
  });
  domain = extent(domain);
  if (padding <= 0) return domain;
  let dist = Math.abs(domain[0] - domain[1]);
  dist *= padding * 0.5;
  return [domain[0] - dist, domain[1] + dist];
}


function _domain(keep) {
  const scale = this.scale();
  const munged = this.__execs__.munged;
  const nested = this.isNested();
  const stacked = this.isStacked();
  const aggregated = this.aggregated();
  const field = this.__execs__.field;
  const level = 1;
  const isMixed = this.isMixed();
  const individualScale = this.isIndividualScale();

  let yDomain, xDomain;
  let regionDomain;
  
  scale.y = scaleLinear();
  if (nested) {
    regionDomain = field.region.level(0).munged(munged).domain(); 
    scale.color = this.updateColorScale(regionDomain, keep);
  }

  if (this.isFacet()) { 
    scale.region  = scaleBand().domain(regionDomain).padding(this.regionPadding());
    return;
  } 
  
  xDomain = field.x.munged(munged).level(level).domain();
  yDomain = field.y.munged(munged).level(level).aggregated(aggregated).domain(0, stacked);
  
  //use scaleLinear when domain is number
  let isNumberDomain = true;
  for (let i = 0; i < xDomain.length; i++) {
    let d = xDomain[i];
    if(isNaN(d)) {
      isNumberDomain = false;
      break;
    } 
  }
  if (this.scaleBandMode()) {
    scale.x = scaleBand().padding(this.padding());
  } else if (field.x.interval() || isNumberDomain) { 
    if (field.x.order() === 'natural') {
      if (xDomain[0] instanceof Date) xDomain = extent(xDomain); 
      else xDomain = extent(xDomain.map(d => +d)); 
    } else {
      xDomain = [xDomain[0], xDomain[xDomain.length-1]]
    }
    scale.x = continousScale(xDomain, null, field.x);
  } else {
    scale.x = scalePoint().padding(this.padding());
  }
  scale.x.domain(xDomain);
  this.setCustomDomain('y', yDomain);

  if (isMixed && individualScale) {
    munged.forEach(m => {
      let domain = individualDomain(m, field.y, this.padding());
      m.scale = scaleLinear().domain(domain).nice();
      m.scale._defaultDomain = domain;
      if (this.isMixed()) {
        let measure = this.measures().find(d => d.field === m.data.key);
        if (measure && measure.customDomain) {
          m.scale._defaultDomain = domain;
          m.scale.domain(measure.customDomain);
        }
      }
    });
  }
  return this;
}

export default _domain;