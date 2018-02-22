function _scale(keep) {
  let yAt = this.axisY();
  if (yAt) { //add the right axis directly
    this.axis({target: 'y', orient: 'right'});
  }
  const scale = this.scale();
  scale.color = this.updateColorScale(this.measures().map(d => d.field), keep);
}



export default _scale;