import {extent, scaleLinear} from 'd3';
import {zeroPoint} from '../../modules/util';

function _scale() {
  const scale = this.scale();
  const munged = this.__execs__.munged;
  let colorDomain = extent(munged.leaves(), d => d.value);
  scale.color = scaleLinear().domain(colorDomain);

  if (zeroPoint(colorDomain)) {
    scale.color.domain([colorDomain[0], 0, colorDomain[colorDomain.length-1]])
  }
  scale.color.domain(colorDomain).range(this.color());
}

export default _scale;