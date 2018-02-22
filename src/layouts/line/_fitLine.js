import {transition} from 'd3';
import {className} from '../../modules/util';
const fitLineColor = '#c0ccda';
export default function() {
  const canvas = this.__execs__.canvas;  
  const scale = this.__execs__.scale;
  const trans = transition().duration(this.transition().duration).delay(this.transition().delay);
  const fitLineVal = this.fitLine() ;
  let fitLineG = canvas.selectAll(className('fit-line-g', true));
  if (!fitLineVal || !scale.x.invert) {
    if (!fitLineG.empty()) canvas.select(className('fit-line-g', true)).remove();
    return;
  } 
  let leastSquares = this.leastSquare(fitLineVal);
  let xValues = scale.x.domain();
  let yValues = leastSquares.map(l => {
    return xValues.map(d => l.slope * d + l.intercept);
  });
  
  if (fitLineG.empty()) {
    fitLineG = canvas.append('g').attr('class',  className('fit-line-g'))
      .attr('clip-path', `url(#${canvas.selectAll(className('canvas-g-clip-path', true)).attr('id')}`);
  }
  fitLineG.datum(yValues);

  let fitLine = fitLineG.selectAll(className('fit-line', true))
    .data(d => d);
  fitLine.exit().remove();
  let fitLineEnter = fitLine.enter().append('line')
    .attr('class', className('fit-line'))
    .style('fill', 'none').style('stroke', fitLineColor)
    .style('stroke-width', 1)
    .attr('x1', scale.x(xValues[0]))
    .attr('x2', scale.x(xValues[1]))
    .attr('y1', d => (d.scale ? d.scale : scale.y).range()[0])
    .attr('y2', d => (d.scale ? d.scale : scale.y).range()[0]);
  fitLine = fitLineEnter.merge(fitLine);
  fitLine.transition(trans)
    .attr('x1', scale.x.range()[0], scale.x(xValues[0]))
    .attr('x2', scale.x(xValues[1]))
    .attr('y1', d => (d.scale ? d.scale : scale.y)(d[0])) 
    .attr('y2', d => (d.scale ? d.scale : scale.y)(d[1]));
}