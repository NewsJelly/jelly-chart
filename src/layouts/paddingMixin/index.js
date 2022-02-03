import {attrFunc, setMethodsFromAttrs} from '../../modules/util';

const _attrs = {
  padding: 0,
  regionPadding: 0
}

const paddingMixin = Base => {
  /**
   * @mixin PaddingMixin
   */
  let PaddingMixin = class extends Base {
    constructor() {
      super();
      this.setAttrs(_attrs);
    }
  }
  /**
   * sets the padding to the same padding value. Depending on the chart type and its scale type, padding will be applied differently. If padding is not specified, returns the instance's current padding value.
   * @memberOf PaddingMixin
   * @function
   * @example
   * paddingMixin.padding(0.5)
   * paddingMixin.padding()
   * @param {number} [padding=0]
   * @return {padding|PaddingMixin}
   */
  PaddingMixin.prototype.padding = attrFunc('padding');
    /**
   * sets the regionPadding to the same padding value. Depending on the chart type and its scale type, it will be applied differently. If regionPadding is not specified, returns the instance's current regionPadding value.
   * @memberOf PaddingMixin
   * @function
   * @example
   * paddingMixin.regionPadding(0.5)
   * paddingMixin.regionPadding()
   * @param {number} [regionPadding=0]
   * @return {regionPadding|PaddingMixin}
   */
  PaddingMixin.prototype.regionPadding = attrFunc('regionPadding');
  setMethodsFromAttrs(PaddingMixin, _attrs);
  return PaddingMixin;
}

export default paddingMixin;