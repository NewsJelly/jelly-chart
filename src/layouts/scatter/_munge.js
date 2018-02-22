import {conditions} from './';
import {ConditionException} from '../../modules/error';
import dimensionField from '../../modules/dimensionField';
import measureField from '../../modules/measureField';

function _munge() { 
  let conditionFunc = function (dimensions, measures) {
    const field = this.__execs__.field;
    if (measures.length < 2) throw new ConditionException();
    field.x = measureField(measures[0]);
    field.y = measureField(measures[1]);
    if (dimensions.length === 0 && measures.length === 2) return conditions[0];
    else if (dimensions.length === 1 && measures.length === 2) {
      field.region = dimensionField(dimensions[0]);
      return conditions[1];
    } else if (dimensions.length === 0 && measures.length === 3) {
      field.radius = measureField(measures[2]);
      return conditions[2];
    } else if (dimensions.length == 1 && measures.length === 3) {
      field.radius = measureField(measures[2]);
      field.region = dimensionField(dimensions[0]);
      return conditions[3];
    }
    else throw new ConditionException();
  };
  this.condition(conditionFunc);
  this.limitRows();
  if (this.aggregated()) {
    this.__execs__.munged = [this.data()];
  } else if (this.isColor()) {
    this.__execs__.munged = this.aggregate(false, false)
    .map(d => {
      d.key = d.data.key
      return d;
    });
  } else {
    this.__execs__.munged = [this.data().map(d => {return {data:d}})];
  }
}

export default _munge;