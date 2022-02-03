import line from './';
import {mixedMeasure} from '../../modules/measureField';

function _facet () {
  const parent = this;
  const scale = this.__execs__.scale;
  const facet = this.facet();
  const canvas = this.__execs__.canvas;
  const innerSize = this.innerSize();
  const dimensions = [this.dimensions()[0]];
  const measures = this.isMixed() ? [mixedMeasure] : this.measures();
  let width, height;
  let settings = ['axisTitles', 'curve', 'meanLine', 'multiTooltip', 'normalized', 'padding' ,'point', 'pointRatio', 'regionPadding', 'shape', 'size', 'grid', 'font', 'label']
    .map(d => { return {key: d, value:this[d]()};});
  let hasX = this.axisX();
  let hasY = this.axisY();
  let smallLines = []; //stroe sub-charts
  let _smallLine = function(d) {
    let smallLine = line()
        .container(this)
        .data(d)
        .dimensions(dimensions).measures(measures)
        .width(width).height(height)
        .legend(false)
        .tooltip(false)
        .parent(parent) 
        .zeroMargin(true) 
        .aggregated(true) 
        .color(scale.color(d.data.key));
    settings.forEach(d => smallLine[d.key](d.value));
    if (hasY) smallLine.axis({target:'y', orient:'left'});//showTitle: facet.orient === 'horizontal' ? i === 0 : true});
    if (hasX) smallLine.axis({target:'x', orient:'bottom'});//showTitle: facet.orient === 'horizontal' ? true : i === arr.length-1});
    smallLine.render();
    smallLines.push(smallLine);
  }
  if (facet.orient === 'horizontal') {
    width =  scale.region.bandwidth();
    height = innerSize.height;
  } else {
    width = innerSize.width;
    height = scale.region.bandwidth();
  }

  canvas.selectAll('.facet')
    .each(_smallLine);
  smallLines.forEach(sm => { //deal sub-chart's event
    sm.on('selectStart.facet selectMove.facet selectEnd.facet', function(tick) { //propgate events to other sub-chart
      //let start = event.type === 'mouseenter';
      smallLines.forEach(osm => {
        if(osm !== sm) {
          osm.showMultiTooltip(tick);
        }
      });
    })
  });
}

export default _facet;