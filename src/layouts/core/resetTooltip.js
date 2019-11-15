import { select } from 'd3';
import { className } from '../../modules/util';

function resetTooltip() {
  const parent = this.parent();
  select((parent ? parent : this).__execs__.canvas.node().parentNode.parentNode)
      .selectAll(className('tooltip', true)).remove(); //remove existing tooltip
  return this;
}

export default resetTooltip;