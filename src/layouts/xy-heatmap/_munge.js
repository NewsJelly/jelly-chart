import {countMeasure} from '../../modules/measureField';
import {conditions} from './';
import {ConditionException} from '../../modules/error';
import dimensionField from '../../modules/dimensionField';
import measureField from '../../modules/measureField';

function _munge() {
  let conditionFunc = function (dimensions, measures) {
    const field = this.__execs__.field;
    if (dimensions.length !== 2) throw new ConditionException();
    let d0 = dimensionField(dimensions[0]);
    let d1 = dimensionField(dimensions[1]);
    if (this.reverse()) {
      field.x = d1;
      field.y = d0;
    } else {
      field.x = d0;
      field.y = d1;
    }
    if (dimensions.length === 2) {
      if (measures.length === 0) this.measure(countMeasure);
      field.color = measureField(measures[0]);
      if (measures.length === 0) return conditions[1];
      else if (measures.length === 1) return conditions[0];
    } else throw new ConditionException();
  };
  this.condition(conditionFunc); 
  this.__execs__.munged = this.aggregate(this.reverse(), true);
  this.limitKeys();
}

export default _munge;