import paddingMixin from '../paddingMixin';
import seriesMixin from '../seriesMixin';
import sortMixin from '../sortMixin/';
import shapeMixin from '../shapeMixin';
import RectLinear from '../rectLinear/';
import {mixedMeasure} from '../../modules/measureField';
import {genFunc, mix} from '../../modules/util';
import _axis from './_axis';
import _munge from './_munge';
import _domain from './_domain';
import _range from './_range';
import _region from './_region';
import _legend from './_legend';
import _facet from './_facet';
import _tooltip from './_tooltip';
import {attrFunc} from '../../modules/util';
const size = {range: [2, 2], scale: 'linear', reverse: false};
const conditions = ['normal'];
const _attrs = {
  padding: 0.05,
  point: false,
  pointRatio : 3,
  regionPadding: 0.1,
	size: size,
	barWidth: false,
  margin: {top:10, right:0, bottom: 0, left: 0}
};

/**
 * renders a combo chart, having both a bar and a line chart.
 * @class Combo
 * @augments Core
 * @augments RectLinear 
 * @augments PaddingMixin
 * @augments SortMixin
 */
class Combo extends mix(RectLinear).with(paddingMixin, seriesMixin, sortMixin, shapeMixin) {
  constructor() {
    super();
    this.setAttrs(_attrs);
    this.process('munge', _munge, {isPre:true})
      .process('domain', _domain, {isPre:true})
      .process('range', _range, {isPre:true})
      .process('region', _region)
      .process('facet', _facet)
      .process('axis', _axis)
      .process('legend', _legend)
      .process('tooltip', _tooltip)
	}
  /**
   * @override
   */
  measureName() {
    let measures = this.measures();
    let yField;
    if (this.condition() === conditions[2]) yField = mixedMeasure.field; 
    else if (this.aggregated() && measures[0].field === mixedMeasure.field) yField = measures[0].field;
    else yField = measures[0].field + '-' + measures[0].op;
    return yField;
  }

  isCount() {
    return this.condition() === conditions[1];
  }
}

/**
 * If barWidth is specified, sets each bar width(or height on vertical bar) and returns the instance itself. If barWidth is not specified, or barWidth bigger than origin barWidth, just  returns the instance's current barWidth setting. Not surpport Stacked Bar Chart.
 * @function
 * @example
 * bar.orient('horizontal'); // renders the horizontal bar chart
 * @param {boolean|number} [barWidth=false] false or specific number
 * @return {barWidth|Bar}
 */
Combo.prototype.barWidth = attrFunc('barWidth');

export default genFunc(Combo);
export {conditions};
