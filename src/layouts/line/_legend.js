function _legend() { 
  let field = this.__execs__.field;
  if (!field.region) { 
    return; 
  }
  this.renderLegend();
}

export default _legend;