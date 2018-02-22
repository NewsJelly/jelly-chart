/**
 * sets a custom title of an axis. Filters axes, returning the axis that has the same target and field whith targetAndField, then sets or remove it's title. If title is false the selected axis's custom title will be removed. Actually, .axisTitle method manipulates {@link RectLinear#axisTitles axisTitles}.
 * @memberOf RectLinear#
 * @function
 * @example
 * rectLinear.axisTitle('x', 'custom Axis X')
 * rectLinear.axisTitle('y.Sales', 'custom Axis Y')
 * rectLinear.axisTitle({target:'y', field: 'Sales'}, 'custom Axis X')
 * rectLinear.axisTitle('x', false);
 * @param {string|object} targetAndField
 * @param {string} targetAndField.target
 * @param {string} [targetAndField.field]
 * @param {string} title
 * @return {RectLinear}
 */
function axisTitle(targetAndField, title) {
  let target;
  if (typeof targetAndField === 'string') {
    let splited = targetAndField.split('.');
    target = {target: splited[0], field: splited.length >= 2 ? splited.slice(1).join('.'): null};
  } else if (typeof targetAndField === 'object') {
    target = targetAndField;
  } else {
    throw new Error(`.axisTitle: ${targetAndField} is not unavailable`);
  }
  
  let titles = this.axisTitles();
  let exist = -1;
  
  for (let i= 0; i < titles.length; i++) {
    let t = titles[i];
    if (t.field === target.field && t.target === target.target) {
      exist = i;
      break;
    }
  }
  if (title) {
    let result = Object.assign({}, target);
    result.title = title;
    if (exist >= 0) titles.splice(exist, 1, result);
    else titles.push(result);
  } else {
    titles.splice(exist, 1);
  }
  return this;
}

export default axisTitle;