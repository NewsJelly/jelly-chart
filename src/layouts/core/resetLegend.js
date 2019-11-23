import { select } from 'd3';
import { className } from '../../modules/util';

function resetLegend() {
    const parent = this.parent();
    select((parent ? parent : this).__execs__.canvas.node().parentNode.parentNode)
        .selectAll(className('legend', true)).remove(); //remove existing tooltip
    return this;
}

export default resetLegend;