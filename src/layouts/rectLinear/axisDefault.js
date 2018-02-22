import axis from '../../modules/axis';

function _axisExec (target, field, axis) {
  if(!arguments.length) return this.__execs__.axis;
  this.__execs__.axis[target] = this.__execs__.axis[target] || {}
  this.__execs__.axis[target][field] = axis; // => axis.x.field 
  return this;
}

function _set(source, target, key) {
  if (source[key] !== undefined) target[key](source[key]);
}
/**
 * generates new Axis instance according from an {@link RectLinear.#axis axis} setting
 * @memberOf Core#
 * @function
 * @private
 * @param {d3Scale} scale 
 * @param {object} axisSetting
 * @return {Axis}
 */
function axisDefault(scale, axisSetting) {
  let axisTitle = this.axisTitles().filter(
    d => d.target === axisSetting.target && (!d.field || d.field === axisSetting.field) && (!d.shape || d.shape === axisSetting.shape)
  );
  if (axisTitle.length > 0) axisTitle = axisTitle[0];
  else axisTitle = null;
  let curAxis = axis();
  curAxis.scale(scale)
    .target(axisSetting.target)
    .field(axisSetting.field)
    .orient(axisSetting.orient)
    .tickFormat(axisSetting.tickFormat)
    .title(axisTitle ? axisTitle.title : axisSetting.title)
    .titleOrient(axisSetting.titleOrient)
    .autoTickFormat(axisSetting.autoTickFormat)
    .transition(this.transition());
  if ( scale._field) {
    let field = scale._field;
    if (field.interval && field.interval()) curAxis.interval(field.interval());
    if (field.format && field.format() && !axisSetting.autoTickFormat) curAxis.tickFormat(field.format());
    else if (axisSetting.autoTickFormat) curAxis.tickFormat(null);
  }
  else curAxis.interval(null);
  ['tickPadding', 'thickness', 'showTitle', 'showDomain', 'showTicks'].forEach(k => _set(axisSetting, curAxis, k));
  _axisExec.call(this, axisSetting.target, axisSetting.field, curAxis);
  return curAxis;
}

export default axisDefault;