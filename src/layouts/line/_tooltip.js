import multiTooltip from '../../modules/multi-tooltip';
import {className} from '../../modules/util';

function _single(fromMulti = false) {
  const parent = this.parent();
  const field = this.__execs__.field;
  const mixed = this.isMixed();
  let key = (d, text) => {
    return {name: 'key', value:text};
  }
  let value = (d, text) => {
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
  return this.renderTooltip({dx: (this.size().range[0] + 4), value, key}, fromMulti);
}

function _multi() { //multi-tooltip 
  const canvas = this.__execs__.canvas;
  let multiTooltipG = canvas.select(className('multi-tooltip-g', true));
  if (multiTooltipG.empty()) multiTooltipG = canvas.append('g').attr('class', className('multi-tooltip-g'));
  let tooltipObj = _single.call(this, true);
  let multiTooltipObj = multiTooltip()
    .target(this)
    .dx(this.size().range[0])
    .dy(this.size().range[0])
    .color(this.color()[0])
    .tooltip(tooltipObj)
    .sortByValue(this.multiTooltip().sortByValue);

  multiTooltipObj.render(multiTooltipG.node());
  this.__execs__.tooltip = multiTooltipObj;

  const dispatch = this.__execs__.multiTooltipDispatch;
  multiTooltipObj.on('start', function(tick) { // dispatch events to commute with sub-charts
    dispatch.call('selectStart', this, tick);
    dispatch.call('multiTooltip', this, tick);
  }).on('move', function(tick) {
    dispatch.call('selectMove', this, tick);
    dispatch.call('multiTooltip', this, tick);
  }).on('end', function() {
    dispatch.call('selectEnd', this);
    dispatch.call('multiTooltip', this);
  });
  
  return multiTooltipObj;
}
function _tooltip() {
  if (!this.isFacet() && this.multiTooltip()) _multi.call(this);
  else if(this.tooltip() && !this.multiTooltip()) _single.call(this, false);
}

export default _tooltip;