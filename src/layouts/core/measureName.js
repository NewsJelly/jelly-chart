import {mixedMeasure} from '../../modules/measureField';

/**
 * get a transformed field name of a measure
 * @memberOf Core#
 * @function
 * @private
 * @param {object} measure
 * @param {string} suffix 
 */
function measureName  (measure, suffix) {
  measure = measure  || this.measures()[0];
  let name = measure.field;
  if (!this.aggregated() || measure.field !== mixedMeasure.field) name += '-' + measure.op;
  return name + (suffix !== undefined ?  ('-' + suffix) : '');
}

export default measureName;