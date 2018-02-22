import {dispatch, local} from 'd3';
import {attrFunc, className, magicTableColorScheme, setMethodFromDefaultObj} from '../../modules/util';

import aggregate from './aggregate';
import aggregateMixed from './aggregateMixed';
import color from './color';
import colorDomain from './colorDomain';
import condition from './condition';
import demute from './demute';
import demuteLegend from './demuteLegend';
import demuteNodes from './demuteNodes';
import demuteRegions from './demuteRegions';
import dimension from './dimension';
import dimensions from './dimensions';
import domain from './domain';
import filterNodes from './filterNodes';
import filterRegions from './filterRegions';
import hideTooltip from './hideTooltip';
import innerSize from './innerSize';
import legend from './legend';
import limitKeys from './limitKeys';
import limitRows from './limitRows';
import margin from './margin';
import measure from './measure';
import measureName from './measureName';
import measures from './measures';
import mixedDimension from './mixedDimension';
import mute from './mute';
import muteLegend from './muteLegend';
import muteNodes from './muteNodes';
import muteRegions from './muteRegions';
import nodeName from './nodeName';
import nodes from './nodes';
import offset from './offset';
import parent from './parent';
import rebindOnMethod from './rebindOnMethod';
import regions from './regions';
import remove from './remove';
import render from './render';
import renderCanvas from './renderCanvas';
import renderFrame from './renderFrame';
import renderLegend from './renderLegend';
import renderRegion from './renderRegion';
import renderSpectrum from './renderSpectrum';
import renderTooltip from './renderTooltip';
import reset from './reset';
import size from './size';
import scale from './scale';
import setAttrs from './setAttrs';
import setCustomDomain from './setCustomDomain';
import showTooltip from './showTooltip';
import styleFont from './styleFont';
import tooltip from './tooltip';
import updateColorScale from './updateColorScale';

const defaultFont = {
  'font-family': 'sans-serif',
  'font-size': 12,
  'font-weight': 'lighter',
  'font-style': 'normal'
}

const continousColorScheme = ['#ece7f2','#50C3F7'];
const categoryColorScheme = magicTableColorScheme;

const _attrs = {
  aggregated: false,
  color : categoryColorScheme,
  colorDomain: null,
  container: null,
  customDomain: null,
  data: [],
  dimensions: [],
  font: defaultFont,
  height: 480,
  label: null,
  legend: null,
  limitKeys : 200,
  limitRows: 1000,
  name: null,
  nodeName: className('mark node', true),
  margin: {top: 40, right: 40, bottom: 40, left: 40},
  measures: [],
  muteIntensity: 0.3,
  parent : null,
  regionName: className('mark region', true),
  size: null,
  tooltip: true,
  transition: {duration: 600, delay: 20},
  width: 640,
  zeroOffset: false,
  zeroMargin: false
}

/** 
 * Core of jelly-chart 
 * @class Core
 * */
class Core {
  constructor() {
    this.setAttrs(_attrs);
    this.__execs__ = {
      axis: {}, //axis settings
      condition: null, 
      canvas: null, 
      hidden: null,
      field: {}, // {x,y,color,raidus}
      legend:null, 
      mark: local(),
      scale: {},
      tooltip: null,
      regions: null,
      nodes: null
    }; 
    this.on = undefined; 
    this.__execs__.selectDispatch = dispatch('selectClick', 'selectEnter', 'selectLeave', 'legendEnter', 'legendLeave');
    this.rebindOnMethod(this.__execs__.selectDispatch);
  }
  
}

/**
 * If fontStyle is specified, sets the font styles to the specified object and returns the instance itself. If fontStyle is not specified, returns the instance's current fontStyle.
 * @function
 * @example
 * core.font({'font-size': 16}); //sets th font size to 16px, then returns core itself;
 * core.font(); //returns the current fontStyle object;
 * @param {object} [fontStyle]
 * @param {string} fontStyle.font-family=sans-serif
 * @param {number} fontStyle.font-size=12
 * @param {string} fontStyle.font-weight=lighter
 * @param {string} fontStyle.font-style=normal
 * @return {(fontStyle|Core)}
 */
Core.prototype.font = setMethodFromDefaultObj('font', defaultFont);

/**
 * If transition is specified, sets the transition duration and delay to the specified object and returns the instance itself. If transition is not specified, returns the instance's current transition.
 * @function
 * @example
 * core.transition({duration: 1000}); //sets the transition duration to 1000 milliseconds, then returns core itself;
 * core.transition(); //returns the current transition object;
 * @param {object} [transition]
 * @param {number} transition.duration=600 transition duration in milliseconds
 * @param {number} transition.delay=20 trnasition delay in millisecends
 * @return {(transition|Core)}
 */
Core.prototype.transition = setMethodFromDefaultObj('transition', _attrs.transition);

/**
 * @function
 * @private
 * @param {boolean} [aggregated=false]
 * @return {(aggregated|Core)}
 */
Core.prototype.aggregated = attrFunc('aggregated');

/**
 * The Core method `.container` sets a selector of a chart holder element or an element itself as its container. Core finds the holder element and renders a chart on it.
 * If container is specified, sets a selector or a element and returns the instance itself. If container is not specified, returns the instance's current container.
 * @function
 * @example
 * core.container('#chart-container'); //sets a selector of a chart holder element as its container
 * core.container(document.getElementById('chart-container')); //sets an element as its container
 * core.container(); //returns the current container;
 * @param {(string|Element)} [container] a selector or an element
 * @return {((string|Element)|Core)}
 */
Core.prototype.container = attrFunc('container');

/**
 * The Core method `.customDomain` sets a user-defined domain of a measrure variable. It's reflection differs based on the char type.
 * If customDomain is specified, sets a selector or a element and returns the instance itself. If customDomain is not specified, returns the instance's current customDomain.
 * @function
 * @example
 * core.customDomain([0, 100]); //sets a custom domain;
 * core.container(); //returns the current custom domain;
 * @param {Number[]} [customDomain] a user-defined domain of a measrure variable
 * @return {(customDomain|Core)}
 */
Core.prototype.customDomain = attrFunc('customDomain');

/**
 * If data is specified, sets data and returns the instance itself. The data shoud be an array of objects, and the object includes the properties used as dimensions and measures. If data is not specified, returns the instance's current data.
 * @function
 * @example
 * core.data([
 *    {name: 'a', value: 10},
 *    {name: 'a', value: 100},
 *    {name: 'b', value: 20}
 *  ]) //sets data
 *  .dimensions(['name'])
 *  .measures(['value']); 
 * 
 * core.data(); //returns the current data;
 * @param {Object[]} [data] 
 * @return {(data|Core)}
 */
Core.prototype.data = attrFunc('data');

/**
 * If height is specified, sets height of the container and returns the instance itself. The unit of height is a pixel. If height is not specified, returns the instance's current height.
 * @function
 * @example
 * core.height(600); //sets a custom height;
 * core.height(); //returns the current height;
 * @param {number} [height=480] height of the container
 * @return {(height|Core)}
 */
Core.prototype.height = attrFunc('height');

/**
 * If label is specified as true, sets the chart to show labels on its marks and returns the instance itself. If label is not specified, returns the instance's current height.
 * @function
 * @example
 * core.label(true); //shows labels
 * core.label(); //returns the current height;
 * @param {boolean} [label=false] whether to show labels on marks
 * @return {(label|Core)}
 */
Core.prototype.label = attrFunc('label');
Core.prototype.name = attrFunc('name');

/**
 * If muteIntensity is specified, sets muteIntensity of the chart and returns the instance itself. MuteIntensity determines opacity of marks which is muted by {@link Core#mute .mute} method. If muteIntensity is not specified, returns the instance's current width.
 * @function
 * @example
 * core.muteIntensity(0.5); //sets a custom width;
 * core.muteIntensity(); //returns the current width;
 * @param {number} [muteIntensity=0.3] opacity of muted marks
 * @return {(muteIntensity|Core)}
 */
Core.prototype.muteIntensity = attrFunc('muteIntensity');
Core.prototype.regionName = attrFunc('regionName');

/**
 * If width is specified, sets width of the container and returns the instance itself. The unit of width is a pixel. If width is not specified, returns the instance's current width.
 * @function
 * @example
 * core.width(600); //sets a custom width;
 * core.width(); //returns the current width;
 * @param {number} [width=640] width of the container
 * @return {(width|Core)}
 */
Core.prototype.width = attrFunc('width');
Core.prototype.zeroOffset = attrFunc('zeroOffset');
Core.prototype.zeroMargin = attrFunc('zeroMargin');

Core.prototype.aggregate = aggregate;
Core.prototype.aggregateMixed = aggregateMixed;
Core.prototype.color = color;
Core.prototype.colorDomain = colorDomain;
Core.prototype.condition = condition;
Core.prototype.demute = demute;
Core.prototype.demuteLegend = demuteLegend;
Core.prototype.demuteNodes = demuteNodes;
Core.prototype.demuteRegions = demuteRegions;
Core.prototype.dimension = dimension;
Core.prototype.dimensions = dimensions;
Core.prototype.domain = domain;
Core.prototype.filterNodes = filterNodes;
Core.prototype.filterRegions = filterRegions;
Core.prototype.hideTooltip = hideTooltip;
Core.prototype.innerSize = innerSize;
Core.prototype.legend = legend;
Core.prototype.limitKeys = limitKeys;
Core.prototype.limitRows = limitRows;
Core.prototype.margin = margin;
Core.prototype.mixedDimension = mixedDimension;
Core.prototype.measure = measure;
Core.prototype.measureName = measureName;
Core.prototype.measures = measures;
Core.prototype.mute = mute;
Core.prototype.muteLegend = muteLegend;
Core.prototype.muteNodes = muteNodes;
Core.prototype.muteRegions = muteRegions;
Core.prototype.nodeName = nodeName;
Core.prototype.nodes = nodes;
Core.prototype.offset = offset;
Core.prototype.parent = parent;
Core.prototype.tooltip = tooltip;
Core.prototype.scale = scale;
Core.prototype.styleFont = styleFont;
Core.prototype.rebindOnMethod = rebindOnMethod;
Core.prototype.regions = regions;
Core.prototype.remove = remove;
Core.prototype.render = render;
Core.prototype.renderCanvas = renderCanvas;
Core.prototype.renderFrame = renderFrame;
Core.prototype.renderLegend = renderLegend;
Core.prototype.renderRegion = renderRegion;
Core.prototype.renderSpectrum = renderSpectrum;
Core.prototype.renderTooltip = renderTooltip;
Core.prototype.reset = reset;
Core.prototype.size = size;
Core.prototype.setAttrs = setAttrs;
Core.prototype.setCustomDomain = setCustomDomain;
Core.prototype.showTooltip = showTooltip;
Core.prototype.updateColorScale = updateColorScale;

export default Core;
export {continousColorScheme};
