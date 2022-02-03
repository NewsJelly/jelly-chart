function _tooltip() {
  if(!this.tooltip()) return;
  const field = this.__execs__.field;
  let key = (d) => {
    return {name: 'key', value:d.data.key};
  }
  let value = (d, text) => {
    let name = d.anchor ? field.yLine.field() : field.yBar.field();
    return {name, value:text};
  }
  this.renderTooltip({value, key});
}

export default _tooltip;