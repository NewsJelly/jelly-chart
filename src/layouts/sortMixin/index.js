import sortByValue from './sortByValue';

const orders = ['natural', 'ascending', 'descending'];
const _attrs = {
  sortByValue: orders[0]
}

const sortMixin = Base => {
  /**
   * @mixin SortMixin
   */
  let SortMixin = class extends Base {
    constructor() {
      super();
      this.setAttrs(_attrs);
    }
  }
  SortMixin.prototype.sortByValue = sortByValue;
  return SortMixin;
}



export default sortMixin;
export {orders};