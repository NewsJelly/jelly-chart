import {select} from 'd3';
import {className} from '../../modules/util';
import spectrum from  '../../modules/spectrum';

/**
 * render a spectrum instead of a legend according to internal {@link Core#legend legend} settings. Charts such as treeemap and xy-heatmap, which use a contniuous color scale to present their measure level, use this method.
 * @memberOf Core#
 * @function
 * @private
 * @return {Core}
 */
function renderSpectrum() {
  let legendToggle = this.legend();
  if (!legendToggle) return;
  
  let field = this.__execs__.field;
  let x,y,width, height;
  let offset =  this.offset();
  //FIXME: enable other directions
  if (legendToggle.orient === 'bottom') {
    x = 0;
    y = this.innerSize().height  + offset.bottom - this.margin().bottom - legendToggle.thickness;
    width = this.innerSize().width;
    height = legendToggle.thickness;
  }
  
  let colorScale = this.scale().color;
  let legendObj = spectrum().scale(colorScale)
    .field(field.color.field())
    .x(x).y(y)
    .width(width).height(height);
  this.__execs__.canvas.selectAll(this.nodeName() + '.point')
    .on('mouseenter.spectrum', d => {
      legendObj.show(d.value)
    })
    .on('mouseleave.spectrum', () => legendObj.hide());
  this.__execs__.legend = legendObj;

  let canvas = this.__execs__.canvas;
  let spectrumSel = canvas.selectAll(className('spectrum', true))
    .data([legendObj]);
  spectrumSel.exit().remove();
  spectrumSel.enter().append('g')
    .attr('class', className('spectrum'))
    .merge(spectrumSel)
    .each(function(d) {
      d.render(select(this));
    });
  return this;
}

export default renderSpectrum;