import {select, axisTop, axisRight, axisBottom, axisLeft, format, timeFormat, max, min, set, transition} from 'd3';
import {className, labelFormat, setMethodsFromAttrs, getUniqueId, zeroPoint} from './util';
import {countMeasure, countMeasureTitle} from './measureField';
import interval from '../modules/interval';

const offsetThickness = 14;
const verticalAxisThickness = 18; 
const horizontalAxisThickness = 18;
const tickFormatForOrdinal = labelFormat;
const targets = ['x', 'y'];
const orients = ['top', 'right', 'bottom', 'left'];
const SIPrefixFormat = format('.2s');
const commaFormat = format(',');
const defaultFont = {
  'font-family': 'sans-serif',
  'font-size': 10,
  'font-weight': 'normal',
  'font-style': 'normal',
  'letter-spacing': '0.1px'
};
const titleSize = 13;
const domainColor = '#c0ccda';
const titleColor = '#485465';
const gridColor = '#e7ebef';
const zerocolor = '#aaa';
const defaultTickRotate = 45;
const smallModeThreshold = 300;
const _attrs = {
  autoTickFormat: true,
  autoRotate: true,
  color: '#7b92ae',
  field: null,
  facet : null,
  font: defaultFont,
  format: null,
  grid: false,
  gridSize : 0,
  interval: null,
  orient: orients[2],
  scale: null,
  showTitle: true,
  showDomain: true,
  showTicks: true,
  thickness: 40,
  target: targets[0],
  tickFormat: null,
  title: '',
  titleOrient: null,
  ticks: null,
  tickRotate: 0,
  tickSize: 0,
  tickPadding: 4,
  transition: null,
  x: 0,
  y: 0,
}

class Axis {
  constructor() {
    this.__attrs__ = JSON.parse(JSON.stringify(_attrs));
    this.__execs__ = {axis:null, canvas: null, rotated: false};
  }
}

function _axis() {
  return new Axis();
}

function isHorizontal() {
  return this.orient() === 'bottom' || this.orient() === 'top';
}

function _generator () {
  let orient = this.orient();
  let scale = this.scale();
  let axis;
  
  if (orient === orients[0]) axis = axisTop();
  else if (orient === orients[1]) axis = axisRight();
  else if (orient === orients[3]) axis = axisLeft();
  else axis = axisBottom();
  this.__execs__.axis = axis;

  if (scale) axis.scale(scale);
  if (this.transition()) {
    let trans = this.transition();
    this.__execs__.transition = transition().duration(trans.duration).delay(trans.delay);
  }
}

function _grid (selection, zoomed) {
  if(this.grid() && this.gridSize() > 0) {
    let axis = this.__execs__.axis;
    let gridSize = this.gridSize();
    let isHorizontal = this.isHorizontal();
    let orient = this.orient();
    let target = (isHorizontal ? 'y2' : 'x2');
    let sign = (orient === 'left' || orient === 'top') ? 1 : -1;
    let scale = this.scale();
    let gridLine = selection.selectAll('.grid')
      .data(scale.ticks(axis._tickNumber).map(d => scale(d)));
    gridLine.exit().remove();
    let gridLineEnter = gridLine.enter().append('g')
      .attr('class', 'grid')
    gridLineEnter.append('line')
      .style('stroke', gridColor);
    gridLine = gridLineEnter.merge(gridLine);
    if(this.transition() && !zoomed) {
      gridLine = gridLine.transition(this.__execs__.transition);
    }
    gridLine.attr('transform', d => 'translate(' + (isHorizontal? [d+0.5, 0]: [0, d-0.5]) + ')')
      .select('line')
      .attr(target, sign * gridSize);
  } else {
    selection.selectAll('.grid').remove();
  }
}

function _overflow (selection) {
  /* overflow 시나리오
  ordinal 한 경우 -> 
    -> 일단 클리핑
    -> 가장 긴 녀석을 기준으로 5도 단위로 각도 변화 시키기-> 90도 까지 

  continous 한 경우 -> 
    -> 5도 단위로 각도 변화 시키기-> 90도 까지
  */
  
  const scale = this.scale();
  const orient = this.orient();
  let tickStepSize = (() => {
    if (scale.bandwidth) {
      let bandwidth = scale.bandwidth();
      if (bandwidth === 0) return scale.step();
      return scale.bandwidth();
    } else {
      let ticks = scale.ticks();
      if (ticks.length > 1) {
        return Math.abs(scale(ticks[1]) - scale(ticks[0]));
      } else {
        return Math.abs(scale.range[scale.range().length-1] - scale.range()[0]);
      }
    }
  })();
  let _generateId = () => {
    let prefix = 'axis-' + this.target() + '-' + this.orient() + '-';
    return getUniqueId(prefix);
  }
  let _tooltip = () => {
    selection.selectAll('.tick')
      .each(function() {
        let sel = select(this); 
        let t = sel.select('title');
        if (t.empty()) t = sel.insert('title', ':first-child');
        let text = sel.select('text').text();
        t.text(text);
      })
  }
  let _clipPath = () => {
    let defs = selection.select('defs')
    if (defs.empty()) {
      let _id = _generateId(); 
      defs = selection.append('defs');
      defs.append('clipPath')
        .attr('id', _id)
        .append('rect');
      selection.selectAll('.tick')
        .attr('clip-path', 'url(#' + _id +')');
    }
    const rectPos = {};
    let scaleDist = Math.abs(scale.range()[1] - scale.range()[0]);
    if (scaleDist === 0) scaleDist = scale.range()[0] * 2;
    if (this.isHorizontal()) {
      rectPos.width = scaleDist;
      rectPos.height = this.thickness() - (this.showTitle() ? this.font()['font-size'] * 1.71 : 0);
      rectPos.x = -rectPos.width/2;
      rectPos.y = orient === 'bottom' ? 0 : -rectPos.height;
    } else {
      rectPos.width = this.thickness() ;
      rectPos.height = scaleDist;
      rectPos.x = orient === 'left' ? -rectPos.width : 0;
      rectPos.y = -rectPos.height/2;
    }
    defs.select('clipPath').select('rect').datum(rectPos)
      .attr('x', d => d.x).attr('y', d => d.y)
      .attr('width', d => d.width).attr('height', d => d.height);
  }
  let _hidden = () => {
    let showTicks = this.showTicks();
    let isSmall = tickStepSize < this.font()['font-size'] * (this.isHorizontal() ? 1 : 0.72);
    selection.selectAll('.tick')
      .style('visibility', isSmall && scale.bandwidth ? 'hidden': (showTicks ? 'inherit' : 'hidden'));
  }
  let _rotate = () => {
    let tickPadding = this.tickPadding();
    let tickRotate = this.tickRotate();
    let isHorizontal = this.isHorizontal();
    let isPositive = this.orient() === 'right' || this.orient() === 'top';
    let _rotateFunc =  (_selection, _tickRotate = tickRotate) => {
      let padding;
      if(isHorizontal) padding = [0, tickPadding/2];
      else padding = [_selection.attr('x') * .71, 0];
      if (this.transition()) _selection = _selection.transition().duration(180)
      _selection
        .attr('transform', 'translate(' + padding+') rotate('+ (_tickRotate * -1)+')').attr('text-anchor', isHorizontal ? 'start': 'end')
        .attr('text-anchor', isPositive ? 'start' : 'end');
    }
    
    if (tickRotate !== 0) {
      selection.selectAll('.tick > text')
        .call(_rotateFunc);
      this.__execs__.rotate = true;
      return;
    } else if (this.autoRotate()) {
      let tick = selection.selectAll('.tick');
      let totalW = 0;
      tick.each(function() {
        let w = this.getBBox().width;
        if (select(this).selectAll('text').classed(className('rotated'))) w *= 1.25;
        totalW += w;
      })
      let isOver = totalW >= Math.abs(scale.range()[1] - scale.range()[0]);
      if (isHorizontal) {
        if (isOver) {
          tick.selectAll('text')
            .classed(className('rotated'), true)
            .call(_rotateFunc, defaultTickRotate);
        } else {
          let rotated = tick.selectAll('text' + className('rotated', true))
            .classed(className('rotated'), false)
          if(this.transition()) rotated = rotated.transition().duration(180);
          rotated.attr('transform', '').attr('text-anchor', 'middle');
        }
      } 
    }
  }
  _tooltip();
  _clipPath();
  _rotate();
  _hidden();
}

function tickFormatForContinious(domain) {
  if (typeof domain[0] === 'number' && domain[1] >= 100000 && Math.abs(domain[1] - domain[0]) >= 1000) return SIPrefixFormat; //axis.tickFormat(SIPrefixFormat);
  else return commaFormat;
}

function _format() { //apply before rendering
  let axis = this.__execs__.axis;
  let tickFormat = this.tickFormat();
  let scale = this.scale();
  if (tickFormat) { 
    if (typeof tickFormat === 'function')  axis.tickFormat(d => {
      if (typeof d === 'string' && isNaN(d)) return d;
      return tickFormat(d);
    });
    else if (scale._scaleType === 'time') axis.tickFormat(timeFormat(tickFormat));
    else axis.tickFormat(format(tickFormat));
  } else if (this.autoTickFormat()) {
    if (scale.invert && scale.domain()[0] instanceof Date) { return; }
    let domain = scale.domain();
    if (scale.invert && !scale.padding) { //apply auto-formatting
      axis.tickFormat(tickFormatForContinious(domain));
    } else {
      axis.tickFormat(d => labelFormat(d));
    }
  } 
}
function tickNumber(scale, dist) {
  let range = scale.range();
  dist = dist || Math.abs(range[1]- range[0]);
  let tNumber = scale.ticks().length;
  if (dist<= smallModeThreshold /2 ) {
    tNumber = 2;
  } else if (dist <= smallModeThreshold) {
    tNumber = 5;
  } else {
    tNumber = Math.round(tNumber / 2);
  }
  return tNumber;
}
function _preStyle(selection) { //TODO : tickSize and font-style
  let axis = this.__execs__.axis;
  let font = this.font();
  let scale = this.scale();
  axis.tickSize(this.tickSize())
    .tickPadding(this.tickPadding() + (this.isHorizontal() ? 4 : 2));
  if (this.ticks()) {
    axis.ticks(this.ticks());
    axis._tickNumber = this.ticks();
  } else if (scale.invert) {
    if (scale._scaleType === 'time') { //scale's type is time
      let intervalType = interval[this.interval()];
      if (intervalType && !this.autoTickFormat() && this.tickFormat()) { //user interval
        axis.ticks(intervalType);
        axis._tickNumber = scale.ticks(intervalType).length;
      } else { //when has no interval use scale ticks length;
        let tickFormat = this.tickFormat();
        if (tickFormat) {
          axis._tickNumber = set(scale.ticks().map(tickFormat)).values().length;
          axis.ticks(axis._tickNumber);
        } else {
          axis._tickNumber = scale.ticks().length;
        }
      }
    } else {
      let tNumber = tickNumber(scale);
      axis.ticks(tNumber);
      axis._tickNumber = tNumber;
    }
  } else {
    axis._tickNumber = scale.domain().length;
  }
  for (var k in font) {
    selection.style(k, (k === 'font-size' ? font[k] + 'px' : font[k]));
  }
}

function _render(selection, zoomed) {
  let axis = this.__execs__.axis;
  if (selection.selectAll('.domain').size() ===0) {
    selection.attr('transform', 'translate(' +[this.x(), this.y()] + ')');
  }
    
  if(this.transition() && !zoomed) {
    selection.transition(this.__execs__.transition)
      .attr('transform', 'translate(' +[this.x(), this.y()] + ')')
      .call(axis)
      .on('end', () => {
        _overflow.call(this, selection);
      })
  } else {
    selection.attr('transform', 'translate(' +[this.x(), this.y()] + ')')
      .call(axis);
    _overflow.call(this, selection);
  }
}

function _style(selection) {
  let tick = selection.selectAll('.tick');
  tick.select('line').style('stroke', this.color());
  tick.select('text').style('fill', this.color());
  selection.select('.domain').style('stroke', domainColor)
    .style('shape-rendering', 'crispEdges')
    .style('stroke-width', '1px')
    .style('visibility', this.showDomain() ? 'visible' : 'hidden'); //showDomain
}

function _title(selection) {
  let that = this;
  let _textTransform = function(selection) {
    if (that.isHorizontal()) {
      selection.attr('dy', orient === 'bottom' ? '-1em' : '.71em')
    } else {
      if (titleOrient === 'bottom' || titleOrient === 'top') {
        selection
          .attr('dy', titleOrient === 'bottom' ? '2em' : '-1em');
      } 
    }
  }
  let _transform = function(selection) {
    if (that.isHorizontal()) {
      let padding = 0;
      selection.attr('transform', 'translate(' +[halfPos, orient === 'bottom' ? that.thickness() - padding : -that.thickness() + padding]+')')
    } else {
      if (titleOrient === 'bottom' || titleOrient === 'top') {
        selection.attr('transform', 'translate(' + [0, titleOrient === 'bottom' ? max(scale.range()) : min(scale.range())] +')');
      } else {
        selection.attr('transform', 'translate(' + [that.thickness() * (orient === 'left' ? -1: 1), halfPos] +') ' + (orient === 'left' ? 'rotate(90)' : 'rotate(-90)'));
      }
    }
  }
  let title =  this.title() || this.field();
  if (!title) return ;
  title = title.localeCompare(countMeasure.field) === 0 ? countMeasureTitle : title;
  if (!this.showTitle()){
    selection.selectAll('.title').remove();
    return;
  } 
  let orient = this.orient();
  let titleOrient = this.titleOrient() || orient;
  let scale = this.scale();
  let halfPos = (scale.range()[0] + scale.range()[1]) /2;
  
  let titleSel = selection.selectAll('.title')
    .data([title]);
  titleSel.exit().remove();
  let titleSelEnter = titleSel.enter().append('g')
    .attr('class', 'title')
    .call(_transform);
  titleSelEnter.append('text')
    .attr('text-anchor', 'middle')
    .style('font-size', titleSize + 'px')
    .style('fill', titleColor)
    .call(_textTransform);
    
  titleSel = titleSelEnter.merge(titleSel)
  titleSel.select('text')
    .text(title);
  if (this.transition()) {
    titleSel.transition(this.__execs__.transition)
      .call(_transform);
  }
}

function _zero (selection, zoomed) {
  let scale = this.scale();
  if (scale.invert && zeroPoint(scale.domain())) {
    let gridSize = this.gridSize();
    let isHorizontal = this.isHorizontal();
    let orient = this.orient();
    let target = (isHorizontal ? 'y2' : 'x2');
    let sign = (orient === 'left' || orient === 'top') ? 1 : -1;
    let scale = this.scale();
    let gridLineTransforms = [];
    selection.selectAll('.tick').filter(d => d === 0)
      .each(function(d) {
        gridLineTransforms.push(scale(d));
      });
    let gridLine = selection.selectAll('.zero.grid')
      .data(gridLineTransforms)
    gridLine.exit().remove();
    let gridLineEnter = gridLine.enter().append('g')
      .attr('class', 'grid zero')
    gridLineEnter.append('line')
      .style('stroke', zerocolor);
    gridLine = gridLineEnter.merge(gridLine);
    if(this.transition() && !zoomed) {
      gridLine = gridLine.transition(this.__execs__.transition);
    }
    gridLine.attr('transform', d => 'translate(' + (isHorizontal? [d+0.5, 0]: [0, d-0.5]) + ')')
      .select('line')
      .attr(target, sign * gridSize);
  }
}

function facet (orient) {
  if (!arguments.length) return this.__attrs__.facet;
  if (orients.includes(orient)) this.__attrs__.facet = {orient: orient};
  else this.__attrs__.facet = {orient: orients[0]};
  return this;
}

function update() {

}
function render(selection, zoomed = false) {
  if (selection) {
    this.__execs__.canvas = selection;
  } else if(this.__execs__.canvas) {
    selection = this.__execs__.canvas;
  } else {
    return ;
  }
  _generator.call(this);
  _format.call(this);
  _preStyle.call(this, selection);
  _render.call(this, selection, zoomed);
  _style.call(this, selection);
  _grid.call(this, selection, zoomed);
  _zero.call(this,selection, zoomed);
  _title.call(this, selection);
}
Axis.prototype.facet = facet;
Axis.prototype.render = render;
Axis.prototype.update = update;
Axis.prototype.isHorizontal = isHorizontal;

setMethodsFromAttrs(Axis, _attrs);

export default _axis;
export {
  defaultFont, 
  verticalAxisThickness, 
  horizontalAxisThickness, 
  offsetThickness, 
  tickFormatForContinious, 
  tickFormatForOrdinal,
  tickNumber
};