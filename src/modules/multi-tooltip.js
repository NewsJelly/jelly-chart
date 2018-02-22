import {bisector, mean, dispatch, event, select, selectAll, transition, ascending, descending} from 'd3';
import {rebindOnMethod, setMethodsFromAttrs} from './util';
import {className, labelFormat} from './util';

const defaultFont = {
  'font-family': 'sans-serif',
  'font-size': 12,
  'font-weight': 'normal',
  'font-style': 'normal'
};
const pointOriginColor = '#fff';
const baseColor = '#b0bec5';
const _attrs = {
  anchor: {x:'left', y:'top'}, 
  color: baseColor,
  dx: 0,
  dy: 0,
  height: null,
  font: defaultFont,
  nodeName: className('mark node', true), 
  tooltip: null,
  target: null,
  valueFormat: null,
  width: null,
  sortByValue: {type:'natural'},
  x: 0, 
  y: 0
}

class MultiTooltip {
  constructor() {
    this.__attrs__ = JSON.parse(JSON.stringify(_attrs));
    this.__execs__ = {tooltip:null, domain:null, dispatch: dispatch('start', 'move', 'end')};
    this.valueFormat(labelFormat);
    rebindOnMethod(this, this.__execs__.dispatch); 
  }
}

function _multiTooltip () {
  return new MultiTooltip();
}

function _event(selection) {
  const that = this;
  const domain = this.__execs__.domain;
  const dispatch = this.__execs__.dispatch;
  let bisectDomain = bisector(d => d.x).right;
  let lastTick = null;

  let _tick = function(start = false) {
    const clientRectLeft = selection.node().getBoundingClientRect().left;    
    let x = event.x - clientRectLeft;
    let i = bisectDomain(domain, x); 
    if (i > 0 && i < domain.length) {
      let d1 = Math.abs(x - domain[i-1].x);
      let d2 = Math.abs(domain[i].x - x);
      if (d1 < d2) i = i-1;
    } 
    i = Math.max(0, Math.min(domain.length-1, i));
    let tick = domain[i];
    if (!lastTick || tick.x !== lastTick.x || start) {
      _show.call(that, selection, tick);
      dispatch.call(start ? 'start': 'move', this, tick);
      lastTick = tick;
    }
  }

  selection.on('mouseenter.multi-tooltip', function() {
    _tick(true);
  }).on('mousemove.multi-tooltip', function() {
    _tick(false);
  }).on('mouseleave.multi-tooltip', function() {
    _hide.call(that, selection);
    dispatch.call('end', this);
    lastTick = null;
  });
  
}

function _domain() {
  const target = this.target();
  const points = target.__execs__.canvas.selectAll(this.nodeName());
  const domain = [];
  points.each(function(d) {
    //const result = mark.get(this);
    let find = domain.find(dd => dd.x === d.x);
    if (find) {
      find.points.push(this);
    } else {
      domain.push({x:d.x, points:[this], value: d.key});
    }
  })
  this.__execs__.domain = domain.sort((a,b) => a.x-b.x);
}

function _hide(selection) {
  const trans = transition().duration(180);
  selection.select(className('baseline', true)).transition(trans).attr('opacity', 0);

  let target = this.target();
  let circle = target.nodes().filter(function() {
    return select(this).classed(className('show'));
  }).classed(className('show'), false).selectAll('circle');
  if (!target.point()) circle.attr('opacity', 0);
  else circle.style('fill', pointOriginColor);
  if (this.tooltip()) this.tooltip().hide();
}

function _render(selection) {
  const innerSize = this.target().innerSize();
  selection.style('fill', 'none');
  let overlay = selection.select(className('overlay', true))
  if(overlay.empty()) {
    overlay = selection.append('rect').attr('class', className('overlay'))
      .style('cursor', 'crosshair');
    selection.append('line')
      .attr('class', className('baseline'))
      .attr('opacity', 0)
      .attr('shape-rendering', 'crispEdges')
      .attr('pointer-events', 'none');
  }
  selection.select(className('baseline', true))
    .attr('y1', 0).attr('y2', this.height() ? this.height() : innerSize.height)
    .attr('stroke', baseColor);
  overlay.attr('width', this.width() ? this.width() : innerSize.width)
    .attr('height', this.height() ? this.height() : innerSize.height);
  _domain.call(this);
  _event.call(this, selection);
  this.__execs__.tooltip = selection;
}

function _show(selection, tick) {
  const showTrans = transition().duration(140);
  const target = this.target();
  const filtered = [];
  if (!target.point()) { //remove existing points
    target.__execs__.canvas.selectAll(this.nodeName()).selectAll('circle').transition(showTrans).attr('opacity', 0);
  } else {
    target.__execs__.canvas.selectAll(this.nodeName()).selectAll('circle').transition(showTrans).style('fill', pointOriginColor);
  }
  let points = selectAll(tick.points)
    .each(function(d) {
      let x = d.x;
      if (x === tick.x) {
        filtered.push({key:d.key, x:d.x, y: d.y, text: d.text});
      }
    })
  
  points.classed(className('show'), true).selectAll('circle').transition(showTrans)
    .attr('opacity', 1)
    .style('fill', function(d){
      return d.color;
    })
  
  
  let baseline = selection.select(className('baseline', true));
  baseline.transition(showTrans).attr('opacity', 1)
    .attr('x1', tick.x + 0.5).attr('x2', tick.x + 0.5);  
  let tooltip = this.tooltip();
  let x, y= [];
  let values = [];
  selectAll(tick.points).each(function(d) {
    let pos = tooltip.__execs__.mark.get(this);
    x = pos.x;
    y.push(pos.y);
    values.push(d);
  });
  _sortByValue(values, this.sortByValue())
  values = values.map(d => {return {name: d.parent.data.key || d.data.key, value: d.text}})
  y = mean(y);
  y = Math.round(y);
  if (x && y) {
    tooltip.x(x).y(y)
    .key({name:'key', value:tick.value})
    .value(values)
    .show();
  } else {
    tooltip.hide();
  }
  
}

function hide() {
  _hide.call(this, this.__execs__.tooltip);
  dispatch.call('end', this);
}

function render(selection) {
  selection = select(selection);
  _render.call(this, selection);
}

function tick(tick) { //react to external dispatches
  const selection = this.__execs__.tooltip;
  const domain = this.__execs__.domain;
  if(tick !== undefined && tick !== null) {
    let find = domain.find(d => d.value == tick.value);
    _show.call(this, selection, {x: find ? find.x : tick.x, points: find ? find.points : null, value: find? find.value : null}); 
  } else { 
    _hide.call(this, selection);
  }
}

function _sortByValue(values, type = 'natural') {
  const types = ['natural', 'ascending', 'descending'];
  if (types.find(d => d === type)) {
    if (values.length > 0) {
      if (type === types[1]) {
        values.sort((a,b) => ascending(a.value,b.value));
      } else if (type === types[2]) {
        values.sort((a,b) => descending(a.value,b.value));
      }
    }
  }
}

MultiTooltip.prototype.hide = hide;
MultiTooltip.prototype.render = render;
MultiTooltip.prototype.tick = tick;

setMethodsFromAttrs(MultiTooltip, _attrs);

export default _multiTooltip;