import {extent, scaleBand, scalePoint} from 'd3';
import {shapes, xMeasureName, yMeasureName} from './';
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

function _parCoords(keep) {
  const scale = this.scale();
  const measures = this.measures();
  const munged = this.__execs__.munged;
  const innerSize = this.innerSize();
  const field = this.__execs__.field;
  if (this.isColor()) {
    let colorDomain = field.region.munged(munged).domain(); 
    scale.color = this.updateColorScale(colorDomain, keep);
  }

  scale.x = scalePoint().domain(measures.map(d => d.field))
    .rangeRound([0,innerSize.width]);
  measures.forEach(m => {
    let domain = extent(this.data(), d => d[m.field]);
    let scaleName = yMeasureName(m);
    scale[scaleName] = continousScale(domain, null, field[scaleName]).rangeRound([innerSize.height, 0])
    this.setCustomDomain(scaleName, domain);
  });

}

function _matrix(keep) {
  const scale = this.scale();
  const measures = this.measures();
  const innerSize = this.innerSize();
  const field = this.__execs__.field;
  if (this.isColor()) {
    let colorDomain = ordinalDomainFlatten(this.data(), field.region);
    scale.color = this.updateColorScale(colorDomain, keep);
  }
  let regionWidth = Math.min(innerSize.width, innerSize.height);
  scale.region = scaleBand().domain(measures.map(d=> d.field)).rangeRound([0, regionWidth]).padding(this.regionPadding());
  measures.forEach(m => {
    let domain = extent(this.data(), d => d[m.field]);
    let yScaleName = yMeasureName(m);
    scale[yScaleName] = continousScale(domain).rangeRound([scale.region.bandwidth(), 0]);
    this.setCustomDomain(yScaleName, domain);
    let xScaleName = xMeasureName(m);
    scale[xScaleName] = continousScale(domain).rangeRound([0, scale.region.bandwidth()]);
    this.setCustomDomain(xScaleName, domain);
  });
}

function _scale(keep) {
  if (this.shape() === shapes[0]) _parCoords.call(this, keep);
  else _matrix.call(this, keep);
}

export default _scale;