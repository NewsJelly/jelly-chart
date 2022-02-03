function _tooltip() {
  if(!this.tooltip() || this.isFacet()) return;
  const parent = this.parent();
  const mixed = this.isMixed();
  const field = this.__execs__.field;
  const isStacked = this.stacked() && this.isNested() && !this.isFacet();
  const isVertical = this.isVertical();
  const isShowDiff = this.showDiff() && !this.isNested();
  let key = function(d, text) {
    return {name: 'key', value:text};
  }
  let value = function(d, text) {
    let name;
    if (mixed) {
      name = d.key;
    } else if (parent && parent.isMixed()) {
      name = d.key;
    } else {
      name = field.y.field();
    }
    return {name, value:text}
  }

  let valueDiff = function(d) {
    let nd = d.neighbor;
    let result = [{name: (isShowDiff ? d : d.parent).data.key, value: d.text} , {name: (isShowDiff ? nd : nd.parent).data.key, value: nd.text}]
    if (isShowDiff) result.reverse();
    let diff = d.diff ? d.diff.value : nd.diff.value;
    result.push({name: '(+/-)', value: diff});
    return result;
  }
  let offset = function(d) {
    let x = 0, y = 0;
    if (isStacked) {
      x = Math.max(-d.x + d.neighbor.x + d.neighbor.w, d.w);
      if (isVertical) { 
        if (d.neighbor.parent.x > d.parent.x) x += Math.abs(d.neighbor.parent.x - d.parent.x) - d.w;
      } else {
        let yDiff = d.neighbor.parent.y - d.parent.y;
        if (yDiff < 0) { //when it is last
          x = d.w;
        } else {
          y += d.h + (yDiff - d.h) /2;
        }
      }
    } else {
      x += d.w;
    }
    return {x,y}
  }
  let toggle = {key, offset};
  if (isStacked || isShowDiff) {
    toggle.value = valueDiff;
    toggle.showDiff = true;
  } else {
    toggle.value = value;
  }
  this.renderTooltip(toggle);
}

export default _tooltip;