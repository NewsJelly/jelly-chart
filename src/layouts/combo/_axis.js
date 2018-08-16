function _axis() {
  const scale = this.__execs__.scale;
  const {yBar, yLine} = this.__execs__.field;
  const xAt = this.axisX();
  const yAtLeft = this.axis().find(a => a.target === 'y' && a.orient === 'left');
  const yAtRight = this.axis().find(a => a.target === 'y' && a.orient === 'right');
  const fieldObj = this.__execs__.field;
	const font = this.font()
	
  let _axisScaleX = (axisToggle) => {
    axisToggle.field = fieldObj.x.field();
		let curAxis = this.axisDefault(scale.x, axisToggle);
		curAxis.font(font);//font update
    if (axisToggle.orient === 'bottom') curAxis.y(scale.yBar.range()[0]);
    return curAxis;
  }
  let _axisScaleY =  (yScale, axisToggle) => {
		let curAxis = this.axisDefault(yScale, axisToggle);
		curAxis.font(font);//font update
    if (axisToggle.orient === 'right') curAxis.x(scale.x.range()[1]);
    return curAxis;
  }
  if (xAt) {
    _axisScaleX(xAt);
  }
  if (yAtLeft) {
    yAtLeft.field = yBar.field();
    yAtRight.field = yLine.field();
    _axisScaleY(scale.yBar, yAtLeft);
    _axisScaleY(scale.yLine, yAtRight);
  }
  
  this.renderAxis();
}

export default _axis;
