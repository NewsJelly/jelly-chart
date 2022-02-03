import interval from '../../modules/interval';

/**
 * If unit is number or string, limit the key domain's length or distance within the interval. If the key domain's scale is ordnial, the length of domain will be the same to unit. Also, if the scale is continous, the distance of domain will be fixed as much as unit. If unit is string, it must be a time interval. When multiple exists, it will multiply the unit.
 * If unit is not specified, returns the existing viewInterval. 
 * @memberOf StreamMixin#
 * @function
 * @example
 * stream.viewInterval(1000)
 * stream.viewInterval('month', 3)
 * @param {number|string} [unit=null] 
 * @param {number} [multiple=1]
 * @return {zoom|ZoomMixin}
 */
function viewInterval(unit, multiple=1) {  
  if (!arguments.length) return this.__execs__.viewInterval;
  const type = typeof unit;
  if (type === 'number') {
    if (viewInterval <= 0) unit = null;
  } else if (type === 'string') { //d3-time interval
    if (!Object.keys(interval).includes(unit)) {
      unit = null;
    }
  }
  if (unit) this.__execs__.viewInterval = {unit, multiple}
  else this.__execs__.viewInterval = null;
  return this;
}

export default viewInterval;