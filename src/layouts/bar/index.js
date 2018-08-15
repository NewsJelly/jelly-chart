import Facet from '../facet/';
import paddingMixin from '../paddingMixin';
import sortMixin from '../sortMixin/';
import stackMixin from '../stackMixin';
import streamMixin from '../streamMixin';
import {mixedMeasure} from '../../modules/measureField';
import {attrFunc, genFunc, mix, setMethodFromDefaultObj} from '../../modules/util';
import _annotation from './_annotation';
import _axis from './_axis';
import _domain from './_domain';
import _facet from './_facet';
import _legend from './_legend';
import _mark from './_mark';
import _munge from './_munge';
import _padding from './_panning';
import _range from './_range';
import _region from './_region';
import _tooltip from './_tooltip';
import _unit from './_unit';
import _title from './_title';

const orients  = ['vertical', 'horizontal'];
const conditions = ['normal', 'count', 'mixed'];
const _attrs = {
  annotation: false,
  mono: true,
  orient: orients[0],
  padding: 0.05,
  showDiff: false,
  regionPadding: 0.1
};

/**
 * renders a bar chart
 * @class Bar
 * @augments Core
 * @augments RectLinear
 * @augments Facet
 * @augments SortMixin
 * @augments PaddingMixin
 * @augments StreamMixin
 * @todo write examples
 */
class Bar extends mix(Facet).with(sortMixin, paddingMixin, stackMixin, streamMixin) {
  constructor() {
    super();
    this.setAttrs(_attrs);
    this.process('munge', _munge, {isPre:true})
      .process('domain', _domain,  {isPre:true})
      .process('range', _range,  {isPre:true})
      .process('unit', _unit)
      .process('title', _title)
      .process('axis', _axis)
      .process('region', _region)
      .process('facet', _facet, {allow: function() {return this.isFacet()}})
      .process('mark', _mark, {allow: function() {return !this.isFacet()}})
      .process('legend', _legend)
      .process('tooltip', _tooltip)
      .process('padding', _padding)
      .process('annotation', _annotation);
  }
  measureName() {
    let measures = this.measures();
    let yField;
    if (this.condition() === conditions[2]) yField = mixedMeasure.field;
    else if (this.aggregated() && measures[0].field === mixedMeasure.field) yField = measures[0].field;
    else yField = measures[0].field + '-' + measures[0].op;
    return yField;
  }

  muteToLegend(d) {
    this.muteLegend(this.isFacet() ? d.parent.data.key : d.data.key);
  }
  muteFromLegend(legend) {
    if (this.isFacet()) this.muteRegions(legend.key);
    else this.muteNodes(legend.key);
  }

  demuteToLegend(d) {
    this.demuteLegend(this.isFacet() ? d.parent.data.key : d.data.key);
  }

  demuteFromLegend(legend) {
    if (this.isFacet()) this.demuteRegions(legend.key);
    this.demuteNodes(legend.key);
  }

  isCount() {
    return this.condition() === conditions[1];
  }

  isFacet() {
    return this.facet() && this.isNested() && !this.stacked();
  }

  isMixed() {
    return this.condition() === conditions[2] ;
  }

  isNested() {
    let dimensions = this.dimensions();
    let condition = this.condition();
    return dimensions.length === 2 || (condition == conditions[2] && dimensions.length === 1);
  }

  isVertical() {
    return this.orient() === orients[0];
  }

  isNestedAndSortByValue() {
    return this.isNested() && this.sortByValue() !== 'natural';
  }
}

/**
 * If annotation is specified, sets the annotation settings and returns the instance itself. This annotation feature only works in the mono-bar condition and shows differences between bars. If annotation value is true or the it's showLable property is true, shows the label. If annotation is not specified, returns the instance's current annotation setting.
 * @function
 * @example
 * bar.annotation(true); //shows the annotation which shows the difference between bars
 * @param {boolean|object} [annotation=false] It is true or showLabel is true shows annotation label.
 * @param {boolean} annotation.showLabel=true
 * @param {string} [annotation.color=#477cd2] sets the annotation label color
 * @return {annotation|Bar}
 */
Bar.prototype.annotation = setMethodFromDefaultObj('annotation', {showLabel: true, color: '#477cd2'});

/**
 * If showDiff is specified, sets the showDiff settings and returns the instance itself. This showDiff feature only works in the grouped stacked-bar condition and shows differences between bars. If showDiff value is true or object, shows the differences. If showDiff is not specified, returns the instance's current showDiff setting.
 * @function
 * @example
 * bar.showDiff(true); //shows the diffrences between stacked bars
 * @param {boolean|object} [showDiff=false] It is true or showLabel is true shows annotation label.
 * @param {string} showDiff.neuFill=#c0ccda
 * @param {string} showDiff.incStroke=#477cd2
 * @param {string} showDiff.incFill=#40bbfb
 * @param {string} showDiff.decStroke=#f06292
 * @param {string} showDiff.decFill=#f06292
 * @return {showDiff|Bar}
 */
Bar.prototype.showDiff = setMethodFromDefaultObj('showDiff', {neuFill: '#c0ccda', incStroke:'#477cd2', incFill: '#40bbfb', decStroke: '#f06292', decFill: '#f06292'});

/**
 * If annotation is specified, sets the mono settings and returns the instance itself. This mono feature only works in the mono-bar condition. It render bars with different colors when it is false.  If mono is not specified, returns the instance's current annotation setting.
 * @function
 * @example
 * bar.mono(false); // renders bars with different colors according to its color pattern
 * @param {boolean} [mono=true]
 * @return {mono|Bar}
 */
Bar.prototype.mono = attrFunc('mono');

/**
 * If orient is specified, sets theorientmono settings and returns the instance itself. It transforms the bar chart's orient according to the value. If orient is not specified, returns the instance's current orient setting.
 * @function
 * @example
 * bar.orient('horizontal'); // renders the horizontal bar chart
 * @param {string} [orient='vertical'] (vertical|horizontal)
 * @return {orient|Bar}
 */
Bar.prototype.orient = attrFunc('orient');

function domainY(yField, munged, level = 0, nested = false, aggregated = false, stacked = false, showDiff = false, label = false, arrowOnMark = false) {
  const yDomain = yField.level(level)
  .munged(munged)
  .aggregated(aggregated)
  .domain(0, stacked);

  if (yDomain[0] > 0) yDomain[0] = 0;
  else if (yDomain[1] < 0) yDomain[1] = 0;

  if (showDiff && !nested) {
    if (yDomain[0] === 0) yDomain[1] *= 1.25;
    else if (yDomain[1] === 0) yDomain[0] *= 1.25;
  }
  if (label) {
    if (yDomain[0] === 0) yDomain[1] *= 1.1;
    else if (yDomain[1] === 0) yDomain[0] *= 1.1;
  }
  if (arrowOnMark) {
    if (yDomain[0] === 0) yDomain[1] *= 1.25;
    else if (yDomain[1] === 0) yDomain[0] *= 1.25;
  }
 return yDomain;
}

Bar.prototype.unit = attrFunc('unit');
Bar.prototype.title = attrFunc('title');
Bar.prototype.diffArrow = attrFunc("diffArrow");
Bar.prototype.arrowOnMark = attrFunc("arrowOnMark");
// Bar.prototype.textWithLabel = attrFunc("textWithLabel");

export default genFunc(Bar);
export {conditions, domainY};
