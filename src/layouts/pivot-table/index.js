import {continousColorScheme} from '../core';
import RectLinear from '../rectLinear/';
import paddingMixin from '../paddingMixin';
import sortMixin from '../sortMixin';
import {attrFunc, genFunc, mix} from '../../modules/util';
import _munge from './_munge';
import _domain from './_domain';
import _range from "./_range";
import _mark from './_mark';
import _spectrum from './_spectrum';
import _region from './_region';
import _tooltip from './_tooltip';

const conditions = ['normal', 'count'];
const _attrs = {
  name: 'PivotTable',
  color: continousColorScheme,
  headerFont: null,
  labelFont: null,
  borderColor: '#dddddd',
  headerFontColor: '#333333',
  headerBgColor: '#eeeeee',
  padding: 15,
  reverse: false
};

/**
 * @class PivotTable
 * @augments RectLinear
 * @augments PaddingMixin
 */
class PivotTable extends mix(RectLinear).with(paddingMixin, sortMixin) {
  constructor() {
    super();
    this.setAttrs(_attrs);
    this.process('munge', _munge, {isPre:true})
      .process('domain', _domain, {isPre: true})
      .process('range', _range, {isPre: true})
      .process('region', _region)
      .process('mark', _mark)
      .process('spectrum', _spectrum)
      .process('tooltip', _tooltip);
  }

  isCount() {
    return this.condition() === conditions[1];
  }
}

PivotTable.prototype.borderColor = attrFunc('borderColor');
PivotTable.prototype.headerFontColor = attrFunc('headerFontColor');
PivotTable.prototype.headerBgColor = attrFunc('headerBgColor');
PivotTable.prototype.labelFont = attrFunc('labelFont');

export default genFunc(PivotTable);
export {conditions};
