function _axis() {
  const that = this;
  const munged = this.__execs__.munged;
  const scale = this.__execs__.scale;
  const grid = this.grid();
  const individualScale = this.isIndividualScale();
  const innerSize = this.innerSize();
  const fieldObj = this.__execs__.field;
 
  let _axisScaleX = function (axisToggle) {
    fieldObj.x.axis(axisToggle);
    let curAxis = that.axisDefault(scale.x, axisToggle);
    if (scale.x.invert) curAxis.grid(grid).gridSize(innerSize.height);
    if (axisToggle.orient === 'bottom') curAxis.y(scale.y.range()[0]);
    return curAxis;
  }

  let _axisScaleY = function (axisToggle, scaleY = scale.y, field) {
    if (!field) {
      fieldObj.y.axis(axisToggle);
    } else {
      axisToggle.field = field;
    }
    let curAxis = that.axisDefault(scaleY, axisToggle);
    curAxis.grid(grid).gridSize(innerSize.width);
    if (axisToggle.orient === 'right') curAxis.x(scale.x.range()[1]);
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
      if (individualScale) { 
        let ats = this.axis().filter(d => d.target === 'y');
        if (munged.length <= 2) {
          ats.forEach((d,i) => _axisScaleY(d, munged[i].scale, munged[i].data.key));
        } 
      } else {
        _axisScaleY(yAt);
      }
    }
  }
  this.renderAxis();
}

export default _axis;