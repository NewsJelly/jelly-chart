import {scaleBand, scaleLinear, scalePoint, scaleOrdinal} from 'd3';

export default function (type, field) {
  let scale;
  if (type === 'band') {
    scale = scaleBand();
  } else if (type === 'linear') {
    scale = scaleLinear();
  } else if (type === 'point') {
    scale = scalePoint();
  } else if (type === 'ordinal') {
    scale = scaleOrdinal();
  } else {
    throw new Error(`${type} is not an availabe scale type`);
  }
  if (field) scale.__field__ = field;
  scale.type = function() {
    return type;
  }
  scale.field = function(field) {
    if (!arguments.length) return scale.__field__;
    scale.__field__ = field;
    return scale;
  }
  
  scale.domainFromField = function() {
    if (scale.__field__) return scale.domain(scale.__field__.domain());
    else return null;
  }
  return scale;
}