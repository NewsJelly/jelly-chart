import {timeFormat, area, curveCatmullRom, curveLinear, curveStep, line, max, select, transition} from 'd3';
import {curves} from '../seriesMixin'
import {shapes} from './';
import {className, labelFormat} from '../../modules/util';

function _mark(zoomed = false) {
  const that = this;
  const canvas = this.__execs__.canvas;
  const field = this.__execs__.field;
  const nested = this.isNested.call(this);
  const scale = this.__execs__.scale;
  const stacked = this.isStacked();
  const color = this.color();
  const label = this.label();
  const individualScale = this.isIndividualScale();
  const size = this.size();
  const showPoint = this.point();
  const pointRatio = this.pointRatio();
  const trans = zoomed ? transition().duration(0).delay(0) : transition().duration(this.transition().duration).delay(this.transition().delay);  
  const isArea = this.shape() === shapes[1];
  const yField = this.measureName();
  const curve = this.curve() === curves[0] ? curveLinear : (this.curve() === curves[1] ? curveStep : curveCatmullRom);
  const scaleBandMode = this.scaleBandMode();
  const multiTooltip = this.multiTooltip();
  const xValue = d => scale.x(field.x.interval() ? new Date(d.data.key) : d.data.key) + (scaleBandMode ? scale.x.bandwidth()/2 : 0);
  const yValueFunc = (s) => {
    return d => {
      return stacked ? s(d.data.value[yField + '-end']) : s(d.data.value[yField])
    }
  }
  const lineInitGen = line().x(xValue).y(max(scale.y.range())).curve(curve);
  const lineGenFunc = (ys) => {
    return line().x(xValue).y(yValueFunc(ys)).curve(curve);
  }
  const areaInitGen = area().x(xValue)
    .y(max(scale.y.range())).curve(curve);
  const areaGenFunc = (ys) =>  {
    return area().x(xValue)
    .y0(d => stacked ? scale.y(d.data.value[yField + '-start' ]): max(scale.y.range()))
    .y1(yValueFunc(ys)).curve(curve);
  }
  let __local = function (selection) {
    let tFormat = (key) => {
      let f = field.x.isInterval() ? timeFormat(field.x.format()) : null; 
      return f ? f(key) : key;
    }
    selection.each(function(d, i, arr) {
      d.value = stacked ? d.data.value[yField + '-end'] : d.data.value[yField];
      d.x = xValue(d);
      d.y = yValueFunc(individualScale ? d.parent.scale : scale.y)(d);
      d.anchor = i === 0 ? 'start' : (i === arr.length-1 ? 'end' : 'middle'); 
      d.text = labelFormat(d.value);
      d.color = d.parent.color;
      d.key = tFormat(d.data.key);
    })
  }

  let __upward = function (selection) {
    selection.each(function(d,i,arr) {
      let upward = true;
      //let result = mark.get(this);
      if(i < arr.length -1 && arr[i+1]) {
        let nextResult = arr[i+1];
        upward = (nextResult.y <= d.y);
      }
      d.upward = upward;
    });
  }

  let __seriesInit = function (selection, area = false) {
    if(area) {
      selection.each(function(d) {
        let target = d.children;
        select(this).attr('d', areaInitGen(target)).attr('fill-opacity', 0.4)
          .style('stroke', 'none');
      })
    }
    else {
      selection.each(function(d) {
        let target = d.children;
        select(this).attr('d', lineInitGen(target))
          .style('fill', 'none');
      })
    }
  }
  let __series = function (selection, area = false) {
    let c = d => nested ? scale.color(d.data.key) : color[0];
    if (area) {
      selection.each(function(d) {
        let target =  d.children;
        select(this).transition(trans)
          .attr('d', areaGenFunc(individualScale ? d.scale : scale.y)(target));
      }).attr('fill', c).attr('stroke', 'none')
    } else {
      selection.each(function(d) {
        let target = d.children;
        select(this).transition(trans)
          .attr('d', lineGenFunc(individualScale ? d.scale : scale.y)(target));
      }).attr('stroke', c)
      .attr('stroke-width', size.range[0] + 'px')
    }
  }
  let __pointInit = function (selection) {
    selection
      .attr('r', (size.range[0] - size.range[0] / 4) * pointRatio)
      .attr('stroke-width', size.range[0] / 4 * pointRatio)
      .style('fill', '#fff')
      .attr('opacity',  showPoint ? 1 : 0)
      .style('cursor', 'pointer')
      .attr('cx', d => d.x)
      .attr('cy', max(scale.y.range()))
  }
  let __point = function (selection) {
    selection
      .transition(trans)
      .attr('r', (size.range[0] - size.range[0] / 4) * pointRatio)
      .attr('stroke-width', size.range[0] / 4 * pointRatio)
      .attr('opacity',  showPoint ? 1 : 0)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
  }
  let __labelInit = function (selection) {
    selection.each(function(d) {
      let selection = select(this);
      selection.attr('x', d.x )
        .attr('y', max(scale.y.range()))
        .attr('stroke', 'none')
        .text(d.text)
      that.styleFont(selection);
    })
  }
  let __label = function(selection) {
    selection.each(function(d) {
      let selection = select(this);
      selection.attr('text-anchor', d.anchor)
        .style('pointer-events', multiTooltip ? 'none' : 'all')
        .transition(trans)
        .attr('y', d.y  + (size.range[0] / 2 * pointRatio + 1) * (d.upward ? 1 : -1))
        .attr('x', d.x)
        .attr('dy', d.upward ? '.71em' : 0)
        .style('visibility', label ? 'visible' : 'hidden')
        .text(d.text);
      that.styleFont(selection);
    })
  }

  let __appendSeries = function (selection) {
    let series = selection.select(that.seriesName());
    if (series.empty()) {
      series = selection.append('g').attr('class', that.seriesName(true));
    }
    let ___append = function(selection, area) {
      let path = selection.selectAll('path' + className((area ? 'area' : 'line'), true))
      .data(d => [d])
      path.exit().remove();
      path.enter().append('path')
        .attr('class', className((area ? 'area' : 'line')))
        .call(__seriesInit, area)
        .merge(path, area)
        .call(__series, area)
        .style('pointer-events', 'none');
    }
    if(isArea) {
      series.call(___append, true);
    } else { // remove area
      series.selectAll('path' + className('area', true)).remove();
    }
    series.call(___append, false);
  }

  let __appendPoints = function (selection) {
    selection.attr('fill', d => d.color)
      .attr('stroke', d => d.color);
    let point = selection.selectAll(that.nodeName())
      .data(d =>  d.children , d => d.data.key)
    point.exit().remove();
    let pointEnter = point.enter().append('g')
      .attr('class', that.nodeName(true))
      .call(__local);
    pointEnter.append('circle')
      .call(__pointInit);
    pointEnter.append('text')
     .call(__labelInit);
    point.call(__local);
    point = pointEnter.merge(point)
      .call(__upward);
    point.select('circle')
     .call(__point);
    point.select('text')
      .call(__label)
  }
  let region = canvas.selectAll(this.regionName());
  region.each(function() {
    select(this).each(function(d) {
      d.children.sort((a,b) => xValue(a) - xValue(b));
    }).call(__appendSeries)
      .call(__appendPoints);
  });
}

export default _mark;