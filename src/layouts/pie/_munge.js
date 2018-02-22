import {pie} from 'd3';
import dimensionField from '../../modules/dimensionField';
import measureField from '../../modules/measureField';
import {countMeasure} from '../../modules/measureField';
import {conditions} from './';
import {ConditionException} from '../../modules/error';

function _munge() {
  let conditionFunc = function (dimensions, measures) {
    const field = this.__execs__.field;
    if (dimensions.length === 1) {
      if (measures.length === 0) this.measure(countMeasure);
      field.r = measureField(measures[0]);
      field.region = dimensionField(dimensions[0]);
      if (measures.length === 0) return conditions[0];
      else if (measures.length === 1) return conditions[1];
    }
    else throw new ConditionException();
  };
  this.condition(conditionFunc);
  this.__execs__.munged = this.aggregate(false, true, false, false);
  this.limitKeys();
  const field = this.__execs__.field;
  const pieGen = pie().value(d => d.value[field.r.valueName()]).padAngle(this.padding()).sortValues(null);
  const result = pieGen(this.__execs__.munged)
  result.forEach(d => d.key = d.data.key);
  if (field.region.interval()) { 
    result.forEach(d => { d.data.key = new Date(d.data.key)});
  }
  this.__execs__.munged = result;
}

export default _munge;