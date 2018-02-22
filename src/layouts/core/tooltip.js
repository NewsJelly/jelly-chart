/**
 * If tooltip is specified, decides to show a tooltip in the chart by it value. If is false, prevent showing the tooltip. If tooltip is not specified, returns the instance's current tooltip setting.
 * @memberOf Core#
 * @function
 * @example
 * core.tooltip(true); //set to show a tooltip
 * core.tooltip({sortByValue:'ascending'}); // set to show a tooltip and sort items in order of their measrue values.
 * @param {boolean|object} [tooltip=false]
 * @return {tooltip|Core}
 */

function tooltip(tooltip) {
  if (!arguments.length) return this.__attrs__.tooltip;
  if (typeof tooltip === 'boolean') {
    if (tooltip) {
      tooltip = {sortByValue: 'natural'};
    } 
  } 
  if (typeof tooltip === 'object') {
    if (!tooltip.sortByValue) tooltip.sortByValue = 'natural';
  }
  this.__attrs__.tooltip = tooltip;
  return this;
}

export default tooltip;