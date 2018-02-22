import scatter from '../scatter/';

function _facet () {
  let parent = this;
  let scale = this.__execs__.scale;
  let canvas = this.__execs__.canvas;
  let measures = this.measures();
  let dimensions = this.dimensions();
  let width = scale.region.bandwidth();
  let settings = ['axisTitles','color', 'size', 'grid', 'font', 'label']
    .map(d => { return {key: d, value:this[d]()};});

  let _small = function(d,i) {
    let small = scatter()
        .container(this)
        .data(d.children)
        .dimensions(dimensions).measures([d.xField, d.yField])
        .width(width).height(width)
        .legend(false)
        .tooltip(false)
        .parent(parent) 
        .zeroOffset(true)
        .noAxisOffset(true); 

    let showX = (i % measures.length === 0);
    let showY = i < measures.length;
    settings.forEach(d => small[d.key](d.value));
    small.axis({target:'y', orient:'left', showTitle: showY, showTicks: showY});
    small.axis({target:'x', orient:'bottom', showTitle: showX, showTicks: showX});
    small.render();
  }
 
  canvas.selectAll('.facet')
    .each(_small);
}

export default _facet;