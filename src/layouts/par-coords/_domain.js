import {extent, scaleBand, scalePoint} from 'd3';
import {xMeasureName, yMeasureName} from './';
import {continousScale, comparator} from '../../modules/transform';
import interval from '../../modules/interval';

function ordinalDomainFlatten (target, dimensionField) {
  let domain = [];
  target.forEach(d => { 
    d = d[dimensionField.field()];
    if (dimensionField.interval()) { //using interval
      d = interval[dimensionField.interval()](d);
    } 
    if (d instanceof Date && domain.findIndex(m => (m - d) === 0) < 0) domain.push(d);
    else if(!domain.includes(d)) domain.push(d);
  });
  domain.sort(comparator(dimensionField.order()));
  return domain;
}

function parCoords(keep) {
  this.axis('x', false);
  const scale = this.scale();
  const measures = this.measures();
  const munged = this.__execs__.munged;
  const field = this.__execs__.field;
  if (this.isColor()) {
    let colorDomain = field.region.munged(munged).domain(); 
    scale.color = this.updateColorScale(colorDomain, keep);
  }
  scale.x = scalePoint().domain(measures.map(d => d.field))
  measures.forEach(m => {
    let domain = extent(this.data(), d => d[m.field]);
    let scaleName = yMeasureName(m);
    scale[scaleName] = continousScale(domain, null, field[scaleName])
    this.setCustomDomain(scaleName, domain);
  });
  return this;
}

function matrix(keep) {
  const scale = this.scale();
  const measures = this.measures();
  const field = this.__execs__.field;
  if (this.isColor()) {
    let colorDomain = ordinalDomainFlatten(this.data(), field.region);
    scale.color = this.updateColorScale(colorDomain, keep);
  }
  scale.region = scaleBand().domain(measures.map(d=> d.field))
  measures.forEach(m => {
    let domain = extent(this.data(), d => d[m.field]);
    let yScaleName = yMeasureName(m);
    scale[yScaleName] = continousScale(domain);
    this.setCustomDomain(yScaleName, domain);
    let xScaleName = xMeasureName(m);
    scale[xScaleName] = continousScale(domain);
    this.setCustomDomain(xScaleName, domain);
  });
}

function _domain(keep) {
  if (this.isParcoords()) parCoords.call(this, keep);
  else matrix.call(this, keep);
}

export default _domain;
