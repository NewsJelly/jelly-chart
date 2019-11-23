function _region() {
  const scale = this.__execs__.scale;
  const margin = this.margin();
  const innerSize = this.innerSize();
  const chartSize = Math.min(innerSize.width, innerSize.height);
  const width = (chartSize - margin.left - margin.right);
  const height = (chartSize - margin.top - margin.bottom);
  const legend = this.__attrs__.legend;

  let __regionLocal = d => {
    d.x = (innerSize.width - width) / 2;
    if (legend && legend.orient === 'top') {
      d.y = (innerSize.height - height) / 2 + (legend.thickness / 2);
    } else {
      d.y = (innerSize.height - height) / 2;
    }

    d.color = scale.color(d.data.key);
  };

  this.renderRegion(__regionLocal, d => d, false, '');
    // .style('stroke', d => d.color)
    // .style('fill', d => d.color);
}

export default _region;