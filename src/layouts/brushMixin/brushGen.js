function brushGen(brushGen) {
  if (!arguments.length) return this.__attrs__.brushGen;
  this.__attrs__.brushGen = brushGen;
  let dispatch = this.__execs__.brushDispatch;
  brushGen.on('start.brushable', function() {
    dispatch.apply('brushStart', this, arguments);
  }).on('brush.brushable', function() {
    dispatch.apply('brushed', this, arguments);
  }).on('end.brushable', function() {
    dispatch.apply('brushEnd', this, arguments);
  })
  return this;
}

export default brushGen;