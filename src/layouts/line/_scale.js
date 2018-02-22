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

function _scale(keep) {
  const scale = this.scale();
  const munged = this.__execs__.munged;
  const individualScale = this.isIndividualScale();
  const nested = this.isNested();
  const stacked = this.isStacked();
  const facet = this.facet();
  const aggregated = this.aggregated();
  const field = this.__execs__.field;
  const isMixed = this.isMixed();
  const level = 1;
  let xAt = this.axisX();
  let yAt = this.axisY();
  let yDomain, xDomain;
  let regionDomain;
  
  scale.y = scaleLinear();
  if (nested) {
    regionDomain = field.region.level(0).munged(munged).domain(); 
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
  let isOrdinal = false;
  if (this.scaleBandMode()) {
    scale.x = scaleBand().padding(this.padding());
    isOrdinal = true;
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
    isOrdinal = true;
  }
  scale.x.domain(xDomain);
  this.setCustomDomain('y', yDomain);
  if (isMixed && individualScale && yAt) {
    yAt.orient = 'left';
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
 
  this.thickness(xAt, scale.x, true, isOrdinal);
  
  const innerSize = this.innerSize();
  scale.x.range([0, innerSize.width]); 
  if (isNumberDomain && !this.scaleBandMode()) {
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
  scale.y.range([innerSize.height, 0]); //reverse
  
  if (individualScale) { //individual scale 
    munged.forEach(m => {
      m.scale.range([innerSize.height, 0])
    });
  }

}

export default _scale;