function _tooltip() {
  if(!this.tooltip()) return;
  const shape = this.shape();

  let key = function(d) {
    let title = d.parent.data.hasOwnProperty('key') !== null ? d.parent.data.key : '';
    return {name: 'key', value: title};
  }

  let value = function(d, text) {
    return {name: d.data.key, value: text};
  }
  let offset = function(d) {
    let x = 0, y = 0;
    if (shape === 'heatmap') x = d.w; // 일반 히트맵 툴팁 offset
    else x = d.w / 3; // 버블 히트맵 툴팁 offset
    return {x:x, y:y};
  }
  this.renderTooltip({offset, key, value, color: '#111'});
}

export default _tooltip;