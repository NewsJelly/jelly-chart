function _tooltip() {
  if(!this.tooltip()) return;
  // const field = this.__execs__.field;

  const innerSize = this.innerSize();
  const scale = this.__execs__.scale;
  let key = function(d) {
    let title = d.parent.data.hasOwnProperty('key') !== null ? d.parent.data.key : '';
    return {name: 'key', value: title};
  }

  let value = function(d, text) {
    return {name: d.data.key, value: text};
    // return {name: field.color.field(), value: text};
  }
  let offset = function(_, i) {
    let x = innerSize.width / (scale.x.domain().length + 1);
    let y = (innerSize.height / (scale.y.domain().length + 1)) * (i % 4);
    return {x:x, y:y};
  }
  this.renderTooltip({offset, key, value, color: '#111'});
}

export default _tooltip;