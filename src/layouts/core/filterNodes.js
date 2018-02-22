/**
 * Fiters nodes in the chart, returning a new selection that contains only the elements for which the specified filter is true. 
 * @memberOf Core#
 * @example
 * core.filterNodes(function(d) {
 *    return d.key === key;
 * })
 * @param {(string|function)} filter The filter may be specified either as a selector stringfilter is  or a function. If the a function, it is evaluated for each selected element, in order, being passed the current datum (d), the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
 * @return {d3Selection}
 */
function filterNodes(filter) {
  let nodes = this.nodes();
  if (!filter || typeof filter !== 'function') return nodes;
  return nodes.filter(filter);
}



export default filterNodes;