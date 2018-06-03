function distDomain(scale) {
  return scale(scale.domain()[0]) - scale(scale._lastDomain[0]);
}

export default distDomain;


