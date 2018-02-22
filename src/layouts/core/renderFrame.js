import {select} from 'd3';
import {NotAvailableSelectorError} from '../../modules/error';
import {className} from '../../modules/util';

function setSvg(svg, self) {
  svg.attr('width', self.width())
    .attr('height', self.height())
    .attr('viewBox', '0 0 ' + self.width() + ' ' + self.height());
  return svg;
}

function appendHidden(container, self) {
  self.__execs__.hidden = container.append('g')
    .attr('class', className('hidden-g'))
    .style('visibility', 'hidden');
  return container;
}

/**
 * render a svg and append a hidden area
 * @memberOf Core#
 * @function
 * @private
 * @return {Core}
 */
function renderFrame() {
  let selector = this.container();
  let container = select(selector);
  if (container.empty()) throw new NotAvailableSelectorError();
  if (typeof selector !== 'string') {
    if (container.node().tagName === 'g' || container.node().tagName === 'G') {
      if (container.selectAll(className('hidden-g', true)).empty()) {
        container.call(appendHidden, this);
      } else if (!this.__execs__.hidden) {
        this.__execs__.hidden = container.select(className('hidden-g', true));
      }
      return ;  
    }
  } 
  let svg;
  if (!this.__execs__.canvas) {
    svg = container.append('div')
     .attr('class',  className('frame'))
    if(this.name()) svg.attr('id', 'jelly-chart-id-' + this.name());
    svg = svg.append('svg');
    svg.call(appendHidden, this);
    svg.call(setSvg, this);
  } else {
    svg = select(this.__execs__.canvas.node().parentNode);
  }
  container.select(className('frame', true))
    .style('width', this.width() + 'px')
    .style('height', this.height() + 'px');
  if (this.transition()) svg = svg.transition().duration(this.transition().duration).delay(this.transition().delay)
  svg.call(setSvg, this);
  return this;
}

export default renderFrame;