import {arc, interpolate, mean, select, transition} from 'd3';
import {labelFormat} from '../../modules/util';
function _mark() {
  const that = this;
  const scale = this.__execs__.scale;
  const label = this.label();
  const trans = transition().duration(this.transition().duration).delay(this.transition().delay);
  const innerSize = this.innerSize();
  const size = this.size();
        const font = this.font();
        const textWithLabel = this.textWithLabel();
        const showType = this.showType();
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
        d.labeltext = textWithLabel ? d.data.key : null;
        d.percentage = labelFormat((d.endAngle - d.startAngle) * 100 / (Math.PI * 2))+'%';
        d.text = labelFormat(d.value);
      // if(showType === 'all'){
      //     d.text = labelFormat(d.value) + '(' + labelFormat(d.percentage)+'%)';
      // } else if(showType === 'percent'){
      //     d.text = labelFormat(d.percentage)+'%';
      // } else {
      //     d.text = labelFormat(d.value);
      // }
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
        .attr('y', d.dy - font['font-size'])
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
  let __labelPercentInit = function (selection) {
    selection.each(function(d) {
      select(this).attr('x', d.dx)
        .attr('dy', '.35em')
        .attr('y', d.dy + font['font-size'])
        .attr('text-anchor', 'middle')
        .style('pointer-events', 'none')
        .text(d.percentage);
      that.styleFont(select(this));
    })
  }

  let __labelPercent = function (selection) {
    selection.each(function(d) {
      select(this).style('visibility',label ? 'visible' : 'hidden')
        .text(d.percentage)
        .transition(trans).attr('x', d.dx)
        .attr('y', d.dy);
      that.styleFont(select(this));
    })
  }

  let __labelTextInit = function (selection) {
    selection.each(function(d) {
      select(this).attr('x', d.dx)
        .attr('dy', '.35em')
        .attr('y', d.dy)
        .attr('text-anchor', 'middle')
        .style('pointer-events', 'none')
        .text(d.labeltext);
      that.styleFont(select(this));
    })
  }

  let __labelText = function (selection) {
    selection.each(function(d) {
      select(this).style('visibility',label ? 'visible' : 'hidden')
        .text(d.labeltext)
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
    if(textWithLabel){
        nodeEnter.append('text').attr('class', that.nodeName(true) + " labeltext").call(__labelTextInit)
    }
    if (showType === 'all' || showType === 'value'){
        nodeEnter.append('text').attr('class', that.nodeName(true) + " label")
          .call(__labelInit);
    }
    if (showType === 'all' || showType === 'percent'){
        nodeEnter.append('text').attr('class', that.nodeName(true) + " labelpercent")
          .call(__labelPercentInit);
    }
    node.call(__local);
    node = nodeEnter.merge(node)
      .attr('transform', 'translate(' + [innerSize.width/2, innerSize.height/2] +')');
    node.select('path')
      .call(__node);
      if(textWithLabel){
          node.select("labeltext").call(__labelText)
      }
      if (showType === 'all' || showType === 'value'){
          node.select('label')
            .call(__label);
      }
      if (showType === 'all' || showType === 'percent'){
          node.select('labelpercent')
            .call(__labelPercent);
      }
    that.__execs__.nodes = node;
  }

  this.renderRegion(d => {
    d.x = 0; d.y = 0;
  }, d => [d])
  .call(__appendNodes);
}

export default _mark;
