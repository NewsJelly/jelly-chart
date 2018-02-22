import {scaleBand, scaleLinear} from 'd3';
import {zeroPoint} from '../../modules/util';

function _scale() {
  const scale = this.scale();
  const munged = this.__execs__.munged;
  const field = this.__execs__.field;
  let xAt = this.axisX();
  let yAt = this.axisY();
  let yDomain, xDomain, colorDomain;
  
  scale.x = scaleBand();
  scale.y = scaleBand();
  scale.color = scaleLinear();
  
  xDomain = field.x.munged(munged).level(0).domain();
  yDomain = field.y.munged(munged).level(1).domain();
  colorDomain = field.color.munged(munged).level(1).domain();
  
  field.x.axis(xAt);
  field.y.axis(yAt);
  scale.x.domain(xDomain);
  scale.y.domain(yDomain);
  this.thickness(yAt, scale.y, false, true);
  this.thickness(xAt, scale.x, true, true);

  const innerSize = this.innerSize();  
  scale.x.rangeRound([0, innerSize.width]).padding(this.padding());
  scale.y.rangeRound([0, innerSize.height]).padding(this.padding());
  
  if (zeroPoint(colorDomain)) {
    scale.color.domain([colorDomain[0], 0, colorDomain[colorDomain.length-1]])
  }
  scale.color.domain(colorDomain).range(this.color());
}



export default _scale;