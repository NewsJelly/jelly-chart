import {ConditionException} from '../../modules/error';
import {conditions, latMeasure, lngMeasure} from './';

function _munge() {
  let conditionFunc = function (dimensions, measures) {
    const field = this.__execs__.field;
    if (this.addr()) {
      if (measures.length < 1) throw new ConditionException();
      field.addr = measures[0];
      field.lat = latMeasure;
      field.lng = lngMeasure;
      if (measures.length === 2) {
        field.radius = measures[1];
        return conditions[0];
      } else if (measures.length === 1) {
        return conditions[1];
      } 
    } else {
      if (measures.length < 2) throw new ConditionException()
      if (measures.length === 3) {
        field.lat = measures[0]
        field.lng = measures[1]
        field.radius = measures[2];
        return conditions[0];
      } else if (measures.length === 2) {
        field.lat = measures[0]
        field.lng = measures[1]
        return conditions[1];
      } 
    }
    if (dimensions.length === 1) {
      field.name = dimensions[0];
    }
    throw new ConditionException();
  };
  this.condition(conditionFunc);
  this.limitRows();
  const field = this.__execs__.field;
  if (this.isSized()) this.data().sort(function (a, b) { return b[field.radius.field] - a[field.radius.field]; });
  this.__execs__.munged = this.data();
}

export default _munge;