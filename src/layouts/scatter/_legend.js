function _legend() { 
  let legendToggle = this.legend();
  if (!legendToggle) return;
  if (!this.isColor()) {
    return; 
  }
  this.renderLegend();
}

export default _legend;