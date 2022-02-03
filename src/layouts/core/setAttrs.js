import {setAttrs as _setAttrs} from '../../modules/util'

/**
 * @memberOf Core#
 * @function
 * @private
 * @param {*} attrs 
 */
function setAttrs (attrs) {
  _setAttrs(this, attrs);
  return this;
}

export default setAttrs