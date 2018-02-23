import paddingMixin from '../paddingMixin';
import seriesMixin from '../seriesMixin';
import RectLinear from '../rectLinear/';
import {mixedMeasure} from '../../modules/measureField';
import {genFunc, mix} from '../../modules/util';
import _axis from './_axis';
import _munge from './_munge';
import _scale from './_scale';
import _region from './_region';
import _legend from './_legend';
import _facet from './_facet';
import _tooltip from './_tooltip';

const size = {range: [2, 2], scale: 'linear', reverse: false};
const conditions = ['normal'];
const _attrs = {
  padding: 0.05,
  point: false,
  pointRatio : 3,
  regionPadding: 0.1,
  size: size,
};

/**
 * renders a combo chart, having both a bar and a line chart.
 * @class Combo
 * @augments Core
 * @augments RectLinear 
 * @augments PaddingMixin
 */
class Combo extends mix(RectLinear).with(paddingMixin, seriesMixin) {
  constructor() {
    super();
    this.setAttrs(_attrs);
    this.process('munge', _munge, {isPre:true})
      .process('scale', _scale, {isPre:true})
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

export default genFunc(Combo);
export {conditions};
