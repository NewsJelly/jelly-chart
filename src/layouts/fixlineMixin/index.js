import {attrFunc} from '../../modules/util';

const _attrs = {
  fixLine: false
}

const fixLineMixin = Base => {
  /**
   * adds FitLine features
   * @mixin FixLineMixin
   */
  let FixLineMixin = class extends Base {
    constructor() {
      super();
      this.setAttrs(_attrs);
    }
  }
  
  /**
   * If fixLine is specified value, it draw horizon fixed line.
   * @function
   * @example
   * fixLineMixin.fixLine(50)
   * @param {number, boolean} [fixLine=false] If is not false, drawn fixed line.
   * @return {fixLine|Line}
   */
  FixLineMixin.prototype.fixLine = attrFunc('fixLine');
  return FixLineMixin;
}

export default fixLineMixin;