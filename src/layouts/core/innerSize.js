/**
 * returns an inner size of chart excepting offsets from the container's size
 * @memberOf Core#
 * @function
 * @param {boolean} needArray If needArray is true, retruns the size in array
 * @return {object|array} returns {width, height} or [width, height] according to needArray
 */
function innerSize(needArray = false) {
  let offset = this.offset();
  let width = this.width() - offset.left - offset.right;
  let height = this.height() - offset.top - offset.bottom;
  if (needArray) return [width, height];
  else return {width, height};
} 

export default innerSize;