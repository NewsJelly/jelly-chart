import seriesName from './seriesName';
import {attrFunc, className} from '../../modules/util';

const curves = ['linear', 'stepped', 'curved'];
const _attrs = {
  curve: curves[0],
  point: false,
  pointRatio : 3,
  seriesName: className('mark series', true)
}

const seriesMixin = Base => {
  /**
   * @mixin SeriesMixin
   */
  let SeriesMixin = class extends Base {
    constructor() {
      super();
      this.setAttrs(_attrs);
    }
  }
  SeriesMixin.prototype.seriesName = seriesName;
  
  /**
   * sets a curve type. If is not specified, returns the current curve setting.
   * @memberOf SeriesMixin
   * @function
   * @example
   * series.curve('curved') //renders Catmull-Rom spline curve
   * series.curve();
   * @param {string} [curve=linear] (linear|stepped|curved)
   * @return {curve|SeriesMixin}
   */
  SeriesMixin.prototype.curve = attrFunc('curve');
  /**
   * If is true, renders a point mark on each data point. If is not specified, returns the current point setting.
   * @memberOf SeriesMixin
   * @function
   * @example
   * series.point(true)
   * @param {boolean} [point=false]
   * @return {point|SeriesMixin}
   */
  SeriesMixin.prototype.point = attrFunc('point');
  /**
   * sets point radius relative to the line width. If is not specified, returns the current pointRatio setting.
   * @memberOf SeriesMixin
   * @function
   * @example
   * series.pointRatio(5) // the point radius will be 5 times as large as the line width.
   * @param {number} [pointRatio=3]
   * @return {pointRatio|SeriesMixin}
   */
  SeriesMixin.prototype.pointRatio = attrFunc('pointRatio');
  return SeriesMixin;
}

export default seriesMixin;
export {curves};