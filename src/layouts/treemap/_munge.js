import {pack, treemap,hierarchy} from 'd3';
import {countMeasure} from '../../modules/measureField';
import {conditions} from './';
import {ConditionException} from '../../modules/error';
import dimensionField from '../../modules/dimensionField';
import measureField from '../../modules/measureField';

function _munge() {
  let conditionFunc = function (dimensions, measures) {
    const field = this.__execs__.field;
    if (dimensions.length === 0) throw new ConditionException();
    if (this.shape() === 'word' && dimensions.length > 1) throw new ConditionException();
    field.root = dimensionField(dimensions[0]);
    field.leaf = dimensionField(dimensions[dimensions.length-1]);
    if (measures.length === 1) {
      field.color = measureField(measures[0]);
      return conditions[0];
    } else if (measures.length === 0) {
      this.measure(countMeasure);
      field.color = measureField(measures[0]);
      return conditions[1];
    } else throw new ConditionException();
  };
  this.condition(conditionFunc); 
  this.__execs__.munged = this.aggregate(false, true, true, false);
  let root = hierarchy({key:'root', values:this.__execs__.munged}, d => d.values)
    .sum(d => {
      return d.value ? d.value[this.measureName()] : 0;
    });

  if (this.sortByValue() === 'ascending') {
    root.sort(function(a, b) { return a.value - b.value; });
  } else if (this.sortByValue() === 'descending') {
    root.sort(function(a, b) { return b.value - a.value; });
  }
  let size = this.size() ? this.size().range : this.innerSize(true);
  if (this.shape() === 'pack') {
    let packGen = pack().size(size);
    root = packGen(root);
  } else {
    let treemapGen = treemap().size(size)
      .paddingTop(this.font()['font-size'] + 4)
    root = treemapGen(root);
  }
  this.__execs__.munged = root;
}

export default _munge;