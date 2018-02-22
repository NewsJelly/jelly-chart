function _region() {
  const scale = this.__execs__.scale;
  let __regionLocal = d => {
      d.x = scale.x(d.data.key); 
      d.y = 0;
  };

  this.renderRegion(__regionLocal);
}

export default _region;