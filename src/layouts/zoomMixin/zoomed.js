import {event} from 'd3';

function zoomed(renderFunc, isDual = false) {
  const zoom = this.zoomGen();
  const that = this;
  const field = this.__execs__.field;
  const axisObj = this.__execs__.axis;
  const axisX = axisObj && axisObj.x ? axisObj.x[field.x.field()] : null;
  const scaleObj = this.__execs__.scale;
  const scaleX = scaleObj.x; //stroe original scale
  const axisY = isDual && axisObj && axisObj.y ? axisObj.y[field.y.field()] : null;
  const scaleY = isDual ? scaleObj.y : null;

  let _axis = function(transform) {
    const newScaleX = transform.rescaleX(scaleX);
    scaleObj.x = newScaleX;
    if (axisX) {
      axisX.scale(newScaleX);
      axisX.render(null, true);
    }
    if (isDual) {
      const newScaleY = transform.rescaleX(scaleY);
      scaleObj.y = newScaleY;
      if (axisY) {
        axisY.scale(newScaleY);
        axisY.render(null, true);
      }
    }
  }

  zoom.on('zoom.zoomable.zoomed', function() {
    const transform = event.transform;
    if(!transform) return;
    _axis(transform);
    if (that.__execs__.tooltip) that.__execs__.tooltip.hide(); //reset tooltip
    renderFunc();
  })
  return this;
}

export default zoomed;