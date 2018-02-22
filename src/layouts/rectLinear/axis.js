import {offsetThickness, verticalAxisThickness, horizontalAxisThickness} from '../../modules/axis';

function setVal(axis) {
  let val = Object.assign({},axis);
  if (val.orient && val.orient === 'x') { //legacy : 기존에는 orient에 값 넘기는 경우 있었음
    val.target = val.orient;
    val.orient = 'bottom';
  } else if (val.orient && val.orient === 'y') {
    val.target = val.orient;
    val.orient = 'left';
  } 

  let isHorizontal = val.target === 'x';
  if (!('showDomain' in val)) val.showDomain = true;
  if (!('showTicks' in val)) val.showTicks = true;
  if (!('showTitle' in val)) val.showTitle = true;
  if (!('orient' in val)) val.orient = (isHorizontal ? 'bottom' : 'left'); // x축일 경우 기본 bottom;
  if (!('thickness' in val)) {
    val.thickness = (isHorizontal ? horizontalAxisThickness : verticalAxisThickness);
    val.thickness += val.tickPadding ? val.tickPadding : 0;
    val.thickness += val.showTitle ? offsetThickness * 2: 0;
    val.thickness += val.showTicks ? offsetThickness : 0;
    val.defaultThickness = val.thickness;
  }
  
  return val;
}

/**
 * If axis is specified, append it to axis settings and returns the instance itself. If axis is a string, it refers axis's target(x or y) and will be converted to an object. If axis is an array of objects, replaces existing axis settings. If axis is not specified, returns the current axis settings. 
 *  If axis exists and adding is false, it removes the existing axis settign which has the same target of axis.
 * @memberOf RectLinear#
 * @function
 * @example
 * rectLinear.axis('x') // sets X-axis on the bottom side
 *  .axis({target: 'y', orient: 'right', showTicks: false, title: 'Custom Axis Y'}) // sets Y-axis on the right side
 * rectLinear.axis('y', false) // removes existing Y-axis
 * @param {string|object|Object[]} [axis] 
 * @param {string} axis.target=x target scale's name
 * @param {string} [axis.orient=bottom] top|right|bottom|left
 * @param {number} [axis.thickness=18]
 * @param {boolean} [axis.showDomain=true]
 * @param {boolean} [axis.showticks=true]
 * @param {boolean} [axis.showTitle=true]
 * @param {string} [axis.title]
 * @param {string} [axis.titleOrient] top|right|bottom|left
 * @param {boolean} [axis.autoTickFormat] if is true, not apply dimension and measure's format.
 * @param {boolean} [adding=true] if adding is false, removes existing the axis specified target.
 * @return {axis|RectLinear}
 */
function axis (axis, adding = true) { 
  //__attrs__.axis{target, orient, thickness} array includes axis settings
  //__execs__.axis object inclues axis orient
  let val;
  if (!arguments.length) return this.__attrs__.axis; //only used in facet charts
  if (Array.isArray(axis)) { //only used in facet charts
    this.__attrs__.axis = axis.map(setVal);
    axis.forEach(d=> this.__execs__.axis[d.target] = {});
    return this;
  } else if (typeof axis === 'string') {
    val = {target: axis};
    val = setVal(val);
  } else if (typeof axis === 'object') {
    val = Object.assign({},axis);
    val = setVal(val);
  }
  let findIndex = this.__attrs__.axis.findIndex(d => d.target === val.target && d.orient === val.orient); //find the axis that has the same target and orient
  if (adding) {
    if (findIndex >= 0) {
      this.__attrs__.axis.splice(findIndex, 1, val);
    } else {
      this.__attrs__.axis.push(val);
    }
    if (!this.__execs__.axis[val.target]) this.__execs__.axis[val.target] = {}; //enroll axis holder for the target
  } else {
    if (findIndex >= 0) {
      this.__attrs__.axis.splice(findIndex, 1);
    }
  }
  
  return this;
}

export default axis;