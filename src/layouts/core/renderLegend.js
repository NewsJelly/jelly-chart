import {select} from 'd3';
import legend from '../../modules/legend';
import {className} from '../../modules/util';

/**
 * render a legend according to internal {@link Core#legend legend} settings
 * @memberOf Core#
 * @function
 * @private
 * @param {string} [field=region] specify a field name to select color scale.
 * @return {Core}
 */
function renderLegend(field = 'region') {
  const that = this;
  let legendToggle = this.legend();
  let canvas = this.__execs__.canvas;  
  if (!legendToggle) {
    canvas.selectAll(className('legend', true)).remove();
    return;
  }
  const fieldObj = this.__execs__.field;
  if (!legendToggle.format && fieldObj[field].isInterval()) legendToggle.format = fieldObj[field].format();
  let x,y,width, height;
  let offset =  this.offset();
  let innerSize = this.innerSize();
  let margin = this.margin();
  let offsetThickness = legendToggle.font ? legendToggle.font['font-size'] : 20;
  if (legendToggle.orient === 'bottom' || legendToggle.orient === 'top') {
    x = 0;
    if (legendToggle.orient === 'bottom') y = innerSize.height  + offset.bottom - margin.bottom - legendToggle.thickness + offsetThickness;
    else y = - offset.top + margin.top - offsetThickness;
    if (this.axisX && !this.axisX()) {
      y += offsetThickness * (legendToggle.orient === 'bottom' ? 1 : -1)
    }
    width = innerSize.width;
    height = legendToggle.thickness - offsetThickness;
  } else {
    if (legendToggle.orient === 'right') x = innerSize.width + offset.right - legendToggle.thickness;
    else x = - offset.left + margin.left - offsetThickness;
    y = offsetThickness / 2;
    width = legendToggle.thickness - offsetThickness;
    height = innerSize.height - offsetThickness/2;
  }
  let colorScale = this.scale().color;
  let legendObj = legend().scale(colorScale)
    .x(x).y(y)
    .width(width).height(height)
    .orient(legendToggle.orient)
    .format(legendToggle.format)
    .transition(this.transition());
  this.__execs__.legend = legendObj;

  legendObj.on('selectEnter', function(d) {
    if (that.muteFromLegend) {
      that.muteFromLegend(d);
    }
    legendObj.mute(this); //FIXME: need to mute by the label
    that.__execs__.selectDispatch.call('legendEnter', this, d);
  }).on('selectLeave', function(d) {
    if (that.demuteFromLegend) {
      that.demuteFromLegend(d);
    }
    legendObj.demute(this);
    that.__execs__.selectDispatch.call('legendLeave', this, d);
  })
  
  let legendSel = canvas.selectAll(className('legend', true))
    .data([legendObj]);
  legendSel.exit().remove();
  legendSel.enter().append('g')
    .attr('class', className('legend'))
    .merge(legendSel)
    .each(function(legend) {
      legend.render(select(this));
    });
  return this;
}

export default renderLegend;