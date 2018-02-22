function _axis() {
  let that = this;
  let scale = this.__execs__.scale;
  let grid = this.grid();
  let innerSize = this.innerSize();
  let field = this.__execs__.field;

  let _axisScaleX = function (axisToggle) {
    field.x.axis(axisToggle);
    let curAxis = that.axisDefault(scale.x, axisToggle);
    if (axisToggle.orient === 'bottom') curAxis.y(scale.y.range()[0]);
    curAxis.grid(grid).gridSize(innerSize.height);
    return curAxis;
  }

  let _axisScaleY = function (axisToggle) {
    field.y.axis(axisToggle);
    let curAxis = that.axisDefault(scale.y, axisToggle);
    if (axisToggle.orient === 'right') curAxis.x(scale.x.range()[1]);
    curAxis.grid(grid).gridSize(innerSize.width);
    return curAxis;
  }

  let xAt = this.axisX();
  let yAt = this.axisY();
  if (this.isFacet()) { 
    this.axisFacet();
  } else {
    if (xAt) {
      _axisScaleX(xAt);
    } 
    if (yAt) {
      _axisScaleY(yAt);
    }
  }

  this.renderAxis();
}

export default _axis;