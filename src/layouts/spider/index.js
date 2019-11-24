import seriesMixin from '../seriesMixin';
import paddingMixin from '../paddingMixin';
import Default from '../core';
import {attrFunc, genFunc, mix} from '../../modules/util';
import _axis from './_axis';
import _domain from './_domain';
import _mark from './_mark';
import _munge from './_munge';
import _range from './_range';
import _region from './_region';
import _legend from './_legend';
import _tooltip from './_tooltip';

const size = {range: [3, 3], scale: 'linear'};
const conditions = ['normal'];
const _attrs = {
  name: 'Spider',
  level: 5,
  showLevelTick: false,
  maxValue: null,
  point: true,
  pointRatio: 2,
  size: size,
  regionPadding: 0.1,
  formatString: null,
  showPoint: true,
  zeroOffset: true,
}

class Spider extends mix(Default).with(seriesMixin, paddingMixin){
  constructor() {
    super();
    this.setAttrs(_attrs);
    this.process('munge', _munge, {isPre: true})
      .process('domain', _domain, {isPre: true})
      .process('range', _range, {isPre: true})
      .process('axis', _axis)
      .process('region', _region)
      .process('mark', _mark)
      .process('legend', _legend)
      .process('tooltip', _tooltip);
  }

  renderCanvas() {
    return super.renderCanvas();
  }

  muteFromLegend(legend) {
    this.muteRegions(legend.key);
  }

  muteToLegend(d) {
    this.muteLegend(d.key);
  }

  demuteFromLegend(legend) {
    this.demuteRegions(legend.key);
  }

  demuteToLegend(d) {
    this.demuteLegend(d.key);
  }
}

function yMeasureName (measure) {
  return 'y-' + (measure.field ? measure.field : measure);
}

Spider.prototype.formatString = attrFunc('formatString');
Spider.prototype.level = attrFunc('level');
Spider.prototype.maxValue = attrFunc('maxValue');
Spider.prototype.showLevelTick = attrFunc('showLevelTick');
Spider.prototype.showPoint = attrFunc('showPoint');

export default genFunc(Spider);
export {yMeasureName, conditions};
