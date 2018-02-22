import {brush, event, zoom} from 'd3';
import _mark from './_mark';

function _brushZoom() {

  const canvas = this.__execs__.canvas;
  const field = this.__execs__.field;
  const innerSize = this.innerSize();
  const scale = this.__execs__.scale;
  const axis = this.__execs__.axis;
  const axisX = axis && axis.x ? axis.x[field.x.field()] : null;
  const axisY = axis && axis.y ? axis.y[field.y.field()] : null;

  const brushGen = brush().extent([[0,0], [innerSize.width, innerSize.height]])
  let brushG = canvas.selectAll('.brush.x')
    .data([innerSize]);
  brushG.exit().remove();
  brushG = brushG.enter().append('g')
    .attr('class', 'brush x')
    .merge(brushG)
    .attr('transform', 'translate(' + [0, 0] +')')
    .call(brushGen);
  this.brushGen(brushGen);
  const zoomExtent = this.zoomExtent(this.isColor(), true);
  const zoomGen = zoom()
    .scaleExtent(zoomExtent)
    .translateExtent([[0, 0], [this.width(), this.height()]]);
  canvas.call(zoomGen); 
  this.zoomGen(zoomGen)
  const xDomainOrigin = scale.x.domain();
  const yDomainOrigin = scale.y.domain();
  let idleTimeout;
  brushGen.on('end.scatter', () => {
    if (event.sourceEvent && event.sourceEvent.type === 'end') return;
    let selection = event.selection;
    if (!selection) { //init
      if (!idleTimeout) return idleTimeout = setTimeout(()=> {idleTimeout=null}, 300);
      scale.x.domain(xDomainOrigin);
      scale.y.domain(yDomainOrigin);
    } else {
      scale.x.domain([selection[0][0], selection[1][0]].map(scale.x.invert, scale.x));
      scale.y.domain([selection[1][1], selection[0][1]].map(scale.y.invert, scale.y));
    }
    
    if (axisX) {
      axisX.render(null);
    }
    if (axisY) {
      axisY.render(null);
    }
    _mark.call(this);
    this.brushMove(brushG, null);    
  })
}

export default _brushZoom;