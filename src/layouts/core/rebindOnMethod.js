import {rebindOnMethod} from '../../modules/util';
/**
 * @private
 * @param {d3Dispatch} listeners 
 */
export default function(listeners) {
  return rebindOnMethod(this, listeners);
}