import {select} from 'd3';
import bar from '../bar/';
import line from '../line/';

function _facet () {
  let parent = this;
  let data = this.data();
  let scale = this.__execs__.scale;
  let field = this.__execs__.field;
  let color = this.color();
  let innerSize = this.innerSize();
  let width = innerSize.width, height = innerSize.height;
  let padding = this.padding();
  let dimensions =  this.dimensions();
  let barMeasures = [field.yBar.toObject()];
  let barSettings =   ['axisTitles', 'padding', 'font', 'label', 'grid']
    .map(d => { return {key: d, value:this[d]()};});
  let lineMeasures = [field.yLine.toObject()];
  let lineSettings = ['axisTitles', 'curve', 'point', 'pointRatio', 'regionPadding', 'size', 'grid', 'font', 'label']
    .map(d => { return {key: d, value:parent[d]()};});
  let _smallLine = function() {
    let smallLine = line()
        .container(this)
        .data(data)
        .dimensions(dimensions).measures(lineMeasures)
        .width(width).height(height)
        .legend(false)
        .tooltip(false)
        .padding(padding)
        .parent(parent) 
        .zeroOffset(true) 
        .color(color[1])
        .scaleBandMode(true);
    lineSettings.forEach(d => smallLine[d.key](d.value));
    smallLine.render();
    scale['x-line'] = smallLine.scale('x');
    scale['y-line'] = smallLine.scale('y');
  }
  let _smallbar = function() {
    let smallBar = bar()
        .container(this)
        .data(data)
        .dimensions(dimensions).measures(barMeasures)
        .width(width).height(height)
        .padding(padding)        
        .legend(false)
        .tooltip(false)
        .zeroOffset(true) 
        .parent(parent) 
        .color(color[0]);
    barSettings.forEach(d => {smallBar[d.key](d.value)});
    smallBar.render();
    scale['x-bar'] = smallBar.scale('x');
    scale['y-bar'] = smallBar.scale('y');
  }
  
  this.regions()
    .each(function(_,i) {
      if (i===0) select(this).each(_smallbar);
      else select(this).each(_smallLine)
    })
}

export default _facet;