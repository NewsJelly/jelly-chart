function _tooltip() {
  if(!this.tooltip()) return;
  let key = (d) => {
    return {name: 'key', value: d.key, title: d.field};
  };
  let value = (d) => {
    return {name: d.field, value: d.value};
  };
  let offset = (d) => {
    const margin = this.margin();
    const innerSize = this.innerSize();
    const chartSize = Math.min(innerSize.width, innerSize.height);
    const width = (chartSize - margin.left - margin.right);
    const height = (chartSize - margin.top - margin.bottom);

    let x = ((innerSize.width - width) / 2) + (this.size().range[0] + 4);
    let y = (innerSize.height - height) / 2;

    return {x,y};
  }

  this.renderTooltip({offset, value, key});
}

export default _tooltip;