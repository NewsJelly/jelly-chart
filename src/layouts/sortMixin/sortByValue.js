import {orders} from './index';

/**
 * If is true or a comparator string(natural, ascending, descending), sort nodes according to their values. If sortByValue is not specified, returns the current sortByValue setting.
 * @memberOf SortMixin#
 * @function
 * @example 
 * bar.sort('ascending') //sort bars in ascending order.
 * @param {boolean|string} [sortByValue=false] (false|natural|ascending|descending)
 * @return {sortByValue|SortMixin}
 */
function sortByValue (sortByValue) {
  if (!arguments.length) return this.__attrs__.sortByValue;
  if (sortByValue && (typeof sortByValue !== 'string' || !orders.find(o => o === sortByValue))) {
    sortByValue = 'natural';
  }
  this.__attrs__.sortByValue = sortByValue;
  return this;
}

export default sortByValue;