import {scaleBand, scaleLinear} from 'd3';
import {zeroPoint} from '../../modules/util';
function _domain() {
  const scale = this.scale();
  const munged = this.__execs__.munged;
  const field = this.__execs__.field;
  
  const xDomain = field.x.munged(munged).level(0).domain(this.sortByValue());
  const yDomain = field.y.munged(munged).level(1).domain(this.sortByValue());
  const colorDomain = field.color.munged(munged).level(1).domain();

  scale.x = scaleBand().domain(xDomain);
  scale.y = scaleBand().domain(yDomain);
  scale.color = scaleLinear();
  if (zeroPoint(colorDomain)) {
    scale.color.domain([colorDomain[0], 0, colorDomain[colorDomain.length-1]])
  } else {
    scale.color.domain(colorDomain);
  }
  return this;
}

export default _domain;