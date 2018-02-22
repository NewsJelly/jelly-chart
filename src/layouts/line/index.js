import {dispatch} from 'd3';
import Facet from '../facet/';
import brushMixin from '../brushMixin';
import fitLineMixin from '../fitLineMixin';
import seriesMixin from '../seriesMixin';
import zoomMixin from '../zoomMixin';
import paddingMixin from '../paddingMixin';
import shapeMixin from '../shapeMixin';
import stackMixin from '../stackMixin';
import {mixedMeasure} from '../../modules/measureField';
import {attrFunc, genFunc, mix} from '../../modules/util';
import _brush from './_brush';
import _brushZoom from './_brushZoom';
import _mark from './_mark';
import _munge from './_munge';
import _scale from './_scale';
import _axis from './_axis';
import _meanLine from './_meanLine';
import _legend from './_legend';
import _region from './_region';
import _facet from './_facet';
import _fitLine from './_fitLine';
import _tooltip from './_tooltip';
import _zoom from './_zoom';
import {leastSquare as lsFunc} from '../../modules/transform';

const size = {range: [2, 2], scale: 'linear', reverse: false};
const shapes = ['line', 'area'];
const conditions = ['normal', 'count', 'mixed'];
const _attrs = {
  meanLine : false,
  multiTooltip: false,
  padding: 0,
  pointRatio : 2,
  regionPadding: 0.1,
  shape: shapes[0],
  scaleBandMode : false,
  size: size,
  individualScale: false
};

/**
 * renders a line chart
 * @class Line
 * @augments Core
 * @augments RectLinear
 * @augments Facet
 * @augments FitLineMixin
 * @augments SeriesMixin
 * @augments BrushMixin
 * @augments ZoomMixin
 * @augments PaddingMixin
 * @augments ShapeMixin
 */
class Line extends mix(Facet).with(fitLineMixin, seriesMixin, brushMixin, zoomMixin, paddingMixin, shapeMixin, stackMixin) {
  constructor() {
    super();
    this.setAttrs(_attrs);
    this.__execs__.multiTooltipDispatch = dispatch('selectStart', 'selectMove', 'selectEnd', 'multiTooltip');
    this.rebindOnMethod(this.__execs__.multiTooltipDispatch);
  }

  /**
   * If is true, renders the tooltip showing multiple points on the same horizontal position. If is a string or object, sets sorting order of items by each value. If multiTooltip is not specified, returns the instance's multiTooltip setting.
   * @example
   * line.multiTooltip(true) // show multiple points on the same horizontal position on a tooltip
   * line.multiTooltip('ascending') //sort items in ascending order by their each value
   * line.multiTooltip(false) 
   * line.multiTooltip() 
   * @param {boolean|string|object} [multiTooltip=false]
   * @param {string} [multiTooltip.sortByValue=natural] (natural|ascending|descending)
   * @return {multiTooltip|Line}
   */
  multiTooltip(multiTooltip) {
    if (!arguments.length) return this.__attrs__.multiTooltip;
    if (typeof multiTooltip === 'boolean') {
      if (multiTooltip) {
        multiTooltip = {sortByValue: 'natural'};
      } 
    } 
    if (typeof multiTooltip === 'object') {
      if (!multiTooltip.sortByValue) multiTooltip.sortByValue = 'natural';
    }
    this.__attrs__.multiTooltip = multiTooltip;
    return this;
  }

  /**
   * gets a result of linear least squres from serieses. If key is specified, returns the value only froma specific series. It is used for draw fit-lines.
   * @param {string} [key] a name of a series 
   * @example
   * let l = line.data([
   *  {name: 'A', sales: 10, profit: 5},
   *  {name: 'B', sales: 20, profit: 10},
   *  {name: 'C', sales: 30, profit: 3},
   *  ...
   *  ]) //sets data
   *  .dimensions(['name'])
   *  .measures(['sales', 'profit'])
   *  .render();
   * l.leastSquare('A') // returns a result of the series A
   * l.leastSquare() // returns from all serieses
   * @return {object[]} returns [{key: fitLineVal, slope, intercept, rSquare}...] 
   */
  leastSquare(key) {
    const measureName = this.measureName();
    const individualScale = this.isIndividualScale();
    return this.__execs__.munged.filter(series => {
      if (typeof key === 'string') {
        return series.data.key === key;
      } else {
        return true;
      }
    }).map(series => {
      let targets = series.children.map(d => {return {x: d.data.key, y:d.data.value[measureName]}});
      let ls = lsFunc(targets);
      if (individualScale && series.scale) {
        ls.scale = series.scale;
      }
      ls.key = series.data.key;
      return ls;
    });
  }

  measureName() {
    let measures = this.measures();
    let yField;
    if (this.condition() === conditions[2]) yField = mixedMeasure.field; 
    else if (this.aggregated() && measures[0].field === mixedMeasure.field) yField = measures[0].field;
    else yField = measures[0].field + '-' + measures[0].op;
    return yField;
  }

  isCount() {
    return this.condition() === conditions[1];
  }

  isFacet() {
    return this.facet() && this.isNested() && !this.stacked();
  }

  isIndividualScale() {
    return this.individualScale() && this.isNested() && !this.stacked();
  }

  isMixed() {
    return this.condition() == conditions[2] ;
  }

  isNested() {
    let dimensions = this.dimensions();
    let condition = this.condition();
    return dimensions.length === 2 || (condition == conditions[2] && dimensions.length === 1);
  }

  isStacked() {
    return this.stacked() && this.isNested();
  }

  muteFromLegend(legend) {
    this.muteRegions(legend.key);
  }
  
  muteToLegend(d) {
    this.muteLegend(d.parent.data.key);
  }
  
  demuteFromLegend(legend) {
    this.demuteRegions(legend.key);
  }
  
  demuteToLegend(d) {
    this.demuteLegend(d.parent.data.key);
  }
  
  showMultiTooltip(tick, start) { //for the facet condition
    if (this.multiTooltip()) {
      let mt = this.__execs__.tooltip;
      mt.tick(tick, start);
    }
  }

  renderLayout(keep) {
    this.reset(keep);
    this.renderFrame();
    _munge.call(this);
    if (this.isBrushZoom()) {
      this.noAxisOffset(true); 
      this.renderCanvas();
      _brushZoom.call(this);
      return; 
    }
    _scale.call(this, keep);
    this.renderCanvas(this.point() ? this.size().range[0]*2 : 0);
    _axis.call(this);
    _region.call(this);
    if (this.isFacet()) {
      _facet.call(this);
    } else {
      _mark.call(this);
    }
    _meanLine.call(this);
    _fitLine.call(this);
    _tooltip.call(this);
    _zoom.call(this);
    _brush.call(this);
    _legend.call(this);
  }
} 
/**
 * If meanLine is specified sets the meanLine setting and returns the Line instance itself. If meanLine is true renders a mean-line on each series. If meanLine is not specified, returns the current meanLine setting.
 * @function
 * @example
 * line.meanLine(true)
 * @param {boolean} [meanLine=false] If is true, renders a mean-line.
 * @return {meanLine|Line}
 */
Line.prototype.meanLine = attrFunc('meanLine');
Line.prototype.scaleBandMode = attrFunc('scaleBandMode');
/**
 * If individualScale is specified sets the individualScale setting and returns the Line instance itself. When a line chart has multiple measures, each measure will be a series. If individualScale is true, when has multiple measures, each series will be drawn based on an individual scale of itself.
 * @function
 * @example
 * line.individualScale(true)
 * @param {boolean} [individualScale=false] If is true, renders a mean-line.
 * @return {individualScale|Line}
 */
Line.prototype.individualScale = attrFunc('individualScale');

export default genFunc(Line);
export {conditions, shapes};
