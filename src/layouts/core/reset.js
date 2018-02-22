import {select, local} from 'd3';
import {className} from '../../modules/util';

/**
 * reset the chart
 * @memberOf Core#
 * @function
 * @param {boolean} [keep=false] If keep is true, not reset existing scales.
 * @return {Core} 
 */
function reset (keep=false) {
  this.__execs__.axis = {};
  this.__execs__.legend = null;
  if (!this.parent()) this.__execs__.mark = local(); //when is facet, not reset
  this.__execs__.field = {};
  this.__execs__.regions = null;
  this.__execs__.nodes = null;
  if (!keep) this.__execs__.scale = {};
  if (!this.parent() && this.__execs__.canvas) select(this.container()).selectAll(className('tooltip', true)).remove(); //reset, because .facet can generates multiple tooltips.
  return this;
}

export default reset;