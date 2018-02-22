import scatter from './';

function _facet () {
  const parent = this;
  const scale = this.__execs__.scale;
  const facet = this.facet();
  const canvas = this.__execs__.canvas;
  const innerSize = this.innerSize();
  const measures =  this.measures();
  let width, height;
  let settings = ['axisTitles', 'size', 'grid', 'font', 'label', 'tooltip']
    .map(d => { return {key: d, value:this[d]()};});
  let hasX = this.axisX();
  let hasY = this.axisY();
  let _small = function(d) {
    let small = scatter()
        .container(this)
        .data(d)
        .measures(measures)
        .width(width).height(height)
        .legend(false)
        .zeroMargin(true) 
        .aggregated(true) 
        .parent(parent) 
        .color(scale.color(d.data.key));
    settings.forEach(d => small[d.key](d.value));
    if (hasY) small.axis({target:'y', orient:'left'});
    if (hasX) small.axis({target:'x', orient:'bottom'});//, showTitle: i === arr.length-1});
    small.render();
  }
  if (facet.orient === 'horizontal') {
    width =  scale.region.bandwidth();
    height = innerSize.height;
  } else {
    width = innerSize.width;
    height = scale.region.bandwidth();
  }

  canvas.selectAll('.facet')
    .each(_small);
}

export default _facet;