/**
 * Fiters labels with a key different with exceptionFilter in the chart's legend, demute the selection.
 * @memberOf Core#
 * @example
 * core.demuteLegend('Sales'); // recover opacity of muted labels, whose key is not 'Sales', in the legend;
 * @param {string|function} [exceptionFilter] If the fiter is a string, select nodes which has different key with the filter. If the a function, it is evaluated for each selected element, in order, being passed the current datum (d), the current index (i), and the current group (nodes), with this as the current DOM element (nodes[i]).
 * @return {Core}
 */
function muteLegend(key) {
  if (this.__execs__.legend) this.__execs__.legend.mute(key);
  return this;
}

export default muteLegend;