function _range() {
  const { x, yBar, yLine} = this.scale();
  const xAt = this.axisX();
  const yAtLeft = this.axis().find(a => a.target === 'y' && a.orient === 'left');
  const yAtRight = this.axis().find(a => a.target === 'y' && a.orient === 'right');
  
  if (yAtLeft) {
    this.thickness(yAtLeft, yBar, false, false);
    this.thickness(yAtRight, yLine, false, false);
  }
  if (xAt) {
    this.thickness(xAt, x, true, true);
  }
  const {width, height} = this.innerSize();
  yBar.range([height, 0]);
  yLine.range([height, 0]);
  x.range([0, width]);
  return this;
}

export default _range;