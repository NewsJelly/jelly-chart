function _legend() { 
  let field = this.__execs__.field;
  if (this.mono() && (!field.region || this.isFacet())) { //mono + dimensions  => no legend
    return; 
  }
  this.renderLegend('x');
}

export default _legend;