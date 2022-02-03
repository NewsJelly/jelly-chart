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
  //TODO: yBar munged, yLine munged;
  /*
  this.__execs__.munged = this.aggregate(this.facet() && !this.stacked());
    }
    if (!this.isNested()) this.__execs__.munged = [this.__execs__.munged[0].parent];

  aggregate (reverse = false, rollup = true, preFormat = false, useHierarchy = true, sum = true, dimensions, measures) {
  */

  this.__execs__.munged = this.aggregate();
}

export default _munge;
