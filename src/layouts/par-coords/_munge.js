import {conditions, xMeasureName, yMeasureName, shapes} from './';
import {ConditionException} from '../../modules/error';
import dimensionField from '../../modules/dimensionField';
import measureField from '../../modules/measureField';

function _series(target, measures, isColor = false) {
  return target.map(d => measures.map(m => {
   return {data: {x:m.field, y: (isColor ? d.data: d)[m.field]}}
  }));
}
function _munge() {
  let conditionFunc = function (dimensions, measures) {
    const field = this.__execs__.field;
    if (measures.length < 2) throw new ConditionException();
    field.x = dimensionField(this.mixedDimension());
    measures.forEach(m => {
      field[yMeasureName(m)] = measureField(m);
      if(this.shape() === shapes[1]) field[xMeasureName(m)] = measureField(m);
    })
    if (dimensions.length === 0 ) return conditions[0];
    else if (dimensions.length === 1 ) {
      field.region = dimensionField(dimensions[0]);
      return conditions[1];
    } 
    else throw new ConditionException();
  };
  this.condition(conditionFunc); 
  
  let result;
  let measures = this.measures();
  
  this.limitRows();

  if (this.shape() === shapes[0]) {
    if (this.isColor()) { //nest
      result = this.aggregate(false, false);
      result.forEach(d => { //series structure
        d.key = d.data.key;
        d.children = _series(d.children, measures, true);
      });
    } else {
      result = [{parent: null, children: _series(this.data(), measures)}];
    }
  } else {
    result = [];
    measures.forEach(x => {
      measures.forEach(y => {
        result.push({xField:x,yField:y,children:this.data()});
      });
    });
  }
  
  this.__execs__.munged = result;
}

export default _munge;