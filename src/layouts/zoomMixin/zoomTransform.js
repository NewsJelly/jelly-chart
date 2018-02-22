function zoomTransform(group, transform) {
  group.call(this.zoomGen().transform, transform);
  return this;
}

export default zoomTransform;