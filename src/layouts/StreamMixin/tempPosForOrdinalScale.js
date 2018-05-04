function tempPosForOrdinalScale(key, scale) {
  const initIndex = scale._defaultDomain.findIndex(x => x === scale.domain()[0])
  const curIndex = scale._defaultDomain.findIndex(x => x === key);
  let dist = curIndex - initIndex;
  if (dist >= 0) {
    dist = dist - scale.domain().length;
    return scale.range()[1] + dist * scale.step();
  } else {
    return scale.range()[0] + dist * scale.step();
  }
}
export default tempPosForOrdinalScale;