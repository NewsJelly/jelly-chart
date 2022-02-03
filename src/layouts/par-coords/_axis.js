import {yMeasureName, shapes} from './';

function _parCoords() {
  let that = this;
  let measures = this.measures();
  let scale = this.__execs__.scale;

  let _axisScaleY = function (yScale, axisToggle) {
    let curAxis = that.axisDefault(yScale, axisToggle);
    if (axisToggle.orient === 'right') curAxis.x(scale.x.range()[1]);
    curAxis.x(scale.x(axisToggle.field));
    return curAxis;
  }

  let yAt = this.axisY();
  if (yAt) {
    measures.forEach(m => {
      let name = yMeasureName(m);
      let yScale = scale[name];
      let at = {target: yAt.target, field: m.field, orient: yAt.orient, showDomain: true, titleOrient: 'bottom', showTitle: true};
      _axisScaleY(yScale, at);
    })
  }
}


function _axis() {
  if (this.shape() === shapes[0]) {
    _parCoords.call(this);
  } 
  this.renderAxis();
}

export default _axis;