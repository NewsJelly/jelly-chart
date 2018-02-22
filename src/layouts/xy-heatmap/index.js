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
  }

  isCount() {
    return this.condition() === conditions[1];
  }
  
  renderLayout() { 
    this.reset();
    this.renderFrame();
    _munge.call(this);
    _scale.call(this);
    this.renderCanvas();
    _region.call(this);
    _axis.call(this); 
    _mark.call(this); 
    _spectrum.call(this);
    _tooltip.call(this);
  }
}

XYHeatmap.prototype.reverse = attrFunc('reverse');

export default genFunc(XYHeatmap);
export {conditions};
