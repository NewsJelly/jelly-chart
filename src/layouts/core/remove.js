/**
 * reset and remove the canvas in the chart area
 * @memberOf Core#
 * @function
 * @return {Core} 
 */
export default function() {
  this.reset();
  if (this.__execs__.canvas) {
    this.__execs__.canvas.node().parentNode.parentNode.remove();
    this.__execs__.canvas = null;
  }
  return this;
}