function _domain(keep, data=null) {
  const scale = this.scale();
  const munged = data === null ? this.__execs__.munged : data;
  const field = this.__execs__.field;
  let regionDomain = field.region.munged(munged.hasOwnProperty('data') ? munged.data['children'] : munged).domain();
  scale.color = this.updateColorScale(regionDomain, keep);
}

export default _domain;