function _axis() {
  const scale = this.__execs__.scale;
  const xAt = this.axisX();
  const yAt = this.axisY();
  const fieldObj = this.__execs__.field;
  
  let _axisScaleX = (axisToggle) => {
    axisToggle.field = fieldObj.x.field();
    let curAxis = this.axisDefault(scale['x-bar'], axisToggle);
    if (axisToggle.orient === 'bottom') curAxis.y(scale['y-bar'].range()[0]);
    return curAxis;
  }
  let _axisScaleY =  (yScale, axisToggle) => {
    let curAxis = this.axisDefault(yScale, axisToggle);
    if (axisToggle.orient === 'right') curAxis.x(scale['x-bar'].range()[1]);
    return curAxis;
  }
  if (xAt) {
    _axisScaleX(xAt);
  }
  if (yAt) {
    _axisScaleY(scale['y-bar'], {target:yAt.target, field: fieldObj.yBar.field(), orient: 'left'});
    _axisScaleY(scale['y-line'], {target:yAt.target, field: fieldObj.yLine.field(), orient: 'right'});
  }
  this.renderAxis();
}

export default _axis;