import dimensionField from '../../modules/dimensionField';
import measureField from '../../modules/measureField';
import {countMeasure, mixedMeasure} from '../../modules/measureField';
import {ConditionException} from '../../modules/error';
import {comparator, stack} from '../../modules/transform';
import {conditions} from './';

function conditionFunc (dimensions, measures) {
  let field = this.__execs__.field;
  if (dimensions.length <= 2 && measures.length <= 1) {
    if(dimensions.length === 2) {
      field.region = dimensionField(dimensions[0]);
      field.x = dimensionField(dimensions[1]);
    } else {
      field.x = dimensionField(dimensions[0]);
    }
    if (measures.length === 0) {
      this.measure(countMeasure);
    }
    field.y = measureField(measures[0]);
    return conditions[measures.length === 0 ? 1 : 0];
  } else if (dimensions.length <=1 && measures.length >= 2) {
    if(dimensions.length === 1) { //mixed
      field.region = dimensionField(dimensions[0]);
    } 
    field.x = dimensionField(this.mixedDimension());
    field.y = measureField(mixedMeasure).mixed(true).measures(measures);
    return conditions[2];
  } 
  else throw new ConditionException();
}

function _munge() {
  this.condition(conditionFunc);
  const field = this.__execs__.field;
  const mixed = this.isMixed();

  if (this.aggregated()) {
    this.__execs__.munged = [this.data()];
  } else {
    if (mixed) {
      this.__execs__.munged = this.aggregateMixed(this.facet() && !this.stacked());//use pseudo dimension and measure
    } else {
      this.__execs__.munged = this.aggregate(this.facet() && !this.stacked());
    }
    if (!this.isNested()) this.__execs__.munged = [this.__execs__.munged[0].parent];
  } 

  if (this.stacked()) { 
    if (!field.region) {
      stack(this.__execs__.munged, field.y, this.normalized());
    } else { 
      let domain; 
      this.__execs__.munged.forEach((d,i) => {
        if (field.x.order() === 'natural') {
          if (i === 0) domain = d.children.map(d => d.data.key);
          else d.children.sort(comparator('ascending', domain, true, d => d.data.key))
        }
        stack(d.children, field.y, this.normalized());
      })
    }
  }
}

export default _munge;