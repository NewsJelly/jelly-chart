import {continousColorScheme} from '../core';
import RectLinear from '../rectLinear/';
import paddingMixin from '../paddingMixin';
import {attrFunc, genFunc, mix} from '../../modules/util';
import _munge from './_munge';
import _scale from './_scale';
import _mark from './_mark';
import _axis from './_axis';
import _spectrum from './_spectrum';
import _region from './_region';
import _tooltip from './_tooltip';

const conditions = ['normal', 'count'];
const _attrs = {
  color: continousColorScheme,
  padding: 0.05,
  reverse: false
};

/**
 * @class XYHeatmap
 * @augments RectLinear
 * @augments PaddingMixin
 */
class XYHeatmap extends mix(RectLinear).with(paddingMixin) {
  constructor() {
    super();
    this.setAttrs(_attrs);
    this.process('munge', _munge, {isPre:true})
      .process('scale', _scale, {isPre: true})
      .process('region', _region)
      .process('axis', _axis)
      .process('mark', _mark)
      .process('spectrum', _spectrum)
      .process('tooltip', _tooltip);
  }

  isCount() {
    return this.condition() === conditions[1];
  }
}

XYHeatmap.prototype.reverse = attrFunc('reverse');

export default genFunc(XYHeatmap);
export {conditions};
