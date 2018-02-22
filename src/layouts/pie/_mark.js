import {arc, interpolate, mean, select, transition} from 'd3';
import {labelFormat} from '../../modules/util';
function _mark() {
  const that = this;
  const scale = this.__execs__.scale;
  const label = this.label();
  const trans = transition().duration(this.transition().duration).delay(this.transition().delay);
  const innerSize = this.innerSize();
  const size = this.size();
  const arcGen = arc().innerRadius(size.range[0])
    .outerRadius(size.range[1])
    .startAngle(d => d.startAngle)
    .endAngle(d => d.endAngle)
    .padAngle(d => d.padAngle);
  const tweenArc = function(d) {
    let i = interpolate({endAngle:0}, d);
    return function(t) {return arcGen(i(t));};
  }

  let __local = function (selection) {
    let sizeMean = mean(size.range);
    selection.each(function(d) {
      d.mid = (d.endAngle + d.startAngle) /2;
      d.dx = Math.sin(d.mid) * sizeMean;
      d.dy =  - Math.cos(d.mid) * sizeMean;
      d.x = innerSize.width/2 + d.dx;
      d.y = innerSize.height/2 + d.dy;
      d.color = scale.color(d.key);
      d.text = labelFormat(d.value);
    })
  }

  let __nodeInit = function (selection) {
    selection
      .style('fill', d => d.color)
      .style('cursor', 'pointer');
  } 
  let __node = function (selection) {
    selection.style('fill', d => d.color)
      .transition(trans)
      .attrTween('d', tweenArc);
  }
  
  let __labelInit = function (selection) {
    selection.each(function(d) {
      select(this).attr('x', d.dx)
        .attr('dy', '.35em')
        .attr('y', d.dy)
        .attr('text-anchor', 'middle')
        .style('pointer-events', 'none')
        .text(d.text);
      that.styleFont(select(this));
    })
  }

  let __label = function (selection) {
    selection.each(function(d) {
      select(this).style('visibility',label ? 'visible' : 'hidden')
        .text(d.text)
        .transition(trans).attr('x', d.dx)
        .attr('y', d.dy);
      that.styleFont(select(this));
    })
  }

  let __appendNodes = function (selection) {
    let node = selection.selectAll(that.nodeName())
      .data(d => d, d => d.data.key);
    node.exit().remove();
    let nodeEnter = node.enter().append('g')
      .attr('class', that.nodeName(true)  + ' pie')
      .call(__local)
    nodeEnter.append('path')
      .call(__nodeInit);
    nodeEnter.append('text')
      .call(__labelInit);
    node.call(__local);
    node = nodeEnter.merge(node)
      .attr('transform', 'translate(' + [innerSize.width/2, innerSize.height/2] +')');
    node.select('path')
      .call(__node);
    node.select('text')
      .call(__label);
    that.__execs__.nodes = node;
  }
  
  this.renderRegion(d => {
    d.x = 0; d.y = 0;
  }, d => [d])
  .call(__appendNodes);
}

export default _mark;