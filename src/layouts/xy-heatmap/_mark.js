import {select, transition, extent} from 'd3';
import {labelFormat, className} from '../../modules/util';

function _mark() {
  const that = this;
  const shape = this.shape();
  const munged = this.__execs__.munged;
  const canvas = this.__execs__.canvas;
  const scale = this.__execs__.scale;
  const label = this.label();
  const trans = transition().duration(this.transition().duration).delay(this.transition().delay); 
  const yValue = d => scale.y(d.data.key);
  const colorValue =  d => scale.color(d.value);
  const textValue = d => labelFormat(d.value);

  // 데이터셋 중 가장 높은값 추출
  const maxValue = function(){
    let dataArr = [];
    munged.forEach(function(d) {
      let children = d.children;
      children.forEach(function(v){
        dataArr.push(v.value);
      });
    });
    return extent(dataArr)[1];
  };

  let __local = function (selection) {
    let width = scale.x.bandwidth();
    let height = scale.y.bandwidth();
      // 입력된 총 데이터의 합을 구함
      let totalValue = 0;
      munged.forEach(function(d) {
        totalValue += d.value;
      });

      selection.each(function(d) {
        d.w = width;
        d.h = height;
        d.color = colorValue(d);
        d.text = textValue(d);
        if (shape === 'heatmap') {
          d.x = 0;
          d.y = yValue(d);
          d.value = d.value;
        } else {
          d.x = d.w / 2;
          d.y = yValue(d) + d.h / 2;
          d.r = (Math.min(width, height) / 2) * (d.value / maxValue());
          d.opacity = d.value / maxValue();
          d.max = maxValue();
        }
        d.total = totalValue;
      })
  }

  let __pointInit = function (selection) {
    selection
    .style('stroke', 'none')
    .style('fill', d => d.color)
    .style('cursor', 'pointer');

    if (shape === 'heatmap') { // normal heatmap
      selection
          .attr('width', d => d.w)
          .attr('height', d => d.h)
    } else { // bubble heatmap
      selection
          .attr('r', 0)
          .attr('opacity', d => d.opacity);
    }
  }
  let __point = function (selection) {
    selection.transition(trans)
      .style('fill', d => d.color)

    if (shape === 'heatmap') { // normal heatmap
      selection
          .attr('width', d => d.w)
          .attr('height', d => d.h)
    } else { // bubble heatmap
      selection
          .attr('r', d => d.r);
    }
  }
  let __labelInit = function (selection) {
    selection.each(function(d) {
      let selection = select(this);
      selection
        .attr('x', 0)
        .attr('y', 0)
        .attr('dx', shape === 'heatmap' ? '0.29em' : '0')
        .attr('dy', '1em')
        .style('pointer-events', 'none')
        .style('fill', '#565656')
        .text(d.text)
    })
  }
  let __label = function(selection) {
    selection.each(function(d) {
      let selection = select(this);
      selection.attr('text-anchor', d.anchor)
        .style('visibility', label ? 'visible' : 'hidden')
        .transition(trans)
        .text(d.text);

      // 레이블 텍스트 위치 지정
      let textArea = selection.node().getBoundingClientRect();
      if (shape === 'heatmap') { // normal heatmap
        selection
          .attr('x', (d.w - textArea.width) / 2)
          .attr('y', (d.h - textArea.height) / 2 - 6);
      } else { // bubble heatmap
        selection
          .attr('text-anchor', 'middle')
          .attr('y', -textArea.height + 4);
      }
      // 폰트 스타일 지정
      selection
        .attr('font-size', '14px')
        .attr('font-weight', '500');

    })
  }

  // heatmap sub label init
  let __subLabelInit = function(selection) {
    selection.each(function (d) {
      let selection = select(this);
      selection
        .attr('x', 0)
        .attr('y', 0)
        .attr('dx', shape === 'heatmap' ? '0.29em' : '0')
        .attr('dy', '1em')
        .style('pointer-events', 'none')
        .style('font-size', '12px')
        .style('font-weight', '500')
        .style('fill', '#565656')
        .text(labelFormat((d.value / d.total), false, ',.1%'));
    });
  };

  // heatmap sub label draw
  let __subLabel = function(selection) {
    selection.each(function (d) {
      let selection = select(this);
      selection
        .style('visibility', label ? 'visible' : 'hidden')
        .text(labelFormat((d.value / d.total), false, ',.1%'));

      let textArea = selection.node().getBoundingClientRect();
      if (shape === 'heatmap') {
        selection
          .attr('x', (d.w - textArea.width) / 2)
          .attr('y', (d.h - textArea.height) / 2 + 6)
      } else {
        selection
          .attr('text-anchor', 'middle')
          .attr('x', 0)
          .attr('y', 0)
      }

      selection
        .style('font-size', '12px')
        .style('font-weight', '500');
    });
  };


  let __appendPoints = function (selection) {
    let point = selection.selectAll(that.nodeName())
      .data(d => d.children, d => d.data.key)
    point.exit().remove();
    let pointEnter = point.enter().append('g')
      .attr('class', that.nodeName(true) + ' point')
      .call(__local);
    pointEnter.append(shape === 'heatmap' ? 'rect' : 'circle')
        .call(__pointInit);
    pointEnter.append('text')
      .attr('class', className('label'))
      .call(__labelInit);
    pointEnter.append('text')
      .attr('class', className('sub-label'))
      .call(__subLabelInit);
    point = pointEnter.merge(point)
      .call(__local);
    point.selectAll(shape === 'heatmap' ? 'rect':'circle')
        .call(__point);
    point.selectAll(className('label', true))
        .call(__label);
    point.selectAll(className('sub-label', true))
        .call(__subLabel);

    point.attr('transform', d => 'translate(' + [d.x, d.y] +')')
        .style('fill', d => d.color);
    that.__execs__.nodes = point;
  }
  
  let region = canvas.selectAll(this.regionName());
  region.call(__appendPoints);
}

export default _mark;