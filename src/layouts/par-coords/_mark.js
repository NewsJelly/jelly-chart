import {line, transition} from 'd3';
import {yMeasureName} from './';
import {className} from '../../modules/util';

function _mark() {
  const that = this;
  const canvas = this.__execs__.canvas;
  const scale = this.__execs__.scale;
  const size = this.size();
  const innserSize = this.innerSize();
  const trans = transition().duration(this.transition().duration).delay(this.transition().delay);
  const lineGenInit = line().x(d => scale.x(d.data.x)).y(innserSize.height);
  const lineGen = line().x(d => scale.x(d.data.x))
    .y(d => scale[yMeasureName(d.data.x)](d.data.y));
  
  let __seriesInit = function(selection) {
    selection.attr('d', lineGenInit)
      .attr('fill', 'none')
      .attr('stroke-width', size.range[0]);
  }

  let __series = function(selection) {
    selection.transition(trans)
      .attr('d', lineGen)
      .attr('stroke-width', size.range[0]);
  }  

  let __appendSeries = function (selection) {
    let series = selection.selectAll(that.seriesName())
      .data(d => d.children, (d,i) => d.key ? d.key : i)
    
    series = series.enter().append('g')
      .attr('class', that.seriesName(true))
      .merge(series);
    
    let path = series.selectAll('path' + className('line', true))
      .data(d => [d])
    
    path.enter().append('path')
      .attr('class', className('line'))
      .call(__seriesInit)
      .merge(path)
      .call(__series);
  }

  let region = canvas.selectAll(this.regionName());
  region.call(__appendSeries)
}

export default _mark;