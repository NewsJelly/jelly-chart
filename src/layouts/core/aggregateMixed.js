import {hierarchy} from 'd3';
import {mixedMeasure} from '../../modules/measureField';
import {summarize} from '../../modules/transform';

/**
 * aggregate data which have N-measures (used in Bar and Line only)
 * @private
 * @memberOf Core#
 * @param {boolean} reverse=false
 * @param {boolean} useHierarchy=true
 * @param {boolean} sum=true
 * @return {hierarchy}
 */
function aggregateMixed (reverse = false, useHierarchy = true, sum = true) {
  let data = this.data();
  let dimensions = this.dimensions();
  let measures = this.measures();
  let results;
  if(dimensions.length === 0) {
    results = measures.map(m => {
      let value = summarize[m.op](data, d => d[m.field]);
      let result = {};
      result.key = m.field; //result[mixedDimension.field] = m.field;
      result.value = {};
      result.value[mixedMeasure.field] = value;
      return result;
    });   
  } else { 
    results = this.aggregate(data, true, false, false);
    if (reverse) {
      results = measures.map(function(m) {
        let result = {};
        result.key = m.field;
        result.values = results.map(function (d) { 
          let result = {};
          result.key = d.key;
          result.value = {};
          result.value[mixedMeasure.field] = d.value[m.field + '-' + m.op];
          return result;
        });
        return result;
      });
    } else {
      results.forEach(function(d) {
        d.values = measures.map(function(m) {
          let result = {};
          result.key = m.field;
          result.value = {}
          result.value[mixedMeasure.field] = d.value[m.field + '-' + m.op];
          return result;
        });
        delete d.value;
      })
    }
  }

  if (useHierarchy) {
    let root = hierarchy({values:results}, function(d){return d.values;});
    if (sum) {
      root.sum(d => d.value ? d.value[mixedMeasure.field] : 0);
    }
    return root.children;
  } else {
    return results;
  }
}

export default aggregateMixed;