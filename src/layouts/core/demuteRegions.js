import conditionForMute from './_condtionForMute';

function demute(regions, isSeries = false) {
  regions.selectAll(isSeries ? this.seriesName() : this.nodeName()).classed('mute', false).call(this.demute);
}
/**
 * Fiters regions according to exceptionFilter in the chart and {@link Core#demute demutes} the nodes in the selected regions. If exceptionFilter is no specified, demutes all nodes in regions.
 * @memberOf Core#
 * @example
 * core.demuteRegions('Sales'); // regions whose key is not 'Sales' are demuted
 * core.demuteRegions(d => d.key !== 'Sales') // regions whose key is not 'Sales' are demuted
 * @param {string|function} [exceptionFilter] If the fiter is a string, select nodes which has different key with the filter. If the a function, it is evaluated for each selected element, in order, being passed the current datum (d), the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
 * @return {Core}
 */
export default function (exceptionFilter) {
  let regions;
  if (!arguments.length) { 
    regions = this.filterRegions();
    demute.call(this, regions);
    if (this.seriesName) demute.call(this, regions, true);
  } else {
    regions = this.filterRegions(conditionForMute(exceptionFilter), true);
    demute.call(this, regions);
    if (this.seriesName) demute.call(this, regions, true);
  }
  return this;
}