import {countMeasureTitle} from '../../modules/measureField';

function _tooltip() {
  if(!this.tooltip()) return;
  const count = this.isCount();
  const field = this.__execs__.field;
  const tFormat = d => {
    let f = field.region.isInterval() ? field.region.format(): null;
    return f ? f(d) : d;
  }

  let key = d => {
    return {name: 'key', value: tFormat(d.data.key)};
  }
  let value = (d, text) => {
    let name;
     if (count) {
      name = countMeasureTitle;
    } else {
      name = field.region.field();
    }
    return {name, value:text}
  }

  this.renderTooltip({value, key});
}

export default _tooltip;