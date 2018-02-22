function brushMove(group, selection) {
  let brush = this.brushGen();
  group.call(brush.move, selection);
  return this;
}

export default brushMove;