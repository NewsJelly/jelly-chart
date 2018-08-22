import {transition} from 'd3';
import {className} from '../../modules/util';

const fixLineColor = '#43cdef';
export default function() {
  const canvas = this.__execs__.canvas;  
  const scale = this.__execs__.scale;
  const fixLineValue = this.fixLine()
  const trans = transition().duration(this.transition().duration).delay(this.transition().delay);
  let fixLineG = canvas.selectAll(className('fix-line-g', true));
  if (!fixLineValue) {
    if (!fixLineG.empty()) canvas.select(className('fix-line-g', true)).remove();
    return;
  }

  if (fixLineG.empty()) {
    fixLineG = canvas.append('g').attr('class',  className('fix-line-g'))
  }

  let xValues = scale.x.domain();
  let yValues = [[fixLineValue,fixLineValue]]
  
  fixLineG.datum(yValues);

  let fixLine = fixLineG.selectAll(className('fix-line', true))
    .data(d => d);
  fixLine.exit().remove();
  let fixLineEnter = fixLine.enter().append('line')
    .attr('class', className('fix-line'))
    .style('fill', 'none').style('stroke', fixLineColor)
    .style('stroke-width', 2)
    .attr('opacity', 0.8)
    .attr('x1', scale.x(xValues[0]))
    .attr('x2', scale.x(xValues[1]))
    .attr('y1', d => (d.scale ? d.scale : scale.y).range()[0])
    .attr('y2', d => (d.scale ? d.scale : scale.y).range()[0]);
  fixLine = fixLineEnter.merge(fixLine);
  fixLine.transition(trans)
    .attr('x1', scale.x.range()[0], scale.x(xValues[0]))
    .attr('x2', scale.x(xValues[1]))
    .attr('y1', d => (d.scale ? d.scale : scale.y)(d[0])) 
    .attr('y2', d => (d.scale ? d.scale : scale.y)(d[1]));

}