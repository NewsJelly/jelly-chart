import Core from '../core';
import {attrFunc} from '../../modules/util';
import axis from './axis';
import axisDefault from './axisDefault';
import axisX from './axisX';
import axisY from './axisY';
import axisTitle from './axisTitle';
import renderAxis from './renderAxis';
import thickness from './thickness';

const _attrs = {
  axis: [], 
  axisTitles: [],
  grid: false,
  noAxisOffset: false, //assume that no axis offset
}
/**
 * @class RectLinear
 * @augments Core
 */
class RectLinear extends Core {
  constructor() {
    super();
    this.setAttrs(_attrs);
  }
  /**
   * @override
   */
  offset() {  
    let offset = super.offset();
    offset = Object.assign({}, offset);
    let axisSetting = this.axis();
    if (!this.noAxisOffset()) {
      axisSetting.forEach(function(at) {
        offset[at.orient] += at.thickness;
      })
    }
    return offset;
  }
}

/**
 * set axis titles directly.
 * @function
 * @example
 * rectLinear.axisTitles({target:'x', title: 'custom title X'});
 * @param {Object[]} [axisTitles] 
 * @param {string} axisTitles[].target target scale name of the axis(x|y)
 * @param {string} axisTitles[].title  title to show
 * @param {string} [axisTitles[].field] target field name of the axis
 * @return {(axisTitles|RectLinear)}
 */
RectLinear.prototype.axisTitles = attrFunc('axisTitles');

/**
 * set and get all axis settings
 * @function
 * @private 
 * @return {axisToggle[]}
 */
RectLinear.prototype.axisToggle = attrFunc('axisToggle');

/**
 * If grid is specified, sets grid setting and returns the instance itself. If grid is true, shows grids of axes. If grid is not specified, it returns the current grid setting.
 * @function
 * @param {boolean} [grid=false] 
 * @return {grid|RectLinear}
 */
RectLinear.prototype.grid = attrFunc('grid');

/**
 * If noAxisOffset is specified, sets noAxisOffset setting and returns the instance itself. If noAxisOffset is true, it doens not consider axes during calculating {@link RectLinear#offset offset}. If noAxisOffset is not specified, it returns the current noAxisOffset setting.
 * @function
 * @private
 * @param {boolean} noAxisOffset=fasle
 * @return {boolean|RectLinear}
 */
RectLinear.prototype.noAxisOffset = attrFunc('noAxisOffset');

RectLinear.prototype.axis = axis;
RectLinear.prototype.axisX = axisX;
RectLinear.prototype.axisY = axisY;
RectLinear.prototype.axisDefault = axisDefault;
RectLinear.prototype.axisTitle = axisTitle;
RectLinear.prototype.renderAxis = renderAxis;
RectLinear.prototype.thickness = thickness;


export default RectLinear;