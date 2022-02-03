import {attrFunc} from '../../modules/util';

const _attrs = {
  stacked: false,
  normalized: false
}

const stackMixin = Base => {
  /**
   * @mixin StackMixin
   */
  let StackMixin = class extends Base {
    constructor() {
      super();
      this.setAttrs(_attrs);
    }
  }
  /**
   * If stacked is true, renders stacked marks, such as stacked bar and stacked area chart. If stacked is not specified, returns the current stacked setting.
   * @memberOf StackMixin
   * @function
   * @example
   * stackMixin.stacked(true)
   * @param {boolean} [stacked=false]
   * @return {stacked|StackMixin}
   */
  StackMixin.prototype.stacked = attrFunc('stacked');
  /**
   * If stacked and normalized are true, renders normalized stacked marks, such as normalized stacked bar and normalized stacked area chart. If normalized is not specified, returns the current normalized setting.
   * @memberOf StackMixin
   * @function
   * @example
   * stackMixin.normalized(true)
   * @param {boolean} [normalized=false]
   * @return {normalized|StackMixin}
   */
  StackMixin.prototype.normalized = attrFunc('normalized');

  return StackMixin;
}



export default stackMixin;
