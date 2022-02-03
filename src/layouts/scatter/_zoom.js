import {zoom} from 'd3';

import _mark from './_mark';
import _brushZoom from './_brushZoom';
import _tooltip from './_tooltip';

function normal() {
  const zoomExtent = this.zoomExtent(this.isColor(), true);
  const zoomGen = zoom()
    .scaleExtent(zoomExtent)
    .translateExtent([[0, 0], [this.width(), this.height()]]);
  this.__execs__.canvas.call(zoomGen); 

  this.zoomGen(zoomGen).zoomed(() => {
    _mark.call(this, true); //re-render mark
    this.resetTooltip();
    _tooltip.call(this); //re-render tooltip
  }, true);
}

function _zoom() {
  if (!this.zoom()) return;
  if (this.zoom() === 'normal') normal.call(this);
  else if (this.zoom() === 'brush') _brushZoom.call(this);
}

export default _zoom;