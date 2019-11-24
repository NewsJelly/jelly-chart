import {arc, pie, interpolate, mean, select, selectAll, transition} from 'd3';
import {labelFormat, className} from '../../modules/util';
import _tooltip from './_tooltip';
import _domain from './_domain';
import _legend from './_legend';

function _mark() {
  const that = this;
  const munged = this.__execs__.munged;
  const scale = this.__execs__.scale;
  const label = this.label();
  const trans = transition().duration(this.transition().duration).delay(this.transition().delay);
  const innerSize = this.innerSize();
  const size = this.size();
  const shape = this.__attrs__.shape;
  let parentNode = munged;
  const arcGen = arc().innerRadius(size.range[0])
    .outerRadius(size.range[1])
    .startAngle(d => d.startAngle)
    .endAngle(d => d.endAngle)
    .padAngle(d => d.padAngle);

  // sunburst arcGen
  const radius = size.range[1] / 2;
  const sunburstGen = arc().innerRadius(d => d.y0 * radius)
      .outerRadius(d => d.y1 * radius - 1)
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1- d.x0) / 2, 0.005));

  // gauge chart draw generator
  const gaugeGen = pie().startAngle(-0.75 * Math.PI)
      .endAngle(0.75 * Math.PI).sort(null);
  const gaugeArcGen = arc().innerRadius(size.range[0])
      .outerRadius(size.range[1]).startAngle(-0.75 * Math.PI);

  const tweenArc = function(d) {
    if (shape === 'normal') { // normal pie chart
      let i = interpolate({endAngle: 0}, d);
      return function(t) {
        return arcGen(i(t));
      };
    } else if (shape === 'sunburst') { // sunburst chart
      let i = interpolate({x1: 0}, d);
      return function(t) {
        return sunburstGen(i(t));
      };
    } else { // gauge chart
      let maxValue = that.__attrs__.maxValue;
      let gaugeRange = gaugeGen([d.value, maxValue - d.value]);
      let i = interpolate(gaugeRange[0].startAngle, gaugeRange[0].endAngle);
      return function(t) {
        d.endAngle = i(t);
        return gaugeArcGen(d);
      };
    }
  }

  const font = this.font()

  let __local = function (selection) {
    let sizeMean = mean(size.range);
    selection.each(function(d) {
      if (shape !== 'sunburst') {
        if (shape === 'normal') { // normal pie chart
          d.mid = (d.endAngle + d.startAngle) /2;
        } else { // gauge chart
          let maxValue = that.__attrs__.maxValue;
          let gaugeRange = gaugeGen([d.value, maxValue - d.value]);
          d.mid = (gaugeRange[0].endAngle + gaugeRange[0].startAngle) /2;
        }
        d.dx = Math.sin(d.mid) * sizeMean;
        d.dy = -Math.cos(d.mid) * sizeMean;
        d.color = scale.color(d.key);
      } else { // sunburst chart
        d.mid = (d.x1 + d.x0) / 2;
        d.dx = Math.sin(d.mid) * (radius * d.y0 + (radius / 2));
        d.dy = -Math.cos(d.mid) * (radius * d.y0 + (radius / 2));
        if (d.hasOwnProperty('parent')) {
          if (typeof d.parent.color !== 'undefined') d.color = d.parent.color;
          else d.color = scale.color(d.data.key);
        } else {
          d.color = scale.color(d.data.key);
        }
      }
      d.x = innerSize.width/2 + d.dx;
      d.y = innerSize.height/2 + d.dy;
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
    if (shape === 'normal' || shape === 'gauge') { // normal pie chart
      selection
          .style('fill', d => d.color)
          .style('cursor', 'pointer');
    } else { // sunburst chart
      selection
        .attr("fill-opacity", d => {
          return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0 ? (d.children ? 1 : 0.6) : 0
        })
        .attr('pointer-events', d => { // 자식 노드가 없으면 포인트 이벤트 없음
          return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0 ? 'all' : 'none';
        })
        .filter(d => d.children)
        .style('fill', d => d.color)
        .style('cursor', 'pointer');
    }
  }
  let __node = function (selection) {
    selection
      .style('fill', d => d.color)
      .transition(trans)
      .attrTween('d', tweenArc);
  }


  let __labelInit = function (selection) {
    selection.each(function(d) {
      if (shape !== 'gauge') { // normal pie chart
        select(this).attr('x', d.dx)
          .attr('dy', '.35em')
          .attr('y', d.dy)
          .attr('text-anchor', 'middle')
          .style('pointer-events', 'none')
          .text(d.text);
        that.styleFont(select(this), font);
        if (shape === 'sunburst') { // sunburst chart
          select(this).attr('visibility', d => { // 전체 노드 중 2번째 노드 까지만 레이블 표시
            return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03 ? 'visible' : 'hidden'
          });
        }
      } else { // gauge chart
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
      if (shape !== 'gauge') { // normal pie chart
        select(this).attr('visibility', d => { // 레이블 표시 설정 여부에 따라 레이블 표시
            return label ? (d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03 ? 'visible' : 'hidden') : 'hidden'
        })
        .text(d.text)
        .transition(trans).attr('x', d.dx)
        .attr('y', d.dy);
        that.styleFont(select(this), font);
      } else { // gauge chart
        select(this).transition(trans)
          .tween('text', gaugeLabel);
      }
    })
  }

  let __appendNodes = function (selection) {
    if (shape !== 'sunburst') {
      let node = selection.selectAll(that.nodeName()).data(d => d, d => d.data.key);
      node.exit().remove();
      let nodeEnter = node.enter().append('g')
        .attr('class', that.nodeName(true)  + ' pie')
          .call(__local)
        if (shape === 'normal') { // normal pie
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
        } else if ('gauge'){ // gauge chart
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
      } else { // sunburst chart
        let rootNode = selection.selectAll(className('root-node')).data(d => [d.descendants()[0]], d => d.data.key);
        let rootNodeEnter = rootNode.enter().append('g')
          .attr('class', className('root-node'));
        rootNodeEnter.merge(rootNode)
          .attr('transform', 'translate(' + [innerSize.width/2, innerSize.height/2] +')');

        let node = selection.selectAll(that.nodeName()).data(d => d.descendants().slice(1), d => d.data.key);
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
      }
  }
  
  this.renderRegion(d => {
    d.x = 0; d.y = 0;
  }, d => [d])
  .call(__appendNodes);
}

export default _mark;
