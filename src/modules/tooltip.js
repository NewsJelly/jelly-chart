import {local, select} from 'd3';
import {setMethodsFromAttrs} from './util';
import {className, labelFormat} from './util';
import {countMeasure, countMeasureTitle} from './measureField';

const arrowWidth = 4;
const backgroundColor = '#001a32';
const whiteColor = '#fff';
const greyColor = '#7b92ae';
const IS_IE9 = typeof navigator === 'object' ? (/MSIE 9/i.test(navigator.userAgent)) : false;
const defaultFont = {
  'font-family': 'sans-serif',
  'font-size': 11,
  'font-weight': 'normal',
  'font-style': 'normal'
};

const _attrs = {
  absolute: false,
  anchor: {x:'left', y:'top'}, 
  color: null,
  dx: 0,
  dy: 0,
  font: defaultFont,
  offsetFunc: null,
  keys : null, //{name, value}
  keyFunc: null, // function(d) { return {name, value}}
  nodeName : className('mark node', true),
  target: null,
  valueFormat : null,
  valueFunc: null,
  values : [], //[{name, value}, ...]
  x: 0,
  y: 0,
  fromMulti: false,
  showDiff : false
}

class Tooltip {
  constructor() {
    this.__attrs__ = JSON.parse(JSON.stringify(_attrs));
    this.__execs__ = {tooltip:null, mark:null, init: true};
    this.valueFormat(labelFormat);
  }
}

function _tooltip () {
  return new Tooltip();
}

function _styleOpacity(selection, value = 1) {
  if (IS_IE9) return selection.style('filter', 'alpha(opacity=' + (value * 100) + ')');
  else return selection.style('opacity', value);
}

function _event() {
  const that = this;
  const target = this.target();
  const points = target.__execs__.canvas.selectAll(this.nodeName());
  points.on('mouseleave.tooltip', function() {
    if (that.fromMulti()) return;
    that.hide();
  }).on('mouseenter.tooltip', function(d) {
    showFromPoint.call(that, this, d);
  })
}

function _position() {
  const target = this.target();
  const points = target.__execs__.canvas.selectAll(this.nodeName());
  const root = (target.parent() ? target.parent() : target).__execs__.canvas.node();
  const absLocal = local();
  const offsetFunc = this.offsetFunc();
  const absolute = this.absolute();
  let initX = 0; 
  let initY = 0;
  let offset = target.offset();
  initX += offset.left; initY += offset.top;
  if (target.parent()) { //add parent's offset
    offset = target.parent().offset();
    initX += offset.left; initY += offset.top;
  }
  //add frame and svg offset
  let svgRect = root.parentNode.getBoundingClientRect();    
  let frameRect = root.parentNode.parentNode.getBoundingClientRect();
  initX += svgRect.left - frameRect.left;
  initY += svgRect.top - frameRect.top; 
  initX += arrowWidth;
  
  let __pos = function (cur,pos) {
    if (cur.x) pos.x += cur.x;
    if (cur.y) pos.y += cur.y;
  }
  let __absPos = function(d) {
    let pos = {x:initX, y:initY};
    if (offsetFunc && typeof offsetFunc === 'function') {
      let offset = offsetFunc.apply(this, arguments);
      pos.x += offset.x; pos.y += offset.y;
    }
    let cur = d;
    if (absolute) {
      __pos(cur, pos);
    } else {
      while(cur) {
        __pos(cur, pos);
        cur = cur.parent;
      }
    }
    return pos;
  }
  points.each(function() {
    let pos = __absPos.apply(this, arguments);
    absLocal.set(this, pos);
  })
  this.__execs__.mark = absLocal;
}

function _render(selection) { //pre-render the tooltip 
  let tooltip = this.__execs__.tooltip //selection.select('.tooltip'); //FIXME: can not generate tooltip area independently.
  if (selection.style('position') === 'static') selection.style('position', 'relative');
  if (!tooltip || tooltip.empty()) {
    tooltip = selection.append('div').attr('class', className('tooltip'))
      .style('color', whiteColor)
      .style('pointer-events', 'none')
      .style('background-color', backgroundColor)
      .style('padding', '9px')
      .style('border-radius', '8px')
      .style('position', 'absolute')
      .style('z-index', '999')
      .call(_styleOpacity, 0)
    
    tooltip.append('div')
      .attr('class', className('keys'))
      .style('padding-bottom', '1em')
      .style('letter-spacing', '0.1px')
      .call(_styleOpacity, 0.9);
    tooltip.append('table')
      .attr('class', className('values'))
      .style('border-collapse', 'collapse')
      .call(_styleOpacity, 0.72);
    tooltip.append('div')
      .attr('class', className('arrow'))
      .style('position', 'absolute')
      .style('top', 'calc(' + arrowWidth + 'px + 50%)')
      .style('left', '0%')
      .style('margin', -(arrowWidth*2) + 'px')
      .style('border-width', arrowWidth + 'px')
      .style('border-style', 'solid')
      .style('border-color', 'transparent ' + backgroundColor + ' transparent transparent')
      .text(' ');
  }
  for (let fontKey in this.font()) {
    tooltip.style(fontKey, this.font()[fontKey] + (fontKey === 'font-size' ? 'px' : ''));
  }
  this.__execs__.tooltip = tooltip;
  _position.call(this);
  _event.call(this);
}

function hide() {
  let tooltip = this.__execs__.tooltip;
  tooltip.transition().duration(180).call(_styleOpacity, 0)

}

function render(selection) {
  selection = select(selection);
  _render.call(this, selection);
}

function showFromPoint(point, d) {
  if (this.fromMulti()) return;
  const color = this.color();
  const key = this.keyFunc();
  const value = this.valueFunc();
  let pos = this.__execs__.mark.get(point);
  this.x(pos.x).y(pos.y)
    .color(color ? color : d.color)
    .key(key ? key.call(this, d, d.key): null)
    .value(value.call(this, d, d.text))
    .show();
  return this;
}

function show() {
  let valueFormat = this.valueFormat();
  let tooltip = this.__execs__.tooltip;
  
  if(this.keys()) {
    let key = tooltip.select(className('keys', true)).selectAll(className('key', true))
    .data(this.keys())
    key.exit().remove();
    key = key.enter().append('div')
      .attr('class', className('key'))
      .merge(key);
    key.text(d => d.value);
  }
  let value = tooltip.select(className('values', true)).selectAll(className('value', true))
    .data(this.values());
  value.exit().remove();
  value = value.enter().append('tr')
    .attr('class', className('value'))
    .merge(value)
  if (this.showDiff() && value.size() > 1) {
    value.style('color', (_,i) => (i ===0 ? greyColor : whiteColor));
  } else {
    value.style('color', whiteColor);
  }
  
  let label = value.selectAll('td')
    .data(d => [d.name, d.value])
  label.exit().remove();
  label = label.enter().append('td')
    .style('padding', 0)
    .style('margin', 0)
    .style('padding-bottom', '.35em')
    .style('padding-right', (_,i) => (i===0 ? '2em' : 0))
    .style('text-align', (_,i) => (i===0 ? 'left' : 'right'))
    .merge(label)
    .text((d,i) => {
      if (i === 0) {
        return d.localeCompare(countMeasure.field) === 0 ? countMeasureTitle : d;
      } else {
        return valueFormat(d);
      }
    })
  let tooltipH = tooltip.node().getBoundingClientRect().height/2;
  tooltip
    .style('left', (this.x() + this.dx()) + 'px')
    .style('top', this.y() + this.dy() - tooltipH + 'px')
  .transition().duration(180)
    .call(_styleOpacity, 1);
  
}

function key(_val) {
  if(!arguments.length || _val === null) return this;
  if('name' in _val && 'value' in _val) this.__attrs__.keys = [_val];
  return this;
}

function value(_val) {
  if(!arguments.length) return this;
  if(Array.isArray(_val)) {
    this.__attrs__.values = _val;
  } else if('name' in _val && 'value' in _val) {
    this.__attrs__.values = [_val];
  }
  return this;
}

Tooltip.prototype.hide = hide;
Tooltip.prototype.render = render;
Tooltip.prototype.show = show;
Tooltip.prototype.showFromPoint = showFromPoint;
Tooltip.prototype.key = key;
Tooltip.prototype.value = value;

setMethodsFromAttrs(Tooltip, _attrs);

export default _tooltip;