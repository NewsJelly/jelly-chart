import {select} from 'd3';

/**
 * @memberOf Core#
 * @function
 * @private
 * @param {*} selection 
 * @param {*} font 
 */
function styleFont(selection, font) {
  font = font || this.font();
  for (let fontKey in font) {
    if (!selection.selectAll) selection = select(selection);
    selection.style(fontKey, font[fontKey] + (fontKey === 'font-size' ? 'px' : ''));
  }
}

export default styleFont;