function zoomGen(_val) {
  if (!arguments.length) return this.__attrs__.zoomGen;
  this.__attrs__.zoomGen = _val;
  const that = this;
  const dispatch = that.__execs__.zoomDispatch;
  _val.on('zoom.zoomable', function() {
    dispatch.apply('zoom', this, arguments);
  });
  return this;
}

export default zoomGen;