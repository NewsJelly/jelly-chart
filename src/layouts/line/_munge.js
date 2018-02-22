import {zip} from 'd3';
import dimensionField from '../../modules/dimensionField';
import measureField from '../../modules/measureField';
import {countMeasure, mixedMeasure} from '../../modules/measureField';
import {conditions} from './';
import {ConditionException} from '../../modules/error';
import {comparator, stack} from '../../modules/transform';

function _munge() { 
  let conditionFunc = function (dimensions, measures) {
    const field = this.__execs__.field;
    if (dimensions.length <= 2 && measures.length < 2) {
      if(dimensions[1]) field.region = dimensionField(dimensions[1]);
      field.x = dimensionField(dimensions[0]);
      if (measures.length === 0) this.measure(countMeasure); //use fake-measure for counting
      field.y = measureField(measures[0]);
      if (measures.length === 0) return conditions[1];
      else if (measures.length === 1) return conditions[0];
    } else if (dimensions.length === 1 && measures.length >= 2) {
      field.region = dimensionField(this.mixedDimension());
      field.x = dimensionField(dimensions[0]);
      field.y = measureField(mixedMeasure).mixed(true).measures(measures);
      return conditions[2];
    }
    else throw new ConditionException();
  };
  this.condition(conditionFunc); 
  const field = this.__execs__.field;
  const mixed = this.isMixed();

  if (this.aggregated()) {
    this.__execs__.munged = [this.data()];
  } else if (mixed) { 
    this.__execs__.munged = this.aggregateMixed(true); 
  } else {
    this.__execs__.munged = this.aggregate(true);
    if (!this.isNested()) {
      this.__execs__.munged = [this.__execs__.munged[0].parent];
    } 
  }
  if (this.isStacked()) {
    let munged = this.__execs__.munged;
    let orderList = munged[0].children.map(d => d.data.key);
    //use temporary structure using zip
    munged.forEach( (m,i) => {
      if (i > 0) {
        m.children.sort(comparator('ascending', orderList, true, d => d.data.key));
      }
    }) //sort zipped
    let valuesZipped = munged.map(d => d.children);
    valuesZipped = zip.apply(null, valuesZipped);
    valuesZipped.forEach(d => {
      stack(d, field.y, this.normalized());
    })
  }
}

export default _munge;