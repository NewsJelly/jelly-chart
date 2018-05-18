import {format, timeFormat} from 'd3';

const dimensionMax = 100;
function setFormat(f) {
  if (f && typeof f === 'string') {
    try {
      return timeFormat(f);
    } catch (e) {
      try {
        return format(f);
      } catch (e) {
        throw e;
      }
    } 
  } else {
    return null;
  }
}
function _dimensionType(dimension) {
  if (typeof dimension === 'string') {
    return {field: dimension, order: 'natural', max: dimensionMax};
  } else if (typeof dimension === 'object') {
    dimension = Object.assign({}, dimension);
    if (!dimension.max) dimension.max = dimensionMax;
    if (!dimension.order) dimension.order = 'natural';
    dimension.format = setFormat(dimension.format);
    dimension.formatSub = setFormat(dimension.formatSub);
    return dimension;
  }
}

export default _dimensionType;