import {select, transition} from 'd3';
import {className} from '../../modules/util';

/**
 * render regions
 * @memberOf Core#
 * @function
 * @private
 * @param {function} posFunc specifies positions of a region by set x and y value of the region data
 * @param {function} [dataFunc=d => d] specify a data accessor
 * @param {boolean} [isFacet=false] 
 * @param {string} [suffix='']
 * @return {Core}
 */
function renderRegion(posFunc, dataFunc = d => d, isFacet = false, suffix = '') {
  let region = this.__execs__.canvas.select(className('regions', true))
    .selectAll(this.regionName() + (isFacet ? '.facet' : '') + suffix)
    .data(dataFunc, (d,i) => (d.data && d.data.key) ? d.data.key : i);
  const regionName = this.regionName().split('.').join(' ').trim();
  const aggregated = this.aggregated();
  const regionClass = regionName + (isFacet ? ' facet' : '');
  const canvas = this.__execs__.canvas;
  const trans = transition().duration(this.transition().duration).delay(this.transition().delay); 
  const _id = canvas.selectAll(className('canvas-g-clip-path', true)).attr('id');
  let _regionInit = function (selection) {
    selection.each(function(xy) {
      if (!aggregated) select(this).attr('transform', 'translate(' + [xy.x, xy.y] + ')');
      else select(this).attr('transform', 'translate(0,0)');
      if (_id && !isFacet) select(this).attr('clip-path', 'url(#' + _id+')');
    })
  };
  let _region = function (selection) {
    selection.each(function(xy) {
      if (!aggregated) select(this).transition(trans).attr('transform', 'translate(' + [xy.x, xy.y] + ')');
      else select(this).attr('transform', 'translate(0,0)');
    })
  };
  
  region.exit().remove();
  let regionEnter = region.enter().append('g')
      .attr('class', regionClass)
      .each(posFunc)
      .call(_regionInit)
  region.each(posFunc);
  region = regionEnter.merge(region);
  region.call(_region);
  return region;
}

export default renderRegion;