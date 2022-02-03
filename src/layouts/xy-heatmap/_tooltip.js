function _tooltip() {
  if(!this.tooltip()) return;
  const field = this.__execs__.field;
  
  let value = function(d, text) {
    return {name: field.color.field(), value: text};
  }
  let offset = function(d) {
    return {x:d.w, y:0};
  }
  this.renderTooltip({offset, value, color: '#111'});
}

export default _tooltip;