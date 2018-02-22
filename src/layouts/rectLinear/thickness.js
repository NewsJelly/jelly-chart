import {defaultFont, offsetThickness, tickFormatForContinious, tickFormatForOrdinal} from '../../modules/axis';
import {className} from '../../modules/util';
import interval from '../../modules/interval';

/**
 * @memberOf RectLinear#
 * @private
 */
function thickness(axisSetting, scale, isHorizontal = true, isOrdinal = true) {
  let hidden = this.__execs__.hidden;
  if (!(axisSetting && axisSetting.showTicks) || (axisSetting && axisSetting.autoTickFormat)) return;
  
  let font = axisSetting.font || defaultFont;
  let tickFormat = axisSetting.tickFormat || (isOrdinal ? tickFormatForOrdinal : tickFormatForContinious(scale.domain()));
  let ticks = isOrdinal ? scale.domain() : scale.ticks();
  if (scale._field) {
    let field = scale._field;
    if(field.format() && !axisSetting.autoTickFormat) tickFormat = field.format();
    if(field.interval && field.interval()) ticks = scale.ticks(interval[scale._field.interval()]);
  }
  let max = -1;
  let isOver = false;
  let innerSize = this.innerSize();
  let step = isHorizontal ? (innerSize.width / ticks.length * 0.9) : 0;
  let tick = hidden.selectAll(className('tick', true))
      .data(tickFormat ? ticks.map(tickFormat) : ticks)
  tick = tick.enter().append('text')
      .attr('class', className('tick'))
      .merge(tick)
      .text(d => d);
  this.styleFont(tick, font);
  tick.each(function() {
    let w = this.getBBox().width;
    if (w > max) max = w;
    if (w > step) isOver = true;
  });
  max = max * (isHorizontal ? 0.8 : 1) + offsetThickness * (isHorizontal ?  1.5 : 1);
  
  if (axisSetting.tickPadding) max += axisSetting.tickPadding;
  if (axisSetting.showTitle) max += offsetThickness;
  if (axisSetting.thickness) max += offsetThickness;
  
  if (axisSetting.defaultThickness) {
    if (isOver && max > axisSetting.defaultThickness) {
      axisSetting.thickness = max;
    } else if (axisSetting.defaultThickness < axisSetting.thickness) {
      axisSetting.thickness = axisSetting.defaultThickness;
    } 
  } 

  if (axisSetting.target === 'x') {
    axisSetting.thickness = Math.min(axisSetting.thickness, this.height() * 0.5);
  } else {
    axisSetting.thickness = Math.min(axisSetting.thickness, this.width() * 0.8);
  }
  tick.remove();
  axisSetting.thickness = Math.round(axisSetting.thickness);
  return axisSetting.thickness;
}

export default thickness;