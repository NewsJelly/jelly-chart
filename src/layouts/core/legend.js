const horizontalThickness = 54;
const verticalThickness = 162;

/**
 * If legend is specified, sets the legend object which includes an orient and a thickness of the legend. If legend is a boolean, it would be tured into an object with a bottom orient and a default thickness. Also, is a string, it would become a orient of an object. If legend is not specified, returns the instance's current legend.
 * @memberOf Core#
 * @function
 * @example
 * core.legend(true); //sets {orient: 'bottom', thickness: 54}
 * core.legend({orient:'right', thickness: 200}); 
 * core.legend();
 * @param {boolean|string|object} [legend] sets a legend type. If is a false, removes the legend.
 * @param {string} legend.orient=bottom sets a legend orient(top|right|bottom|left)
 * @param {number} [legend.thickness=(54|162)] sets a legend thickness. if the orient is top or bottom, the default thickness is 54 pixels. Otherwise, it would be 162 pixels.
 * @return {legend|Core}
 */
function legend (legend) { 
  if (!arguments.length) return this.__attrs__.legend;
  if (legend === true) this.__attrs__.legend = {orient: 'bottom', thickness: horizontalThickness  }
  else if (legend === false) this.__attrs__.legend = null;
  else if (typeof legend === 'object') {
    if(!legend.orient) legend.orient = 'bottom';
    if(!legend.thickness) legend.thickness = (legend.orient === 'bottom' || legend.orient === 'top') ? horizontalThickness : verticalThickness;
    this.__attrs__.legend = legend;
  }
  return this;
}

export default legend;