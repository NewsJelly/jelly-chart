import {extent, scaleLinear} from 'd3';
import {zeroPoint} from '../../modules/util';

function _domain() {
  const scale = this.scale();
  const munged = this.__execs__.munged;
  let colorDomain = extent(munged.leaves(), d => d.value);
  scale.color = scaleLinear()

  if (zeroPoint(colorDomain)) {
    scale.color.domain([colorDomain[0], 0, colorDomain[colorDomain.length-1]])
  } else {
    scale.color.domain(colorDomain);
  }
  return this;
}

export default _domain;