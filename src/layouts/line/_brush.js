import {brushX} from 'd3';

function _brush() {
  if (!this.brush()) return;
  const canvas = this.__execs__.canvas;
  const innerSize = this.innerSize();
  const brushGen = brushX().extent([[0,0], [innerSize.width, innerSize.height]]);
  let brushG = canvas.selectAll('.brush.x')
    .data([innerSize]);
  brushG.exit().remove();
  brushG.enter().append('g')
    .attr('class', 'brush x')
    .merge(brushG)
    .attr('transform', 'translate(' + [0, 0] +')')
    .call(brushGen);

  this.brushGen(brushGen);
}

export default _brush;