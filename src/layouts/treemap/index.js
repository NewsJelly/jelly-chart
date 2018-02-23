import shapeMixin from '../shapeMixin';
import sortMixin from '../sortMixin';
import Default, {continousColorScheme} from '../core';
import {attrFunc, genFunc, mix} from '../../modules/util';
import _munge from './_munge';
import _scale from './_scale';
import _mark from './_mark';
import _spectrum from './_spectrum';
import _tooltip from './_tooltip';

const shapes = ['treemap', 'pack', 'word'];
const conditions = ['normal', 'count'];
const _attrs = {
  color: continousColorScheme,
  reverse: false,
  shape: shapes[0],
  size : null,
  sortByValue: 'natural'
};

/**
 * @class Treemap
 * @augments Default
 * @augments ShapeMixin
 * @augments SortMixin
 */
class Treemap extends mix(Default).with(shapeMixin, sortMixin) {
  constructor() {
    super();
    this.setAttrs(_attrs);
    this.process('munge', _munge, {isPre:true})
      .process('scale', _scale, {isPre: true})
      .process('mark', _mark)
      .process('spectrum', _spectrum)
      .process('tooltip', _tooltip);
  }
  axis() {
    if(!arguments.length) return [];
    return this;
  }
  
  isCount() {
    return this.condition() === conditions[1];
  }
}

Treemap.prototype.reverse = attrFunc('reverse');

export default genFunc(Treemap);
export {conditions, shapes};
