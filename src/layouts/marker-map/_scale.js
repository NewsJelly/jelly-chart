import {extent, scaleLinear} from 'd3';

function _scale() {
  const scale = this.scale();
  const field = this.__execs__.field;

  if (this.isSized()) {
    let rDomain = extent(this.data(), d => d[field.radius.field]);
    scale.r = scaleLinear().domain(rDomain.map(d => Math.sqrt(d)));
  }
}

export default _scale;