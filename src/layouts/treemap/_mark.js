import {select, transition} from 'd3';
import {className, labelFormat, getUniqueId} from '../../modules/util';

const stemColor = '#eee';
function _mark() {
  const clipIdPrefix = 'treemap-node-clip-path-';
  const that = this;
  const mark = this.__execs__.mark;
  const scale = this.__execs__.scale;
  const label = this.label();
  const trans = transition().duration(this.transition().duration).delay(this.transition().delay); 
  const size = this.size();
  const shape = this.shape();
  const innerSize = this.innerSize();
  const nodeType = shape === 'pack' ? 'circle' : 'rect';
  let nodeAttr = function(selection) {
    if(nodeType === 'rect') {
      selection.attr('width', d => d.w)
        .attr('height', d => d.h);
    } else {
      selection.attr('r', d => d.r);
    }
  }
  let nameAttr = function(selection) {
      if(shape === 'treemap') {
        selection.attr('dx', '0.29em')
          .attr('dy', '1em');
      } else if (shape === 'word'){
        let result = selection.datum();
        let vertical = result.w < result.h;
        selection.attr('dy', vertical ? '-.35em' : '.8em')
          .attr('textLength', vertical? result.h : result.w)
          .attr('lengthAdjust', 'spacingAndGlyphs')
          .attr('transform', vertical ? 'rotate(90)' : '')
          .style('font-size', (vertical ? result.w : result.h) -1 + 'px')
          .style('fill', result.color)
          .style('pointer-events', 'all')
          .style('cursor', 'pointer')
      } else {
        let result = selection.datum();
        selection.attr('visibility', result.children ? 'hidden' : 'visible')
          .attr('text-anchor', 'middle')
          .attr('dy', '.35em');
      }
  }
  let colorValue =  d => d.children ? stemColor : scale.color(d.value);
  let textValue = d => labelFormat(d.value);
  let __local = function (selection) {
    let dx = 0;
    let dy = 0;
    if (size || shape === 'pack') {
      dx = (innerSize.width - size.range[0])/2;
      dy = (innerSize.height - size.range[1])/2;
    }
    selection.each(function(d) {
      d.color = colorValue(d);
      d.text = textValue(d);
      if (shape !== 'pack') {
        d.x = d.x0 + dx;
        d.y = d.y0 + dy;
        d.w = d.x1 - d.x0;
        d.h = d.y1 - d.y0;
      } else {
        d.x += dx/2;
        d.y += dy/2;
      }
    })
  }
  let __clipInit = function (selection) {
    selection.each(function(d) {
       select(this)
        .attr('id', getUniqueId(clipIdPrefix))
        .append(nodeType)
        .call(nodeAttr, d);
      })
  }
  let __clip = function (selection) {
    selection.each(function(d) {
      select(this).select(nodeType)
        .transition(trans)
        .call(nodeAttr, d);
    })
  }
  let __nodeInit = function (selection) {
    selection.style('visibility', shape === 'word' ? 'hidden' : 'visible')
      .style('stroke', 'none')
      .style('fill', d => d.color)
      .style('cursor', 'pointer')
      .call(nodeAttr);
  }
  let __node = function (selection) {
    selection
        .style('visibility', shape === 'word' ? 'hidden' : 'visible')
        .transition(trans)
        .style('fill', d => d.color)
        .style('stroke', d => d.children ? '#ddd' : 'none')
        .call(nodeAttr);
  }
  let __nameInit = function (selection) {
    selection.each(function() {
      let result = mark.get(this);
      let selection = select(this);
     selection
        .attr('x', 0)
        .attr('y', 0)
        .style('pointer-events', 'none')
        .style('fill', '#000')
        .text(d => d.data.key);
      that.styleFont(selection);
      selection.call(nameAttr, result);
      
      selection.style('font-weight', 'bold');
    })
  }
  let __name = function (selection) {
    selection.each(function() {
      let selection = select(this);
      selection.text(d => d.data.key);
      that.styleFont(selection);
      selection.style('font-weight', 'bold');
      selection.call(nameAttr, mark.get(this));
    })
  }
  let __labelInit = function (selection) {
    selection.each(function(d) {
      let selection = select(this);
      let label = selection
        .attr('x', 0)
        .attr('y', 0)
        .style('pointer-events', 'none')
        .style('fill', '#111')
        .text(d.text)
      if(nodeType === 'rect') {
        label.attr('dx', '0.29em')
          .attr('dy', '2em');
      } else {
        label.attr('visibility', d.children ? 'hidden' : 'visible')
          .attr('text-anchor', 'middle')
          .attr('dy', '1.35em');
      }
      that.styleFont(selection);
    })
  }
  let __label = function(selection) {
    selection.each(function(d) {
      let selection = select(this);
      selection
        .style('visibility', label && shape !== 'word' ? 'visible' : 'hidden')
        .transition(trans)
        .text(d.text);
      that.styleFont(selection);
    })
  }

  let __appendNodes = function (selection) {
    let node = selection.selectAll(that.nodeName())
      .data(d => d.descendants().slice(1), d => d.data.key) //exclude the root
    node.exit().remove();
    let nodeEnter = node.enter().append('g')
      .attr('class', d => that.nodeName(true) + ' ' + className(d.children ? 'stem' : 'leaf' ))
      .call(__local);
    
    nodeEnter.append('defs')
      .append('clipPath')
      .call(__clipInit);
    nodeEnter.append(nodeType)
      .attr('class', 'shape')
      .call(__nodeInit);
    nodeEnter.append('text')
      .attr('class', 'name')
      .call(__nameInit);
    nodeEnter.filter(d => !d.children).append('text')
      .attr('class', 'label')
      .call(__labelInit);
    nodeEnter.attr('clip-path', function() {
      return 'url(#' + select(this).select('clipPath').attr('id') + ')';
    });
    
    node = nodeEnter.merge(node)
      .call(__local)
    node.select('defs')
      .select('clipPath')
      .call(__clip);
    node.selectAll('.shape')
      .call(__node);
    node.selectAll('.name')
      .call(__name);
    node.selectAll('.label')
      .call(__label);
    
    node.attr('transform', function(d) {
      return 'translate(' + [d.x, d.y] + ')';
    })
    that.__execs__.nodes = node;
  }
  
  this.renderRegion( d => {
    d.x = 0; d.y=0;
  }, d => [d]).call(__appendNodes);
}

export default _mark;