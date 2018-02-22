import {attrFunc} from '../../modules/util';

const _attrs = {
  fitLine: false
}

const fitLineMixin = Base => {
  /**
   * adds FitLine features
   * @mixin FitLineMixin
   */
  let FitLineMixin = class extends Base {
    constructor() {
      super();
      this.setAttrs(_attrs);
    }
  }
  /**
   * If is true, renders a mean line of serieses or points. If is not specified, returns the current fitLine setting.
   * @memberOf FitLineMixin
   * @function
   * @example
   * fitLineMixin.fitLine(true)
   * @param {boolean} [fitLine=false]
   * @return {fitLine|FitLineMixin}
   */
  FitLineMixin.prototype.fitLine = attrFunc('fitLine');
  return FitLineMixin;
}

export default fitLineMixin;