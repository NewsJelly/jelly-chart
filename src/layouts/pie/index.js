import Core from '../core';
import paddingMixin from '../paddingMixin';
import sortMixin from '../sortMixin';
import {attrFunc, genFunc, mix} from '../../modules/util';
import _munge from './_munge';
import _domain from './_domain';
import _mark from './_mark';
import _legend from './_legend';
import _tooltip from './_tooltip';

const size = {range: [0, 150], scale: 'linear', reverse: false}; 
const conditions = ['normal', 'count'];
const shapes = ['normal', 'gauge'];
const _attrs = {
  limitKeys: 20,
  padding: 0,
  size: size,
  shape: shapes[0],
  maxValue: 100
};

/**
 * renders a pie chart.
 * @class Pie
 * @augments Core
 * @augments PaddingMixin
 * @augments SortMixin
 */
class Pie extends mix(Core).with(paddingMixin, sortMixin) {
  constructor() {
    super();
    this.setAttrs(_attrs);
    this.process('munge', _munge, {isPre:true})
      .process('domain', _domain, {isPre: true})
      .process('mark', _mark)
      .process('legend', _legend)
      .process('tooltip', _tooltip);
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
}

// Pie 유형 선택 옵션 (일반, 게이지)
Pie.prototype.shape = attrFunc('shape');
// 게이지 차트 설정 시 max value 값 설정 옵션
Pie.prototype.maxValue = attrFunc('maxValue');

export default genFunc(Pie);
export {conditions};
