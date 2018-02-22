/**
 * limits the number of elements length from the {@link data data}  as many as limitNumber, in order.
 * @memberOf Core#
 * @function
 * @example
 * core.limitRows(100);
 * @param {number} limitNumber
 * @return {Core}
 */
function limitRows(limitNumber) {
  if(!arguments.length) {
    let num = this.__attrs__.limitRows;
    if (num) {
      let data = this.data();
      if (this.aggregated()) {
        data.children = data.children.slice(0, num);
      } else {
        data = data.slice(0, num);
      }
      this.data(data);
    }
  } else {
    this.__attrs__.limitRows = limitNumber;
  }
}

export default limitRows;