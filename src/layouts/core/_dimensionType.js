import {format, timeFormat} from 'd3';

const dimensionMax = 100;
function _dimensionType(dimension) {
  if (typeof dimension === 'string') {
    return {field: dimension, order: 'natural', max: dimensionMax};
  } else if (typeof dimension === 'object') {
    dimension = Object.assign({}, dimension);
    if (!dimension.max) dimension.max = dimensionMax;
    if (!dimension.order) dimension.order = 'natural';
    if (dimension.format && typeof dimension.format === 'string') {
      try {
        dimension.format = timeFormat(dimension.format);
      } catch (e) {
        try {
          dimension.format = format(dimension.format);
        } catch (e) {
          throw e;
        }
      } 
      
    }
    return dimension;
  }
}

export default _dimensionType;