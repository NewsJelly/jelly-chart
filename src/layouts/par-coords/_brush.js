import {brush, brushY, event, select} from 'd3';
import {xMeasureName, yMeasureName, shapes} from './';

function _parcoords() {
  const canvas = this.__execs__.canvas;
  const scale = this.__execs__.scale;
  const innerSize = this.innerSize();
  const measures = this.measures();
  const conditions = {};
  const brushW = this.font()['font-size'];
  const brushGen = brushY().extent([[-brushW,0], [brushW, innerSize.height]]);
  const series = canvas.selectAll(this.seriesName());
  let hide = function() {
    series.attr('opacity', '1')
      .filter(d => {
        for (let k in conditions) { //hide excluded
          let domain = conditions[k];
          let target = d.filter(dd => dd.data.x === k)[0];
          let result = (target.data.y < domain[1]  || target.data.y > domain[0])
          if (result) return true;
        }
        return false;
      }).attr('opacity', 0.1);
  }
  let brushG = canvas.selectAll('.brush.y')
    .data(measures, d => d.field);
  brushG.exit().remove();
  brushG.enter().append('g')
    .attr('class', 'brush y')
    .merge(brushG)
    .attr('transform', d => 'translate(' + [scale.x(d.field), 0] +')')
    .call(brushGen);
  brushGen.on('brush.parCoords', function(d) {
    conditions[d.field] = event.selection.map(scale[yMeasureName(d.field)].invert);
    hide();
  }).on('end.parCoords', function(d) {
    if(event.selection === null) {
      delete conditions[d.field];
      hide();
    }
  });

  this.brushGen(brushGen);
}

function _matrix () {
  const canvas = this.__execs__.canvas;
  const scale = this.__execs__.scale;
  const brushW = scale.region.bandwidth();
  const brushGen = brush().extent([[0,0], [brushW, brushW]]);  
  const nodes = canvas.selectAll(this.nodeName());
  let brushCell;
  let brushG = canvas.selectAll('.brush.matrix')
    .data(d => d);
  brushG.exit().remove();
  brushG.enter().append('g')
    .attr('class', 'brush matrix')
    .merge(brushG)
    .attr('transform', d => 'translate(' + [scale.region(d.xField.field), scale.region.range()[1] - scale.region(d.yField.field) - scale.region.bandwidth()] + ')')
    .call(brushGen);
  
  brushGen.on('start.matrix', function() {
    if(brushCell !== this) {
      select(brushCell).call(brushGen.move, null);
      brushCell = this;
    }
  }).on('brush.matrix', function(d) {
     if(event.selection === null) return;
     const xName = d.xField.field
     const yName = d.yField.field;
     const scaleX = scale[xMeasureName(xName)];
     const scaleY = scale[yMeasureName(yName)];
     const domain = event.selection.map(d => [scaleX.invert(d[0]), scaleY.invert(d[1])]);
     nodes.attr('opacity', 1).filter(function(d) {
       d = d.data;
       return d[xName] < domain[0][0] || d[xName] > domain[1][0] || d[yName] > domain[0][1] || d[yName] < domain[1][1];
     }).attr('opacity', 0.1);
  }).on('end.matrix', function() {
    if(event.selection === null) { // if no selection, recover
     nodes.attr('opacity', 1);
    }
  })
  this.brushGen(brushGen);
}

function _brush () {
  if (this.shape() === shapes[0]) {
    _parcoords.call(this);
  } else {
    _matrix.call(this);
  }
}

export default _brush;