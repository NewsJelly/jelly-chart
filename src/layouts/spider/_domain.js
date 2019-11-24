import {extent, scalePoint, scaleLinear} from 'd3';
import {yMeasureName} from './';
import {continousScale} from '../../modules/transform';

function _domain(keep){
  const scale = this.scale();
  const measures = this.measures();
  const munged = this.__execs__.munged;
  const field = this.__execs__.field;
  const innerSize = this.innerSize();

  let colorDomain = field.region.munged(munged).domain();
  scale.color = this.updateColorScale(colorDomain, keep);

  scale.x = scalePoint().domain(measures.map(d => d.field));
  let domain;
  measures.forEach(m => {
    domain = extent(this.data(), d => d[m.field]);

    let scaleName = yMeasureName(m)
    scale[scaleName] = continousScale(domain, null, field[scaleName]);
    this.setCustomDomain(scaleName, domain);
  });
  scale.y = scaleLinear().domain(domain).range([innerSize.height, 0]);
  return this;
}

export default _domain;