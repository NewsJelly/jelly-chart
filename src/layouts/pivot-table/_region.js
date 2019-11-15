function _region() {
  const scale = this.__execs__.scale;
  const innerSize = this.innerSize();
  let __regionLocal = (d, i) => {
      d.x = innerSize.width / (scale.x.domain().length + 1) * (i + 1);
      d.y = innerSize.height / (scale.y.domain().length + 1);
  };

  this.renderRegion(__regionLocal);
}

export default _region;