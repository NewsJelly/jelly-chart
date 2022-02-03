import {dispatch} from 'd3';
import {attrFunc} from '../../modules/util';

import brushGen from './brushGen';
import brushMove from './brushMove';

const _attrs = {
  brush : false,
  brushGen: null
}
const brushMixin = Base => {
  /**
   * Adds Brush Features
   * @mixin BrushMixin
   */
  let BrushMixin = class extends Base {
    constructor() {
      super();
      this.setAttrs(_attrs);
      this.__execs__.brush = null;
      this.__execs__.brushDispatch = dispatch('brushStart', 'brushed', 'brushEnd');
      this.rebindOnMethod(this.__execs__.brushDispatch);
    }
  }
  /**
   * If brush is specified, sets the brush settings and returns the instance itself. If brush is true, renders its brush. If brush is not specified, returns the instance's current brush setting.
   * @memberOf BrushMixin
   * @function
   * @example
   * brush.brush(true); //shows brush
   * @param {boolean} [brush=false]
   * @return {brush|BrushMixin}
   */
  BrushMixin.prototype.brush = attrFunc('brush');
  /**
   * @private
   */
  BrushMixin.prototype.brushGen= brushGen;
  /**
   * @private
   */
  BrushMixin.prototype.brushMove= brushMove;
  return BrushMixin;
}

export default brushMixin;