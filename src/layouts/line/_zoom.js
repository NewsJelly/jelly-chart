import {select, zoom} from 'd3';

import _mark from './_mark';
import _tooltip from './_tooltip';
import {className} from '../../modules/util';

function normal() {
  const scaleX = this.__execs__.scale.x;
  if (!scaleX.invert) return;
  const canvas = this.__execs__.canvas;
  const zoomExtent = this.zoomExtent(this.isNested());
  const parent = this.parent();
  const zoomGen = zoom()
    .scaleExtent(zoomExtent)
    .translateExtent([[0, 0], [(parent ? parent : this).width(), (parent ? parent : this).height()]]);
  canvas.call(zoomGen);   
  this.zoomGen(zoomGen)
    .zoomed(() => {
      _mark.call(this, true); //reset marks
      select((parent ? parent : this).__execs__.canvas.node().parentNode.parentNode)
        .selectAll(className('tooltip', true)).remove(); //remove existing tooltip
      _tooltip.call(this); //reset tooltips
    });
}

function _zoom() {
  if (!this.zoom()) return;
  if (this.zoom() === 'normal') normal.call(this);
}

export default _zoom;