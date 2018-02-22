import {zoom, select} from 'd3';

import _mark from './_mark';
import _brushZoom from './_brushZoom';
import _tooltip from './_tooltip';
import {className} from '../../modules/util';

function normal() {
  const parent = this.parent();  
  const zoomExtent = this.zoomExtent(this.isColor(), true);
  const zoomGen = zoom()
    .scaleExtent(zoomExtent)
    .translateExtent([[0, 0], [this.width(), this.height()]]);
  this.__execs__.canvas.call(zoomGen); 

  this.zoomGen(zoomGen).zoomed(() => {
    _mark.call(this, true); //re-render mark
    select((parent ? parent : this).__execs__.canvas.node().parentNode.parentNode)
      .selectAll(className('tooltip', true)).remove(); //FIXME: currently, remove existing tooltip
    _tooltip.call(this); //re-render tooltip
  }, true);
}

function _zoom() {
  if (!this.zoom()) return;
  if (this.zoom() === 'normal') normal.call(this);
  else if (this.zoom() === 'brush') _brushZoom.call(this);
}

export default _zoom;