import {local, select, transition} from 'd3';
import {setMethodsFromAttrs} from './util';
import {className, labelFormat} from './util';
import {countMeasure, countMeasureTitle} from './measureField';

const arrowWidth = 4;
const backgroundColor = '#ffffff';
const greyColor = '#485464';
const greyColor2 = '#171b20';
const IS_IE9 = typeof navigator === 'object' ? (/MSIE 9/i.test(navigator.userAgent)) : false;
const defaultFont = {
  'font-family': 'sans-serif',
  'font-size': 12,
  'font-weight': 'normal',
  'font-style': 'normal'
};
const pointOriginColor = '#fff';

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
      .style('pointer-events', 'none')
      .style('background-color', backgroundColor)
      .style('padding', '9px')
      .style('border-radius', '2px')
      .style('border-color', '#b2c0d0')
      .style('box-shadow', '0 0 10px 0 rgba(72, 84, 100, 0.2)')
      .style('position', 'absolute')
      .style('z-index', '999')
      .style('min-width', '127px')
      .call(_styleOpacity, 0)
    
    tooltip.append('div')
      .attr('class', className('keys'))
      .style('padding-bottom', '1em')
			.style('letter-spacing', '0.1px')
			.style('color', greyColor2)
			.style('font-weight', 'bold')
			.style('font-size', '12px')
    tooltip.append('ul')
			.attr('class', className('values'))
			.style('list-style', 'none')
			.style('padding', 0)
			.style('margin', 0)
		// remove arrow
    // tooltip.append('div')
    //   .attr('class', className('arrow'))
    //   .style('position', 'absolute')
    //   .style('top', 'calc(' + arrowWidth + 'px + 50%)')
    //   .style('left', '0%')
    //   .style('margin', -(arrowWidth*2) + 'px')
    //   .style('border-width', arrowWidth + 'px')
    //   .style('border-style', 'solid')
    //   .style('border-color', 'transparent ' + backgroundColor + ' transparent transparent')
    //   .text(' ');
  }
  for (let fontKey in this.font()) {
    tooltip.style(fontKey, this.font()[fontKey] + (fontKey === 'font-size' ? 'px' : ''));
  }
  this.__execs__.tooltip = tooltip;
  _position.call(this);
  _event.call(this);
}

function hide() {
  const showTrans = transition().duration(140);
  const tooltip = this.__execs__.tooltip;
  const target = this.__attrs__.target;
  const chartType = target.__attrs__.name;

  target.__execs__.canvas.selectAll(this.nodeName()).selectAll('circle').transition(showTrans).style('fill',
      chartType === 'XYHeatmap' ? d => d.color : pointOriginColor);
  target.__execs__.canvas.selectAll(this.nodeName()).selectAll('circle').transition(showTrans).attr('stroke',
      chartType === 'XYHeatmap' ? pointOriginColor : d => d.color);

  target.__execs__.canvas.selectAll(this.nodeName()).selectAll('circle')
      .transition(showTrans)
      .attr('opacity', d => {
        let point = target.__attrs__.hasOwnProperty('point') ? target.__attrs__.point : null;
        let opacity = 1;
        if (d.hasOwnProperty('opacity')) opacity = d.opacity;
        else if (!point && point !== null) opacity = 0;
        return opacity;
      })
  if(chartType === 'Spider') {
    target.__execs__.canvas.selectAll(this.nodeName()).selectAll(className('dummy', true)).transition(showTrans).attr('opacity', 0)
  }

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
    .show(point);
  return this;
}

function renderPoint(point){
  const showTrans = transition().duration(140);
  const target = this.target();
  const isMulti = !!target.__attrs__.multiTooltip;
  if(isMulti) return;
  const shape = target.__attrs__.shape;
  const isShowPoint = !!target.__attrs__.point;
  const pointType = target.__attrs__.point && target.__attrs__.point.type ? target.__attrs__.point.type : 'empty';
  if(pointType === 'empty'){
    if (shape === 'line') {
      target.__execs__.canvas.selectAll(this.nodeName()).selectAll('circle').transition(showTrans).style('fill', pointOriginColor);
    }
    target.__execs__.canvas.selectAll(this.nodeName()).selectAll('circle').transition(showTrans).attr('stroke', d => d.color);
  }else{
    target.__execs__.canvas.selectAll(this.nodeName()).selectAll('circle').transition(showTrans).style('fill', d => d.color);
    target.__execs__.canvas.selectAll(this.nodeName()).selectAll('circle').transition(showTrans).attr('stroke', pointOriginColor)
  }
  if(!isShowPoint) target.__execs__.canvas.selectAll(this.nodeName()).selectAll('circle').transition(showTrans).attr('opacity',
      shape === 'line' ? 0 : 0.3)
  let showPoint =  select(point).classed(className('show'), true).selectAll('circle').transition(showTrans).attr('opacity', 1)
  if(pointType === 'empty'){
    showPoint.style('fill', d => d.color)
    showPoint.attr('stroke', 'rgb(255, 255, 255)')
  }else{
    showPoint.style('fill', 'rgb(255, 255, 255)')
    showPoint.attr('stroke', d => d.color);
  }
}

function show(point) {
  let valueFormat = this.valueFormat();
	let tooltip = this.__execs__.tooltip;
	const isMultiTooltip = !!this.__attrs__.target.__attrs__.multiTooltip
	
	renderPoint.call(this, point)

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
  
  value = value.enter().append('li')
		.attr('class', className('value'))
		.style('list-style', 'none')
		.style('padding', 0)
    .style('margin', 0)
    .style('overflow', 'hidden')
    .merge(value)
  if (this.showDiff() && value.size() > 1) {
    value.style('color', greyColor);
  } else {
    value.style('color', greyColor);
  }

  let label = value.selectAll('span')
    .data(d => [d, d.name, d.value, d.color])
		.enter().append('span')
	
	tooltip.select(className('values', true)).selectAll(className('value', true)).selectAll('span')
    .style('padding', 0)
		.style('margin', 0)
		.style('color', (_,i) => (i === 1 ? greyColor : greyColor2))
    .style('margin-bottom', '.35em')
    .style('margin-right', (_,i) => {
			if(isMultiTooltip){
				return i===0 ? '1em' : i===1 ? '2em' : 0
			}else{
				return i===1 ? '2em' : 0
			}
			
		})
		.style('text-align', (_,i) => (i===0 ? 'left' : 'right'))
		.style('display', 'block')
		.style('float', 'left')
		.style('width', (_,i) => {
			if(isMultiTooltip){
				return i === 0 ? '11px' : 'auto'
			}else{
				return i === 0 ? '0px' : 'auto'
			}
		})
		.style('height', (_,i) => (i === 0 ? '11px' : 'auto'))
		.style('background-color', (d,i) => {
			return i === 0 && isMultiTooltip ? d.color : 'none'
		})
    .merge(label)
    .text((d,i) => {
      if (i === 1) {
        return d.localeCompare(countMeasure.field) === 0 ? countMeasureTitle : d;
      } else if (i===2) {
        return valueFormat(d);
      }
		})
	//exit
	value.exit().remove();
	label.exit().remove();
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
