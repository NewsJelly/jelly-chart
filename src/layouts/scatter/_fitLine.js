import {transition} from 'd3';
import {className} from '../../modules/util';
import {leastSquare} from '../../modules/transform';
const fitLineColor = '#c0ccda';
function _fitLine() {
  const canvas = this.__execs__.canvas;
  let fitLineG = canvas.select(className('fit-line-g', true));
  
  if (!this.fitLine()) {
    if (!fitLineG.empty()) canvas.select(className('fit-line-g', true)).remove();
    return;
  }
  const field = this.__execs__.field;
  const {slope, intercept} = leastSquare(this.data(), field.x.field(), field.y.field());
  const scale = this.scale();
  const trans = transition().duration(this.transition().duration).delay(this.transition().delay);
  let xValues = scale.x.domain();
  let yValues = xValues.map(d => slope * d + intercept);
  
  if (fitLineG.empty()) {
    fitLineG = canvas.append('g').attr('class', className('fit-line-g'))
      .attr('clip-path', `url(#${canvas.selectAll(className('canvas-g-clip-path', true)).attr('id')}`);
    fitLineG.append('line')
      .attr('class', className('fit-line'))
      .style('fill', 'none').style('stroke', fitLineColor)
      .style('stroke-width', 1)
      .attr('x1', scale.x(xValues[0]))
      .attr('y1', scale.y.range()[0])
      .attr('x2', scale.x(xValues[1]))
      .attr('y2', scale.y.range()[0]);  
  }
  fitLineG.select('line')
    .transition(trans)
    .attr('x1', scale.x(xValues[0]))
    .attr('y1', scale.y(yValues[0]))
    .attr('x2', scale.x(xValues[1]))
    .attr('y2', scale.y(yValues[1]));
}

export default _fitLine;