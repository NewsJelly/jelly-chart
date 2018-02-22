import {scaleOrdinal} from 'd3';
function fillUndefined (range, colors) {
  let lastColorIndex = 0;
  range = range.map(c => {
    if (c === undefined) {
      while (lastColorIndex < colors.length) {
        let n = colors[lastColorIndex];
        lastColorIndex +=1;
        if (range.findIndex( d => d == n) < 0) {
          return n;
        }
      }
    } 
    return c;
  })
  return range.filter(c => c !== undefined);  
}
/**
 * @memberOf Core#
 * @function
 * @private
 * @param {*} domain 
 * @param {*} keepLast 
 */
function updateColorScale(domain, keepLast = true) {
  const lastScale = this.scale().color;
  if (this.colorDomain() && this.colorDomain().length > 0) {
    let order = this.colorDomain();
    let originColors = this.color();
    let newRange = domain.map(d => {
      let i = order.findIndex(o => d == o.key);
      if (i >= 0) {
        return order[i].color ? order[i].color : originColors[i];
      } else {
        return undefined;
      }
    });
    newRange = fillUndefined(newRange, originColors);
    let scale = scaleOrdinal().domain(domain).range(newRange);
    scale._defaultRange = this.color();
    return scale;
  } else if (keepLast && lastScale && lastScale.unknown && this.color() === lastScale._defaultRange) {
    let originColors = this.color();
    let lastDomain = this.scale().color.domain();
    let lastRange = this.scale().color.range();
    let exist = false;
    let lastIndex = domain.map(d => {
      const i = lastDomain.findIndex(l => l === d);
      if (!exist && i >= 0) exist = true;
      return i;
    });

    if (exist) {
      let newRange = lastIndex.map(i => {
        if (i >= 0 && i < lastRange.length) { 
          return lastRange[i];
        } else {
          return undefined;
        }
      });
      newRange = fillUndefined(newRange, originColors);
      return lastScale.domain(domain).range(newRange);
    }
  }
  let scale = scaleOrdinal().domain(domain).range(this.color());
  scale._defaultRange = this.color();
  return scale;
}

export default updateColorScale;