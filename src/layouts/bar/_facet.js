import bar from './';
import {mixedMeasure} from '../../modules/measureField';
function _facet () {
  let parent = this;
  let scale = this.__execs__.scale;
  let facet = this.facet();
  let canvas = this.__execs__.canvas;
  let mono = this.mono();
  let innerSize = this.innerSize();
  let dimensions = [this.dimensions()[0]];
  let measures = this.isMixed() ? [mixedMeasure] : this.measures();
  let width, height;
  let settings = ['axisTitles','normalized', 'padding', 'orient', 'font', 'label', 'grid', 'tooltip']
    .map(d => { return {key: d, value:this[d]()};});
  let hasX = this.axisX();
  let hasY = this.axisY();
  let _smallbar = function(d) {
    let smallBar = bar()
        .container(this)
        .data(d)
        .dimensions(dimensions).measures(measures)
        .width(width).height(height)
        .legend(false)
        .zeroMargin(true) //remove margin
        .aggregated(true) 
        .parent(parent) 
    settings.forEach(d => {smallBar[d.key](d.value)});

    if (!mono) smallBar.color(scale.color(d.data.key));
    if (facet.orient === 'vertical') {
      if (hasX) smallBar.axis({target:'x', orient:'bottom'});//, showTitle: i === arr.length-1});
      if (hasY) smallBar.axis({target:'y', orient:'left'});
    } else {
      if (hasX) smallBar.axis({target:'x', orient:'bottom'});
      if (hasY) smallBar.axis({target:'y', orient:'left'});//showTitle: i === 0});
    }
    smallBar.render();
  }
  if (facet.orient === 'horizontal') {
    width =  scale.region.bandwidth();
    height = innerSize.height;
  } else {
    width = innerSize.width;
    height = scale.region.bandwidth();
  }

  canvas.selectAll(this.regionName() + '.facet')
    .each(_smallbar);
}

export default _facet;