import tooltip from '../../modules/tooltip';

/**
 * renders tooltip according to the internal {@link Core#tooltip tooltip} settings.
 * @memberOf Core#
 * @function
 * @private
 * @param {object} setting
 * @param {number} [setting.dx]
 * @param {number} [setting.dy]
 * @param {string} [setting.color ]
 * @param {function} [setting.key]
 * @param {function} [setting.value]
 * @param {function} [setting.offset]
 * @param {boolean} [setting.showDiff]
 * @param {boolean} fromMulti=false
 * @param {boolean} absolute=false
 * @return {Tooltip}
 */
function renderTooltip(setting = {}, fromMulti = false, absolute = false) {
  const tooltipObj = tooltip().dx( (setting && setting.dx ? setting.dx : 0))
    .dy((setting && setting.dy ? setting.dy : 0))
    .target(this)
    .absolute(absolute)
    .fromMulti(fromMulti);
  const container = (this.parent() ? this.parent() : this).__execs__.canvas;
  if(setting.color) tooltipObj.color(setting.color);
  if (!fromMulti) {
    tooltipObj.keyFunc(setting.key)
      .valueFunc(setting.value)
      .offsetFunc(setting.offset)
      .showDiff(setting.showDiff);
    this.__execs__.tooltip = tooltipObj;
  }
  tooltipObj.render(container.node().parentNode.parentNode);
  return tooltipObj;
}

export default renderTooltip;