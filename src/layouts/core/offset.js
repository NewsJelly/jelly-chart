const zeroMargin = {top:0, right:0, bottom:0, left:0};
/**
 * returns offsets around the content area, that includes the {@link Core#margin margin}, {@link Core#legend legend} area
 * @memberOf Core#
 * @function
 * @return {object} {top, right, bottom, left} offset in pixels
 */
function offset() {  
  if (this.zeroOffset()) return zeroMargin;
  let offset = Object.assign({}, this.zeroMargin() ? zeroMargin : this.margin());
  let legend = this.legend();
  if(legend) offset[legend.orient] += legend.thickness;
  return offset;
}

export default offset;