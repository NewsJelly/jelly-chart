import {attrFunc} from '../../modules/util';

const _attrs = {
  shape: null
}

const shapeMixin = Base => {
  /**
   * @mixin ShapeMixin
   */
  let ShapeMixin = class extends Base {
    constructor() {
      super();
      this.setAttrs(_attrs);
    }
  }
  /**
   * selects a shape type. Available shapes depends on the chart type. If shape is not specified, returns the current shape setting.
   * @memberOf ShapeMixin
   * @function
   * @example
   * line.shape('area')
   * parCoords.shape('scatter-matrix')
   * treemap.shape('pack')
   * @param {string} [shape]
   * @return {shape|ShapeMixin}
   */
  ShapeMixin.prototype.shape = attrFunc('shape');
  return ShapeMixin;
}

export default shapeMixin;