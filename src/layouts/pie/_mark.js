import {arc, pie, interpolate, mean, select, transition} from 'd3';
import {labelFormat} from '../../modules/util';
function _mark() {
  const that = this;
  const scale = this.__execs__.scale;
  const label = this.label();
  const trans = transition().duration(this.transition().duration).delay(this.transition().delay);
  const innerSize = this.innerSize();
  const size = this.size();
  const shape = this.__attrs__.shape;
  const arcGen = arc().innerRadius(size.range[0])
    .outerRadius(size.range[1])
    .startAngle(d => d.startAngle)
    .endAngle(d => d.endAngle)
    .padAngle(d => d.padAngle);
  const tweenArc = function(d) {
    if (shape === 'normal') {
      let i = interpolate({endAngle:0}, d);
      return function(t) {return arcGen(i(t));};
    } else {
      let maxValue = that.__attrs__.maxValue;
      let gaugeRange = gaugeGen([d.value, maxValue - d.value]);
      let i = interpolate(gaugeRange[0].startAngle, gaugeRange[0].endAngle);
      return function(t) {
        d.endAngle = i(t);
        return gaugeArcGen(d);
      };
    }
  }

  // gauge chart
  const gaugeGen = pie().startAngle(-0.75 * Math.PI)
      .endAngle(0.75 * Math.PI).sort(null);
  const gaugeArcGen = arc().innerRadius(size.range[0])
      .outerRadius(size.range[1]).startAngle(-0.75 * Math.PI);

  const font = this.font()
  let __local = function (selection) {
    let sizeMean = mean(size.range);
    selection.each(function(d) {
      if (shape === 'normal') {
        d.mid = (d.endAngle + d.startAngle) /2;
      } else {
        let maxValue = that.__attrs__.maxValue;
        let gaugeRange = gaugeGen([d.value, maxValue - d.value]);
        d.mid = (gaugeRange[0].endAngle + gaugeRange[0].startAngle) /2;
      }
      d.dx = Math.sin(d.mid) * sizeMean;
      d.dy =  - Math.cos(d.mid) * sizeMean;
      d.x = innerSize.width/2 + d.dx;
      d.y = innerSize.height/2 + d.dy;
      d.color = scale.color(d.key);
      d.text = labelFormat(d.value);
    })
  }

  // gauge bg node init
  let __gaugeBgInit = function(selection) {
    let trans = transition().duration(0).delay(0);
    let maxValue = that.__attrs__.maxValue;
    selection
        .style('fill', '#f4f4f4')
        .data(gaugeGen([maxValue]))
        .transition(trans)
        .attr('pointer-events', 'none')
        .attrTween('d', tweenArc);
  };

  let __gaugeBg = function(selection) {
    let trans = transition().duration(0).delay(0);
    let maxValue = that.__attrs__.maxValue;
    selection
        .style('fill', '#f4f4f4')
        .data(gaugeGen([maxValue]))
        .transition(trans)
        .attrTween('d', tweenArc);
  };

  // gauge label
  let gaugeLabel = function(d) {
    let target = this;
    let interpolateText = interpolate(0, d.value);
    let maxValue = that.__attrs__.maxValue;
    return function(t) {
      select(target).text(function() {
        return labelFormat(interpolateText(t) / maxValue, false, ',.1%');
      }).style('font-size', size.range[0] * 0.45 + 'px');
    };
  };

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
      if (shape === 'normal') {
        select(this).attr('x', d.dx)
          .attr('dy', '.35em')
          .attr('y', d.dy)
          .attr('text-anchor', 'middle')
          .style('pointer-events', 'none')
          .text(d.text);
        that.styleFont(select(this), font);
      } else {
        select(this)
          .attr('text-anchor', 'middle')
          .attr('dy', '.35em')
          .attr('pointer-events', 'none')
          .text(d.value);
      }
    })
  }

  let __label = function (selection) {
    selection.each(function(d) {
      if (shape === 'normal') {
        select(this).style('visibility',label ? 'visible' : 'hidden')
          .text(d.text)
          .transition(trans).attr('x', d.dx)
          .attr('y', d.dy);
        that.styleFont(select(this), font);
      } else {
        select(this).transition(trans)
          .tween('text', gaugeLabel);
      }
    })
  }

  let __appendNodes = function (selection) {
    let node = selection.selectAll(that.nodeName())
      .data(d => d, d => d.data.key);
    node.exit().remove();
    let nodeEnter = node.enter().append('g')
      .attr('class', that.nodeName(true)  + ' pie')
      .call(__local)
    if (shape === 'normal') {
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
    } else {
      nodeEnter.append('path')
        .attr('class', 'gauge-bg')
        .call(__gaugeBgInit);
      nodeEnter.append('path')
        .attr('class', 'pie-node')
        .call(__nodeInit);
      nodeEnter.append('text')
        .call(__labelInit);
      node.call(__local);
      node = nodeEnter.merge(node)
        .attr('transform', 'translate(' + [innerSize.width/2, innerSize.height/2] +')');
      node.select('.gauge-bg')
        .call(__gaugeBg);
      node.select('.pie-node')
        .call(__node);
      node.select('text')
        .call(__label);
    }
  }
  
  this.renderRegion(d => {
    d.x = 0; d.y = 0;
  }, d => [d])
  .call(__appendNodes);
}

export default _mark;
