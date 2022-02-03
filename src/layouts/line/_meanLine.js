import {mean, transition} from 'd3';

const stroke = '#aaa';

function _meanLine() {
  const canvas = this.__execs__.canvas;  
  let meanLineG = canvas.select('.mean-line-g')
  if (!(typeof this.meanLine() === 'number') && (!this.meanLine() || this.isFacet())) {
    meanLineG.remove();
    return;
  }
  const meanLineVal = this.meanLine();
  const ms = [];
  const scale = this.__execs__.scale;
  const trans = transition().duration(this.transition().duration).delay(this.transition().delay); 
  if (typeof meanLineVal === 'number' ) {
    let domain = scale.y.domain();
    if (meanLineVal >= domain[0] && meanLineVal <= domain[1]) {
      ms.push({value: meanLineVal, y: scale.y(meanLineVal)});
    }
  } else {
    this.regions().filter(d => {
      if (typeof meanLineVal === 'string') {
        return d.data.key === meanLineVal;
      } else {
        return true;
      }
    }).each(d => {
      let result = {value: mean(d.children, d => d.value)};
      result.y = scale.y(result.value);
      ms.push(result);
    })
  }
  
  if (meanLineG.empty) {
    meanLineG = canvas.append('g').attr('class', 'mean-line-g')
  }
  let meanLine =meanLineG.selectAll('.mean-line')
    .data(ms)
  meanLine.exit().remove();

  let meanLineEnter = meanLine.enter().append('g')
    .attr('class', 'mean-line')
    .attr('transform', 'translate(' + [0, scale.y.range()[0]]+')')
    .style('pointer-events', 'none');
  meanLineEnter.append('line')
    .attr('stroke', stroke)
    .attr('shape-rendering', 'crispEdges')
    .attr('stroke-width', '2px')
    .attr('x2', scale.x.range()[1]);
    
  meanLine = meanLineEnter.merge(meanLine)
    .transition(trans)
    .attr('transform', d => 'translate(' + [0, d.y]+')');
  meanLine.select('line')
    .transition(trans)
    .attr('x2', scale.x.range()[1]);
}

export default _meanLine;