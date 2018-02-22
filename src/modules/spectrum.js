import {range, scaleLinear, symbol, symbolTriangle} from 'd3';
import {className, labelFormat, safari, setMethodsFromAttrs, getUniqueId} from './util';
import {countMeasure, countMeasureTitle} from './measureField';

const defaultFont = {
  'font-family': 'sans-serif',
  'font-size': 11,
  'font-weight': 'normal',
  'font-style': 'normal'
};
const gradientPrefix = 'legend-gradient-';
//const labelClipPath = 'legend-label-clip-path';
const orients = ['top', 'bottom'];
const _attrs = {
  color: '#6e6e6e',
  field: null,
  height: 0,
  orient: orients[0],
  gradientWidth: 150,
  gradientHeight: defaultFont['font-size'],
  scale: null,
  showTooltip: true,
  title: null,
  width: 0,
  x: 0,
  y: 0,
  font: defaultFont
}
class Spectrum {
  constructor() {
    this.__attrs__ = JSON.parse(JSON.stringify(_attrs));
    this.__execs__ = {spectrum:null, scale:null};
  }
}

function _spectrum() {
  return new Spectrum();
}

function _style(selection) {
  let font = this.font();
  for (var k in font) {
    selection.style(k, (k === 'font-size' ? font[k] + 'px' : font[k]));
  }
}

function _gradientAlternative(selection, width, height, colorRange) {
  const chipNum = width;
  const chipW = width / chipNum;
  let fill = scaleLinear().domain([0, width]).range(colorRange);
  let chips = range(0, chipNum).map(function (i) {
    return i * chipW + chipW;
  });
  selection.selectAll(className('gradient-chip', true))
    .data(chips)
    .enter().append('rect')
    .attr('class', className('gradient-chip'))
    .attr('width', chipW)
    .attr('height', height)
    .attr('x', function (d) {
      return d - chipW;
    }).style('fill', d => fill(d));
}

function _render(selection) {
  this.__execs__.spectrum = selection.attr('transform', 'translate(' +[this.x(), this.y()] + ')')
  const scale = this.scale();
  const colorRange = scale.range();
  const gradientWidth = this.gradientWidth();
  const gradientHeight = this.gradientHeight();
  this.__execs__.scale = scaleLinear().domain(scale.domain()).rangeRound([0, gradientWidth]);

  let area = selection.select(className('gradient-area', true));
  if (area.empty()) {
    let gradientId = getUniqueId(gradientPrefix);
    let triangleSymbol = symbol().type(symbolTriangle).size(40);
    area = selection.append('g').attr('class', className('gradient-area'))
    area.append('path').attr('class', className('arrow'))
      .attr('fill', '#777')
      .attr('d', triangleSymbol)
      .style('visibility', 'hidden');
    selection.append('defs').append('linearGradient')
      .attr('id', gradientId);
  }
  area.attr('transform', 'translate(' + [(this.width() - gradientWidth) /2, 18] + ')');
  let gradient = selection.select('linearGradient')
  let stop = gradient.selectAll('stop')
    .data(colorRange);
  stop.enter().append('stop')
    .merge(stop).attr('offset', (d,i) => i*100 + '%')
    .attr('stop-color', d => d)
  if(safari()) {
    area.call(_gradientAlternative, gradientWidth, gradientHeight, colorRange);
  } else {
    let rect = area.selectAll(className('gradient-rect', true))
    .data([scale])
    rect.enter().append('rect')
      .attr('class', className('gradient-rect'))
      .merge(rect)
      .attr('width', this.gradientWidth())
      .attr('height', this.gradientHeight())
      .attr('fill', 'url(#' +gradient.attr('id') + ')');
  }
  let label = area.selectAll(className('label', true))
    .data(scale.domain())
  label.enter().append('text')
    .attr('class', className('label'))
    .merge(label)
    .attr('x', (d,i) => i * gradientWidth)
    .attr('y', gradientHeight)
    .attr('dy', '1.25em')
    .attr('text-anchor', 'middle')
    .style('fill', '#999')
    .text(d => labelFormat(d));
  let titleText = this.title() || this.field();
  titleText = titleText.localeCompare(countMeasure.field) === 0 ? countMeasureTitle : titleText;
  let title = area.selectAll('.title')
    .data([titleText])
  title.enter().append('text')
    .merge(title)
    .attr('class', className('title'))
    .attr('x', gradientWidth + this.font()['font-size'])
    .attr('y', gradientHeight * 0.5)
    .attr('dy', '.35em')
    .attr('text-anchor', 'start')
    .text(d => d);
}

function hide() {
  this.__execs__.spectrum.select(className('arrow', true))
    .style('visibility', 'hidden');
  return this;
}

function labelHeight() {
  return this.font()['font-size'];
}

function labelPadding() {
  return this.labelHeight() /2;
}

function show(value) {
  let pos = this.__execs__.scale(value);
  this.__execs__.spectrum.select(className('arrow', true))
    .style('visibility', 'visible')
    .attr('transform', 'translate(' + pos + ',-5)rotate(180)');
  return this;
}


function update() {

}
function render(selection) {
  _style.call(this, selection);
  _render.call(this, selection);
}

Spectrum.prototype.hide =  hide;
Spectrum.prototype.labelHeight = labelHeight;
Spectrum.prototype.labelPadding = labelPadding;
Spectrum.prototype.render = render;
Spectrum.prototype.show = show;
Spectrum.prototype.update = update;

setMethodsFromAttrs(Spectrum, _attrs);

export default _spectrum;