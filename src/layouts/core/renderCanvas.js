import {select} from 'd3';
import {NotAvailableSelectorError} from '../../modules/error';
import {className, getUniqueId} from '../../modules/util';

const background = 'none';
function appendClipPath(selection, innerSize, margin = 0, transition = null) {
  let pos = rect => {
    rect.attr('x', -margin)
      .attr('y', -margin)
      .attr('width', innerSize.width + margin*2)
      .attr('height', innerSize.height + margin*2);
  }
  let defs = selection.selectAll(function() {
      return this.childNodes;
    }).filter(function() {
      return select(this).classed(className('canvas-g-defs'))
    })
  if (defs.empty()) {
    defs = selection.append('defs')
      .attr('class', className('canvas-g-defs'))
      .datum(innerSize)  
    defs.append('clipPath')
      .attr('id', () => getUniqueId('canvas-g-'))
      .attr('class', className('canvas-g-clip-path'))
    .append('rect')
      .attr('class', className('canvas-g-clip-path-rect'))
      .call(pos);
  }
  
  let rect = defs.select(className('canvas-g-clip-path-rect', true));
  if (transition) rect = rect.transition().duration(transition.duration).delay(transition.delay);
  rect.call(pos);
}

function appendStringContainer(selector, offset, self) {
  const markLocal = self.__execs__.mark;
  selector = select(selector);
  if (selector.empty()) throw new NotAvailableSelectorError();
  if (selector.node().tagName === 'g' || selector.node().tagName === 'G') {
    if (selector.select(className('canvas-g', true)).empty() ) {
      self.__execs__.canvas = selector.append('g').attr('class', className('canvas-g'));
      self.__execs__.canvas.append('g').attr('class', className('regions'));
    } else if(!this.__execs__.canvas) {
      self.__execs__.canvas = selector.select(className('canvas-g', true));
    }
    markLocal.set(self.__execs__.canvas.node(), {x:offset.left, y:offset.right});
    self.__execs__.canvas
      .attr('transform', 'translate(' + [offset.left, offset.right] +')');
  }
}

/**
 * render a canvas area on which chart components are placed
 * @memberOf Core#
 * @function
 * @private
 * @param {number} margin custom margin for shrink the clip-path on the canvas
 * @return {Core}
 */
function renderCanvas (margin = 0) {
  let selector = this.container();
  if(selector === null) return null;
  let offset = this.offset();
  let innerSize= this.innerSize();
  if(typeof selector !== 'string') { //if is DOM
    appendStringContainer(selector, offset, this);
    if (this.__execs__.canvas) { //if has a canvas, return 
      this.__execs__.canvas.datum(this.__execs__.munged);
      this.__execs__.canvas.call(appendClipPath, innerSize, margin, this.transition());
      return;
    } 
  }

  let svg;
  if (this.__execs__.canvas) { //if has a canvas, find svg
    svg = select(this.__execs__.canvas.node().parentNode);
  } else { //if has no canvas, generate svg and canvas.
    let container =  select(selector);
    if (container.empty()) {
      throw new NotAvailableSelectorError();
    }
    svg = container.select(className('frame', true)).select('svg');
    this.__execs__.canvas = svg.append('g').attr('class', className('canvas-g'))
      .attr('transform', 'translate(' + [offset.left, offset.top] +')');
    this.__execs__.canvas.append('rect')
      .attr('class', className('background'))
      .style('fill', background);
    this.__execs__.canvas.append('g').attr('class', className('regions'));
  }
  let trans = this.transition();
  let canvas = this.__execs__.canvas;
  canvas.style('pointer-events', 'none');
  if (trans) { //FIXME: enable pointer events after rendering
   canvas.transition().duration(trans.duration).delay(trans.delay)
    .attr('transform', 'translate(' + [offset.left, offset.top] +')')
    .on('end', function() {
      select(this).style('pointer-events', 'all');
    })
  } else {
    canvas.attr('transform', 'translate(' + [offset.left, offset.top] +')')
      .style('pointer-events', 'all');
  }
  canvas.select(className('background', true))
    .attr('width', innerSize.width).attr('height', innerSize.height);
  canvas.datum(this.__execs__.munged)
    .call(appendClipPath, innerSize, margin, this.transition())
  
  return this;
}

export default renderCanvas;