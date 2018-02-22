function _axis() {
  let that = this;
  let scale = this.__execs__.scale;
  let nested = this.isNested();
  let grid = this.grid();
  let innerSize = this.innerSize();
  let fieldObj = this.__execs__.field;
  let isVertical = this.isVertical();

  let _axisScaleX = function (axisToggle) {
    let targetField = nested ? fieldObj.region : (isVertical ? fieldObj.x : fieldObj.y);
    let targetScale = nested ? scale.region : (isVertical ? scale.x : scale.y);
    targetField.axis(axisToggle);
    let curAxis = that.axisDefault(targetScale, axisToggle);
    if (axisToggle.orient === 'bottom') {
      curAxis.y(isVertical? scale.y.range()[0] : scale.x.range()[1]);
    }
    return curAxis;
  }

  let _axisScaleY = function (axisToggle) {
    let targetField = isVertical ? fieldObj.y : fieldObj.x;
    let targetScale = isVertical ? scale.y : scale.x;
    targetField.axis(axisToggle);
    let curAxis = that.axisDefault(targetScale, axisToggle);
    curAxis.grid(grid).gridSize(axisToggle.orient === 'bottom' || axisToggle.orient === 'top' ? innerSize.height : innerSize.width);
    if (axisToggle.orient === 'right') curAxis.x( (nested ? scale.region : scale.x).range()[1]);
    return curAxis;
  }

  let xAt = this.axisX();
  let yAt = this.axisY();
  if (this.isFacet()) {
    this.axisFacet(false);
  } else {
    if (xAt) _axisScaleX(xAt);
    if (yAt) _axisScaleY(yAt);
  }

  this.renderAxis();
}

export default _axis;