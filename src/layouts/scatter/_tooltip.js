function _tooltip() {
  if(!this.tooltip() || this.isFacet()) return;

  const measures = this.measures();
  let value = function(d) {
    return measures.map(m => {
      return {name:m.field, value: m.format ? m.format(d.data[m.field]) : d.data[m.field]}
    })
  }
  this.renderTooltip({dx: this.size().range[0] + 4, value, key:null});
}

export default _tooltip;