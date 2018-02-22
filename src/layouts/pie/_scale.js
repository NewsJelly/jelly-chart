function _scale(keep) {
  const scale = this.scale();
  const munged = this.__execs__.munged;
  const field = this.__execs__.field;
  let regionDomain = field.region.munged(munged).domain();
  scale.color = this.updateColorScale(regionDomain, keep);
}

export default _scale;