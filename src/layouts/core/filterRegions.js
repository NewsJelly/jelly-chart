import {select} from 'd3';

/**
 * Fiters regions in the chart, returning a new selection that contains only the elements for which the specified filter is true. 
 * @memberOf Core#
 * @example
 * core.filterRegions(function(d) {
 *    return d.key === key;
 * })
 * @param {(string|function)} filter The filter may be specified either as a selector stringfilter is  or a function. If the a function, it is evaluated for each selected element, in order, being passed the current datum (d), the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
 * @return {d3Selection}
 */
function filterRegions(callback, noFacet = false) {
  let regions = this.regions();
  if (!callback || typeof callback !== 'function') return regions;
  if (noFacet) {
    regions =  regions.filter(function() {
      return !select(this).classed('facet'); //exclude .facet
    })
  }
  return regions.filter(callback);
}

export default filterRegions;