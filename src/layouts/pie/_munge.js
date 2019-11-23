import {pie, hierarchy, partition, nest} from 'd3';
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
  if (this.shape() !== 'sunburst') { // normal pie chart
    this.__execs__.munged = this.aggregate(false, true, false, false);
    this.limitKeys();

    let field = this.__execs__.field;
    let pieGen = pie().value(d => d.value[field.r.valueName()])
        .padAngle(this.padding())
    if (this.sortByValue()) {
      pieGen.sortValues(this.sortByValue() === 'ascending' ? (a, b) => a - b : (a, b) => b - a);
    }
    let result = pieGen(this.__execs__.munged)
    result.forEach(d => d.key = d.data.key);
    if (field.region.interval()) {
      result.forEach(d => {
        d.data.key = new Date(d.data.key)
      });
    }
    // 게이지 차트에서 dimensions의 집산 결과가 여러개인지 1개인지 체크
    // 게이지 차트의 dimensions 집산 결과는 1개의 종류만 허용
    if (this.shape() === 'gauge') {
      if (result.length !== 1) {
        throw new ConditionException();
      } else {
        this.__execs__.munged = result;
      }
    }
  } else { // sunburst
    let root = hierarchy(this.data()).sum(d => d.value);
    if (this.sortByValue() === 'ascending') {
      root.sort(function(a, b) { return a.value - b.value; });
    } else if (this.sortByValue() === 'descending') {
      root.sort(function(a, b) { return b.value - a.value; });
    }
    this.__execs__.munged = partition().size([2 * Math.PI, root.height + 1])(root);
    this.__execs__.munged = this.__execs__.munged.each(function(d) {
      d.current = d;
    });
  }
}

export default _munge;