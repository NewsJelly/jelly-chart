import {conditions} from './index';
import {ConditionException} from '../../modules/error';
import dimensionField from '../../modules/dimensionField';
import measureField from '../../modules/measureField';

function _munge() { 
  let conditionFunc = function (dimensions, measures) {
    const field = this.__execs__.field;
    if (dimensions.length === 1 && measures.length === 2) {
      field.x = dimensionField(dimensions[0]);
      field.yBar = measureField(measures[0]);
      field.yLine = measureField(measures[1]);
      field.region = dimensionField(this.mixedDimension());
      return conditions[0];
    } else throw new ConditionException();
  };
  this.condition(conditionFunc);
  this.__execs__.munged = this.data();
}

export default _munge;