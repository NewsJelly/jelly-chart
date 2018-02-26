import {scaleBand, scaleLinear} from 'd3';
import {zeroPoint} from '../../modules/util';
function _domain() {
  const scale = this.scale();
  const munged = this.__execs__.munged;
  const field = this.__execs__.field;
  let yDomain, xDomain, colorDomain;
  
  scale.x = scaleBand();
  scale.y = scaleBand();
  scale.color = scaleLinear();
  
  xDomain = field.x.munged(munged).level(0).domain();
  yDomain = field.y.munged(munged).level(1).domain();
  colorDomain = field.color.munged(munged).level(1).domain();

  scale.x.domain(xDomain);
  scale.y.domain(yDomain);
  if (zeroPoint(colorDomain)) {
    scale.color.domain([colorDomain[0], 0, colorDomain[colorDomain.length-1]])
  } else {
    scale.color.domain(colorDomain);
  }
  return this;
}

export default _domain;