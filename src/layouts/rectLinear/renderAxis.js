import {select} from 'd3';
import {className} from '../../modules/util';

/**
 * @memberOf RectLinear#
 * @private
 */
function renderAxis() {
  let canvas = this.__execs__.canvas;
  let axisObj = this.__execs__.axis;
  let _appendAxis = function(selection, axis, targetNum) {
    let cName = 'axis target-' + axis.target() + ' orient-' + axis.orient() + ' targetNum-' + targetNum ; 
    let axisSel = selection.selectAll(className(cName, true)) 
      .data([targetNum]);
    axisSel.exit().remove();
    axisSel = axisSel.enter().insert('g', ':first-child')
      .attr('class', className(cName)) 
      .merge(axisSel)
      .classed(className('active'), true);
    axis.render(axisSel);
  }
  let axisG = canvas.selectAll(className('axis', true));
  axisG.classed(className('active'), false);
  for (let target in axisObj) {
    if (axisObj.hasOwnProperty(target)) {
      let targetNum = 0;
      for (let field in axisObj[target]) {
        if(axisObj[target].hasOwnProperty(field)) {
          let axis = axisObj[target][field];
          if (axis.facet()) {
            canvas.selectAll(this.regionName()).call(_appendAxis, axis, targetNum);
          } else {
            canvas.call(_appendAxis, axis, targetNum);
          }
        }
        targetNum +=1;
      }
      canvas.selectAll(className('axis target-' + target, true))
        .filter(function(d){
          return d >= targetNum;
        }).remove(); //remove > targetNum
    }
  }
  axisG.filter(function() {
    return !select(this).classed(className('active'));
  }).remove();
  
  return this;
}


export default renderAxis;