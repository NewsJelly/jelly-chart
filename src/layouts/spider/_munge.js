import {conditions, yMeasureName} from './';
import {ConditionException} from '../../modules/error';
import dimensionField from '../../modules/dimensionField';
import measureField from '../../modules/measureField';

function _munge() {
  let conditionFunc = function (dimensions, measures) {
    const field = this.__execs__.field;
    if(dimensions.length === 1 && measures.length >= 3) {
      field.region = dimensionField(dimensions[0]);
      field.x = dimensionField(this.mixedDimension());
      measures.forEach(m => {
        field[yMeasureName(m)] = measureField(m);
      });
      return conditions[0];
    } else throw new ConditionException();
  };
  this.condition(conditionFunc);

  let measures = this.measures();
  let result = this.aggregate(false, true);
  result.forEach(d => {
    d.key = d.data.key;
    d.children = measures.map(m => {
      return {field: m.field, value: d.data.value[m.field + '-' + m.op]};
    });

    this.__execs__.munged = result;
  });
}
export default _munge;
