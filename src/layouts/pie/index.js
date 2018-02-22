import Core from '../core';
import paddingMixin from '../paddingMixin';
import {genFunc, mix} from '../../modules/util';
import _munge from './_munge';
import _scale from './_scale';
import _mark from './_mark';
import _legend from './_legend';
import _tooltip from './_tooltip';

const size = {range: [0, 150], scale: 'linear', reverse: false}; 
const conditions = ['normal', 'count'];
const _attrs = {
  limitKeys: 20,
  padding: 0,
  size: size
};

/**
 * renders a pie chart.
 * @class Pie
 * @augments Core
 * @augments PaddingMixin
 */
class Pie extends mix(Core).with(paddingMixin) {
  constructor() {
    super();
    this.setAttrs(_attrs);
  }

  axis() {
    if(!arguments.length) return [];
    return this;
  }
  
  muteFromLegend(legend) {
    this.muteNodes(legend.key);
  }
  
  demuteFromLegend(legend) {
    this.demuteNodes(legend.key);
  }
  
  muteToLegend(d) {
    this.muteLegend(d.data.key);
  }
  
  demuteToLegend(d) {
    this.demuteLegend(d.data.key);
  }
  
  isCount() {
    return this.condition() === conditions[1];
  }
  
  renderLayout(keep) {
    this.reset(keep);
    this.renderFrame();
    _munge.call(this);
    _scale.call(this, keep);
    this.renderCanvas();
    _mark.call(this); 
    _legend.call(this);
    _tooltip.call(this);
  }
}

export default genFunc(Pie);
export {conditions};
