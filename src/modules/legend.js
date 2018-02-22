import {dispatch, schemeCategory10, select, symbol, symbolTriangle} from 'd3';
import {className, setMethodsFromAttrs, getUniqueId, rebindOnMethod} from './util';

const defaultFont = {
  'font-family': 'sans-serif',
  'font-size': 11,
  'font-weight': 'normal',
  'font-style': 'normal'
};
const areaClipPath = className('legend-area-clip-path');
const labelClipPath = className('legend-label-clip-path');
const orients = ['top', 'bottom'];
const highlightDuration = 180;
const _attrs = {
  color: '#485465',
  muteIntensity: 0.3,
  font: defaultFont,
  format: null,
  height: 0,
  orient: orients[1],
  scale: null,
  showTooltip: true,
  title: null,
  transition : null,
  width: 0,
  x: 0,
  y: 0
}
class Legend {
  constructor() {
    this.__attrs__ = JSON.parse(JSON.stringify(_attrs));
    this.__execs__ = {legend:null};
    this.__execs__.dispatch = dispatch('selectClick', 'selectEnter', 'selectLeave');
    rebindOnMethod(this, this.__execs__.dispatch);
  }
}

function _legend() {
  return new Legend();
}

function isHorizontal() {
  return this.orient() === 'bottom' || this.orient() === 'top';
}

function _style(selection) {
  let font = this.font();
  for (var k in font) {
    selection.style(k, (k === 'font-size' ? font[k] + 'px' : font[k]));
  }
}

function _arrow(selection, that, rowNum) {
  const isHorizontal = that.isHorizontal();
  const width = that.width();
  const height = that.height();
  const labelHeight = that.labelHeight();
  const labelPadding = that.labelPadding();
  const rectW = labelHeight + labelPadding;
  const arrowColor = schemeCategory10[0], rectColor = '#A3A3A3';
  const area = selection.select(className('label-area', true));
  let curRowNum = 0;
  let arrow = selection.selectAll(className('arrow', true))
    .data(['up', 'down'])
  let arrowEnter = arrow.enter().append('g')
    .attr('class', d => className('arrow ' + d))
    .style('cursor', 'pointer')
  arrowEnter.append('rect')
      .attr('width', rectW)
      .attr('height', rectW)
      .attr('fill', '#fff')
      .attr('stroke', rectColor)
      .attr('stroke-width', '1px')
      .attr('shape-rendering', 'crispEdges');
  arrowEnter.append('path')
    .attr('d', symbol().type(symbolTriangle).size(labelHeight * 2.5))
    .attr('transform', function (d, i) {
      var translate = 'translate(' + [(rectW - 1) * 0.5, (rectW - 1) * 0.5] + ')';
      return translate + (i === 1 ? 'rotate(180)' : '');
    })
    .style('display', 'block')
    .attr('fill', d => d === 'up' ? rectColor : arrowColor);
  arrow = arrowEnter.merge(arrow)
    .attr('transform', function (d,i) {
      if (isHorizontal) return 'translate(' + [ width + labelPadding, i * (labelHeight + labelPadding) ] + ')';
      else return 'translate(' + [0, height + labelPadding*1.25 + i * (labelHeight + labelPadding)] +')'
    })
  arrow.on('click', function(d) {
    if (d === 'up' && curRowNum > 0) {
      curRowNum -=1;
    } else if (d === 'down' && curRowNum < rowNum ) {
      curRowNum += 1; 
    } else {  
      return;
    }
    arrow.select('path').style('fill', arrowColor).style('cursor', 'pointer');
    if (curRowNum === 0) {
      arrow.select('path').filter(d => d === 'up').style('fill', rectColor).style('cursor', 'default');
    } else if (curRowNum === rowNum) {
      arrow.select('path').filter(d => d === 'down').style('fill', rectColor).style('cursor', 'default');
    }

    area.attr('transform', 'translate(' + [0, -curRowNum * (labelHeight + labelPadding)] + ')');
    //areaClip.select('rect').attr('y', curRowNum * (labelHeight + labelPadding))
  });
}

function _clipPath (selection, that) {
  const width = that.width();
  const maxLabelW = that.isHorizontal() ? width /2 : width;
  
  let defs = selection.selectAll('defs')
    .data([[{name: areaClipPath, width: width}, {name: labelClipPath, width: maxLabelW}]]);
  defs = defs.enter().append('defs').merge(defs);
  let clipPath = defs.selectAll('clipPath')
    .data(d => d, d => d.name)
  clipPath.exit().remove();
  clipPath = clipPath.enter().append('clipPath')
    .attr('class', d => d.name)
    .attr('id', d => getUniqueId(d.name + '-'))
    .merge(clipPath);
  let rect = clipPath.selectAll('rect')
    .data(d => [d]);
  rect.exit().remove();
  rect = rect.enter().append('rect')
    .merge(rect)
    .attr('width', d => d.width)
    .attr('height', that.height());
  selection.select(className('label-area-parent', true))
    .attr('clip-path', 'url(#' + clipPath.filter((d,i) => i === 0).attr('id') + ')')
  selection.selectAll(className('label', true))
    .attr('clip-path', 'url(#' +clipPath.filter((d,i) => i === 1).attr('id') + ')');
  return selection;
}
function _overflow(selection) {
  const isHorizontal = this.isHorizontal();
  const width = this.width();
  const maxLabelW = isHorizontal ? width /2 : width;
  const labelHeight = this.labelHeight();
  const labelPadding = this.labelPadding();
  let rowNum = 0, curX = 0, curY = 0;
  selection.call(_clipPath, this);
  selection.selectAll(className('label', true))
    .each( function(d,i) {
      let selection = select(this);
      let x,y;
      let w = Math.min(this.getBBox().width, maxLabelW);
      if(i === 0  || (isHorizontal && curX + w + labelPadding * 2 <= width)) {
        x = curX;
        y = curY;
      } else {
        rowNum += 1;
        x = curX = 0;
        y = curY = curY + labelHeight +  labelPadding;
      }
      curX += w + labelPadding * 2;
      selection.attr('transform', 'translate(' + [x,y] +')')
    })
  if ((rowNum +1) * (labelHeight + labelPadding) > this.height()) { 
    selection.call(_arrow, this, rowNum);
  } else {
    selection.selectAll(className('arrow', true)).remove();
  }
}

function _render(selection) {
  this.__execs__.legend = selection;
  
  let area = selection.select(className('label-area', true));
  if(this.transition() && !area.empty()) {
    let trans = this.transition();
    selection.transition().duration(trans.duration).delay(trans.delay)
      .attr('transform', 'translate(' +[this.x(), this.y()] + ')');
  } else {
    selection.attr('transform', 'translate(' +[this.x(), this.y()] + ')')
  }
  if (area.empty()) {
    area = selection.append('g').attr('class', className('label-area-parent'))
     .append('g').attr('class', className('label-area'));
  }
  
  const labelHeight = this.labelHeight();
  const labelHeightHalf = labelHeight/2;
  let scale = this.scale();
  let label = area.selectAll(className('label', true))
    .data(scale.domain().filter(d => d !== undefined && d !== null).map(d => {
      return {key: d, color: scale(d)}
    }))
  
  label.exit().remove();
  
  let labelEnter = label.enter().append('g')
    .attr('class', className('label'))
    .style('cursor', 'pointer');
  labelEnter.append('title')
  labelEnter.append('rect').style('fill', 'none');
  labelEnter.append('circle');
  labelEnter.append('text')
    .style('letter-spacing', '-0.1px');

  label = labelEnter.merge(label)
    .style('fill', d => d.color);
  label.select('title')
    .text(d => this.format() ? this.format()(d.key) : d.key);
  label.select('circle')
    .attr('cx', labelHeightHalf).attr('cy', labelHeightHalf)
    .attr('r', 5)
  label.select('text')
    .attr('x', labelHeight)
    .attr('dx', '.35em')
    .attr('dy', '.9em')
    .style('fill', this.color())
    .text(d => this.format() ? this.format()(d.key) : d.key);
  label.select('rect')
    .attr('width', function() {
      return this.parentNode.getBBox().width;
    }).attr('height', function() {
      return this.parentNode.getBBox().height;
    })
  const dispatch = this.__execs__.dispatch;
  label.on('click', function(d) {
    dispatch.call('selectClick', this, d);
  }).on('mouseenter', function(d) {
    dispatch.call('selectEnter', this, d);
  }).on('mouseleave', function(d) {
    dispatch.call('selectLeave', this, d);
  })
}

function _filter(selection, exceptionFilter) {
  if (typeof exceptionFilter === 'function') {
    return selection.filter(exceptionFilter)
  } else if (typeof exceptionFilter === 'string') {
    return selection.filter(d => d.key !== exceptionFilter);
  } else if (exceptionFilter instanceof Date) {
    let keyTime = exceptionFilter.getTime();
    return selection.filter(d => d.key.getTime() !== keyTime);
  } else if (exceptionFilter.tagName && exceptionFilter.tagName === 'g') {
    return selection.filter(function() {
      return this !== exceptionFilter;
    })
  } 

  return selection.filter(() => true);
}

function demute(exceptionFilter) {
  _filter(this.__execs__.legend.selectAll(className('label', true)), exceptionFilter)
    .transition().duration(highlightDuration)
    .attr('opacity', 1);
}

function mute(exceptionFilter) {
  let selection = _filter(this.__execs__.legend.selectAll(className('label', true)), exceptionFilter);

  if (selection) {
    selection.transition().duration(highlightDuration)
      .attr('opacity', this.muteIntensity());
  } 
  return this;
}

function labelHeight() {
  return this.font()['font-size'];
}

function labelPadding() {
  return this.isHorizontal() ? this.labelHeight() /2 : this.labelHeight();
}

function update() {

}
function render(selection) {
  _style.call(this, selection);
  _render.call(this, selection);
  _overflow.call(this, selection);
}
Legend.prototype.demute = demute;
Legend.prototype.mute = mute;
Legend.prototype.labelHeight =  labelHeight;
Legend.prototype.labelPadding = labelPadding;
Legend.prototype.render = render;
Legend.prototype.update = update;
Legend.prototype.isHorizontal = isHorizontal;

setMethodsFromAttrs(Legend, _attrs);

export default _legend;