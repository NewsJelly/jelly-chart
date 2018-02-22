/**
 * returns all regions
 * @memberOf Core#
 * @function
 * @return {d3Selection} regions
 */
function regions() {
  return this.__execs__.canvas.selectAll(this.regionName());
}

export default regions;