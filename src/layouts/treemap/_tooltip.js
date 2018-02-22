import {countMeasureTitle} from '../../modules/measureField';

function _tooltip() {
  if(!this.tooltip()) return;
  const field = this.__execs__.field;
  const count = this.isCount();
  const shape = this.shape();
  let key = d => {
    return {name: 'key', value: d.data.key};
  }
  let value = (d, text) => {
    let name;
     if (count) {
      name = countMeasureTitle;
    } else {
      name = field.color.field();
    }
    return {name, value:text}
  }
  let offset = d => {
    return {x: (shape === 'pack') ? d.r : d.w, y:0}
  }
  this.renderTooltip({offset, value, key, color: '#111'}, false, true);
}

export default _tooltip;