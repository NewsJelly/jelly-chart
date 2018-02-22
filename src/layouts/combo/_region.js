function _region() {
  const scale = this.__execs__.scale;
  this.renderRegion(d => d.x = d.y = 0, scale.color.domain().map(d => {return {key: d}})); 
}

export default _region;