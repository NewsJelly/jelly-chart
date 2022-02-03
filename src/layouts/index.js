import bar from './bar/';
import line from './line/';
import scatter from './scatter/';
import xyHeatmap from './xy-heatmap/';
import treemap from './treemap/';
import parCoords from './par-coords/';
import pie from './pie/';
import markerMap from './marker-map/';
import combo from './combo/';
/**
 * @namespace jelly
 * @type {object}
 */
const _layout = {
  /**
   * Generator returns a {@link Bar} instance
   * @type {function} 
   * @see {@link Bar} 
   * @memberOf jelly
   */
  bar,
  /**
   * Generator returns a {@link Line} instance
   * @type {function} 
   * @see {@link Line} 
   * @memberOf jelly
   */
  line,
  /**
   * Generator returns a {@link Scatter} instance
   * @type {function} 
   * @see {@link Scatter} 
   * @memberOf jelly
   */
  scatter, 
  /**
   * Generator returns a {@link XYHeatmap} instance
   * @type {function} 
   * @see {@link XYHeatmap} 
   * @memberOf jelly
   */
  xyHeatmap,
  /**
   * Generator returns a {@link Treemap} instance
   * @type {function} 
   * @see {@link Treemap} 
   * @memberOf jelly
   */ 
  treemap,
  /**
   * Generator returns a {@link ParCoords} instance
   * @type {function} 
   * @see {@link ParCoords} 
   * @memberOf jelly
   */ 
  parCoords,
  /**
   * Generator returns a {@link Pie} instance
   * @type {function} 
   * @see {@link Pie} 
   * @memberOf jelly
   */ 
  pie, 
  /**
   * Generator returns a {@link MarkerMap} instance
   * @type {function} 
   * @see {@link MarkerMap} 
   * @memberOf jelly
   */
  markerMap, 
  /**
   * Generator returns a {@link Combo} instance
   * @type {function} 
   * @see {@link Combo} 
   * @memberOf jelly
   */
  combo
};
_layout.type = function(type) {
  if (_layout.hasOwnProperty(type))  return _layout[type];
  throw new Error(`Undefined type: ${type} is not available`);
}
export default _layout;
