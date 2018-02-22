import {event, zoomIdentity, scaleOrdinal} from 'd3';
import _legend from './_legend';
import line from './';

function _brushZoom(ratio = 0.75) {
  const that = this;
  const innerSize = this.innerSize();
  const bigHeight = Math.round(innerSize.height * ratio);
  const smallHeight = innerSize.height - bigHeight;
  const settings = ['axis', 'axisTitles', 'color', 'curve', 'multiTooltip', 'normalized', 'padding' ,'point', 'pointRatio', 'regionPadding', 'shape', 'size', 'stacked', 'grid', 'font', 'label', 'tooltip']
    .map(d => { return {key: d, value:this[d]()};});
  const lines = [];
  let __regionLocal = (d,i) => {
    d.x = 0; 
    d.y =  i === 0 ? 0 : bigHeight
  }
  let region = this.renderRegion(__regionLocal, [{h: bigHeight}, {h: smallHeight}], true);
  region.each(function(d,i) {
    let l = line().container(this)  
      .data(that.data())
      .dimensions(that.dimensions()).measures(that.measures())
      .width(innerSize.width).height(d.h)
      .legend(false)
      .zeroMargin(true)
      .parent(that);
    settings.forEach(d => l[d.key](d.value));
    if (i == 0) { //big
      let xAt = l.axis().find(d=>d.target==='x');
      if (xAt) xAt.showTitle = false;
      l.brush(false).zoom('normal');
    } else {
      l.multiTooltip(false).tooltip(false).brush(true).point(false);
    }
    l.render();
    lines.push(l);
  })
  //legend
  if (this.isNested()) {
    let regionDomain = this.__execs__.field.region.munged(this.__execs__.munged).level(0).domain();
    this.scale().color = scaleOrdinal().domain(regionDomain).range(this.color());
    _legend.call(this);
  }
  
  //control brush+zoom
  const brushScale = lines[1].__execs__.scale.x
  const brushGroup = lines[1].__execs__.canvas.select('.brush.x');
  const zoomScale = lines[0].__execs__.scale.x; //maintain inital scale
  const zoomGroup = this.__execs__.canvas;
  lines[0].on('zoom.line', function() {
    if (event.sourceEvent && (event.sourceEvent.type === 'zoom' || event.sourceEvent.type === "end" || event.sourceEvent.type === "brush")) return; // ignore brush-by-zoom
    let newDomain = event.transform.rescaleX(brushScale).domain();
    lines[1].brushMove(brushGroup, newDomain.map(brushScale));
  });
  lines[1].on('brushed.line brushEnd.line', function() {
    if (event.sourceEvent && event.sourceEvent.type === 'brush') return; // ignore brush-by-zoom
    let range = event.selection|| brushScale.range();
    let domain = range.map(brushScale.invert);
    range = domain.map(zoomScale);
    lines[0].zoomTransform(zoomGroup, zoomIdentity
      .scale((zoomScale.range()[1] - zoomScale.range()[0]) / (range[1] - range[0]))
      .translate(-range[0], 0)); 
  })
}

export default _brushZoom;