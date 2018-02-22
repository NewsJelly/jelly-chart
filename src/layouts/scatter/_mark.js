import {select, transition} from 'd3';

import {labelFormat} from '../../modules/util';

function _mark(zoomed = false) {
  const that = this;
  const canvas = this.__execs__.canvas;
  const scale = this.__execs__.scale;
  const color = this.color();
  const size = this.size();
  const label = this.label();
  const trans = transition().duration(this.transition().duration).delay(this.transition().delay); 
  const field = this.__execs__.field;
  const aggregated = this.aggregated();
  const nested = this.isColor();
  
  const xValue = d => scale.x(d.data[field.x.field()]);
  const yValue = d => scale.y(d.data[field.y.field()]);
  const rValue = d => this.isSized() ? scale.r(d.data[field.radius.field()]) : size.range[0];
  const colorValue =  function() {
    let d = select(this.parentNode).datum();
    return nested ? scale.color(d.data.key) : color[0];
  }
  let __local = function (selection) {
    selection.each(function(d) {
      d.x = xValue(d);
      d.y = yValue(d);
      d.color = colorValue.call(this);
      d.r = rValue(d);
      d.text = labelFormat(d.x) + ', '+ labelFormat(d.y); 
    })
  }

  let __pointInit = function (selection) {
    selection.attr('r', 0)
      .attr('stroke', d => d.color)
      .attr('stroke-width', '1px')
      .attr('fill-opacity',  0.5)
      .style('cursor', 'pointer');
  }
  let __point = function (selection) {
    selection
      .transition(trans)
      .attr('r', d => d.r)
      .attr('stroke', d => d.color);
  }
  let __labelInit = function (selection) {
    selection.each(function(d) {
      let selection = select(this);
      selection
        .style('pointer-events', 'none')
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
        .attr('y', size.range[0])
        .text(d.text);
      that.styleFont(selection);
    })
  }

  let __appendPoints = function (selection) {
    let point = selection.selectAll(that.nodeName())
      .data(d => nested || aggregated ? d.children : d)
    point.exit().remove();
    let pointEnter = point.enter().append('g')
      .attr('class', that.nodeName(true) + ' point')
      .call(__local);
    pointEnter.append('circle')
      .call(__pointInit);
    pointEnter.append('text')
      .call(__labelInit);
    point = pointEnter.merge(point)
      .call(__local)
    
    point.selectAll('circle')
      .call(__point);
    point.selectAll('text')
      .call(__label);
    point.each(function(d) {
      let selection =  select(this);
      if (!zoomed) selection = selection.transition(trans);
      selection.attr('transform', 'translate(' + [d.x, d.y] +')')
        .style('fill',  d.color)
    })
    that.__execs__.nodes = point;
  }

  canvas.selectAll(this.regionName())
    .call(__appendPoints);
}

export default _mark;