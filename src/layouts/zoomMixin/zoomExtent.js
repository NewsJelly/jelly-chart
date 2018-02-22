function zoomExtent(nested = false, isDual = false, unit = 2) {
  let pointNum = this.pointNum(nested);
  let scale = this.__execs__.scale;
  let range = scale.x.range();
  let rangeDist = Math.abs(range[1] - range[0]);
  if (isDual) {
    let yRange = scale.y.range();
    let yRangeDist = Math.abs(yRange[1] - yRange[0]);
    if (rangeDist > yRangeDist) rangeDist = yRangeDist;
  }
  let max = pointNum*pointNum/rangeDist;
  return [1, Math.ceil(max * unit)];
}

export default zoomExtent;