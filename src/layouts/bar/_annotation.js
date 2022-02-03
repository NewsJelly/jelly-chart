import {select, transition} from 'd3';

function translate(selection, innerSize, isVertical = true, isInit = false) {
  selection.attr('transform', d => {
    if (isVertical) {
      if (isInit) return 'translate(' + [innerSize.width, innerSize.height]+ ')';
      return 'translate(' + [innerSize.width, d.y-0.5]+')';
    } else {
      if (isInit) return 'translate(' + [0, 0]+ ')';
      return 'translate(' + [d.w + 0.5, 0]+')';
    }
  })
}
function line(selection, innerSize, isVertical = true) {
  if (isVertical) {
    selection.attr('x1', -innerSize.width)
  } else {
    selection.attr('y2', innerSize.height);
  }
}

function _annotation() {
  if (!this.annotation() || this.isFacet() || this.stacked()) return;
  const annotation = this.annotation();
  const that = this;
  const canvas = this.__execs__.canvas;
  const trans = transition().duration(this.transition().duration).delay(this.transition().delay)
  const innerSize = this.innerSize();
  const isVertical = this.isVertical();
  const isShowDiff = this.showDiff() && !this.isNested();

  if (canvas.select('.annotation-g').empty()) canvas.append('g').attr('class', 'annotation-g')
  let g = canvas.select('.annotation-g');
  let anno = g.selectAll('.annotation')
    .data(this.nodes().data())
  anno.exit().remove();
  let annoEnter = anno.enter().append('g')
    .attr('class', 'annotation')
    .call(translate, innerSize, isVertical, true)
    .style('pointer-events', 'none');
  annoEnter.append('text')
    .style('fill', annotation.color);
  annoEnter.append('line')
    .style('stroke', annotation.color)
    .style('shape-rendering', 'crispEdges')
    .call(line, innerSize, isVertical);
  anno = annoEnter.merge(anno)
    .transition(trans)
    .call(translate, innerSize, isVertical)
  if (isShowDiff) {
    anno.style('visibility', function(d,i, arr) {
      if (d.diff) {
        if (d.diff.value < 0) return 'visible';
        else if (i < anno.size()-1 && select(arr[i+1]).datum().diff.value > 0) return 'visible'; //when not last one, but next one is  diff > 0
        if (d.neighbor.diff.value > 0) return 'visible';
      }
      return 'hidden';
    });
  }
    
  anno.select('text')
    .text(d => d.key)
    .style('visibility', annotation.showLabel ? 'visible' : 'hidden')
    .style('fill', annotation.color)
    .each(function() {
      that.styleFont(this);
    })
  anno.select('line')
    .transition(trans)
    .style('stroke', annotation.color)
    .call(line, innerSize, isVertical);
    
}

export default _annotation;