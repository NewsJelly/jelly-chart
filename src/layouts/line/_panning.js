function _panning() {
  if (this.stream()) {
    this.streamPanning(this.__execs__.scale.x);
  }
}

export default _panning;