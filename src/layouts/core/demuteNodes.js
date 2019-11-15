import conditionForMute from './_condtionForMute';
/**
 * Fiters nodes according to excemptionFilter in the chart and {@link Core#demute demutes} the nodes. If excemptionFilter is no specified, demutes all nodes.
 * @memberOf Core#
 * @example
 * core.demuteNodes('Sales'); // nodes whose key is not 'Sales' are demuted
 * core.demuteNodes(d => d.key !== 'Sales') // nodes whose key is not 'Sales' are demuted
 * @param {string|function} [exceptionFilter] If the fiter is a string, select nodes which has different key with the filter. If the a function, it is evaluated for each selected element, in order, being passed the current datum (d), the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
 * @return {Core}
 */
function demuteNodes (exceptionFilter) {
  let nodes;
  if (!arguments.length) { //모두 
    nodes = this.filterNodes().classed('mute', false).call(this.demute);
  } else {
    if (this.__attrs__.name === 'Pie' && this.__attrs__.shape === 'sunburst') {
      nodes = this.filterNodes(exceptionFilter);
    } else {
      nodes = this.filterNodes(conditionForMute(exceptionFilter));
    }
    if (nodes.size() > 0) {
      nodes.classed('mute', false).call(this.demute);
    }
  }
  return this;
}
export default demuteNodes; 