import {attrFunc} from '../../modules/util';

const _attrs = {
  fixLine: false
}

const fixLineMixin = Base => {
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
   * If fixLine is specified value, it draw horizon fixed line.
   * @function
   * @example
   * line.fixLine(50)
   * @param {number, boolean} [fixLine=false] If is not false, drawn fixed line.
   * @return {fixLine|Line}
   */
  FitLineMixin.prototype.fixLine = attrFunc('fixLine');
  return FitLineMixin;
}

export default fixLineMixin;