function _range() {
  const scale = this.scale();
  scale.color.range(this.color());
  return this;
}

export default _range;