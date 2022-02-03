import {select, transition} from 'd3';
import {labelFormat} from '../../modules/util';

function _mark() {
  const that = this;
  const canvas = this.__execs__.canvas;
  const scale = this.__execs__.scale;
  const label = this.label();
  const trans = transition().duration(this.transition().duration).delay(this.transition().delay); 
  const yValue = d => scale.y(d.data.key);
  const colorValue =  d => scale.color(d.value);
  const textValue = d => labelFormat(d.value);
  let __local = function (selection) {
    let width = scale.x.bandwidth();
    let height = scale.y.bandwidth();
    selection.each(function(d) {    
      d.x = 0;  
      d.y = yValue(d);
      d.value = d.value;
      d.color = colorValue(d);
      d.text = textValue(d);
      d.w = width;
      d.h = height;
    })
  }

  let __pointInit = function (selection) {
    selection.attr('width', d => d.w)
      .attr('height', d => d.h)
      .style('stroke', 'none')
      .style('fill', d => d.color)
      .style('cursor', 'pointer');
  }
  let __point = function (selection) {
    selection.transition(trans)
      .attr('width', d => d.w)
      .attr('height', d => d.h)
      .style('fill', d => d.color)
  }
  let __labelInit = function (selection) {
    selection.each(function(d) {
      let selection = select(this);
      selection
        .attr('x', 0)
        .attr('y', 0)
        .attr('dx', '0.29em')
        .attr('dy', '1em')
        .style('pointer-events', 'none')
        .style('fill', '#111')
        .text(d.text)
      that.styleFont(selection);
    })
  }
  let __label = function(selection) {
    selection.each(function(d) {
      let selection = select(this);
      selection.attr('text-anchor', d.anchor)
        .style('visibility', label ? 'visible' : 'hidden')
        .transition(trans)
        .text(d.text);
      that.styleFont(selection);
    })
  }

  let __appendPoints = function (selection) {
    let point = selection.selectAll(that.nodeName())
      .data(d => d.children, d => d.data.key)
    point.exit().remove();
    let pointEnter = point.enter().append('g')
      .attr('class', that.nodeName(true) + ' point')
      .call(__local);
    pointEnter.append('rect')
      .call(__pointInit);
    pointEnter.append('text')
      .call(__labelInit);
    point = pointEnter.merge(point)
      .call(__local);
    point.selectAll('rect')
      .call(__point);
    point.selectAll('text')
      .call(__label);
    point.attr('transform', d => 'translate(' + [d.x, d.y] +')')
        .style('fill', d => d.color);
    that.__execs__.nodes = point;
  }
  
  let region = canvas.selectAll(this.regionName());
  region.call(__appendPoints);
}

export default _mark;